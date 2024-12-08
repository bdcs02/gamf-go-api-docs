package loglevel

import (
	"log/slog"
	"strings"
)

type LogLevel int8

const (
	DEBUG = slog.LevelDebug
	INFO  = slog.LevelInfo
)

var modesByName = map[string]slog.Level{
	"DEBUG": DEBUG,
	"INFO":  INFO,
}

func GetSlogLevel(level string) slog.Level {
	return modesByName[strings.ToUpper(level)]
}
