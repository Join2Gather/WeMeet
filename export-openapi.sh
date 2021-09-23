#!/bin/bash

python backend/manage.py generate_swagger openapi.json
npx openapi-generator-cli generate -g typescript-axios -i openapi.json -o frontend/src/openapi

rm openapi.json