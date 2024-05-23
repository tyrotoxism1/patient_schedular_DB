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
      const response = await fetch('/Departments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
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
      const response = await fetch('/Departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while creating new department.');
    }
  };

const handleDeleteDepartment= async () => {
    const data = {
      department_id,
    };
     try {
      const response = await fetch('/Departments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while Deleting department.');
    }
  };

  const handleGetDepartments = async () => {
     try {
      const response = await fetch('/Departments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        console.log(result)
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while Getting department data.');
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
