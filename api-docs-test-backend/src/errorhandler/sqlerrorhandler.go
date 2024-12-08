package errorhandler

import (
	"github.com/go-sql-driver/mysql"
)

const (
	DUPLICATED_KEY_ENTRY = 1062
)

/*
This function maps SQL error codes with the built-in Custom error codes
If it is not an SQL error than returns nil, and let the caller manage
the problem
*/
func GetCustomErrorBySQLString(err error) (interface{}, error) {
	if mysqlErr, ok := err.(*mysql.MySQLError); ok {
		var errCode ErrorCode
		switch mysqlErr.Number {
		case 1062:

			errCode = EC_DUPLICATE_KEY_ERROR
		default:

		}

		return nil, GetWithOriginal(errCode, err)
	}

	return nil, nil
}

func GetSqlErrorCode(err error) uint16 {
	if mysqlErr, ok := err.(*mysql.MySQLError); ok {
		return mysqlErr.Number
	}

	return 0
}

func GetSqlErrorMessage(err error) string {
	if mysqlErr, ok := err.(*mysql.MySQLError); ok {
		return mysqlErr.Message
	}

	return ""
}
