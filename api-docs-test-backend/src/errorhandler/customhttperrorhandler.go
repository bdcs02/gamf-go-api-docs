package errorhandler

import (
	"encoding/json"
	"net/http"

	"github.com/labstack/echo/v4"
)

func CustomHTTPErrorHandler(restResponseError error, c echo.Context) {
	var cError CustomError
	err := json.Unmarshal([]byte(restResponseError.Error()), &cError)

	if err != nil {

		ce := CustomError{
			ErrorCode: EC_ERRORHANDLER_ERROR.Get(),
			Message:   errorMap[EC_ERRORHANDLER_ERROR].Message,
		}

		c.JSON(int(errorMap[EC_ERRORHANDLER_ERROR].StatusCode), ce)

		return
	}

	statusCode := http.StatusInternalServerError
	if cError.StatusCode != 0 {
		statusCode = int(cError.StatusCode)
	}

	cError.CleanDataForRestResponse()

	c.JSON(statusCode, cError)
}
