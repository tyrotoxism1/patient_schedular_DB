from flask import Blueprint, jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
employee_page = Blueprint('employee_page',__name__)

def execute_update_query(mysql_cur:MySQL, patient_id:int, patient_new_name, patient_new_email):
    query = ""
    if(not patient_id):
        return  
    # If we have both valid params for updating patient
    if(patient_new_name!="" and patient_new_email!=""):
        query = "UPDATE Patients SET name=%s,email=%s WHERE patient_id=%s;"
        mysql_cur.execute(query, (patient_new_name,patient_new_email,patient_id))
        return "Success"
    # If we only get valid name and no email 
    elif(patient_new_name!="" and patient_new_email==""):
        query = "UPDATE Patients SET name=%s WHERE patient_id=%s;"
        mysql_cur.execute(query, (patient_new_name,patient_id))
        return "Success"
    # If we only get valid email and no name 
    elif(patient_new_name=="" and patient_new_email!=""):
        query = "UPDATE Patients SET email=%s WHERE patient_id=%s;"
        mysql_cur.execute(query, (patient_new_email,patient_id))
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
            patient_id= int(data.get('id'))
            patient_new_name = data.get('name')
            patient_new_email = data.get('email')

            cur = mysql.connection.cursor()
            query_exec_result = execute_update_query(cur,patient_id,patient_new_name, patient_new_email)
            if(query_exec_result==None):
                raise Exception("Failed to execute UPDATE query in Patientes endpoint") 
            elif(query_exec_result == "Success"):
                mysql.connection.commit()
            results = cur.fetchall()
            cur.close() 
            return jsonify(results)


    except Exception as e:
        print(f"Err in executing SQL for Departments endpoint:\n{e}")
        return jsonify(error=str(e)),500


