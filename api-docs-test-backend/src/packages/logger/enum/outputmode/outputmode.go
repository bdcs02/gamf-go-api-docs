package outputmode

import "strings"

type OutputMode int8

const (
	Sysout OutputMode = iota
	File
)

var modesByName = map[string]OutputMode{
	"sysout": Sysout,
	"file":   File,
}

// lowercase conversion builtin
func GetByName(name string) OutputMode {
	return modesByName[strings.ToLower(name)]
}
