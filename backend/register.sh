#!/bin/bash

echo "${1} ${2}" >>register.txt
curl -d "{\"username\":\"${1}\", \"password1\":\"${2}\", \"password2\":\"${2}\"}" -H "Content-Type: application/json" -X POST http://localhost:8000/rest-auth/registration/
#curl -d "{\"username\":\"${1}\", \"email\":\"\", \"password\":\"1234\"}" -H "Content-Type: application/json" -X POST http://localhost:8000/auth/register
