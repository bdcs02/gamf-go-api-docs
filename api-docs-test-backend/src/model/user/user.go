package model

import (
	"fmt"
)

type User struct {
	Id       int64  `gorm:"primaryKey;column:ID"`
	Name     string `gorm:"column:NAME"`
	UserName string `gorm:"column:USERNAME"`
	Email    string `gorm:"column:EMAIL"`
	Senior   bool   `gorm:"column:IS_SENIOR"`
	Active   bool   `gorm:"column:ACTIVE"`
	Rank     string `gorm:"column:RANK"`
}

func (User) TableName() string {
	return "USER_T"
}

func (user User) String() string {
	return fmt.Sprintf("%s, %s", user.UserName, user.Email)
}
