package structmapper

import (
	contentTypes "api-docs-test-backend/contenttypes"
	"api-docs-test-backend/dto"
	"api-docs-test-backend/router"
	"net/http"

	goapidoc "goapidoc"

	"github.com/labstack/echo/v4"
)

func Init() {
	sessionEndpoint := &goapidoc.Endpoint{
		Handler:     StructMapperTest,
		Category:    "Test",
		Permission:  "",
		Description: "Struct mapping test endpoint.",
		RequestData: &dto.TestStruct{},
		ResponseData: &dto.TestStruct{
			Field1:  "testValue1",
			Field2:  0,
			Field3:  false,
			Pointer: nil,
			StructFieldPointer: &dto.StructField{
				StructFieldValue1: "testPointerValue",
				StructFieldValue2: 1,
				StructFieldValue3: false,
			},
			Slice: []string{"item1", "item2", "item3"},
			StringMap: map[string]dto.StructField{
				"testKey": dto.StructField{StructFieldValue1: "mapValue"},
			},
			CustomTypeValue: dto.CustomType(2),
			SimpleMap: map[string]int{
				"one":   1,
				"two":   2,
				"three": 3,
			},
			StringMapWithPointer: map[string]*dto.StructField{
				"pointer": &dto.StructField{
					StructFieldValue1: "pointerValueValue",
					StructFieldValue2: 1,
					StructFieldValue3: false,
				},
			},
			StructSlice: []dto.SliceTest{
				dto.SliceTest{Field1: "sliceField1", Field2: 2},
			},
			Function: func(p int) string { return string(p) },
			StructField: dto.StructField{
				StructFieldValue1: "innerTestValue1",
				StructFieldValue2: 1,
				StructFieldValue3: true,
			},
			EmbeddedStruct: dto.EmbeddedStruct{
				EmbeddedField1: "embeddedValue1",
				EmbeddedField2: 2,
				EmbeddedField3: true,
			},
			InterfaceTest:     dto.InterfaceTest{1},
			InterfaceTest2:    dto.InterfaceTest{"tesztInterface"},
			GenericTest:       dto.GenericTest[dto.InterfaceTest]{},
			GenericTestString: dto.GenericTest[string]{"Teszt"},
			GenericTestInt:    dto.GenericTest[int]{1},
		},
		ContentType: contentTypes.JSON,
	}
	router.RegisterRoute("GET", "/structmapper", sessionEndpoint)
}

func StructMapperTest(c echo.Context) error {
	response := &dto.TestStruct{
		Field1:  "testValue1",
		Field2:  0,
		Field3:  false,
		Pointer: nil,
		StructFieldPointer: &dto.StructField{
			StructFieldValue1: "testPointerValue",
			StructFieldValue2: 1,
			StructFieldValue3: false,
		},
		Slice: []string{"item1", "item2", "item3"},
		StringMap: map[string]dto.StructField{
			"testKey": dto.StructField{StructFieldValue1: "mapValue"},
		},
		CustomTypeValue: dto.CustomType(2),
		SimpleMap: map[string]int{
			"one":   1,
			"two":   2,
			"three": 3,
		},
		StringMapWithPointer: map[string]*dto.StructField{
			"pointer": &dto.StructField{
				StructFieldValue1: "pointerValueValue",
				StructFieldValue2: 1,
				StructFieldValue3: false,
			},
		},
		StructSlice: []dto.SliceTest{
			dto.SliceTest{Field1: "sliceField1", Field2: 2},
		},
		Function: func(p int) string { return string(p) },
		StructField: dto.StructField{
			StructFieldValue1: "innerTestValue1",
			StructFieldValue2: 1,
			StructFieldValue3: true,
		},
		EmbeddedStruct: dto.EmbeddedStruct{
			EmbeddedField1: "embeddedValue1",
			EmbeddedField2: 2,
			EmbeddedField3: true,
		},
		InterfaceTest:     dto.InterfaceTest{1},
		InterfaceTest2:    dto.InterfaceTest{"tesztInterface"},
		GenericTest:       dto.GenericTest[dto.InterfaceTest]{},
		GenericTestString: dto.GenericTest[string]{"Teszt"},
		GenericTestInt:    dto.GenericTest[int]{1},
	}

	return c.JSON(http.StatusOK, response)
}
