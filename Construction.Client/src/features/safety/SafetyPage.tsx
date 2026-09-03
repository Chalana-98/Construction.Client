import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { getApiErrorMessage } from '@/utils/useMutationHandler';
import { useActiveProject } from '@/utils/useActiveProject';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  useGetSafetyIncidentsQuery,
  useGetSafetyInspectionsQuery,
  useGetToolboxTalksQuery,
  useCreateIncidentMutation,
  useCreateToolboxTalkMutation,
  useDeleteIncidentMutation,
} from './api';
import {
  SafetyIncidentSeverity,
  QualityInspectionResult,
} from '@/types';

export default function SafetyPage() {
  const { enqueueSnackbar } = useSnackbar();

  const { activeProjectId, projects, selectProject } = useActiveProject();

  const [tab, setTab] = useState(0);

  const { data: incidents = [], isLoading: incLoading } = useGetSafetyIncidentsQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: inspections = [], isLoading: inspLoading } = useGetSafetyInspectionsQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: toolboxTalks = [], isLoading: tbLoading } = useGetToolboxTalksQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const [createIncident, { isLoading: isCreatingInc }] = useCreateIncidentMutation();
  const [createToolboxTalk, { isLoading: isCreatingTb }] = useCreateToolboxTalkMutation();
  const [deleteIncident] = useDeleteIncidentMutation();

  // Modal states
  const [openIncModal, setOpenIncModal] = useState(false);
  const [incLocation, setIncLocation] = useState('');
  const [personInvolved, setPersonInvolved] = useState('');
  const [incidentType, setIncidentType] = useState('Near Miss');
  const [severity, setSeverity] = useState<SafetyIncidentSeverity>(SafetyIncidentSeverity.NearMiss);
  const [incDescription, setIncDescription] = useState('');
  const [immediateAction, setImmediateAction] = useState('');
  const [correctiveAction, setCorrectiveAction] = useState('');

  const [openTbModal, setOpenTbModal] = useState(false);
  const [tbTopic, setTbTopic] = useState('');
  const [attendanceCount, setAttendanceCount] = useState('12');
  const [tbNotes, setTbNotes] = useState('');

  const handleCreateIncident = async () => {
    try {
      if (!activeProjectId || !incDescription) return;
      await createIncident({
        projectId: activeProjectId,
        incidentDateTime: new Date().toISOString(),
        location: incLocation || 'Jobsite',
        personInvolved: personInvolved || 'Field Worker',
        incidentType,
        severity,
        description: incDescription,
        immediateAction: immediateAction || 'Area isolated and secured.',
        correctiveAction: correctiveAction || 'Toolbox briefing conducted.',
      }).unwrap();

      setOpenIncModal(false);
      setIncDescription('');
      setImmediateAction('');
      setCorrectiveAction('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const handleCreateToolbox = async () => {
    try {
      if (!activeProjectId || !tbTopic) return;
      await createToolboxTalk({
        projectId: activeProjectId,
        topic: tbTopic,
        date: new Date().toISOString(),
        attendanceCount: Number(attendanceCount) || 1,
        notes: tbNotes,
      }).unwrap();

      setOpenTbModal(false);
      setTbTopic('');
      setTbNotes('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Site Safety Management (HSE)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Incident reports, root-cause corrective actions, safety inspections, and daily toolbox talks.
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

          {tab === 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<WarningAmberIcon />}
              onClick={() => setOpenIncModal(true)}
              disabled={!activeProjectId}
            >
              Report Incident
            </Button>
          )}

          {tab === 2 && (
            <Button
              variant="contained"
              startIcon={<RecordVoiceOverIcon />}
              onClick={() => setOpenTbModal(true)}
              disabled={!activeProjectId}
            >
              Log Toolbox Talk
            </Button>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 2.5 }}>
        <Tab label={`Safety Incidents (${incidents.length})`} />
        <Tab label={`Safety Inspections (${inspections.length})`} />
        <Tab label={`Toolbox Talks (${toolboxTalks.length})`} />
      </Tabs>

      {/* Tab 0: Incidents */}
      {tab === 0 && (
        <Card>
          {incLoading ? (
            <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Incident #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Type / Severity</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Location & Person</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Corrective Action</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incidents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        No safety incidents reported. Clean safety track record!
                      </TableCell>
                    </TableRow>
                  ) : (
                    incidents.map((inc) => (
                      <TableRow key={inc.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{inc.incidentNumber}</TableCell>
                        <TableCell>{new Date(inc.incidentDateTime).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{inc.incidentType}</Typography>
                          <Chip
                            label={inc.severityName}
                            size="small"
                            color={
                              inc.severity >= SafetyIncidentSeverity.Severe
                                ? 'error'
                                : inc.severity === SafetyIncidentSeverity.Moderate
                                ? 'warning'
                                : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{inc.location}</Typography>
                          <Typography variant="caption" color="text.secondary">{inc.personInvolved}</Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>{inc.description}</TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>{inc.correctiveAction}</TableCell>
                        <TableCell>
                          <Chip label={inc.statusName} size="small" color={inc.statusName === 'Resolved' ? 'success' : 'warning'} />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => deleteIncident(inc.id)}>
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
          )}
        </Card>
      )}

      {/* Tab 1: Inspections */}
      {tab === 1 && (
        <Card>
          {inspLoading ? (
            <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Inspection #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Checklist Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Inspector</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Overall Result</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Issues Found</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inspections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        No safety inspection logs recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    inspections.map((insp) => (
                      <TableRow key={insp.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{insp.inspectionNumber}</TableCell>
                        <TableCell>{new Date(insp.inspectionDate).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{insp.checklistTitle}</TableCell>
                        <TableCell>{insp.inspectorName || 'Safety Officer'}</TableCell>
                        <TableCell>
                          <Chip
                            label={insp.overallResultName}
                            size="small"
                            color={insp.overallResult === QualityInspectionResult.Passed ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell>{insp.hasIssues ? 'Issues flagged' : 'No violations'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}

      {/* Tab 2: Toolbox Talks */}
      {tab === 2 && (
        <Card>
          {tbLoading ? (
            <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Topic</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Conducted By</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Attendance Count</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Signed Off</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {toolboxTalks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        No toolbox talks recorded yet. Click <b>Log Toolbox Talk</b> to record daily briefings.
                      </TableCell>
                    </TableRow>
                  ) : (
                    toolboxTalks.map((tb) => (
                      <TableRow key={tb.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{tb.topic}</TableCell>
                        <TableCell>{new Date(tb.date).toLocaleDateString()}</TableCell>
                        <TableCell>{tb.conductedByName || 'Safety Supervisor'}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>{tb.attendanceCount} workers</TableCell>
                        <TableCell>
                          <Chip label="Signed Off" size="small" color="success" variant="outlined" />
                        </TableCell>
                        <TableCell>{tb.notes || '—'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}

      {/* Report Incident Modal */}
      <Dialog open={openIncModal} onClose={() => setOpenIncModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report Safety Incident</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Incident Type (e.g. Fall, Slip, Electrical)"
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value)}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Severity</InputLabel>
              <Select
                value={severity}
                label="Severity"
                onChange={(e) => setSeverity(Number(e.target.value) as SafetyIncidentSeverity)}
              >
                <MenuItem value={SafetyIncidentSeverity.NearMiss}>Near Miss</MenuItem>
                <MenuItem value={SafetyIncidentSeverity.Minor}>Minor Injury</MenuItem>
                <MenuItem value={SafetyIncidentSeverity.Moderate}>Moderate</MenuItem>
                <MenuItem value={SafetyIncidentSeverity.Severe}>Severe</MenuItem>
                <MenuItem value={SafetyIncidentSeverity.Critical}>Critical</MenuItem>
                <MenuItem value={SafetyIncidentSeverity.Fatal}>Fatal</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Exact Location on Site"
              value={incLocation}
              onChange={(e) => setIncLocation(e.target.value)}
              fullWidth
            />
            <TextField
              label="Person(s) Involved"
              value={personInvolved}
              onChange={(e) => setPersonInvolved(e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label="Detailed Description of Incident"
            value={incDescription}
            onChange={(e) => setIncDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
            required
          />

          <TextField
            label="Immediate Action Taken"
            value={immediateAction}
            onChange={(e) => setImmediateAction(e.target.value)}
            fullWidth
          />

          <TextField
            label="Preventive / Corrective Action Planned"
            value={correctiveAction}
            onChange={(e) => setCorrectiveAction(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenIncModal(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleCreateIncident} disabled={isCreatingInc || !incDescription}>
            {isCreatingInc ? 'Submitting...' : 'Submit Incident Report'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Log Toolbox Talk Modal */}
      <Dialog open={openTbModal} onClose={() => setOpenTbModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Log Daily Toolbox Talk</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Safety Topic (e.g. Scaffolding & Fall Arrest)"
            value={tbTopic}
            onChange={(e) => setTbTopic(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Number of Attendees"
            type="number"
            value={attendanceCount}
            onChange={(e) => setAttendanceCount(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Brief Notes / Key Takeaways"
            value={tbNotes}
            onChange={(e) => setTbNotes(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTbModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateToolbox} disabled={isCreatingTb || !tbTopic}>
            {isCreatingTb ? 'Saving...' : 'Save Toolbox Talk'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
