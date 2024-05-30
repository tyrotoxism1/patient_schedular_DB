import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Department from './components/Departments';
import Home from './components/Home';
import Employee from './components/Employees';
import Patient from './components/Patients';
import Procedure from './components/Procedure';
import Schedule from './components/Schedules'; 


export default function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Departments">Departments</Link>
            </li>
            <li>
              <Link to="/Employees">Employees</Link>
            </li>
            <li>
              <Link to="/Patients">Patients</Link>
            </li>
            <li>
              <Link to="/Procedures">Procedures</Link>
            </li>
            <li>
              <Link to="/Schedules">Schedules</Link>
            </li>

          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Departments" element={<Department/>} />
          <Route path="/Employees" element={<Employee/>} />
          <Route path="/Patients" element={<Patient/>} />
          <Route path="/Procedures" element={<Procedure/>} />
          <Route path="/Schedules" element={<Schedule/>} />
        </Routes>
      </div>
    </Router>
  );
}

