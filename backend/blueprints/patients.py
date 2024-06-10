from flask import Blueprint, jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
patient_page = Blueprint('patient_page',__name__)

def execute_update_query(mysql_cur:MySQL, patient_id:int, patient_new_name, patient_new_email, patient_new_dob, patient_new_phone_number):
    query = ""
    print(patient_id,patient_new_name,patient_new_email, patient_new_dob, patient_new_phone_number)
    if(not patient_id):
        return  
    query = "UPDATE Patients SET name=%s,date_of_birth=%s,email=%s,phone_number=%s WHERE patient_id=%s;"
    print(query, (patient_new_name,patient_new_dob,patient_new_email,patient_new_phone_number,patient_id))
    mysql_cur.execute(query, (patient_new_name,patient_new_dob,patient_new_email,patient_new_phone_number,patient_id))
    return "Success"
    mysql_cur.execute(query, (patient_new_name,patient_new_dob,patient_new_email,patient_new_phone_number,patient_id))
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
        # Update patient based on patient id 
        elif request.method == 'PUT':
            print(f"Incoming PUT data: {request.get_json()}")
            data = request.get_json()
            patient_id= int(data.get('patient_id'))
            patient_new_dob = data.get('date_of_birth')
            patient_new_name = data.get('name')
            patient_new_email = data.get('email')
            patient_new_phone = data.get('phone_number')

            cur = mysql.connection.cursor()
            query_exec_result = execute_update_query(cur,patient_id,patient_new_name, patient_new_email,patient_new_dob,patient_new_phone)
            if(query_exec_result==None):
                raise Exception("Failed to execute UPDATE query in Patientes endpoint") 
            elif(query_exec_result == "Success"):
                mysql.connection.commit()
            results = cur.fetchall()
            cur.close() 
            return jsonify(results)
        elif request.method == 'POST':
            print(f"Incoming POST data: {request.get_json()}")
            data = request.get_json()
            patient_new_dob = data.get('date_of_birth')
            patient_new_name = data.get('name')
            patient_new_email = data.get('email')
            patient_new_phone = data.get('phone_number')

            query = "INSERT INTO Patients(name,date_of_birth,email,phone_number) VALUES (%s,%s,%s,%s);"
            print(f"Query: {query}")
            cur = mysql.connection.cursor()
            cur.execute(query, (patient_new_name,patient_new_dob,patient_new_email,patient_new_phone))
            mysql.connection.commit()
            patient_id = cur.lastrowid
            cur.close() 
            return jsonify({"message": "procedure created successfully", "procedure_id": patient_id}), 201
        elif request.method == 'DELETE':
            print("Delete data in Patient: ",request.data)
            data = request.get_json()
            patient_id = int(data.get('patient_id'))
            query = f"DELETE FROM Patients WHERE patient_id = %s;"
            print(f"Query: {query}")
            cur = mysql.connection.cursor()
            cur.execute(query, (patient_id,))
            mysql.connection.commit()
            results = cur.fetchall()
            print(f"Result: {results}")
            cur.close() 
            return jsonify(results)
        else: 
             return "Invalid Request Method", 405
 

    except Exception as e:
        print(f"Err in executing SQL for Patients endpoint:\n{e}")
        return jsonify(error=str(e)),500



@patient_page.route('/Patients/Names', methods = ['GET'])
def get_patient_names():
    query = "SELECT name FROM Patients;"  
    cur = mysql.connection.cursor()
    cur.execute(query)
    results = cur.fetchall()
    cur.close()
    return jsonify(results)  
