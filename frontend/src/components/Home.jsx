import React from 'react';

const Home = () => {
    return (
        <div>
        <h1>MedCare Clinic Patient Scheduler</h1>
        <h2>Home Page for Team 39</h2>
        <p>Authors: Seongyeong Ju and Micah Jazen</p>
        <article>
            <p><strong>Employees</strong>: Displays list of all employees, click here to add or remove employees</p>
            <p><strong>Employee-Schedule</strong>: Displays list of employee ID's to the corresponding schedule slot ID</p>
            <p><strong>Patients</strong>: Displays list of all patients, click here to add or remove patients</p>
            <p><strong>Patient-Schedule</strong>: Displays list of patient ID's to the corresponding schedule slot ID</p>
            <p><strong>Departments</strong>: Click here to view all departments in the clinic</p>
            <p><strong>Procedures</strong>: Click here to view all available procedures</p>
            <p><strong>Schedules</strong>: Displays complete schedule of clinic, click here to create or cancel a scheduled appointment</p>
        </article>
        
        </div>
    );
};
 export default Home 
