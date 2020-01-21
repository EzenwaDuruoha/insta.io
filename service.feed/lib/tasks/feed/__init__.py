from lib.celery import runner
from lib.services import RedisFactory

redisService = RedisFactory()


@runner.task(bind=True, name='sum')
def add(self, x, y):
    x = redisService.get('celery-task-meta-b3bbf6c9-0734-4d5a-bd44-298b74f88382')
    print(x)
    return x + y


__all__ = ['add']
