import json
from lib.celery import runner
from lib.services import RedisFactory
from lib.models import FeedModel, ActivityModel
from lib.constants import USER_FEED

redisService = RedisFactory()


@runner.task(bind=True, name='dispatch_feed_fanout')
def fanout(self, activity = dict()):
    listKey = USER_FEED.format(activity['actor'])
    active = redisService.exists(listKey)
    timestamp = activity.pop('timestamp')
    dump = dict(activity=activity, timestamp=timestamp)
    if active:
        pipe = redisService.pipeline()
        pipe.lpush(listKey, json.dumps(dump))
        pipe.ltrim(listKey, 0, 100)
        complete = pipe.execute()
    userId = activity.get('actor')
    activityModel = ActivityModel(**activity)
    feed = FeedModel(userId=userId, timestamp=timestamp, activity=activityModel)
    feed.save()


