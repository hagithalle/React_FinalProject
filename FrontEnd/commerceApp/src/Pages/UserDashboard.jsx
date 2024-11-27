import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import UserNavbar from '../Navbar/UserNavbar';
import { Outlet } from 'react-router-dom';

export default function UserDashboard() {
  const [name, setName] = useState('')

useEffect(()=>{
  const user = JSON.parse(sessionStorage.getItem("user"))
  if(user && user.firstName)
  {
    setName(`${user.firstName} ${user.lastName}`)
  }
},[]);

  return (
    <div>
      {/* Main Admin Content */}
      <Box sx={{ padding:5 }}>
        <Typography
          component="h6"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 2.5vw, 5rem)', textAlign: 'center' }}
        >
          Hello, {name}
        </Typography>
        
        {/* Render Admin Navbar below "Hello, Admin" */}
        <UserNavbar/>
        <Box 
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',  // Adjust this as needed for vertical centering
            width: '100%', // Full width for responsiveness
            marginTop: '20px'  // Adjust margin for spacing under the navbar
          }}
        >
          <Box 
            sx={{
              width: '80%',  // Adjust the width of the content
              maxWidth: '1200px', // Max width for larger screens
              padding: '20px', // Some padding for content spacing
              backgroundColor: '#f4f4f4', // Optional background color
              borderRadius: '8px', // Optional rounding for a card-like effect
            }}
          >
        {/* Render the nested routes like Categories, Products, etc. */}
        <Outlet />
      </Box>
      </Box>
        </Box>
    </div>
  );
}