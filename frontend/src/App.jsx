import axios from 'axios';
import React, { useState, useEffect } from 'react';
import JsonDataDisplay from './components/table';
import './App.css';

function App() {
  const [update_department_id, set_update_department_id] = useState('');
  const [update_department_new_name, set_update_department_new_name] = useState('');
  const [create_department_new_name, set_create_department_new_name] = useState('');
  const [delete_department_id, set_delete_department_id] = useState('');
  const [department_data, set_department_data] = useState([]);
  const [message, setMessage] = useState('');

  const fetchDepartments = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Departments";
      const response = await axios.get(URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      set_department_data(response.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while getting the departments.');
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleUpdateDepartment = async () => {
    const data = {
      id: update_department_id, // Ensure backend expects this format
      name: update_department_new_name, // Ensure backend expects this format
    };
    try {
      const URL = import.meta.env.VITE_API_URL + "Departments";
      await axios.put(URL, data, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      setMessage('Department updated successfully!');
      fetchDepartments();
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the department.');
    }
  };

  const handleCreateDepartment = async () => {
    const data = {
      name: create_department_new_name, // Ensure backend expects this format
    };
    try {
      const URL = import.meta.env.VITE_API_URL + "Departments";
      await axios.post(URL, data, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      setMessage('New department created successfully!');
      fetchDepartments();
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while creating the new department.');
    }
  };

  const handleDeleteDepartment = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Departments";
      await axios.delete(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          delete_department_id
        },
      });

      setMessage('Department deleted successfully!');
      fetchDepartments();
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while deleting the department.');
    }
  };

  const handleGetDepartments = async () => {
    fetchDepartments();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Department Management</h1>
      </header>
      <div className="App-body">
        <div className="right-half">
          <h2>Department Table</h2>
          <JsonDataDisplay JSONdata={department_data} />
        </div>

        <div className="left-half">
          <h2>Update Departments</h2>
          <input
            type="number"
            placeholder="Department ID"
            value={update_department_id}
            onChange={(e) => set_update_department_id(e.target.value)}
          />
          <input
            type="text"
            placeholder="New Department Name"
            value={update_department_new_name}
            onChange={(e) => set_update_department_new_name(e.target.value)}
          />
          <button onClick={handleUpdateDepartment}>Update Department</button>
          {message && <p>{message}</p>}

          <h2>Create Department</h2>
          <input
            type="text"
            placeholder="Department Name"
            value={create_department_new_name}
            onChange={(e) => set_create_department_new_name(e.target.value)}
          />
          <button onClick={handleCreateDepartment}>Create New Department</button>
          {message && <p>{message}</p>}

          <h2>Get Departments</h2>
          <button onClick={handleGetDepartments}>Get Departments</button>
          {message && <p>{message}</p>}

          <h2>Delete Department</h2>
          <input
            type="number"
            placeholder="Department ID"
            value={delete_department_id}
            onChange={(e) => set_delete_department_id(e.target.value)}
          />
          <button onClick={handleDeleteDepartment}>Delete Department</button>
          {message && <p>{message}</p>}
        </div>

      </div>
    </div>
  );
}

export default App;
