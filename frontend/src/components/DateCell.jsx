import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios'; // Import axios for making API requests

const DateCell = ({ getValue, row, column, table, endpoint, addTime }) => {
    let date = getValue();

    const parseAndValidateDate = (date) => {
        // Check if the value is already a Date object
        if (date instanceof Date) {
            return date;
        }
        if (typeof date === 'string') {
            // Parse the string to create a Date object
            const parsedDate = new Date(date);
            // Check if the parsed date is valid
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            } else {
                console.error('Invalid date format:', date);
                // Handle the case where the date format is invalid
                return null; // or a default date value
            }
        }
        return null; // or a default date value
    };

    const formatDateForSQL = (date) => {
        const pad = (num) => (num < 10 ? '0' + num : num);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const initialDate = parseAndValidateDate(date);
    const [value, setValue] = useState(initialDate);
    const [originalValue, setOriginalValue] = useState(initialDate); // Track original value
    const [isEditing, setIsEditing] = useState(false); // Track editing state

    useEffect(() => {
        const validatedDate = parseAndValidateDate(date);
        setValue(validatedDate);
        setOriginalValue(validatedDate);
    }, [date]);

    //const { updateData } = table.options.meta;

    const handleBlur = async () => {
        // Disable editing
        setIsEditing(false);
        // If the value has changed
        if (value !== initialDate) {
            const formattedDate = formatDateForSQL(value);

            //Grab the new row data
            const updatedRow = { ...row.original, [column.id]: value, };

            //If this cell is being edited for a new row, don't make API call yet, if it is not a new row, then make PUT API request
            if (table.options.addingRowInProgress === false) {
                // Make API request to update value
                try {
                    const URL = import.meta.env.VITE_API_URL + endpoint;
                    const response = await axios.put(URL, updatedRow, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('API response:', response);
                    // If request succeeds, update original value
                    setOriginalValue(value);
                }
                catch (error) {
                    console.error('API request error:', error);
                    // If request fails, revert to original value
                    setValue(originalValue);
                    //Create error message to display here?
                }
            }
            //If we are adding a row, update the data for the cell 
            else {
                table.options.meta?.updateData(row.index, column.id, value);
            }
        }
    };
    return (
        <DatePicker
            wrapperClassName="date-wrapper"
            dateFormat={addTime ? "MM/dd/yyyy HH:mm" : "MM/dd/yyyy"}
            onBlur={handleBlur}
            showTimeInput={addTime? true:false}
            selected={value}
            onChange={(date) => {
                setValue(date);

            }}
        />
    );
};

export default DateCell;
