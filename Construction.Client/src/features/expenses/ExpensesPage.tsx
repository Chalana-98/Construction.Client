import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, InputAdornment,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaidIcon from '@mui/icons-material/Paid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useApproveExpenseMutation,
  useMarkExpensePaidMutation,
} from '@/features/expenses/api';
import { useGetProjectsQuery } from '@/features/projects/api';
import { ExpenseCategory, ExpenseCategoryLabels } from '@/types';
import type { ExpenseDto, CreateExpenseDto, UpdateExpenseDto } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useSnackbar } from 'notistack';
import { useCurrency } from '@/utils/currency';

const emptyForm = {
  projectId: '',
  description: '',
  category: '' as ExpenseCategory | '',
  amount: '',
  currency: 'LKR',
  expenseDate: new Date().toISOString().split('T')[0],
  vendorName: '',
  invoiceNumber: '',
  receiptUrl: '',
  notes: '',
};

const expenseValidationSchema = Yup.object({
  projectId: Yup.string()
    .required('Project selection is required.'),
  description: Yup.string()
    .min(3, 'Description must be at least 3 characters long.')
    .required('Expense description is required.'),
  category: Yup.mixed<ExpenseCategory>()
    .required('Expense category is required.'),
  amount: Yup.number()
    .typeError('Amount must be a valid number.')
    .positive('Amount must be greater than 0.')
    .required('Expense amount is required.'),
  expenseDate: Yup.string()
    .required('Expense date is required.'),
  receiptUrl: Yup.string()
    .url('Please enter a valid URL (e.g. https://...).')
    .optional(),
});

