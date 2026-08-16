import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, MenuItem, Typography, Pagination, Chip, IconButton, Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaidIcon from '@mui/icons-material/Paid';
import { useGetExpensesQuery, useApproveExpenseMutation, useMarkExpensePaidMutation } from '@/features/expenses/api';
import { ExpenseCategory, ExpenseCategoryLabels } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useSnackbar } from 'notistack';

export default function ExpensesPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const { data, isLoading, error, refetch } = useGetExpensesQuery({
    page, pageSize: 15,
    category: category === '' ? undefined : category,
  });
  const [approve] = useApproveExpenseMutation();
  const [markPaid] = useMarkExpensePaidMutation();
  const { enqueueSnackbar } = useSnackbar();

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const handleApprove = async (id: string) => {
    try { await approve(id).unwrap(); enqueueSnackbar('Expense approved', { variant: 'success' }); }
    catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };
  const handlePaid = async (id: string) => {
    try { await markPaid(id).unwrap(); enqueueSnackbar('Marked as paid', { variant: 'success' }); }
    catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader title="Expenses" />
      {(hasItems || category) && (
        <Box display="flex" gap={2} mb={3}>
          <TextField size="small" select label="Category" value={category}
            onChange={(e) => { setCategory(e.target.value as ExpenseCategory | ''); setPage(1); }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            {Object.entries(ExpenseCategoryLabels).map(([v, l]) => (
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
                    <TableCell><Typography fontWeight={500}>{exp.description}</Typography></TableCell>
                    <TableCell>{exp.projectName}</TableCell>
                    <TableCell><Chip label={exp.categoryName} size="small" /></TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={600}>${exp.amount.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell>{new Date(exp.expenseDate).toLocaleDateString()}</TableCell>
                    <TableCell>{exp.vendorName ?? '—'}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <Chip label={exp.isApproved ? 'Approved' : 'Pending'} size="small"
                          color={exp.isApproved ? 'success' : 'warning'} variant="outlined" />
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
                          <IconButton size="small" color="primary" onClick={() => handlePaid(exp.id)}>
                            <PaidIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
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
            icon={<ReceiptLongIcon />}
            title="No expenses recorded yet!"
            description="Track invoices, material purchases, and subcontractor disbursements."
          />
        </Card>
      )}
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}
    </Box>
  );
}
