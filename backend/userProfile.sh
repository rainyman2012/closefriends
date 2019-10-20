#!/bin/bash

#curl -H "Authorization: Token ${1}"  -X GET http://localhost:8000/auth/user
curl -H "Authorization: Token ${1}" -H "Content-Type: application/json" -X GET http://localhost:8000/api/profile/
