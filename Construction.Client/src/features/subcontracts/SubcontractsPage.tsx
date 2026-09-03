import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { getApiErrorMessage } from '@/utils/useMutationHandler';
import { useActiveProject } from '@/utils/useActiveProject';
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
import PaidIcon from '@mui/icons-material/Paid';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetVendorsQuery } from '@/features/vendors/api';
import { useGetFlatWbsByProjectQuery } from '@/features/wbs/api';
import { useGetCostCodesByProjectQuery } from '@/features/cost-control/api';
import {
  useGetSubcontractsByProjectQuery,
  useCreateSubcontractMutation,
  useRecordSubcontractPaymentMutation,
  useAddSubcontractChangeOrderMutation,
  useDeleteSubcontractMutation,
} from './api';
import { SubcontractStatus, type SubcontractDto } from '@/types';
import { useCurrency } from '@/utils/currency';

export default function SubcontractsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { symbol } = useCurrency();

  const { activeProjectId, projects, selectProject } = useActiveProject();

  const { data: subcontracts = [], isLoading } = useGetSubcontractsByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: vendorsData } = useGetVendorsQuery({ page: 1, pageSize: 100 });
  const vendors = vendorsData?.items ?? [];

  const { data: wbsNodes = [] } = useGetFlatWbsByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: costCodes = [] } = useGetCostCodesByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const [createSubcontract, { isLoading: isCreating }] = useCreateSubcontractMutation();
  const [recordPayment, { isLoading: isPaying }] = useRecordSubcontractPaymentMutation();
  const [addChangeOrder, { isLoading: isAddingCO }] = useAddSubcontractChangeOrderMutation();
  const [deleteSubcontract] = useDeleteSubcontractMutation();

  // Create Subcontract Modal
  const [openModal, setOpenModal] = useState(false);
  const [vendorId, setVendorId] = useState('');
  const [wbsId, setWbsId] = useState('');
  const [costCodeId, setCostCodeId] = useState('');
  const [scopeOfWork, setScopeOfWork] = useState('');
  const [originalContractValue, setOriginalContractValue] = useState('');
  const [retentionPercentage, setRetentionPercentage] = useState('10');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
  );
  const [paymentTerms, setPaymentTerms] = useState('Net 30');

  // Payment Modal
  const [paymentModalSC, setPaymentModalSC] = useState<SubcontractDto | null>(null);
  const [grossAmount, setGrossAmount] = useState('');
  const [retentionDeducted, setRetentionDeducted] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  // Change Order Modal
  const [coModalSC, setCoModalSC] = useState<SubcontractDto | null>(null);
  const [coTitle, setCoTitle] = useState('');
  const [coAmount, setCoAmount] = useState('');
  const [coDays, setCoDays] = useState('0');

  const handleCreate = async () => {
    try {
      if (!activeProjectId || !vendorId || !originalContractValue || !scopeOfWork) return;
      await createSubcontract({
        projectId: activeProjectId,
        vendorId,
        wbsId: wbsId || undefined,
        costCodeId: costCodeId || undefined,
        scopeOfWork,
        originalContractValue: Number(originalContractValue),
        retentionPercentage: Number(retentionPercentage) || 10,
        startDate,
        endDate,
        paymentTerms,
      }).unwrap();

      setOpenModal(false);
      setVendorId('');
      setScopeOfWork('');
      setOriginalContractValue('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const handlePayment = async () => {
    try {
      if (!paymentModalSC || !grossAmount) return;
      await recordPayment({
        id: paymentModalSC.id,
        data: {
          grossAmount: Number(grossAmount),
          retentionDeducted: Number(retentionDeducted) || (Number(grossAmount) * 0.1),
          referenceNumber: paymentRef || `SCPAY-${Date.now().toString().slice(-5)}`,
        },
      }).unwrap();

      setPaymentModalSC(null);
      setGrossAmount('');
      setRetentionDeducted('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const handleAddCO = async () => {
    try {
      if (!coModalSC || !coTitle || !coAmount) return;
      await addChangeOrder({
        id: coModalSC.id,
        data: {
          title: coTitle,
          amount: Number(coAmount),
          scheduleImpactDays: Number(coDays) || 0,
        },
      }).unwrap();

      setCoModalSC(null);
      setCoTitle('');
      setCoAmount('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  // Stats
  const totalRevisedContract = subcontracts.reduce((acc, s) => acc + s.revisedContractValue, 0);
  const totalPaid = subcontracts.reduce((acc, s) => acc + s.amountPaid, 0);
  const totalBalance = subcontracts.reduce((acc, s) => acc + s.remainingBalance, 0);
  const totalRetention = subcontracts.reduce((acc, s) => acc + s.retentionAmount, 0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Subcontract Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage trade subcontracts, change orders, progress certifications, retention withholding, and payments.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select Project</InputLabel>
            <Select
              value={activeProjectId}
              label="Select Project"
              onChange={(e) => selectProject(e.target.value)}
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
            New Subcontract
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : !activeProjectId ? (
        <Alert severity="info">Please select a project to view subcontracts.</Alert>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    COMMITTED SUBCONTRACTS VALUE
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {symbol} {totalRevisedContract.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'success.50', borderLeft: 4, borderColor: 'success.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    ACTUAL CERTIFIED PAID
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="success.dark">
                    {symbol} {totalPaid.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    REMAINING BALANCE TO PAY
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="warning.dark">
                    {symbol} {totalBalance.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'info.50', borderLeft: 4, borderColor: 'info.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    RETENTION WITHHELD
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="info.main">
                    {symbol} {totalRetention.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Subcontracts Table */}
          <Card>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Subcontract #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Subcontractor Vendor</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Scope / Cost Code</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Revised Value</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Certified Paid</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Remaining Balance</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subcontracts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        No subcontracts executed yet. Click <b>New Subcontract</b> to bind trade agreements.
                      </TableCell>
                    </TableRow>
                  ) : (
                    subcontracts.map((sc) => (
                      <TableRow key={sc.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{sc.subcontractNumber}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {sc.vendorName || 'Trade Partner'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">{sc.paymentTerms}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{sc.scopeOfWork}</Typography>
                          <Typography variant="caption" color="text.secondary">{sc.costCodeName || ''}</Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {symbol} {sc.revisedContractValue.toLocaleString()}
                        </TableCell>
                        <TableCell align="right" sx={{ color: 'success.main', fontWeight: 600 }}>
                          {symbol} {sc.amountPaid.toLocaleString()}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                          {symbol} {sc.remainingBalance.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={sc.statusName}
                            size="small"
                            color={sc.status === SubcontractStatus.Active ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Add Change Order">
                            <IconButton size="small" color="primary" onClick={() => setCoModalSC(sc)}>
                              <PostAddIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Certify & Pay Subcontractor">
                            <IconButton size="small" color="success" onClick={() => setPaymentModalSC(sc)}>
                              <PaidIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => deleteSubcontract(sc.id)}>
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

      {/* New Subcontract Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Subcontract Agreement</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Subcontractor Vendor</InputLabel>
            <Select value={vendorId} label="Subcontractor Vendor" onChange={(e) => setVendorId(e.target.value)}>
              {vendors.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Scope of Work (e.g. Electrical Rough-in & Conduit)"
            value={scopeOfWork}
            onChange={(e) => setScopeOfWork(e.target.value)}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Linked Cost Code</InputLabel>
              <Select value={costCodeId} label="Linked Cost Code" onChange={(e) => setCostCodeId(e.target.value)}>
                <MenuItem value="">None</MenuItem>
                {costCodes.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Linked WBS</InputLabel>
              <Select value={wbsId} label="Linked WBS" onChange={(e) => setWbsId(e.target.value)}>
                <MenuItem value="">None</MenuItem>
                {wbsNodes.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.wbsCode} - {w.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label={`Original Contract Value (${symbol})`}
              type="number"
              value={originalContractValue}
              onChange={(e) => setOriginalContractValue(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Retention Withholding (%)"
              type="number"
              value={retentionPercentage}
              onChange={(e) => setRetentionPercentage(e.target.value)}
              sx={{ width: 150 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>

          <TextField
            label="Payment Terms"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isCreating || !vendorId || !originalContractValue}>
            {isCreating ? 'Saving...' : 'Execute Subcontract'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pay Subcontractor Modal */}
      <Dialog open={Boolean(paymentModalSC)} onClose={() => setPaymentModalSC(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Certify & Record Subcontract Payment</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label={`Certified Gross Work Done (${symbol})`}
            type="number"
            value={grossAmount}
            onChange={(e) => setGrossAmount(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label={`Retention Deducted (${symbol})`}
            type="number"
            value={retentionDeducted}
            onChange={(e) => setRetentionDeducted(e.target.value)}
            fullWidth
            helperText="Default is 10% withheld"
          />
          <TextField
            label="Payment / Check Reference #"
            value={paymentRef}
            onChange={(e) => setPaymentRef(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentModalSC(null)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handlePayment} disabled={isPaying || !grossAmount}>
            {isPaying ? 'Saving...' : 'Record Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Change Order Modal */}
      <Dialog open={Boolean(coModalSC)} onClose={() => setCoModalSC(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Subcontractor Change Order</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Change Order Title"
            value={coTitle}
            onChange={(e) => setCoTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label={`Added / Deducted Amount (${symbol})`}
            type="number"
            value={coAmount}
            onChange={(e) => setCoAmount(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Schedule Impact (Days)"
            type="number"
            value={coDays}
            onChange={(e) => setCoDays(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCoModalSC(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCO} disabled={isAddingCO || !coTitle || !coAmount}>
            {isAddingCO ? 'Saving...' : 'Add Change Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
