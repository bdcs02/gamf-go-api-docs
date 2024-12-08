package errorhandler

import (
	"bytes"
	"encoding/json"

	"github.com/go-errors/errors"
)

type CustomError struct {
	ErrorCode        int16  `json:"errorCode"`
	Message          string `json:"message"`
	OriginalMessage  string `json:"originalMessage,omitempty"`
	ErrorStackString string `json:"errorStackString,omitempty"`
	StatusCode       int16  `json:"statusCode,omitempty"`
}

// CustomError.Error interface implementation
func (ce *CustomError) Error() string {
	js, err := json.Marshal(ce)
	if err != nil {
		return ""
	}

	return string(js)
}

func (ce *CustomError) AddStack(e *errors.Error) {
	buf := bytes.Buffer{}

	for i := 1; i < len(e.StackFrames()); i++ {
		buf.WriteString(e.StackFrames()[i].String())

	}

	ce.ErrorStackString = buf.String()
}

// Setting zerovalue for fields not needed in echo rest response
func (ce *CustomError) CleanDataForRestResponse() {
	ce.OriginalMessage = ""
	ce.ErrorStackString = ""
	ce.StatusCode = 0
}
