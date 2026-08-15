import { api } from '@/store/api';
import type {
  EquipmentDto,
  CreateEquipmentDto,
  UpdateEquipmentDto,
  AssignEquipmentToProjectDto,
  EquipmentStatus,
  PagedResult,
} from '@/types';

export interface ProjectEquipmentDto {
  id: string;
  projectId: string;
  projectName: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCode: string;
  assignedDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  dailyRate: number;
  totalCost: number;
  quantity: number;
  isReturned: boolean;
  notes?: string;
}

export const equipmentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEquipment: builder.query<
      PagedResult<EquipmentDto>,
      { page?: number; pageSize?: number; category?: string; status?: EquipmentStatus; search?: string }
    >({
      query: ({ page = 1, pageSize = 10, category, status, search }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (category) params.set('category', category);
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
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Equipment', id }, 'Equipment'],
    }),

    assignEquipmentToProject: builder.mutation<ProjectEquipmentDto, AssignEquipmentToProjectDto>({
      query: (body) => ({
        url: '/equipment/assign',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Equipment', 'Projects'],
    }),

    getProjectEquipment: builder.query<ProjectEquipmentDto[], string>({
      query: (projectId) => `/equipment/project/${projectId}`,
      providesTags: ['Equipment'],
    }),

    returnEquipment: builder.mutation<ProjectEquipmentDto, string>({
      query: (projectEquipmentId) => ({
        url: `/equipment/assignments/${projectEquipmentId}/return`,
        method: 'POST',
      }),
      invalidatesTags: ['Equipment', 'Projects'],
    }),

    removeEquipmentFromProject: builder.mutation<void, string>({
      query: (projectEquipmentId) => ({
        url: `/equipment/assignments/${projectEquipmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Equipment', 'Projects'],
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
  useGetProjectEquipmentQuery,
  useReturnEquipmentMutation,
  useRemoveEquipmentFromProjectMutation,
} = equipmentApi;
