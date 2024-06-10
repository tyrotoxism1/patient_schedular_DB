import JsonDataDisplay from './table';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import EditableTable from './EditableTable';
import EditableCell from './EditableCell';
import { DeleteIcon } from '@chakra-ui/icons'
import { createNewTableContext } from './TableDataContext';
  
  
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
  const [initialData, setInitialData] = useState([]);

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = import.meta.env.VITE_API_URL + "Employees";
        const response = await axios.get(URL, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setInitalData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array ensures useEffect runs only once on mount


  const handleDeleteRow = async (employeeID) => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Employees";
      const response = await axios.delete(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          employee_id: employeeID
        }
      });
      console.log('Row deleted:', response.data);

      // Update the table data (remove the deleted row)
      const updatedData = initialData.filter((row) => row.employee_id !== employeeID);
      setInitialData(updatedData);
    } catch (error) {
      console.error('API request error:', error);
      // Handle error (e.g., show error message to the user)
    }
  };


  const columns = [
    {
      accessorKey: 'employee_id',
      header: 'Employee ID',
      cell: (props) => <p>{props.getValue()}</p>,
      editable: false,
      isNew: false
    },
    {
      accessorKey: 'name',
      header: 'Employee Name',
      cell: (props) => <EditableCell {...props} endpoint="Employees" />,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (props) => <EditableCell {...props} endpoint="Employees" />,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: (props) => <EditableCell {...props} endpoint="Employees" />,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'delete_row',
      header: '',
      cell: (props) => (
        <DeleteIcon
          onClick={() => handleDeleteRow(props.row.original.employees_id)} // Call handleDeleteRow function
          cursor="pointer"
          color="red.500"
        />
      ),
      editable: false,
      isNew: false
    }
  ]

  return (
    <div>
      <header className="App-header">
        <h1>Employee Management</h1>
      </header>
      <div className="App-body">
        <TableDataProvider initialData={initialData}>
          <EditableTable endpoint={'Employees'} columns={columns} />
        </TableDataProvider>
      </div >
    </div>

  );
}
