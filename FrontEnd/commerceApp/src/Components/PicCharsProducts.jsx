import {CardContent,Typography, InputLabel, Box} from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, reset as resetUsers } from '../dl/Slices/usersSlice'
import { getAllProducts } from '../dl/Slices/productsSlice';
import { useState, useEffect } from "react";


// Helper function to aggregate product quantities for all users
const aggregateProductQuantities = (users, products) => {
    const productQuantities = {};
  
    users.forEach(user => {
      user.productsBought.forEach(item => {
        if (productQuantities[item._id]) {
          productQuantities[item._id] += item.quantity;
        } else {
          productQuantities[item._id] = item.quantity;
        }
      });
    });
  
    return Object.entries(productQuantities).map(([productId, totalQuantity]) => {
      const product = products.find(pr => pr._id === productId);
      console.log("Product: ", product)
      return {
        name: product ? product.name : 'Unknown Product', // Map to product name
        value: totalQuantity
      };
    });
  };


export default function PicCharsProducts(){  
    const dispatch = useDispatch();
    const [ststisticTotalProduct, setStstisticTotalProduct] = useState([]);
    const { users, isSuccess: usersSuccess } = useSelector(state => state.users);
    const { products, isSuccess: productsSuccess } = useSelector(state => state.products);
    const [token] = useState(sessionStorage.getItem("token"));

    useEffect(() => {
        if(token)
        {
            dispatch(getAllUsers(token));
            dispatch(getAllProducts(token));
        }
        return () => {
          dispatch(resetUsers());
        };
      }, [dispatch, token]);

   


    useEffect(() => {
        if (usersSuccess && productsSuccess && users.length && products.length) {
          setStstisticTotalProduct(aggregateProductQuantities(users, products));
    
          console.log(ststisticTotalProduct)
        }
      }, [usersSuccess, productsSuccess, users, products]);
    
      useEffect(()=>{
        console.log("ststisticTotalProduct: ",ststisticTotalProduct)
      },[ststisticTotalProduct])

      const handlePieClick = (event) => {
        console.log("Pie click event:", event); // Inspect the entire event
    
        const nativeEvent = event.nativeEvent;
        const target = nativeEvent.target;
        
        if (target && target.dataset) {
          const { name, value } = target.dataset; // Extract name and value from data attributes
          setSelectedSegment({
            name: name || 'Unknown Product',
            value: value || 0
          });
        }
      };

      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 4 }}
          >
            Total Sold Products:
          </Typography>
          <PieChart
            sx={{ margin: "auto" }}
            colors={['lightcoral', 'slateblue', 'BlueViolet', 'Orchid']} // Custom color palette
            series={[
              {
                arcLabel: (item) => `${item.name}: ${item.value}`, // Show product name and value
                arcLabelMinAngle: 35,
                arcLabelRadius: '65%', // For better spacing
                data: ststisticTotalProduct,
                labelOffset: 15, // Position labels further away from pie
              },
            ]}
            width={400}
            height={200}
            onClick={handlePieClick} // Handle pie chart clicks
          />
        </Box>
      );
    }