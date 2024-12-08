package middlewares

import (
	"api-docs-test-backend/errorhandler"

	"github.com/labstack/echo/v4"
)

// Panic data wrapper struct. Contains the message of panic and the stacktrace lines without modifying characters for pretty output.
type PanicData struct {
	Message    string
	StackTrace []string
}

// This function will override the default echo Recovery middleware logging method.
// It formats the message and stacktrace as human readable format, then call the custom logger.
func LogRecoveryData() func(c echo.Context, err error, stack []byte) error {
	return func(_ echo.Context, err error, _ []byte) error {
		// Recover if the following code cannot process or log the given error information.
		defer func() {
			if r := recover(); r != nil {

			}
		}()

		// Process panic data and parse it into a PanicData struct with panic error message

		cErr := errorhandler.GetWithOriginal(errorhandler.EC_UNKNOWN_ERROR, err)

		return cErr
	}
}
