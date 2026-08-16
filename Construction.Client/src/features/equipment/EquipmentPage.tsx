import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import EmptyState from '@/components/EmptyState';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import { useSnackbar } from 'notistack';

const emptyForm = { name: '', equipmentCode: '', category: '', manufacturer: '', model: '', serialNumber: '', currentLocation: '', notes: '' };

const equipmentValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .required('Equipment name is required.'),
  equipmentCode: Yup.string()
    .required('Equipment code is required.'),
  category: Yup.string()
    .required('Equipment category is required.'),
});

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: selected
      ? {
          name: selected.name,
          equipmentCode: selected.equipmentCode,
          category: selected.category,
          manufacturer: selected.manufacturer ?? '',
          model: selected.model ?? '',
          serialNumber: selected.serialNumber ?? '',
          currentLocation: selected.currentLocation ?? '',
          notes: selected.notes ?? '',
        }
      : emptyForm,
    validationSchema: equipmentValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        if (selected) {
          await updateEquipment({
            id: selected.id,
            data: {
              name: values.name.trim(),
              category: values.category.trim(),
              manufacturer: values.manufacturer.trim() || undefined,
              model: values.model.trim() || undefined,
              serialNumber: values.serialNumber.trim() || undefined,
              currentLocation: values.currentLocation.trim() || undefined,
              notes: values.notes.trim() || undefined,
            },
          }).unwrap();
          enqueueSnackbar('Equipment updated successfully', { variant: 'success' });
        } else {
          await createEquipment({
            name: values.name.trim(),
            equipmentCode: values.equipmentCode.trim(),
            category: values.category.trim(),
            manufacturer: values.manufacturer.trim() || undefined,
            model: values.model.trim() || undefined,
            serialNumber: values.serialNumber.trim() || undefined,
            currentLocation: values.currentLocation.trim() || undefined,
            notes: values.notes.trim() || undefined,
          }).unwrap();
          enqueueSnackbar('Equipment added successfully', { variant: 'success' });
        }
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
        enqueueSnackbar(apiErr?.data?.message || 'Failed to save equipment', { variant: 'error' });
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

  const handleOpenEdit = (item: EquipmentDto) => {
    setSelected(item);
    formik.resetForm({
      values: {
        name: item.name,
        equipmentCode: item.equipmentCode,
        category: item.category,
        manufacturer: item.manufacturer ?? '',
        model: item.model ?? '',
        serialNumber: item.serialNumber ?? '',
        currentLocation: item.currentLocation ?? '',
        notes: item.notes ?? '',
      },
    });
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteEquipment(selected.id).unwrap();
      enqueueSnackbar('Equipment deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    } catch {
      enqueueSnackbar('Failed to delete equipment', { variant: 'error' });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Heavy Machinery & Equipment"
        subtitle="Manage fleet inventory, heavy equipment status, and maintenance records"
        actionLabel={hasItems ? "Add Equipment" : undefined}
        onAction={hasItems ? handleOpenCreate : undefined}
      />
      {(hasItems || statusFilter) && (
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
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenEdit(eq)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => { setSelected(eq); setDeleteOpen(true); }}>
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
            icon={<PrecisionManufacturingIcon />}
            title="No equipment registered yet!"
            description="Register cranes, excavators, lifts, and machinery to track fleet deployment."
            actionLabel="Add Equipment"
            onAction={handleOpenCreate}
          />
        </Card>
      )}
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      {/* Form Dialog */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{selected ? 'Edit Equipment' : 'Add Equipment'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                id="equipmentCode"
                name="equipmentCode"
                label="Code"
                value={formik.values.equipmentCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                disabled={Boolean(selected)}
                error={formik.touched.equipmentCode && Boolean(formik.errors.equipmentCode)}
                helperText={formik.touched.equipmentCode && formik.errors.equipmentCode}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="category"
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="manufacturer"
                name="manufacturer"
                label="Manufacturer"
                value={formik.values.manufacturer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="model"
                name="model"
                label="Model"
                value={formik.values.model}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="serialNumber"
                name="serialNumber"
                label="Serial Number"
                value={formik.values.serialNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="currentLocation"
                name="currentLocation"
                label="Current Location"
                value={formik.values.currentLocation}
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
            disabled={creating || updating || formik.isSubmitting}
          >
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
