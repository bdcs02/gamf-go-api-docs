package logger

import (
	"bytes"
	"fmt"
	"log/slog"
	"math"
	"runtime"
	"strconv"
	"time"

	"github.com/alexeyco/simpletable"
	"github.com/logrusorgru/aurora/v4"
)

type LogTimer struct {
	caller string
	name   string
	start  time.Time
	end    *time.Time
	indent uint8
}

var timers map[uint64][]*LogTimer = make(map[uint64][]*LogTimer, 0)
var currentIndent = make(map[uint64]uint8)
var hasStopped = make(map[uint64]bool)

// Timer starts a timer with the given name.
// The timer is bound to the current goroutine id.
func Timer(timerName string) *LogTimer {
	if level.Level() == slog.LevelDebug {
		_, file, line, _ := runtime.Caller(2)
		currentIndent[getGID()] = currentIndent[getGID()] + 1
		lt := &LogTimer{caller: fmt.Sprintf("%s:%d", file, line), name: timerName, start: time.Now(), indent: currentIndent[getGID()]}
		timers[getGID()] = append(timers[getGID()], lt)
		return lt
	}

	return nil
}

// Stop stops the timer.
func (l *LogTimer) Stop() {
	if l != nil && level.Level() == slog.LevelDebug {
		currentIndent[getGID()] = currentIndent[getGID()] - 1
		now := time.Now()
		l.end = &now
	}
}

// PrintTimers prints the timer results of the current goroutine id.
func PrintTimers() {
	if level.Level() == slog.LevelDebug {
		table := simpletable.New()

		table.Header = &simpletable.Header{
			Cells: []*simpletable.Cell{
				{Align: simpletable.AlignCenter, Text: fmt.Sprintf("%s (id: %d)", "NAME", getGID())},
				{Align: simpletable.AlignCenter, Text: "TIME"},
			},
		}

		for i := 0; i < len(timers[getGID()]); i++ {

			// check if next has the same indentation
			intermediate := true
			if i < len(timers[getGID()])-1 {
				if timers[getGID()][i].indent != timers[getGID()][i+1].indent {
					intermediate = false
				}
			} else {
				intermediate = false
			}

			r := []*simpletable.Cell{
				{Text: timers[getGID()][i].getName(intermediate)},
				{Align: simpletable.AlignRight, Text: timers[getGID()][i].getTime()},
			}
			table.Body.Cells = append(table.Body.Cells, r)
		}

		table.SetStyle(simpletable.StyleUnicode)

		currentIndent[getGID()] = 0
		hasStopped[getGID()] = false
	}
}

func (l *LogTimer) getTime() string {
	if l.end == nil {
		hasStopped[getGID()] = true
		return aurora.Bold("STOPPED").Red().String()
	} else {
		return aurora.Bold(timeConverter(l.end.Sub(l.start))).Green().String()
	}
}

func (l *LogTimer) getName(intermediate bool) string {
	// offset indent to 0
	indent := l.indent - 1
	prefix := ""
	for i := uint8(0); i < indent; i++ {
		if i == indent-1 {
			if intermediate {
				prefix = prefix + "├─ "
			} else {
				prefix = prefix + "└─ "
			}

		} else {
			prefix = prefix + "⠀⠀⠀"
		}

	}

	return prefix + aurora.White(l.name).String()
}

func timeConverter(t time.Duration) string {
	elapsedTime := t.Nanoseconds()
	return divideTime(float64(elapsedTime), 0)
}

func divideTime(baseTime float64, level uint8) string {
	if baseTime > 1000 {
		level = level + 1
		return divideTime(baseTime/1000, level)
	} else {
		unit := ""
		switch level {
		case 0:
			unit = "ns"
		case 1:
			unit = "µs"
		case 2:
			unit = "ms"
		case 3:
			unit = "s"
		}

		return fmt.Sprintf("%.2f %s", math.Round(baseTime*100)/100, unit)
	}
}

func getGID() uint64 {
	b := make([]byte, 64)
	b = b[:runtime.Stack(b, false)]
	b = bytes.TrimPrefix(b, []byte("goroutine "))
	b = b[:bytes.IndexByte(b, ' ')]
	n, _ := strconv.ParseUint(string(b), 10, 64)
	return n
}
