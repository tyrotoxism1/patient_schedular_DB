from flask import Blueprint, jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
employee_page = Blueprint('employee_page',__name__)

@employee_page.route('/Employees', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def employees():
    try: 
        if request.method == 'GET':
            query = "SELECT * FROM Employees;"  
            cur = mysql.connection.cursor()
            cur.execute(query)
            results = cur.fetchall()
            cur.close()
            print(results)
            return jsonify(results)  

    except Exception as e:
        print(f"Err in executing SQL for Departments endpoint:\n{e}")
        return jsonify(error=str(e)),500


