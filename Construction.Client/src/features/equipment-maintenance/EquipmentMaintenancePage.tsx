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
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetEquipmentQuery } from '@/features/equipment/api';
import {
  useGetMaintenanceSummaryQuery,
  useRecordMaintenanceMutation,
  useDeleteMaintenanceMutation,
} from './api';
import {
  EquipmentMaintenanceType,
  EquipmentMaintenanceStatus,
  type EquipmentDto,
} from '@/types';
import { useCurrency } from '@/utils/currency';

export default function EquipmentMaintenancePage() {
  const { enqueueSnackbar } = useSnackbar();
  const { symbol } = useCurrency();
  const { activeProjectId, projects, selectProject } = useActiveProject();


  const { data: summary, isLoading } = useGetMaintenanceSummaryQuery(activeProjectId || undefined);

  const { data: equipmentData } = useGetEquipmentQuery({ page: 1, pageSize: 100 });
  const equipmentList = equipmentData?.items ?? [];

  const [recordMaintenance, { isLoading: isRecording }] = useRecordMaintenanceMutation();
  const [deleteMaintenance] = useDeleteMaintenanceMutation();

  const [openModal, setOpenModal] = useState(false);
  const [equipmentId, setEquipmentId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [maintenanceType, setMaintenanceType] = useState<EquipmentMaintenanceType>(
    EquipmentMaintenanceType.Preventive
  );
  const [meterReadingHours, setMeterReadingHours] = useState('');
  const [maintenanceCost, setMaintenanceCost] = useState('');
  const [description, setDescription] = useState('');
  const [partsUsed, setPartsUsed] = useState('');
  const [nextServiceDate, setNextServiceDate] = useState('');
  const [nextServiceMeterHours, setNextServiceMeterHours] = useState('');
  const [status, setStatus] = useState<EquipmentMaintenanceStatus>(
    EquipmentMaintenanceStatus.Completed
  );

  const handleCreate = async () => {
    try {
      if (!equipmentId || !description) return;
      await recordMaintenance({
        equipmentId,
        projectId: projectId || activeProjectId || undefined,
        maintenanceType,
        serviceDate: new Date().toISOString(),
        meterReadingHours: Number(meterReadingHours) || 0,
        maintenanceCost: Number(maintenanceCost) || 0,
        description,
        partsUsed,
        nextServiceDate: nextServiceDate || undefined,
        nextServiceMeterHours: Number(nextServiceMeterHours) || undefined,
        status,
      }).unwrap();

      setOpenModal(false);
      setEquipmentId('');
      setDescription('');
      setPartsUsed('');
      setMaintenanceCost('');
      setMeterReadingHours('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const records = summary?.records ?? [];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Equipment Maintenance & Telematics Tracking
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Preventive service intervals, operating meter hour tracking, breakdown repair logs, and cost analytics.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Project</InputLabel>
            <Select
              value={activeProjectId}
              label="Filter by Project"
              onChange={(e) => selectProject(e.target.value)}
            >
              <MenuItem value="">All Projects</MenuItem>
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
          >
            Log Maintenance
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                TOTAL SERVICE LOGS
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                {summary?.totalMaintenanceRecords ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'error.50', borderLeft: 4, borderColor: 'error.main' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                OVERDUE SERVICES
              </Typography>
              <Typography variant="h5" fontWeight={700} color="error.main">
                {summary?.overdueCount ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                DUE / SCHEDULED
              </Typography>
              <Typography variant="h5" fontWeight={700} color="warning.dark">
                {(summary?.dueCount ?? 0) + (summary?.scheduledCount ?? 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'info.50', borderLeft: 4, borderColor: 'info.main' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                TOTAL MAINTENANCE COST
              </Typography>
              <Typography variant="h5" fontWeight={700} color="info.main">
                {symbol} {(summary?.totalMaintenanceCost ?? 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table */}
      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : (
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Equipment</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Service Type</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Meter Hours</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Service Cost</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Service Description / Parts</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Next Due (Date / Meter)</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                      No maintenance records logged yet. Click <b>Log Maintenance</b> to record a service or repair.
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {r.equipmentName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {r.equipmentCode}
                        </Typography>
                      </TableCell>
                      <TableCell>{r.projectName || 'Warehouse / General'}</TableCell>
                      <TableCell>
                        <Chip label={r.maintenanceTypeName} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{r.meterReadingHours} hrs</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {symbol} {r.maintenanceCost.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2">{r.description}</Typography>
                        {r.partsUsed && (
                          <Typography variant="caption" color="text.secondary">
                            Parts: {r.partsUsed}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {r.nextServiceDate ? new Date(r.nextServiceDate).toLocaleDateString() : '—'}{' '}
                          {r.nextServiceMeterHours ? `(${r.nextServiceMeterHours} hrs)` : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={r.statusName}
                          size="small"
                          color={
                            r.isOverdue || r.status === EquipmentMaintenanceStatus.Overdue
                              ? 'error'
                              : r.status === EquipmentMaintenanceStatus.Completed
                              ? 'success'
                              : r.status === EquipmentMaintenanceStatus.InProgress
                              ? 'info'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => deleteMaintenance(r.id)}>
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

      {/* Log Maintenance Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log Equipment Service & Maintenance</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Equipment Asset</InputLabel>
            <Select value={equipmentId} label="Equipment Asset" onChange={(e) => setEquipmentId(e.target.value)}>
              {equipmentList.map((eq: EquipmentDto) => (
                <MenuItem key={eq.id} value={eq.id}>
                  {eq.name} ({eq.equipmentCode})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Associated Project</InputLabel>
              <Select value={projectId} label="Associated Project" onChange={(e) => setProjectId(e.target.value)}>
                <MenuItem value="">Unassigned (HQ / Yard)</MenuItem>
                {projects.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({p.projectCode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Maintenance Type</InputLabel>
              <Select
                value={maintenanceType}
                label="Maintenance Type"
                onChange={(e) => setMaintenanceType(Number(e.target.value) as EquipmentMaintenanceType)}
              >
                <MenuItem value={EquipmentMaintenanceType.Preventive}>Preventive Service</MenuItem>
                <MenuItem value={EquipmentMaintenanceType.Corrective}>Breakdown / Corrective</MenuItem>
                <MenuItem value={EquipmentMaintenanceType.Inspection}>Safety & Fluid Inspection</MenuItem>
                <MenuItem value={EquipmentMaintenanceType.Overhaul}>Major Overhaul</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Maintenance Status</InputLabel>
              <Select
                value={status}
                label="Maintenance Status"
                onChange={(e) => setStatus(Number(e.target.value) as EquipmentMaintenanceStatus)}
              >
                <MenuItem value={EquipmentMaintenanceStatus.Completed}>Completed</MenuItem>
                <MenuItem value={EquipmentMaintenanceStatus.InProgress}>In Progress</MenuItem>
                <MenuItem value={EquipmentMaintenanceStatus.Scheduled}>Scheduled</MenuItem>
                <MenuItem value={EquipmentMaintenanceStatus.Due}>Due</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Operating Meter (Hours)"
              type="number"
              value={meterReadingHours}
              onChange={(e) => setMeterReadingHours(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label={`Maintenance Cost (${symbol})`}
              type="number"
              value={maintenanceCost}
              onChange={(e) => setMaintenanceCost(e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label="Service Work Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Parts & Filters Replaced"
            value={partsUsed}
            onChange={(e) => setPartsUsed(e.target.value)}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Next Due Date"
              type="date"
              value={nextServiceDate}
              onChange={(e) => setNextServiceDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Next Due Meter (Hours)"
              type="number"
              value={nextServiceMeterHours}
              onChange={(e) => setNextServiceMeterHours(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isRecording || !equipmentId || !description}>
            {isRecording ? 'Saving...' : 'Save Service Record'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
