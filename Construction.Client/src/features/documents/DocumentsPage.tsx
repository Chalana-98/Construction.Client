import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip,
} from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetDocumentsQuery, useDeleteDocumentMutation,
  useArchiveDocumentMutation, useRestoreDocumentMutation,
} from '@/features/documents/api';
import { DocumentType, DocumentTypeLabels } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useSnackbar } from 'notistack';

export default function DocumentsPage() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<DocumentType | ''>('');
  const { data, isLoading, error, refetch } = useGetDocumentsQuery({
    page, pageSize: 15,
    type: typeFilter === '' ? undefined : typeFilter,
  });
  const [deleteDoc, { isLoading: deleting }] = useDeleteDocumentMutation();
  const [archiveDoc] = useArchiveDocumentMutation();
  const [restoreDoc] = useRestoreDocumentMutation();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleArchive = async (id: string) => {
    try { await archiveDoc(id).unwrap(); enqueueSnackbar('Archived', { variant: 'success' }); }
    catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };
  const handleRestore = async (id: string) => {
    try { await restoreDoc(id).unwrap(); enqueueSnackbar('Restored', { variant: 'success' }); }
    catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };
  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteDoc(deleteId).unwrap(); enqueueSnackbar('Deleted', { variant: 'success' }); setDeleteId(null); }
    catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  return (
    <Box>
      <PageHeader title="Documents" />
      <Box display="flex" gap={2} mb={3}>
        <TextField size="small" select label="Type" value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as DocumentType | ''); setPage(1); }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.entries(DocumentTypeLabels).map(([v, l]) => (
            <MenuItem key={v} value={v}>{l}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>File</TableCell>
                <TableCell>Uploaded By</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell><Typography fontWeight={500}>{doc.name}</Typography></TableCell>
                  <TableCell><Chip label={doc.typeName} size="small" variant="outlined" /></TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{doc.fileName}</Typography></TableCell>
                  <TableCell>{doc.uploadedByName}</TableCell>
                  <TableCell>v{doc.version}</TableCell>
                  <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={doc.isArchived ? 'Archived' : 'Active'} size="small"
                      color={doc.isArchived ? 'default' : 'success'} variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    {doc.isArchived ? (
                      <Tooltip title="Restore"><IconButton size="small" color="primary" onClick={() => handleRestore(doc.id)}>
                        <UnarchiveIcon fontSize="small" /></IconButton></Tooltip>
                    ) : (
                      <Tooltip title="Archive"><IconButton size="small" onClick={() => handleArchive(doc.id)}>
                        <ArchiveIcon fontSize="small" /></IconButton></Tooltip>
                    )}
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => setDeleteId(doc.id)}>
                      <DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.items || data.items.length === 0) && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No documents found</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete Document" message="Delete this document permanently?"
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </Box>
  );
}
