from flask import Blueprint, json,jsonify, request
from flask_mysqldb import MySQL 
import random

mysql = MySQL()
schedule_page = Blueprint('schedule_page',__name__)

def grab_rand_employee_id() -> int:
    cur = mysql.connection.cursor()
    query = "SELECT employee_id FROM Employees"
    cur.execute(query)
    results = cur.fetchall()
    cur.close()
    # REF for grabbing random item from list https://stackoverflow.com/questions/1058712/how-do-i-select-a-random-element-from-an-array-in-python
    return random.choice(results)




@schedule_page.route('/Schedules', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def schedules():
    if request.method == 'GET':
        query = "SELECT * FROM Schedules;"
        cur = mysql.connection.cursor()
        cur.execute(query)
        results = cur.fetchall()
        cur.close()
        return jsonify(results)
    elif request.method == 'POST':
        print(f"Incoming POST data: {request.get_json()}")
        data = request.get_json()
        schedule_patient_name = data.get('name')
        schedule_date = data.get('date')
        schedule_procedure = data.get('procedure')
        employee_id = grab_rand_employee_id()
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

            mysql.connection.commit()
            cur.close() 
            return jsonify({"message": "Schedule created successfully"}), 201
        except Exception as e:
            cur.close()
            print(f"Error executing SQL in 'PUT' Method: {e}")




    elif request.method == 'PUT':
        print(request.get_json())
        query1 = """INSERT INTO Schedules(
                    date,
                    time_slot,
                    Procedures_procedure_name
                    )VALUES(
                    %s,
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