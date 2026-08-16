import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetRFIsQuery, useCreateRFIMutation,
  useDeleteRFIMutation,
} from '@/features/rfis/api';
import {
  RFIStatus, RFIStatusLabels
} from '@/types';
import type { RFIDto } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useSnackbar } from 'notistack';

const emptyForm = { projectId: '', title: '', question: '', assignedToId: '' };

export default function RFIsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<RFIStatus | ''>('');
  const { data, isLoading, error, refetch } = useGetRFIsQuery({
    page, pageSize: 15,
    status: statusFilter === '' ? undefined : statusFilter,
  });
  const [createRFI, { isLoading: creating }] = useCreateRFIMutation();
  const [deleteRFI, { isLoading: deleting }] = useDeleteRFIMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<RFIDto | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleCreate = async () => {
    try {
      await createRFI(form).unwrap();
      enqueueSnackbar('RFI created', { variant: 'success' });
      setFormOpen(false);
      setForm(emptyForm);
    } catch { enqueueSnackbar('Failed to create RFI', { variant: 'error' }); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try { await deleteRFI(selected.id).unwrap(); enqueueSnackbar('Deleted', { variant: 'success' }); setDeleteOpen(false); }
    catch { enqueueSnackbar('Failed to delete', { variant: 'error' }); }
  };

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [f]: e.target.value }));

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="RFIs"
        actionLabel={hasItems ? "Create RFI" : undefined}
        onAction={hasItems ? () => { setForm(emptyForm); setFormOpen(true); } : undefined}
      />
      {(hasItems || statusFilter) && (
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField size="small" select label="Status" value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as RFIStatus | ''); setPage(1); }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {Object.entries(RFIStatusLabels).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
          </TextField>
        </Box>
      )}

      {hasItems && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>RFI #</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((rfi) => (
                  <TableRow key={rfi.id} hover>
                    <TableCell><Chip label={rfi.number} size="small" variant="outlined" /></TableCell>
                    <TableCell><Typography fontWeight={500}>{rfi.title}</Typography></TableCell>
                    <TableCell>{rfi.projectName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={rfi.statusName} 
                        size="small" 
                        color={rfi.status === RFIStatus.Open ? 'error' : rfi.status === RFIStatus.Answered ? 'success' : 'default'} 
                      />
                    </TableCell>
                    <TableCell>{rfi.assignedToName ?? 'Unassigned'}</TableCell>
                    <TableCell>{rfi.createdByName}</TableCell>
                    <TableCell>{new Date(rfi.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setSelected(rfi); setDeleteOpen(true); }}>
                        <DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {!hasItems && (
        <Card sx={{ flexGrow: 1, minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState
            icon={<HelpOutlineIcon />}
            title="No RFIs created yet!"
            description="Submit Requests for Information to clarify design specs and architectural drawings."
            actionLabel="Create RFI"
            onAction={() => { setForm(emptyForm); setFormOpen(true); }}
          />
        </Card>
      )}
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create RFI</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Project ID" value={form.projectId} onChange={upd('projectId')} required helperText="Enter the Project ID" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Title" value={form.title} onChange={upd('title')} required /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Question" value={form.question} onChange={upd('question')} multiline rows={4} required /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Assigned To (User ID)" value={form.assignedToId} onChange={upd('assignedToId')} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating}>Create</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete RFI" message={`Delete "${selected?.title}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
