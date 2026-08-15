import { api } from '@/store/api';
import type {
  ExpenseDto,
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseSummaryDto,
  PagedResult,
  ExpenseCategory,
} from '@/types';

export const expensesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<
      PagedResult<ExpenseDto>,
      {
        projectId?: string;
        page?: number;
        pageSize?: number;
        category?: ExpenseCategory;
        isApproved?: boolean;
      }
    >({
      query: ({ projectId, page = 1, pageSize = 10, category, isApproved }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (category !== undefined) params.set('category', String(category));
        if (isApproved !== undefined) params.set('isApproved', String(isApproved));
        if (projectId) {
          return `/expenses/project/${projectId}?${params.toString()}`;
        }
        return `/expenses?${params.toString()}`;
      },
      providesTags: ['Expenses'],
    }),

    getExpense: builder.query<ExpenseDto, string>({
      query: (id) => `/expenses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Expenses', id }],
    }),

    createExpense: builder.mutation<ExpenseDto, CreateExpenseDto>({
      query: (body) => ({ url: '/expenses', method: 'POST', body }),
      invalidatesTags: ['Expenses', 'Projects', 'Dashboard'],
    }),

    updateExpense: builder.mutation<ExpenseDto, { id: string; data: UpdateExpenseDto }>({
      query: ({ id, data }) => ({ url: `/expenses/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Expenses', id },
        'Expenses',
        'Projects',
      ],
    }),

    deleteExpense: builder.mutation<void, string>({
      query: (id) => ({ url: `/expenses/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Expenses', 'Projects'],
    }),

    approveExpense: builder.mutation<ExpenseDto, string>({
      query: (id) => ({ url: `/expenses/${id}/approve`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Expenses', id }, 'Expenses', 'Projects'],
    }),

    markExpensePaid: builder.mutation<ExpenseDto, string>({
      query: (id) => ({ url: `/expenses/${id}/mark-paid`, method: 'POST' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Expenses', id }, 'Expenses', 'Projects'],
    }),

    getExpenseSummary: builder.query<ExpenseSummaryDto, string>({
      query: (projectId) => `/expenses/project/${projectId}/summary`,
      providesTags: ['Expenses'],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useApproveExpenseMutation,
  useMarkExpensePaidMutation,
  useGetExpenseSummaryQuery,
} = expensesApi;
