import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AdminNavbar from '../Navbar/AdminNavbar';
import { Outlet } from 'react-router-dom';

export default function AdminDashboard() {

  return (
    <div>
      {/* Main Admin Content */}
      <Box sx={{ padding:5 }} >
        <Typography
          component="h6"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 2.5vw, 5rem)', textAlign: 'center' }}
        >
          Hello, Admin
        </Typography>
        
        {/* Render Admin Navbar below "Hello, Admin" */}
        <AdminNavbar sx={{ marginTop:"20px"}}/>

        {/* Render the nested routes like Categories, Products, etc. */}
        <Outlet />
      </Box>
    </div>
  );
}