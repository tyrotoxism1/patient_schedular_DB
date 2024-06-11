from flask import Blueprint, json,jsonify, request
from flask_mysqldb import MySQL 
from datetime import datetime
import random

mysql = MySQL()
schedule_page = Blueprint('schedule_page',__name__)

def grab_patient_name(schedule_slot_id:int) -> str:
    try:
        cur = mysql.connection.cursor()
        query = "SELECT required_role FROM Procedures WHERE procedure_name=%s"
        cur.execute(query, (schedule_slot_id,))
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

def grab_patient_id(schedule_slot_id:int) -> int:
    try:
        cur = mysql.connection.cursor()
        query = "SELECT Patients_patient_id FROM Patients_has_Schedule WHERE Schedule_slot_id=%s"
        cur.execute(query, (schedule_slot_id,))
        #Since schedule_id is unique should only get one result from query
        # but to be sure, use fetchone
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
         # Format the datetime columns
        formatted_results = []
        for row in results:
            formatted_row = {}
            for key, value in row.items():
                if isinstance(value, datetime):
                    formatted_row[key] = value.strftime('%Y-%m-%d %H:%M:%S')
                else:
                    formatted_row[key] = value
            formatted_results.append(formatted_row)
        return jsonify(formatted_results)

    # Creating schedule
    elif request.method == 'POST':
        print(f"Incoming POST data: {request.get_json()}")
        data = request.get_json()
        #Grab the incoming data params
        schedule_slot_id = data.get('time')
        schedule_date = data.get('date')
        schedule_procedure = data.get('procedure')
        try:
            patient_name = grab_patient_name(schedule_slot_id)
            procedure_req_role = grab_procedure_req_role(schedule_procedure)
            procedure_duration = grab_procedure_duration(schedule_procedure)
            employee_id = grab_rand_employee_id(procedure_req_role)
            patient_id = grab_patient_id(schedule_slot_id)
            print(f"Grab results: req role:{procedure_req_role}, duration: {procedure_duration}, employee_id:{employee_id}, patient_id: {patient_id}")
        except Exception as e:
            print(f"Failed to grab necessary data from helper functions in POST of Schedules\n{e}")
            return jsonify({"message": "Failed to create Schedule! "}), 501
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
        data = request.get_json()
        schedule_slot_id = data.get('slot_id')
        schedule_date = data.get('date')
        schedule_date= schedule_date.replace('GMT','')
        print(schedule_date)
        schedule_procedure = data.get('Procedures_procedure_name')
        try:
            schedule_time_slot = grab_procedure_duration(schedule_procedure)
        except Exception as e:
            print(f"Failed to grab necessary data from helper functions in POST of Schedules\n{e}")
            return jsonify({"message": "Failed to create Schedule! "}), 501
 
        query = "UPDATE Schedules SET date=%s,time_slot=%s,Procedures_procedure_name=%s WHERE slot_id=%s"
        try: 
            cur = mysql.connection.cursor()
            cur.execute(query, (schedule_date,schedule_time_slot,schedule_procedure,schedule_slot_id))
            mysql.connection.commit()
        except Exception as e:
            print(f"Error executing SQL in 'PUT' Method: {e}")

    elif request.method == 'DELETE':
        print("Delete data in Schedules: ",request.data)
        data = request.get_json()
        slot_id = int(data.get('slot_id'))
        query = f"DELETE FROM Schedules WHERE slot_id = %s;"
        print(f"Query: {query}")
        cur = mysql.connection.cursor()
        cur.execute(query, (slot_id,))
        mysql.connection.commit()
        results = cur.fetchall()
        print(f"Result: {results}")
        cur.close() 
        return jsonify(results)
 
    else: 
        return "Invalid Request Method", 405
 
  
    # cur.execute(query4)
    results = cur.fetchall()

    return json.dumps(str(results))