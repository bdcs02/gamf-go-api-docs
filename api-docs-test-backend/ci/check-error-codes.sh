#!/bin/bash

ERROR_CODES_PATH=src/errorhandler/errorcodes.go
ERROR_MESSAGES_PATH=src/errorhandler/errors.go
UNUSED=0
UNDEFINED=0

while read -r line
do
	ERROR=$( echo $line | cut -d ' ' -f1)
	MATCH=$( (grep $ERROR -rn ./src/* || true; ) | wc -l )
	CNT_IN_MAP=$( (grep $ERROR -n $ERROR_MESSAGES_PATH ) | wc -l)
	
	if [ $CNT_IN_MAP -eq 0 ]
	then
		echo "ERROR! Error message not defined for code: $ERROR"
		UNDEFINED=$(expr $UNDEFINED + 1)
	fi

	if [ $MATCH -le 2 ]
	then
		echo "ERROR! Unused error code: $ERROR"
		UNUSED=$(expr $UNUSED + 1)
	fi
done < <(grep "ErrorCode = " $ERROR_CODES_PATH)

if [ $UNDEFINED -gt 0 ]
then
	echo -e "\nFound $UNDEFINED error code without message. Please check usage of the mentioned error code before running this script again!"
	exit 1
fi

if [ $UNUSED -gt 0 ]
then
	echo -e "\nFound $UNUSED unused error code. Please check usage of the mentioned error code before running this script again!"
	exit 1
fi

DUPLICATED_CNT=`grep "=" $ERROR_CODES_PATH | sed 's/^[^=]*=/=/' | cut -c 3- | sort | uniq -d | wc -l`

if [ $DUPLICATED_CNT -ne 0 ]
then
	DUPLICATED_CODES=`grep "=" $ERROR_CODES_PATH | sed 's/^[^=]*=/=/' | cut -c 3- | sort | uniq -d`
	echo "The following error codes are used multiple times:" $DUPLICATED_CODES
	exit 1
fi
