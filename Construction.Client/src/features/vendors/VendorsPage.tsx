import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Pagination, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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

const vendorValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Company name must be at least 2 characters.')
    .required('Company / Vendor name is required.'),
  type: Yup.number()
    .required('Vendor type is required.'),
  email: Yup.string()
    .email('Please enter a valid email address.')
    .optional(),
  contactName: Yup.string().optional(),
  phone: Yup.string().optional(),
});

export default function VendorsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetVendorsQuery({ page, pageSize: 15 });
  const [createVendor, { isLoading: creating }] = useCreateVendorMutation();
  const [deleteVendor, { isLoading: deleting }] = useDeleteVendorMutation();
  const { enqueueSnackbar } = useSnackbar();

  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<VendorDto | null>(null);

  const formik = useFormik({
    initialValues: emptyForm,
    validationSchema: vendorValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        await createVendor({
          name: values.name.trim(),
          type: Number(values.type),
          contactName: values.contactName.trim() || undefined,
          email: values.email.trim() || undefined,
          phone: values.phone.trim() || undefined,
        }).unwrap();
        enqueueSnackbar('Vendor created successfully', { variant: 'success' });
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
        enqueueSnackbar(apiErr?.data?.message || 'Failed to create vendor', { variant: 'error' });
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
      await deleteVendor(selected.id).unwrap();
      enqueueSnackbar('Vendor deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    } catch {
      enqueueSnackbar('Failed to delete vendor', { variant: 'error' });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Vendors & Subcontractors"
        subtitle="Manage suppliers, equipment renters, and specialty trade subcontractors"
        actionLabel={hasItems ? 'Add Vendor' : undefined}
        onAction={hasItems ? handleOpenCreate : undefined}
      />

      {hasItems && (
        <Card sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell sx={{ fontWeight: 600 }}>{v.name}</TableCell>
                    <TableCell>
                      <Chip label={VendorTypeLabels[v.type] ?? v.type} size="small" />
                    </TableCell>
                    <TableCell>{v.contactName ?? '—'}</TableCell>
                    <TableCell>{v.phone ?? '—'}</TableCell>
                    <TableCell>{v.email ?? '—'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => { setSelected(v); setDeleteOpen(true); }}><DeleteIcon fontSize="small" /></IconButton>
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
        <DialogTitle sx={{ fontWeight: 700 }}>Add Vendor / Subcontractor</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Vendor Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                select
                id="type"
                name="type"
                label="Vendor Type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              >
                {Object.entries(VendorTypeLabels).map(([v, l]) => <MenuItem key={v} value={Number(v)}>{l}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="contactName"
                name="contactName"
                label="Contact Name"
                value={formik.values.contactName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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

      <ConfirmDialog open={deleteOpen} title="Delete Vendor" message={`Delete "${selected?.name}"?`}
        confirmText="Delete" onConfirm={handleDelete} onCancel={() => setDeleteOpen(false)} loading={deleting} />
    </Box>
  );
}
