import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import GenericTable from '../../Components/GenericTable';
import { getAllUsers, reset as resetUsers} from '../../dl/Slices/usersSlice';
import { useDispatch, useSelector } from "react-redux";
import formatDateAndTime from "../../utilits"
import { getAllProducts, reset as resetProduct} from "../../dl/Slices/productsSlice";

const StyledBox = styled(Box)(({ theme }) => ({
  minWidth: 275,
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(2),
}));

const ProductsBoughtTable = ({ productsBought = [] }) => {
  const dispatch = useDispatch();
  const [token] = useState(sessionStorage.getItem("token"));
  const { products, isLoading, isError, isSuccess, message } = useSelector(state => state.products);
  useEffect(() => {
    dispatch(getAllProducts(token));
    return () => {
      dispatch(resetProduct());
    };
  }, [dispatch, token]);

  const columns = ['Product', 'Quantity', `Data`];
  let rows = [];

  if (productsBought.length && products.length) {
    rows = productsBought.map(pr => {      
      const currentProduct = products.find(product=>product._id === pr._id )
      return{     
          Product: currentProduct? currentProduct.name : "Unknown product", 
          Quantity: pr.quantity,
          Data: pr.dateBought ? formatDateAndTime(pr.dateBought) :'Unknown' 
      }
    })
  }
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <GenericTable 
        columns={columns} 
        rows={rows}  
        columnWidths={['40%', '30%', '30%']} // Use percentage widths
        sx={{ fontSize: '12px' }} // Adjust font size as needed
      />
    </Box>
  );
};

const Customers = () => {
  const dispatch = useDispatch();
  const { users, isLoading, isError, isSuccess, message } = useSelector(state => state.users);
  const [token] = useState(sessionStorage.getItem("token"));
  const [rows, setRows] = useState([]);


  useEffect(() => {
    // Dispatch to get all users only on mount
    dispatch(getAllUsers(token));

    return () => {
      // Clean up when component unmounts
      dispatch(resetUsers());
    };
  }, [dispatch, token]);  // Only run this once, after the component mounts


  useEffect(() => {
    // Run this effect only when the users are successfully loaded
    if (isSuccess && users.length) {
      const currentRows = users.map(user => {
        if (!user.isAdmin) {
          return {
            FullName: `${user.firstName} ${user.lastName}`, 
            JoinedAt: formatDateAndTime(user.joinedAt),
            ProductsBought: <ProductsBoughtTable productsBought={user.productsBought} />
          };
        }
        return null;
      }).filter(row => row !== null);

      setRows(currentRows);
    }
  }, [isSuccess, users]);  // Only trigger when isSuccess or users changes

  const columns = ['FullName', 'JoinedAt', 'ProductsBought'];

  return (
    <StyledBox>
      <Typography component="h1" variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginTop: '10px', marginBottom: '10px', padding: '30px' }}>
        Customers:
      </Typography>

      <Box sx={{ padding: 2, overflowX: 'auto' }}>
        <GenericTable  
        sx={{ maxWidth: '150px', fontSize: '18px' }}
        columns={columns} rows={rows} 
        columnWidths={['150px', '100px', 'auto']} 
         headerStyle={{backgroundColor: 'primary.main',  // Add background color here
         color: '#fff',  // Set the text color to white for better contrast
         fontSize: "20px"}}/>
      </Box>
    </StyledBox>
  );
};

export default Customers;