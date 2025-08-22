import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  CircularProgress 
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { toast } from 'react-toastify';

import AuthContext from '../context/AuthContext';
import { loginUser } from '../api/auth';

const schema = yup.object().shape({
  identifier: yup.string().required('Email or username is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError('');
      const user = await loginUser(data);
      login(user);
      toast.success('Welcome back!');
      navigate('/', { replace: true });
    } catch (err) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Paper 
        elevation={8}
        className="w-full max-w-md p-8 animate-slide-in"
      >
        <Box className="text-center mb-6">
          <LoginIcon className="text-4xl text-blue-600 mb-2" />
          <Typography variant="h4" component="h1" className="font-bold mb-2">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your account to continue
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            {...register('identifier')}
            fullWidth
            label="Email or Username"
            variant="outlined"
            error={!!errors.identifier}
            helperText={errors.identifier?.message}
            disabled={isSubmitting}
            autoComplete="username"
          />

          <TextField
            {...register('password')}
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={isSubmitting}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={isSubmitting}
            className="mt-6 py-3"
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link 
              to="/register"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create Account
            </Link>
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default Login;