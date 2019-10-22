#!/bin/bash

#curl -H "Authorization: Token ${1}"  -X GET http://localhost:8000/auth/user
curl -d "{\"name\":\"${1}\", \"lang\":\"${2}\", \"sex\":\"${3}\", \"target\":\"${4}\"}" -H "Authorization: Token ${5}" -H "Content-Type: application/json" -X POST http://localhost:8000/survey/
