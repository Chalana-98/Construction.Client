import { api } from '@/store/api';
import type { ConstructionKpiDashboardDto } from '@/types';

export const kpiDashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectKpiDashboard: builder.query<ConstructionKpiDashboardDto, string>({
      query: (projectId) => `/kpi-dashboard/project/${projectId}`,
      providesTags: ['KpiDashboard', 'CostCodes', 'Wbs', 'Schedule', 'Billing', 'Safety', 'Quality'],
    }),

    getExecutiveOverview: builder.query<ConstructionKpiDashboardDto[], void>({
      query: () => '/kpi-dashboard/executive',
      providesTags: ['KpiDashboard'],
    }),
  }),
});

export const {
  useGetProjectKpiDashboardQuery,
  useGetExecutiveOverviewQuery,
} = kpiDashboardApi;
