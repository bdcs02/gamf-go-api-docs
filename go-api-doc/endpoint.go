package goapidoc

import (
	"encoding/json"
	"fmt"
	"reflect"
	"strings"

	echo "github.com/labstack/echo/v4"
)

type Endpoint struct {
	Path            string           `json:"path"`
	Method          string           `json:"method"`
	Category        string           `json:"category"`
	Permission      string           `json:"permission"`
	Description     string           `json:"description"`
	RequestData     interface{}      `json:"requestData"`
	RequestType     *FieldMap        `json:"requestType"`
	RequestMapping  *[]FieldMap      `json:"requestMapping"`
	Response        []ResponseType   `json:"response"`
	ResponseData    interface{}      `json:"responseData"`
	ResponseType    *FieldMap        `json:"responseType"`
	ResponseMapping *[]FieldMap      `json:"responseMapping"`
	ContentType     string           `json:"contentType"`
	Handler         echo.HandlerFunc `json:"-"`
}

type EndpointPath string

var endpoints = make(map[string]*Endpoint, 0)

func RegisterEndpoint(path string, endpoint *Endpoint) {
	request := reflect.TypeOf(endpoint.RequestData)
	response := reflect.TypeOf(endpoint.ResponseData)
	endpoint.RequestMapping = MapRequest(request)
	endpoint.ResponseMapping = MapRequest(response)
	endpoint.RequestType = GetObjectType(request)
	endpoint.ResponseType = GetObjectType(response)

	endpoints[path] = endpoint
}

func (e EndpointPath) GetMethod() string {
	return strings.Split(fmt.Sprintf("%v", e), " ")[0]
}

func (e EndpointPath) GetPath() string {
	return strings.Split(fmt.Sprintf("%v", e), " ")[1]
}

func (e Endpoint) GetRequestAsJson() string {
	request, _ := json.MarshalIndent(e.RequestData, "", "    ")

	return string(request)
}

func (e Endpoint) GetResponseAsJson() string {
	response, _ := json.MarshalIndent(e.ResponseData, "", "    ")

	return string(response)
}
