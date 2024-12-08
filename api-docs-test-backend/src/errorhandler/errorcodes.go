package errorhandler

type ErrorCode int16

var (
	EC_UNKNOWN_ERROR      ErrorCode = 1000
	EC_ERRORHANDLER_ERROR ErrorCode = 1001
	EC_INVALID_PAYLOAD    ErrorCode = 1002

	EC_AUTH_ERROR           ErrorCode = 1003
	EC_AUTH_NOT_ACTIVE_USER ErrorCode = 1004

	EC_DUPLICATE_KEY_ERROR ErrorCode = 1005

	EC_FILE_PATH_NOT_FOUND ErrorCode = 1006

	EC_FILE_CONTENT_CORRUPTED ErrorCode = 1007
	EC_FILE_IO_WHILE_READING  ErrorCode = 1008
)

func (ec ErrorCode) Get() int16 {
	return int16(ec)
}
