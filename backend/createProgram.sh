#!/bin/bash

#curl -H "Authorization: Token ${1}"  -X GET http://localhost:8000/auth/user
curl -d "{\"name\":\"${1}\"}" -H "Authorization: Token ${2}" -H "Content-Type: application/json" -X POST http://localhost:8000/api/
