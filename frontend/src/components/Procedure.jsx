import JsonDataDisplay from './table';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import EditableTable from './EditableTable';
import EditableCell from './EditableCell';
import { DeleteIcon } from '@chakra-ui/icons'
import { createNewTableContext } from './TableDataContext';
export default function Procedure() {
  const [update_procedure_old_name, set_update_procedure_old_name] = useState('');
  const [update_procedure_new_name, set_update_procedure_new_name] = useState('');
  const [create_procedure_new_name, set_create_procedure_new_name] = useState('');
  const [create_procedure_duration, set_create_procedure_duration] = useState('');
  const [create_procedure_required_role, set_create_procedure_required_role] = useState('');
  const [delete_procedure_name, set_delete_procedure_name] = useState('');
  const [procedure_data, set_procedure_data] = useState([]);
  const [message, setMessage] = useState('');
  const [initialData, setInitialData] = useState([]);


  const { TableDataProvider, useTableData } = createNewTableContext();


  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = import.meta.env.VITE_API_URL + "Procedures";
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


  const handleDeleteRow = async (procedure_name) => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Procedures";
      const response = await axios.delete(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          procedure_name: procedure_name
        }
      });
      console.log('Row deleted:', response.data);

      // Update the table data (remove the deleted row)
      const updatedData = initialData.filter((row) => row.procedure_name!== procedure_name);
      setInitialData(updatedData);
    } catch (error) {
      console.error('API request error:', error);
      // Handle error (e.g., show error message to the user)
    }
  };

  const columns = [
    {
      accessorKey: 'procedure_name',
      header: 'Procedure Name',
      cell: (props) => <p>{props.getValue()}</p>,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: (props) => <EditableCell {...props} endpoint="Procedures" />,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'required_role',
      header: 'Required Role',
      cell: (props) => <EditableCell {...props} endpoint="Procedures" />,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'delete_row',
      header: '',
      cell: (props) => (
        <DeleteIcon
          onClick={() => handleDeleteRow(props.row.original.procedure_name)} // Call handleDeleteRow function
          cursor="pointer"
          color="red.500"
        />
      ),
      editable: false,
      isNew: false
    }
  ]




  const fetchProcedures = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Proceudres";
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
      name: update_procedure_name, // Ensure backend expects this format
      duration: update_procedure_new_duration, // Ensure backend expects this format
      required_role: update_procedure_new_required_role, // Ensure backend expects this format
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
      name: create_department_new_name, // Ensure backend expects this format
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
          name: delete_procedure_name
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
        <TableDataProvider initialData={initialData}>
          <EditableTable endpoint={'Procedures'} columns={columns} />
        </TableDataProvider>
      </div >
    </div>

  );
}