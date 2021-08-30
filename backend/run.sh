#!/bin/bash

python3 manage.py makemigrations
python3 manage.py migrate
gunicorn config.wsgi --bind 0.0.0.0:8000