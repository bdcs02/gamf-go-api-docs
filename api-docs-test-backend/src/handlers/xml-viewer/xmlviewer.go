package xmlviewer

import (
	contentTypes "api-docs-test-backend/contenttypes"
	"api-docs-test-backend/router"
	"net/http"

	goapidoc "goapidoc"

	"github.com/labstack/echo/v4"
)

func Init() {
	xmlViewerEndpoint := &goapidoc.Endpoint{
		Handler:      XMLViewer,
		Category:     "File download",
		Permission:   "",
		Description:  "XML-viewer endpoint.",
		RequestData:  nil,
		ResponseData: nil,
		ContentType:  contentTypes.XML,
	}
	router.RegisterRoute("GET", "/viewer/xml", xmlViewerEndpoint)
}

type TestXmlUser struct {
	Name  string
	Email string
	Age   int16
	City  string
}

func XMLViewer(c echo.Context) error {
	testUserXml := &TestXmlUser{
		Name:  "Test User",
		Email: "testuser@email.com",
		Age:   22,
		City:  "Kecskemét",
	}
	return c.XMLPretty(http.StatusOK, testUserXml, "  ")
}
