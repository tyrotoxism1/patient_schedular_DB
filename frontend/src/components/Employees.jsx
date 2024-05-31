import JsonDataDisplay from './table';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Dropdown from './dropdown';



export default function Employee() {
  const [update_employee_id, set_update_employee_id] = useState('');
  const [update_employee_new_name, set_update_employee_new_name] = useState('');
  const [update_employee_new_role, set_update_employee_new_role] = useState('');
  const [departmentNames, setDepartmentNames] = useState([]);
  const [selectedDepartment,setSelectedDepartment] = useState([]);
  const [create_employee_new_name, set_create_employee_new_name] = useState('');
  const [create_employee_new_role, set_create_employee_new_role] = useState('');
  const [delete_employee_id, set_delete_employee_id] = useState('');
  const [employee_data, set_employee_data] = useState([]);
  const [message, setMessage] = useState('');

  const fetchEmployees = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Employees";
      const response = await axios.get(URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      set_employee_data(response.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while getting the employees.');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleUpdateEmployee = async () => {
    const data = {
      id: update_employee_id, // Ensure backend expects this format
      name: update_employee_new_name, // Ensure backend expects this format
      role: update_employee_new_role,
    };
    try {
      const URL = import.meta.env.VITE_API_URL + "Employees";
      const response = await axios.put(URL, data, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.data.error) {
        setMessage(response.data.error)
      }
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the employee.');
    }
  };

  const handleCreateEmployee = async () => {
    const data = {
      name: create_employee_new_name,
      role: create_employee_new_role,
      department: selectedDepartment,
    };
    try {
      const URL = import.meta.env.VITE_API_URL + "Employees";
      await axios.post(URL, data, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      setMessage('New employee created successfully!');
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while creating the new employee.');
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Employees";
      await axios.delete(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          id: delete_employee_id
        },
      });

      setMessage('Employee deleted successfully!');
      fetchEmployees();
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while deleting the employee.');
    }
  };

  const handleGetEmployees = async () => {
    fetchEmployees();
  };

  const handleGetDepartmentNames = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + 'Departments/Names';
      const response = await axios.get(URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // Transform the data
      const transformedData = response.data.map(department => ({
        value: department.department_id,
        label: department.name
      }));
      setDepartmentNames(transformedData);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while fetching the department names.');
    }
  };
  useEffect(() => {
    handleGetDepartmentNames();
  }, []);

  const handleSelectedChange = (selectedValue) => {
    setSelectedDepartment(selectedValue)
  };

  return (
    <div>
      <header className="App-header">
        <h1>Employee Management</h1>
      </header>
      <div className="App-body">
        <div className="right-half">
          <h2>Employee Table</h2>
          <JsonDataDisplay JSONdata={employee_data} endpoint={"Employees"} />
        </div>

        <div className="left-half">
          <h2>Update Employees</h2>
          <input
            type="number"
            placeholder="Employee ID"
            value={update_employee_id}
            onChange={(e) => set_update_employee_id(e.target.value)}
          />
          <input
            type="text"
            placeholder="New Employee Name"
            value={update_employee_new_name}
            onChange={(e) => set_update_employee_new_name(e.target.value)}
          />
          <input
            type="text"
            placeholder="New Employee Role"
            value={update_employee_new_role}
            onChange={(e) => set_update_employee_new_role(e.target.value)}
          />
          <button onClick={handleUpdateEmployee}>Update Employee</button>
          {message && <p>{message}</p>}

          <h2>Create Employee</h2>
          <input
            type="text"
            placeholder="Employee Name"
            value={create_employee_new_name}
            onChange={(e) => set_create_employee_new_name(e.target.value)}
          />
          <input
            type="text"
            placeholder="Employee Role"
            value={create_employee_new_role}
            onChange={(e) => set_create_employee_new_role(e.target.value)}
          />
          <Dropdown optionArr={departmentNames} onSelectChange={handleSelectedChange} itemLabel={"Department ID: "} />
          <button onClick={handleCreateEmployee}>Create New Employee</button>
          {message && <p>{message}</p>}

          <h2>Get Employees</h2>
          <button onClick={handleGetEmployees}>Get Employees</button>
          {message && <p>{message}</p>}

          <h2>Delete Employee</h2>
          <input
            type="number"
            placeholder="Employee ID"
            value={delete_employee_id}
            onChange={(e) => set_delete_employee_id(e.target.value)}
          />
          <button onClick={handleDeleteEmployee}>Delete Employee</button>
          {message && <p>{message}</p>}
        </div>
      </div >
    </div >

  );
}