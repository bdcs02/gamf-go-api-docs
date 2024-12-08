package util

import (
	"crypto/rand"
	"fmt"
)

func GenerateRandomString(length int) string {
	b := make([]byte, length)
	rand.Read(b)
	return fmt.Sprintf("%x", b)[:length]
}
