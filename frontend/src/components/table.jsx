// Code for forming table from JSON data from https://codingstatus.com/create-dynamic-table-from-json-in-react-js/ 

// JsonDataDisplay.jsx
// JsonDataDisplay.jsx
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function JSONTableDisplay({ JSONdata }) {
    const [data, setData] = useState(JSONdata || []);

    useEffect(() => {
        if (!JSONdata || JSONdata.length === 0) {
            const GetDepartmentData = async () => {
                try {
                    const URL = import.meta.env.VITE_API_URL + "Departments";
                    const response = await axios.get(URL, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    setData(response.data);
                } catch (error) {
                    console.error('Error:', error);
                }
            };
            GetDepartmentData();
        }
    }, [JSONdata]);

    if (!data || data.length === 0) {
        return <div>Loading...</div>;
    }

    const columns = Object.keys(data[0]);
    const TableHeaderData = () => {
        return columns.map((column) => (
            <th key={column}>{column}</th>
        ));
    };

    const TableData = () => {
        return data.map((row, rowIndex) => (
            <tr key={rowIndex}>
                {columns.map((col) => (
                    <td key={col}>{row[col]}</td>
                ))}
            </tr>
        ));
    };

    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        {TableHeaderData()}
                    </tr>
                </thead>
                <tbody>
                    {TableData()}
                </tbody>
            </table>
        </div>
    );
}

export default JSONTableDisplay;
