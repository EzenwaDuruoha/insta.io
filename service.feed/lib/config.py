import os

BROKER_URL = os.getenv('BROKER_URL', 'localhost:5762')
ENV = os.getenv('ENV', 'development')
DATABASE_URL = os.getenv('DATABASE_URL', 'mongodb://localhost:27017')
DATABASE_USER = os.getenv('DATABASE_USER', None)
DATABASE_PASSWORD = os.getenv('DATABASE_PASSWORD', None)
DATABASE_NAME = os.getenv('DATABASE_NAME', 'admin')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
USER_SERVICE_URL = os.getenv('USER_SERVICE_URL', 'http://auth')
REDIS = None

# 127.0.0.1:6342, 127.0.0.1:6345
_is_redis_cluster = os.getenv('REDIS_CLUSTER', 'False') == 'True'
_redis_config = os.getenv('REDIS_ENDPOINT', 'localhost:6379')
if _is_redis_cluster:
    REDIS = [
        {"host": x.split(':')[0].strip(), "port": x.split(':')[1].strip()} for x in _redis_config.split(',')
    ]
else:
    REDIS = {
        'host': _redis_config.split(':')[0],
        'port': _redis_config.split(':')[1]
    }

database_config = {
    'db': DATABASE_NAME,
    'username': DATABASE_USER,
    'password': DATABASE_PASSWORD,
    'host': DATABASE_URL
}

celery_config = {
    'result_backend': 'redis://{}:{}'.format(REDIS['host'], REDIS['port']),
    'broker_url': BROKER_URL,
    'task_serializer': 'json',
    'accept_content': ['json'],
    'result_serializer': 'json',
    'enable_utc': True,
    'task_remote_tracebacks': True
}
