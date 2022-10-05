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
import boto3
eventlet.monkey_patch()


app = Flask(__name__, static_url_path='',
                  static_folder='out',
                  template_folder='out')
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.config['DEBUG'] = True


LD_KEY = os.environ.get('LD_SERVER_KEY')

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
    if dbinfo['mode'] == "Cloud":
        stats = {
            'version': '2',
            'status': 'Healthy - Migration Successful',
            'location': 'Cloud'
        }
        
    else:
        stats = {
            'version': '1',
            'status': 'unhealthy',
            'location': 'DebugData'
        }
    return jsonify(stats)

@app.route("/datas", methods=["GET", "POST"])
def thedata():
    ldclient.set_config(Config(LD_KEY))
    user = {
        "key": request.args.get('LD_USER_KEY')
    }
    ldclient.get().identify(user)

    ############################################################################################
    #                                                                                          #
    #                                                                                          #
    #             Code for implementing a database read feature flag is below                  #
    #                                                                                          #
    #                                                                                          #
    ############################################################################################

    # dbinfo = ldclient.get().variation('dbDetails', user, fallback)
    # if dbinfo['dbhost'] == 'db':
    #     dummyData = [(
    #         {
    #             "id":1,
    #             "title":"Debug Ipsum 1",
    #             "text":"This is our debug text. Charlie ate the last candy bar."
    #         },
    #         {
    #             "id":2,
    #             "title":"Debug Ipsum 2",
    #             "text":"We're debugging all the Unicorns. They are trampling our code."
    #         },
    #         {
    #             "id":3,
    #             "title":"Debug Ipsum 3",
    #             "text":"Will it ever end? Speculation is nay. It likely won't."
    #         }
    #     )]
    #     return jsonify(dummyData)
    # else:
    #     dynamodb = boto3.resource('dynamodb')
    #     table = dynamodb.Table('GamedayDB')
    #     data = table.get_item(Key={'teamid': '2'})
    #     realData = [(
    #         {
    #             "id":1,
    #             "title":data['Items']['title1'],
    #             "text":data['Items']['text1']
    #         },
    #         {
    #             "id":1,
    #             "title":data['Items']['title2'],
    #             "text":data['Items']['text2']
    #         },
    #         {
    #             "id":1,
    #             "title":data['Items']['title3'],
    #             "text":data['Items']['text3']
    #         }
    #     )]
    #     return jsonify(realData)

    ############################################################################################
    #                                                                                          #
    #                                                                                          #
    #                            End New Database Code                                         #
    #                                                                                          #
    #                                                                                          #
    ############################################################################################ 

    ## When we deploy the prod code - comment out this dummydata debuggin section 
    ## and use the flag conditionals above 
    dummyData = [(
        {
            "id":1,
            "title":"Debug Ipsum 1",
            "text":"This is our debug text. Charlie ate the last candy bar."
        },
        {
            "id":2,
            "title":"Debug Ipsum 2",
            "text":"We're debugging all the Unicorns. They are trampling our code."
        },
        {
            "id":3,
            "title":"Debug Ipsum 3",
            "text":"Will it ever end? Speculation is nay. It likely won't."
        }
        )]
    return dummyData
    ## Comment out above this line 

@app.route("/teamdebug")
def teamdebug():
    if logstatus == "debug":
        teamid = os.environ.get("NEXT_PUBLIC_TEAM_ID")
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('GamedayDB')
        data = table.get_item(Key={'teamid': str(teamid)})
        teamval = {
            "teamid": teamid,
            "loglevel": logstatus,
            "debugcode": data['Item']['debugcode']
        }
        return jsonify(teamval)
    else:
        data = {
            "loglevel": logstatus,
            "message": "Logging is currently in default mode. No debug data available. Have you checked LaunchDarkly?"
        }
        return jsonify(data)
   

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE,OPTIONS')
    return response