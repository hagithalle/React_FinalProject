import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../../dl/Slices/categoriesSlice';
import { getAllProducts, updateProductAfterPurchase, reset } from '../../dl/Slices/productsSlice';
import { getUserById, updateUserAfterPurchase } from '../../dl/Slices/usersSlice';
import CardProductUser from '../../Components/CardProductUser';
import Box from '@mui/material/Box';
import { Button, Typography, Select, MenuItem, Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Slider from '@mui/material/Slider';
import { authLogOut} from '../../dl/Slices/authSlice';
import { useNavigate } from 'react-router-dom';

const StyledBox = styled(Box)(({ theme }) => ({
  minWidth: 275,
  backgroundColor: theme.palette.grey[200],
  padding: theme.spacing(2),
}));

const ProductContainer = styled(Box)(({ isCartOpen }) => ({
  display: 'flex',
  flexDirection: 'row',
  transition: 'margin-left 0.3s ease',
  padding: "10px",
  marginLeft: isCartOpen ? '450px' : '0',
}));

const UserProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.users);
  const { categories } = useSelector(state => state.categories);
  const { products } = useSelector(state => state.products);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [token] = useState(sessionStorage.getItem("token"));


  useEffect(() => {
    const saveUser = sessionStorage.getItem("user");
    const user = saveUser ? JSON.parse(saveUser) : { _id: "" };
    console.log("user._id:", user._id, token)
    if (user._id) {
      dispatch(getUserById({userId: user._id, token}));
     
    }
    dispatch(getAllCategories(token));
    dispatch(getAllProducts(token));


    return () => {
      dispatch(reset());
    };
  }, [dispatch, token]);

  useEffect(()=>{

    console.log("filteredProducts:", filteredProducts)
  },[selectedCategoryId])


  const handleCategoryChange = (event) => setSelectedCategoryId(event.target.value);
  const handlePriceChange = (event, newValue) => setPriceRange(newValue);
  const handleSearchChange = (event) => setSearchQuery(event.target.value);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProduct = prevCart.find(item => item._id === product._id);
      if (existingProduct) {
        // Update quantity if product already exists in cart
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add new product to cart with quantity starting at 1
      // Create a shallow copy of the product to make it extensible
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleQuantityChange = (productId, change) => {
    setCart(prevCart => {
      return prevCart.map(product =>
        product._id === productId
          ? { ...product, quantity: Math.max(1, product.quantity + change) }
          : product
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      // Filter out the removed product
      return prevCart.filter(product => product._id !== productId);
    });
  };

  const calculateProductTotal = (product) => {
    return product.price * (product.quantity || 0);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, product) => total + calculateProductTotal(product), 0);
  };

  const toggleCartDrawer = (open) => {
    setIsCartOpen(open);
  };

  const handleOrder = () => {
    const orderData = {
      items: cart,
      total: calculateTotalPrice(),
    };

    console.log('Order placed:', orderData);

    dispatch(updateUserAfterPurchase({ userId: currentUser._id, purchasedProducts: cart, token }));
    dispatch(updateProductAfterPurchase({cart, token}));

    setCart([]);

    logOut()
  };

  const logOut = () => {

      dispatch(authLogOut());
      //console.log(user)

    navigate('/'); // Redirect to the login page

  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategoryId 
      ? String(product.categoryId) === String(selectedCategoryId)
      : true; // Show all products if no category is selected
      console.log("selectedCategoryId:", selectedCategoryId, "product.categoryId: ", product.categoryId)
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesTitle = product.name.toLowerCase().includes(searchQuery.toLowerCase());
  
    //console.log("filteredProducts:", filteredProducts)
    return matchesCategory && matchesPrice && matchesTitle;
  
  });


  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconButton onClick={() => toggleCartDrawer(!isCartOpen)}>
        {isCartOpen ? <ArrowForwardIosIcon /> : <ArrowBackIosIcon />}
        <ShoppingCartIcon />
      </IconButton>

      <Drawer anchor="left" open={isCartOpen} onClose={() => toggleCartDrawer(false)}>
        <Box sx={{ width: 500, padding: 2, marginTop: "50px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, marginBottom: 2 }}>
            <Typography variant="h6">Cart</Typography>
            <IconButton onClick={() => toggleCartDrawer(!isCartOpen)}>
              {!isCartOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
              <ShoppingCartIcon />
            </IconButton>
          </Box>
          <List>
            {cart.map(product => (
              <ListItem key={product._id}>
                <ListItemText
                  primary={product.name}
                  secondary={`Price: $${product.price} x ${product.quantity} = $${calculateProductTotal(product)}`}
                />
                <Button onClick={() => handleQuantityChange(product._id, -1)}>-</Button>
                <span>{product.quantity || 0}</span>
                <Button onClick={() => handleQuantityChange(product._id, 1)}>+</Button>
                <IconButton onClick={() => removeFromCart(product._id)}>
                  <CloseIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Typography variant="h6">Total: ${calculateTotalPrice()}</Typography>
          <Button variant="contained" color="primary" fullWidth onClick={handleOrder}>
            Order
          </Button>
        </Box>
      </Drawer>

      <ProductContainer isCartOpen={isCartOpen} sx={{ flexGrow: 1 }}>
        <StyledBox>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 2 }}>
            <Typography sx={{ marginRight: 2 }}>Filter by Category:</Typography>
            <Select
              sx={{ minWidth: 200, fontSize: '1.2rem', padding: '5px' }}
              value={selectedCategoryId}
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map(category => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>

            <Box sx={{ width: 300, display: "flex", alignItems: 'center', gap: 2 }}>
              <Typography sx={{ flexShrink: 0 }}>Price:</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                min={0}
                max={1000}
                step={10}
                valueLabelDisplay="auto"
                sx={{ flexGrow: 1 }}
              />
              <Typography variant="body2">
                {`$${priceRange[0]}-$${priceRange[1]}`}
              </Typography>
            </Box>

            <Typography sx={{ marginLeft: 4, marginRight: 2 }}>Title:</Typography>
            <input type="text" value={searchQuery} onChange={handleSearchChange} />
          </Box>

          <StyledBox>
            {filteredProducts.map(product => (
              <CardProductUser
                key={product._id}
                product={product}
                onAddToCart={addToCart} // Add to cart functionality
              />
            ))}
          </StyledBox>
        </StyledBox>
      </ProductContainer>
    </Box>
  );
};

export default UserProducts;