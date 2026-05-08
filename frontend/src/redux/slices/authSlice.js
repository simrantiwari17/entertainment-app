/**
 * Authentication Redux Slice
 * 
 * Manages authentication state:
 * - User information
 * - Login/logout actions
 * - Token management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// Load initial state from localStorage (if user was previously logged in)
const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');
const initialUser = userStr ? JSON.parse(userStr) : null;

const initialState = {
  user: initialUser,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null
};

/**
 * Async thunk for user signup
 * Handles API call and updates state accordingly
 */
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(email, password, name);
      // Save token and user to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Signup failed'
      );
    }
  }
);

/**
 * Async thunk for user login
 * Handles API call and updates state accordingly
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      // Save token and user to localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// Create auth slice with reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Logout user - clear state and localStorage
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    /**
     * Clear error messages
     */
    clearError: (state) => {
      state.error = null;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    // Handle signup pending
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    // Handle signup success
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    
    // Handle signup error
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Handle login pending
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    
    // Handle login success
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    
    // Handle login error
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

// Export actions
export const { logout, clearError, setUser } = authSlice.actions;

// Export reducer
export default authSlice.reducer;



