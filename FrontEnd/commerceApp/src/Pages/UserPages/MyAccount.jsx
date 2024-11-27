import FormControlLabel from '@mui/material/FormControlLabel';
import * as React from 'react';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import { ThemeProvider, createTheme, styled, alpha } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import { Button, FormControl, FormLabel, TextField, FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import {updateUser} from "../../dl/Slices/usersSlice"
import Typography from '@mui/material/Typography';


// Create a theme
const theme = createTheme({
    palette: {
        mode: 'light', // or 'dark'
    },
});

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(3),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '400px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const AccountContiner = styled(Stack)(({ theme }) => ({
    height: '100%',
    padding: 150,
    backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
}));

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: '#F3F6F9',
    border: '1px solid',
    borderColor: '#E0E3E7',
    fontSize: 16,
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
      borderColor: '#2D3843',
    }),
  },
}));



const MyAccount = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [token] = useState(sessionStorage.getItem("token"));

    const { isError, isSuccess, message } = useSelector((state) => state.users);


    const [userData, setUserData] = useState(() => {
        const saveUser = sessionStorage.getItem("user");
        return saveUser
            ? JSON.parse(saveUser)
            : {
                  _id: "",
                  firstName: "",
                  lastName: "",
                  userName: "",
                  isAllowToSeeMyOrder: false,
              };
    });

    // Reset password field on component mount
    useEffect(() => {
        setUserData(prevData => ({ ...prevData, password: "" }));
       
    }, []);


const [newPassword, setNewPassword] = useState("");

 

    const changeData = (e) => {
       
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setUserData((prevState) => ({
                ...prevState,
                [name]: checked,
            }));
        } else {
            setUserData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }

        console.log("userData:",userData)
    };

    const handlePasswordChange = (e) => {
        console.log("handlePasswordChange")
        setNewPassword(e.target.value);
    };

    const handleSubmit = (event) => {
        
        event.preventDefault();
    
        const updatedData = { ...userData }; // Copy current userData
    
        // If a new password is provided, add it to updatedData, otherwise leave it out
        if (newPassword) {
            updatedData.password = newPassword;
        } else {
            delete updatedData.password; // Ensure password is not sent if unchanged
        }
        console.log("userData:",userData)
        // Dispatch the update user action with the modified data
        dispatch(updateUser({ user: updatedData, token }));
    };
    useEffect(() => {
        if (isSuccess) {
            // Optionally, you can navigate the user to another page after a successful update
            // navigate("/some-page"); 
        }
    }, [isSuccess, navigate]);
  
  return (
    <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <AccountContiner direction="column" justifyContent="space-between">
                <Card variant='outline'>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: `flex`,
                            flexDirection: `column`,
                            width: `100%`,
                            gap: 2
                        }}>

                        {/* Display error message here if registration fails */}
                        {isError && (
                            <Typography color="error" sx={{ textAlign: 'center' }}>
                                *{message}
                            </Typography>
                        )}
                        {/* Display success message here if the update is successful */}
                        {isSuccess && (
                            <Typography color='success' sx={{ textAlign: 'center' }}>
                                Your profile has been updated successfully!
                            </Typography>
                        )}

                            <FormControl error={Boolean(errors.firstName)}>
                            <FormLabel htmlFor="firstName" sx={{fontWeight: 'bold', color:"black"}}>First Name:</FormLabel>
                            <TextField
                                id="firstName"
                                type='text'
                                name="firstName"
                                placeholder='first Name...'
                                required
                                fullWidth
                                variant='outlined'
                                onChange={changeData}
                                value={userData.firstName}
                            />
                            {errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
                        </FormControl>

                        <FormControl error={Boolean(errors.lastName)}>
                            <FormLabel htmlFor="lastName" sx={{fontWeight: 'bold', color:"black"}}>Last Name:</FormLabel>
                            <TextField
                                id="lastName"
                                type='text'
                                name="lastName"
                                placeholder='Last Name...'
                                required
                                fullWidth
                                variant='outlined'
                                onChange={changeData}
                                value={userData.lastName}
                            />
                            {errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
                        </FormControl>

                        <FormControl error={Boolean(errors.userName)}>
                            <FormLabel htmlFor="userName" sx={{fontWeight: 'bold', color:"black"}}>User Name:</FormLabel>
                            <TextField
                                id="userName"
                                type='text'
                                name="userName"
                                placeholder='User Name...'
                                required
                                fullWidth
                                variant='outlined'
                                onChange={changeData}
                                value={userData.userName}
                            />
                            {errors.userName && <FormHelperText>{errors.userName}</FormHelperText>}
                        </FormControl>

                        <FormControl >
                            <FormLabel htmlFor="password" sx={{fontWeight: 'bold', color:"black"}}>Password:</FormLabel>
                            <TextField
                                id="password"
                                type='password'
                                name="password"
                                placeholder="••••••"
                                fullWidth
                                variant='outlined'
                                onChange={handlePasswordChange}
                                value={newPassword}
                            />
                            {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                        </FormControl>

                        <FormControlLabel
                            control={<Checkbox value="allow" color="primary" name="isAllowToSeeMyOrder" />}
                            label="Allow others to see my orders"
                            onChange={changeData}
                            checked={userData.isAllowToSeeMyOrder}
                        />
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            color="primary" 
                            sx={{ backgroundColor: "green", marginTop: "30px" }}>
                            Save
                        </Button>
                    </Box>
                </Card>
            </AccountContiner>
        </ThemeProvider>
    );
};

export default MyAccount;