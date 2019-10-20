#!/bin/bash

curl  -H "Authorization: Token ${1}" -H "Content-Type: application/json" -X POST http://localhost:8000/rest-auth/logout/
