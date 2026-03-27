import { api } from '@/store/api';
import type {
  DocumentDto,
  DocumentListDto,
  CreateDocumentDto,
  UpdateDocumentDto,
  PagedResult,
  DocumentType,
} from '@/types';

export const documentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query<
      PagedResult<DocumentListDto>,
      { projectId?: string; page?: number; pageSize?: number; type?: DocumentType }
    >({
      query: ({ projectId, page = 1, pageSize = 10, type }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (projectId) params.set('projectId', projectId);
        if (type !== undefined) params.set('type', String(type));
        return `/documents?${params.toString()}`;
      },
      providesTags: ['Documents'],
    }),

    getDocument: builder.query<DocumentDto, string>({
      query: (id) => `/documents/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Documents', id }],
    }),

    createDocument: builder.mutation<DocumentDto, CreateDocumentDto>({
      query: (body) => ({ url: '/documents', method: 'POST', body }),
      invalidatesTags: ['Documents'],
    }),

    updateDocument: builder.mutation<DocumentDto, { id: string; data: UpdateDocumentDto }>({
      query: ({ id, data }) => ({ url: `/documents/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Documents', id }, 'Documents'],
    }),

    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({ url: `/documents/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Documents'],
    }),

    archiveDocument: builder.mutation<DocumentDto, string>({
      query: (id) => ({ url: `/documents/${id}/archive`, method: 'PUT' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Documents', id }, 'Documents'],
    }),

    restoreDocument: builder.mutation<DocumentDto, string>({
      query: (id) => ({ url: `/documents/${id}/restore`, method: 'PUT' }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Documents', id }, 'Documents'],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useArchiveDocumentMutation,
  useRestoreDocumentMutation,
} = documentsApi;
