import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/store';
import { DEMO_MOCK_DATA } from './demoMockData';


const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    const tenantId = (getState() as RootState).auth.user?.tenantId;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (tenantId) headers.set('X-Tenant-Id', tenantId);
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Demo mode: intercept all queries and return mock data
const baseQuery: typeof rawBaseQuery = async (args, api, extraOptions) => {
  const token = (api.getState() as RootState).auth.token;
  if (token === 'demo-token') {
    const url = typeof args === 'string' ? args : args.url;
    const method = typeof args === 'string' ? 'GET' : (args.method ?? 'GET');

    // Only intercept reads – let mutations return a stub success
    if (method === 'GET') {
      for (const [pattern, data] of Object.entries(DEMO_MOCK_DATA)) {
        if (url.startsWith(pattern)) {
          return { data };
        }
      }
    }
    // Stub all mutations (POST/PUT/DELETE) with a success response
    return { data: { success: true, message: 'Demo mode: changes are not persisted.' } };
  }
  return rawBaseQuery(args, api, extraOptions);
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
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
  ],
  endpoints: () => ({}),
});
