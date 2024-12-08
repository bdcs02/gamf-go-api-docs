package config

import (
	"flag"
	"fmt"
	"reflect"
	"strings"

	"github.com/spf13/viper"
)

var (
	cfg *viper.Viper
)

func GetConfig() *viper.Viper {
	return cfg
}

func Init() {
	var env = flag.String("env", "", "custom environment yml file")
	flag.Parse()

	// load main config
	cfg = loadConfig("config")

	// load and merge env config if set as flag
	if *env != "" {
		envConfig := loadConfig(*env)
		for _, key := range envConfig.AllKeys() {
			cfg.Set(key, envConfig.Get(key))
		}
	}

	// bind ENVS to config keys to allow override
	for _, key := range cfg.AllKeys() {
		cfg.BindEnv(key, strings.ToUpper(strings.ReplaceAll(key, ".", "_")))
	}

	// find and decrpyt ENC() values
	for _, key := range cfg.AllKeys() {
		value := cfg.Get(key)

		if reflect.TypeOf(value).Kind() == reflect.String {
			if strings.Contains(value.(string), "ENC(") {
				decrypted, err := Decrypt(value.(string))
				if err != nil {
					panic(err)
				}
				cfg.Set(key, decrypted)
			}
		}
	}
}

func Parse(configStruct any) error {
	err := cfg.Unmarshal(&configStruct)
	if err != nil {
		panic(err)
	}

	return nil
}

func loadConfig(name string) *viper.Viper {
	v := viper.New()

	v.AutomaticEnv()
	v.SetConfigName(name)
	v.SetConfigType("yaml")
	v.AddConfigPath(".")

	err := v.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("fatal error config file: %w", err))
	}

	return v

}
