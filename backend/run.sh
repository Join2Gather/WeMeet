#!/bin/bash

pip install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate

echo Starting Gunicorn.
exec gunicorn -c gunicorn.py