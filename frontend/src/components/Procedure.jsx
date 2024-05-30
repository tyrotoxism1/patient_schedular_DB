import JsonDataDisplay from './table';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function Procedure() {
const [update_procedure_id, set_update_procedure_id] = useState('');
const [update_procedure_new_name, set_update_procedure_new_name] = useState('');
const [create_procedure_new_name, set_create_procedure_new_name] = useState('');
const [delete_procedure_id, set_delete_procedure_id] = useState('');
const [procedure_data, set_procedure_data] = useState([]);
const [message, setMessage] = useState('');

const fetchProcedures = async () => {
  try {
    const URL = import.meta.env.VITE_API_URL + "Procedures";
    const response = await axios.get(URL, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
    set_procedure_data(response.data);
  } catch (error) {
    console.error('Error:', error);
    setMessage('An error occurred while getting the procedures.');
  }
};

useEffect(() => {
  fetchProcedures();
}, []);

const handleUpdateProcedure = async () => {
  const data = {
    id: update_procedure_id, // Ensure backend expects this format
    name: update_procedure_new_name, // Ensure backend expects this format
  };
  try {
    const URL = import.meta.env.VITE_API_URL + "Procedures";
    await axios.put(URL, data, {
      headers: {
        'Content-Type': 'application/json'
      },
    });

    setMessage('Procedure updated successfully!');
    fetchProcedures();
  } catch (error) {
    console.error('Error:', error);
    setMessage('An error occurred while updating the procedure.');
  }
};

const handleCreateProcedure = async () => {
  const data = {
    name: create_procedure_new_name, // Ensure backend expects this format
  };
  try {
    const URL = import.meta.env.VITE_API_URL + "Procedures";
    await axios.post(URL, data, {
      headers: {
        'Content-Type': 'application/json'
      },
    });

    setMessage('New procedure created successfully!');
    fetchProcedures();
  } catch (error) {
    console.error('Error:', error);
    setMessage('An error occurred while creating the new procedure.');
  }
};

const handleDeleteProcedure = async () => {
  try {
    const URL = import.meta.env.VITE_API_URL + "Procedures";
    await axios.delete(URL, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        delete_procedure_id
      },
    });

    setMessage('Procedure deleted successfully!');
    fetchProcedures();
  } catch (error) {
    console.error('Error:', error);
    setMessage('An error occurred while deleting the procedure.');
  }
};

const handleGetProcedures = async () => {
  fetchProcedures();
};
    return (
        <div>
            <header className="App-header">
                <h1>Procedure Management</h1>
            </header>
            <div className="App-body">
                <div className="right-half">
                    <h2>Procedure Table</h2>
                    <JsonDataDisplay JSONdata={procedure_data} endpoint={"Procedures"} />
                </div>

                <div className="left-half">
                    <h2>Update Procedures</h2>
                    <input
                        type="number"
                        placeholder="Procedure ID"
                        value={update_procedure_id}
                        onChange={(e) => set_update_procedure_id(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="New Procedure Name"
                        value={update_procedure_new_name}
                        onChange={(e) => set_update_procedure_new_name(e.target.value)}
                    />
                    <button onClick={handleUpdateProcedure}>Update Procedure</button>
                    {message && <p>{message}</p>}

                    <h2>Create Procedure</h2>
                    <input
                        type="text"
                        placeholder="Procedure Name"
                        value={create_procedure_new_name}
                        onChange={(e) => set_create_procedure_new_name(e.target.value)}
                    />
                    <button onClick={handleCreateProcedure}>Create New Procedure</button>
                    {message && <p>{message}</p>}

                    <h2>Get Procedures</h2>
                    <button onClick={handleGetProcedures}>Get Procedures</button>
                    {message && <p>{message}</p>}

                    <h2>Delete Procedure</h2>
                    <input
                        type="number"
                        placeholder="Procedure ID"
                        value={delete_procedure_id}
                        onChange={(e) => set_delete_procedure_id(e.target.value)}
                    />
                    <button onClick={handleDeleteProcedure}>Delete Procedure</button>
                    {message && <p>{message}</p>}
                </div>
            </div >
        </div >

    );
}