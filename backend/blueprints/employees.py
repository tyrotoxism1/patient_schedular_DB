from flask import Blueprint, jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
employee_page = Blueprint('employee_page',__name__)

def execute_update_query(mysql_cur:MySQL, employee_id:int, employee_new_name, employee_new_role):
    query = ""
    if(not employee_id):
        return  
    # If we have both valid params for updating employee
    if(employee_new_name!="" and employee_new_role!=""):
        query = "UPDATE Employees SET name=%s,role=%s WHERE employee_id=%s;"
        mysql_cur.execute(query, (employee_new_name,employee_new_role,employee_id))
        return "Success"
    # If we only get valid name and no email 
    elif(employee_new_name!="" and employee_new_role==""):
        query = "UPDATE Employees SET name=%s WHERE employee_id=%s;"
        mysql_cur.execute(query, (employee_new_name,employee_id))
        return "Success"
    # If we only get valid email and no name 
    elif(employee_new_name=="" and employee_new_role!=""):
        query = "UPDATE Employees SET role=%s WHERE employee_id=%s;"
        mysql_cur.execute(query, (employee_new_role,employee_id))
        return "Success"


@employee_page.route('/Employees', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def employees():
    try: 
        if request.method == 'GET':
            query = "SELECT * FROM Employees;"  
            cur = mysql.connection.cursor()
            cur.execute(query)
            results = cur.fetchall()
            cur.close()
            return jsonify(results)  
        # Update employee based on employee id 
        elif request.method == 'PUT':
            data = request.get_json()
            if(data.get('id')==''):
                return jsonify(error="Failed to provide Employee ID")
            employee_id= int(data.get('id'))
            employee_new_name = data.get('name')
            employee_new_role = data.get('role')

            cur = mysql.connection.cursor()
            query_exec_result = execute_update_query(cur,employee_id,employee_new_name, employee_new_role)
            if(query_exec_result==None):
                raise Exception("Executing Employee Update Query Failed")
            elif(query_exec_result == "Success"):
                mysql.connection.commit()
            results = cur.fetchall()
            cur.close() 
            return jsonify(results)
        elif request.method == 'POST':
            print(f"Incoming POST data: {request.get_json()}")
            data = request.get_json()
            employee_new_name = data.get('name')
            employee_new_role = data.get('role')
            employee_new_department = int(data.get('department'))
            query = "INSERT INTO Employees(name,role,Departments_department_id) VALUES (%s,%s,%s);"
            print(f"Query: {query}")
            cur = mysql.connection.cursor()
            cur.execute(query, (employee_new_name,employee_new_role,employee_new_department))
            mysql.connection.commit()
            patient_id = cur.lastrowid
            cur.close() 
            return jsonify({"message": "procedure created successfully", "procedure_id": patient_id}), 201
        elif request.method == 'DELETE':
            data = request.get_json()
            employee_id = int(data.get('id'))
            query = f"DELETE FROM Employees WHERE employee_id = %s;"
            print(f"Query: {query}")
            cur = mysql.connection.cursor()
            cur.execute(query, (employee_id,))
            mysql.connection.commit()
            results = cur.fetchall()
            cur.close() 
            return jsonify(results)
        else: 
             return "Invalid Request Method", 405





    except Exception as e:
        print(f"Err in executing SQL for Departments endpoint:\n{e}")
        return jsonify(error=str(e)),500


