import React, { useState, useEffect } from 'react';
import { Grid, Box, Card, CardContent, Typography, Button, InputLabel, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import GenericTable from './GenericTable';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories, reset } from '../dl/Slices/categoriesSlice';
import { getAllProducts, addProduct, updateProduct } from '../dl/Slices/productsSlice';
import { getAllUsers } from "../dl/Slices/usersSlice";
import formatDateAndTime from "../utilits";

const columns = ['FullName', 'QuantityBought', 'Date'];

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

export default function CardProduct({ product }) {
  const dispatch = useDispatch();
  const { categories = [] } = useSelector(state => state.categories);
  const { message: productMessage, isError } = useSelector(state => state.products);
  const { users = [] } = useSelector(state => state.users);
  const [selectedCategoryId, setSelectedCategoryId] = useState(product.category || '');
  const [title, setTitle] = useState(product.name || '');
  const [description, setDescription] = useState(product.description || '');
  const [price, setPrice] = useState(product.price || 0);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || '');
  const [token] = useState(sessionStorage.getItem("token"));
  const [inStock, setInStock] = useState(product.inStock || 0);
  const [productBoughtDetail, setProductBoughtDetails] = useState([]);

  useEffect(() => {
    if (token) {
      dispatch(getAllCategories(token));
      dispatch(getAllUsers(token));
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, token]);

  useEffect(() => {
    if (categories.length && product.categoryId) {
      setSelectedCategoryId(product.categoryId);
    }
  }, [categories, product.categoryId]);

  useEffect(() => {
    if (isError) {
      alert(productMessage); // Display message using alert
    }
  }, [isError, productMessage]);

  const handlerChangeCategory = (e) => {
    setSelectedCategoryId(e.target.value);
  };

  const handlerSaveProduct = () => {
    const productData = {
      name: title,
      categoryId: selectedCategoryId,
      description,
      price,
      imageUrl,
      inStock,
    };

    if (product && product._id) {
      // If product._id exists, it's an existing product, so update it
      dispatch(updateProduct({ id: product._id, product: productData, token }));
    } else {
      // If product._id does not exist, it's a new product, so create it
      dispatch(addProduct({ product: productData, token }));
    }
  };

  useEffect(() => {
    if (users.length && product) {
      const boughtDetails = users
        .map(user => {
          const productBought = user.productsBought.find(pb => pb._id === product._id);
          if (productBought) {
            return {
              FullName: `${user.firstName} ${user.lastName}`,
              QuantityBought: productBought.quantity || 0,
              Date: formatDateAndTime(productBought.dateBought), // Ensure this is the correct field
            };
          }
          return null;
        })
        .filter(detail => detail !== null);

      setProductBoughtDetails(boughtDetails);
    }
  }, [users, product]);

  return (
    <StyledCard variant="outlined">
      <CardContent>
        <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={selectedCategoryId}
                onChange={handlerChangeCategory}
              >
                {categories.map(category => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="InStock"
              type="number"
              value={inStock}
              onChange={(e) => setInStock(e.target.value)}
              variant="outlined"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              variant="outlined"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Picture Link"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" sx={{ mb: 2, marginTop:"20px"}}>Bought By:</Typography>
            <Box sx={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden', padding: '10px', boxSizing: 'border-box' }}>
              <GenericTable columns={columns} rows={productBoughtDetail} columnWidths={['20px', '10px', '30px']} />
            </Box>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "green", marginTop: "30px" }}
          onClick={handlerSaveProduct}
        >
          Save
        </Button>
      </CardContent>
    </StyledCard>
  );
}