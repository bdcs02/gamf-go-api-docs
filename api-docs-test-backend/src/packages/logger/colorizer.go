package logger

import (
	"log/slog"

	"github.com/logrusorgru/aurora/v4"
)

type ColorFunc func(string) aurora.Value

var colorizer map[slog.Level]ColorFunc

func initColorizer() {
	colorizer = map[slog.Level]ColorFunc{
		slog.LevelInfo:  func(t string) aurora.Value { return aurora.White(t) },
		slog.LevelDebug: func(t string) aurora.Value { return aurora.BrightBlue(t) },
		slog.LevelError: func(t string) aurora.Value { return aurora.Red(t) },
		slog.LevelWarn:  func(t string) aurora.Value { return aurora.Yellow(t) },
	}
}
