package config

import (
	"api-docs-test-backend/packages/hash"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"io"
	"strings"
)

var key = "23o978fhakljbfflkjb398f92qifb"

func Encrypt(text string) (string, error) {

	gcmInstance, err := getGCM()
	if err != nil {
		return "", err
	}

	nonce := make([]byte, gcmInstance.NonceSize())
	_, _ = io.ReadFull(rand.Reader, nonce)

	cipheredText := gcmInstance.Seal(nonce, nonce, []byte(text), nil)
	encoded := base64.StdEncoding.EncodeToString(cipheredText)

	return fmt.Sprintf("ENC(%s)", encoded), nil
}

func Decrypt(text string) (string, error) {

	if !strings.Contains(text, "ENC(") {
		return text, nil
	}

	text = strings.ReplaceAll(text, "ENC(", "")
	text = strings.ReplaceAll(text, ")", "")

	var decoded []byte
	decoded, err := base64.StdEncoding.DecodeString(text)
	if err != nil {
		return "", err
	}

	gcmInstance, err := getGCM()
	if err != nil {
		return "", err
	}

	nonceSize := gcmInstance.NonceSize()
	nonce, cipheredText := decoded[:nonceSize], decoded[nonceSize:]

	originalText, err := gcmInstance.Open(nil, nonce, cipheredText, nil)
	if err != nil {
		return "", nil
	}

	return string(originalText), nil
}

func getGCM() (cipher.AEAD, error) {
	aesBlock, err := aes.NewCipher([]byte(hash.Sha256Hash(key)[:16]))
	if err != nil {
		return nil, err
	}

	gcmInstance, err := cipher.NewGCM(aesBlock)
	if err != nil {
		return nil, err
	}

	return gcmInstance, nil
}
