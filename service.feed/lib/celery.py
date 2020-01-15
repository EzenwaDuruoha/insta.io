from __future__ import absolute_import, unicode_literals
from celery import Celery
from celery.signals import setup_logging
from lib.database import init
from lib.config import celery_config
from lib.utils import get_logger
from lib.services import RedisService

init()
redis = RedisService()
runner = Celery('lib', include=['lib.tasks'])
runner.config_from_object(celery_config)

@setup_logging.connect
def setup_loggers(*args, **kwargs):
    logger = get_logger(__name__)
