import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { CardContent, Typography, InputLabel, Box, FormControl, Select, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, reset as resetUsers } from '../dl/Slices/usersSlice';
import { getAllProducts } from '../dl/Slices/productsSlice';
import { BarChart } from '@mui/x-charts/BarChart';

// Function to aggregate product quantities for the selected user
const aggregateProductQuantitiesForUser = (user, productMap) => {
    // Assuming selectedUserData.productsBought is an array of purchases
    // Format it as needed for the chart
    if (!user.productsBought || user.productsBought.length === 0) {
        return [
            ["Product Name", "Quantity"], // Header row
            ["No Data", 0] // Placeholder if no data
        ];
    }
console.log("aggregateProductQuantitiesForUser:", user)
    const productQuantities = {};

    user.productsBought.forEach(item => {
        // Use the product ID to get the product name from the map
        const productName = productMap[item._id] || item._id; // Fallback to ID if name not found
        if (productQuantities[productName]) {
            productQuantities[productName] += item.quantity;
        } else {
            productQuantities[productName] = item.quantity;
        }
    });

    const sortedData = Object.entries(productQuantities)
        .sort((a, b) => a[1] - b[1])// Sort by quantity in descending orde
        .map(([name, quantity]) => [name, quantity]);
      console.log("data:", sortedData)


    const productNames = [];
    const quantities = [];

    Object.entries(productQuantities)
        .sort((a, b) => b[1] - a[1]) // Sort by quantity in descending order
        .forEach(([name, quantity]) => {
            productNames.push(name);
            quantities.push(quantity);
        });

    console.log("xxxx:" ,productNames, quantities);
  
     // Prepare the final data for the chart
     return [["Product Name", "Quantity"], ...sortedData];
     
  };

// Function to determine the color based on quantity
const getColorForQuantity = (quantity, maxQuantity) => {
    const hue = Math.floor((quantity / maxQuantity) * 120); // Green hue based on quantity
    return `hsl(${hue}, 100%, 50%)`; // Full saturation and brightness
};
  

export default function BarChartUsersProduct() {
    const dispatch = useDispatch();
    const { users, isSuccess: usersSuccess } = useSelector(state => state.users);
    const { products, isSuccess: productsSuccess } = useSelector(state => state.products);
    const [selectedUser, setSelectedUser] = useState('');
    const [token] = useState(sessionStorage.getItem("token"));

    useEffect(() => {
        if (token) {
            dispatch(getAllUsers(token));
            dispatch(getAllProducts(token));
        }
        return () => {
            dispatch(resetUsers());
        };
    }, [dispatch, token]);

    useEffect(() => {
        // Filter out admin and set the initial selected user
        const nonAdminUsers = users.filter(user => user.userName !== "admin");
        if (nonAdminUsers.length > 0) {
            setSelectedUser(nonAdminUsers[0].userName); // Set to first non-admin user
        }
    }, [users]);

    const handleUserChange = (event) => {
        console.log("handleUserChange:", event.target.value);
        setSelectedUser(event.target.value);
    };

    // Create a map of product IDs to product names
    const productMap = products.reduce((map, product) => {
        map[product._id] = product.name; // Assuming product has a 'name' property
        return map;
    }, {});

    // Get the selected user's data
    const selectedUserData = users.find(user => user.userName === selectedUser) || {};
    // Get chart data based on selected user's purchases
    const data = aggregateProductQuantitiesForUser(selectedUserData, productMap);

    const generateColors = (num) => {
        const colors = [];
        for (let i = 0; i < num; i++) {
            colors.push(`hsl(${(i * 360) / num}, 100%, 50%)`); // Generate a unique color for each product
        }
        return colors;
    };
    
    const chartColors = generateColors(data.length - 1);
    console.log("chartColors:", chartColors)


    return (
        <CardContent sx={{ padding: 4 }}>
            <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 4 }}>
                Product Sales Per Customer:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', padding: 4 }}>
                <InputLabel sx={{ marginBottom: 1 }}>Select Customer</InputLabel>
                <FormControl sx={{ width: "200px", marginBottom: "4" }}>
                    <Select value={selectedUser} onChange={handleUserChange}>
                        {users.filter(user => user.userName !== "admin").map(user => (
                            <MenuItem key={user._id} value={user.userName}>
                                {`${user.userName}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', margin: 'auto' }}>
                <Chart
                    chartType="Bar"
                    width="70%"
                    height="400px"
                    data={data}
                    options={{
                       // colors: ['#e0440e', '#e6693e', '#f3b600', '#0f9e4a', '#1e90ff', '#8a2be2'],
                       backgroundColor: chartColors,
                       hAxis: { title: 'Quantity', minValue: 0 },
                       vAxis: { title: 'Product Name' },
                       legend: 'none',
                    }}
                />
            </Box>
        </CardContent>
    );
}