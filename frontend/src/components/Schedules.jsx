import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { DeleteIcon } from '@chakra-ui/icons'
import { createNewTableContext } from './TableDataContext';
import DateCell from './DateCell';
import EditableTable from './EditableTable';
import EditableCell from './EditableCell';



export default function Schedule() {
  const [ProcedureNames, setProcedureNames] = useState([]);
  const [PatientNames, setPatientNames] = useState([]);
  const [createSchedulePatient, setCreateSchedulePatient] = useState('');
  const [createScheduleProcedure, setCreateScheduleProcedure] = useState('');
  const [createScheduleDate, setCreateScheduleDate] = useState('');
  const [updateScheduleDate, setUpdateScheduleDate] = useState('');
  const [updateSchedulePatient, setUpdateSchedulePatient] = useState('');
  const [updateScheduleProcedure, setUpdateScheduleProcedure] = useState('');
  const [delete_schedule_id, set_delete_schedule_id] = useState('');
  const [schedule_data, set_schedule_data] = useState([]);
  const [message, setMessage] = useState('');
  const { TableDataProvider, useTableData } = createNewTableContext();
  const [initialData, setInitialData] = useState([]);


  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const URL = import.meta.env.VITE_API_URL + "Schedules";
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


  const handleDeleteRow = async (scheduleID) => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Schedules";
      const response = await axios.delete(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          slot_id: scheduleID 
        }
      });
      console.log('Row deleted:', response.data);

      // Update the table data (remove the deleted row)
      const updatedData = initialData.filter((row) => row.slot_id !== scheduleID);
      setInitialData(updatedData);
    } catch (error) {
      console.error('API request error:', error);
      // Handle error (e.g., show error message to the user)
    }
  };


  const columns = [
    {
      accessorKey: 'slot_id',
      header: 'Schedule ID',
      cell: (props) => <p>{props.getValue()}</p>,
      editable: false,
      isNew: false
    },
    {
      accessorKey: 'date',
      header: 'Appoitment Date',
      cell: (props) => <DateCell {...props} endpoint="Schedules" addTime={true} />,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'Procedures_procedure_name',
      header: 'Scheduled Procedure',
      cell: (props) => <EditableCell {...props} endpoint="Schedules" />,
      editable: true,
      isNew: false
    },
    {
      accessorKey: 'time_slot',
      header: 'Procedure Duration',
      cell: (props) => <p>{props.getValue()}</p>,
      editable: false,
      isNew: false
    },
    {
      accessorKey: 'delete_row',
      header: '',
      cell: (props) => (
        <DeleteIcon
          onClick={() => handleDeleteRow(props.row.original.slot_id)} // Call handleDeleteRow function
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
        <h1>Schedule Management</h1>
      </header>
      <div className="App-body">
        <TableDataProvider initialData={initialData}>
          <EditableTable endpoint={'Schedules'} columns={columns} />
        </TableDataProvider>
      </div >
    </div>

  );
}