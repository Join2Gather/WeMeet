FROM ubuntu:20.04

WORKDIR /backend
COPY . .

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && \
    apt-get install -y python3-pip python3-dev \
    build-essential libssl-dev libffi-dev python3-setuptools \
    python3-venv mongodb-clients bash-completion libglib2.0-0 libgl1-mesa-glx

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN python3.8 -m venv venv
RUN /bin/bash -c "source venv/bin/activate"

RUN pip3 install -r requirements.txt

EXPOSE 8009

CMD [ "python3", "src/main.py" ]