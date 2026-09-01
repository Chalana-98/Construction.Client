import { api } from '@/store/api';
import type { TenantSettingsDto, UpdateTenantSettingsRequest } from '@/types';

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<TenantSettingsDto, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<TenantSettingsDto, UpdateTenantSettingsRequest>({
      query: (data) => ({
        url: '/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Settings', 'Projects', 'Dashboard', 'KpiDashboard', 'CostCodes'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} = settingsApi;
