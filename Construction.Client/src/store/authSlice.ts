import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthResponse, CurrentUser } from '@/types';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  expiresAt: string | null;
  user: CurrentUser | null;
  isAuthenticated: boolean;
}

const storedToken = localStorage.getItem('token');
const storedRefreshToken = localStorage.getItem('refreshToken');
const storedExpiresAt = localStorage.getItem('expiresAt');
const storedUser = localStorage.getItem('user');

/** Parses persisted user JSON defensively: corrupt storage must not break app start-up. */
function readStoredUser(): CurrentUser | null {
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser) as CurrentUser;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

const initialState: AuthState = {
  token: storedToken,
  refreshToken: storedRefreshToken,
  expiresAt: storedExpiresAt,
  user: readStoredUser(),
  isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { token, refreshToken, expiresAt, userId, email, fullName, role, tenantId } = action.payload;
      state.token = token;
      // Refresh may return without re-issuing one; keep the existing token in that case.
      state.refreshToken = refreshToken ?? state.refreshToken;
      state.expiresAt = expiresAt ?? null;
      state.user = { userId, email, name: fullName, role, tenantId };
      state.isAuthenticated = true;

      localStorage.setItem('token', token);
      if (state.refreshToken) localStorage.setItem('refreshToken', state.refreshToken);
      if (expiresAt) localStorage.setItem('expiresAt', expiresAt);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    updateUser: (state, action: PayloadAction<CurrentUser>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.expiresAt = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresAt');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
