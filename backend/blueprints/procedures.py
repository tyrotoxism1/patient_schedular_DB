from flask import Blueprint, jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
procedure_page = Blueprint('procedure_page',__name__)

@procedure_page.route('/Procedures', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def procedure():
    try: 
        if request.method == 'GET':
            query = "SELECT * FROM Procedures;"  
            cur = mysql.connection.cursor()
            cur.execute(query)
            results = cur.fetchall()
            cur.close()
            return jsonify(results)  

    except Exception as e:
        print(f"Err in executing SQL for Departments endpoint:\n{e}")
        return jsonify(error=str(e)),500


