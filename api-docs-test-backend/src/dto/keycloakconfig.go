package dto

type KeyCloakConfig struct {
	Url      string `json:"url"`
	Realm    string `json:"realm"`
	ClientId string `json:"clientId"`
}
