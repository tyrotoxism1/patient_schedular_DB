-- SELECT EXAMPLES 
-- Basic Select statements for each table 
SELECT * FROM Patients;
SELECT * FROM Employees;
SELECT * FROM Departments; 
SELECT * FROM Procedures;
SELECT * FROM Employee_has_Schedule;
SELECT * FROM Patients_has_Schedule;


-- Views with some more data that's related to eachtother 
SELECT Patients.name as 'Patient name',Employees.name as 'Employee Name' , Schedules.date, Schedules.Procedures_Procedure_name ,Schedules.time_slot as 'Procedure duration' 
from Schedules
INNER JOIN Employees_has_Schedule ON Schedules.slot_id = Employees_has_Schedule.Schedule_slot_id
INNER JOIN Employees ON Employees_has_Schedule.Employees_employee_id = Employees.employee_id
INNER JOIN Patients_has_Schedule ON Schedules.slot_id = Patients_has_Schedule.Schedule_slot_id
INNER JOIN Patients ON Patients_has_Schedule.Patients_patient_id = Patients.patient_id
Order by Schedules.date ASC;


-- Query for add a new character functionality with colon : character being used to 
-- denote the variables that will have data from the backend programming language
-- INSERT new Employee
INSERT INTO Employees (name, role, Departments_department_id) VALUES (:empl_name_input,:empl_role_input, :empl_department_id_input);

-- INSERT new patient
INSERT INTO Patients (name, date_of_birth, email, phone_number) VALUES (:ptnt_name_input, :ptnt_dob_input, :ptnt_email_input, :ptnt_pn_input);

-- INSERT new Schedule slot 
INSERT INTO Schedules(
  date,
  time_slot,
  Procedures_procedure_name
)VALUES(
  ':schdl_date_input',
   :schdl_time_slot_input,
  ':schdl_prcdr_name_input'
);
SET @last_schedule_ID = LAST_INSERT_ID();
INSERT INTO Patients_has_Schedule(
  Patients_patient_id,
  Schedule_slot_id
)VALUES(
  (SELECT Patients.patient_id from Patients where Patients.name = :schdl_patient_name_input),
  @last_schedule_ID
);
INSERT INTO Employees_has_Schedule(
  Employees_employee_id,
  Schedule_slot_id
)VALUES(
  (SELECT Employees.employee_id from Employees where Employees.name = :schdl_empl_name_input),
  @last_schedule_ID
);

-- Insert new Department
INSERT INTO Departments (name) VALUES (:dptmnt_name_insert)

-- Insert new Procedure 
INSERT INTO Procedures (procedure_name, duration, require_role) VALUES (:prcdr_name_insert, :prcdr_drtn_insert, :prcdr_req_rol_insert);


-- Update patient email
UPDATE Patients SET Patients.email = :ptnt_email_updt where Patients.id = (SELECT Patients.id from Patients where Patients.name = :ptnt_name_updt_input);
-- Update employee Department id 
UPDATE Employees SET Employees.Departments_department_id= :empl_dptm_id_updt where Employee.id = (SELECT Employees.id from Employees where Employees.name = :empl_name_updt_input);
--Update Schedule time(M:M relationship)
UPDATE Schedules SET Schedules.date = :schdl_date_updt where Schedules.slot_id = :schdl_slot_id_updt;

-- Delete patient
DELETE FROM Patients WHERE Patients.patient_id = (SELECT patient_id from Patients where name = :ptn_name_dlt_input);
-- Delete Employee 
DELETE FROM Employees WHERE Employees.employee_id = (SELECT employee_id from Employees where name = :empl_name_dlt_input);
-- Delete time slot from Schedule(M:M relationship)
DELETE FROM Schedules WHERE slot_id = :schdl_slot_id_dlt;

