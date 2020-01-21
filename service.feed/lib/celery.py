from __future__ import absolute_import, unicode_literals
from celery import Celery
from celery.signals import setup_logging, worker_process_init, worker_shutdown
from lib.database import init, close
from lib.config import celery_config
from lib.utils import get_logger
from lib.services import RedisFactory

runner = Celery('lib', include=['lib.tasks'])
runner.config_from_object(celery_config)


@setup_logging.connect
def setup_loggers(*args, **kwargs):
    logger = get_logger(__name__)


@worker_process_init.connect
def setup(*args, **kwargs):
    init()
    RedisFactory.setup()


@worker_shutdown.connect
def shutdown(*args, **kwargs):
    close()
