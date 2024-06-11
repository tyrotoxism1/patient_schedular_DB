import JsonDataDisplay from './table';
import axios from 'axios';
import React, { useState, useEffect } from 'react';



export default function Employee_has_schedule() {
    const [employee_has_schedule_data, set_employee_has_schedule_data] = useState('');
    const [message, setMessage] = useState('');

    const fetchemployee_has_schedules = async () => {
        try {
            const URL = import.meta.env.VITE_API_URL + "Employee_has_Schedule";
            const response = await axios.get(URL, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            set_employee_has_schedule_data(response.data);
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while getting the employee_has_schedules.');
        }
    };

    useEffect(() => {
        fetchemployee_has_schedules();
    }, []);

    const handleGetemployee_has_schedules = async () => {
        fetchemployee_has_schedules();
    };

    const handleGetEmployeeHasSchedules= async () => {
        try {
            const URL = import.meta.env.VITE_API_URL + 'Employee_has_Schedule';
            const response = await axios.get(URL, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            console.log(response.data);
            set_employee_has_schedule_data(response.data);
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while fetching the department names.');
        }
    };
    useEffect(() => {
        handleGetEmployeeHasSchedules();
    }, []);

    return (
        <div>
            <header className="App-header">
                <h1>Employee-Schedule Management</h1>
            </header>
            <div className="App-body">
                <div className="right-half">
                    <h2>Employee-Schedule Table</h2>
                    <JsonDataDisplay JSONdata={employee_has_schedule_data} endpoint={"Employee_has_Schedule"} />
                </div>
            </div >
        </div >

    );
}
