package goapidoc

import (
	"archive/zip"
	"bytes"
	_ "embed"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"

	"github.com/labstack/echo/v4"
)

//go:embed apidoc.zip
var embedFile []byte

type ResponseType struct {
	StatusCode  int    `json:"statusCode"`
	Description string `json:"description"`
}

type Config struct {
	Enabled            bool
	UseEmbedFile       bool
	ExtractDestination string
	AppName            string
	UiPath             string
	UseProxy           bool
	Keycloak           *KeycloakConfig
	ExamplePath        string
}

type KeycloakConfig struct {
	Url      string `json:"url"`
	Realm    string `json:"realm"`
	ClientId string `json:"clientId"`
}

type EndpointData struct {
	Endpoints []*Endpoint     `json:"endpoints"`
	Appname   string          `json:"appname"`
	UseProxy  bool            `json:"useProxy"`
	KeyCloak  *KeycloakConfig `json:"keycloak"`
}

type EndpointRequestDto struct {
	Method string `json:"method"`
	Path   string `json:"path"`
}

type CustomError struct {
	ErrorCode int16  `json:"errorCode"`
	Message   string `json:"message"`
}

func InitWithConfig(cfg *Config, e *echo.Echo) {
	if cfg.Enabled {
		if cfg.UseEmbedFile {
			ExtractEmbedFile(cfg.ExtractDestination)
		} else {
			embedFile = nil
		}

		if cfg.UiPath == "" {
			cfg.UiPath = "apidoc"
		}

		endpointPrefix := ""

		if !cfg.UseProxy {
			endpointPrefix = "/api"
		}

		examplePath = cfg.ExamplePath

		e.GET(fmt.Sprintf("%s/apidoc/data", endpointPrefix), func(c echo.Context) error {
			var endpointSlice = Values(endpoints)
			sort.Slice(endpointSlice, func(i, j int) bool {
				if endpointSlice[i].Category != endpointSlice[j].Category {
					return endpointSlice[i].Category < endpointSlice[j].Category
				}
				if endpointSlice[i].Path != endpointSlice[j].Path {
					return endpointSlice[i].Path < endpointSlice[j].Path
				}
				return endpointSlice[i].Method < endpointSlice[j].Method

			})
			return c.JSON(http.StatusOK, EndpointData{Endpoints: endpointSlice, Appname: cfg.AppName, KeyCloak: cfg.Keycloak, UseProxy: cfg.UseProxy})
		})

		e.POST(fmt.Sprintf("%s/apidoc/endpoint", endpointPrefix), func(c echo.Context) error {
			var request *EndpointRequestDto
			err := c.Bind(&request)

			if err != nil {
				return c.JSON(http.StatusBadRequest, &CustomError{ErrorCode: 10000, Message: "failed to bind request data"})
			}

			key := fmt.Sprintf("%s %s", request.Method, request.Path)
			c.Response().Header().Add("Content-Disposition", "attachment; filename=*=UTF-8''getFileName")
			c.Response().Header().Add("Use-Proxy", strconv.FormatBool(cfg.UseProxy))
			return c.JSON(http.StatusOK, endpoints[key])
		})

		e.Static(fmt.Sprintf("%s/apidoc/ui/", endpointPrefix), cfg.UiPath)
	}
}

func ExtractEmbedFile(ExtractDestination string) error {
	zipReader, err := zip.NewReader(bytes.NewReader(embedFile), int64(len(embedFile)))
	if err != nil {
		return err
	}

	for _, file := range zipReader.File {
		filePath := filepath.Join(ExtractDestination, file.Name)

		if file.FileInfo().IsDir() {
			os.MkdirAll(filePath, os.ModePerm)
			continue
		}

		if err := os.MkdirAll(filepath.Dir(filePath), os.ModePerm); err != nil {
			panic(fmt.Errorf("new directory can't be created, error: %v", err))
		}

		destinationFile, err := os.OpenFile(filePath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, file.Mode())
		if err != nil {
			panic(fmt.Errorf("new file can't be created, error: %v", err))
		}

		fileInArchive, err := file.Open()
		if err != nil {
			panic(fmt.Errorf("zipped file can't be opened, error: %v", err))
		}

		if _, err := io.Copy(destinationFile, fileInArchive); err != nil {
			panic(fmt.Errorf("zipped file can't be extracted, error: %v", err))
		}

		destinationFile.Close()
		fileInArchive.Close()
	}
	return nil
}
