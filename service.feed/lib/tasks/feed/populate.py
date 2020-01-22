import json
import copy
from lib.celery import runner
from lib.services import RedisFactory, UserService
from lib.models import FeedModel, ActivityModel
from lib.constants import USER_FEED
from lib.config import USER_SERVICE_URL

redisService = RedisFactory()
userService = UserService(USER_SERVICE_URL)


def populate(activity, userId):
    listKey = USER_FEED.format(userId)
    active = redisService.exists(listKey)
    timestamp = activity.pop('timestamp')
    dump = dict(activity=activity, timestamp=timestamp)
    if active:
        pipe = redisService.pipeline()
        pipe.lpush(listKey, json.dumps(dump))
        pipe.ltrim(listKey, 0, 100)
        pipe.execute()
    activityModel = ActivityModel(**activity)
    feed = FeedModel(userId=userId, timestamp=timestamp,
                     activity=activityModel)
    feed.save()


@runner.task(bind=True, name='dispatch_feed_fanout')
def fanout(self, activity=dict()):
    actor = activity.get('actor', None)
    ok, payload, status = userService.get_user_followers(actor)
    following = payload.get('data', [])
    for val in following:
        followed = val.get('followed', None)
        if followed:
            populate(copy.deepcopy(activity), userId=followed['id'])



