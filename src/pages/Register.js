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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'react-toastify';

import AuthContext from '../context/AuthContext';
import { registerUser } from '../api/auth';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

const Register = () => {
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
      const { confirmPassword, ...registrationData } = data;
      const user = await registerUser(registrationData);
      login(user);
      toast.success('Account created successfully! Welcome aboard!');
      navigate('/', { replace: true });
    } catch (err) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Paper 
        elevation={8}
        className="w-full max-w-md p-8 animate-slide-in"
      >
        <Box className="text-center mb-6">
          <PersonAddIcon className="text-4xl text-green-600 mb-2" />
          <Typography variant="h4" component="h1" className="font-bold mb-2">
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join us and start your journey today
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            {...register('username')}
            fullWidth
            label="Username"
            variant="outlined"
            error={!!errors.username}
            helperText={errors.username?.message}
            disabled={isSubmitting}
            autoComplete="username"
          />

          <TextField
            {...register('email')}
            fullWidth
            type="email"
            label="Email Address"
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email?.message}
            disabled={isSubmitting}
            autoComplete="email"
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
            autoComplete="new-password"
          />

          <TextField
            {...register('confirmPassword')}
            fullWidth
            type="password"
            label="Confirm Password"
            variant="outlined"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            disabled={isSubmitting}
            autoComplete="new-password"
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
              'Create Account'
            )}
          </Button>
        </form>

        <Box className="mt-6 text-center">
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link 
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </div>
  );
};

export default Register;