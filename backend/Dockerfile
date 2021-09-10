FROM python:3.8

WORKDIR /backend
COPY . .

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN python3 -m venv venv
RUN /bin/bash -c "source venv/bin/activate"

RUN pip3 install -r requirements.txt

EXPOSE 8000
# CMD tail -f /dev/null

CMD [ "python3", "manage.py", "runserver", "0.0.0.0:8000" ]