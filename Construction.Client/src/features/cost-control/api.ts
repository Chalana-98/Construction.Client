import { api } from '@/store/api';
import type {
  CostCodeDto,
  CreateCostCodeRequest,
  UpdateCostCodeRequest,
  ProjectCostControlSummaryDto,
} from '@/types';

export const costCodesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCostCodesByProject: builder.query<CostCodeDto[], string>({
      query: (projectId) => `/costcodes/project/${projectId}`,
      providesTags: ['CostCodes'],
    }),

    getCostCodeSummary: builder.query<ProjectCostControlSummaryDto, string>({
      query: (projectId) => `/costcodes/project/${projectId}/summary`,
      providesTags: ['CostCodes', 'Expenses', 'PurchaseOrders', 'Subcontracts'],
    }),

    createCostCode: builder.mutation<CostCodeDto, CreateCostCodeRequest>({
      query: (body) => ({ url: '/costcodes', method: 'POST', body }),
      invalidatesTags: ['CostCodes'],
    }),

    seedStandardCostCodes: builder.mutation<{ message: string }, string>({
      query: (projectId) => ({ url: `/costcodes/project/${projectId}/seed-standard`, method: 'POST' }),
      invalidatesTags: ['CostCodes'],
    }),

    updateCostCode: builder.mutation<CostCodeDto, { id: string; data: UpdateCostCodeRequest }>({
      query: ({ id, data }) => ({ url: `/costcodes/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['CostCodes'],
    }),

    deleteCostCode: builder.mutation<void, string>({
      query: (id) => ({ url: `/costcodes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['CostCodes'],
    }),
  }),
});

export const {
  useGetCostCodesByProjectQuery,
  useGetCostCodeSummaryQuery,
  useCreateCostCodeMutation,
  useSeedStandardCostCodesMutation,
  useUpdateCostCodeMutation,
  useDeleteCostCodeMutation,
} = costCodesApi;
