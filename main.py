from flask import Flask, render_template, request
import logging, json
from models import Rooms

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vXxGmyT6NxT5MRYD3mKQYx6y'

@app.route('/')
def home():
	return render_template('index.html')

@app.route('/room/<roomId>')
def room(roomId):
	room = Rooms.get_by_id(roomId)
	if (room == None):
		roomKey = Rooms(id = roomId, version = 0, text = 'hello', canvas = '{"objects":[{"type":"rect","originX":"left","originY":"top","left":100,"top":100,"width":20,"height":20,"fill":"green","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":45,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","rx":0,"ry":0}],"background":""}').put()
		room = Rooms.get_by_id(roomId)

	vars = room.to_dict()
	vars['id'] = room.key.id()

	return render_template('room.html', vars=vars)

@app.route('/pollRoom', methods=['POST'])
def pollRoom():
	sentData = request.form;
	logging.debug(sentData)

	room = Rooms.get_by_id(sentData['id'])
	if (room == None):
		return json.dumps({'code': -1, 'reason': 'eRRoR: No room by that id'})

	hereData = room.to_dict()

	logging.debug(hereData)

	#codes: -1: error - 0: no changes - 1: changes on server - 2: changes on client - 3: changes on server and client
	if (sentData['changed'] == 'false'):
		if (int(sentData['version']) == hereData['version']):
			return json.dumps({'code': 0})
		else:
			hereData['code'] = 1
			return json.dumps(hereData)
	else: 
		if (int(sentData['version']) == hereData['version']):
			room.version = int(sentData['version']) + 1
			room.text = sentData['text']
			room.canvas =  sentData['canvas']
			room.put()
			return json.dumps({'code': 2, 'version': int(sentData['version']) + 1})
		else:
			# todo - diff
			hereData['code'] = 3
			return json.dumps(hereData)

@app.errorhandler(404)
def page_not_found(e):
	return 'eRRoR - 404', 404

@app.errorhandler(500)
def application_error(e):
	return 'eRRoR - 500: {}'.format(e), 500