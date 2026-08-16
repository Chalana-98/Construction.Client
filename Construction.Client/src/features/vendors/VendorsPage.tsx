import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetVendorsQuery, useCreateVendorMutation,
  useDeleteVendorMutation,
} from '@/features/vendors/api';
import {
  VendorType, VendorTypeLabels
} from '@/types';
import type { VendorDto } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useSnackbar } from 'notistack';

const emptyForm = { name: '', type: VendorType.Subcontractor, contactName: '', email: '', phone: '', address: '', taxId: '', notes: '' };

export default function VendorsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetVendorsQuery({ page, pageSize: 15 });
  const [createVendor, { isLoading: creating }] = useCreateVendorMutation();
  const [deleteVendor, { isLoading: deleting }] = useDeleteVendorMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<VendorDto | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleCreate = async () => {
    try {
      await createVendor(form).unwrap();
      enqueueSnackbar('Vendor created', { variant: 'success' });
      setFormOpen(false);
      setForm(emptyForm);
    } catch { enqueueSnackbar('Failed to create vendor', { variant: 'error' }); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try { await deleteVendor(selected.id).unwrap(); enqueueSnackbar('Deleted', { variant: 'success' }); setDeleteOpen(false); }
    catch { enqueueSnackbar('Failed to delete', { variant: 'error' }); }
  };

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [f]: e.target.value }));

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Vendors & Directory"
        actionLabel={hasItems ? "Add Vendor" : undefined}
        onAction={hasItems ? () => { setForm(emptyForm); setFormOpen(true); } : undefined}
      />

      {hasItems && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((v) => (
                  <TableRow key={v.id} hover>
                    <TableCell><Typography fontWeight={500}>{v.name}</Typography></TableCell>
                    <TableCell><Chip label={v.typeName} size="small" variant="outlined" color="primary" /></TableCell>
                    <TableCell>{v.contactName || '—'}</TableCell>
                    <TableCell>{v.email || '—'}</TableCell>
                    <TableCell>{v.phone || '—'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setSelected(v); setDeleteOpen(true); }}>
                        <DeleteIcon fontSize="small" /></IconButton></Tooltip>
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
            icon={<StorefrontIcon />}
            title="No vendors or suppliers yet!"
            description="Add subcontractors, material suppliers, and equipment rental vendors to your directory."
            actionLabel="Add Vendor"
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
        <DialogTitle>Add Vendor</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Company Name" value={form.name} onChange={upd('name')} required /></Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth select label="Vendor Type" value={form.type} onChange={upd('type')}>
                {Object.entries(VendorTypeLabels).map(([v, l]) => <MenuItem key={v} value={Number(v)}>{l}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Contact Name" value={form.contactName} onChange={upd('contactName')} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Phone" value={form.phone} onChange={upd('phone')} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Email" value={form.email} onChange={upd('email')} type="email" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating}>Create</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Vendor" message={`Delete "${selected?.name}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
