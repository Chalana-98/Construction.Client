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
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { useGetProjectsQuery } from '@/features/projects/api';
import { useGetCostCodesByProjectQuery } from '@/features/cost-control/api';
import {
  useGetWbsTreeByProjectQuery,
  useGetFlatWbsByProjectQuery,
  useCreateWbsNodeMutation,
  useUpdateWbsProgressMutation,
  useDeleteWbsNodeMutation,
} from './api';
import { WbsStatus, WbsStatusLabels, type WbsNodeDto } from '@/types';

export default function WbsPage() {
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 50 });
  const projects = projectsData?.items ?? [];

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');

  const { data: treeNodes = [], isLoading: treeLoading } = useGetWbsTreeByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: flatNodes = [] } = useGetFlatWbsByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: costCodes = [] } = useGetCostCodesByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const [createWbsNode, { isLoading: isCreating }] = useCreateWbsNodeMutation();
  const [updateWbsProgress] = useUpdateWbsProgressMutation();
  const [deleteWbsNode] = useDeleteWbsNodeMutation();

  const [openModal, setOpenModal] = useState(false);
  const [wbsCode, setWbsCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentWbsId, setParentWbsId] = useState<string>('');
  const [costCodeId, setCostCodeId] = useState<string>('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<WbsStatus>(WbsStatus.Planned);

  const handleCreate = async () => {
    if (!activeProjectId || !wbsCode || !name) return;
    await createWbsNode({
      projectId: activeProjectId,
      wbsCode,
      name,
      description,
      parentWbsId: parentWbsId || undefined,
      costCodeId: costCodeId || undefined,
      budget: Number(budget) || 0,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      status,
    }).unwrap();

    setOpenModal(false);
    setWbsCode('');
    setName('');
    setDescription('');
    setParentWbsId('');
    setCostCodeId('');
    setBudget('');
  };

  const handleProgressChange = async (id: string, newPct: number) => {
    await updateWbsProgress({ id, progressPercentage: newPct }).unwrap();
  };

  const renderTreeRows = (nodes: WbsNodeDto[], depth = 0): React.ReactNode[] => {
    let rows: React.ReactNode[] = [];
    for (const node of nodes) {
      rows.push(
        <TableRow key={node.id} hover>
          <TableCell sx={{ pl: depth > 0 ? depth * 4 : 2, fontWeight: depth === 0 ? 700 : 500 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {depth > 0 && <SubdirectoryArrowRightIcon color="action" fontSize="small" />}
              <Chip label={node.wbsCode} size="small" variant={depth === 0 ? 'filled' : 'outlined'} color={depth === 0 ? 'primary' : 'default'} />
              <Typography variant="body2" fontWeight={depth === 0 ? 700 : 500}>
                {node.name}
              </Typography>
            </Box>
          </TableCell>
          <TableCell>
            <Chip
              label={WbsStatusLabels[node.status] ?? node.statusName}
              size="small"
              color={node.status === WbsStatus.Completed ? 'success' : node.status === WbsStatus.InProgress ? 'info' : 'default'}
            />
          </TableCell>
          <TableCell>{node.costCodeName || '—'}</TableCell>
          <TableCell align="right" sx={{ fontWeight: 600 }}>
            ${(node.budget || node.rolledUpBudget).toLocaleString()}
          </TableCell>
          <TableCell sx={{ minWidth: 180 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={node.progressPercentage}
                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                color={node.progressPercentage >= 100 ? 'success' : 'primary'}
              />
              <Typography variant="caption" fontWeight={700}>
                {node.progressPercentage}%
              </Typography>
              {node.progressPercentage < 100 && (
                <Button
                  size="small"
                  variant="text"
                  sx={{ minWidth: 28, p: 0.2, fontSize: 10 }}
                  onClick={() => handleProgressChange(node.id, Math.min(100, node.progressPercentage + 25))}
                >
                  +25%
                </Button>
              )}
            </Box>
          </TableCell>
          <TableCell>
            <Typography variant="caption" color="text.secondary">
              {node.startDate ? new Date(node.startDate).toLocaleDateString() : '—'} →{' '}
              {node.endDate ? new Date(node.endDate).toLocaleDateString() : '—'}
            </Typography>
          </TableCell>
          <TableCell align="right">
            <Tooltip title="Delete WBS Node">
              <IconButton size="small" color="error" onClick={() => deleteWbsNode(node.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      );

      if (node.children && node.children.length > 0) {
        rows = rows.concat(renderTreeRows(node.children, depth + 1));
      }
    }
    return rows;
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Work Breakdown Structure (WBS)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hierarchical breakdown of construction activities, deliverables, and progress rollups.
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
            Add WBS Node
          </Button>
        </Box>
      </Box>

      {treeLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : !activeProjectId ? (
        <Alert severity="info">Please select a project to view WBS hierarchy.</Alert>
      ) : (
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>WBS Hierarchy / Activity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Cost Code</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Budget (Rolled Up)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Progress</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Planned Dates</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {treeNodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      No WBS structure created yet. Click <b>Add WBS Node</b> to create your project hierarchy.
                    </TableCell>
                  </TableRow>
                ) : (
                  renderTreeRows(treeNodes)
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Add WBS Node Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Work Breakdown Structure (WBS) Node</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="WBS Code (e.g. 1.1, 1.1.2)"
            value={wbsCode}
            onChange={(e) => setWbsCode(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Activity / Node Name (e.g. Foundation Concrete)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>Parent WBS Node (Optional)</InputLabel>
            <Select
              value={parentWbsId}
              label="Parent WBS Node (Optional)"
              onChange={(e) => setParentWbsId(e.target.value)}
            >
              <MenuItem value="">None (Top Level Root)</MenuItem>
              {flatNodes.map((n) => (
                <MenuItem key={n.id} value={n.id}>
                  {n.wbsCode} - {n.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Linked Cost Code (Optional)</InputLabel>
            <Select
              value={costCodeId}
              label="Linked Cost Code (Optional)"
              onChange={(e) => setCostCodeId(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {costCodes.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Allocated Budget ($)"
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Initial Status</InputLabel>
              <Select
                value={status}
                label="Initial Status"
                onChange={(e) => setStatus(Number(e.target.value) as WbsStatus)}
              >
                <MenuItem value={WbsStatus.Planned}>Planned</MenuItem>
                <MenuItem value={WbsStatus.InProgress}>In Progress</MenuItem>
                <MenuItem value={WbsStatus.Completed}>Completed</MenuItem>
                <MenuItem value={WbsStatus.OnHold}>On Hold</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Planned Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Planned End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>

          <TextField
            label="Scope / Work Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isCreating || !wbsCode || !name}>
            {isCreating ? 'Saving...' : 'Save WBS Node'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
