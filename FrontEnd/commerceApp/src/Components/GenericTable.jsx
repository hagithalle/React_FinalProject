import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const NestedTable = ({ data }) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow>
          {data && data.length > 0 ? Object.keys(data[0]).map((key) => (
            <TableCell key={key} sx={{ border: "1px solid black" , padding: '20px'}}>{key}</TableCell>
          )) : <TableCell sx={{ border: "1px solid black" , padding: '20px'}}>No Data</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {data && data.length > 0 ? data.map((row, index) => (
          <TableRow key={index} sx={{ border: "1px solid black" }}>
            {Object.values(row).map((value, idx) => (
              <TableCell key={idx} sx={{ border: "1px solid black" , padding: '20px'}}>{value}</TableCell>
            ))}
          </TableRow>
        )) : (
          <TableRow>
            <TableCell sx={{ border: "1px solid black", padding: '20px' }}>No Data</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </TableContainer>
);

const GenericTable = ({ columns, rows, columnWidths = [], headerStyle = {} }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 800, border: "1px solid"}} size="small" aria-label="dynamic table">
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={column}
                sx={{
                  fontWeight: 'bold',
                  width: columnWidths[index] || 'auto',
                  border: "1px solid black",  // Add border to the header cells
                  ...headerStyle,
                }}
              >
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows && rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <TableRow key={rowIndex} sx={{ border: "1px solid black" }}>  {/* Add border to the table rows */}
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex} sx={{ border: "1px solid black" }}> {/* Add border to the body cells */}
                    {Array.isArray(row[column]) ? (
                      <NestedTable data={row[column]} />
                    ) : (
                      row[column]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              {columns.map((_, colIndex) => (
                <TableCell key={colIndex} sx={{ border: "1px solid black" }}>No Data</TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericTable;