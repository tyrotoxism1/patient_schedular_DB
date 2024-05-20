from flask import Flask, render_template, json, redirect
from flask_mysqldb import MySQL
from flask import request
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

    return "<h1>MySQL Results</h1>" + json.dumps(str(results))

@app.route('/Patients')
def patients():
    query = "SELECT * FROM Patients;"
    cur = mysql.connection.cursor()
    cur.execute(query)
    # cur.execute(query2)
    # cur.execute(query3)
    # cur.execute(query4)
    results = cur.fetchall()

    return "<h1>Patients</h1>" + json.dumps(str(results))

@app.route('/Employees')
def employees():
    query = "SELECT * FROM Employees;"
    cur = mysql.connection.cursor()
    cur.execute(query)
    # cur.execute(query2)
    # cur.execute(query3)
    # cur.execute(query4)
    results = cur.fetchall()

    return "<h1>Patients</h1>" + json.dumps(str(results))

# Listener
if __name__ == "__main__":
    #Start the app on port 3000, it will be different once hosted
    app.run(port=4539, debug=True)

