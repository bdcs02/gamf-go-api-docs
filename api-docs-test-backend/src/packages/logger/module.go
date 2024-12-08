// Package logger handles logging functionality to stdout.
package logger

import (
	"api-docs-test-backend/packages/logger/enum/loglevel"
	"api-docs-test-backend/packages/logger/enum/outputmode"
	"fmt"
	"log"
	"log/slog"
	"os"
	"regexp"

	"github.com/pkg/errors"
)

type Config struct {
	SyslogEnabled           bool
	SyslogURL               string
	SyslogTransportProtocol string
	SyslogTag               string
	SyslogSeverity          int
	SyslogFacility          int
	Formatted               bool
	LogMode                 string // sysout/file
	LogFilePath             string
	LogLevel                string // INFO/DEBUG
}

type Options struct {
	OverrideRuntimeLevel int
	OverrideFilePath     string
}

var DefaultLoggerConfig = Config{
	SyslogEnabled:  false,
	SyslogSeverity: 7,
	SyslogFacility: 0,
	Formatted:      true,
	LogMode:        "sysout",
	LogLevel:       "INFO",
}

var level = new(slog.LevelVar)
var slogger *slog.Logger

var config Config
var singleLineRegExp = regexp.MustCompile(`(\r)|(\n)|(\t)|(\v)|(\f)`)
var formatted = false

var mode outputmode.OutputMode
var logFile *os.File

const runtimeCallerLevel = 2

func DefaultConfig() {
	WithConfig(DefaultLoggerConfig)
}

// Init initializes logger module.
func WithConfig(cfg Config) {
	config = cfg
	// file mode and formatting are mutually exclusive
	formatted = config.Formatted
	mode = outputmode.GetByName(config.LogMode)
	level.Set(loglevel.GetSlogLevel(config.LogLevel))

	if !formatted {
		if mode == outputmode.File {
			logFile, logFileErr := initLogFile()
			if logFileErr != nil {
				panic(logFileErr)
			}

			slogger = slog.New(slog.NewTextHandler(logFile, &slog.HandlerOptions{Level: level}))
		} else {
			slogger = slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: level}))
		}

		slog.SetDefault(slogger)
	}

	log.SetFlags(log.Ldate | log.Ltime | log.Lmicroseconds)
	initColorizer()
}

// Create connection to syslog server with the loaded configuration values.
func initLogFile() (*os.File, error) {
	logFilePath := config.LogFilePath
	if len(logFilePath) == 0 {
		return nil, fmt.Errorf("cannot use file mode without configured path")
	}

	var initErr error
	logFile, initErr = os.OpenFile(logFilePath, os.O_APPEND|os.O_RDWR|os.O_CREATE, 0644)
	if initErr != nil {
		return nil, errors.Errorf("%s:%s", "cannot open configured logfile", initErr.Error())
	}

	return logFile, nil
}

func CloseLogFile() error {
	if logFile == nil || mode != outputmode.File {
		return nil
	}

	if err := logFile.Close(); err != nil {
		return errors.Errorf("%s:%s", "failed to close logfile", err.Error())
	}

	return nil
}

func Opts(opts Options) *Options {
	return &opts
}
