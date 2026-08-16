import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Pagination, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  useGetTimesheetsQuery, useCreateTimesheetMutation,
  useDeleteTimesheetMutation, useApproveTimesheetMutation,
} from '@/features/timesheets/api';
import type { TimesheetDto } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useSnackbar } from 'notistack';

const emptyForm = { projectId: '', workerId: '', startDate: '', endDate: '' };

export default function TimesheetsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetTimesheetsQuery({ page, pageSize: 15 });
  const [createTimesheet, { isLoading: creating }] = useCreateTimesheetMutation();
  const [deleteTimesheet, { isLoading: deleting }] = useDeleteTimesheetMutation();
  const [approveTimesheet] = useApproveTimesheetMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<TimesheetDto | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleCreate = async () => {
    try {
      await createTimesheet(form).unwrap();
      enqueueSnackbar('Timesheet created', { variant: 'success' });
      setFormOpen(false);
      setForm(emptyForm);
    } catch { enqueueSnackbar('Failed to create timesheet', { variant: 'error' }); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try { await deleteTimesheet(selected.id).unwrap(); enqueueSnackbar('Deleted', { variant: 'success' }); setDeleteOpen(false); }
    catch { enqueueSnackbar('Failed to delete', { variant: 'error' }); }
  };

  const handleApprove = async (id: string) => {
    try { await approveTimesheet(id).unwrap(); enqueueSnackbar('Approved', { variant: 'success' }); }
    catch { enqueueSnackbar('Failed to approve', { variant: 'error' }); }
  };

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [f]: e.target.value }));

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Timesheets"
        actionLabel={hasItems ? "New Timesheet" : undefined}
        onAction={hasItems ? () => { setForm(emptyForm); setFormOpen(true); } : undefined}
      />

      {hasItems && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Worker</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell><Typography fontWeight={500}>{t.workerName}</Typography></TableCell>
                    <TableCell>{t.projectName}</TableCell>
                    <TableCell>{new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{t.totalHours} hrs</TableCell>
                    <TableCell>
                      <Chip 
                        label={t.isApproved ? 'Approved' : 'Pending'} 
                        size="small" 
                        color={t.isApproved ? 'success' : 'warning'} 
                      />
                    </TableCell>
                    <TableCell align="right">
                      {!t.isApproved && (
                        <Tooltip title="Approve">
                          <IconButton size="small" color="success" onClick={() => handleApprove(t.id)}>
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => { setSelected(t); setDeleteOpen(true); }}>
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
            icon={<AccessTimeIcon />}
            title="No timesheets submitted yet!"
            description="Record labor shifts, worker hours, and wage allocations for payroll review."
            actionLabel="New Timesheet"
            onAction={() => { setForm(emptyForm); setFormOpen(true); }}
          />
        </Card>
      )}
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, val) => setPage(val)} color="primary" />
        </Box>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Timesheet</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Worker (User ID)" value={form.workerId} onChange={upd('workerId')} required /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Project ID" value={form.projectId} onChange={upd('projectId')} required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Start Date" type="date" value={form.startDate} onChange={upd('startDate')} slotProps={{ inputLabel: { shrink: true } }} required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="End Date" type="date" value={form.endDate} onChange={upd('endDate')} slotProps={{ inputLabel: { shrink: true } }} required />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating}>Create</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Timesheet" message={`Delete timesheet for ${selected?.workerName}?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
