#!/bin/bash

echo "${1} ${2}" >>register.txt
curl -d "{\"gender\":\"${1}\"}" -H "Authorization: Token ${2}" -H "Content-Type: application/json" -X PATCH http://localhost:8000/api/profile/
#curl -d "{\"username\":\"${1}\", \"email\":\"\", \"password\":\"1234\"}" -H "Content-Type: application/json" -X POST http://localhost:8000/auth/register
