import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Department from './components/Departments';
import Home from './components/Home';
import Employee from './components/Employees';
import Patient from './components/Patients';
import Procedure from './components/Procedure';
import Schedule from './components/Schedules';
import Employee_has_schedule from './components/Employee_has_schedule';
import Patient_has_schedule from './components/Patient_has_schedule';
import EditableTable from './components/EditableTable'
import EditableCell from './components/EditableCell';
import DateCell from './components/DateCell';
import { Icon } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons'



const DATA = [
  {
    "date_of_birth": "Sat, 02 Mar 1985 00:00:00 GMT", "email": "bob.smith@gmail.com", "name": "Bob Smith", "patient_id": 1, "phone_number": "123-234-3456"
  },
  {
    "date_of_birth": "Tue, 03 Feb 1981 00:00:00 GMT", "email": "clarkchris@gmail.com", "name": "Chris Clark", "patient_id": 2, "phone_number": "234-345-4567"
  },
  {
    "date_of_birth": "Thu, 10 Sep 1981 00:00:00 GMT", "email": "bob.smith@gmail.com", "name": "Joan Hill", "patient_id": 3, "phone_number": "161-345-2534"
  },
  {
    "date_of_birth": "Thu, 06 May 1976 00:00:00 GMT", "email": "roberts.paul@gmail.com", "name": "Paul Roberts", "patient_id": 4, "phone_number": "090-465-2843"
  },
  {
    "date_of_birth": "Sat, 17 Aug 1991 00:00:00 GMT", "email": "scott.michael@gmail.com", "name": "Michael Scott", "patient_id": 5, "phone_number": "360-295-4814"
  }
];

const columns = [
  {
    accessorKey: 'date_of_birth',
    header: 'DOB',
    cell: DateCell,
    isNewRow: false
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: (props) => <EditableCell {...props} endpoint="Patients" />,
    isNewRow: false
  },
  {
    accessorKey: 'patient_id',
    header: 'Patient ID',
    cell: (props) => <p>{props.getValue()}</p>,
    isNewRow: false

  },
  {
    accessorKey: 'phone_number',
    header: 'Phone Number',
    cell: (props) => <p>{props.getValue()}</p>,
    isNewRow: false
  },
  {
    accessorKey: 'delete_row',
    header: '',
    cell: (props) => (
      <DeleteIcon
        onClick={() => handleDeleteRow(props.row.original.patient_id)} // Call handleDeleteRow function
        cursor="pointer"
        color="red.500"
      />
    ),
    isNewRow: false
  }
]

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
            <li>
              <Link to="/Employee_has_Schedule">Employee-Schedule</Link>
            </li>
            <li>
              <Link to="/Patient_has_Schedule">Patient-Schedule</Link>
            </li>
            <li>
              <Link to="/Testing">Testing</Link>
            </li>


          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Departments" element={<Department />} />
          <Route path="/Employees" element={<Employee />} />
          <Route path="/Patients" element={<Patient />} />
          <Route path="/Procedures" element={<Procedure />} />
          <Route path="/Schedules" element={<Schedule />} />
          <Route path="/Employee_has_Schedule" element={<Employee_has_schedule />} />
          <Route path="/Patient_has_Schedule" element={<Patient_has_schedule />} />
          <Route path="/Testing" element={<EditableTable columns={columns} />} />
        </Routes>
      </div>
    </Router>
  );
}

