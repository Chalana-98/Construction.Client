import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Pagination, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  useGetIssuesQuery, useCreateIssueMutation,
  useDeleteIssueMutation,
} from '@/features/issues/api';
import { useGetProjectsQuery } from '@/features/projects/api';
import {
  IssueType, IssuePriority, IssueStatus,
  IssueTypeLabels, IssuePriorityLabels, IssueStatusLabels,
} from '@/types';
import type { IssueListDto } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useSnackbar } from 'notistack';

const emptyForm = { projectId: '', title: '', description: '', type: IssueType.Safety, priority: IssuePriority.Medium, location: '', notes: '' };

const issueValidationSchema = Yup.object({
  projectId: Yup.string()
    .required('Project selection is required.'),
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters.')
    .required('Issue title is required.'),
  description: Yup.string()
    .required('Issue description is required.'),
  type: Yup.mixed<IssueType>()
    .required('Issue type is required.'),
  priority: Yup.mixed<IssuePriority>()
    .required('Issue priority is required.'),
  location: Yup.string().optional(),
  notes: Yup.string().optional(),
});

export default function IssuesPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<IssueType | ''>('');
  const { data, isLoading, error, refetch } = useGetIssuesQuery({
    page, pageSize: 15,
    status: statusFilter === '' ? undefined : statusFilter,
    type: typeFilter === '' ? undefined : typeFilter,
  });
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 100 });
  const [createIssue, { isLoading: creating }] = useCreateIssueMutation();
  const [deleteIssue, { isLoading: deleting }] = useDeleteIssueMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<IssueListDto | null>(null);

  const formik = useFormik({
    initialValues: emptyForm,
    validationSchema: issueValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await createIssue({
          projectId: values.projectId,
          title: values.title.trim(),
          description: values.description.trim(),
          type: values.type as IssueType,
          priority: values.priority as IssuePriority,
          location: values.location.trim() || undefined,
          notes: values.notes.trim() || undefined,
        }).unwrap();
        enqueueSnackbar('Issue reported successfully', { variant: 'success' });
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
        enqueueSnackbar(apiErr?.data?.message || 'Failed to report issue', { variant: 'error' });
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
      await deleteIssue(selected.id).unwrap();
      enqueueSnackbar('Issue deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    } catch {
      enqueueSnackbar('Failed to delete issue', { variant: 'error' });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Issues & Snag List"
        subtitle="Report safety incidents, structural defects, non-conformance items, and field observations"
        actionLabel={hasItems ? 'Report Issue' : undefined}
        onAction={hasItems ? handleOpenCreate : undefined}
      />

      {hasItems && (
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as IssueStatus | ''); setPage(1); }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.entries(IssueStatusLabels).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
          </TextField>
          <TextField
            select
            size="small"
            label="Type"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as IssueType | ''); setPage(1); }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Types</MenuItem>
            {Object.entries(IssueTypeLabels).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
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
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell><Chip label={i.issueNumber} size="small" variant="outlined" /></TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{i.title}</TableCell>
                    <TableCell><Chip label={IssueTypeLabels[i.type] ?? i.type} size="small" /></TableCell>
                    <TableCell>
                      <Chip label={IssuePriorityLabels[i.priority] ?? i.priority} size="small"
                        color={i.priority === IssuePriority.Critical || i.priority === IssuePriority.High ? 'error' : 'default'} />
                    </TableCell>
                    <TableCell><Chip label={IssueStatusLabels[i.status] ?? i.status} size="small" /></TableCell>
                    <TableCell>{i.assignedToName ?? '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => { setSelected(i); setDeleteOpen(true); }}><DeleteIcon fontSize="small" /></IconButton>
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
            icon={<ReportProblemIcon />}
            title="No issues or defects reported!"
            description="Log safety inspections, structural inquiries, and punchlist items."
            actionLabel="Report Issue"
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
        <DialogTitle sx={{ fontWeight: 700 }}>Report Issue</DialogTitle>
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
                select
                id="type"
                name="type"
                label="Type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              >
                {Object.entries(IssueTypeLabels).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                id="priority"
                name="priority"
                label="Priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.priority && Boolean(formik.errors.priority)}
                helperText={formik.touched.priority && formik.errors.priority}
              >
                {Object.entries(IssuePriorityLabels).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="location"
                name="location"
                label="Location"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                multiline
                rows={2}
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

      <ConfirmDialog open={deleteOpen} title="Delete Issue" message={`Delete "${selected?.title}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
