import { useState } from 'react';
import {
  Box, Card, CardContent, Grid, Typography, Pagination, Chip,
  LinearProgress, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaidIcon from '@mui/icons-material/Paid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetMilestonesQuery, useCreateMilestoneMutation,
  useUpdateMilestoneMutation, useDeleteMilestoneMutation,
  useCompleteMilestoneMutation, useMarkPaymentReceivedMutation,
} from '@/features/milestones/api';
import type { MilestoneDto } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import FlagIcon from '@mui/icons-material/Flag';
import { useSnackbar } from 'notistack';

const emptyForm = { name: '', description: '', dueDate: '', paymentAmount: 0, notes: '', projectId: '' };

export default function MilestonesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetMilestonesQuery({ page, pageSize: 12 });
  const [createMilestone, { isLoading: creating }] = useCreateMilestoneMutation();
  const [updateMilestone, { isLoading: updating }] = useUpdateMilestoneMutation();
  const [deleteMilestone, { isLoading: deleting }] = useDeleteMilestoneMutation();
  const [completeMilestone] = useCompleteMilestoneMutation();
  const [markPayment] = useMarkPaymentReceivedMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<MilestoneDto | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => { setSelected(null); setForm(emptyForm); setFormOpen(true); };
  const openEdit = (m: MilestoneDto) => {
    setSelected(m);
    setForm({ name: m.name, description: m.description ?? '', dueDate: m.dueDate.split('T')[0], paymentAmount: m.paymentAmount ?? 0, notes: m.notes ?? '', projectId: m.projectId });
    setFormOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selected) {
        await updateMilestone({ id: selected.id, data: { name: form.name, description: form.description, dueDate: form.dueDate, paymentAmount: form.paymentAmount, notes: form.notes } }).unwrap();
      } else {
        await createMilestone({ ...form, paymentAmount: form.paymentAmount || undefined }).unwrap();
      }
      enqueueSnackbar(selected ? 'Updated' : 'Created', { variant: 'success' });
      setFormOpen(false);
    } catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try { await deleteMilestone(selected.id).unwrap(); enqueueSnackbar('Deleted', { variant: 'success' }); setDeleteOpen(false); }
    catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [f]: e.target.value }));

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Milestones"
        actionLabel={hasItems ? "Add Milestone" : undefined}
        onAction={hasItems ? openCreate : undefined}
      />

      {hasItems && (
        <Grid container spacing={3}>
          {data?.items.map((m) => {
            const progress = m.taskCount > 0 ? Math.round((m.completedTaskCount / m.taskCount) * 100) : 0;
            return (
              <Grid key={m.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" fontWeight={600}>{m.name}</Typography>
                      <Chip label={m.isCompleted ? 'Completed' : 'Pending'} size="small"
                        color={m.isCompleted ? 'success' : 'warning'} variant="outlined" />
                    </Box>
                    {m.description && (
                      <Typography variant="body2" color="text.secondary" mb={1}>{m.description}</Typography>
                    )}
                    <Typography variant="body2" mb={0.5}>
                      Due: {new Date(m.dueDate).toLocaleDateString()}
                    </Typography>
                    {m.paymentAmount != null && m.paymentAmount > 0 && (
                      <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          ${m.paymentAmount.toLocaleString()}
                        </Typography>
                        {m.paymentReceived && <Chip label="Received" size="small" color="success" />}
                      </Box>
                    )}
                    <Box mb={1}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption">Tasks: {m.completedTaskCount}/{m.taskCount}</Typography>
                        <Typography variant="caption">{progress}%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
                    </Box>
                    <Box display="flex" justifyContent="flex-end" gap={0.5} mt={1}>
                      {!m.isCompleted && (
                        <Tooltip title="Mark Complete">
                          <IconButton size="small" color="success" onClick={async () => {
                            try { await completeMilestone(m.id).unwrap(); enqueueSnackbar('Completed', { variant: 'success' }); }
                            catch { enqueueSnackbar('Failed', { variant: 'error' }); }
                          }}><CheckCircleIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      )}
                      {m.paymentAmount != null && m.paymentAmount > 0 && !m.paymentReceived && (
                        <Tooltip title="Payment Received">
                          <IconButton size="small" color="primary" onClick={async () => {
                            try { await markPayment(m.id).unwrap(); enqueueSnackbar('Payment marked', { variant: 'success' }); }
                            catch { enqueueSnackbar('Failed', { variant: 'error' }); }
                          }}><PaidIcon fontSize="small" /></IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(m)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setSelected(m); setDeleteOpen(true); }}>
                        <DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {!hasItems && (
        <Card sx={{ flexGrow: 1, minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState
            icon={<FlagIcon />}
            title="No milestones yet!"
            description="Create milestone checkpoints to track project phases and payment collections."
            actionLabel="Add Milestone"
            onAction={openCreate}
          />
        </Card>
      )}

      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Milestone' : 'Add Milestone'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            {!selected && (
              <Grid size={{ xs: 12 }}><TextField fullWidth label="Project ID" value={form.projectId} onChange={upd('projectId')} required helperText="Enter the project ID" /></Grid>
            )}
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Name" value={form.name} onChange={upd('name')} required /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Description" value={form.description} onChange={upd('description')} multiline rows={2} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Due Date" value={form.dueDate} onChange={upd('dueDate')} type="date" slotProps={{ inputLabel: { shrink: true } }} required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Payment Amount" value={form.paymentAmount} onChange={upd('paymentAmount')} type="number" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Notes" value={form.notes} onChange={upd('notes')} multiline rows={2} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={creating || updating}>{selected ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Milestone" message={`Delete "${selected?.name}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
