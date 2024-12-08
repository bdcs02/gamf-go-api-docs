package configuration

import (
	"api-docs-test-backend/packages/config"
	"api-docs-test-backend/packages/keycloak"
	"api-docs-test-backend/packages/logger"
	"context"

	"github.com/redis/go-redis/v9"
)

type LogImpl struct{}

func (l LogImpl) Error(message string, params ...interface{}) {
	logger.Opts(logger.Options{OverrideRuntimeLevel: 3})
}

func (l LogImpl) Debug(message string, params ...interface{}) {
	logger.Opts(logger.Options{OverrideRuntimeLevel: 3})
}

func (l LogImpl) Info(message string, params ...interface{}) {
	logger.Opts(logger.Options{OverrideRuntimeLevel: 3})
}

var loggerImpl LogImpl

type KeyCloakConfiguration struct {
	KeycloakFrontendConfig *keycloak.KeyCloakFrontendConfig `json:"keycloakFrontendConfig"`
	UserGroupName          string                           `json:"userGroupName"`
}

var redisClient *redis.Client
var ctx context.Context

func InitConfiguration() {
	config.Init()

	logger.WithConfig(logger.Config{
		SyslogEnabled: false,
		Formatted:     false,
		LogMode:       "sysout",
		LogFilePath:   "",
		LogLevel:      config.GetConfig().GetString("log.level"),
	})

	if config.GetConfig().GetBool("redis.enabled") {

		redisClient = redis.NewClient(&redis.Options{
			Addr:     config.GetConfig().GetString("redis.url"),
			Password: config.GetConfig().GetString("redis.password"),
			DB:       0,
		})
	}

	ctx = context.Background()

	err := keycloak.WithConfig(&keycloak.KeyCloakConfiguration{
		ClientId:         config.GetConfig().GetString("keycloak.clientId"),
		Secret:           config.GetConfig().GetString("keycloak.secret"),
		Realm:            config.GetConfig().GetString("keycloak.realm"),
		HostName:         config.GetConfig().GetString("keycloak.hostname"),
		CertPath:         config.GetConfig().GetString("keycloak.certPath"),
		KeyPath:          config.GetConfig().GetString("keycloak.keyPath"),
		FrontendClientId: config.GetConfig().GetString("keycloak.frontend.clientId"),
		SessionTtl:       config.GetConfig().GetInt("keycloak.frontend.sessionTtl"),
		TlsSkip:          config.GetConfig().GetBool("keycloak.insecureSkipVerify"),
		Debug:            config.GetConfig().GetBool("keycloak.debug"),
		RedisClient:      redisClient,
		Logger:           loggerImpl,
	})

	if err != nil {
		panic(err)
	}
}

func GetRedisClient() *redis.Client {
	return redisClient
}

func GetContext() context.Context {
	return ctx
}