export default function ExpensesPage() {
  const { symbol } = useCurrency();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<ExpenseCategory | ''>('');

  const { data, isLoading, error, refetch } = useGetExpensesQuery({
    page,
    pageSize: 15,
    category: category === '' ? undefined : category,
  });

  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 100 });
  const [createExpense, { isLoading: creating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: updating }] = useUpdateExpenseMutation();
  const [deleteExpense, { isLoading: deleting }] = useDeleteExpenseMutation();
  const [approve] = useApproveExpenseMutation();
  const [markPaid] = useMarkExpensePaidMutation();
  const { enqueueSnackbar } = useSnackbar();

  // Form & Dialog States
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<ExpenseDto | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: selected
      ? {
          projectId: selected.projectId,
          description: selected.description,
          category: selected.category,
          amount: String(selected.amount),
          currency: selected.currency ?? 'USD',
          expenseDate: selected.expenseDate ? selected.expenseDate.split('T')[0] : new Date().toISOString().split('T')[0],
          vendorName: selected.vendorName ?? '',
          invoiceNumber: selected.invoiceNumber ?? '',
          receiptUrl: selected.receiptUrl ?? '',
          notes: selected.notes ?? '',
        }
      : emptyForm,
    validationSchema: expenseValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      try {
        if (selected) {
          const updatePayload: UpdateExpenseDto = {
            description: values.description.trim(),
            category: values.category as ExpenseCategory,
            amount: Number(values.amount),
            currency: values.currency,
            expenseDate: new Date(values.expenseDate).toISOString(),
            vendorName: values.vendorName.trim() || undefined,
            invoiceNumber: values.invoiceNumber.trim() || undefined,
            receiptUrl: values.receiptUrl.trim() || undefined,
            notes: values.notes.trim() || undefined,
          };
          await updateExpense({ id: selected.id, data: updatePayload }).unwrap();
          enqueueSnackbar('Expense record updated successfully', { variant: 'success' });
        } else {
          const createPayload: CreateExpenseDto = {
            projectId: values.projectId,
            description: values.description.trim(),
            category: values.category as ExpenseCategory,
            amount: Number(values.amount),
            currency: values.currency,
            expenseDate: new Date(values.expenseDate).toISOString(),
            vendorName: values.vendorName.trim() || undefined,
            invoiceNumber: values.invoiceNumber.trim() || undefined,
            receiptUrl: values.receiptUrl.trim() || undefined,
            notes: values.notes.trim() || undefined,
          };
          await createExpense(createPayload).unwrap();
          enqueueSnackbar('Expense created successfully', { variant: 'success' });
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
        enqueueSnackbar(apiErr?.data?.message || 'Failed to save expense', { variant: 'error' });
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

  const handleOpenEdit = (expense: ExpenseDto) => {
    setSelected(expense);
    formik.resetForm({
      values: {
        projectId: expense.projectId,
        description: expense.description,
        category: expense.category,
        amount: String(expense.amount),
        currency: expense.currency ?? 'USD',
        expenseDate: expense.expenseDate ? expense.expenseDate.split('T')[0] : new Date().toISOString().split('T')[0],
        vendorName: expense.vendorName ?? '',
        invoiceNumber: expense.invoiceNumber ?? '',
        receiptUrl: expense.receiptUrl ?? '',
        notes: expense.notes ?? '',
      },
    });
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!selected) return;
    try {
      await deleteExpense(selected.id).unwrap();
      enqueueSnackbar('Expense deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setSelected(null);
    } catch {
      enqueueSnackbar('Failed to delete expense', { variant: 'error' });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approve(id).unwrap();
      enqueueSnackbar('Expense approved', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to approve expense', { variant: 'error' });
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await markPaid(id).unwrap();
      enqueueSnackbar('Expense marked as paid', { variant: 'success' });
    } catch {
      enqueueSnackbar('Failed to mark expense as paid', { variant: 'error' });
    }
  };

  const hasItems = Boolean(data?.items && data.items.length > 0);

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Project Expenses & Cash Outflow"
        subtitle="Manage cost allocations, subcontractor invoices, material receipts, and expense approvals"
        actionLabel={hasItems ? 'Record Expense' : undefined}
        onAction={hasItems ? handleOpenCreate : undefined}
      />

      {(hasItems || category) && (
        <Box display="flex" gap={2} mb={3}>
          <TextField
            size="small"
            select
            label="Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as ExpenseCategory | '');
              setPage(1);
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {Object.entries(ExpenseCategoryLabels).map(([v, l]) => (
              <MenuItem key={v} value={v}>
                {l}
              </MenuItem>
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
                  <TableCell>Description</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.items.map((exp) => (
                  <TableRow key={exp.id} hover>
                    <TableCell>
                      <Typography fontWeight={500}>{exp.description}</Typography>
                      {exp.invoiceNumber && (
                        <Typography variant="caption" color="text.secondary">
                          Inv: {exp.invoiceNumber}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{exp.projectName}</TableCell>
                    <TableCell>
                      <Chip label={exp.categoryName} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600} color="primary.main">
                        {(exp.currency === 'USD' ? '$' : (exp.currency === 'EUR' ? '€' : (exp.currency === 'GBP' ? '£' : (symbol || 'Rs.'))))} {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {exp.expenseDate ? new Date(exp.expenseDate).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>{exp.vendorName ?? '—'}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <Chip
                          label={exp.isApproved ? 'Approved' : 'Pending'}
                          size="small"
                          color={exp.isApproved ? 'success' : 'warning'}
                          variant="outlined"
                        />
                        {exp.isPaid && <Chip label="Paid" size="small" color="info" />}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {!exp.isApproved && (
                        <Tooltip title="Approve">
                          <IconButton size="small" color="success" onClick={() => handleApprove(exp.id)}>
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {exp.isApproved && !exp.isPaid && (
                        <Tooltip title="Mark Paid">
                          <IconButton size="small" color="primary" onClick={() => handleMarkPaid(exp.id)}>
                            <PaidIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpenEdit(exp)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelected(exp);
                            setDeleteOpen(true);
                          }}
                        >
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
        <Card
          sx={{
            flexGrow: 1,
            minHeight: 'calc(100vh - 180px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <EmptyState
            icon={<ReceiptLongIcon />}
            title="No expenses recorded yet!"
            description="Track material purchases, subcontractor disbursements, equipment fuel, and jobsite invoices."
            actionLabel="Record Expense"
            onAction={handleOpenCreate}
          />
        </Card>
      )}

      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}

      {/* Create / Edit Expense Dialog */}
      <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {selected ? 'Edit Expense Record' : 'Record New Expense'}
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Grid container spacing={2}>
            {/* Project Selection */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                id="projectId"
                name="projectId"
                label="Project"
                required
                value={formik.values.projectId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={Boolean(selected)}
                error={formik.touched.projectId && Boolean(formik.errors.projectId)}
                helperText={formik.touched.projectId && formik.errors.projectId}
              >
                <MenuItem value="" disabled>
                  Select a project...
                </MenuItem>
                {projectsData?.items?.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({p.projectCode})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                required
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                id="category"
                name="category"
                label="Expense Category"
                required
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {Object.entries(ExpenseCategoryLabels).map(([v, l]) => (
                  <MenuItem key={v} value={v}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Amount */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="amount"
                name="amount"
                label="Amount"
                type="number"
                required
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && Boolean(formik.errors.amount)}
                helperText={formik.touched.amount && formik.errors.amount}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  },
                }}
              />
            </Grid>

            {/* Expense Date */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="expenseDate"
                name="expenseDate"
                label="Expense Date"
                type="date"
                required
                value={formik.values.expenseDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                slotProps={{ inputLabel: { shrink: true } }}
                error={formik.touched.expenseDate && Boolean(formik.errors.expenseDate)}
                helperText={formik.touched.expenseDate && formik.errors.expenseDate}
              />
            </Grid>

            {/* Vendor Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="vendorName"
                name="vendorName"
                label="Vendor / Supplier Name"
                value={formik.values.vendorName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            {/* Invoice Number */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="invoiceNumber"
                name="invoiceNumber"
                label="Invoice / Bill Number"
                value={formik.values.invoiceNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>

            {/* Receipt URL */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                id="receiptUrl"
                name="receiptUrl"
                label="Receipt / Doc URL"
                value={formik.values.receiptUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="https://..."
                error={formik.touched.receiptUrl && Boolean(formik.errors.receiptUrl)}
                helperText={formik.touched.receiptUrl && formik.errors.receiptUrl}
              />
            </Grid>

            {/* Notes */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                id="notes"
                name="notes"
                label="Additional Notes / Details"
                multiline
                rows={2}
                value={formik.values.notes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3, backgroundColor: '#fafafa' }}>
          <Button onClick={handleCloseForm} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            disabled={creating || updating || formik.isSubmitting}
            sx={{ px: 3, fontWeight: 600 }}
          >
            {selected ? 'Update Expense' : 'Save Expense'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Expense Record"
        message={`Are you sure you want to delete the expense "${selected?.description}" ($${selected?.amount.toLocaleString()})? This action cannot be undone.`}
        confirmText="Delete Expense"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </Box>
  );
}
