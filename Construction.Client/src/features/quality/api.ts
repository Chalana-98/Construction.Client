import { api } from '@/store/api';
import type {
  QualityInspectionDto,
  QualityIssueDto,
  QualityInspectionResult,
} from '@/types';

export const qualityApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getQualityInspections: builder.query<QualityInspectionDto[], string>({
      query: (projectId) => `/quality/project/${projectId}/inspections`,
      providesTags: ['Quality'],
    }),

    getQualityIssues: builder.query<QualityIssueDto[], string>({
      query: (projectId) => `/quality/project/${projectId}/issues`,
      providesTags: ['Quality'],
    }),

    createQualityInspection: builder.mutation<
      QualityInspectionDto,
      {
        projectId: string;
        wbsId?: string;
        discipline: string;
        title: string;
        result: QualityInspectionResult;
        comments?: string;
        items: { requirement: string; result: QualityInspectionResult; notes?: string }[];
      }
    >({
      query: (body) => ({ url: '/quality/inspections', method: 'POST', body }),
      invalidatesTags: ['Quality', 'Dashboard'],
    }),

    createQualityIssue: builder.mutation<
      QualityIssueDto,
      {
        qualityInspectionId: string;
        projectId: string;
        wbsId?: string;
        description: string;
        rootCause: string;
        correctiveAction: string;
        targetResolutionDate?: string;
      }
    >({
      query: (body) => ({ url: '/quality/issues', method: 'POST', body }),
      invalidatesTags: ['Quality', 'Dashboard'],
    }),

    closeQualityIssue: builder.mutation<{ message: string }, { id: string; notes: string }>({
      query: ({ id, notes }) => ({
        url: `/quality/issues/${id}/close`,
        method: 'POST',
        body: JSON.stringify(notes),
      }),
      invalidatesTags: ['Quality', 'Dashboard'],
    }),

    deleteQualityInspection: builder.mutation<void, string>({
      query: (id) => ({ url: `/quality/inspections/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Quality'],
    }),
  }),
});

export const {
  useGetQualityInspectionsQuery,
  useGetQualityIssuesQuery,
  useCreateQualityInspectionMutation,
  useCreateQualityIssueMutation,
  useCloseQualityIssueMutation,
  useDeleteQualityInspectionMutation,
} = qualityApi;
