import { useState } from 'react';
import {
  Box, Card, CardContent, Grid, Typography, Pagination, Chip,
  LinearProgress, IconButton, Tooltip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaidIcon from '@mui/icons-material/Paid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import { useGetProjectsQuery } from '@/features/projects/api';
import { useSnackbar } from 'notistack';

const emptyForm = { name: '', description: '', dueDate: '', paymentAmount: 0, notes: '', projectId: '' };

const milestoneValidationSchema = Yup.object({
  projectId: Yup.string()
    .required('Project selection is required.'),
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters long.')
    .required('Milestone name is required.'),
  dueDate: Yup.string()
    .required('Due date is required.'),
  paymentAmount: Yup.number()
    .typeError('Payment amount must be a number.')
    .min(0, 'Payment amount cannot be negative.')
    .optional(),
});

export default function MilestonesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetMilestonesQuery({ page, pageSize: 12 });
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 100 });
  const [createMilestone, { isLoading: creating }] = useCreateMilestoneMutation();
  const [updateMilestone, { isLoading: updating }] = useUpdateMilestoneMutation();
  const [deleteMilestone, { isLoading: deleting }] = useDeleteMilestoneMutation();
  const [completeMilestone] = useCompleteMilestoneMutation();
  const [markPayment] = useMarkPaymentReceivedMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<MilestoneDto | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: selected
      ? {
          name: selected.name,
          description: selected.description ?? '',
          dueDate: selected.dueDate ? selected.dueDate.split('T')[0] : '',
          paymentAmount: selected.paymentAmount ?? 0,
          notes: selected.notes ?? '',
          projectId: selected.projectId,
        }
      : emptyForm,
    validationSchema: milestoneValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        if (selected) {
          await updateMilestone({
            id: selected.id,
            data: {
              name: values.name.trim(),
              description: values.description.trim() || undefined,
              dueDate: new Date(values.dueDate).toISOString(),
              paymentAmount: values.paymentAmount ? Number(values.paymentAmount) : undefined,
              notes: values.notes.trim() || undefined,
            },
          }).unwrap();
          enqueueSnackbar('Milestone updated successfully', { variant: 'success' });
        } else {
          await createMilestone({
            projectId: values.projectId,
            name: values.name.trim(),
            description: values.description.trim() || undefined,
            dueDate: new Date(values.dueDate).toISOString(),
            paymentAmount: values.paymentAmount ? Number(values.paymentAmount) : undefined,
            notes: values.notes.trim() || undefined,
          }).unwrap();
          enqueueSnackbar('Milestone created successfully', { variant: 'success' });
        }
        handleCloseForm();
      } catch (err: unknown) {
        const apiErr = err as { data?: { message?: string; errors?: Record<string, string[]> } };
        if (apiErr?.data?.errors) {
          const sErrors: Record<string, string> = {};
          Object.entries(apiErr.data.errors).forEach(([k, msgs]) => {
            sErrors[k.charAt(0).toLowerCase() + k.slice(1)] = msgs.join(', ');
          });
          setErrors(sErrors);
        }
        enqueueSnackbar(apiErr?.data?.message || 'Failed to save milestone', { variant: 'error' });
      }
    },
  });

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelected(null);
    formik.resetForm({ values: emptyForm });
  };

  const handleOpenCreate = () => {
    setSelected(null);
    formik.resetForm({ values: emptyForm });
    setFormOpen(true);
  };

  const handleOpenEdit = (m: MilestoneDto) => {
    setSelected(m);
    formik.resetForm({
      values: {
        name: m.name,
        description: m.description ?? '',
        dueDate: m.dueDate ? m.dueDate.split('T')[0] : '',
        paymentAmount: m.paymentAmount ?? 0,
        notes: m.notes ?? '',
        projectId: m.projectId,
      },
    });
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteMilestone(selected.id).unwrap();
      enqueueSnackbar('Milestone deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    } catch {
      enqueueSnackbar('Failed to delete milestone', { variant: 'error' });
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await completeMilestone(id).unwrap();
      enqueueSnackbar('Milestone marked complete', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to complete milestone', { variant: 'error' });
    }
  };

  const handleMarkPayment = async (id: string) => {
    try {
      await markPayment(id).unwrap();
      enqueueSnackbar('Payment recorded', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to record payment', { variant: 'error' });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Project Milestones & Billing Checkpoints"
        subtitle="Track delivery gates, construction phases, payment releases, and task dependencies"
        actionLabel={hasItems ? "Add Milestone" : undefined}
        onAction={hasItems ? handleOpenCreate : undefined}
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
                          <IconButton size="small" color="success" onClick={() => handleComplete(m.id)}>
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {m.paymentAmount != null && m.paymentAmount > 0 && !m.paymentReceived && (
                        <Tooltip title="Payment Received">
                          <IconButton size="small" color="primary" onClick={() => handleMarkPayment(m.id)}>
                            <PaidIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenEdit(m)}><EditIcon fontSize="small" /></IconButton></Tooltip>
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
            onAction={handleOpenCreate}
          />
        </Card>
      )}

      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {selected ? 'Edit Milestone Checkpoint' : 'Add Milestone Checkpoint'}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {!selected && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  select
                  fullWidth
                  id="projectId"
                  name="projectId"
                  label="Project"
                  required
                  value={formik.values.projectId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.projectId && Boolean(formik.errors.projectId)}
                  helperText={formik.touched.projectId && formik.errors.projectId}
                >
                  <MenuItem value="" disabled>Select project...</MenuItem>
                  {projectsData?.items?.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.name} ({p.projectCode})</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Milestone Name"
                required
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                multiline
                rows={2}
                placeholder="Scope of work and deliverables required to complete milestone..."
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="dueDate"
                name="dueDate"
                label="Target Due Date"
                required
                value={formik.values.dueDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                error={formik.touched.dueDate && Boolean(formik.errors.dueDate)}
                helperText={formik.touched.dueDate && formik.errors.dueDate}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="paymentAmount"
                name="paymentAmount"
                label="Milestone Billing Amount ($)"
                value={formik.values.paymentAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="number"
                error={formik.touched.paymentAmount && Boolean(formik.errors.paymentAmount)}
                helperText={formik.touched.paymentAmount && formik.errors.paymentAmount}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Internal Notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                multiline
                rows={2}
                placeholder="Contractor agreements or compliance notes..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3, backgroundColor: '#fafafa' }}>
          <Button onClick={handleCloseForm} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            disabled={creating || updating || formik.isSubmitting}
            sx={{ px: 3, fontWeight: 600 }}
          >
            {selected ? 'Update Milestone' : 'Create Milestone'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Milestone" message={`Delete "${selected?.name}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
