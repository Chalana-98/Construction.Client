import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tabs,
  Tab,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useGetProjectsQuery } from '@/features/projects/api';
import { useGetMaterialsQuery } from '@/features/materials/api';
import { useGetFlatWbsByProjectQuery } from '@/features/wbs/api';
import { useGetCostCodesByProjectQuery } from '@/features/cost-control/api';
import {
  useGetInventoryTransactionsQuery,
  useGetProjectStockQuery,
  useCreateTransactionMutation,
  useAdjustStockMutation,
} from './api';
import {
  InventoryTransactionType,
  InventoryTransactionTypeLabels,
} from '@/types';

export default function InventoryLedgerPage() {
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 50 });
  const projects = projectsData?.items ?? [];

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');

  const [tab, setTab] = useState(0);

  const { data: transactions = [], isLoading: txLoading } = useGetInventoryTransactionsQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: stockItems = [], isLoading: stockLoading } = useGetProjectStockQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: materialsData } = useGetMaterialsQuery({ page: 1, pageSize: 100 });
  const materials = materialsData?.items ?? [];

  const { data: wbsNodes = [] } = useGetFlatWbsByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: costCodes = [] } = useGetCostCodesByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const [createTx, { isLoading: isCreatingTx }] = useCreateTransactionMutation();
  const [adjustStock, { isLoading: isAdjusting }] = useAdjustStockMutation();

  const [openTxModal, setOpenTxModal] = useState(false);
  const [openAdjustModal, setOpenAdjustModal] = useState(false);

  // Tx state
  const [materialId, setMaterialId] = useState('');
  const [txType, setTxType] = useState<InventoryTransactionType>(InventoryTransactionType.MaterialIssue);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [unitCost, setUnitCost] = useState('');
  const [location, setLocation] = useState('Main Warehouse');
  const [wbsId, setWbsId] = useState('');
  const [costCodeId, setCostCodeId] = useState('');
  const [notes, setNotes] = useState('');

  // Adjust state
  const [adjustMaterialId, setAdjustMaterialId] = useState('');
  const [adjustNewQty, setAdjustNewQty] = useState('');
  const [adjustReason, setAdjustReason] = useState('Physical stock count discrepancy');

  const handleMaterialSelect = (matId: string) => {
    setMaterialId(matId);
    const m = materials.find((mat) => mat.id === matId);
    if (m) {
      setUnit(m.unit);
      setUnitCost(String(m.unitPrice));
    }
  };

  const handleCreateTx = async () => {
    if (!activeProjectId || !materialId || !quantity) return;
    await createTx({
      projectId: activeProjectId,
      materialId,
      transactionType: txType,
      quantity: Number(quantity),
      unit,
      unitCost: Number(unitCost) || undefined,
      location,
      wbsId: wbsId || undefined,
      costCodeId: costCodeId || undefined,
      notes,
    }).unwrap();

    setOpenTxModal(false);
    setMaterialId('');
    setQuantity('');
    setNotes('');
  };

  const handleAdjust = async () => {
    if (!activeProjectId || !adjustMaterialId || adjustNewQty === '') return;
    await adjustStock({
      projectId: activeProjectId,
      materialId: adjustMaterialId,
      newQuantity: Number(adjustNewQty),
      reason: adjustReason,
    }).unwrap();

    setOpenAdjustModal(false);
    setAdjustMaterialId('');
    setAdjustNewQty('');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Project Inventory Ledger
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Stock movements, purchase receipts, site dispatches, and inventory valuation.
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
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={() => setOpenAdjustModal(true)}
            disabled={!activeProjectId}
          >
            Adjust Stock
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenTxModal(true)}
            disabled={!activeProjectId}
          >
            Log Transaction
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 2.5 }}>
        <Tab label={`Stock Balances (${stockItems.length})`} />
        <Tab label={`Transactions Ledger (${transactions.length})`} />
      </Tabs>

      {/* Tab 0: Stock Balances */}
      {tab === 0 && (
        <Card>
          {stockLoading ? (
            <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Material Item</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Quantity on Hand</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Avg Unit Cost</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Total Stock Value</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Stock Alert</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last Activity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        No inventory balances tracked for this project. Log a purchase receipt or opening stock to begin.
                      </TableCell>
                    </TableRow>
                  ) : (
                    stockItems.map((s) => (
                      <TableRow key={s.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {s.materialName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {s.materialCode}
                          </Typography>
                        </TableCell>
                        <TableCell>{s.location}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          {s.quantityOnHand.toLocaleString()} {s.unit}
                        </TableCell>
                        <TableCell align="right">${s.averageUnitCost.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          ${s.totalStockValue.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {s.isLowStock ? (
                            <Chip
                              icon={<WarningAmberIcon />}
                              label="Low Stock"
                              size="small"
                              color="error"
                            />
                          ) : (
                            <Chip label="Optimal" size="small" color="success" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell>
                          {s.lastActivityAt ? new Date(s.lastActivityAt).toLocaleDateString() : '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}

      {/* Tab 1: Transactions Ledger */}
      {tab === 1 && (
        <Card>
          {txLoading ? (
            <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Material</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Quantity</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Total Cost</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Ref / Cost Code</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Logged By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        No transactions recorded in the ledger yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell>{new Date(tx.transactionDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip
                            label={InventoryTransactionTypeLabels[tx.transactionType] ?? tx.transactionTypeName}
                            size="small"
                            color={
                              tx.transactionType === InventoryTransactionType.PurchaseReceipt ||
                              tx.transactionType === InventoryTransactionType.OpeningStock
                                ? 'success'
                                : tx.transactionType === InventoryTransactionType.MaterialIssue
                                ? 'warning'
                                : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{tx.materialName}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity} {tx.unit}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          ${tx.totalCost.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{tx.referenceNumber || '—'}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tx.costCodeName || ''}
                          </Typography>
                        </TableCell>
                        <TableCell>{tx.location}</TableCell>
                        <TableCell>{tx.userName || 'System'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}

      {/* Log Transaction Dialog */}
      <Dialog open={openTxModal} onClose={() => setOpenTxModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log Inventory Transaction</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Material Item</InputLabel>
            <Select
              value={materialId}
              label="Material Item"
              onChange={(e) => handleMaterialSelect(e.target.value)}
            >
              {materials.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name} ({m.materialCode})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Transaction Type</InputLabel>
            <Select
              value={txType}
              label="Transaction Type"
              onChange={(e) => setTxType(Number(e.target.value) as InventoryTransactionType)}
            >
              {Object.entries(InventoryTransactionTypeLabels).map(([val, lbl]) => (
                <MenuItem key={val} value={Number(val)}>
                  {lbl}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              sx={{ width: 120 }}
            />
            <TextField
              label="Unit Cost ($)"
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              sx={{ width: 150 }}
            />
          </Box>

          <TextField
            label="Storage / Site Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>WBS Activity</InputLabel>
              <Select value={wbsId} label="WBS Activity" onChange={(e) => setWbsId(e.target.value)}>
                <MenuItem value="">None</MenuItem>
                {wbsNodes.map((w) => (
                  <MenuItem key={w.id} value={w.id}>
                    {w.wbsCode} - {w.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Cost Code</InputLabel>
              <Select value={costCodeId} label="Cost Code" onChange={(e) => setCostCodeId(e.target.value)}>
                <MenuItem value="">None</MenuItem>
                {costCodes.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Notes / Reason"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTxModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateTx} disabled={isCreatingTx || !materialId || !quantity}>
            {isCreatingTx ? 'Recording...' : 'Record Transaction'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog open={openAdjustModal} onClose={() => setOpenAdjustModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Physical Stock Count Adjustment</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Material Item</InputLabel>
            <Select
              value={adjustMaterialId}
              label="Material Item"
              onChange={(e) => setAdjustMaterialId(e.target.value)}
            >
              {materials.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name} ({m.materialCode})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Actual Physical Count"
            type="number"
            value={adjustNewQty}
            onChange={(e) => setAdjustNewQty(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Reason for Discrepancy"
            value={adjustReason}
            onChange={(e) => setAdjustReason(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdjustModal(false)}>Cancel</Button>
          <Button variant="contained" color="warning" onClick={handleAdjust} disabled={isAdjusting || !adjustMaterialId}>
            {isAdjusting ? 'Adjusting...' : 'Confirm Adjustment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
