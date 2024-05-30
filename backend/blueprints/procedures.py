from flask import Blueprint, json, jsonify, request
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
        # Update procedure name based on incoming id
        elif request.method == 'PUT':
            print(f"Incoming PUT data: {request.get_json()}")
            data = request.get_json()
            procedure_old_name = data.get('old_name')
            procedure_new_name = data.get('new_name')
            query = f"UPDATE Procedures SET procedure_name = %s WHERE procedure_name = %s;"
            print(f"Query: {query}")
            cur = mysql.connection.cursor()
            cur.execute(query, (procedure_new_name,procedure_old_name))
            mysql.connection.commit()
            results = cur.fetchall()
            print(f"Result: {results}")
            cur.close() 
            return json.dumps(str(results))
        # Create new procedure, id is automactically created so just need name
        elif request.method == 'POST':
            print(f"Incoming POST data: {request.get_json()}")
            data = request.get_json()
            procedure_new_name = data.get('name')
            procedure_new_duration = data.get('duration')
            procedure_new_require_role = data.get('required_role')
            query = "INSERT INTO Procedures(procedure_name,duration, required_role) VALUES (%s,%s,%s);"
            print(f"Query: {query}")
            cur = mysql.connection.cursor()
            cur.execute(query, (procedure_new_name,procedure_new_duration,procedure_new_require_role,))
            mysql.connection.commit()
            procedure_id = cur.lastrowid
            cur.close() 
            return jsonify({"message": "procedure created successfully", "procedure_id": procedure_id}), 201

        elif request.method == 'DELETE':
            print(f"Incoming DELETE data: {request.get_json()}")
            data = request.get_json()
            procedure_name = data.get('name')
            query = f"DELETE FROM Procedures WHERE procedure_name = %s;"
            print(f"Query: {query}")
            cur = mysql.connection.cursor()
            cur.execute(query, (procedure_name,))
            mysql.connection.commit()
            results = cur.fetchall()
            print(f"Result: {results}")
            cur.close() 
            return json.dumps(str(results))
        else: 
            return "Invalid Request Method", 405


    except Exception as e:
        print(f"Err in executing SQL for procedures endpoint:\n{e}")
        return jsonify(error=str(e)),500


