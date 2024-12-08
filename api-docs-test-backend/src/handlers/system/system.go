package system

import (
	"api-docs-test-backend/configuration"
	contentTypes "api-docs-test-backend/contenttypes"
	"api-docs-test-backend/router"
	"net/http"

	"api-docs-test-backend/packages/config"
	"api-docs-test-backend/packages/keycloak"

	goapidoc "goapidoc"

	"github.com/labstack/echo/v4"
)

func Init() {
	sessionEndpoint := &goapidoc.Endpoint{
		Handler:     GetKeyCloakConfig,
		Category:    "System",
		Permission:  "",
		Description: "Get keycloak related configurations, needed for frontend.",
		RequestData: nil,
		ResponseData: &configuration.KeyCloakConfiguration{
			KeycloakFrontendConfig: &keycloak.KeyCloakFrontendConfig{
				Url:      "https://keycloak.ibc",
				Realm:    "test",
				ClientId: "test-frontend",
			},
			UserGroupName: "api-docs-user",
		},
		ContentType: contentTypes.JSON,
	}
	router.RegisterRoute("GET", "/keycloak/config", sessionEndpoint)
}

func GetKeyCloakConfig(c echo.Context) error {
	var keycloakConfig configuration.KeyCloakConfiguration
	keycloakConfig.KeycloakFrontendConfig = keycloak.GetFrontendConfig()
	keycloakConfig.UserGroupName = config.GetConfig().GetString("keycloak.userGroup")

	return c.JSON(http.StatusOK, keycloakConfig)
}
