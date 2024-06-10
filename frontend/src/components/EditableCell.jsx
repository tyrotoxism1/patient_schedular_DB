import { Input } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import axios from 'axios'; // Import axios for making API requests

const EditableCell = ({ getValue, column, row, table, rowIndex, updateData, endpoint }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);

    const [originalValue, setOriginalValue] = useState(initialValue); // Track original value
    const [isEditing, setIsEditing] = useState(false); // Track editing state

    const handleBlur = async () => {
        //setIsEditing(false); // Disable editing
        // If the value has changed
        if (value !== initialValue) {
            console.log("IsNewRow?",row.original.delete_row);
            const newRow = row.original.delete_row; 
            //updateData(column.id, value);
            // Make API request to update value
            const updatedRow = {
                ...row.original,
                [column.id]: value,
            };
            console.log("in handleBlur val: ", value)
            //const updatedRow = {
            //    [column.id]: value,
            //};
            if (column.isNew === false ) {
                try {
                    const URL = import.meta.env.VITE_API_URL + endpoint;
                    //When editing a cell, it'll always be an update or PUT request
                    const response = await axios.put(URL, updatedRow, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('API response:', response);
                    // If request succeeds, update original value
                    setOriginalValue(value);
                } catch (error) {
                    console.error('API request error:', error);
                    // If request fails, revert to original value
                    setValue(originalValue);
                    //Create error message to display here?
                }
            }
            else {
                //setValue(value);
                console.log("Row index", row.id);
                console.log("column id", column.id);
                console.log("value:", value);
                updateData(row.id,column.id,value);
            }
        }
    };

    useEffect(() => {
        // Update value when initialValue changes
        setValue(initialValue);
        setOriginalValue(initialValue);
    }, [initialValue]);

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
