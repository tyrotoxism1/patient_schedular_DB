import JsonDataDisplay from './table';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import EditableTable from './EditableTable';
import EditableCell from './EditableCell';
import { DeleteIcon } from '@chakra-ui/icons'
import { createNewTableContext } from './TableDataContext';
export default function Department() {
  const [update_department_id, set_update_department_id] = useState('');
  const [update_department_new_name, set_update_department_new_name] = useState('');
  const [create_department_new_name, set_create_department_new_name] = useState('');
  const [delete_department_id, set_delete_department_id] = useState('');
  const [department_data, set_department_data] = useState([]);
  const [message, setMessage] = useState('');
  const [data, setData] = useState([]);
  const [initialData, setInitialData] = useState([]);


  const { TableDataProvider, useTableData } = createNewTableContext();


  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = import.meta.env.VITE_API_URL + "Departments";
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

    fetchData(); 
  }, []); // Empty dependency array ensures useEffect runs only once on mount


  const handleDeleteRow = async (departmentID) => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Departments";
      const response = await axios.delete(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          department_id: departmentID
        }
      });
      console.log('Row deleted:', response.data);

      // Update the table data (remove the deleted row)
      const updatedData = initialData.filter((row) => row.department_id !== departmentID);
      setInitialData(updatedData);
    } catch (error) {
      console.error('API request error:', error);
      // Handle error (e.g., show error message to the user)
    }
  };


  const columns = [
    {
      accessorKey: 'department_id',
      header: 'Department ID',
      cell: (props) => <p>{props.getValue()}</p>,
      editable: false,
      isNew: false
    },
    {
      accessorKey: 'name',
      header: 'Department Name',
      cell: (props) => <EditableCell {...props} endpoint="Departments" />,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'delete_row',
      header: '',
      cell: (props) => (
        <DeleteIcon
          onClick={() => handleDeleteRow(props.row.original.department_id)} // Call handleDeleteRow function
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
        <h1>Department Management</h1>
      </header>
      <div className="App-body">
        <TableDataProvider initialData={initialData}>
          <EditableTable endpoint={'Departments'} columns={columns} />
        </TableDataProvider>
      </div >
    </div>

  );
}