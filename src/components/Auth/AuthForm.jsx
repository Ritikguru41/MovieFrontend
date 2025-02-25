import { Box, Button, Dialog, FormLabel, IconButton, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const labelStyle = { mt: 1, mb: 1, fontWeight: 'bold', color: '#555' };

const AuthForm = ({ onSubmit, isAdmin }) => {
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [isSignup, setIsSignup] = useState(!isAdmin); // Initialize based on isAdmin

    useEffect(() => {
        setIsSignup(!isAdmin);
    }, [isAdmin]);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ inputs, signup: isSignup });
    };

    return (
        <Dialog PaperProps={{ style: { borderRadius: 20, padding: '20px', backgroundColor: '#f9f9f9' } }} open={true}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton component={Link} to="/">
                    <CloseRoundedIcon sx={{ color: '#333' }} />
                </IconButton>
            </Box>
            <Typography variant="h4" textAlign="center" fontWeight="bold" color="#2b2d42" gutterBottom>
                {isSignup ? "Create an Account" : "Welcome Back"}
            </Typography>
            <Typography variant="subtitle1" textAlign="center" color="gray" gutterBottom>
                {isSignup ? "Join us to explore more features" : "Sign in to continue"}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box padding={4} display="flex" flexDirection="column" width={350} margin="auto" boxShadow={3} bgcolor="white" borderRadius={2}>
                    {!isAdmin && isSignup && (
                        <>
                            <FormLabel sx={labelStyle}>Full Name</FormLabel>
                            <TextField
                                value={inputs.name}
                                onChange={handleChange}
                                margin="normal"
                                variant="outlined"
                                type="text"
                                name="name"
                                fullWidth
                            />
                        </>
                    )}
                    <FormLabel sx={labelStyle}>Email Address</FormLabel>
                    <TextField
                        value={inputs.email}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        type="email"
                        name="email"
                        fullWidth
                    />
                    <FormLabel sx={labelStyle}>Password</FormLabel>
                    <TextField
                        value={inputs.password}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        type="password"
                        name="password"
                        fullWidth
                    />
                    <Button
                        sx={{ mt: 3, borderRadius: 2, bgcolor: '#2b2d42', color: 'white', fontWeight: 'bold', '&:hover': { bgcolor: '#1a1c29' } }}
                        type="submit"
                        fullWidth
                        variant="contained"
                    >
                        {isSignup ? "Sign Up" : "Login"}
                    </Button>
                    {!isAdmin && (
                        <Button
                            onClick={() => setIsSignup(!isSignup)}
                            sx={{ mt: 2, borderRadius: 2, color: '#2b2d42', fontWeight: 'bold' }}
                            fullWidth
                        >
                            {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                        </Button>
                    )}
                </Box>
            </form>
        </Dialog>
    );
};

export default AuthForm;
