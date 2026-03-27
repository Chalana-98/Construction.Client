import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetIssuesQuery, useCreateIssueMutation,
  useDeleteIssueMutation,
} from '@/features/issues/api';
import {
  IssueStatus, IssueStatusLabels, IssueType, IssueTypeLabels,
  IssuePriority, IssuePriorityLabels,
} from '@/types';
import type { IssueListDto } from '@/types';
import { StatusChip, PriorityChip } from '@/components/StatusChip';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useSnackbar } from 'notistack';

const emptyForm = { projectId: '', title: '', description: '', type: IssueType.General, priority: IssuePriority.Medium, location: '', notes: '' };

export default function IssuesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<IssueType | ''>('');
  const { data, isLoading, error, refetch } = useGetIssuesQuery({
    page, pageSize: 15,
    status: statusFilter === '' ? undefined : statusFilter,
    type: typeFilter === '' ? undefined : typeFilter,
  });
  const [createIssue, { isLoading: creating }] = useCreateIssueMutation();
  const [deleteIssue, { isLoading: deleting }] = useDeleteIssueMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<IssueListDto | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleCreate = async () => {
    try {
      await createIssue(form).unwrap();
      enqueueSnackbar('Issue created', { variant: 'success' });
      setFormOpen(false);
      setForm(emptyForm);
    } catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try { await deleteIssue(selected.id).unwrap(); enqueueSnackbar('Deleted', { variant: 'success' }); setDeleteOpen(false); }
    catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [f]: e.target.value }));

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  return (
    <Box>
      <PageHeader title="Issues & RFIs" actionLabel="Report Issue" onAction={() => { setForm(emptyForm); setFormOpen(true); }} />
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField size="small" select label="Status" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as IssueStatus | ''); setPage(1); }}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.entries(IssueStatusLabels).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
        </TextField>
        <TextField size="small" select label="Type" value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as IssueType | ''); setPage(1); }}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.entries(IssueTypeLabels).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
        </TextField>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Issue #</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((issue) => (
                <TableRow key={issue.id} hover>
                  <TableCell><Chip label={issue.issueNumber} size="small" variant="outlined" /></TableCell>
                  <TableCell><Typography fontWeight={500}>{issue.title}</Typography></TableCell>
                  <TableCell><Chip label={issue.typeName} size="small" /></TableCell>
                  <TableCell><StatusChip type="issueStatus" value={issue.status} /></TableCell>
                  <TableCell><PriorityChip value={issue.priority} /></TableCell>
                  <TableCell>{issue.assignedToName ?? 'Unassigned'}</TableCell>
                  <TableCell>{issue.dueDate ? new Date(issue.dueDate).toLocaleDateString() : '—'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setSelected(issue); setDeleteOpen(true); }}>
                      <DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.items || data.items.length === 0) && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No issues found</Typography>
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

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report Issue</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Project ID" value={form.projectId} onChange={upd('projectId')} required helperText="Enter the project ID" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Title" value={form.title} onChange={upd('title')} required /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Description" value={form.description} onChange={upd('description')} multiline rows={3} required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Type" value={form.type} onChange={upd('type')}>
                {Object.entries(IssueTypeLabels).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Priority" value={form.priority} onChange={upd('priority')}>
                {Object.entries(IssuePriorityLabels).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Location" value={form.location} onChange={upd('location')} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Notes" value={form.notes} onChange={upd('notes')} multiline rows={2} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating}>Create</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Issue" message={`Delete "${selected?.title}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
