import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogOut} from '../dl/Slices/authSlice';

export default function AdminNavbar({ setRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  // Extract the current tab from the pathname
  const tabRoutes = ['products', 'my-orders', 'my-account'];
  const path = location.pathname.split('/').pop();
  const currentTab = tabRoutes.includes(path) ? path : 'products'; // Default to 'products'

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };

  const logOut = () => {
    if (setRole) {
        setRole(null);
      }
      dispatch(authLogOut());
      //console.log(user)

    navigate('/'); // Redirect to the login page

  };

  return (

   
    
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={currentTab} onChange={handleChange} centered>
        <Tab label="Products" value="products" component={Link} to="products" />
        <Tab label="My Orders" value="my-orders" component={Link} to="my-orders" />
        <Tab label="My Account" value="my-account" component={Link} to="my-account" />
        <Tab sx={{ 
            fontWeight: 'bold', 
            color: 'blue', 
            '&:hover': { 
              color: 'darkblue' 
            } 
          }}
            label="Log Out" 
            onClick={logOut} />
      </Tabs>
    </Box>
  );
}