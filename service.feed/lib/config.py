BROKER_URL = os.getenv('CELERY_BROKER_URL', 'localhost:5762')
ENV = os.getenv('ENV', 'development')
DATABASE_URL = os.getenv('DATABASE_URL', 'mongodb://localhost:27017')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = os.getenv('REDIS_PORT', 6379)
REDIS_URL = f'redis://{REDIS_HOST}:{REDIS_PORT}'

CELERY_CONFIG = {
    'result_backend': REDIS_URL,
    'broker_url': BROKER_URL,
    'task_serializer': 'json',
    'accept_content': ['json'],
    'result_serializer': 'json',
    'enable_utc': True,
    'task_remote_tracebacks': True
}
