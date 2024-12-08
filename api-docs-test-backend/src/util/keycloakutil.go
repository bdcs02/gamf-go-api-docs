package util

import (
	"strings"

	"api-docs-test-backend/packages/keycloak"

	"github.com/Nerzal/gocloak/v13"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

const AD_GROUP_NAMES = "adGroupNames"
const USERNAME = "preferred_username"

type KeyCloakTokenManager struct {
	Db *gorm.DB
}

func (cache *KeyCloakTokenManager) HandleNewToken(client *gocloak.GoCloak, token string) error {
	return nil
}

func HasUserGroupAccess(groups []string, groupName string) bool {
	for _, value := range groups {
		if value == groupName {
			return true
		}
	}

	return false
}

func ConvertInterfaceToStringArray(input []interface{}) []string {
	aString := make([]string, len(input))
	for i, v := range input {
		aString[i] = v.(string)
	}

	return aString
}

func GetJwtMessageFromAuthenticationToken(c echo.Context) (map[string]interface{}, error) {
	token := strings.Replace(c.Request().Header.Get("Authorization"), "Bearer ", "", 1)
	return keycloak.GetJwtMessage(token)
}
