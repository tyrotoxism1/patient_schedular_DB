from flask import Blueprint, jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
employee_has_schedule_page= Blueprint('employee_has_schedule_page',__name__)

@employee_has_schedule_page.route('/Employee_has_Schedule', methods = ['GET'])
def employee_has_scheudule():
    try: 
        if request.method == 'GET':
            query = "SELECT * FROM Employees_has_Schedule;"  
            cur = mysql.connection.cursor()
            cur.execute(query)
            results = cur.fetchall()
            cur.close()
            return jsonify(results)  
        else: 
             return "Invalid Request Method", 405

    except Exception as e:
        print(f"Err in executing SQL for 'Employee_has_Schedule' endpoint:\n{e}")
        return jsonify(error=str(e)),500


