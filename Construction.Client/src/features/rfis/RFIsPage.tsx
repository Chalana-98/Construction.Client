import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Pagination, Chip, IconButton, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  useGetRFIsQuery, useCreateRFIMutation, useDeleteRFIMutation,
} from '@/features/rfis/api';
import { useGetProjectsQuery } from '@/features/projects/api';
import type { RFIDto } from '@/types';
import { RFIStatus, RFIStatusLabels } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import { useSnackbar } from 'notistack';

const emptyForm = { projectId: '', title: '', question: '', assignedToId: '' };

const rfiValidationSchema = Yup.object({
  projectId: Yup.string()
    .required('Project selection is required.'),
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters.')
    .required('RFI title is required.'),
  question: Yup.string()
    .required('Question details are required.'),
  assignedToId: Yup.string().optional(),
});

export default function RFIsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<RFIStatus | ''>('');
  const { data, isLoading, error, refetch } = useGetRFIsQuery({
    page, pageSize: 15,
    status: statusFilter === '' ? undefined : statusFilter,
  });
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 100 });
  const [createRFI, { isLoading: creating }] = useCreateRFIMutation();
  const [deleteRFI, { isLoading: deleting }] = useDeleteRFIMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<RFIDto | null>(null);

  const formik = useFormik({
    initialValues: emptyForm,
    validationSchema: rfiValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await createRFI({
          projectId: values.projectId,
          title: values.title.trim(),
          question: values.question.trim(),
          assignedToId: values.assignedToId.trim() || undefined,
        }).unwrap();
        enqueueSnackbar('RFI created successfully', { variant: 'success' });
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
        enqueueSnackbar(apiErr?.data?.message || 'Failed to create RFI', { variant: 'error' });
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
      await deleteRFI(selected.id).unwrap();
      enqueueSnackbar('RFI deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    } catch {
      enqueueSnackbar('Failed to delete RFI', { variant: 'error' });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = (data?.items?.length ?? 0) > 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Requests for Information"
        subtitle="Submit clarifications and query approvals from architects and engineering consultants"
        actionLabel={hasItems ? 'Create RFI' : undefined}
        onAction={hasItems ? handleOpenCreate : undefined}
      />

      {hasItems && (
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as RFIStatus | ''); setPage(1); }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.entries(RFIStatusLabels).map(([v, l]) => (
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
                  <TableCell>Project ID</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items?.map((rfi) => (
                  <TableRow key={rfi.id}>
                    <TableCell><Chip label={rfi.number} size="small" variant="outlined" /></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{rfi.title}</TableCell>
                    <TableCell>
                      <Chip label={RFIStatusLabels[rfi.status] ?? rfi.status} size="small" />
                    </TableCell>
                    <TableCell>{rfi.projectId}</TableCell>
                    <TableCell>{new Date(rfi.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => { setSelected(rfi); setDeleteOpen(true); }}><DeleteIcon fontSize="small" /></IconButton>
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
        <DialogTitle sx={{ fontWeight: 700 }}>Create RFI</DialogTitle>
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
                id="question"
                name="question"
                label="Question"
                value={formik.values.question}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                multiline
                rows={4}
                required
                error={formik.touched.question && Boolean(formik.errors.question)}
                helperText={formik.touched.question && formik.errors.question}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="assignedToId"
                name="assignedToId"
                label="Assigned To (User ID)"
                value={formik.values.assignedToId}
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

      <ConfirmDialog open={deleteOpen} title="Delete RFI" message={`Delete "${selected?.title}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
