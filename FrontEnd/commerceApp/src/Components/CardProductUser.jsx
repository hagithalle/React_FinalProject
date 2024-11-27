import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid"


const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius, 
    boxShadow: theme.shadows[3], 
  }));

  export default function  CardProductUser ({ product ,onAddToCart}){
    const [quantity, setQuantity] = useState(0); // Default to 1
  
    const handleQuantityChange = (change) => {
      const newQuantity =Math.max(1, quantity + change)
      setQuantity(newQuantity); 

      onAddToCart({...product, quantity: newQuantity})
    };
  
    return (
      <StyledCard variant="outlined">
        <CardContent>
          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Grid item xs={12} md={4} >
              <Typography variant="h5">{product.name}</Typography>
              <Typography>Description: {product.description}</Typography>
              <Typography>Price: ${product.price}</Typography>
              <Typography>In stock: {product.inStock}</Typography>
            
              <div>
                <Button onClick={() => handleQuantityChange(-1)}>-</Button>
                <span>{quantity}</span>
                <Button onClick={() => handleQuantityChange(1)}>+</Button>
              </div>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src= {product.imageUrl}
              alt={product.name} 
              style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography>Bought by others: {product.boughtByOther}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    );
  };