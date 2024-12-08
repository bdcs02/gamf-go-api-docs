package login

import (
	"api-docs-test-backend/configuration"
	contentTypes "api-docs-test-backend/contenttypes"
	"api-docs-test-backend/dto"
	"api-docs-test-backend/errorhandler"
	"api-docs-test-backend/packages/keycloak"
	"api-docs-test-backend/router"
	"context"
	"fmt"
	"net/http"
	"strings"

	goapidoc "goapidoc"

	"github.com/labstack/echo/v4"
)

const telemetryPackage = "handlers/login"

func Init() {
	sessionEndpoint := &goapidoc.Endpoint{
		Handler:     GetSession,
		Category:    "Authentication",
		Permission:  "",
		Description: "Gets session data for authenticated user. If the user is unauthenticated, an empty session data will be returned.",
		RequestData: nil,
		ResponseData: &dto.SessionDto{
			Name: "API DOCS TEST USER",
		},
		ContentType: contentTypes.JSON,
	}
	router.RegisterRoute("GET", "/session", sessionEndpoint)

	logoutEndpoint := &goapidoc.Endpoint{
		Handler:      Logout,
		Category:     "Authentication",
		Permission:   "",
		Description:  "Remove session data from cookies.",
		RequestData:  nil,
		ResponseData: nil,
		ContentType:  contentTypes.NULL,
	}

	router.RegisterRoute("GET", "/logout", logoutEndpoint)
}

func Logout(c echo.Context) error {
	token := strings.Replace(c.Request().Header.Get("Authorization"), "Bearer ", "", 1)
	configuration.GetRedisClient().Del(context.Background(), token)

	return c.NoContent(http.StatusOK)
}

func GetSession(c echo.Context) error {
	t := strings.Replace(c.Request().Header.Get("Authorization"), "Bearer ", "", 1)
	if t == "" {
		return c.JSON(http.StatusOK, &dto.SessionDto{Name: ""})
	}
	jwtMessage, err := keycloak.GetJwtMessage(t)

	if err != nil {
		return errorhandler.GetWithOriginal(errorhandler.EC_INVALID_PAYLOAD, err)
	}

	name := fmt.Sprintf("%s %s", jwtMessage["family_name"].(string), jwtMessage["given_name"].(string))

	return c.JSON(http.StatusOK, &dto.SessionDto{Name: name})
}
