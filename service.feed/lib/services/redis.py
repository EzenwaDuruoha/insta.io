from lib.config import REDIS

mode = type(REDIS)
isCluster = False

if mode is dict:
    from redis import StrictRedis
elif mode is list:
    from rediscluster import StrictRedisCluster
    isCluster = True


class RedisService:
    client = None
    def __init__(self):
        if isCluster:
            self.client = StrictRedisCluster(startup_nodes=REDIS, decode_responses=True)
        else:
            self.client = StrictRedis(**REDIS)
