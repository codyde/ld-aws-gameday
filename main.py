from psycopg2.extras import RealDictCursor
import psycopg2
from flask_cors import CORS
from flask import Flask,jsonify, request, render_template
import json
import ldclient
from ldclient.config import Config
import logging
import os
import eventlet
import uuid
from dotenv import load_dotenv, find_dotenv
eventlet.monkey_patch()

load_dotenv(find_dotenv())


app = Flask(__name__, static_url_path='',
                  static_folder='out',
                  template_folder='out')
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.config['DEBUG'] = True


LD_KEY = os.getenv('LD_SERVER_KEY')

fallback = '{"dbinfo":"localhost","dbname":"localdb"}'

user = {
    "key": "anonymous"
}
ldclient.set_config(Config(LD_KEY))
logstatus = ldclient.get().variation('logMode', user, 'default')


@app.route('/')
def default_path():
    return render_template("index.html")


@app.route("/health")
def get_api():
    ldclient.set_config(Config(LD_KEY))
    user = {
        "key": request.args.get('LD_USER_KEY')
    }
    ldclient.get().identify(user)
    dbinfo = ldclient.get().variation('dbDetails', user, fallback)
    print(user)
    if dbinfo['mode'] == "RDS":
        stats = {
            'version': '2',
            'status': 'healthy',
            'location': 'RDS'
        }
        
    else:
        stats = {
            'version': '1',
            'status': 'healthy',
            'location': 'Local'
        }
    return jsonify(stats)

@app.route("/users", methods=["GET", "POST"])
def users():
    ldclient.set_config(Config(LD_KEY))
    user = {
        "key": request.args.get('LD_USER_KEY')
    }
    ldclient.get().identify(user)
    logstatus = ldclient.get().variation('logMode', user, 'default')
    dbinfo = ldclient.get().variation('dbDetails', user, fallback)
    if dbinfo['dbhost'] == 'db':
        data = {
            'user': 'cody',
        }
        return jsonify(data)
    else:
        conn = psycopg2.connect(f"host={dbinfo['dbhost']} port=5432 \
                dbname={dbinfo['dbname']} user=postgres password=postgres_password \
                sslmode=disable")
        if request.method == "GET":
            print(logstatus)
            if logstatus == 'default':
                app.logger.debug(logstatus+" log level running")
            elif logstatus == 'debug':
                app.logger.debug("log level is "+logstatus)
            else:
                app.logger.debug("some other log level")
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute('SELECT * FROM users ORDER BY id')
            ret = cur.fetchall()
            return jsonify(ret)
        if request.method == "POST":
            val = request.get_json()
            print(val)
            cur = conn.cursor()
            migrate = ldclient.get().variation('dbmigrate', user, False)
            if migrate == True:
                cur.execute("INSERT INTO users (username, location) \
                    VALUES (%s,%s)", (val['username'],val['location']))
            else:
                cur.execute("INSERT INTO users (username) \
                    VALUES (%s)", (val['username'],))
            conn.commit()
            cur.execute('SELECT * FROM users ORDER BY id')
            ret = cur.fetchall()
            return jsonify(ret)

@app.route("/teamdebug")
def teamdebug():
    teamid = request.args.get("TEAM_ID")
    teamval = {
        "id": str(uuid.uuid1()),
        "teamid": teamid
    }
    if logstatus == "debug":
        print(teamval)
    return jsonify(teamval)
   

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response