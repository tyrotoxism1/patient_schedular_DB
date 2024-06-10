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
  const [rowData, setRowData] = useState([]);

  const [tableData, setTableData] = useState([]);

  const updateData = (rowIndex, columnID, value) => {
    console.log("Updating data:", rowIndex, columnID, value);
    setData(prev => prev.map(
      (row, index) => (
        index === rowIndex ? { ...[rowIndex], [columnID]: value } : row
        //index === rowIndex ? { ...row, [columnID]: value } : row
      )
    ))
  };

  const createRow = () => {
    const newRow = {};
    //const newRowMeta = { isNewRow: true }; // Metadata for the new row
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
  const getRowMetadata = (rowIndex) => {
    return rowData[rowIndex] || {};
  };

  const updateRowMetadata = (rowIndex, newMetadata) => {
    setRowData(prevRowData => {
      const updatedRowData = [...prevRowData];
      updatedRowData[rowIndex] = newMetadata;
      return updatedRowData;
    });
  };

  // Create the table instance using the useReactTable hook
  const table = useReactTable({
    data, // The data to be displayed in the table
    columns, // Column definitions
    getCoreRowModel: getCoreRowModel(), // Function to get the core row model
    columnResizeMode: "onChange", // Enable column resizing
    meta: {
      updateData,
      createRow,
      getRowMetadata,
      updateRowMetadata
    }
  });


  // Fetch data asynchronously when component mounts
  useEffect(() => {
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

    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  // Update tableData when table.data changes
  useEffect(() => {
    console.log("updating tableData: ", table.data);
    if (table.data) {
      setTableData(table.data);
    }
  }, [table.data]);



  const handleAddNewRow = () => {

    // columns.forEach((column) => {
    //   newRow[column.accessorKey] = ''; // Initialize cell value as empty for each column
    // });

    // // Add the new row with isNewRow flag and empty values to the data array
    // setData([...data, newRow]);
    // setIsAdding(true);
  };
  const handleSaveNewRow = async (rowIndex, columnKey, value) => {
    // Store the current data state before attempting to save
    const originalData = [...data];
    console.log("Logging data after save", data);
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

    // if (hasBlankValues) {
    //   console.error('Error: All editable fields must be filled before saving.');
    //   // Handle error (e.g., show error message to the user)
    //   return;
    // }
    try {

      // Make POST API request to save the new row
      const URL = import.meta.env.VITE_API_URL + endpoint; // Replace with your endpoint
      const response = await axios.post(URL, table.getRowModel().rows[rowIndex].original, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Row saved:', response.data);
      setIsAdding(false);
    } catch (error) {
      console.error('API request error:', error);
      // Handle error (e.g., show error message to the user)
      setData(originalData)
    }
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
                {flexRender(cell.column.columnDef.cell, { ...cell.getContext(), rowIndex, table, rowMetadata: getRowMetadata, updateData, isNewRow: row.original.isNewRow, endpoint })}

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