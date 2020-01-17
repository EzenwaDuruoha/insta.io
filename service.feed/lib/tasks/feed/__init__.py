from lib.celery import runner

@runner.task
def add(x, y):
    return x + y

__all__ = ['add']
