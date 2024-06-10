import { Input } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import axios from 'axios'; // Import axios for making API requests

const EditableCell = ({ getValue, column, row, table, endpoint }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const [originalValue, setOriginalValue] = useState(initialValue); // Track original value
    const [isEditing, setIsEditing] = useState(false); // Track editing state

    const handleBlur = async () => {
        // Disable editing
        setIsEditing(false); 
        // If the value has changed
        if (value !== initialValue) {
            //Grab the new row data
            const updatedRow = {...row.original,[column.id]: value,};
            //If this cell is being edited for a new row, don't make API call yet, if it is not a new row, then make PUT API request
            if (table.options.addingRowInProgress===false) {
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
                table.options.meta?.updateData(row.index,column.id,value);
            }
        }
    };

  

    return (
        <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onFocus={() => setIsEditing(true)} // Enable editing on focus
            variant="filled"
            size="sm"
            w="85%"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            isReadOnly={!isEditing} // Disable editing when not focused
        />
    );
};

export default EditableCell;
