package hash

import (
	"crypto/sha256"
	"crypto/sha512"
	"fmt"
)

func Sha256Hash(plain string) string {
	h := sha256.New()
	h.Write([]byte(plain))
	sum := h.Sum(nil)
	return fmt.Sprintf("%x", sum)
}

func Sha512Hash(plain string) string {
	h := sha512.New()
	h.Write([]byte(plain))
	sum := h.Sum(nil)
	return fmt.Sprintf("%x", sum)
}
