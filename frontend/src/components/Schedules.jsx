import JsonDataDisplay from './table';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Dropdown from './dropdown';

export default function Schedule() {
  const [update_schedule_id, set_update_schedule_id] = useState('');
  const [update_schedule_new_name, set_update_schedule_new_name] = useState('');

  const [ProcedureNames, setProcedureNames] = useState([]);
  const [PatientNames, setPatientNames] = useState([]);
  const [createSchedulePatient, setCreateSchedulePatient] = useState('');
  const [createScheduleProcedure, setCreateScheduleProcedure] = useState('');
  const [createScheduleDate, setCreateScheduleDate] = useState('');
  const [delete_schedule_id, set_delete_schedule_id] = useState('');
  const [schedule_data, set_schedule_data] = useState([]);
  const [message, setMessage] = useState('');

  const fetchSchedules = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Schedules";
      const response = await axios.get(URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      set_schedule_data(response.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while getting the schedules.');
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleGetProcedureNames = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + 'Procedures/Names';
      const response = await axios.get(URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data)
      setProcedureNames(response.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while fetching the department names.');
    }
  };
  useEffect(() => {
    handleGetProcedureNames();
  }, []);

const handleGetPatientNames = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + 'Patients/Names';
      const response = await axios.get(URL, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data)
      setPatientNames(response.data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while fetching the department names.');
    }
  };
  useEffect(() => {
    handleGetPatientNames();
  }, []);



  const handleUpdateSchedule = async () => {
    const data = {
      id: update_schedule_id, // Ensure backend expects this format
      name: update_schedule_new_name, // Ensure backend expects this format
    };
    try {
      const URL = import.meta.env.VITE_API_URL + "Schedules";
      await axios.put(URL, data, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      setMessage('Schedule updated successfully!');
      fetchSchedules();
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while updating the schedule.');
    }
  };

  const handleCreateSchedule = async () => {
    const data = {
      patient_name: createSchedulePatient,
      date: createScheduleDate,
      procedure: createScheduleProcedure
    };
    try {
      const URL = import.meta.env.VITE_API_URL + "Schedules";
      await axios.post(URL, data, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      setMessage('New schedule created successfully!');
      fetchSchedules();
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while creating the new schedule.');
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + "Schedules";
      await axios.delete(URL, {
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          delete_schedule_id
        },
      });

      setMessage('Schedule deleted successfully!');
      fetchSchedules();
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while deleting the schedule.');
    }
  };

  // For drop down menu selection, capture selected value
  const handleSelectedProcedureChange = (selectedValue) => {
    setCreateScheduleProcedure(selectedValue)
  };
  // For drop down menu selection, capture selected value
  const handleSelectedPatientChange = (selectedValue) => {
    setCreateSchedulePatient(selectedValue)
  };

  const handleGetSchedules = async () => {
    fetchSchedules();
  };
  return (
    <div>
      <header className="App-header">
        <h1>Schedule Management</h1>
      </header>
      <div className="App-body">
        <div className="right-half">
          <h2>Schedule Table</h2>
          <JsonDataDisplay JSONdata={schedule_data} endpoint={"Schedules"} />
        </div>

        <div className="left-half">
          <h2>Get Schedules</h2>
          <button onClick={handleGetSchedules}>Get Schedules</button>
          {message && <p>{message}</p>}

          <h2>Create Appoitment</h2>
          <input
            type='date'
            placeholder='Date of appoitnment'
            value={createScheduleDate}
            onChange={(e) => setCreateScheduleDate(e.target.value)}
          />
          <Dropdown optionArr={ProcedureNames} onSelectChange={handleSelectedProcedureChange}/>
          <Dropdown optionArr={PatientNames} onSelectChange={handleSelectedPatientChange}/>
          
          <button onClick={handleCreateSchedule}>Create Appoitment</button>
          {message && <p>{message}</p>}


        </div>
      </div >
    </div >

  );
}