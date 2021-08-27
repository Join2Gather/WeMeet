#!/bin/bash

python3 manage.py makemigrations
python3 manage.py migrate
gunicorn config.asgi:application -k uvicorn.workers.UvicornWorker