// REF for using REACT context: https://www.freecodecamp.org/news/context-api-in-react/
import React, { createContext, useContext, useState } from 'react';

// Create a generic context for the table data
const createTableDataContext = () => {
  const TableDataContext = createContext();

  const useTableData = () => {
    return useContext(TableDataContext);
  };

  const TableDataProvider = ({ children, initialData }) => {
    const [data, setData] = useState(initialData);

    return (
      <TableDataContext.Provider value={{ data, setData }}>
        {children}
      </TableDataContext.Provider>
    );
  };

  return { TableDataProvider, useTableData };
};

// Export a function to create a new context for each table
export const createNewTableContext = () => {
  return createTableDataContext();
};
