from celery import Celery
from lib.config import CELERY_CONFIG

runner = Celery()
runner.config_from_object(CELERY_CONFIG)

