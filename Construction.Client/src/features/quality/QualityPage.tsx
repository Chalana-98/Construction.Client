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
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGetProjectsQuery } from '@/features/projects/api';
import { useGetFlatWbsByProjectQuery } from '@/features/wbs/api';
import {
  useGetQualityInspectionsQuery,
  useGetQualityIssuesQuery,
  useCreateQualityInspectionMutation,
  useCloseQualityIssueMutation,
  useDeleteQualityInspectionMutation,
} from './api';
import {
  QualityInspectionResult,
  QualityIssueStatus,
} from '@/types';

export default function QualityPage() {
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 50 });
  const projects = projectsData?.items ?? [];

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');

  const [tab, setTab] = useState(0);

  const { data: inspections = [], isLoading: inspLoading } = useGetQualityInspectionsQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: issues = [], isLoading: issuesLoading } = useGetQualityIssuesQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const { data: wbsNodes = [] } = useGetFlatWbsByProjectQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const [createInspection, { isLoading: isCreatingInsp }] = useCreateQualityInspectionMutation();
  const [closeIssue, { isLoading: isClosing }] = useCloseQualityIssueMutation();
  const [deleteInspection] = useDeleteQualityInspectionMutation();

  // Create Inspection dialog
  const [openModal, setOpenModal] = useState(false);
  const [wbsId, setWbsId] = useState('');
  const [discipline, setDiscipline] = useState('Concrete');
  const [title, setTitle] = useState('');
  const [result, setResult] = useState<QualityInspectionResult>(QualityInspectionResult.Passed);
  const [comments, setComments] = useState('');

  // Close issue dialog
  const [closeIssueId, setCloseIssueId] = useState<string | null>(null);
  const [closeNotes, setCloseNotes] = useState('');

  const handleCreateInspection = async () => {
    if (!activeProjectId || !title) return;
    await createInspection({
      projectId: activeProjectId,
      wbsId: wbsId || undefined,
      discipline,
      title,
      result,
      comments,
      items: [
        {
          requirement: `${discipline} visual and dimension verification`,
          result,
          notes: comments,
        },
      ],
    }).unwrap();

    setOpenModal(false);
    setTitle('');
    setComments('');
  };

  const handleConfirmCloseIssue = async () => {
    if (!closeIssueId) return;
    await closeIssue({ id: closeIssueId, notes: closeNotes || 'Verified and rectified.' }).unwrap();
    setCloseIssueId(null);
    setCloseNotes('');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Quality Assurance & Control (QA/QC)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Trade-specific inspections (Concrete, Steel, Electrical, Plumbing) and Non-Conformance (NCR) issue resolution.
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

          {tab === 0 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenModal(true)}
              disabled={!activeProjectId}
            >
              New QA/QC Inspection
            </Button>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 2.5 }}>
        <Tab label={`QA/QC Inspections (${inspections.length})`} />
        <Tab label={`Non-Conformance Deficiencies (${issues.length})`} />
      </Tabs>

      {/* Tab 0: Inspections */}
      {tab === 0 && (
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
                    <TableCell sx={{ fontWeight: 700 }}>Discipline</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Title / Scope</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Inspector</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Result</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Deficiencies</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inspections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                        No QA/QC inspections recorded yet. Click <b>New QA/QC Inspection</b> to log site inspection findings.
                      </TableCell>
                    </TableRow>
                  ) : (
                    inspections.map((insp) => (
                      <TableRow key={insp.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{insp.inspectionNumber}</TableCell>
                        <TableCell>{new Date(insp.inspectionDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Chip label={insp.discipline} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {insp.title}
                          </Typography>
                          {insp.comments && (
                            <Typography variant="caption" color="text.secondary">
                              {insp.comments}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>{insp.inspectorName || 'QA Engineer'}</TableCell>
                        <TableCell>
                          <Chip
                            label={insp.resultName}
                            size="small"
                            color={
                              insp.result === QualityInspectionResult.Passed
                                ? 'success'
                                : insp.result === QualityInspectionResult.PassedWithComments
                                ? 'info'
                                : 'error'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {insp.issues.length > 0 ? (
                            <Chip label={`${insp.issues.length} NCR Issue(s)`} size="small" color="error" />
                          ) : (
                            <Chip label="Compliant" size="small" color="success" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => deleteInspection(insp.id)}>
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

      {/* Tab 1: NCR Issues */}
      {tab === 1 && (
        <Card>
          {issuesLoading ? (
            <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Issue / NCR #</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Root Cause</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Corrective Action</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {issues.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        No open quality deficiencies found. All works passed inspection standards!
                      </TableCell>
                    </TableRow>
                  ) : (
                    issues.map((iss) => (
                      <TableRow key={iss.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{iss.issueNumber}</TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>{iss.description}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>{iss.rootCause}</TableCell>
                        <TableCell sx={{ maxWidth: 200 }}>{iss.correctiveAction}</TableCell>
                        <TableCell>
                          <Chip
                            label={iss.statusName}
                            size="small"
                            color={iss.status === QualityIssueStatus.Closed ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {iss.status !== QualityIssueStatus.Closed && (
                            <Tooltip title="Close / Verify NCR Deficiency">
                              <IconButton size="small" color="success" onClick={() => setCloseIssueId(iss.id)}>
                                <TaskAltIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
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

      {/* New QA Inspection Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Log QA/QC Inspection</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Trade Discipline</InputLabel>
              <Select value={discipline} label="Trade Discipline" onChange={(e) => setDiscipline(e.target.value)}>
                <MenuItem value="Concrete">Concrete</MenuItem>
                <MenuItem value="Structural Steel">Structural Steel</MenuItem>
                <MenuItem value="Masonry">Masonry</MenuItem>
                <MenuItem value="Welding">Welding</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
                <MenuItem value="Plumbing / Piping">Plumbing / Piping</MenuItem>
                <MenuItem value="HVAC">HVAC</MenuItem>
                <MenuItem value="Waterproofing">Waterproofing</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Overall Result</InputLabel>
              <Select
                value={result}
                label="Overall Result"
                onChange={(e) => setResult(Number(e.target.value) as QualityInspectionResult)}
              >
                <MenuItem value={QualityInspectionResult.Passed}>Passed</MenuItem>
                <MenuItem value={QualityInspectionResult.PassedWithComments}>Passed with Comments</MenuItem>
                <MenuItem value={QualityInspectionResult.Failed}>Failed (Auto-Logs NCR Deficiency)</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Inspection Title (e.g. Pre-pour Rebar Inspection Grid A-C)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Linked WBS Activity</InputLabel>
            <Select value={wbsId} label="Linked WBS Activity" onChange={(e) => setWbsId(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              {wbsNodes.map((w) => (
                <MenuItem key={w.id} value={w.id}>
                  {w.wbsCode} - {w.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Inspection Comments / Observations"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateInspection} disabled={isCreatingInsp || !title}>
            {isCreatingInsp ? 'Saving...' : 'Save Inspection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Close Issue Modal */}
      <Dialog open={Boolean(closeIssueId)} onClose={() => setCloseIssueId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Close Quality Deficiency</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Resolution & Verification Notes"
            value={closeNotes}
            onChange={(e) => setCloseNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloseIssueId(null)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleConfirmCloseIssue} disabled={isClosing}>
            {isClosing ? 'Closing...' : 'Close & Verify NCR'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
