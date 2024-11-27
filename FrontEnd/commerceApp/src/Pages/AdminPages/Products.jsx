import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardProduct from '../../Components/CardProduct';
import { getAllProducts, reset } from "../../dl/Slices/productsSlice";
import { useDispatch, useSelector } from "react-redux";

const StyledBox = styled(Box)(({ theme }) => ({
  minWidth: 275,
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(2),
  height: '100%',
}));

const Products = () => {
  const dispatch = useDispatch();
  const { products, isLoading, isError, isSuccess, message } = useSelector(state => state.products);
  const [token] = useState(sessionStorage.getItem("token"));
  const [showAddProduct, setShowAddProduct] = useState(false); // State to control visibility

  useEffect(() => {
    dispatch(getAllProducts(token));
    return () => {
      dispatch(reset());
    };
  }, [dispatch, token, showAddProduct]);

  const handleAddNewProduct = () => {
    
    setShowAddProduct(true);
  };

  return (
    <StyledBox >
      {/* Render existing products */}
      {products.length > 0 && products.map(pro => (
        <CardProduct key={pro._id} product={pro} />
      ))}

      {/* Conditionally render the new product form */}
      {showAddProduct && <CardProduct product={{}} />}

      {/* Button to add a new product */}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: "20px" }}
        onClick={handleAddNewProduct}
      >
        Add New
      </Button>
    </StyledBox>
  );
};

export default Products;