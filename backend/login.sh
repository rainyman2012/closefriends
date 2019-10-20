#!/bin/bash

curl -d "{\"username\":\"${1}\", \"password\":\"${2}\"}" -H "Content-Type: application/json" -X POST http://localhost:8000/rest-auth/login/
