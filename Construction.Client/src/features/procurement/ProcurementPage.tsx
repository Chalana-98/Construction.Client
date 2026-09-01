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
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useGetProjectsQuery } from '@/features/projects/api';
import { useGetVendorsQuery } from '@/features/vendors/api';
import { useGetFlatWbsByProjectQuery } from '@/features/wbs/api';
import { useGetCostCodesByProjectQuery } from '@/features/cost-control/api';
import {
  useGetProcurementRequestsByProjectQuery,
  useCreateProcurementRequestMutation,
  useSubmitProcurementRequestMutation,
  useDeleteProcurementRequestMutation,
} from './api';
import { ProcurementStatus, ProcurementStatusLabels } from '@/types';
import { useCurrency } from '@/utils/currency';

export default function ProcurementPage() {
  const { symbol } = useCurrency();
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 50 });
  const projects = projectsData?.items ?? [];

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');

  const { data: requests = [], isLoading } = useGetProcurementRequestsByProjectQuery(activeProjectId, {
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

  const [createRequest, { isLoading: isCreating }] = useCreateProcurementRequestMutation();
  const [submitRequest] = useSubmitProcurementRequestMutation();
  const [deleteRequest] = useDeleteProcurementRequestMutation();

  const [openModal, setOpenModal] = useState(false);
  const [wbsId, setWbsId] = useState('');
  const [costCodeId, setCostCodeId] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<
    { description: string; quantity: number; unit: string; estimatedUnitPrice: number }[]
  >([{ description: '', quantity: 1, unit: 'pcs', estimatedUnitPrice: 0 }]);

  const handleAddItemRow = () => {
    setItems([...items, { description: '', quantity: 1, unit: 'pcs', estimatedUnitPrice: 0 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleCreate = async () => {
    if (!activeProjectId || !requiredDate || items.length === 0) return;
    await createRequest({
      projectId: activeProjectId,
      wbsId: wbsId || undefined,
      costCodeId: costCodeId || undefined,
      vendorId: vendorId || undefined,
      requiredDate,
      priority,
      notes,
      items,
    }).unwrap();

    setOpenModal(false);
    setWbsId('');
    setCostCodeId('');
    setVendorId('');
    setNotes('');
    setItems([{ description: '', quantity: 1, unit: 'pcs', estimatedUnitPrice: 0 }]);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Procurement & Purchase Requisitions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage material & service purchase requisitions, approvals, and budget links.
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
            New Requisition
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : !activeProjectId ? (
        <Alert severity="info">Please select a project to view procurement requests.</Alert>
      ) : (
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>PR #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>WBS & Cost Code</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Supplier / Vendor</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Estimated Total</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Required Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      No procurement requests created yet. Click <b>New Requisition</b> to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{r.requestNumber}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {r.wbsName || '—'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.costCodeName || 'No Cost Code'}
                        </Typography>
                      </TableCell>
                      <TableCell>{r.vendorName || 'Unassigned'}</TableCell>
                      <TableCell>
                        <Chip
                          label={r.priority}
                          size="small"
                          color={r.priority === 'Urgent' ? 'error' : r.priority === 'High' ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ProcurementStatusLabels[r.status] ?? r.statusName}
                          size="small"
                          color={
                            r.status === ProcurementStatus.Approved
                              ? 'success'
                              : r.status === ProcurementStatus.Submitted
                              ? 'info'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {symbol} {r.estimatedTotalCost.toLocaleString()}
                      </TableCell>
                      <TableCell>{new Date(r.requiredDate).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        {r.status === ProcurementStatus.Draft && (
                          <Tooltip title="Submit for Approval">
                            <IconButton size="small" color="primary" onClick={() => submitRequest(r.id)}>
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => deleteRequest(r.id)}>
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

      {/* New Requisition Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Procurement Requisition</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
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

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Assigned Supplier / Vendor</InputLabel>
              <Select value={vendorId} label="Assigned Supplier / Vendor" onChange={(e) => setVendorId(e.target.value)}>
                <MenuItem value="">Unassigned</MenuItem>
                {vendors.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Required By Date"
              type="date"
              value={requiredDate}
              onChange={(e) => setRequiredDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Priority</InputLabel>
              <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value)}>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Materials / Services Line Items
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddItemRow}>
              Add Item Row
            </Button>
          </Box>

          {items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <TextField
                label="Material / Service Description"
                value={item.description}
                onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                sx={{ flexGrow: 2 }}
                size="small"
                required
              />
              <TextField
                label="Qty"
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                sx={{ width: 90 }}
                size="small"
              />
              <TextField
                label="Unit"
                value={item.unit}
                onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                sx={{ width: 80 }}
                size="small"
              />
              <TextField
                label={`Est. Unit Price (${symbol})`}
                type="number"
                value={item.estimatedUnitPrice}
                onChange={(e) => handleItemChange(idx, 'estimatedUnitPrice', Number(e.target.value))}
                sx={{ width: 140 }}
                size="small"
              />
              <IconButton size="small" color="error" disabled={items.length === 1} onClick={() => handleRemoveItemRow(idx)}>
                <RemoveCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <TextField
            label="Additional Notes / Purpose"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isCreating || !requiredDate}>
            {isCreating ? 'Saving...' : 'Save Requisition'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
