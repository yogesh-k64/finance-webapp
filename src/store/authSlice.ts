import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  admin: Admin | null;
  expiresAt: string | null;
}

// Initialize authentication state from localStorage
const getInitialAuthState = (): AuthState => {
  const token = localStorage.getItem('authToken');
  const expiresAt = localStorage.getItem('expiresAt');
  const adminStr = localStorage.getItem('admin');
  
  // Check if token exists and is not expired
  if (token && expiresAt) {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    
    if (now < expiry) {
      // Token is valid
      return {
        isAuthenticated: true,
        token,
        admin: adminStr ? JSON.parse(adminStr) : null,
        expiresAt,
      };
    }
    
    // Token expired, clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('admin');
    localStorage.removeItem('expiresAt');
  }
  
  // No valid authentication
  return {
    isAuthenticated: false,
    token: null,
    admin: null,
    expiresAt: null,
  };
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; admin: Admin; expiresAt: string }>) => {
      console.log('loginSuccess action payload:', action.payload);
      
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.admin = action.payload.admin;
      state.expiresAt = action.payload.expiresAt;
      
      // Persist to localStorage
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('admin', JSON.stringify(action.payload.admin));
      localStorage.setItem('expiresAt', action.payload.expiresAt);
      
      console.log('Token saved to localStorage:', localStorage.getItem('authToken'));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.admin = null;
      state.expiresAt = null;
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('admin');
      localStorage.removeItem('expiresAt');
    },
    checkAuth: (state) => {
      if (state.token && state.expiresAt) {
        const now = new Date().getTime();
        const expiry = new Date(state.expiresAt).getTime();
        
        if (now >= expiry) {
          // Token expired
          state.isAuthenticated = false;
          state.token = null;
          state.admin = null;
          state.expiresAt = null;
          
          localStorage.removeItem('authToken');
          localStorage.removeItem('admin');
          localStorage.removeItem('expiresAt');
        } else {
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { loginSuccess, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
