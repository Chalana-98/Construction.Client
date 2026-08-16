import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  useGetProjectMembersQuery, useAddProjectMemberMutation,
  useRemoveProjectMemberMutation, useDeactivateProjectMemberMutation,
  useReactivateProjectMemberMutation,
} from '@/features/team/api';
import { useGetProjectsQuery } from '@/features/projects/api';
import type { ProjectMemberDto } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import GroupIcon from '@mui/icons-material/Group';
import { useSnackbar } from 'notistack';

const ROLES = ['Viewer', 'Worker', 'Manager', 'Admin'];

const roleColor: Record<string, 'default' | 'primary' | 'secondary' | 'warning' | 'error' | 'info' | 'success'> = {
  Admin: 'error',
  Manager: 'warning',
  Worker: 'primary',
  Viewer: 'default',
};

const emptyForm = { projectId: '', userId: '', role: 'Worker', dailyRate: '', notes: '' };

const teamValidationSchema = Yup.object({
  projectId: Yup.string()
    .required('Project selection is required.'),
  userId: Yup.string()
    .required('User ID is required.'),
  role: Yup.string()
    .required('Role is required.'),

  dailyRate: Yup.number()
    .typeError('Daily rate must be a number.')
    .min(0, 'Daily rate cannot be negative.')
    .optional(),
});

export default function TeamPage() {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const { data, isLoading, error, refetch } = useGetProjectMembersQuery({
    page, pageSize: 15,
    role: roleFilter || undefined,
  });
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 100 });
  const [addMember, { isLoading: adding }] = useAddProjectMemberMutation();
  const [removeMember, { isLoading: removing }] = useRemoveProjectMemberMutation();
  const [deactivate] = useDeactivateProjectMemberMutation();
  const [reactivate] = useReactivateProjectMemberMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ProjectMemberDto | null>(null);

  const formik = useFormik({
    initialValues: emptyForm,
    validationSchema: teamValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await addMember({
          projectId: values.projectId,
          userId: values.userId.trim(),
          role: values.role,
          dailyRate: values.dailyRate ? Number(values.dailyRate) : undefined,
          notes: values.notes.trim() || undefined,
        }).unwrap();
        enqueueSnackbar('Member added successfully', { variant: 'success' });
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
        enqueueSnackbar(apiErr?.data?.message || 'Failed to add member', { variant: 'error' });
      }
    },
  });

  const handleCloseForm = () => {
    setFormOpen(false);
    setSelected(null);
    formik.resetForm({ values: emptyForm });
  };

  const handleOpenAdd = () => {
    setSelected(null);
    formik.resetForm({ values: emptyForm });
    setFormOpen(true);
  };

  const handleRemove = async () => {
    if (!selected) return;
    try {
      await removeMember(selected.id).unwrap();
      enqueueSnackbar('Member removed successfully', { variant: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    } catch {
      enqueueSnackbar('Failed to remove member', { variant: 'error' });
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await deactivate(id).unwrap();
      enqueueSnackbar('Member deactivated', { variant: 'warning' });
    } catch {
      enqueueSnackbar('Failed to deactivate member', { variant: 'error' });
    }
  };

  const handleReactivate = async (id: string) => {
    try {
      await reactivate(id).unwrap();
      enqueueSnackbar('Member reactivated', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to reactivate member', { variant: 'error' });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Project Team"
        subtitle="Manage engineers, site supervisors, and personnel assignment per project"
        actionLabel={hasItems ? 'Add Member' : undefined}
        onAction={hasItems ? handleOpenAdd : undefined}
      />

      {hasItems && (
        <Box display="flex" gap={2} mb={2}>
          <TextField
            select
            size="small"
            label="Role"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All Roles</MenuItem>
            {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
        </Box>
      )}

      {hasItems && (
        <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Daily Rate</TableCell>
                  <TableCell>Assigned</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 13 }}>
                          {m.userName.slice(0, 2).toUpperCase()}
                        </Avatar>
                        <Typography fontWeight={500} variant="body2">{m.userName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{m.userEmail}</TableCell>
                    <TableCell><Chip label={m.role} size="small" color={roleColor[m.role] ?? 'default'} /></TableCell>
                    <TableCell>
                      <Chip label={m.isActive ? 'Active' : 'Inactive'} size="small" color={m.isActive ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="right">{m.dailyRate ? `$${m.dailyRate}/day` : '—'}</TableCell>
                    <TableCell>{new Date(m.joinedDate).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      {m.isActive ? (
                        <Tooltip title="Deactivate"><IconButton size="small" color="warning" onClick={() => handleDeactivate(m.id)}><PersonOffIcon fontSize="small" /></IconButton></Tooltip>
                      ) : (
                        <Tooltip title="Reactivate"><IconButton size="small" color="success" onClick={() => handleReactivate(m.id)}><PersonIcon fontSize="small" /></IconButton></Tooltip>
                      )}
                      <Tooltip title="Remove"><IconButton size="small" color="error" onClick={() => { setSelected(m); setDeleteOpen(true); }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
            icon={<GroupIcon />}
            title="No team members assigned yet!"
            description="Assign site supervisors, project managers, and trade specialists to projects."
            actionLabel="Add Member"
            onAction={handleOpenAdd}
          />
        </Card>
      )}
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Team Member</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                select
                id="projectId"
                name="projectId"
                label="Project"
                value={formik.values.projectId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.projectId && Boolean(formik.errors.projectId)}
                helperText={formik.touched.projectId && formik.errors.projectId}
              >
                <MenuItem value="" disabled>Select project...</MenuItem>
                {projectsData?.items?.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({p.projectCode})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="userId"
                name="userId"
                label="User ID"
                value={formik.values.userId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.userId && Boolean(formik.errors.userId)}
                helperText={formik.touched.userId && formik.errors.userId}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                id="role"
                name="role"
                label="Role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.role && Boolean(formik.errors.role)}
                helperText={formik.touched.role && formik.errors.role}
              >
                {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="dailyRate"
                name="dailyRate"
                label="Daily Rate ($)"
                type="number"
                value={formik.values.dailyRate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dailyRate && Boolean(formik.errors.dailyRate)}
                helperText={formik.touched.dailyRate && formik.errors.dailyRate}
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
            disabled={adding || formik.isSubmitting}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        title="Remove Team Member"
        message={`Remove "${selected?.userName}" from the project?`}
        confirmText="Remove"
        onConfirm={handleRemove}
        onCancel={() => setDeleteOpen(false)}
        loading={removing}
      />
    </Box>
  );
}
