import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaidIcon from '@mui/icons-material/Paid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetProjectsQuery } from '@/features/projects/api';
import {
  useGetBillingApplicationsByProjectQuery,
  useCreateBillingApplicationMutation,
  useSubmitBillingApplicationMutation,
  useApproveBillingApplicationMutation,
  useRecordPaymentMutation,
  useDeleteBillingApplicationMutation,
} from './api';
import {
  BillingApplicationStatus,
  BillingApplicationStatusLabels,
  type ProjectBillingApplicationDto,
} from '@/types';

export default function ProjectBillingPage() {
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 50 });
  const projects = projectsData?.items ?? [];

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');

  const { data: applications = [], isLoading } = useGetBillingApplicationsByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const [createApplication, { isLoading: isCreating }] = useCreateBillingApplicationMutation();
  const [submitApplication] = useSubmitBillingApplicationMutation();
  const [approveApplication] = useApproveBillingApplicationMutation();
  const [recordPayment, { isLoading: isPaying }] = useRecordPaymentMutation();
  const [deleteApplication] = useDeleteBillingApplicationMutation();

  const [openModal, setOpenModal] = useState(false);
  const [periodStart, setPeriodStart] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [periodEnd, setPeriodEnd] = useState(new Date().toISOString().split('T')[0]);
  const [currentBillingAmount, setCurrentBillingAmount] = useState('');
  const [retentionPercentage, setRetentionPercentage] = useState('10');
  const [taxRate, setTaxRate] = useState('0');
  const [notes, setNotes] = useState('');

  // Payment dialog state
  const [paymentModalApp, setPaymentModalApp] = useState<ProjectBillingApplicationDto | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Wire');
  const [refNumber, setRefNumber] = useState('');

  // Approve dialog state
  const [approveModalApp, setApproveModalApp] = useState<ProjectBillingApplicationDto | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-5)}`);

  const handleCreate = async () => {
    if (!activeProjectId || !currentBillingAmount) return;
    await createApplication({
      projectId: activeProjectId,
      billingPeriodStart: periodStart,
      billingPeriodEnd: periodEnd,
      currentBillingAmount: Number(currentBillingAmount),
      retentionPercentage: Number(retentionPercentage) || 0,
      taxRate: Number(taxRate) || 0,
      notes,
    }).unwrap();

    setOpenModal(false);
    setCurrentBillingAmount('');
    setNotes('');
  };

  const handleApproveSubmit = async () => {
    if (!approveModalApp || !invoiceNumber) return;
    await approveApplication({ id: approveModalApp.id, invoiceNumber }).unwrap();
    setApproveModalApp(null);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentModalApp || !paymentAmount) return;
    await recordPayment({
      id: paymentModalApp.id,
      data: {
        amount: Number(paymentAmount),
        paymentDate: new Date().toISOString(),
        paymentMethod,
        referenceNumber: refNumber || `WIRE-${Date.now().toString().slice(-6)}`,
      },
    }).unwrap();

    setPaymentModalApp(null);
    setPaymentAmount('');
    setRefNumber('');
  };

  // Compute stats
  const totalBilled = applications.reduce((acc, a) => acc + a.totalInvoiceAmount, 0);
  const totalCollected = applications.reduce((acc, a) => acc + a.amountPaid, 0);
  const totalOutstanding = applications.reduce((acc, a) => acc + a.outstandingAmount, 0);
  const totalRetained = applications.reduce((acc, a) => acc + a.retentionAmount, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Project Progress Billing & Payment Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Progress payment applications (AIA G702/G703 style), retention withholding, client invoicing, and payment receipts.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Project</InputLabel>
            <Select
              value={activeProjectId}
              label="Select Project"
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name} ({p.projectCode})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            disabled={!activeProjectId}
          >
            New Payment Application
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : !activeProjectId ? (
        <Alert severity="info">Please select a project to view billing applications.</Alert>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    TOTAL INVOICED TO CLIENT
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    ${totalBilled.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'success.50', borderLeft: 4, borderColor: 'success.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    TOTAL PAID BY CLIENT
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="success.dark">
                    ${totalCollected.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'error.50', borderLeft: 4, borderColor: 'error.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    OUTSTANDING BALANCE
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="error.main">
                    ${totalOutstanding.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    RETENTION WITHHELD
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="warning.dark">
                    ${totalRetained.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Applications Table */}
          <Card>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>App #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Period</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Gross Completed</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Retention (10%)</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Total Invoiced</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Amount Paid</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Balance Due</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                        No billing applications submitted yet. Click <b>New Payment Application</b> to create Application #1.
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app) => (
                      <TableRow key={app.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{app.applicationNumber}</TableCell>
                        <TableCell>
                          {new Date(app.billingPeriodStart).toLocaleDateString()} →{' '}
                          {new Date(app.billingPeriodEnd).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={BillingApplicationStatusLabels[app.status] ?? app.statusName}
                            size="small"
                            color={
                              app.status === BillingApplicationStatus.Paid
                                ? 'success'
                                : app.status === BillingApplicationStatus.Invoiced ||
                                  app.status === BillingApplicationStatus.Approved
                                ? 'primary'
                                : app.status === BillingApplicationStatus.Submitted
                                ? 'info'
                                : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">${app.currentBillingAmount.toLocaleString()}</TableCell>
                        <TableCell align="right" sx={{ color: 'warning.dark' }}>
                          -${app.retentionAmount.toLocaleString()}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          ${app.totalInvoiceAmount.toLocaleString()}
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>
                          ${app.amountPaid.toLocaleString()}
                        </TableCell>
                        <TableCell align="right" sx={{ color: app.outstandingAmount > 0 ? 'error.main' : 'text.secondary', fontWeight: 700 }}>
                          ${app.outstandingAmount.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {app.status === BillingApplicationStatus.Draft && (
                            <Tooltip title="Submit for Review">
                              <IconButton size="small" color="primary" onClick={() => submitApplication(app.id)}>
                                <SendIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {(app.status === BillingApplicationStatus.Submitted ||
                            app.status === BillingApplicationStatus.UnderReview) && (
                            <Tooltip title="Approve & Generate Invoice">
                              <IconButton size="small" color="success" onClick={() => setApproveModalApp(app)}>
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {(app.status === BillingApplicationStatus.Invoiced ||
                            app.status === BillingApplicationStatus.PartiallyPaid ||
                            app.status === BillingApplicationStatus.Approved) && (
                            <Tooltip title="Record Client Payment">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => {
                                  setPaymentModalApp(app);
                                  setPaymentAmount(String(app.outstandingAmount));
                                }}
                              >
                                <PaidIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => deleteApplication(app.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}

      {/* New Payment Application Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Progress Payment Application</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Billing Period Start"
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Billing Period End"
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Box>

          <TextField
            label="Gross Completed Work Amount ($)"
            type="number"
            value={currentBillingAmount}
            onChange={(e) => setCurrentBillingAmount(e.target.value)}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Retention Withheld (%)"
              type="number"
              value={retentionPercentage}
              onChange={(e) => setRetentionPercentage(e.target.value)}
              fullWidth
            />
            <TextField
              label="Tax Rate (%)"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label="Application Notes / Payment Instructions"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isCreating || !currentBillingAmount}>
            {isCreating ? 'Creating...' : 'Create Application'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={Boolean(approveModalApp)} onClose={() => setApproveModalApp(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Approve & Generate Invoice</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveModalApp(null)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleApproveSubmit}>
            Confirm Approval
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Payment Modal */}
      <Dialog open={Boolean(paymentModalApp)} onClose={() => setPaymentModalApp(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Record Client Payment</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Payment Amount ($)"
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select value={paymentMethod} label="Payment Method" onChange={(e) => setPaymentMethod(e.target.value)}>
              <MenuItem value="Bank Wire">Bank Wire</MenuItem>
              <MenuItem value="Check">Check</MenuItem>
              <MenuItem value="ACH">ACH Transfer</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Transaction / Check Ref #"
            value={refNumber}
            onChange={(e) => setRefNumber(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentModalApp(null)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handlePaymentSubmit} disabled={isPaying || !paymentAmount}>
            {isPaying ? 'Saving...' : 'Record Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
