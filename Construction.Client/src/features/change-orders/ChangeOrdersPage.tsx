import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  useGetChangeOrdersQuery, useCreateChangeOrderMutation,
  useDeleteChangeOrderMutation, useApproveChangeOrderMutation, useRejectChangeOrderMutation
} from '@/features/change-orders/api';
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

export default function ChangeOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ChangeOrderStatus | ''>('');
  const { data, isLoading, error, refetch } = useGetChangeOrdersQuery({
    page, pageSize: 15,
    status: statusFilter === '' ? undefined : statusFilter,
  });
  const [createChangeOrder, { isLoading: creating }] = useCreateChangeOrderMutation();
  const [deleteChangeOrder, { isLoading: deleting }] = useDeleteChangeOrderMutation();
  const [approveChangeOrder] = useApproveChangeOrderMutation();
  const [rejectChangeOrder] = useRejectChangeOrderMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<ChangeOrderDto | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleCreate = async () => {
    try {
      await createChangeOrder({ ...form, requestedAmount: Number(form.requestedAmount), scheduleImpactDays: Number(form.scheduleImpactDays) }).unwrap();
      enqueueSnackbar('Change Order created', { variant: 'success' });
      setFormOpen(false);
      setForm(emptyForm);
    } catch { enqueueSnackbar('Failed to create', { variant: 'error' }); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try { await deleteChangeOrder(selected.id).unwrap(); enqueueSnackbar('Deleted', { variant: 'success' }); setDeleteOpen(false); }
    catch { enqueueSnackbar('Failed to delete', { variant: 'error' }); }
  };

  const handleApprove = async (id: string) => {
    try { await approveChangeOrder(id).unwrap(); enqueueSnackbar('Approved', { variant: 'success' }); }
    catch { enqueueSnackbar('Failed to approve', { variant: 'error' }); }
  };

  const handleReject = async (id: string) => {
    try { await rejectChangeOrder(id).unwrap(); enqueueSnackbar('Rejected', { variant: 'warning' }); }
    catch { enqueueSnackbar('Failed to reject', { variant: 'error' }); }
  };

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [f]: e.target.value }));

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Change Orders"
        actionLabel={hasItems ? "New Change Order" : undefined}
        onAction={hasItems ? () => { setForm(emptyForm); setFormOpen(true); } : undefined}
      />
      {(hasItems || statusFilter) && (
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField size="small" select label="Status" value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as ChangeOrderStatus | ''); setPage(1); }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {Object.entries(ChangeOrderStatusLabels).map(([v, l]) => <MenuItem key={v} value={v}>{l}</MenuItem>)}
          </TextField>
        </Box>
      )}

      {hasItems && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>CO #</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Requested Amount</TableCell>
                  <TableCell>Schedule Impact (Days)</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((co) => (
                  <TableRow key={co.id} hover>
                    <TableCell><Chip label={co.number} size="small" variant="outlined" /></TableCell>
                    <TableCell><Typography fontWeight={500}>{co.title}</Typography></TableCell>
                    <TableCell>{co.projectName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={co.statusName} 
                        size="small" 
                        color={
                          co.status === ChangeOrderStatus.Approved ? 'success' : 
                          co.status === ChangeOrderStatus.Rejected ? 'error' : 
                          co.status === ChangeOrderStatus.Pending ? 'warning' : 'default'
                        } 
                      />
                    </TableCell>
                    <TableCell>${co.requestedAmount.toLocaleString()}</TableCell>
                    <TableCell>{co.scheduleImpactDays}</TableCell>
                    <TableCell>{new Date(co.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      {co.status === ChangeOrderStatus.Pending && (
                        <>
                          <Tooltip title="Approve"><IconButton size="small" color="success" onClick={() => handleApprove(co.id)}><CheckCircleIcon fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Reject"><IconButton size="small" color="warning" onClick={() => handleReject(co.id)}><CancelIcon fontSize="small" /></IconButton></Tooltip>
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
            onAction={() => { setForm(emptyForm); setFormOpen(true); }}
          />
        </Card>
      )}
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Change Order</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Project ID" value={form.projectId} onChange={upd('projectId')} required helperText="Enter the Project ID" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Title" value={form.title} onChange={upd('title')} required /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Description" value={form.description} onChange={upd('description')} multiline rows={4} required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Requested Amount" value={form.requestedAmount} onChange={upd('requestedAmount')} required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Schedule Impact (Days)" value={form.scheduleImpactDays} onChange={upd('scheduleImpactDays')} required /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating}>Create</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Change Order" message={`Delete "${selected?.title}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
