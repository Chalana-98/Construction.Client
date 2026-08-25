import { api } from '@/store/api';
import type {
  PurchaseOrderDto,
  CreatePurchaseOrderRequest,
  ReceivePurchaseOrderGoodsRequest,
} from '@/types';

export const purchaseOrdersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getPurchaseOrdersByProject: builder.query<PurchaseOrderDto[], string>({
      query: (projectId) => `/purchaseorders/project/${projectId}`,
      providesTags: ['PurchaseOrders'],
    }),

    getPurchaseOrder: builder.query<PurchaseOrderDto, string>({
      query: (id) => `/purchaseorders/${id}`,
      providesTags: ['PurchaseOrders'],
    }),

    createPurchaseOrder: builder.mutation<PurchaseOrderDto, CreatePurchaseOrderRequest>({
      query: (body) => ({ url: '/purchaseorders', method: 'POST', body }),
      invalidatesTags: ['PurchaseOrders', 'CostCodes', 'Dashboard'],
    }),

    approvePurchaseOrder: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/purchaseorders/${id}/approve`, method: 'POST' }),
      invalidatesTags: ['PurchaseOrders', 'CostCodes', 'Dashboard', 'Approvals'],
    }),

    receivePurchaseOrderGoods: builder.mutation<
      { message: string },
      { id: string; data: ReceivePurchaseOrderGoodsRequest }
    >({
      query: ({ id, data }) => ({
        url: `/purchaseorders/${id}/receive`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PurchaseOrders', 'Inventory', 'Materials', 'CostCodes', 'Dashboard'],
    }),

    closePurchaseOrder: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/purchaseorders/${id}/close`, method: 'POST' }),
      invalidatesTags: ['PurchaseOrders'],
    }),

    deletePurchaseOrder: builder.mutation<void, string>({
      query: (id) => ({ url: `/purchaseorders/${id}`, method: 'DELETE' }),
      invalidatesTags: ['PurchaseOrders', 'CostCodes'],
    }),
  }),
});

export const {
  useGetPurchaseOrdersByProjectQuery,
  useGetPurchaseOrderQuery,
  useCreatePurchaseOrderMutation,
  useApprovePurchaseOrderMutation,
  useReceivePurchaseOrderGoodsMutation,
  useClosePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
} = purchaseOrdersApi;
