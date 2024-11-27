import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import NewUserRegister from './Pages/NewUserRegister';
import { useState } from 'react';
import ProtectedRoutes from './Components/ProtectedRoutes';
import AdminDashboard from './Pages/AdminDashboard';
import UserDashboard from './Pages/UserDashboard';
import Products from './Pages/AdminPages/Products';
import Customers from './Pages/AdminPages/Customers';
import Categories from './Pages/AdminPages/Categories';
import UserProducts from "./Pages/UserPages/UserProducts"
import MyOrders from "./Pages/UserPages/MyOrders"
import MyAccount from './Pages/UserPages/MyAccount';
import Statistics from './Pages/AdminPages/Statistics';

function App() {
  const [role, setRole] = useState(null);

  return (
    <>
      <Routes>
        <Route path='/' element={<Login setRole={setRole} />} />
          <Route path='register' element={<NewUserRegister />} />

        <Route element={<ProtectedRoutes role={role} />}>
          <Route path='/admin-dashboard' element={<AdminDashboard setRole={setRole}/>}>
            {/* Default route to /categories */}
            <Route index element={<Navigate to="categories" />} />
            {/* Nested routes */}
            <Route path='categories' element={<Categories />} />
            <Route path='products' element={<Products />} />
            <Route path='customers' element={<Customers />} />
            <Route path='statistics' element={<Statistics />} />
          </Route>

          <Route path='/user-dashboard' element={<UserDashboard setRole={setRole}/>} >
            {/* Default route to /categories */}
            <Route index element={<Navigate to="products" />} />
            {/* Nested routes */}
            <Route path='products' element={<UserProducts />} />
            <Route path='my-orders' element={<MyOrders />} />
            <Route path='my-account' element={<MyAccount />} />

          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;