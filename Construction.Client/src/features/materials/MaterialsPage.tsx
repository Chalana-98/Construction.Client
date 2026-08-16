import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Pagination, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import { useSnackbar } from 'notistack';

const emptyForm = { name: '', materialCode: '', category: '', unit: '', unitPrice: 0, quantityInStock: 0, supplierName: '', storageLocation: '', notes: '' };

const materialValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters.')
    .required('Material name is required.'),
  materialCode: Yup.string()
    .required('Material code is required.'),
  category: Yup.string()
    .required('Material category is required.'),
  unit: Yup.string()
    .required('Measurement unit is required.'),
  unitPrice: Yup.number()
    .typeError('Unit price must be a number.')
    .min(0, 'Unit price cannot be negative.')
    .required('Unit price is required.'),
  quantityInStock: Yup.number()
    .typeError('Stock quantity must be a number.')
    .min(0, 'Stock quantity cannot be negative.')
    .optional(),
});

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: selected
      ? {
          name: selected.name,
          materialCode: selected.materialCode,
          category: selected.category,
          unit: selected.unit,
          unitPrice: selected.unitPrice,
          quantityInStock: selected.quantityInStock,
          supplierName: selected.supplierName ?? '',
          storageLocation: selected.storageLocation ?? '',
          notes: selected.notes ?? '',
        }
      : emptyForm,
    validationSchema: materialValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        if (selected) {
          await updateMaterial({
            id: selected.id,
            data: {
              name: values.name.trim(),
              category: values.category.trim(),
              unit: values.unit.trim(),
              unitPrice: Number(values.unitPrice),
              quantityInStock: Number(values.quantityInStock),
              supplierName: values.supplierName.trim() || undefined,
              storageLocation: values.storageLocation.trim() || undefined,
              notes: values.notes.trim() || undefined,
            },
          }).unwrap();
          enqueueSnackbar('Material updated successfully', { variant: 'success' });
        } else {
          await createMaterial({
            name: values.name.trim(),
            materialCode: values.materialCode.trim(),
            category: values.category.trim(),
            unit: values.unit.trim(),
            unitPrice: Number(values.unitPrice),
            quantityInStock: Number(values.quantityInStock),
            supplierName: values.supplierName.trim() || undefined,
            storageLocation: values.storageLocation.trim() || undefined,
            notes: values.notes.trim() || undefined,
          }).unwrap();
          enqueueSnackbar('Material added successfully', { variant: 'success' });
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
        enqueueSnackbar(apiErr?.data?.message || 'Failed to save material', { variant: 'error' });
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

  const handleOpenEdit = (m: MaterialDto) => {
    setSelected(m);
    formik.resetForm({
      values: {
        name: m.name,
        materialCode: m.materialCode,
        category: m.category,
        unit: m.unit,
        unitPrice: m.unitPrice,
        quantityInStock: m.quantityInStock,
        supplierName: m.supplierName ?? '',
        storageLocation: m.storageLocation ?? '',
        notes: m.notes ?? '',
      },
    });
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteMaterial(selected.id).unwrap();
      enqueueSnackbar('Material deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    } catch {
      enqueueSnackbar('Failed to delete material', { variant: 'error' });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Material Inventory & Supplies"
        subtitle="Track stock levels, material procurement batches, supplier items, and unit costs"
        actionLabel={hasItems ? 'Add Material' : undefined}
        onAction={hasItems ? handleOpenCreate : undefined}
      />

      {(hasItems || search) && (
        <Box display="flex" gap={2} mb={3}>
          <TextField
            size="small"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ minWidth: 280 }}
          />
        </Box>
      )}

      {hasItems && (
        <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items?.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{m.name}</TableCell>
                    <TableCell>{m.materialCode}</TableCell>
                    <TableCell>{m.category}</TableCell>
                    <TableCell align="right">${m.unitPrice.toFixed(2)}/{m.unit}</TableCell>
                    <TableCell align="right">{m.quantityInStock} {m.unit}</TableCell>
                    <TableCell>{m.supplierName ?? '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenEdit(m)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" color="error" onClick={() => { setSelected(m); setDeleteOpen(true); }}><DeleteIcon fontSize="small" /></IconButton>
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
            icon={<Inventory2Icon />}
            title="No materials in inventory yet!"
            description="Add construction materials, batch codes, unit rates, and warehouse locations."
            actionLabel="Add Material"
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
        <DialogTitle sx={{ fontWeight: 700 }}>{selected ? 'Edit Material' : 'Add Material'}</DialogTitle>
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
                id="materialCode"
                name="materialCode"
                label="Code"
                value={formik.values.materialCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                disabled={Boolean(selected)}
                error={formik.touched.materialCode && Boolean(formik.errors.materialCode)}
                helperText={formik.touched.materialCode && formik.errors.materialCode}
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
                id="unit"
                name="unit"
                label="Unit"
                value={formik.values.unit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.unit && Boolean(formik.errors.unit)}
                helperText={formik.touched.unit && formik.errors.unit}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="unitPrice"
                name="unitPrice"
                label="Unit Price"
                value={formik.values.unitPrice}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="number"
                required
                error={formik.touched.unitPrice && Boolean(formik.errors.unitPrice)}
                helperText={formik.touched.unitPrice && formik.errors.unitPrice}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="quantityInStock"
                name="quantityInStock"
                label="Stock Qty"
                value={formik.values.quantityInStock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="number"
                error={formik.touched.quantityInStock && Boolean(formik.errors.quantityInStock)}
                helperText={formik.touched.quantityInStock && formik.errors.quantityInStock}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="supplierName"
                name="supplierName"
                label="Supplier"
                value={formik.values.supplierName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="storageLocation"
                name="storageLocation"
                label="Storage Location"
                value={formik.values.storageLocation}
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

      <ConfirmDialog open={deleteOpen} title="Delete Material" message={`Delete "${selected?.name}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
