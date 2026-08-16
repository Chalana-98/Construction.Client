import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [form, setForm] = useState(emptyForm);

  const handleAdd = async () => {
    try {
      await addMember({
        projectId: form.projectId,
        userId: form.userId,
        role: form.role,
        dailyRate: form.dailyRate ? Number(form.dailyRate) : undefined,
        notes: form.notes || undefined,
      }).unwrap();
      enqueueSnackbar('Member added', { variant: 'success' });
      setFormOpen(false);
      setForm(emptyForm);
    } catch {
      enqueueSnackbar('Failed to add member', { variant: 'error' });
    }
  };

  const handleRemove = async () => {
    if (!selected) return;
    try {
      await removeMember(selected.id).unwrap();
      enqueueSnackbar('Member removed', { variant: 'success' });
      setDeleteOpen(false);
    } catch {
      enqueueSnackbar('Failed to remove member', { variant: 'error' });
    }
  };

  const handleToggleActive = async (member: ProjectMemberDto) => {
    try {
      if (member.isActive) {
        await deactivate(member.id).unwrap();
        enqueueSnackbar('Member deactivated', { variant: 'info' });
      } else {
        await reactivate(member.id).unwrap();
        enqueueSnackbar('Member reactivated', { variant: 'success' });
      }
    } catch {
      enqueueSnackbar('Action failed', { variant: 'error' });
    }
  };

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Team Members"
        actionLabel={hasItems ? "Add Member" : undefined}
        onAction={hasItems ? () => { setForm(emptyForm); setFormOpen(true); } : undefined}
      />

      {(hasItems || roleFilter) && (
        <Box display="flex" gap={2} mb={3}>
          <TextField
            size="small" select label="Role" value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Roles</MenuItem>
            {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </TextField>
        </Box>
      )}

      {hasItems && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Daily Rate</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((m) => (
                  <TableRow key={m.id} hover sx={{ opacity: m.isActive ? 1 : 0.6 }}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                          {m.userName?.charAt(0).toUpperCase() ?? '?'}
                        </Avatar>
                        <Typography fontWeight={500}>{m.userName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{m.userEmail}</TableCell>
                    <TableCell>{m.userJobTitle ?? '—'}</TableCell>
                    <TableCell>
                      <Chip label={m.role} size="small" color={roleColor[m.role] ?? 'default'} />
                    </TableCell>
                    <TableCell>
                      {m.dailyRate ? `$${m.dailyRate.toLocaleString()}` : '—'}
                    </TableCell>
                    <TableCell>{new Date(m.joinedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={m.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={m.isActive ? 'success' : 'default'}
                        variant={m.isActive ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={m.isActive ? 'Deactivate' : 'Reactivate'}>
                        <IconButton size="small" onClick={() => handleToggleActive(m)}>
                          {m.isActive ? <PersonOffIcon fontSize="small" /> : <PersonIcon fontSize="small" color="success" />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove">
                        <IconButton size="small" color="error" onClick={() => { setSelected(m); setDeleteOpen(true); }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
            title="No team members yet!"
            description="Add workers, managers, or viewers to collaborate on your construction projects."
            actionLabel="Add Member"
            onAction={() => { setForm(emptyForm); setFormOpen(true); }}
          />
        </Card>
      )}

      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      {/* Add Member Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}>
              {projectsData?.items && projectsData.items.length > 0 ? (
                <TextField
                  fullWidth
                  select
                  label="Project"
                  value={form.projectId}
                  onChange={upd('projectId')}
                  required
                  helperText="Select the project"
                >
                  {projectsData.items.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name} ({p.projectCode})
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField fullWidth label="Project ID" value={form.projectId} onChange={upd('projectId')} required helperText="Enter the project ID" />
              )}
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="User ID" value={form.userId} onChange={upd('userId')} required helperText="Enter the user ID" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth select label="Role" value={form.role} onChange={upd('role')}>
                {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Daily Rate ($)" type="number" value={form.dailyRate} onChange={upd('dailyRate')} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Notes" value={form.notes} onChange={upd('notes')} multiline rows={2} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={adding}>Add Member</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen} title="Remove Team Member"
        message={`Remove "${selected?.userName}" from the project?`}
        confirmText="Remove" onConfirm={handleRemove} onCancel={() => setDeleteOpen(false)} loading={removing}
      />
    </Box>
  );
}
