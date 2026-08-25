import { api } from '@/store/api';
import type {
  SafetyIncidentDto,
  SafetyInspectionDto,
  ToolboxTalkDto,
  SafetyIncidentSeverity,
  QualityInspectionResult,
} from '@/types';

export const safetyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSafetyIncidents: builder.query<SafetyIncidentDto[], string>({
      query: (projectId) => `/safety/project/${projectId}/incidents`,
      providesTags: ['Safety'],
    }),

    getSafetyInspections: builder.query<SafetyInspectionDto[], string>({
      query: (projectId) => `/safety/project/${projectId}/inspections`,
      providesTags: ['Safety'],
    }),

    getToolboxTalks: builder.query<ToolboxTalkDto[], string>({
      query: (projectId) => `/safety/project/${projectId}/toolbox-talks`,
      providesTags: ['Safety'],
    }),

    createIncident: builder.mutation<
      SafetyIncidentDto,
      {
        projectId: string;
        incidentDateTime: string;
        location: string;
        personInvolved: string;
        incidentType: string;
        severity: SafetyIncidentSeverity;
        description: string;
        immediateAction: string;
        correctiveAction: string;
      }
    >({
      query: (body) => ({ url: '/safety/incidents', method: 'POST', body }),
      invalidatesTags: ['Safety', 'Dashboard'],
    }),

    createInspection: builder.mutation<
      SafetyInspectionDto,
      {
        projectId: string;
        inspectionDate: string;
        checklistTitle: string;
        overallResult: QualityInspectionResult;
        summaryFindings?: string;
        items: { requirement: string; result: QualityInspectionResult; findings?: string; correctiveAction?: string }[];
      }
    >({
      query: (body) => ({ url: '/safety/inspections', method: 'POST', body }),
      invalidatesTags: ['Safety', 'Dashboard'],
    }),

    createToolboxTalk: builder.mutation<
      ToolboxTalkDto,
      {
        projectId: string;
        topic: string;
        date: string;
        participantsJson?: string;
        attendanceCount: number;
        notes?: string;
      }
    >({
      query: (body) => ({ url: '/safety/toolbox-talks', method: 'POST', body }),
      invalidatesTags: ['Safety', 'Dashboard'],
    }),

    deleteIncident: builder.mutation<void, string>({
      query: (id) => ({ url: `/safety/incidents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Safety'],
    }),
  }),
});

export const {
  useGetSafetyIncidentsQuery,
  useGetSafetyInspectionsQuery,
  useGetToolboxTalksQuery,
  useCreateIncidentMutation,
  useCreateInspectionMutation,
  useCreateToolboxTalkMutation,
  useDeleteIncidentMutation,
} = safetyApi;
