from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('template.html', my_string="Working!", my_list=['Yes', 'No','Maybe','Can you repeat the question?'])


@app.errorhandler(404)
def page_not_found(e):
    return 'eRRoR - 404', 404


@app.errorhandler(500)
def application_error(e):
    return 'eRRoR - 500: {}'.format(e), 500