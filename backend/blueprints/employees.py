from flask import Flask, jsonify, request
from app import app, mysql

@app.route('/Employees', methods = ['POST', 'GET', 'PUT', 'DELETE'])
def employees():
    try: 
        if request.method == 'GET':
            query = "SELECT * FROM Departments;"  
            cur = mysql.connection.cursor()
            cur.execute(query)
            results = cur.fetchall()
            cur.close()
            return jsonify(results)  

    except Exception as e:
        print(f"Err in executing SQL for Departments endpoint:\n{e}")
        return jsonify(error=str(e)),500


