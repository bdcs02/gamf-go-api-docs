package goapidoc

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
)

type ExampleJson struct {
	Request     interface{}             `json:"request"`
	Response    interface{}             `json:"response"`
	StatusCodes []ResponseType `json:"statusCodes"`
}

var (
	examplePath  string
	examples = make(map[string]ExampleJson)
)


func GetRequestExample[T interface{}](endpoint string) *T {
	ep := getExampleEndpoint(endpoint)
	if ep != nil {
		res, err := convertObjMapToType[T](ep.Request)
		if err != nil {
			fmt.Printf("Failed to parse request example to type %T for endpoint %s \n%v", res, endpoint, err)
			return nil
		}
		return res
	}

	return nil
}

func GetResponseExample[T interface{}](endpoint string) *T {
	ep := getExampleEndpoint(endpoint)
	if ep != nil {
		res, err := convertObjMapToType[T](ep.Response)
		if err != nil {
			fmt.Printf("Failed to parse response example to type %T for endpoint %s \n%v", res, endpoint, err)
			return nil
		}
		return res
	}

	return nil
}

func convertObjMapToType[T interface{}](obj interface{}) (*T, error) {
	cb, err := json.Marshal(obj)
	if err != nil {
		return nil, err
	}

	var res T
	err = json.Unmarshal(cb, &res)
	if err != nil {
		return nil, err
	}

	return &res, nil
}

func GetResponseCodesExample(endpoint string) *[]ResponseType {
	ep := getExampleEndpoint(endpoint)

	if ep != nil {
		return &ep.StatusCodes
	}

	return nil
}

func getExampleEndpoint(endpoint string) *ExampleJson {
	val, ok := examples[endpoint]
	if ok {
		return &val
	}

	json := readExampleJSONFile(endpoint)
	if json != nil {
		examples[endpoint] = *json
	}

	return json
}

func readExampleJSONFile(endpoint string) *ExampleJson {
	jsonFile, err := os.Open(fmt.Sprintf("%s/%s.json", examplePath, endpoint))
	if err != nil {
		fmt.Printf("Failed to read example json file for endpoint %s\n%v", endpoint, err)
		return nil
	}

	defer jsonFile.Close()

	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		fmt.Printf("Failed to decode example json file for endpoint %s\n%v", endpoint, err)
		return nil
	}

	var result ExampleJson
	if err = json.Unmarshal(byteValue, &result); err != nil {
		fmt.Printf("Failed to unmarshal json file for endpoint %s\n%v", endpoint, err)
		return nil
	}

	return &result
}
