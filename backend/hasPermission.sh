#!/bin/bash

#curl -H "Authorization: Token ${1}"  -X GET http://localhost:8000/auth/user
curl -H "Authorization: Token ${2}" -H "Content-Type: application/json" -X GET http://localhost:8000/api/user/request/?has_perm=${1}
