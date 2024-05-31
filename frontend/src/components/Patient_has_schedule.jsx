import JsonDataDisplay from './table';
import axios from 'axios';
import React, { useState, useEffect } from 'react';



export default function Patient_has_schedule() {
    const [patient_has_schedule_data, set_patient_has_schedule_data] = useState('');
    const [message, setMessage] = useState('');

    const fetchpatient_has_schedules = async () => {
        try {
            const URL = import.meta.env.VITE_API_URL + "Patients_has_Schedule";
            const response = await axios.get(URL, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            set_patient_has_schedule_data(response.data);
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while getting the patient_has_schedules.');
        }
    };

    useEffect(() => {
        fetchpatient_has_schedules();
    }, []);

    const handleGetpatient_has_schedules = async () => {
        fetchpatient_has_schedules();
    };

    const handleGetPatientHasSchedules= async () => {
        try {
            const URL = import.meta.env.VITE_API_URL + 'Patients_has_Schedule';
            const response = await axios.get(URL, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            console.log(response.data);
            set_patient_has_schedule_data(response.data);
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while fetching the department names.');
        }
    };
    useEffect(() => {
        handleGetPatientHasSchedules();
    }, []);

    return (
        <div>
            <header className="App-header">
                <h1>patient_has_schedule Management</h1>
            </header>
            <div className="App-body">
                <div className="right-half">
                    <h2>patient_has_schedule Table</h2>
                    <JsonDataDisplay JSONdata={patient_has_schedule_data} endpoint={"Patients_has_Schedule"} />
                </div>

                <div className="left-half">
                    <h2>Get patient_has_schedules</h2>
                    <button onClick={handleGetPatientHasSchedules}>Get patient_has_schedules</button>
                    {message && <p>{message}</p>}

                </div>
            </div >
        </div >

    );
}