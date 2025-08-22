import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const LoadingSpinner = ({ size = 40, message = 'Loading...' }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      minHeight="200px"
      className="animate-fade-in"
    >
      <CircularProgress size={size} />
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </Box>
  );
};

export default LoadingSpinner;