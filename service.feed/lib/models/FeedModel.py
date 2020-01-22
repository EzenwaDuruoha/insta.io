from datetime import datetime
from uuid import uuid4
from mongoengine import (
    Document,
    EmbeddedDocument,
    UUIDField,
    StringField,
    DateTimeField,
    EmbeddedDocumentField,
    ComplexDateTimeField,
    ListField
)
from lib.querysets import FeedQuerySet


class ActivityModel(EmbeddedDocument):
    """Activity Embedded Document Schema"""
    actor = StringField(required=True)
    verb = StringField(required=True, default='Post')
    content = StringField(required=True)
    contentURL = ListField(StringField(required=True))
    username = StringField(required=True)


class FeedModel(Document):
    """Feed Document Schema"""
    id = StringField(primary_key=True, default=lambda: str(uuid4()))
    userId = StringField(required=True)
    activity = EmbeddedDocumentField(ActivityModel)
    timestamp = DateTimeField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'feeds',
        'ordering': ['-timestamp'],
        'indexes': [
            'userId',
            ('userId', '-timestamp')
        ],
        'queryset_class': FeedQuerySet
    }
