//Editable Table component created by following tutorial from youtube user "Nikita Dev"(https://www.youtube.com/watch?v=CjqG277Hmgg) and adapted to fit project
import React, { useEffect, useState } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { Box, Button, IconButton } from "@chakra-ui/react";


const EditableTable = ({ columns, endpoint }) => {
  // Initialize state with the provided data
  const [data, setData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const updateData = (rowIndex, columnID, value) => {
    console.log("Updating data:", rowIndex, columnID, value);
    setData(prev => prev.map(
      (row, index) => (
        index === rowIndex ? { ...prev[rowIndex], [columnID]: value, } : row
        //index === rowIndex ? { ...row, [columnID]: value } : row
      )
    ))
  };

  const createRow = () => {
    const newRow = {};
    columns.some(column => {
      if (column.accessorKey !== 'delete_row') {
        newRow[column.accessorKey] = ''; // Initialize each column with a blank value
        column.isNew = true;
      }
      console.log("column:", column);
    });
    setData(prevData => [...prevData, newRow]);
    //setRowData(prevRowData => [...prevRowData, newRowMeta]); // Update metadata for the new row
    setIsAdding(true);
  };

  // Create the table instance using the useReactTable hook
  const table = useReactTable({
    data, // The data to be displayed in the table
    columns, // Column definitions
    getCoreRowModel: getCoreRowModel(), // Function to get the core row model
    columnResizeMode: "onChange", // Enable column resizing
    addingRowInProgress: isAdding,
    meta: {
      updateData,
      createRow
    }
  });

  // Fetch data asynchronously 
  const fetchData = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL + endpoint;
      const response = await axios.get(URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Grab data from backend when component mounts
  useEffect(() => {
    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  const handleSaveNewRow = async (rowIndex, columnKey, value) => {
    // Store the current data state before attempting to save
    const originalData = [...data];
    // Get the new row data
    const newRow = table.getRowModel().rows[rowIndex].original;
    // Check for blank values in editable cells
    const hasBlankValues = columns.some((column) => {
      if (column.editable) {
        console.log(column)
        const cellValue = newRow[column.accessorKey];
        console.log(cellValue);
        return !cellValue || cellValue.trim() === '';
      }
      return false;
    });
    //If an editable cell was blank, let user know and return
    if (hasBlankValues) {
      console.log("Has blank values!!");
      //Grab the original data to refresh the table
      await fetchData();
      return;
    }

    //If all editable cells were populated, attempt to make POST request
    try {
      // Make POST API request to save the new row
      const URL = import.meta.env.VITE_API_URL + endpoint; // Replace with your endpoint
      const response = await axios.post(URL, table.getRowModel().rows[rowIndex].original, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Row saved:', response.data);
      
      //console.log('All data:',allData );
      setIsAdding(false);
    } catch (error) {
      console.error('API request error:', error);
      // Handle error (e.g., show error message to the user)
      //setData(originalData)
    };
    //Wheither the API call succeeds or fails, get the data from the backend
    //If the request failed, it'll update the table and remove the newly added row
    await fetchData();

  };


  // Log the current data for debugging purposes
  console.log("data:", data);

  return (
    <Box>
      <Box className='table' w={table.getTotalSize()}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box className='tr' key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <Box className='th' w={header.getSize()} key={header.id}>
                {header.column.columnDef.header}
                <Box
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                />
              </Box>
            ))}
          </Box>
        ))}
        {table.getRowModel().rows.map((row, rowIndex) => (
          <Box className='tr' key={row.id}>
            {row.getVisibleCells().map(cell => (
              <Box className='td' w={cell.column.getSize()} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, { ...cell.getContext(), rowIndex, table, updateData, endpoint })}
              </Box>
            ))}
            {isAdding && rowIndex === table.getRowModel().rows.length - 1 && (
              <Box className='td'>
                <Button onClick={() => handleSaveNewRow(rowIndex)}>Save</Button>
              </Box>
            )}
          </Box>
        ))}
        <Box className='tr'>
          <Box className='td' colSpan={columns.length}>
            <IconButton icon={<AddIcon />} onClick={table.options.meta.createRow} aria-label="Add new row" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default EditableTable;