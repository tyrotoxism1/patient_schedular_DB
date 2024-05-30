from flask import Blueprint, jsonify, request
from flask_mysqldb import MySQL 

mysql = MySQL()
home_page = Blueprint('home_page',__name__)
@home_page.route('/')
def root():
    query = "SELECT * FROM Patients;"
    cur = mysql.connection.cursor()
    cur.execute(query)
    # cur.execute(query2)
    # cur.execute(query3)
    # cur.execute(query4)
    results = cur.fetchall()

    return jsonify(results)