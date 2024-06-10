from flask import Flask #render_template, json, jsonify, redirect, request
from flask_mysqldb import MySQL
from flask_cors import CORS
import configparser
#blueprint views
from blueprints.employees import employee_page 
from blueprints.home import home_page 
from blueprints.patients import patient_page 
from blueprints.departments import department_page 
from blueprints.schedules import schedule_page 
from blueprints.procedures import procedure_page 
from blueprints.employee_has_schedule import employee_has_schedule_page 
from blueprints.patients_has_schedule import patient_has_schedule_page 

#Read config data for MySQL login. Takes in return_field which is the desired field retreived from the config.
#pass "user" for user field from config or "ps" for password.
# def read_config(return_field):
#     #Enter your name to retireve the info from config
#     user_name = "micah"
#     return_val = ""
#     config = configparser.ConfigParser()
#     try:
#         config.read("db_user.config")
#         return config[f"Users.{user_name}"][return_field]
#     except FileNotFoundError:
#         print("Check correctl file name or path!")
#         return ""
#     except KeyError:
#         print(f"Check passed field to 'read_config' is correct or config entry for user {user_name}")
#         return ""

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'classmysql.engr.oregonstate.edu'
app.config['MYSQL_USER'] = 'cs340_jus'
app.config['MYSQL_PASSWORD'] = '8494'
app.config['MYSQL_DB'] = 'cs340_jus'
app.config['MYSQL_CURSORCLASS'] = "DictCursor"
CORS(app)
mysql = MySQL(app)
# Blueprint reference https://stackoverflow.com/questions/11994325/how-to-divide-flask-app-into-multiple-py-files and 
# https://flask.palletsprojects.com/en/2.2.x/blueprints/
app.register_blueprint(employee_page)
app.register_blueprint(home_page)
app.register_blueprint(patient_page)
app.register_blueprint(department_page)
app.register_blueprint(schedule_page)
app.register_blueprint(procedure_page)
app.register_blueprint(employee_has_schedule_page)
app.register_blueprint(patient_has_schedule_page)


# Listener
if __name__ == "__main__":
    #Start the app on port 3000, it will be different once hosted
    app.run(host='classwork.engr.oregonstate.edu', port=4247, debug=True)
    #app.run()


