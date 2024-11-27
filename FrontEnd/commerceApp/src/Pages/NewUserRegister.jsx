import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, FormControl, FormLabel, TextField, FormHelperText } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { authRegister , reset} from '../dl/Slices/authSlice';

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
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '400px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const LoginContainer = styled(Stack)(({ theme }) => ({
    height: '100%',
    padding: 150,
    backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
}));

export default function NewUserRegister() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isError, isSuccess, message } = useSelector((state) => state.auth);

    const [newUser, setNewUser] = useState({
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        isAllowToSeeMyOrder: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        if (isSuccess) {
            toast.success('Registration successful!');
            alert(message)
            navigate('/'); // Redirect to login page after successful registration
        }
        dispatch(reset());
    }, [isError, isSuccess, message, navigate]);

    const validateInputs = () => {
        const newErrors = {};
        if (!newUser.firstName) newErrors.firstName = 'First Name is required';
        if (!newUser.lastName) newErrors.lastName = 'Last Name is required';
        if (!newUser.userName) newErrors.userName = 'User Name is required';
        if (!newUser.password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateInputs()) {
            dispatch(authRegister(newUser));
        }
    };

    const changeData = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setNewUser((prevState) => ({
                ...prevState,
                [name]: checked,
            }));
        } else {
            setNewUser((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <LoginContainer direction="column" justifyContent="space-between">
                <Card variant='outline'>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: '35px', fontWeight: 'bold', textAlign: 'center' }}
                    >
                        New User Registration
                    </Typography>
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

                        <FormControl error={Boolean(errors.firstName)}>
                            <FormLabel htmlFor="firstName">First Name</FormLabel>
                            <TextField
                                id="firstName"
                                type='text'
                                name="firstName"
                                placeholder='First Name...'
                                required
                                fullWidth
                                variant='outlined'
                                onChange={changeData}
                                value={newUser.firstName}
                            />
                            {errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
                        </FormControl>

                        <FormControl error={Boolean(errors.lastName)}>
                            <FormLabel htmlFor="lastName">Last Name</FormLabel>
                            <TextField
                                id="lastName"
                                type='text'
                                name="lastName"
                                placeholder='Last Name...'
                                required
                                fullWidth
                                variant='outlined'
                                onChange={changeData}
                                value={newUser.lastName}
                            />
                            {errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
                        </FormControl>

                        <FormControl error={Boolean(errors.userName)}>
                            <FormLabel htmlFor="userName">User Name</FormLabel>
                            <TextField
                                id="userName"
                                type='text'
                                name="userName"
                                placeholder='User Name...'
                                required
                                fullWidth
                                variant='outlined'
                                onChange={changeData}
                                value={newUser.userName}
                            />
                            {errors.userName && <FormHelperText>{errors.userName}</FormHelperText>}
                        </FormControl>

                        <FormControl error={Boolean(errors.password)}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                id="password"
                                type='password'
                                name="password"
                                placeholder="••••••"
                                required
                                fullWidth
                                variant='outlined'
                                onChange={changeData}
                                value={newUser.password}
                            />
                            {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                        </FormControl>

                        <FormControlLabel
                            control={<Checkbox value="allow" color="primary" name="isAllowToSeeMyOrder" />}
                            label="Allow others to see my orders"
                            onChange={changeData}
                            checked={newUser.isAllowToSeeMyOrder}
                        />

                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'>
                            Create
                        </Button>
                    </Box>
                </Card>
            </LoginContainer>
        </ThemeProvider>
    );
}