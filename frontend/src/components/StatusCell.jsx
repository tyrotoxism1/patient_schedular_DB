//StatusCell component based on following tutorial from youtube user "Nikita Dev"(https://www.youtube.com/watch?v=CjqG277Hmgg) and adapted to fit project
import { Box, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests

export const ColorIcon = ({ color, ...props }) => (
    <Box w="12px" h="12px" bg={color} borderRadius="3px" {...props} />
);

const StatusCell = ({ getValue, row, column, table, STATUSES, endpoint,tableDataAccessor, statusAccessor }) => {
    const name = getValue();

    const [isEditing, setIsEditing] = useState(false); // Track editing state
    const [value, setValue] = useState(name);
    const status = STATUSES;
    console.log("Status",status);

    const { updateData } = table.options.meta;
    // Find the color for the initial value if it exists in STATUSES
    const initialStatus = status.find(s => s.procedure_name === name);
    const initialColor = initialStatus ? 'blue.300' : 'transparent';

    const handleBlur = async (value) => {
        // Disable editing
        setIsEditing(false);
        // If the value has changed
        if (value !== name) {
            //Grab the new row data
            const updatedRow = table.options.data[row.index];
            
            updatedRow[tableDataAccessor]= value;
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
                    setValue(value);
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
        <Menu isLazy offset={[0, 0]} flip={false} autoSelect={true}>
            <MenuButton
                h="100%"
                w="100%"
                textAlign="left"
                p={1.5}
                bg={initialColor}
                color="gray.900"
                //onBlur={handleBlur}
                onFocus={() => setIsEditing(true)} // Enable editing on focus
            >
                {name}
            </MenuButton>
            <MenuList>
                {status.map((status, index) => (
                    <MenuItem
                        onClick={async () => {
                            updateData(row.index, column.id, status[statusAccessor]);
                            await handleBlur(status[statusAccessor]);
                        }}
                        key={index} // Add a key prop here

                    >
                        <ColorIcon color="blue.300" mr={3} />
                        {status.procedure_name}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
};
export default StatusCell;
