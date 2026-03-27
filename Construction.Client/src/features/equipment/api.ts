import { api } from '@/store/api';
import type {
  EquipmentDto,
  CreateEquipmentDto,
  UpdateEquipmentDto,
  AssignEquipmentToProjectDto,
  EquipmentStatus,
  PagedResult,
} from '@/types';

export const equipmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEquipment: builder.query<
      PagedResult<EquipmentDto>,
      { page?: number; pageSize?: number; status?: EquipmentStatus; search?: string }
    >({
      query: ({ page = 1, pageSize = 10, status, search }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (status !== undefined) params.set('status', String(status));
        if (search) params.set('search', search);
        return `/equipment?${params.toString()}`;
      },
      providesTags: ['Equipment'],
    }),

    getEquipmentById: builder.query<EquipmentDto, string>({
      query: (id) => `/equipment/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Equipment', id }],
    }),

    createEquipment: builder.mutation<EquipmentDto, CreateEquipmentDto>({
      query: (body) => ({ url: '/equipment', method: 'POST', body }),
      invalidatesTags: ['Equipment'],
    }),

    updateEquipment: builder.mutation<EquipmentDto, { id: string; data: UpdateEquipmentDto }>({
      query: ({ id, data }) => ({ url: `/equipment/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Equipment', id }, 'Equipment'],
    }),

    deleteEquipment: builder.mutation<void, string>({
      query: (id) => ({ url: `/equipment/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Equipment'],
    }),

    updateEquipmentStatus: builder.mutation<
      EquipmentDto,
      { id: string; status: EquipmentStatus }
    >({
      query: ({ id, status }) => ({
        url: `/equipment/${id}/status`,
        method: 'PUT',
        body: status,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Equipment', id }, 'Equipment'],
    }),

    assignEquipmentToProject: builder.mutation<void, AssignEquipmentToProjectDto>({
      query: (body) => ({
        url: `/equipment/${body.equipmentId}/assign`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Equipment'],
    }),

    returnEquipment: builder.mutation<void, string>({
      query: (id) => ({ url: `/equipment/${id}/return`, method: 'PUT' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Equipment', id }, 'Equipment'],
    }),
  }),
});

export const {
  useGetEquipmentQuery,
  useGetEquipmentByIdQuery,
  useCreateEquipmentMutation,
  useUpdateEquipmentMutation,
  useDeleteEquipmentMutation,
  useUpdateEquipmentStatusMutation,
  useAssignEquipmentToProjectMutation,
  useReturnEquipmentMutation,
} = equipmentApi;
