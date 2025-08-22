import axios from 'axios';

const API_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.jwt) {
        config.headers.Authorization = `Bearer ${user.jwt}`;
      }
    } catch (error) {
      console.error('Error parsing user token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post('/api/auth/local/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Registration failed');
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/api/auth/local', {
      identifier: credentials.identifier,
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Login failed');
  }
};

export const fetchUserProfile = async (jwtToken) => {
  try {
    const response = await apiClient.get('/api/users/me', {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Failed to fetch profile');
  }
};

export const updateUserProfile = async ({ jwtToken, userData }) => {
  try {
    const response = await apiClient.put('/api/users/me', userData, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error?.message || 'Update failed');
  }
};

export default apiClient;