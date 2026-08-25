import { api } from '@/store/api';
import type {
  InventoryTransactionDto,
  ProjectInventoryStockDto,
  CreateInventoryTransactionRequest,
} from '@/types';

export const inventoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryTransactions: builder.query<InventoryTransactionDto[], string>({
      query: (projectId) => `/inventory/project/${projectId}/transactions`,
      providesTags: ['Inventory'],
    }),

    getProjectStock: builder.query<ProjectInventoryStockDto[], string>({
      query: (projectId) => `/inventory/project/${projectId}/stock`,
      providesTags: ['Inventory', 'Materials'],
    }),

    createTransaction: builder.mutation<InventoryTransactionDto, CreateInventoryTransactionRequest>({
      query: (body) => ({ url: '/inventory/transactions', method: 'POST', body }),
      invalidatesTags: ['Inventory', 'Materials', 'CostCodes', 'Dashboard'],
    }),

    adjustStock: builder.mutation<
      ProjectInventoryStockDto,
      { projectId: string; materialId: string; newQuantity: number; reason: string }
    >({
      query: (body) => ({ url: '/inventory/stock/adjust', method: 'POST', body }),
      invalidatesTags: ['Inventory', 'Materials', 'CostCodes', 'Dashboard'],
    }),
  }),
});

export const {
  useGetInventoryTransactionsQuery,
  useGetProjectStockQuery,
  useCreateTransactionMutation,
  useAdjustStockMutation,
} = inventoryApi;
