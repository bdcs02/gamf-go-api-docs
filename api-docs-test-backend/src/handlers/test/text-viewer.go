package textviewer

import (
	contentTypes "api-docs-test-backend/contenttypes"
	"api-docs-test-backend/router"
	"net/http"

	goapidoc "goapidoc"

	"github.com/labstack/echo/v4"
)

func Init() {
	textEndpointGET := &goapidoc.Endpoint{
		Handler:      ReturnATextGET,
		Category:     "Test",
		Permission:   "",
		Description:  "",
		RequestData:  nil,
		ResponseData: "Teszt szöveg",
		ContentType:  contentTypes.TEXT,
	}
	router.RegisterRoute("GET", "/text", textEndpointGET)

	textEndpointPOST := &goapidoc.Endpoint{
		Handler:      ReturnATextPOST,
		Category:     "Test",
		Permission:   "",
		Description:  "",
		RequestData:  nil,
		ResponseData: "Teszt szöveg",
		ContentType:  contentTypes.TEXT,
	}
	router.RegisterRoute("POST", "/text", textEndpointPOST)

	textEndpointPUT := &goapidoc.Endpoint{
		Handler:      ReturnATextPUT,
		Category:     "Test",
		Permission:   "",
		Description:  "",
		RequestData:  nil,
		ResponseData: "Teszt szöveg",
		ContentType:  contentTypes.TEXT,
	}
	router.RegisterRoute("PUT", "/text", textEndpointPUT)

	textEndpointdelete := &goapidoc.Endpoint{
		Handler:      ReturnATextDELETE,
		Category:     "Test",
		Permission:   "",
		Description:  "",
		RequestData:  nil,
		ResponseData: "Teszt szöveg",
		ContentType:  contentTypes.TEXT,
	}
	router.RegisterRoute("DELETE", "/text", textEndpointdelete)
}

func ReturnATextGET(c echo.Context) error {
	return c.String(http.StatusOK, "Teszt szöveg")
}

func ReturnATextPOST(c echo.Context) error {
	return c.String(http.StatusOK, "Teszt szöveg")
}

func ReturnATextPUT(c echo.Context) error {
	return c.String(http.StatusOK, "Teszt szöveg")
}

func ReturnATextDELETE(c echo.Context) error {
	return c.String(http.StatusOK, "Teszt szöveg")
}
