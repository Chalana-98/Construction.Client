import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, CurrentUser } from '@/types';

interface AuthState {
  token: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
}

const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
  token: storedToken,
  user: storedUser ? (JSON.parse(storedUser) as CurrentUser) : null,
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { token, userId, email, fullName, role, tenantId } = action.payload;
      state.token = token;
      state.user = { userId, email, name: fullName, role, tenantId };
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    updateUser: (state, action: PayloadAction<CurrentUser>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
