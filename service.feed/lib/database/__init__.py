from mongoengine import connect, disconnect_all
from lib.config import database_config
from lib.utils import get_logger

logger = get_logger(__name__)


def init():
    try:
        logger.info('Database Initialized', **database_config)
        connect(**database_config)
    except Exception as e:
        logger.exception(e)


def close():
    try:
        logger.info('Database Close', **database_config)
        disconnect_all()
    except Exception as e:
        logger.exception(e)
