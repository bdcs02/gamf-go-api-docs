package goapidoc

import (
	"reflect"
	"slices"
	"strings"
)

type FieldMap struct {
	Name        string      `json:"name,omitempty"`
	Description string      `json:"description,omitempty"`
	Tag         string      `json:"tag"`
	Type        string      `json:"type"`
	Kind        string      `json:"kind"`
	Key         *FieldMap   `json:"key,omitempty"`
	Fields      *[]FieldMap `json:"fields,omitempty"`
}

var ignoredReflectTypes []reflect.Kind = []reflect.Kind{
	reflect.Chan,
	reflect.Func,
	reflect.Interface,
	reflect.UnsafePointer,
}

var nestedReflectTypes []reflect.Kind = []reflect.Kind{
	reflect.Array,
	reflect.Map,
	reflect.Slice,
	reflect.Ptr,
	reflect.Pointer,
}

func GetObjectType(dataType reflect.Type) *FieldMap {
	// If the incoming type is nil, mapping will be skipped.
	if dataType == nil {
		return nil
	}

	field := &FieldMap{
		Name: dataType.String(),
		Type: dataType.String(),
		Kind: dataType.Kind().String(),
	}

	if dataType.Kind() == reflect.Ptr || dataType.Kind() == reflect.Pointer {
		field.Type = dataType.Elem().String()
	}

	return field
}

func MapRequest(dataType reflect.Type) *[]FieldMap {
	// If the incoming type is nil, mapping will be skipped.
	if dataType == nil {
		return nil
	}

	fields := make([]FieldMap, 0)
	// If the kind of provided value is a pointer, then get the type of data on given address.
	if dataType.Kind() == reflect.Ptr || dataType.Kind() == reflect.Pointer {
		dataType = dataType.Elem()
	}

	if dataType.Kind() != reflect.Struct {
		return nil
	}

	// Iterate fields of struct
	for i := 0; i < dataType.NumField(); i++ {
		field := dataType.Field(i)

		// If the kind of field is in the list of ignoredReflectType, then the mapping of field will be skipped.
		if slices.Contains(ignoredReflectTypes, field.Type.Kind()) {
			continue
		}

		fieldName := GetFieldName(field)

		// If the field is json omitted, it will not be mapped.
		if fieldName == "-" {
			continue
		}

		fieldType := field.Type.Name()
		var nestedFields *[]FieldMap
		var key *FieldMap

		// If the kind of the field is a pointer, then the field type will be overwritten with the pointed type.
		if slices.Contains(nestedReflectTypes, field.Type.Kind()) {
			fieldType = field.Type.Elem().Name()
			nestedFields = MapRequest(field.Type.Elem())

			if field.Type.Kind() == reflect.Map {
				keyField := MapRequest(field.Type.Key())
				if keyField != nil && len(*keyField) > 0 {
					key = &(*keyField)[0]
				} else {
					key = &FieldMap{
						Type: field.Type.Key().Name(),
						Kind: field.Type.Key().Kind().String(),
					}
				}
			}
		}

		if field.Type.Kind() == reflect.Struct {
			nestedFields = MapRequest(field.Type)
		}

		f := FieldMap{
			Name:        fieldName,
			Description: field.Tag.Get("apidoc"),
			Tag:         string(field.Tag),
			Type:        fieldType,
			Kind:        field.Type.Kind().String(),
			Key:         key,
			Fields:      nestedFields,
		}

		fields = append(fields, f)
	}

	return &fields
}

// Get name of field. If the the given field has json name tag, then it's value will be returned.
func GetFieldName(field reflect.StructField) string {
	name, ok := field.Tag.Lookup("json")

	if ok {
		tagParts := strings.Split(name, ",")

		if len(tagParts) == 0 {
			return field.Name
		}

		return tagParts[0]
	} else {
		return field.Name
	}
}
