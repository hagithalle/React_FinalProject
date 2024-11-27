import { Navigate, Outlet } from 'react-router-dom';
import AdminNavbar from '../Navbar/AdminNavbar';
import UserNavbar from '../Navbar/UserNavbar'
import Box from '@mui/material/Box';
import AdminDashboard from '../Pages/AdminDashboard';
import UserDashboard from '../Pages/UserDashboard';

export default function ProtectedRoutes({ role }) {
  if (!role) {
    // If no role is defined, redirect to login page
    return <Navigate to="/" />;
  }

  return <Outlet />;  // Only render the nested routes
  
}