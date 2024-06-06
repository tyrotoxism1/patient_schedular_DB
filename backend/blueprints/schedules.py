from flask import Blueprint, json,jsonify, request
from flask_mysqldb import MySQL 
import random

mysql = MySQL()
schedule_page = Blueprint('schedule_page',__name__)

def grab_procedure_req_role(procedure_name:str) -> str:
    try:
        cur = mysql.connection.cursor()
        query = "SELECT required_role FROM Procedures WHERE procedure_name=%s"
        cur.execute(query, (procedure_name,))
        #Results should only be 1 value since `procedure_name` column is PK
        results = cur.fetchone()
        cur.close()
        if results:
            return results['required_role']
        else:
            print("No role found for the given procedure.")
            return None
    except Exception as e:
        print(f"Failed to grab procedure required role: {e}")
        return None

def grab_procedure_duration(procedure_name:str) -> int:
    try:
        cur = mysql.connection.cursor()
        query = "SELECT duration FROM Procedures WHERE procedure_name=%s"
        cur.execute(query,(procedure_name,))
        #Result should contain only 1 value since `procedure_name` is FK
        results = (cur.fetchone())['duration']
        cur.close()
        # REF for grabbing random item from list https://stackoverflow.com/questions/1058712/how-do-i-select-a-random-element-from-an-array-in-python
        return int((results))
    except Exception as e:
        print(f"Failed to grab procedure duration: {e}")
        return None

def grab_rand_employee_id(required_role) -> int:
    try:
        cur = mysql.connection.cursor()
        query = "SELECT employee_id FROM Employees WHERE role=%s"
        cur.execute(query, (required_role,))
        results = cur.fetchall()
        rand_employee = random.choice(results)
        rand_employee_id = rand_employee['employee_id']
        print(f"rand employee :{rand_employee_id}")
        cur.close()
        # REF for grabbing random item from list https://stackoverflow.com/questions/1058712/how-do-i-select-a-random-element-from-an-array-in-python
        return int(rand_employee_id)
    except Exception as e:
        print(f"Failed to grab rand employee ID: {e}")
        return None

def grab_patient_id(patient_name:str) -> int:
    try:
        cur = mysql.connection.cursor()
        query = "SELECT patient_id FROM Patients WHERE name=%s"
        cur.execute(query, (patient_name,))
        #TODO: Results could return more than 1 value since name is not unique!
        # We need to add another field for creating schedule such as email to frontend
        # and also make it so the email column for 'Patients' is unique so we can use
        # both name and email to get unique patient and grab the corresponding id

        #For now just grab first result
        results = cur.fetchone()
        results = results['patient_id']
        cur.close()
        return int(results) 
    except Exception as e:
        print(f"Failed to grab patient id: {e}")
        return None


@schedule_page.route('/Schedules', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def schedules():
    if request.method == 'GET':
        query = "SELECT * FROM Schedules;"
        cur = mysql.connection.cursor()
        cur.execute(query)
        results = cur.fetchall()
        cur.close()
        return jsonify(results)

    # Creating schedule
    elif request.method == 'POST':
        print(f"Incoming POST data: {request.get_json()}")
        data = request.get_json()
        #Grab the incoming data params
        schedule_patient_name = data.get('patient_name')
        schedule_date = data.get('date')
        schedule_procedure = data.get('procedure')
        try:
            procedure_req_role = grab_procedure_req_role(schedule_procedure)
            procedure_duration = grab_procedure_duration(schedule_procedure)
            employee_id = grab_rand_employee_id(procedure_req_role)
            patient_id = grab_patient_id(schedule_patient_name)
            print(f"Grab results: req role:{procedure_req_role}, duration: {procedure_duration}, employee_id:{employee_id}, patient_id: {patient_id}")
        except Exception as e:
            print(f"Failed to grab necessary data from helper functions in POST of Schedules\n{e}")
            return jsonify({"message": "Schedule created successfully"}), 501
        query1 = """INSERT INTO Schedules(
                    date,
                    time_slot,
                    Procedures_procedure_name
                    )VALUES(
                    %s,
                    %s,
                    %s 
                    );"""
        query2  = """SET @last_schedule_ID = LAST_INSERT_ID();"""
        query3 = """INSERT INTO Patients_has_Schedule(
                    Patients_patient_id,
                    Schedule_slot_id
                    )VALUES(
                    %s,
                    @last_schedule_ID
                    );"""
        query4 = """INSERT INTO Employees_has_Schedule(
                    Employees_employee_id,
                    Schedule_slot_id
                    )VALUES(
                    %s,
                    @last_schedule_ID
        );"""

        try: 
            cur = mysql.connection.cursor()
            cur.execute(query1,(schedule_date,procedure_duration,schedule_procedure))
            cur.execute(query2)
            cur.execute(query3, (patient_id,))
            cur.execute(query4, (employee_id,))

            mysql.connection.commit()
            cur.close() 
            return jsonify({"message": "Schedule created successfully"}), 201
        except Exception as e:
            cur.close()
            print(f"Error executing SQL in 'POST' Method: {e}")




    elif request.method == 'PUT':
        print(request.get_json())
        query1 = """INSERT INTO Schedules(
                    date,
                    time_slot,
                    Procedures_procedure_name
                    )VALUES(
                    10-10-2001,
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
    else: 
        return "Invalid Request Method", 405
 
  
    # cur.execute(query4)
    results = cur.fetchall()

    return json.dumps(str(results))