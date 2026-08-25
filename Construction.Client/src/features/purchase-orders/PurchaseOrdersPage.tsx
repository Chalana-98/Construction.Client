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
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useGetProjectsQuery } from '@/features/projects/api';
import { useGetVendorsQuery } from '@/features/vendors/api';
import { useGetMaterialsQuery } from '@/features/materials/api';
import { useGetFlatWbsByProjectQuery } from '@/features/wbs/api';
import { useGetCostCodesByProjectQuery } from '@/features/cost-control/api';
import {
  useGetPurchaseOrdersByProjectQuery,
  useCreatePurchaseOrderMutation,
  useApprovePurchaseOrderMutation,
  useReceivePurchaseOrderGoodsMutation,
  useClosePurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
} from './api';
import { PurchaseOrderStatus, PurchaseOrderStatusLabels, type PurchaseOrderDto } from '@/types';

export default function PurchaseOrdersPage() {
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 50 });
  const projects = projectsData?.items ?? [];

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');

  const { data: pos = [], isLoading } = useGetPurchaseOrdersByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: vendorsData } = useGetVendorsQuery({ page: 1, pageSize: 100 });
  const vendors = vendorsData?.items ?? [];

  const { data: materialsData } = useGetMaterialsQuery({ page: 1, pageSize: 100 });
  const materials = materialsData?.items ?? [];

  const { data: wbsNodes = [] } = useGetFlatWbsByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: costCodes = [] } = useGetCostCodesByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const [createPO, { isLoading: isCreating }] = useCreatePurchaseOrderMutation();
  const [approvePO] = useApprovePurchaseOrderMutation();
  const [receiveGoods, { isLoading: isReceiving }] = useReceivePurchaseOrderGoodsMutation();
  const [closePO] = useClosePurchaseOrderMutation();
  const [deletePO] = useDeletePurchaseOrderMutation();

  const [openModal, setOpenModal] = useState(false);
  const [vendorId, setVendorId] = useState('');
  const [wbsId, setWbsId] = useState('');
  const [costCodeId, setCostCodeId] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Main Job Site Gate 1');
  const [requestedDate, setRequestedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<
    { materialId?: string; description: string; quantity: number; unit: string; unitPrice: number; taxRate: number }[]
  >([{ description: '', quantity: 1, unit: 'pcs', unitPrice: 0, taxRate: 0 }]);

  // Goods receipt dialog state
  const [receiveModalPO, setReceiveModalPO] = useState<PurchaseOrderDto | null>(null);
  const [receivedQuantities, setReceivedQuantities] = useState<Record<string, number>>({});
  const [warehouseLocation, setWarehouseLocation] = useState('Main Warehouse');

  const handleAddItemRow = () => {
    setItems([...items, { description: '', quantity: 1, unit: 'pcs', unitPrice: 0, taxRate: 0 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'materialId' && value) {
      const selectedMat = materials.find((m) => m.id === value);
      if (selectedMat) {
        updated[index].description = selectedMat.name;
        updated[index].unit = selectedMat.unit;
        updated[index].unitPrice = selectedMat.unitPrice;
      }
    }
    setItems(updated);
  };

  const handleCreate = async () => {
    if (!activeProjectId || !vendorId || items.length === 0) return;
    await createPO({
      projectId: activeProjectId,
      vendorId,
      wbsId: wbsId || undefined,
      costCodeId: costCodeId || undefined,
      deliveryLocation,
      requestedDate,
      expectedDeliveryDate: expectedDeliveryDate || undefined,
      paymentTerms,
      notes,
      items,
    }).unwrap();

    setOpenModal(false);
    setVendorId('');
    setWbsId('');
    setCostCodeId('');
    setNotes('');
    setItems([{ description: '', quantity: 1, unit: 'pcs', unitPrice: 0, taxRate: 0 }]);
  };

  const openReceiveDialog = (po: PurchaseOrderDto) => {
    setReceiveModalPO(po);
    const initialQty: Record<string, number> = {};
    po.items.forEach((item) => {
      initialQty[item.id] = Math.max(0, item.quantity - item.receivedQuantity);
    });
    setReceivedQuantities(initialQty);
  };

  const handleConfirmReceive = async () => {
    if (!receiveModalPO) return;
    const receiptItems = Object.entries(receivedQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => ({
        purchaseOrderItemId: itemId,
        receivedQuantity: qty,
        location: warehouseLocation,
      }));

    if (receiptItems.length === 0) return;

    await receiveGoods({
      id: receiveModalPO.id,
      data: {
        location: warehouseLocation,
        items: receiptItems,
      },
    }).unwrap();

    setReceiveModalPO(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Purchase Orders (POs)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Officially authorize supplier procurement, commit project budget, and receive inventory stock.
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
            Create Purchase Order
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : !activeProjectId ? (
        <Alert severity="info">Please select a project to view purchase orders.</Alert>
      ) : (
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>PO #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Vendor / Supplier</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Cost Code / WBS</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Requested Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      No purchase orders issued yet. Click <b>Create Purchase Order</b> to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  pos.map((po) => (
                    <TableRow key={po.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{po.poNumber}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {po.vendorName || 'Vendor'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {po.paymentTerms}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{po.costCodeName || '—'}</Typography>
                        <Typography variant="caption" color="text.secondary">{po.wbsName || ''}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={PurchaseOrderStatusLabels[po.status] ?? po.statusName}
                          size="small"
                          color={
                            po.status === PurchaseOrderStatus.Approved
                              ? 'primary'
                              : po.status === PurchaseOrderStatus.FullyReceived
                              ? 'success'
                              : po.status === PurchaseOrderStatus.PartiallyReceived
                              ? 'warning'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        ${po.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>{new Date(po.requestedDate).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        {po.status === PurchaseOrderStatus.Draft && (
                          <Tooltip title="Approve PO (Commits Budget)">
                            <IconButton size="small" color="success" onClick={() => approvePO(po.id)}>
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {(po.status === PurchaseOrderStatus.Approved ||
                          po.status === PurchaseOrderStatus.PartiallyReceived) && (
                          <Tooltip title="Receive Goods into Inventory">
                            <IconButton size="small" color="primary" onClick={() => openReceiveDialog(po)}>
                              <MoveToInboxIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {po.status !== PurchaseOrderStatus.Closed && (
                          <Tooltip title="Close PO">
                            <IconButton size="small" color="default" onClick={() => closePO(po.id)}>
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => deletePO(po.id)}>
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
      )}

      {/* Create Purchase Order Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Purchase Order</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Supplier / Vendor</InputLabel>
              <Select value={vendorId} label="Supplier / Vendor" onChange={(e) => setVendorId(e.target.value)}>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name}
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

            <TextField
              label="Delivery Location"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Requested Date"
              type="date"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Expected Delivery Date"
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Payment Terms"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
              fullWidth
            />
          </Box>

          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700}>
              PO Line Items
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddItemRow}>
              Add Line Item
            </Button>
          </Box>

          {items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel size="small">Material Master</InputLabel>
                <Select
                  size="small"
                  value={item.materialId || ''}
                  label="Material Master"
                  onChange={(e) => handleItemChange(idx, 'materialId', e.target.value)}
                >
                  <MenuItem value="">Custom item</MenuItem>
                  {materials.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.name} ({m.materialCode})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Description"
                value={item.description}
                onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                sx={{ flexGrow: 1 }}
                size="small"
                required
              />
              <TextField
                label="Qty"
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                sx={{ width: 80 }}
                size="small"
              />
              <TextField
                label="Unit"
                value={item.unit}
                onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                sx={{ width: 75 }}
                size="small"
              />
              <TextField
                label="Unit Price ($)"
                type="number"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                sx={{ width: 110 }}
                size="small"
              />
              <TextField
                label="Tax %"
                type="number"
                value={item.taxRate}
                onChange={(e) => handleItemChange(idx, 'taxRate', Number(e.target.value))}
                sx={{ width: 75 }}
                size="small"
              />
              <IconButton size="small" color="error" disabled={items.length === 1} onClick={() => handleRemoveItemRow(idx)}>
                <RemoveCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <TextField
            label="Additional Notes / Terms"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isCreating || !vendorId}>
            {isCreating ? 'Saving...' : 'Create Purchase Order'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receive Goods Dialog */}
      <Dialog open={Boolean(receiveModalPO)} onClose={() => setReceiveModalPO(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Receive Goods for PO {receiveModalPO?.poNumber}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Receiving Warehouse / Location"
            value={warehouseLocation}
            onChange={(e) => setWarehouseLocation(e.target.value)}
            fullWidth
          />

          <Typography variant="subtitle2" fontWeight={600}>
            Specify Quantities Received:
          </Typography>

          {receiveModalPO?.items.map((item) => {
            const maxReceivable = item.quantity - item.receivedQuantity;
            return (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {item.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ordered: {item.quantity} {item.unit} | Received so far: {item.receivedQuantity} {item.unit}
                  </Typography>
                </Box>
                <TextField
                  label="Receive Now"
                  type="number"
                  size="small"
                  sx={{ width: 120 }}
                  value={receivedQuantities[item.id] ?? 0}
                  onChange={(e) =>
                    setReceivedQuantities({
                      ...receivedQuantities,
                      [item.id]: Math.min(maxReceivable, Number(e.target.value)),
                    })
                  }
                />
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiveModalPO(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmReceive} disabled={isReceiving}>
            {isReceiving ? 'Processing...' : 'Confirm Receipt into Stock'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
