import JsonDataDisplay from './table';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import EditableTable from './EditableTable';
import EditableCell from './EditableCell';
import DateCell from './DateCell';
import { DeleteIcon } from '@chakra-ui/icons'
import { createNewTableContext } from './TableDataContext';


export default function Patient() {
  const [update_patient_id, set_update_patient_id] = useState('');
  const [update_patient_new_name, set_update_patient_new_name] = useState('');
  const [update_patient_new_email, set_update_patient_new_email] = useState('');
  // const [update_patient_new_DOB, set_update_patient_new_DOB] = useState('');
  const [create_patient_new_name, set_create_patient_new_name] = useState('');
  const [create_patient_new_email, set_create_patient_new_email] = useState('');
  const [create_patient_new_number, set_create_patient_new_number] = useState('');
  const [create_patient_new_DOB, set_create_patient_new_DOB] = useState('');
  const [delete_patient_id, set_delete_patient_id] = useState('');
  const [patient_data, set_patient_data] = useState([]);
  const [message, setMessage] = useState('');
  const { TableDataProvider, useTableData } = createNewTableContext();
  const [initialData, setInitialData] = useState([]);

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = import.meta.env.VITE_API_URL + "Patients";
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


  const handleDeleteRow = async (patientID) => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Patients";
      const response = await axios.delete(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          patient_id: patientID
        }
      });
      console.log('Row deleted:', response.data);

      // Update the table data (remove the deleted row)
      const updatedData = initialData.filter((row) => row.patient_id !== patientID);
      setInitialData(updatedData);
    } catch (error) {
      console.error('API request error:', error);
      // Handle error (e.g., show error message to the user)
    }
  };


  const columns = [
    {
      accessorKey: 'patient_id',
      header: 'Patient ID',
      cell: (props) => <p>{props.getValue()}</p>,
      editable: false,
      isNew: false
    },
    {
      accessorKey: 'name',
      header: 'Patient Name',
      cell: (props) => <EditableCell {...props} endpoint="Patients" />,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'date_of_birth',
      header: 'Date of Birth',
      cell: DateCell, 
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'email',
      header: 'email',
      cell: (props) => <EditableCell {...props} endpoint="Patients" />,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'phone_number',
      header: 'Phone Number',
      cell: (props) => <EditableCell {...props} endpoint="Patients" />,
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
          <EditableTable endpoint={'Patients'} columns={columns} />
        </TableDataProvider>
      </div >
    </div>

  );
}