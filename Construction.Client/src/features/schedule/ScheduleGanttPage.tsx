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
  Grid,
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
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FlagIcon from '@mui/icons-material/Flag';
import WarningIcon from '@mui/icons-material/Warning';
import LinkIcon from '@mui/icons-material/Link';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetFlatWbsByProjectQuery } from '@/features/wbs/api';
import { useGetCostCodesByProjectQuery } from '@/features/cost-control/api';
import {
  useGetGanttChartDataQuery,
  useCreateActivityMutation,
  useAddDependencyMutation,
  useDeleteActivityMutation,
} from './api';

export default function ScheduleGanttPage() {
  const { enqueueSnackbar } = useSnackbar();

  const { activeProjectId, projects, selectProject } = useActiveProject();

  const { data: gantt, isLoading } = useGetGanttChartDataQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: wbsNodes = [] } = useGetFlatWbsByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: costCodes = [] } = useGetCostCodesByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const [createActivity, { isLoading: isCreating }] = useCreateActivityMutation();
  const [addDependency] = useAddDependencyMutation();
  const [deleteActivity] = useDeleteActivityMutation();

  const [openModal, setOpenModal] = useState(false);
  const [activityCode, setActivityCode] = useState('');
  const [activityName, setActivityName] = useState('');
  const [wbsId, setWbsId] = useState('');
  const [costCodeId, setCostCodeId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [plannedQty, setPlannedQty] = useState('');
  const [unit, setUnit] = useState('');
  const [isMilestone, setIsMilestone] = useState(false);
  const [description, setDescription] = useState('');

  // Dependency dialog
  const [openDepModal, setOpenDepModal] = useState(false);
  const [predecessorId, setPredecessorId] = useState('');
  const [successorId, setSuccessorId] = useState('');

  const handleCreate = async () => {
    try {
      if (!activeProjectId || !activityCode || !activityName) return;
      await createActivity({
        projectId: activeProjectId,
        activityCode,
        activityName,
        wbsId: wbsId || undefined,
        costCodeId: costCodeId || undefined,
        startDate,
        endDate,
        plannedQuantity: Number(plannedQty) || undefined,
        unit: unit || undefined,
        isMilestone,
        description,
      }).unwrap();

      setOpenModal(false);
      setActivityCode('');
      setActivityName('');
      setDescription('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const handleAddDependency = async () => {
    try {
      if (!predecessorId || !successorId || predecessorId === successorId) return;
      await addDependency({ predecessorId, successorId }).unwrap();
      setOpenDepModal(false);
      setPredecessorId('');
      setSuccessorId('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const activities = gantt?.activities ?? [];

  // Compute Gantt timeline range
  let minTime = Infinity;
  let maxTime = -Infinity;
  activities.forEach((a) => {
    const s = new Date(a.startDate).getTime();
    const e = new Date(a.endDate).getTime();
    if (s < minTime) minTime = s;
    if (e > maxTime) maxTime = e;
  });
  if (minTime === Infinity) {
    minTime = Date.now();
    maxTime = Date.now() + 30 * 86400000;
  }
  const totalDuration = Math.max(1, maxTime - minTime);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Project Schedule & Gantt Timeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage construction schedules, dependencies, milestone tracking, and delay alerts.
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
            variant="outlined"
            startIcon={<LinkIcon />}
            onClick={() => setOpenDepModal(true)}
            disabled={!activeProjectId || activities.length < 2}
          >
            Add Dependency
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            disabled={!activeProjectId}
          >
            Add Activity
          </Button>
        </Box>
      </Box>

      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : !activeProjectId ? (
        <Alert severity="info">Please select a project to view schedule timeline.</Alert>
      ) : (
        <>
          {/* Summary KPIs */}
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    TOTAL ACTIVITIES
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {gantt?.totalActivities ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'error.50', borderLeft: 4, borderColor: 'error.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    OVERDUE ACTIVITIES
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="error.main">
                    {gantt?.overdueActivitiesCount ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    DELAYED ACTIVITIES
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="warning.dark">
                    {gantt?.delayedActivitiesCount ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ bgcolor: 'info.50', borderLeft: 4, borderColor: 'info.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    UPCOMING ACTIVITIES
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="info.main">
                    {gantt?.upcomingActivitiesCount ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Interactive Gantt Timeline Card */}
          <Card sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Schedule Timeline
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Start: <b>{new Date(minTime).toLocaleDateString()}</b>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  End: <b>{new Date(maxTime).toLocaleDateString()}</b>
                </Typography>
              </Box>
            </Box>

            {activities.length === 0 ? (
              <Alert severity="info">
                No schedule activities added yet. Click <b>Add Activity</b> to create your construction schedule.
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {activities.map((act) => {
                  const actStart = new Date(act.startDate).getTime();
                  const actEnd = new Date(act.endDate).getTime();
                  const leftPct = Math.max(0, Math.min(100, ((actStart - minTime) / totalDuration) * 100));
                  const widthPct = Math.max(3, Math.min(100 - leftPct, ((actEnd - actStart) / totalDuration) * 100));

                  return (
                    <Paper key={act.id} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider' }} elevation={0}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={act.activityCode} size="small" sx={{ fontWeight: 600 }} />
                          <Typography variant="body2" fontWeight={700}>
                            {act.activityName}
                          </Typography>
                          {act.isMilestone && (
                            <Chip icon={<FlagIcon />} label="Milestone" size="small" color="primary" />
                          )}
                          {act.isOverdue && (
                            <Chip icon={<WarningIcon />} label="Overdue" size="small" color="error" />
                          )}
                          {act.isDelayed && !act.isOverdue && (
                            <Chip icon={<WarningIcon />} label="Delayed" size="small" color="warning" />
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(act.startDate).toLocaleDateString()} → {new Date(act.endDate).toLocaleDateString()} ({act.durationDays}d)
                          </Typography>
                          <Chip label={`${act.progressPercentage}%`} size="small" color={act.progressPercentage >= 100 ? 'success' : 'default'} />
                          <IconButton size="small" color="error" onClick={() => deleteActivity(act.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Gantt Bar */}
                      <Box sx={{ position: 'relative', height: 20, bgcolor: 'grey.100', borderRadius: 2, overflow: 'hidden' }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            left: `${leftPct}%`,
                            width: `${widthPct}%`,
                            height: '100%',
                            bgcolor: act.isOverdue
                              ? 'error.main'
                              : act.isDelayed
                              ? 'warning.main'
                              : act.progressPercentage >= 100
                              ? 'success.main'
                              : 'primary.main',
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            px: 1,
                            color: 'white',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {act.progressPercentage > 0 && `${act.progressPercentage}%`}
                        </Box>
                      </Box>

                      {/* Predecessors / Dependencies */}
                      {act.predecessors && act.predecessors.length > 0 && (
                        <Box sx={{ mt: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Predecessors:
                          </Typography>
                          {act.predecessors.map((p) => (
                            <Chip
                              key={p.id}
                              icon={<LinkIcon />}
                              label={`${p.predecessorActivityCode || 'Act'} (${p.dependencyTypeName})`}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </Paper>
                  );
                })}
              </Box>
            )}
          </Card>
        </>
      )}

      {/* Add Activity Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Schedule Activity</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Activity Code (e.g. ACT-101)"
              value={activityCode}
              onChange={(e) => setActivityCode(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Activity Name"
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              fullWidth
              required
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>WBS Node</InputLabel>
              <Select value={wbsId} label="WBS Node" onChange={(e) => setWbsId(e.target.value)}>
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
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Planned Quantity"
              type="number"
              value={plannedQty}
              onChange={(e) => setPlannedQty(e.target.value)}
              fullWidth
            />
            <TextField
              label="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              sx={{ width: 140 }}
            />
            <Button
              variant={isMilestone ? 'contained' : 'outlined'}
              color={isMilestone ? 'primary' : 'inherit'}
              size="small"
              onClick={() => setIsMilestone(!isMilestone)}
              sx={{ height: 40, whiteSpace: 'nowrap' }}
            >
              {isMilestone ? '★ Milestone' : 'Standard Task'}
            </Button>
          </Box>

          <TextField
            label="Description / Scope"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isCreating || !activityCode || !activityName}>
            {isCreating ? 'Saving...' : 'Add Activity'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dependency Modal */}
      <Dialog open={openDepModal} onClose={() => setOpenDepModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Link Activity Predecessor</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Predecessor Activity (Must Finish First)</InputLabel>
            <Select
              value={predecessorId}
              label="Predecessor Activity (Must Finish First)"
              onChange={(e) => setPredecessorId(e.target.value)}
            >
              {activities.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.activityCode} - {a.activityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Successor Activity (Starts After)</InputLabel>
            <Select
              value={successorId}
              label="Successor Activity (Starts After)"
              onChange={(e) => setSuccessorId(e.target.value)}
            >
              {activities.map((a) => (
                <MenuItem key={a.id} value={a.id} disabled={a.id === predecessorId}>
                  {a.activityCode} - {a.activityName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDepModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddDependency} disabled={!predecessorId || !successorId}>
            Link Dependency
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
