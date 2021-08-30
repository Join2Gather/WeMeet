FROM python:3.8

WORKDIR /backend
COPY . .

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update -y && \
    apt-get install -y libglib2.0-0 libgl1-mesa-glx

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN python3.8 -m venv venv
RUN /bin/bash -c "source venv/bin/activate"

RUN pip3 install -r requirements.txt

EXPOSE 8009

CMD [ "python3", "src/main.py" ]