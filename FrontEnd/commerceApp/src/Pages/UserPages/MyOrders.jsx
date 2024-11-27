import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import GenericTable from '../../Components/GenericTable';
import { getUserById, reset } from '../../dl/Slices/usersSlice';
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from '../../dl/Slices/productsSlice';
import formatDateAndTime from "../../utilits"

const StyledBox = styled(Box)(({ theme }) => ({
  minWidth: 275,
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(2),
}));

const MyOrder = () => {
  const dispatch = useDispatch();
  const { currentUser, isError: userError, isSuccess: userSuccess } = useSelector(state => state.users);
  const { products, isLoading: productsLoading, isError: productsError, isSuccess: productsSuccess } = useSelector(state => state.products);
  const [token] = useState(sessionStorage.getItem("token"));
  const [rows, setRows] = useState([]);

  // Fetch user data
  useEffect(() => {
    const saveUser = sessionStorage.getItem("user");
    const user = saveUser ? JSON.parse(saveUser) : { _id: "" };
    
    if (user._id) {
      dispatch(getUserById({userId: user._id, token}));
      console.log("currentUser:", currentUser)
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, token]);

  // Fetch products data
  useEffect(() => {
    dispatch(getAllProducts(token));

    return () => {
      dispatch(reset());
    };
  }, [dispatch, token]);


  // Format date and time
 /* const formatDateAndTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();  // Formats to "MM/DD/YYYY"
    const formattedTime = date.toLocaleTimeString();  // Formats to "HH:MM:SS AM/PM"
    return `${formattedDate} ${formattedTime}`;
    
  };*/

  // Update rows when user and product data are loaded
  useEffect(() => {
    if (userSuccess && currentUser && productsSuccess && products) {
      const userProducts = currentUser.productsBought;
      const productIds = userProducts.map(p => p._id);

      const filteredProducts = products.filter(product => productIds.includes(product._id));
      
      const currentRows = userProducts.map(pro => {
        const product = filteredProducts.find(p => p._id === pro._id);

        console.log("pro:", pro)
        console.log("filteredProducts:", filteredProducts)
        console.log("filteredProducts:", product)

        return {
          Title: product ? product.name : 'Unknown',
          Qty: pro.quantity,
          Total: product ? (product.price * pro.quantity).toFixed(2) : '0.00',
          Data: pro.dateBought ? formatDateAndTime(pro.dateBought) :'Unknown'  // Ensure you handle missing data safely
          //Data: pro.dateBought || 'Unknown'
        };
      });

      setRows(currentRows);
    }
  }, [userSuccess, currentUser, productsSuccess, products]);

  const columns = ['Title', 'Qty', 'Total', 'Data'];

  return (
    <StyledBox>
      <Typography component="h1" variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginTop: '10px', marginBottom: '10px', padding: '30px' }}>
        Products Ordered:
      </Typography>

      <Box sx={{ padding: 2, maxHeight: '400px', overflow: 'auto', maxWidth: '100%' }}>
        <GenericTable columns={columns} rows={rows} columnWidths={['100px', '100px', '100px', 'auto']} />
      </Box>
    </StyledBox>
  );
}

export default MyOrder;