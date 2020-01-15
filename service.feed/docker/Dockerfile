FROM python:3.7-slim-buster

ARG env=development
ARG trace=1

ENV ENV=${env}
ENV PYTHONUNBUFFERED 1
ENV CELERY_TRACE_APP=${trace}

RUN pip install pipenv

WORKDIR /app

COPY Pipfile* ./

RUN pipenv install --deploy --ignore-pipfile --dev

COPY . .

CMD ["pipenv", "run", "celery", "-A", "lib", "worker", "-l", "info"]
