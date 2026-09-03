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
  Grid,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetFlatWbsByProjectQuery } from '@/features/wbs/api';
import {
  useGetProjectProgressSummaryQuery,
  useLogProgressMutation,
  useDeleteProgressMutation,
} from './api';

export default function PhysicalProgressPage() {
  const { enqueueSnackbar } = useSnackbar();

  const { activeProjectId, projects, selectProject } = useActiveProject();

  const { data: summary, isLoading } = useGetProjectProgressSummaryQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: wbsNodes = [] } = useGetFlatWbsByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const [logProgress, { isLoading: isLogging }] = useLogProgressMutation();
  const [deleteProgress] = useDeleteProgressMutation();

  const [openModal, setOpenModal] = useState(false);
  const [wbsId, setWbsId] = useState('');
  const [activityName, setActivityName] = useState('');
  const [plannedQty, setPlannedQty] = useState('');
  const [completedQty, setCompletedQty] = useState('');
  const [unit, setUnit] = useState('m3');
  const [plannedStartDate, setPlannedStartDate] = useState('');
  const [plannedEndDate, setPlannedEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleWbsSelect = (nodeId: string) => {
    setWbsId(nodeId);
    const node = wbsNodes.find((w) => w.id === nodeId);
    if (node) {
      setActivityName(node.name);
    }
  };

  const handleCreate = async () => {
    try {
      if (!activeProjectId || !activityName || !plannedQty) return;
      await logProgress({
        projectId: activeProjectId,
        wbsId: wbsId || undefined,
        activityName,
        plannedQuantity: Number(plannedQty),
        completedQuantity: Number(completedQty) || 0,
        unit,
        plannedStartDate: plannedStartDate || undefined,
        plannedEndDate: plannedEndDate || undefined,
        notes,
      }).unwrap();

      setOpenModal(false);
      setWbsId('');
      setActivityName('');
      setPlannedQty('');
      setCompletedQty('');
      setNotes('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Physical Progress Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quantity-based actual work progress tracking (m3, tons, sqm, linear feet).
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
            Log Activity Progress
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : !activeProjectId ? (
        <Alert severity="info">Please select a project to view physical progress tracking.</Alert>
      ) : (
        <>
          {/* Progress KPI Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    OVERALL PHYSICAL PROGRESS
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {summary?.overallPhysicalProgress ?? 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'success.50', borderLeft: 4, borderColor: 'success.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    FINANCIAL PROGRESS (SPENT)
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="success.dark">
                    {summary?.overallFinancialProgress ?? 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'info.50', borderLeft: 4, borderColor: 'info.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    COMPLETED ACTIVITIES
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="info.main">
                    {summary?.completedActivities ?? 0} / {summary?.totalActivities ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    ACTIVITIES IN PROGRESS
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="warning.dark">
                    {summary?.inProgressActivities ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Activities Table */}
          <Card>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Construction Activity</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>WBS Code</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Planned Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Completed Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Remaining Qty</TableCell>
                    <TableCell sx={{ minWidth: 160, fontWeight: 700 }}>Progress</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Timeline</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(summary?.records ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        No physical progress records logged yet. Click <b>Log Activity Progress</b> to record quantities.
                      </TableCell>
                    </TableRow>
                  ) : (
                    summary?.records.map((r) => (
                      <TableRow key={r.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {r.activityName}
                          </Typography>
                          {r.notes && (
                            <Typography variant="caption" color="text.secondary">
                              {r.notes}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {r.wbsName ? <Chip label={r.wbsName} size="small" variant="outlined" /> : '—'}
                        </TableCell>
                        <TableCell align="right">
                          {r.plannedQuantity.toLocaleString()} {r.unit}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                          {r.completedQuantity.toLocaleString()} {r.unit}
                        </TableCell>
                        <TableCell align="right">
                          {r.remainingQuantity.toLocaleString()} {r.unit}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={r.progressPercentage}
                              color={r.progressPercentage >= 100 ? 'success' : 'primary'}
                              sx={{ flexGrow: 1, height: 7, borderRadius: 3.5 }}
                            />
                            <Typography variant="caption" fontWeight={700}>
                              {r.progressPercentage}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {r.plannedStartDate ? new Date(r.plannedStartDate).toLocaleDateString() : '—'} →{' '}
                            {r.plannedEndDate ? new Date(r.plannedEndDate).toLocaleDateString() : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => deleteProgress(r.id)}>
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

      {/* Log Activity Progress Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log Physical Activity Progress</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>WBS Activity (Optional)</InputLabel>
            <Select value={wbsId} label="WBS Activity (Optional)" onChange={(e) => handleWbsSelect(e.target.value)}>
              <MenuItem value="">Custom activity</MenuItem>
              {wbsNodes.map((w) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.wbsCode} - {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Activity Name (e.g. 2nd Floor Column Concreting)"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            fullWidth
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Planned Quantity"
              type="number"
              value={plannedQty}
              onChange={(e) => setPlannedQty(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Completed Quantity"
              type="number"
              value={completedQty}
              onChange={(e) => setCompletedQty(e.target.value)}
              fullWidth
            />
            <TextField
              label="Unit (m3, tons, sqm)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              sx={{ width: 140 }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Planned Start Date"
              type="date"
              value={plannedStartDate}
              onChange={(e) => setPlannedStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Planned End Date"
              type="date"
              value={plannedEndDate}
              onChange={(e) => setPlannedEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>

          <TextField
            label="Notes / Location specifics"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isLogging || !activityName || !plannedQty}>
            {isLogging ? 'Saving...' : 'Save Progress Record'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
