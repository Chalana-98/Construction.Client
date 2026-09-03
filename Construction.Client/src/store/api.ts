import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from './mutex';
import type { RootState } from '@/store';
import { logout, setCredentials } from './authSlice';
import type { AuthResponse } from '@/types';

/**
 * Demo mode ships only in development builds.
 *
 * Previously the interceptor and its fixtures were bundled into production, where anyone could
 * activate an authentication bypass by setting the token to the literal string 'demo-token'.
 * `import.meta.env.DEV` is statically replaced at build time, so the whole branch — and the
 * fixture module it imports — is tree-shaken out of a production bundle.
 */
const DEMO_ENABLED = import.meta.env.DEV;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    // NOTE: no X-Tenant-Id header. The server derives the tenant from the signed JWT and
    // ignores client-supplied tenant headers; sending one implied it was trusted.
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

/** Serialises refresh attempts so a burst of 401s triggers exactly one refresh. */
const refreshMutex = new Mutex();

const baseQueryWithReauth: typeof rawBaseQuery = async (args, api, extraOptions) => {
  if (DEMO_ENABLED) {
    const state = api.getState() as RootState;
    if (state.auth.token === 'demo-token') {
      const { demoBaseQuery } = await import('./demoBaseQuery');
      return demoBaseQuery(args);
    }
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  // Access tokens are short-lived. On a 401, exchange the refresh token once and replay.
  if (result.error?.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    if (refreshMutex.isLocked()) {
      // Another request is already refreshing; wait for it and replay.
      await refreshMutex.waitForUnlock();
      return rawBaseQuery(args, api, extraOptions);
    }

    const release = await refreshMutex.acquire();
    try {
      const refreshResult = await rawBaseQuery(
        { url: '/auth/refresh', method: 'POST', body: { refreshToken } },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        api.dispatch(setCredentials(refreshResult.data as AuthResponse));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh token expired or revoked — the session is genuinely over.
        api.dispatch(logout());
      }
    } finally {
      release();
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Projects',
    'Tasks',
    'DailyLogs',
    'Expenses',
    'Equipment',
    'Materials',
    'Documents',
    'Milestones',
    'Issues',
    'ProjectMembers',
    'Dashboard',
    'RFIs',
    'ChangeOrders',
    'Vendors',
    'Timesheets',
    'Profile',
    'CostCodes',
    'Wbs',
    'Procurement',
    'PurchaseOrders',
    'MaterialRequests',
    'Inventory',
    'PhysicalProgress',
    'Schedule',
    'Billing',
    'Safety',
    'Quality',
    'Subcontracts',
    'Approvals',
    'KpiDashboard',
    'EquipmentMaintenance',
    'Settings',
    'Users',
  ],
  endpoints: () => ({}),
});
