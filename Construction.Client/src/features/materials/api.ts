import { api } from '@/store/api';
import type {
  MaterialDto,
  CreateMaterialDto,
  UpdateMaterialDto,
  AllocateMaterialToProjectDto,
  PagedResult,
} from '@/types';

export interface ProjectMaterialDto {
  id: string;
  projectId: string;
  projectName: string;
  materialId: string;
  materialName: string;
  materialCode: string;
  unit: string;
  unitPrice: number;
  quantityAllocated: number;
  quantityUsed: number;
  quantityRemaining: number;
  totalCost: number;
  allocationDate: string;
  purchaseOrderNumber?: string;
  notes?: string;
}

export interface UpdateMaterialUsageDto {
  quantityUsed: number;
  notes?: string;
}

export const materialsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMaterials: builder.query<
      PagedResult<MaterialDto>,
      { page?: number; pageSize?: number; category?: string; lowStock?: boolean; search?: string }
    >({
      query: ({ page = 1, pageSize = 10, category, lowStock, search }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (category) params.set('category', category);
        if (lowStock !== undefined) params.set('lowStock', String(lowStock));
        if (search) params.set('search', search);
        return `/materials?${params.toString()}`;
      },
      providesTags: ['Materials'],
    }),

    getMaterial: builder.query<MaterialDto, string>({
      query: (id) => `/materials/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Materials', id }],
    }),

    getLowStockMaterials: builder.query<MaterialDto[], void>({
      query: () => '/materials/low-stock',
      providesTags: ['Materials'],
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

    updateMaterialStock: builder.mutation<
      MaterialDto,
      { id: string; quantityChange: number; reason?: string }
    >({
      query: ({ id, quantityChange, reason }) => ({
        url: `/materials/${id}/stock`,
        method: 'PATCH',
        body: { quantityChange, reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Materials', id }, 'Materials'],
    }),

    allocateMaterial: builder.mutation<ProjectMaterialDto, AllocateMaterialToProjectDto>({
      query: (body) => ({
        url: '/materials/allocate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Materials', 'Projects'],
    }),

    getProjectMaterials: builder.query<ProjectMaterialDto[], string>({
      query: (projectId) => `/materials/project/${projectId}`,
      providesTags: ['Materials'],
    }),

    updateMaterialUsage: builder.mutation<
      ProjectMaterialDto,
      { projectMaterialId: string; data: UpdateMaterialUsageDto }
    >({
      query: ({ projectMaterialId, data }) => ({
        url: `/materials/allocations/${projectMaterialId}/usage`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Materials', 'Projects'],
    }),

    removeMaterialFromProject: builder.mutation<void, string>({
      query: (projectMaterialId) => ({
        url: `/materials/allocations/${projectMaterialId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Materials', 'Projects'],
    }),
  }),
});

export const {
  useGetMaterialsQuery,
  useGetMaterialQuery,
  useGetLowStockMaterialsQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
  useUpdateMaterialStockMutation,
  useAllocateMaterialMutation,
  useGetProjectMaterialsQuery,
  useUpdateMaterialUsageMutation,
  useRemoveMaterialFromProjectMutation,
} = materialsApi;
