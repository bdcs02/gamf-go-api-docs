package keycloak

import (
	"context"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/Nerzal/gocloak/v13"
	"github.com/redis/go-redis/v9"
)

type Logger interface {
	Debug(message string, params ...interface{})
	Info(message string, params ...interface{})
	Error(message string, params ...interface{})
}

type KeyCloakConfiguration struct {
	ClientId         string
	Secret           string
	Realm            string
	HostName         string
	Debug            bool
	TlsSkip          bool
	CertPath         string
	KeyPath          string
	RedisClient      *redis.Client
	SessionTtl       int
	FrontendClientId string
	Logger           Logger
}

type KeyCloakFrontendConfig struct {
	Url      string `json:"url"`
	Realm    string `json:"realm"`
	ClientId string `json:"clientId"`
}

var (
	config *KeyCloakConfiguration
	client *gocloak.GoCloak
)

type TokenManager interface {
	HandleNewToken(client *gocloak.GoCloak, token string) error
}

func WithConfig(cfg *KeyCloakConfiguration) error {
	config = cfg

	client = gocloak.NewClient(cfg.HostName)
	client.RestyClient().SetDebug(cfg.Debug)

	client.RestyClient().SetTLSClientConfig(&tls.Config{InsecureSkipVerify: cfg.TlsSkip})

	if !cfg.TlsSkip {
		if cfg.CertPath != "" && cfg.KeyPath != "" {
			tlsCert, err := tls.LoadX509KeyPair(cfg.CertPath, cfg.KeyPath)
			if err != nil {
				return fmt.Errorf("cannot load keycloak tls cert or key")
			}

			tlsConfig := &tls.Config{
				InsecureSkipVerify: cfg.TlsSkip,
			}

			tlsConfig.Certificates = []tls.Certificate{tlsCert}
			client.RestyClient().SetTLSClientConfig(tlsConfig)
		} else {
			return fmt.Errorf("missing keycloak tls cert or key")
		}
	}

	return nil
}

func IntrospectToken(token string, tokenManager TokenManager) (*gocloak.IntroSpectTokenResult, error) {
	var session *gocloak.IntroSpectTokenResult
	if config.RedisClient == nil {
		newSession, err := client.RetrospectToken(
			context.Background(),
			token,
			config.ClientId,
			config.Secret,
			config.Realm)

		if err != nil {
			return nil, err
		}

		err = tokenManager.HandleNewToken(client, token)

		return newSession, err
	}

	result, err := config.RedisClient.Get(context.Background(), token).Result()
	if err == redis.Nil {
		newSession, err := client.RetrospectToken(
			context.Background(),
			token,
			config.ClientId,
			config.Secret,
			config.Realm)

		if err != nil {
			return nil, err
		}

		err = tokenManager.HandleNewToken(client, token)
		b, err := json.Marshal(newSession)
		if err != nil {
			return nil, err
		}

		config.RedisClient.Set(context.Background(), token, b, time.Duration(config.SessionTtl)*time.Minute)

		return newSession, nil
	} else if err != nil {
		config.Logger.Error("failed to get cache data from redis: %v", err)

		newSession, err := client.RetrospectToken(
			context.Background(),
			token,
			config.ClientId,
			config.Secret,
			config.Realm)

		if err != nil {
			return nil, err
		}

		err = tokenManager.HandleNewToken(client, token)

		return newSession, err
	} else {
		err := json.Unmarshal([]byte(result), &session)
		if err != nil {
			return nil, err
		}
	}

	return session, nil
}

func GetJwtMessage(jwt string) (map[string]interface{}, error) {
	// parse jwt, get userid
	jwtElements := strings.Split(jwt, ".")
	if len(jwtElements) == 3 {
		jwtPayload := jwtElements[1]
		decodedPayload, err := base64.StdEncoding.WithPadding(base64.NoPadding).DecodeString(jwtPayload)
		if err != nil {
			// invalid token
			return nil, errors.New("invalid token")
		}

		var data map[string]interface{}
		if err := json.Unmarshal(decodedPayload, &data); err != nil {
			return nil, err
		}

		return data, nil
	} else {
		// invalid token
		return nil, errors.New("invalid token")
	}
}

func GetFrontendConfig() *KeyCloakFrontendConfig {
	return &KeyCloakFrontendConfig{
		Url:      config.HostName,
		Realm:    config.Realm,
		ClientId: config.FrontendClientId,
	}
}

func GetConfig() *KeyCloakConfiguration {
	return config
}
