import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetEquipmentQuery, useCreateEquipmentMutation,
  useUpdateEquipmentMutation, useDeleteEquipmentMutation,
} from '@/features/equipment/api';
import { EquipmentStatus, EquipmentStatusLabels } from '@/types';
import type { EquipmentDto } from '@/types';
import { StatusChip } from '@/components/StatusChip';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useSnackbar } from 'notistack';

const emptyForm = { name: '', equipmentCode: '', category: '', manufacturer: '', model: '', serialNumber: '', currentLocation: '', notes: '' };

export default function EquipmentPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | ''>('');
  const { data, isLoading, error, refetch } = useGetEquipmentQuery({
    page, pageSize: 15,
    status: statusFilter === '' ? undefined : statusFilter,
  });
  const [createEquipment, { isLoading: creating }] = useCreateEquipmentMutation();
  const [updateEquipment, { isLoading: updating }] = useUpdateEquipmentMutation();
  const [deleteEquipment, { isLoading: deleting }] = useDeleteEquipmentMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<EquipmentDto | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => { setSelected(null); setForm(emptyForm); setFormOpen(true); };
  const openEdit = (eq: EquipmentDto) => {
    setSelected(eq);
    setForm({
      name: eq.name, equipmentCode: eq.equipmentCode, category: eq.category,
      manufacturer: eq.manufacturer ?? '', model: eq.model ?? '',
      serialNumber: eq.serialNumber ?? '', currentLocation: eq.currentLocation ?? '',
      notes: eq.notes ?? '',
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selected) {
        await updateEquipment({ id: selected.id, data: form }).unwrap();
        enqueueSnackbar('Equipment updated', { variant: 'success' });
      } else {
        await createEquipment(form).unwrap();
        enqueueSnackbar('Equipment created', { variant: 'success' });
      }
      setFormOpen(false);
    } catch { enqueueSnackbar('Failed to save', { variant: 'error' }); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteEquipment(selected.id).unwrap();
      enqueueSnackbar('Equipment deleted', { variant: 'success' });
      setDeleteOpen(false); setSelected(null);
    } catch { enqueueSnackbar('Failed to delete', { variant: 'error' }); }
  };

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [f]: e.target.value }));

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  return (
    <Box>
      <PageHeader title="Equipment" actionLabel="Add Equipment" onAction={openCreate} />
      <Box display="flex" gap={2} mb={3}>
        <TextField size="small" select label="Status" value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as EquipmentStatus | ''); setPage(1); }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.entries(EquipmentStatusLabels).map(([v, l]) => (
            <MenuItem key={v} value={v}>{l}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Manufacturer</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((eq) => (
                <TableRow key={eq.id} hover>
                  <TableCell><Typography fontWeight={500}>{eq.name}</Typography></TableCell>
                  <TableCell><Chip label={eq.equipmentCode} size="small" variant="outlined" /></TableCell>
                  <TableCell>{eq.category}</TableCell>
                  <TableCell><StatusChip type="equipmentStatus" value={eq.status} /></TableCell>
                  <TableCell>{eq.currentLocation ?? '—'}</TableCell>
                  <TableCell>{[eq.manufacturer, eq.model].filter(Boolean).join(' ') || '—'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(eq)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setSelected(eq); setDeleteOpen(true); }}>
                      <DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.items || data.items.length === 0) && (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No equipment found</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      {/* Form Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, sm: 8 }}><TextField fullWidth label="Name" value={form.name} onChange={upd('name')} required /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Code" value={form.equipmentCode} onChange={upd('equipmentCode')} required disabled={!!selected} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Category" value={form.category} onChange={upd('category')} required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Manufacturer" value={form.manufacturer} onChange={upd('manufacturer')} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Model" value={form.model} onChange={upd('model')} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Serial Number" value={form.serialNumber} onChange={upd('serialNumber')} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Location" value={form.currentLocation} onChange={upd('currentLocation')} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Notes" value={form.notes} onChange={upd('notes')} multiline rows={2} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={creating || updating}>
            {selected ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Equipment"
        message={`Delete "${selected?.name}"? This cannot be undone.`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
