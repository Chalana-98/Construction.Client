import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Pagination, Chip, IconButton, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  useGetTimesheetsQuery, useCreateTimesheetMutation,
  useDeleteTimesheetMutation, useApproveTimesheetMutation,
} from '@/features/timesheets/api';
import { useGetProjectsQuery } from '@/features/projects/api';
import type { TimesheetDto } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useSnackbar } from 'notistack';

const emptyForm = { projectId: '', workerId: '', startDate: '', endDate: '' };

const timesheetValidationSchema = Yup.object({
  projectId: Yup.string()
    .required('Project selection is required.'),
  workerId: Yup.string()
    .required('Worker ID is required.'),
  startDate: Yup.string()
    .required('Start date is required.'),
  endDate: Yup.string()
    .required('End date is required.')
    .test('is-after-start', 'End date cannot be earlier than start date.', function (value) {
      const { startDate } = this.parent;
      if (!startDate || !value) return true;
      return value >= startDate;
    }),
});

export default function TimesheetsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetTimesheetsQuery({ page, pageSize: 15 });
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 100 });
  const [createTimesheet, { isLoading: creating }] = useCreateTimesheetMutation();
  const [deleteTimesheet, { isLoading: deleting }] = useDeleteTimesheetMutation();
  const [approveTimesheet] = useApproveTimesheetMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<TimesheetDto | null>(null);

  const formik = useFormik({
    initialValues: emptyForm,
    validationSchema: timesheetValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await createTimesheet({
          projectId: values.projectId,
          workerId: values.workerId.trim(),
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
        }).unwrap();
        enqueueSnackbar('Timesheet created successfully', { variant: 'success' });
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
        enqueueSnackbar(apiErr?.data?.message || 'Failed to create timesheet', { variant: 'error' });
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
      await deleteTimesheet(selected.id).unwrap();
      enqueueSnackbar('Timesheet deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    } catch {
      enqueueSnackbar('Failed to delete timesheet', { variant: 'error' });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveTimesheet(id).unwrap();
      enqueueSnackbar('Timesheet approved', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to approve timesheet', { variant: 'error' });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Timesheets & Labor"
        subtitle="Review worker time entries, labor allocations, and payroll submissions"
        actionLabel={hasItems ? 'New Timesheet' : undefined}
        onAction={hasItems ? handleOpenCreate : undefined}
      />

      {hasItems && (
        <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Worker</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell align="right">Total Hours</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((ts) => (
                  <TableRow key={ts.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{ts.workerName}</TableCell>
                    <TableCell>{ts.projectName}</TableCell>
                    <TableCell>
                      {new Date(ts.startDate).toLocaleDateString()} – {new Date(ts.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{ts.totalHours} hrs</TableCell>
                    <TableCell>
                      <Chip
                        label={ts.isApproved ? 'Approved' : 'Pending'}
                        size="small"
                        color={ts.isApproved ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {!ts.isApproved && (
                        <IconButton size="small" color="success" onClick={() => handleApprove(ts.id)} title="Approve">
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton size="small" color="error" onClick={() => { setSelected(ts); setDeleteOpen(true); }} title="Delete">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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
            icon={<AccessTimeIcon />}
            title="No timesheets submitted yet!"
            description="Record labor shifts, worker hours, and wage allocations for payroll review."
            actionLabel="New Timesheet"
            onAction={handleOpenCreate}
          />
        </Card>
      )}
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, val) => setPage(val)} color="primary" />
        </Box>
      )}

      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>New Timesheet</DialogTitle>
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
                id="workerId"
                name="workerId"
                label="Worker ID"
                value={formik.values.workerId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.workerId && Boolean(formik.errors.workerId)}
                helperText={formik.touched.workerId && formik.errors.workerId}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="startDate"
                name="startDate"
                label="Start Date"
                type="date"
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                helperText={formik.touched.startDate && formik.errors.startDate}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="endDate"
                name="endDate"
                label="End Date"
                type="date"
                value={formik.values.endDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                helperText={formik.touched.endDate && formik.errors.endDate}
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

      <ConfirmDialog open={deleteOpen} title="Delete Timesheet" message={`Delete timesheet for ${selected?.workerName}?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
