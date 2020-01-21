from lib.config import REDIS, _is_redis_cluster
from redis import StrictRedis
from rediscluster import RedisCluster


class RedisService:
    client = None

    def __init__(self):
        if _is_redis_cluster:
            self.client = RedisCluster(
                startup_nodes=REDIS, decode_responses=True)
        else:
            self.client = StrictRedis(**REDIS)

    def __getattr__(self, name):
        return getattr(self.client, name)


class RedisFactory:
    instance = None

    @staticmethod
    def setup():
        if not RedisFactory.instance:
            RedisFactory.instance = RedisService()

    def __getattr__(self, name):
        return getattr(self.instance, name)
