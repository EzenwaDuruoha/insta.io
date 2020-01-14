from pymongo import MongoClient
from lib.config import DATABASE_URL

db=MongoClient(DATABASE_URL)
