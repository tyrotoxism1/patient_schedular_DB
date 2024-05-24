import axios from 'axios';
import React, { useState, useEffect } from 'react'

function App() {
  const [department_id, set_department_id] = useState('');
  const [department_new_name, set_department_new_name] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdateDepartment = async () => {
    const data = {
      department_id,
      department_new_name,
    };
     try {
      const URL = import.meta.env.VITE_API_URL + "Departments";
      const response = await axios.put(URL, data, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const result = await response.json();

      setMessage(result.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the departments.');
    } 
  };
  
  const handleCreateDepartment= async () => {
    const data = {
      department_new_name,
    };
     try {
      const URL = import.meta.env.VITE_API_URL + "Departments";
      const response = await axios.post(URL, data, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const result = await response.json();

      setMessage(result.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while Creating new department.');
    }
  };

const handleDeleteDepartment= async () => {
    const data = {
      department_id,
    };
     try {
      const URL = import.meta.env.VITE_API_URL + "Departments";
      const response = await axios.delete(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          department_id
        }
      });

      const result = await response.json();

      setMessage(result.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while deleting the department.');
    }
  };

  const handleGetDepartments = async () => {
     try {
      const URL = import.meta.env.VITE_API_URL + "Departments";
      const response = await fetch(URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      console.log(result)

      setMessage(result.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while getting the departments.');
    }
  };

  
  return (
    <div className="App">
      <header className="App-update_department">
        <h1>Update Departments</h1>
        <input
          type="number"
          placeholder="Department department_id"
          value={department_id}
          onChange={(e) => set_department_id(e.target.value)}
        />
        <input
          type="text"
          placeholder="department_new_name"
          value={department_new_name}
          onChange={(e) => set_department_new_name(e.target.value)}
        />
        <button onClick={handleUpdateDepartment}>Update Department</button>
        {message && <p>{message}</p>}
      </header>
      <div>
        <h1>Create Department</h1>
        <input
          type="text"
          placeholder="Department Name"
          value={department_new_name}
          onChange={(e) => set_department_new_name(e.target.value)}
        />
        <button onClick={handleCreateDepartment}>Create New Department</button>
        {message && <p>{message}</p>}
      </div>
      <div>
        <h1>GET Department</h1>
        <button onClick={handleGetDepartments}>Get Department</button>
        {message && <p>{message}</p>}
      </div>
      <div>
        <h1>Delete Department</h1>
        <input
          type="number"
          placeholder="Department ID"
          value={department_id}
          onChange={(e) => set_department_id(e.target.value)}
        />
        <button onClick={handleDeleteDepartment}>DELETE Department</button>
        {message && <p>{message}</p>}
      </div>

    </div>
  );
}

export default App;
