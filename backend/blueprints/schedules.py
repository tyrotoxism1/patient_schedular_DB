from flask import Blueprint, json,jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
schedule_page = Blueprint('schedule_page',__name__)

@schedule_page.route('/Schedules', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def schedules():
    if request.method == 'GET':
        query = "SELECT * FROM Schedules;"
        cur = mysql.connection.cursor()
        cur.execute(query)
        results = cur.fetchall()
        cur.close()
        return jsonify(results)

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