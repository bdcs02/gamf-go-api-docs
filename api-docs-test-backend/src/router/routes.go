package router

import (
	"fmt"
	"strings"

	goapidoc "goapidoc"

	"github.com/labstack/echo/v4"
)

// store in global to avoid reinitialize overhead
var routeDefinitions = make(map[string]Route)

func SetupRoutes(e *echo.Echo) {
	for path, params := range routeDefinitions {
		pathElements := strings.Split(path, " ")
		var method string = pathElements[0]
		var url string = pathElements[1]

		e.Match([]string{method}, url, params.Handler)
	}
}

func RegisterRoute(method string, path string, endpoint *goapidoc.Endpoint) {
	key := fmt.Sprintf("%s %s", method, path)
	routeDefinitions[key] = Route{Handler: endpoint.Handler, Permission: endpoint.Permission}
	endpoint.Path = path
	endpoint.Method = method
	goapidoc.RegisterEndpoint(key, endpoint)
}

// get permissions for echo route
func GetPermissionForRoute(method string, path string) string {
	definitionKey := fmt.Sprintf("%s %s", method, path)
	routeDef, ok := routeDefinitions[definitionKey]
	if ok {
		return routeDef.Permission
	} else {
		return ""
	}
}

// Create key string for routes map from given context.
func CreateRouteKeyFromContext(ctx echo.Context) string {
	return fmt.Sprintf("%s %s", ctx.Request().Method, ctx.Path())
}

func GetRoutePermissionsMap() map[string]string {

	routePermissions := make(map[string]string)

	for path, params := range routeDefinitions {
		routePermissions[path] = params.Permission
	}

	return routePermissions
}
