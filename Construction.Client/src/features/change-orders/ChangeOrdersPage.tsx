import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Pagination, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  useGetChangeOrdersQuery, useCreateChangeOrderMutation,
  useDeleteChangeOrderMutation, useApproveChangeOrderMutation, useRejectChangeOrderMutation
} from '@/features/change-orders/api';
import { useGetProjectsQuery } from '@/features/projects/api';
import {
  ChangeOrderStatus, ChangeOrderStatusLabels
} from '@/types';
import type { ChangeOrderDto } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { useSnackbar } from 'notistack';

const emptyForm = { projectId: '', title: '', description: '', requestedAmount: 0, scheduleImpactDays: 0 };

const changeOrderValidationSchema = Yup.object({
  projectId: Yup.string()
    .required('Project selection is required.'),
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters.')
    .required('Change order title is required.'),
  description: Yup.string()
    .required('Description of scope adjustment is required.'),
  requestedAmount: Yup.number()
    .typeError('Requested amount must be a number.')
    .required('Requested amount is required.'),
  scheduleImpactDays: Yup.number()
    .typeError('Schedule impact must be a number.')
    .optional(),
});

export default function ChangeOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ChangeOrderStatus | ''>('');
  const { data, isLoading, error, refetch } = useGetChangeOrdersQuery({
    page, pageSize: 15,
    status: statusFilter === '' ? undefined : statusFilter,
  });
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 100 });
  const [createChangeOrder, { isLoading: creating }] = useCreateChangeOrderMutation();
  const [deleteChangeOrder, { isLoading: deleting }] = useDeleteChangeOrderMutation();
  const [approveChangeOrder] = useApproveChangeOrderMutation();
  const [rejectChangeOrder] = useRejectChangeOrderMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ChangeOrderDto | null>(null);

  const formik = useFormik({
    initialValues: emptyForm,
    validationSchema: changeOrderValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await createChangeOrder({
          projectId: values.projectId,
          title: values.title.trim(),
          description: values.description.trim(),
          requestedAmount: Number(values.requestedAmount),
          scheduleImpactDays: Number(values.scheduleImpactDays) || 0,
        }).unwrap();
        enqueueSnackbar('Change Order created successfully', { variant: 'success' });
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
        enqueueSnackbar(apiErr?.data?.message || 'Failed to create change order', { variant: 'error' });
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

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteChangeOrder(selected.id).unwrap();
      enqueueSnackbar('Change order deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    } catch {
      enqueueSnackbar('Failed to delete change order', { variant: 'error' });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveChangeOrder(id).unwrap();
      enqueueSnackbar('Change order approved', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to approve', { variant: 'error' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectChangeOrder(id).unwrap();
      enqueueSnackbar('Change order rejected', { variant: 'info' });
    } catch {
      enqueueSnackbar('Failed to reject', { variant: 'error' });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = (data?.items?.length ?? 0) > 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Change Orders"
        subtitle="Manage variations, contract scope additions, and budget amendments"
        actionLabel={hasItems ? 'New Change Order' : undefined}
        onAction={hasItems ? handleOpenCreate : undefined}
      />

      {hasItems && (
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ChangeOrderStatus | '')}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.entries(ChangeOrderStatusLabels).map(([v, l]) => (
              <MenuItem key={v} value={v}>{l}</MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      {hasItems && (
        <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Number</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Requested Amount</TableCell>
                  <TableCell align="right">Schedule Impact</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items?.map((co) => (
                  <TableRow key={co.id}>
                    <TableCell><Chip label={co.number} size="small" variant="outlined" /></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{co.title}</TableCell>
                    <TableCell><Chip label={ChangeOrderStatusLabels[co.status] ?? co.status} size="small" /></TableCell>
                    <TableCell align="right">${co.requestedAmount.toLocaleString()}</TableCell>
                    <TableCell align="right">{co.scheduleImpactDays > 0 ? `+${co.scheduleImpactDays}d` : 'None'}</TableCell>
                    <TableCell>{new Date(co.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      {co.status === ChangeOrderStatus.Pending && (
                        <>
                          <Tooltip title="Approve"><IconButton size="small" color="success" onClick={() => handleApprove(co.id)}><CheckCircleIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Reject"><IconButton size="small" color="error" onClick={() => handleReject(co.id)}><CancelIcon fontSize="small" /></IconButton></Tooltip>
                        </>
                      )}
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setSelected(co); setDeleteOpen(true); }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
            icon={<PriceChangeIcon />}
            title="No change orders yet!"
            description="Create contract scope revisions, cost adjustments, and schedule impact records."
            actionLabel="New Change Order"
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
        <DialogTitle sx={{ fontWeight: 700 }}>Create Change Order</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                id="projectId"
                name="projectId"
                label="Project"
                value={formik.values.projectId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.projectId && Boolean(formik.errors.projectId)}
                helperText={formik.touched.projectId && formik.errors.projectId}
                required
              >
                <MenuItem value="" disabled>Select project...</MenuItem>
                {projectsData?.items?.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.name} ({p.projectCode})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
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
                rows={3}
                required
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="requestedAmount"
                name="requestedAmount"
                type="number"
                label="Requested Amount ($)"
                value={formik.values.requestedAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.requestedAmount && Boolean(formik.errors.requestedAmount)}
                helperText={formik.touched.requestedAmount && formik.errors.requestedAmount}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="scheduleImpactDays"
                name="scheduleImpactDays"
                type="number"
                label="Schedule Impact (Days)"
                value={formik.values.scheduleImpactDays}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            disabled={creating || formik.isSubmitting}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Change Order" message={`Delete "${selected?.title}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
