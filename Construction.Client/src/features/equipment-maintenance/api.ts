import { api } from '@/store/api';
import type {
  EquipmentMaintenanceRecordDto,
  CreateEquipmentMaintenanceRequest,
  UpdateEquipmentMaintenanceRequest,
  EquipmentMaintenanceSummaryDto,
} from '@/types';

export const equipmentMaintenanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMaintenanceByProject: builder.query<EquipmentMaintenanceRecordDto[], string>({
      query: (projectId) => `/equipment-maintenance/project/${projectId}`,
      providesTags: ['EquipmentMaintenance'],
    }),

    getMaintenanceByEquipment: builder.query<EquipmentMaintenanceRecordDto[], string>({
      query: (equipmentId) => `/equipment-maintenance/equipment/${equipmentId}`,
      providesTags: ['EquipmentMaintenance'],
    }),

    getMaintenanceSummary: builder.query<EquipmentMaintenanceSummaryDto, string | void>({
      query: (projectId) =>
        projectId ? `/equipment-maintenance/summary?projectId=${projectId}` : '/equipment-maintenance/summary',
      providesTags: ['EquipmentMaintenance', 'Equipment'],
    }),

    recordMaintenance: builder.mutation<EquipmentMaintenanceRecordDto, CreateEquipmentMaintenanceRequest>({
      query: (body) => ({ url: '/equipment-maintenance', method: 'POST', body }),
      invalidatesTags: ['EquipmentMaintenance', 'Equipment', 'CostCodes', 'Dashboard'],
    }),

    updateMaintenance: builder.mutation<
      EquipmentMaintenanceRecordDto,
      { id: string; data: UpdateEquipmentMaintenanceRequest }
    >({
      query: ({ id, data }) => ({ url: `/equipment-maintenance/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['EquipmentMaintenance', 'Equipment'],
    }),

    deleteMaintenance: builder.mutation<void, string>({
      query: (id) => ({ url: `/equipment-maintenance/${id}`, method: 'DELETE' }),
      invalidatesTags: ['EquipmentMaintenance', 'Equipment'],
    }),
  }),
});

export const {
  useGetMaintenanceByProjectQuery,
  useGetMaintenanceByEquipmentQuery,
  useGetMaintenanceSummaryQuery,
  useRecordMaintenanceMutation,
  useUpdateMaintenanceMutation,
  useDeleteMaintenanceMutation,
} = equipmentMaintenanceApi;
