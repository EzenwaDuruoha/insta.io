from datetime import datetime
from uuid import uuid4
from mongoengine import (
    Document, 
    EmbeddedDocument, 
    UUIDField, 
    StringField, 
    DateTimeField,
    EmbeddedDocumentField
)
from lib.querysets import FeedQuerySet

class ActivityModel(EmbeddedDocument):
    """Activity Embedded Document Schema"""
    actor = UUIDField(required=True)
    verb = StringField(required=True, default='Post')
    content = UUIDField(required=True)
    username = UUIDField(required=True)

class FeedModel(Document):
    """Feed Document Schema"""
    id = UUIDField(primary_key=True, default=uuid4)
    userId = UUIDField(required=True)
    activity = EmbeddedDocumentField(ActivityModel)
    timestamp = DateTimeField(required=True)
    createdAt = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'feeds',
        'ordering': ['-timestamp']
        'indexes': [
            'userId',
            ('userId', '-timestamp')
        ],
        'queryset_class': FeedQuerySet
    }
