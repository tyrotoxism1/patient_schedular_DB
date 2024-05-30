from flask import Blueprint, jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
patient_page = Blueprint('patient_page',__name__)

@patient_page.route('/Patients', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def patients():
    try: 
        if request.method == 'GET':
            query = "SELECT * FROM Patients;"  
            cur = mysql.connection.cursor()
            cur.execute(query)
            results = cur.fetchall()
            cur.close()
            return jsonify(results)  

    except Exception as e:
        print(f"Err in executing SQL for Departments endpoint:\n{e}")
        return jsonify(error=str(e)),500


