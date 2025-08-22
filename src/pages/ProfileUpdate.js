import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Container,
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import AuthContext from '../context/AuthContext';
import { updateUserProfile } from '../api/auth';

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters'),
  email: yup
    .string()
    .email('Enter a valid email'),
});

const ProfileUpdate = () => {
  const { user, updateUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: user?.user?.username || '',
      email: user?.user?.email || '',
    },
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onMutate: async (newUserData) => {
      await queryClient.cancelQueries({ queryKey: ['userProfile'] });
      const previousUserData = queryClient.getQueryData(['userProfile']);

      queryClient.setQueryData(['userProfile'], (old) => ({
        ...old,
        ...newUserData.userData,
      }));

      return { previousUserData };
    },
    onError: (error, variables, context) => {
      if (context?.previousUserData) {
        queryClient.setQueryData(['userProfile'], context.previousUserData);
      }
      toast.error(error.message || 'Update failed. Please try again.');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      updateUser(data);
      setSuccess('Profile updated successfully!');
      toast.success('Profile updated successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const onSubmit = (data) => {
    setSuccess('');
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value && value.trim() !== '')
    );

    if (Object.keys(filteredData).length === 0) {
      toast.warning('Please make at least one change to update your profile.');
      return;
    }

    mutation.mutate({ jwtToken: user.jwt, userData: filteredData });
  };

  const handleReset = () => {
    reset();
    setSuccess('');
    mutation.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <Container maxWidth="sm">
        <Box className="mb-4 flex items-center">
          <IconButton 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" className="font-bold">
            Update Profile
          </Typography>
        </Box>

        <Paper elevation={4} className="p-6 animate-slide-in">
          {success && (
            <Alert severity="success" className="mb-4">
              {success}
            </Alert>
          )}

          {mutation.error && (
            <Alert severity="error" className="mb-4">
              {mutation.error.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextField
              {...register('username')}
              fullWidth
              label="Username"
              variant="outlined"
              error={!!errors.username}
              helperText={errors.username?.message || 'Leave empty to keep current username'}
              disabled={mutation.isLoading}
              placeholder={user?.user?.username}
            />

            <TextField
              {...register('email')}
              fullWidth
              type="email"
              label="Email Address"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email?.message || 'Leave empty to keep current email'}
              disabled={mutation.isLoading}
              placeholder={user?.user?.email}
            />

            <Box className="flex space-x-3 pt-4">
              <Button
                type="submit"
                variant="contained"
                disabled={mutation.isLoading}
                className="flex-1"
              >
                {mutation.isLoading ? (
                  <>
                    <CircularProgress size={20} className="mr-2" />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>

              <Button
                type="button"
                variant="outlined"
                onClick={handleReset}
                disabled={mutation.isLoading}
              >
                Reset
              </Button>
            </Box>
          </form>

          <Box className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Typography variant="body2" color="text.secondary" className="text-center">
              💡 Tip: Only fill in the fields you want to change. Empty fields will keep their current values.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default ProfileUpdate;