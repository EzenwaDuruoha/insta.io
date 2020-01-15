from mongoengine import QuerySet

class FeedQuerySet(QuerySet):
    def get_recent_feed(userId, time):
        pass
