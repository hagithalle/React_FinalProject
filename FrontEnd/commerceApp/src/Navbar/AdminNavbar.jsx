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

  // Determine the active tab based on the current location
  const tabRoutes = ['categories', 'products', 'customers', 'statistics'];
  const currentTab = tabRoutes.includes(location.pathname.split('/').pop()) ? location.pathname.split('/').pop() : 'categories';

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };

  const logOut = () => {
    if (setRole) {
        setRole(null);
      }
      dispatch(authLogOut());
    navigate('/'); // Redirect to the login page
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={currentTab} onChange={handleChange} centered>
        {/* Use relative paths to ensure the routes work correctly */}
        <Tab label="Categories" value="categories" component={Link} to="categories" />
        <Tab label="Products" value="products" component={Link} to="products" />
        <Tab label="Customers" value="customers" component={Link} to="customers" />
        <Tab label="Statistics" value="statistics" component={Link} to="statistics" />
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