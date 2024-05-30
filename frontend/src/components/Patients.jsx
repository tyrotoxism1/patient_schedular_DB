import JsonDataDisplay from './table';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Patient() {
const [update_patient_id, set_update_patient_id] = useState('');
const [update_patient_new_name, set_update_patient_new_name] = useState('');
const [create_patient_new_name, set_create_patient_new_name] = useState('');
const [delete_patient_id, set_delete_patient_id] = useState('');
const [patient_data, set_patient_data] = useState([]);
const [message, setMessage] = useState('');

const fetchPatients = async () => {
  try {
    const URL = import.meta.env.VITE_API_URL + "Patients";
    const response = await axios.get(URL, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
    set_patient_data(response.data);
  } catch (error) {
    console.error('Error:', error);
    setMessage('An error occurred while getting the patients.');
  }
};

useEffect(() => {
  fetchPatients();
}, []);

const handleUpdatePatient = async () => {
  const data = {
    id: update_patient_id, // Ensure backend expects this format
    name: update_patient_new_name, // Ensure backend expects this format
  };
  try {
    const URL = import.meta.env.VITE_API_URL + "Patients";
    await axios.put(URL, data, {
      headers: {
        'Content-Type': 'application/json'
      },
    });

    setMessage('Patient updated successfully!');
    fetchPatients();
  } catch (error) {
    console.error('Error:', error);
    setMessage('An error occurred while updating the patient.');
  }
};

const handleCreatePatient = async () => {
  const data = {
    name: create_patient_new_name, // Ensure backend expects this format
  };
  try {
    const URL = import.meta.env.VITE_API_URL + "Patients";
    await axios.post(URL, data, {
      headers: {
        'Content-Type': 'application/json'
      },
    });

    setMessage('New patient created successfully!');
    fetchPatients();
  } catch (error) {
    console.error('Error:', error);
    setMessage('An error occurred while creating the new patient.');
  }
};

const handleDeletePatient = async () => {
  try {
    const URL = import.meta.env.VITE_API_URL + "Patients";
    await axios.delete(URL, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        delete_patient_id
      },
    });

    setMessage('Patient deleted successfully!');
    fetchPatients();
  } catch (error) {
    console.error('Error:', error);
    setMessage('An error occurred while deleting the patient.');
  }
};

const handleGetPatients = async () => {
  fetchPatients();
};
    return (
        <div>
            <header className="App-header">
                <h1>Patient Management</h1>
            </header>
            <div className="App-body">
                <div className="right-half">
                    <h2>Patient Table</h2>
                    <JsonDataDisplay JSONdata={patient_data} endpoint={"Patients"} />
                </div>

                <div className="left-half">
                    <h2>Update Patients</h2>
                    <input
                        type="number"
                        placeholder="Patient ID"
                        value={update_patient_id}
                        onChange={(e) => set_update_patient_id(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="New Patient Name"
                        value={update_patient_new_name}
                        onChange={(e) => set_update_patient_new_name(e.target.value)}
                    />
                    <button onClick={handleUpdatePatient}>Update Patient</button>
                    {message && <p>{message}</p>}

                    <h2>Create Patient</h2>
                    <input
                        type="text"
                        placeholder="Patient Name"
                        value={create_patient_new_name}
                        onChange={(e) => set_create_patient_new_name(e.target.value)}
                    />
                    <button onClick={handleCreatePatient}>Create New Patient</button>
                    {message && <p>{message}</p>}

                    <h2>Get Patients</h2>
                    <button onClick={handleGetPatients}>Get Patients</button>
                    {message && <p>{message}</p>}

                    <h2>Delete Patient</h2>
                    <input
                        type="number"
                        placeholder="Patient ID"
                        value={delete_patient_id}
                        onChange={(e) => set_delete_patient_id(e.target.value)}
                    />
                    <button onClick={handleDeletePatient}>Delete Patient</button>
                    {message && <p>{message}</p>}
                </div>
            </div >
        </div >

    );
}