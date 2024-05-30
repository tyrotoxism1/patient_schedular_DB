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

@app.route('/Departments', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def departments():
    try:
        if request.method == 'GET':
            query = "SELECT * FROM Departments;"  
            cur = mysql.connection.cursor()
            cur.execute(query)
            results = cur.fetchall()
            cur.close()
            return jsonify(results)  
        # Update department name based on incoming department id
        elif request.method == 'PUT':
            print(f"Incoming PUT data: {request.get_json()}")
            data = request.get_json()
            department_id = int(data.get('update_department_id'))
            department_new_name = data.get('update_department_new_name')
            query = f"UPDATE Departments SET name = %s WHERE department_id = %s;"
            print(f"Query: {query}")
            cur = mysql.connection.cursor()
            cur.execute(query, (department_new_name,department_id))
            mysql.connection.commit()
            results = cur.fetchall()
            print(f"Result: {results}")
            cur.close() 
            return json.dumps(str(results))
        # Create new department, id is automactically created so just need name
        elif request.method == 'POST':
            print(f"Incoming POST data: {request.get_json()}")
            data = request.get_json()
            department_new_name = data.get('create_department_new_name')
            query = "INSERT INTO Departments(name) VALUES (%s);"
            print(f"Query: {query}")
            cur = mysql.connection.cursor()
            cur.execute(query, (department_new_name,))
            mysql.connection.commit()
            department_id = cur.lastrowid
            cur.close() 
            return jsonify({"message": "Department created successfully", "department_id": department_id}), 201

        elif request.method == 'DELETE':
            print(f"Incoming DELETE data: {request.get_json()}")
            data = request.get_json()
            department_id = int(data.get('delete_department_id'))
            query = f"DELETE FROM Departments WHERE department_id = %s;"
            print(f"Query: {query}")
            cur = mysql.connection.cursor()
            cur.execute(query, (department_id,))
            mysql.connection.commit()
            results = cur.fetchall()
            print(f"Result: {results}")
            cur.close() 
            return json.dumps(str(results))
        else: 
            return "Invalid Request Method", 405
    except Exception as e:
        print(f"Err in executing SQL for Departments endpoint:\n{e}")
        return jsonify(error=str(e)),500
    if(cur):
        cur.close()
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
    app.run(host='classwork.engr.oregonstate.edu', port=4539, debug=True)
    #app.run()


