import React, { useContext, useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button,
  Box,
  IconButton,
  Fab
} from '@mui/material';
import { 
  Logout as LogoutIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import AuthContext from '../context/AuthContext';
import { fetchUserProfile } from '../api/auth';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AiChatbot from '../components/ui/AiChatbot';
import DraggableList from '../components/ui/DraggableList';
import ThreeDBox from '../components/ui/ThreeDBox';
import VoiceCommand from '../components/ui/VoiceCommand';

const Dashboard = ({ toggleMode, mode }) => {
  const { user, logout } = useContext(AuthContext);
  const [greeting, setGreeting] = useState('');

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => fetchUserProfile(user.jwt),
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  if (isLoading) return <LoadingSpinner message="Loading your dashboard..." />;

  if (error) {
    return (
      <Container className="pt-8">
        <Typography color="error" className="text-center">
          Error loading dashboard: {error.message}
        </Typography>
      </Container>
    );
  }

  const username = profileData?.username || user?.user?.username || 'User';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Box className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <Container maxWidth="lg" className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h4" component="h1" className="font-bold text-gray-900 dark:text-white">
                {greeting}, {username}! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome to your AI-powered dashboard
              </Typography>
            </div>

            <div className="flex items-center space-x-2">
              <IconButton
                onClick={toggleMode}
                className="text-gray-600 dark:text-gray-300"
              >
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              <Button
                component={Link}
                to="/profile"
                startIcon={<SettingsIcon />}
                variant="outlined"
                size="small"
              >
                Profile
              </Button>

              <Button
                onClick={logout}
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                size="small"
              >
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" className="py-8">
        <Grid container spacing={4}>
          {/* Welcome Card */}
          <Grid item xs={12}>
            <Card className="animate-fade-in">
              <CardContent>
                <Typography variant="h6" className="mb-2">
                  🚀 Welcome to the Future of Web Apps
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This dashboard showcases cutting-edge features including AI chatbot, 
                  voice commands, 3D graphics, drag & drop, and more. All optimized 
                  for performance and accessibility.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* AI Chatbot */}
          <Grid item xs={12} md={6} lg={4}>
            <div className="h-full">
              <AiChatbot />
            </div>
          </Grid>

          {/* Voice Commands */}
          <Grid item xs={12} md={6} lg={4}>
            <div className="h-full">
              <VoiceCommand />
            </div>
          </Grid>

          {/* 3D Interactive Box */}
          <Grid item xs={12} md={6} lg={4}>
            <div className="h-full">
              <ThreeDBox />
            </div>
          </Grid>

          {/* Draggable Task List */}
          <Grid item xs={12} md={6}>
            <DraggableList />
          </Grid>

          {/* Stats Cards */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card className="text-center animate-slide-in">
                  <CardContent>
                    <Typography variant="h4" className="font-bold text-blue-600">
                      {new Date().getMonth() + 1}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current Month
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6}>
                <Card className="text-center animate-slide-in">
                  <CardContent>
                    <Typography variant="h4" className="font-bold text-green-600">
                      100%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Features Active
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card className="animate-slide-in">
                  <CardContent>
                    <Typography variant="h6" className="mb-2">
                      🎯 Quick Actions
                    </Typography>
                    <div className="space-y-2">
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        size="small"
                        component={Link}
                        to="/profile"
                      >
                        Update Profile
                      </Button>
                      <Button 
                        fullWidth 
                        variant="outlined" 
                        size="small"
                        onClick={() => window.location.reload()}
                      >
                        Refresh Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Action Button for Quick Access */}
      <Fab
        color="primary"
        className="fixed bottom-6 right-6"
        onClick={toggleMode}
      >
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </Fab>
    </div>
  );
};

export default Dashboard;