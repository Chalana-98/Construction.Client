import { api } from '@/store/api';
import type {
  MaterialDto,
  CreateMaterialDto,
  UpdateMaterialDto,
  AllocateMaterialToProjectDto,
  PagedResult,
} from '@/types';

export const materialsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMaterials: builder.query<
      PagedResult<MaterialDto>,
      { page?: number; pageSize?: number; search?: string }
    >({
      query: ({ page = 1, pageSize = 10, search }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (search) params.set('search', search);
        return `/materials?${params.toString()}`;
      },
      providesTags: ['Materials'],
    }),

    getMaterial: builder.query<MaterialDto, string>({
      query: (id) => `/materials/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Materials', id }],
    }),

    createMaterial: builder.mutation<MaterialDto, CreateMaterialDto>({
      query: (body) => ({ url: '/materials', method: 'POST', body }),
      invalidatesTags: ['Materials'],
    }),

    updateMaterial: builder.mutation<MaterialDto, { id: string; data: UpdateMaterialDto }>({
      query: ({ id, data }) => ({ url: `/materials/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Materials', id }, 'Materials'],
    }),

    deleteMaterial: builder.mutation<void, string>({
      query: (id) => ({ url: `/materials/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Materials'],
    }),

    updateMaterialStock: builder.mutation<MaterialDto, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: `/materials/${id}/stock`,
        method: 'PUT',
        body: quantity,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Materials', id }, 'Materials'],
    }),

    allocateMaterial: builder.mutation<void, AllocateMaterialToProjectDto>({
      query: (body) => ({
        url: `/materials/${body.materialId}/allocate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Materials'],
    }),
  }),
});

export const {
  useGetMaterialsQuery,
  useGetMaterialQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
  useUpdateMaterialStockMutation,
  useAllocateMaterialMutation,
} = materialsApi;
