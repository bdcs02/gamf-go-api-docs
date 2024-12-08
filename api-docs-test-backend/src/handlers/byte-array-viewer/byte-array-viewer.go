package bytearrayviewer

import (
	contentTypes "api-docs-test-backend/contenttypes"
	"api-docs-test-backend/errorhandler"
	"api-docs-test-backend/router"
	"bufio"
	"io"
	"net/http"
	"os"

	goapidoc "goapidoc"

	"github.com/labstack/echo/v4"
)

func Init() {

	byteArrayEndpoint := &goapidoc.Endpoint{
		Handler:      ByteArrayEndpoint,
		Category:     "File download",
		Permission:   "",
		Description:  "Byte array endpoint.",
		RequestData:  []byte{},
		ResponseData: nil,
		ContentType:  contentTypes.BYTE,
	}
	router.RegisterRoute("GET", "/viewer/byte", byteArrayEndpoint)

}

func ByteArrayEndpoint(c echo.Context) error {
	file, err := os.Open("test_data/byte-array-viewer-test.txt")
	if err != nil {
		return errorhandler.GetWithOriginal(errorhandler.ErrorCode(errorhandler.EC_FILE_PATH_NOT_FOUND), err)
	}
	defer file.Close()

	stat, err := file.Stat()
	if err != nil {
		return errorhandler.GetWithOriginal(errorhandler.ErrorCode(errorhandler.EC_FILE_CONTENT_CORRUPTED), err)
	}

	bs := make([]byte, stat.Size())
	_, err = bufio.NewReader(file).Read(bs)
	if err != nil && err != io.EOF {
		return errorhandler.GetWithOriginal(errorhandler.ErrorCode(errorhandler.EC_FILE_IO_WHILE_READING), err)
	}
	return c.Blob(http.StatusOK, contentTypes.BYTE, bs)
}
