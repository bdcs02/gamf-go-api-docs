package dto

type TestStruct struct {
	Field1               string `json:"field1" apidoc:"Field 1 leírás" validate:"required"`
	Field2               int    `json:"field2" apidoc:"Field 2 leírás" validate:"min=10,max=20"`
	Field3               bool   `json:"field3" apidoc:"Field 3 leírás"`
	StructField          StructField
	StructFieldPointer   *StructField
	Pointer              *string
	Slice                []string
	StructSlice          []SliceTest
	CustomTypeValue      CustomType
	StringMap            map[string]StructField
	StringMapWithPointer map[string]*StructField
	SimpleMap            map[string]int
	Function             func(p int) string `json:"-"`
	EmbeddedStruct
	privateField      string
	InterfaceTest     InterfaceTest
	InterfaceTest2    InterfaceTest
	GenericTest       GenericTest[InterfaceTest]
	GenericTestString GenericTest[string]
	GenericTestInt    GenericTest[int]
}

type CustomType int

type EmbeddedStruct struct {
	EmbeddedField1       string
	EmbeddedField2       int `validate:"min=10"`
	EmbeddedField3       bool
	privateEmbeddedField string
}

type StructField struct {
	StructFieldValue1  string
	StructFieldValue2  int `validate:"max=10"`
	StructFieldValue3  bool
	privateStructField bool
}

type SliceTest struct {
	Field1 string
	Field2 int
}

type InterfaceTest struct {
	InterfaceTestParam interface{ any }
}

type GenericTest[T any] struct {
	TestParam T
}
