FROM python:3.7-alpine

ARG env=development
ARG trace=1

ENV ENV=${env}
ENV PYTHONUNBUFFERED 1
ENV CELERY_TRACE_APP=${trace}

RUN python -m pip install --upgrade pip
RUN apk add --no-cache --virtual .build-deps gcc musl-dev libffi-dev make

WORKDIR /app

COPY ./Pipfile Pipfile.lock ./

RUN set -ex && pipenv install --deploy --system && \
    apk --purge del .build-deps

COPY . .

CMD ["celery", "-A", "worker", "worker", "-l", "info"]
