from google.appengine.ext import ndb
import logging, json

class Rooms(ndb.Model):
	version = ndb.IntegerProperty(required=True)
	text = ndb.TextProperty(required=True)
	canvas = ndb.TextProperty(required=True)
	username = ndb.TextProperty(required=False)
	message = ndb.TextProperty(required=False)
	date = ndb.TextProperty(required=False)