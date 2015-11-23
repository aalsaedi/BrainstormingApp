from flask import Flask, render_template, request
import logging, json
from models import Rooms

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vXxGmyT6NxT5MRYD3mKQYx6y'

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/room/<roomId>')
def room(roomId):
	room = Rooms.get_by_id(roomId)
	if (room == None):
		roomKey = Rooms(id = roomId, version = 0, text = 'hello').put()
		room = Rooms.get_by_id(roomId)

	vars = room.to_dict()
	vars['id'] = room.key.id()

	return render_template('room.html', vars=vars)

@app.route('/pollRoom', methods=['POST'])
def pollRoom():
	room = Rooms.get_by_id(request.form['id'])
	if (room == None):
		return json.dumps({'code': -1, 'reason': 'eRRoR: No room by that id'})

	update = room.to_dict()

	logging.debug(request.form)
	logging.debug(update)

	#codes: -1: error - 0: no changes - 1: changes on server, none on client - 2: changes on client, none on server - 3: changes on server and on client
	if (request.form['changed'] == 'false'):
		if (int(request.form['version']) == update['version']):
			return json.dumps({'code': 0})
		else:
			update['code'] = 1
			return json.dumps(update)
	else: 
		inVersion = int(request.form['version'])

		if (inVersion == update['version']):
			room.version = inVersion + 1
			room.text = request.form['text']
			room.put()
			return json.dumps({'code': 2, 'version': inVersion + 1})
		else:
			# todo - diff
			update['code'] = 3
			return json.dumps(update)

@app.errorhandler(404)
def page_not_found(e):
	return 'eRRoR - 404', 404

@app.errorhandler(500)
def application_error(e):
	return 'eRRoR - 500: {}'.format(e), 500