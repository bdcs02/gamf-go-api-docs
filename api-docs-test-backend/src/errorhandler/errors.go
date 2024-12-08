package errorhandler

import (
	"net/http"

	"github.com/go-errors/errors"
)

var errorMap = make(map[ErrorCode]*CustomError)

func SetupErros() {
	errorMap[EC_UNKNOWN_ERROR] = &CustomError{StatusCode: http.StatusInternalServerError, Message: "Ismeretlen hiba"}
	errorMap[EC_ERRORHANDLER_ERROR] = &CustomError{StatusCode: http.StatusInternalServerError, Message: "Hiba történt a művelet végrehajtása közben"}
	errorMap[EC_INVALID_PAYLOAD] = &CustomError{StatusCode: http.StatusBadRequest, Message: "Hiba történt a művelet végrehajtása közben"}

	errorMap[EC_AUTH_ERROR] = &CustomError{StatusCode: http.StatusUnauthorized, Message: "Authentikációs hiba történt"}
	errorMap[EC_AUTH_NOT_ACTIVE_USER] = &CustomError{StatusCode: http.StatusForbidden, Message: "A felhasználó inaktív"}
	errorMap[EC_DUPLICATE_KEY_ERROR] = &CustomError{StatusCode: http.StatusBadRequest, Message: "Ilyen név már szerepel az adatbázisban"}

	errorMap[EC_FILE_PATH_NOT_FOUND] = &CustomError{StatusCode: http.StatusInternalServerError, Message: "A fájl nem található."}
	errorMap[EC_FILE_CONTENT_CORRUPTED] = &CustomError{StatusCode: http.StatusInternalServerError, Message: "A fájl tartalma nem olvasható."}
	errorMap[EC_FILE_IO_WHILE_READING] = &CustomError{StatusCode: http.StatusInternalServerError, Message: "Sikertelen fájlbeolvasás."}
}
func Get(errorCode ErrorCode) error {
	cError := errorMap[errorCode]
	if cError == nil {
		return errors.New("MISSING ERRORCODE")
	}

	cError.AddStack(errors.Errorf(cError.Message))
	cError.ErrorCode = errorCode.Get()

	return cError
}

func GetWithOriginal(errorCode ErrorCode, originalError interface{}) error {
	cError := errorMap[errorCode]
	if cError == nil {

		return errors.New("MISSING ERRORCODE")
	}

	cError.AddStack(errors.Errorf(cError.Message))
	cError.ErrorCode = errorCode.Get()

	if originalError != nil {
		if e, ok := originalError.(error); ok {
			cError.OriginalMessage = e.Error()
		} else if s, ok := originalError.(string); ok {
			cError.OriginalMessage = s
		} else {
		}
	}

	return cError
}
