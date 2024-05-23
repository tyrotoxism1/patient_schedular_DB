from flask import Flask, render_template, json, jsonify, redirect 
from flask_mysqldb import MySQL
from flask import request
from flask_cors import CORS
import configparser

#Read config data for MySQL login. Takes in return_field which is the desired field retreived from the config.
#pass "user" for user field from config or "ps" for password.
def read_config(return_field):
    #Enter your name to retireve the info from config
    user_name = "micah"
    return_val = ""
    config = configparser.ConfigParser()
    try:
        config.read("db_user.config")
        return config[f"Users.{user_name}"][return_field]
    except FileNotFoundError:
        print("Check correctl file name or path!")
        return ""
    except KeyError:
        print(f"Check passed field to 'read_config' is correct or config entry for user {user_name}")
        return ""

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'classmysql.engr.oregonstate.edu'
app.config['MYSQL_USER'] = read_config("user")
app.config['MYSQL_PASSWORD'] = read_config("ps")
app.config['MYSQL_DB'] = 'cs340_janzenm'
app.config['MYSQL_CURSORCLASS'] = "DictCursor"
CORS(app)


mysql = MySQL(app)


# Routes
@app.route('/')
def root():
    query = "SELECT * FROM Patients;"
    cur = mysql.connection.cursor()
    cur.execute(query)
    # cur.execute(query2)
    # cur.execute(query3)
    # cur.execute(query4)
    results = cur.fetchall()

    return jsonify(results)

@app.route('/Patients', methods=['GET'])
def patients():
    query = "SELECT * FROM Patients;"
    cur = mysql.connection.cursor()
    cur.execute(query)
    # cur.execute(query2)
    # cur.execute(query3)
    # cur.execute(query4)
    results = cur.fetchall()

    return jsonify(results)

@app.route('/Employees')
def employees():
    query = "SELECT * FROM Employees;"
    cur = mysql.connection.cursor()
    cur.execute(query)

    # cur.execute(query2)
    # cur.execute(query3)
    # cur.execute(query4)
    results = cur.fetchall()

    return json.dumps(str(results))

@app.route('/Schedules', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def schedules():
    if request.method == 'GET':
        query = "SELECT * FROM Schedules;"
        cur = mysql.connection.cursor()
        cur.execute(query)

    elif request.method == 'PUT':
        print(request.get_json())
        query1 = """INSERT INTO Schedules(
                    date,
                    time_slot,
                    Procedures_procedure_name
                    )VALUES(
                    '2023-08-10 08:00:00',
                    60,
                    "Women\'s Health Exam"
                    );"""
        query2  = """SET @last_schedule_ID = LAST_INSERT_ID();"""
        query3 = """INSERT INTO Patients_has_Schedule(
                    Patients_patient_id,
                    Schedule_slot_id
                    )VALUES(
                    2,
                    @last_schedule_ID
                    );"""
        query4 = """INSERT INTO Employees_has_Schedule(
                    Employees_employee_id,
                    Schedule_slot_id
                    )VALUES(
                    5,
                    @last_schedule_ID
        );"""
        try: 
            cur = mysql.connection.cursor()
            cur.execute(query1)
            cur.execute(query2)
            cur.execute(query3)
            cur.execute(query4)

        except Exception as e:
            print(f"Error executing SQL in 'PUT' Method: {e}")
    
    # cur.execute(query4)
    results = cur.fetchall()

    return json.dumps(str(results))

# Listener
if __name__ == "__main__":
    #Start the app on port 3000, it will be different once hosted
    app.run(host='classwork.engr.oregonstate.edu', port=4549, debug=True)
    #app.run()


