package router

import (
	"github.com/labstack/echo/v4"
)

type LogHandler func(echo.Context, []byte, []byte)

type RateLimitType string

type Route struct {
	Permission   string
	Description string
	Handler      echo.HandlerFunc
	RequestData  interface{}
	ResponseData interface{}
}
