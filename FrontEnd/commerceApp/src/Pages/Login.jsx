import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, FormControl, FormLabel, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import { authLogin, reset } from '../dl/Slices/authSlice';

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
        maxWidth: '450px',
    },
}));

const LoginContainer = styled(Stack)(({ theme }) => ({
    height: '100%',
    padding: 150,
    backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
}));

export default function Login({ setRole }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const [userLogin, setUserLogin] = useState({
        userName: '',
        password: ''
    });

    useEffect(() => {
        if (isError) {
            toast.error(message);
            console.log("ISError:",message)
        }
        if (isSuccess) {
            toast.success('Login successful!');
            if (user?.isAdmin) {
                setRole('admin');
                navigate('/admin-dashboard');
            } else {
                setRole('user');
                navigate('/user-dashboard');
            }
        }
           // Reset the auth state on component unmount
           return () => {
            dispatch(reset());
        };
    }, [isError, isSuccess, message, user, dispatch, navigate,setRole]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserLogin((prevUserLogin) => ({
            ...prevUserLogin,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("userLogin:", userLogin)
        dispatch(authLogin(userLogin)); // Pass the userLogin state containing credentials
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <LoginContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography component="h1" variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Next Generation E-Commerce:
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                     {/* Display error message here if registration fails */}
                      {isError && (
                          <Typography color="error" sx={{ textAlign: 'center' }}>
                              {message}
                          </Typography>
                      )}
                        <FormControl>

                            <FormLabel htmlFor="userName">User Name</FormLabel>
                            <TextField
                                id="userName"
                                name="userName"
                                placeholder="userName..."
                                required
                                fullWidth
                                variant="outlined"
                                value={userLogin.userName}
                                onChange={handleChange} // Capture input changes
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                id="password"
                                type="password"
                                name="password"
                                placeholder="••••••"
                                required
                                fullWidth
                                variant="outlined"
                                value={userLogin.password}
                                onChange={handleChange} // Capture input changes
                            />
                        </FormControl>
                        <Button type="submit" fullWidth variant="contained">
                            Login
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
                            New User?{' '}
                            <Link to="/register" variant="body2">
                                Register
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </LoginContainer>
        </ThemeProvider>
    );
}