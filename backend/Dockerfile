FROM python:3.8

WORKDIR /backend
COPY ./ ./

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip3 install -r requirements.txt

EXPOSE 8000
# CMD tail -f /dev/null

CMD ./run.sh