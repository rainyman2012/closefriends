#!/bin/bash

echo "${1}"
curl -d "{\"username\":\"${1}\"}" -H "Content-Type: application/json" -X POST http://localhost:8000/auth/checkExistUser
