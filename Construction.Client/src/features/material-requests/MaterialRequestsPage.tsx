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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OutputIcon from '@mui/icons-material/Output';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useGetProjectsQuery } from '@/features/projects/api';
import { useGetMaterialsQuery } from '@/features/materials/api';
import { useGetFlatWbsByProjectQuery } from '@/features/wbs/api';
import { useGetCostCodesByProjectQuery } from '@/features/cost-control/api';
import {
  useGetMaterialRequestsByProjectQuery,
  useCreateMaterialRequestMutation,
  useSubmitMaterialRequestMutation,
  useApproveMaterialRequestMutation,
  useIssueMaterialRequestMutation,
  useDeleteMaterialRequestMutation,
} from './api';
import { MaterialRequestStatus, MaterialRequestStatusLabels, type MaterialRequestDto } from '@/types';

export default function MaterialRequestsPage() {
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 50 });
  const projects = projectsData?.items ?? [];

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');

  const { data: requests = [], isLoading } = useGetMaterialRequestsByProjectQuery(activeProjectId, {
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

  const [createMR, { isLoading: isCreating }] = useCreateMaterialRequestMutation();
  const [submitMR] = useSubmitMaterialRequestMutation();
  const [approveMR] = useApproveMaterialRequestMutation();
  const [issueMR, { isLoading: isIssuing }] = useIssueMaterialRequestMutation();
  const [deleteMR] = useDeleteMaterialRequestMutation();

  const [openModal, setOpenModal] = useState(false);
  const [wbsId, setWbsId] = useState('');
  const [costCodeId, setCostCodeId] = useState('');
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState('Normal');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<{ materialId: string; requestedQuantity: number; unit: string; notes?: string }[]>([
    { materialId: '', requestedQuantity: 1, unit: 'pcs' },
  ]);

  // Issue modal
  const [issueModalMR, setIssueModalMR] = useState<MaterialRequestDto | null>(null);
  const [issuedQuantities, setIssuedQuantities] = useState<Record<string, number>>({});

  const handleAddItemRow = () => {
    setItems([...items, { materialId: '', requestedQuantity: 1, unit: 'pcs' }]);
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
        updated[index].unit = selectedMat.unit;
      }
    }
    setItems(updated);
  };

  const handleCreate = async () => {
    const validItems = items.filter((i) => i.materialId);
    if (!activeProjectId || validItems.length === 0) return;

    await createMR({
      projectId: activeProjectId,
      wbsId: wbsId || undefined,
      costCodeId: costCodeId || undefined,
      requiredDate,
      priority,
      reason,
      notes,
      items: validItems,
    }).unwrap();

    setOpenModal(false);
    setWbsId('');
    setCostCodeId('');
    setReason('');
    setNotes('');
    setItems([{ materialId: '', requestedQuantity: 1, unit: 'pcs' }]);
  };

  const openIssueDialog = (mr: MaterialRequestDto) => {
    setIssueModalMR(mr);
    const initialQty: Record<string, number> = {};
    mr.items.forEach((item) => {
      initialQty[item.id] = Math.max(0, item.requestedQuantity - item.issuedQuantity);
    });
    setIssuedQuantities(initialQty);
  };

  const handleConfirmIssue = async () => {
    if (!issueModalMR) return;
    const issuePayload = Object.entries(issuedQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => ({
        materialRequestItemId: itemId,
        quantityIssued: qty,
      }));

    if (issuePayload.length === 0) return;

    await issueMR({
      id: issueModalMR.id,
      issuedItems: issuePayload,
    }).unwrap();

    setIssueModalMR(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Site Material Requests
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Field site material requisition, approval, and warehouse inventory dispatching.
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
            New Material Request
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : !activeProjectId ? (
        <Alert severity="info">Please select a project to view material requests.</Alert>
      ) : (
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Request #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>WBS & Cost Code</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Requested By</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Items Count</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Required Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      No material requests created yet. Click <b>New Material Request</b> to request materials for site work.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((mr) => (
                    <TableRow key={mr.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{mr.requestNumber}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{mr.wbsName || '—'}</Typography>
                        <Typography variant="caption" color="text.secondary">{mr.costCodeName || ''}</Typography>
                      </TableCell>
                      <TableCell>{mr.requestedByName || 'Supervisor'}</TableCell>
                      <TableCell>
                        <Chip
                          label={mr.priority}
                          size="small"
                          color={mr.priority === 'Urgent' ? 'error' : mr.priority === 'High' ? 'warning' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={MaterialRequestStatusLabels[mr.status] ?? mr.statusName}
                          size="small"
                          color={
                            mr.status === MaterialRequestStatus.Issued
                              ? 'success'
                              : mr.status === MaterialRequestStatus.Approved
                              ? 'info'
                              : mr.status === MaterialRequestStatus.Submitted
                              ? 'warning'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>{mr.items.length} materials</TableCell>
                      <TableCell>{new Date(mr.requiredDate).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        {mr.status === MaterialRequestStatus.Draft && (
                          <Tooltip title="Submit Request">
                            <IconButton size="small" color="primary" onClick={() => submitMR(mr.id)}>
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {mr.status === MaterialRequestStatus.Submitted && (
                          <Tooltip title="Approve Request">
                            <IconButton size="small" color="success" onClick={() => approveMR(mr.id)}>
                              <CheckCircleIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {mr.status === MaterialRequestStatus.Approved && (
                          <Tooltip title="Issue Materials from Stock (Deducts Inventory & Adds Actual Cost)">
                            <IconButton size="small" color="secondary" onClick={() => openIssueDialog(mr)}>
                              <OutputIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => deleteMR(mr.id)}>
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

      {/* Create Material Request Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>New Site Material Request</DialogTitle>
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
            <TextField
              label="Required Date"
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

          <TextField
            label="Reason / Work Context"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
          />

          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Materials Requested
            </Typography>
            <Button size="small" startIcon={<AddIcon />} onClick={handleAddItemRow}>
              Add Material
            </Button>
          </Box>

          {items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <FormControl sx={{ flexGrow: 2 }} size="small" required>
                <InputLabel>Select Material</InputLabel>
                <Select
                  value={item.materialId}
                  label="Select Material"
                  onChange={(e) => handleItemChange(idx, 'materialId', e.target.value)}
                >
                  {materials.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.name} ({m.materialCode}) — In Stock: {m.quantityInStock} {m.unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Requested Qty"
                type="number"
                value={item.requestedQuantity}
                onChange={(e) => handleItemChange(idx, 'requestedQuantity', Number(e.target.value))}
                sx={{ width: 130 }}
                size="small"
              />

              <TextField
                label="Unit"
                value={item.unit}
                onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                sx={{ width: 90 }}
                size="small"
              />

              <IconButton size="small" color="error" disabled={items.length === 1} onClick={() => handleRemoveItemRow(idx)}>
                <RemoveCircleOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          <TextField
            label="Additional Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isCreating}>
            {isCreating ? 'Saving...' : 'Submit Material Request'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Issue Materials Dialog */}
      <Dialog open={Boolean(issueModalMR)} onClose={() => setIssueModalMR(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Issue Materials for MR {issueModalMR?.requestNumber}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Alert severity="info">
            Issuing materials will deduct quantities from inventory stock and record real-time actual cost against the linked cost code.
          </Alert>

          {issueModalMR?.items.map((item) => (
            <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {item.materialName || 'Material Item'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Requested: {item.requestedQuantity} {item.unit} | Issued so far: {item.issuedQuantity} {item.unit}
                </Typography>
              </Box>
              <TextField
                label="Issue Now"
                type="number"
                size="small"
                sx={{ width: 120 }}
                value={issuedQuantities[item.id] ?? 0}
                onChange={(e) =>
                  setIssuedQuantities({
                    ...issuedQuantities,
                    [item.id]: Number(e.target.value),
                  })
                }
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIssueModalMR(null)}>Cancel</Button>
          <Button variant="contained" color="secondary" onClick={handleConfirmIssue} disabled={isIssuing}>
            {isIssuing ? 'Issuing...' : 'Confirm Stock Dispatch'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
