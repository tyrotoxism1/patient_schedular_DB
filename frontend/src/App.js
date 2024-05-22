import React, { useState, useEffect} from 'react'

function App() {
  const [data, setData] = useState([{}])

 useEffect(() => {
  fetch("/Patients")
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then(data => {
      setData(data);
      console.log(data);
    })
    .catch(error => console.error('Error:', error));
}, []); 
  return (
    <div className='App'>
      <header className='App-header'>
        <h1>React and Flask</h1>
        {data ? <p>{data.message}</p> : <p>Loading...</p>}
      </header>
    </div>
  );
}

export default App;
