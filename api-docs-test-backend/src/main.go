package main

import (
	"api-docs-test-backend/configuration"
	"api-docs-test-backend/errorhandler"
	bytearrayviewer "api-docs-test-backend/handlers/byte-array-viewer"
	"api-docs-test-backend/handlers/filetests"
	"api-docs-test-backend/handlers/login"
	"api-docs-test-backend/handlers/structmapper"
	"api-docs-test-backend/handlers/system"
	textviewer "api-docs-test-backend/handlers/test"
	xmlviewer "api-docs-test-backend/handlers/xml-viewer"
	"api-docs-test-backend/middlewares"
	"api-docs-test-backend/router"
	customvalidator "api-docs-test-backend/validator"
	"fmt"

	"api-docs-test-backend/packages/config"
	"api-docs-test-backend/packages/keycloak"

	goapidoc "goapidoc"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	// Init handlers
	login.Init()
	system.Init()
	xmlviewer.Init()
	textviewer.Init()
	bytearrayviewer.Init()
	filetests.Init()
	configuration.InitConfiguration()
	structmapper.Init()

	port := config.GetConfig().GetInt("server.port")

	e := echo.New()
	//e.Debug = true
	e.HTTPErrorHandler = errorhandler.CustomHTTPErrorHandler

	v := validator.New()
	e.Validator = &customvalidator.CustomValidator{Validator: v}

	e.Use(middlewares.PermissionCheck)
	e.Use(middleware.Logger())
	e.Use(middleware.RecoverWithConfig(middleware.RecoverConfig{LogErrorFunc: middlewares.LogRecoveryData()}))

	frontendConfig := keycloak.GetFrontendConfig()
	goapidoc.InitWithConfig(&goapidoc.Config{
		Enabled:            config.GetConfig().GetBool("apidoc.enabled"),
		UseEmbedFile:       config.GetConfig().GetBool("apidoc.enableEmbeddedFile"),
		ExtractDestination: "./",
		UseProxy:           config.GetConfig().GetBool("apidoc.useProxy"),
		AppName:            config.GetConfig().GetString("apidoc.appname"),
		Keycloak: &goapidoc.KeycloakConfig{
			Url:      frontendConfig.Url,
			Realm:    frontendConfig.Realm,
			ClientId: frontendConfig.ClientId,
		}}, e)

	router.SetupRoutes(e)
	errorhandler.SetupErros()

	e.ListenerNetwork = "tcp4"
	e.Logger.Fatal(e.Start(fmt.Sprintf("%s:%d", "", port)))
}
