import React, { useState, useEffect } from 'react'

function App() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async () => {
    const data = {
      id,
      name,
      time,
      date
    };
     try {
      const response = await fetch('/Schedules', {
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
      setMessage('An error occurred while updating the schedule.');
    }
  };

  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Update Schedule</h1>
        <input
          type="text"
          placeholder="Schedule ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={handleUpdate}>Update Schedule</button>
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}

export default App;
