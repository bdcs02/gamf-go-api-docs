package middlewares

import (
	"api-docs-test-backend/errorhandler"
	"api-docs-test-backend/util"
	"errors"
	"fmt"
	"strings"

	"api-docs-test-backend/packages/config"
	"api-docs-test-backend/packages/keycloak"

	"github.com/labstack/echo/v4"
)

func PermissionCheck(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {

		// do not check permission on the following paths
		useProxy := config.GetConfig().GetBool("apidoc.useProxy")
		apidocPrefix := ""

		if !useProxy {
			apidocPrefix = "/api"
		}

		if strings.HasPrefix(c.Path(), "/logout") || strings.HasPrefix(c.Path(), fmt.Sprintf("%s/apidoc", apidocPrefix)) || strings.HasPrefix(c.Path(), "/keycloak/config") {
			return next(c)
		}

		token := strings.Replace(c.Request().Header.Get("Authorization"), "Bearer ", "", 1)

		if token == "" {
			return errorhandler.GetWithOriginal(errorhandler.EC_AUTH_ERROR, errors.New("unauthorized"))
		}

		session, err := keycloak.IntrospectToken(token, &util.KeyCloakTokenManager{Db: nil})

		if err != nil {
			return errorhandler.GetWithOriginal(errorhandler.EC_INVALID_PAYLOAD, err)
		}

		if session.Active != nil && !*session.Active {
			return errorhandler.GetWithOriginal(errorhandler.EC_AUTH_NOT_ACTIVE_USER, err)
		}

		return next(c)
	}
}
