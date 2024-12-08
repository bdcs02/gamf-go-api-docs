package filetests

import (
	contentTypes "api-docs-test-backend/contenttypes"
	"api-docs-test-backend/router"
	"fmt"
	"io"
	"os"

	goapidoc "goapidoc"

	"github.com/labstack/echo/v4"
)

func Init() {

	fileEndpoint := &goapidoc.Endpoint{
		Handler:      FileEndpoint,
		Permission:   "",
		Category:     "Fájl",
		Description:  "Byte array endpoint.",
		RequestData:  nil,
		ResponseData: "Test file for converting file to byte array.",
		ContentType:  echo.MIMETextPlain,
	}
	router.RegisterRoute("GET", "/file", fileEndpoint)

	imageEndpoint := &goapidoc.Endpoint{
		Handler:      ImageEndpoint,
		Permission:   "",
		Category:     "Fájl",
		Description:  "Byte array endpoint.",
		RequestData:  nil,
		ResponseData: []byte{},
		ContentType:  contentTypes.BYTE,
	}
	router.RegisterRoute("GET", "/image", imageEndpoint)

	uploadEndpoint := &goapidoc.Endpoint{
		Handler:      UploadEndpoint,
		Permission:   "",
		Category:     "Fájl",
		Description:  "Upload a selected file.",
		RequestData:  nil,
		ResponseData: []byte{},
		ContentType:  echo.MIMEMultipartForm,
	}
	router.RegisterRoute("POST", "/upload", uploadEndpoint)
}

func FileEndpoint(c echo.Context) error {
	return c.File("test_data/byte-array-viewer-test.txt")
}

func ImageEndpoint(c echo.Context) error {
	return c.File("test_data/images/placeholder.png")
}

func UploadEndpoint(c echo.Context) error {
	value, err := c.FormFile("test")
	if err != nil {
		fmt.Println(err)
		return err
	}
	file, _ := value.Open()
	defer file.Close()
	dst, err := os.Create(value.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, file); err != nil {
		return err
	}
	return c.JSON(200, value)
}
