import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Pagination, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import {
  useGetMaterialsQuery, useCreateMaterialMutation,
  useUpdateMaterialMutation, useDeleteMaterialMutation,
} from '@/features/materials/api';
import type { MaterialDto } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import EmptyState from '@/components/EmptyState';
import CategoryIcon from '@mui/icons-material/Category';
import { useSnackbar } from 'notistack';

const emptyForm = { name: '', materialCode: '', category: '', unit: '', unitPrice: 0, quantityInStock: 0, supplierName: '', storageLocation: '', notes: '' };

export default function MaterialsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading, error, refetch } = useGetMaterialsQuery({ page, pageSize: 15, search: search || undefined });
  const [createMaterial, { isLoading: creating }] = useCreateMaterialMutation();
  const [updateMaterial, { isLoading: updating }] = useUpdateMaterialMutation();
  const [deleteMaterial, { isLoading: deleting }] = useDeleteMaterialMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<MaterialDto | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => { setSelected(null); setForm(emptyForm); setFormOpen(true); };
  const openEdit = (m: MaterialDto) => {
    setSelected(m);
    setForm({ name: m.name, materialCode: m.materialCode, category: m.category, unit: m.unit, unitPrice: m.unitPrice, quantityInStock: m.quantityInStock, supplierName: m.supplierName ?? '', storageLocation: m.storageLocation ?? '', notes: m.notes ?? '' });
    setFormOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selected) {
        await updateMaterial({ id: selected.id, data: form }).unwrap();
        enqueueSnackbar('Material updated', { variant: 'success' });
      } else {
        await createMaterial(form).unwrap();
        enqueueSnackbar('Material created', { variant: 'success' });
      }
      setFormOpen(false);
    } catch { enqueueSnackbar('Failed to save', { variant: 'error' }); }
  };

  const handleDelete = async () => {
    if (!selected) return;
    try { await deleteMaterial(selected.id).unwrap(); enqueueSnackbar('Deleted', { variant: 'success' }); setDeleteOpen(false); }
    catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };

  const upd = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [f]: e.target.value }));

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Materials"
        actionLabel={hasItems ? "Add Material" : undefined}
        onAction={hasItems ? openCreate : undefined}
      />
      {(hasItems || search) && (
        <Box display="flex" gap={2} mb={3}>
          <TextField size="small" placeholder="Search materials..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> } }}
            sx={{ minWidth: 280 }} />
        </Box>
      )}

      {hasItems && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((m) => (
                  <TableRow key={m.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Typography fontWeight={500}>{m.name}</Typography>
                        {m.isLowStock && <Tooltip title="Low Stock"><WarningIcon color="warning" fontSize="small" /></Tooltip>}
                      </Box>
                    </TableCell>
                    <TableCell><Chip label={m.materialCode} size="small" variant="outlined" /></TableCell>
                    <TableCell>{m.category}</TableCell>
                    <TableCell>{m.unit}</TableCell>
                    <TableCell align="right">${m.unitPrice.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600} color={m.isLowStock ? 'error' : 'text.primary'}>{m.quantityInStock}</Typography>
                    </TableCell>
                    <TableCell>{m.supplierName ?? '—'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(m)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setSelected(m); setDeleteOpen(true); }}>
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
            icon={<CategoryIcon />}
            title="No materials found!"
            description="Add construction materials, batch codes, unit rates, and warehouse locations."
            actionLabel="Add Material"
            onAction={openCreate}
          />
        </Card>
      )}
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Material' : 'Add Material'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, sm: 8 }}><TextField fullWidth label="Name" value={form.name} onChange={upd('name')} required /></Grid>
            <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth label="Code" value={form.materialCode} onChange={upd('materialCode')} required disabled={!!selected} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Category" value={form.category} onChange={upd('category')} required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Unit" value={form.unit} onChange={upd('unit')} required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Unit Price" value={form.unitPrice} onChange={upd('unitPrice')} type="number" required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Stock Qty" value={form.quantityInStock} onChange={upd('quantityInStock')} type="number" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Supplier" value={form.supplierName} onChange={upd('supplierName')} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Storage Location" value={form.storageLocation} onChange={upd('storageLocation')} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Notes" value={form.notes} onChange={upd('notes')} multiline rows={2} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={creating || updating}>{selected ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={deleteOpen} title="Delete Material" message={`Delete "${selected?.name}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
