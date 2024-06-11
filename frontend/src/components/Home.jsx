import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Department from './Departments';
import Employee from './Employees';
import Patient from './Patients';
import Procedure from './Procedure';
import Schedule from './Schedules';
import Employee_has_schedule from './Employee_has_schedule';
import Patient_has_schedule from './Patient_has_schedule';

const Home = () => {
    return (
        <div>
        <br />
        <h1><strong>MedCare Clinic Patient Scheduler</strong></h1>
        <h2>Home Page for Team 39</h2>
        <p>Authors: Seongyeong Ju and Micah Jazen</p>
        <br />
        <article>
            <p><u><Link to="/Employees">Employees</Link></u>: Displays list of all employees, click here to add or remove employees</p>
            <p><u><Link to="/Employee_has_schedule">Employee-Schedule</Link></u>: Displays list of employee ID's to the corresponding schedule slot ID</p>
            <p><u><Link to="/Patients">Patients</Link></u>: Displays list of all patients, click here to add or remove patients</p>
            <p><u><Link to="/Patient_has_schedule">Patient-Schedule</Link></u>: Displays list of patient ID's to the corresponding schedule slot ID</p>
            <p><u><Link to="/Departments">Departments</Link></u>: Click here to view all departments in the clinic</p>
            <p><u><Link to="/Procedures">Procedures</Link></u>: Click here to view all available procedures</p>
            <p><u><Link to="/Schedules">Scheduless</Link></u>: Displays complete schedule of clinic, click here to create or cancel a scheduled appointment</p>
        </article>
        
        </div>
    );
};
 export default Home 
