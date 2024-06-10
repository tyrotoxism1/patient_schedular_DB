from flask import Blueprint, json,jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
department_page = Blueprint('department_page',__name__)
@department_page.route('/Departments', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def departments():
     try:
         if request.method == 'GET':
             query = "SELECT * FROM Departments;"  
             cur = mysql.connection.cursor()
             cur.execute(query)
             results = cur.fetchall()
             cur.close()
             return jsonify(results)  
         # Update department name based on incoming department id
         elif request.method == 'PUT':
             print(f"Incoming PUT data: {request.get_json()}")
             data = request.get_json()
             department_id = int(data.get('department_id'))
             department_new_name = data.get('name')
             query = f"UPDATE Departments SET name = %s WHERE department_id = %s;"
             print(f"Query: {query}")
             cur = mysql.connection.cursor()
             cur.execute(query, (department_new_name,department_id))
             mysql.connection.commit()
             results = cur.fetchall()
             print(f"Result: {results}")
             cur.close() 
             return json.dumps(str(results))
         # Create new department, id is automactically created so just need name
         elif request.method == 'POST':
            try:
                print(f"Incoming POST data: {request.get_json()}")
                data = request.get_json()
                department_new_name = data.get('name')
                if(department_new_name==''):
                    raise Exception("New Department Name is Blank. Please Provide Valid Name")
                query = "INSERT INTO Departments(name) VALUES (%s);"
                print(f"Query: {query}")
                cur = mysql.connection.cursor()
                cur.execute(query, (department_new_name,))
                mysql.connection.commit()
                department_id = cur.lastrowid
                cur.close() 
                return jsonify({"message": "Department created successfully", "department_id": department_id}), 201
            except Exception as e:
                return jsonify(error=str(e)),500

         elif request.method == 'DELETE':
             print(f"Incoming DELETE data: {request.get_json()}")
             data = request.get_json()
             department_id = int(data.get('department_id'))
             query = f"DELETE FROM Departments WHERE department_id = %s;"
             print(f"Query: {query}")
             cur = mysql.connection.cursor()
             cur.execute(query, (department_id,))
             mysql.connection.commit()
             results = cur.fetchall()
             print(f"Result: {results}")
             cur.close() 
             return "Sucess", 202  
         else: 
             return "Invalid Request Method", 405
     except Exception as e:
         print(f"Err in executing SQL for Departments endpoint:\n{e}")
         return jsonify(error=str(e)),500



@department_page.route('/Departments/Names', methods = ['GET'])
def department_names():
    query = "SELECT department_id,name FROM Departments;"  
    cur = mysql.connection.cursor()
    cur.execute(query)
    results = cur.fetchall()
    cur.close()
    return jsonify(results)  
