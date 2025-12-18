import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { showSnackBar } from '../store/AppConfigReducer';
import services from '../api/apiServices';
import type { AppDispatch } from '../store/store';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container,
  Alert
} from '@mui/material';
import '../styles/app.scss';

interface LoginResponse {
  token: string;
  expiresAt: string;
  admin: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await services.PostRequest<LoginResponse>(
        '/user/login',
        { username, password }
      );

      if (response && response.data) {
        const loginData = {
          token: response.data.token,
          admin: response.data.admin,
          expiresAt: response.data.expiresAt,
        };
        
        console.log('Dispatching login data:', loginData);
        
        dispatch(loginSuccess(loginData));

        dispatch(showSnackBar({
          message: 'Login successful!',
          status: 'success',
        }));

        // Navigate to home or dashboard
        navigate('/home');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      dispatch(showSnackBar({
        message: errorMessage,
        status: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ backgroundColor: 'transparent', padding: 0 }}>
      <Box className="login-container">
        <Paper 
          elevation={3} 
          className="login-paper"
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            className="login-title"
          >
            Finance Manager
          </Typography>
          <Typography 
            variant="body2" 
            align="center" 
            className="login-subtitle"
          >
            Sign in to access your account
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              className="login-error-alert"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="login-text-field"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-text-field"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              className="login-submit-button"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
