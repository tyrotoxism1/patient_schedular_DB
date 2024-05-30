from flask import Blueprint, jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
patient_has_schedule_page= Blueprint('patient_has_schedule_page',__name__)

@patient_has_schedule_page.route('/Patients_has_Schedule', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def procedure():
    try: 
        if request.method == 'GET':
            query = "SELECT * FROM Patients_has_Schedule;"  
            cur = mysql.connection.cursor()
            cur.execute(query)
            results = cur.fetchall()
            cur.close()
            return jsonify(results)  

    except Exception as e:
        print(f"Err in executing SQL for Departments endpoint:\n{e}")
        return jsonify(error=str(e)),500


