import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useGetProjectsQuery } from '@/features/projects/api';
import {
  useGetCostCodeSummaryQuery,
  useCreateCostCodeMutation,
  useSeedStandardCostCodesMutation,
} from './api';
import { CostCodeCategory, CostCodeCategoryLabels } from '@/types';

export default function CostControlPage() {
  const { data: projectsData, isLoading: projectsLoading } = useGetProjectsQuery({ page: 1, pageSize: 50 });
  const projects = projectsData?.items ?? [];

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');

  const { data: summary, isLoading: summaryLoading } = useGetCostCodeSummaryQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  const [createCostCode, { isLoading: isCreating }] = useCreateCostCodeMutation();
  const [seedStandardCostCodes, { isLoading: isSeeding }] = useSeedStandardCostCodesMutation();

  const [openModal, setOpenModal] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CostCodeCategory>(CostCodeCategory.Materials);
  const [originalBudget, setOriginalBudget] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!activeProjectId || !code || !name) return;
    await createCostCode({
      projectId: activeProjectId,
      code,
      name,
      category,
      originalBudget: Number(originalBudget) || 0,
      description,
    }).unwrap();

    setOpenModal(false);
    setCode('');
    setName('');
    setOriginalBudget('');
    setDescription('');
  };

  const handleSeed = async () => {
    if (!activeProjectId) return;
    await seedStandardCostCodes(activeProjectId).unwrap();
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Cost Codes & Budget Control
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time tracking of original budget, committed cost, actual expenditure, and forecast variance.
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
            startIcon={<AutoAwesomeIcon />}
            onClick={handleSeed}
            disabled={isSeeding || !activeProjectId}
          >
            Seed Standard
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            disabled={!activeProjectId}
          >
            Add Cost Code
          </Button>
        </Box>
      </Box>

      {/* Summary KPI Cards */}
      {summaryLoading || projectsLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : !activeProjectId ? (
        <Alert severity="info">Please select a project to view cost control metrics.</Alert>
      ) : (
        <>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card sx={{ bgcolor: 'primary.50', borderLeft: 4, borderColor: 'primary.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    ORIGINAL BUDGET
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">
                    ${(summary?.totalOriginalBudget ?? 0).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card sx={{ bgcolor: 'warning.50', borderLeft: 4, borderColor: 'warning.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    COMMITTED (POs & SCs)
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="warning.dark">
                    ${(summary?.totalCommittedCost ?? 0).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card sx={{ bgcolor: 'error.50', borderLeft: 4, borderColor: 'error.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    ACTUAL SPENT
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="error.main">
                    ${(summary?.totalActualCost ?? 0).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card sx={{ bgcolor: 'success.50', borderLeft: 4, borderColor: 'success.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    REMAINING BUDGET
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="success.main">
                    ${(summary?.totalRemainingBudget ?? 0).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card sx={{ bgcolor: 'info.50', borderLeft: 4, borderColor: 'info.main' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    FORECAST VARIANCE
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color={(summary?.totalVariance ?? 0) >= 0 ? 'success.dark' : 'error.dark'}
                  >
                    ${(summary?.totalVariance ?? 0).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Cost Code Breakdown Table */}
          <Card>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead sx={{ bgcolor: 'grey.50' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Name / Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Original Budget</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Committed Cost</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Actual Cost</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Remaining</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Forecast Variance</TableCell>
                    <TableCell sx={{ minWidth: 140, fontWeight: 700 }}>Budget Used</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(summary?.costCodes ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                        No cost codes created yet. Click <b>Seed Standard</b> or <b>Add Cost Code</b> to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    summary?.costCodes.map((cc) => {
                      const totalUsed = cc.committedCost + cc.actualCost;
                      const pct = cc.originalBudget > 0 ? Math.min(100, Math.round((totalUsed / cc.originalBudget) * 100)) : 0;
                      return (
                        <TableRow key={cc.id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{cc.code}</TableCell>
                          <TableCell>
                            <Chip
                              label={CostCodeCategoryLabels[cc.category] ?? cc.categoryName}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight={600}>
                              {cc.name}
                            </Typography>
                            {cc.description && (
                              <Typography variant="caption" color="text.secondary">
                                {cc.description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">${cc.originalBudget.toLocaleString()}</TableCell>
                          <TableCell align="right" sx={{ color: 'warning.dark', fontWeight: 600 }}>
                            ${cc.committedCost.toLocaleString()}
                          </TableCell>
                          <TableCell align="right" sx={{ color: 'error.main', fontWeight: 600 }}>
                            ${cc.actualCost.toLocaleString()}
                          </TableCell>
                          <TableCell align="right" sx={{ color: cc.remainingBudget >= 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>
                            ${cc.remainingBudget.toLocaleString()}
                          </TableCell>
                          <TableCell align="right" sx={{ color: cc.budgetVariance >= 0 ? 'success.dark' : 'error.dark', fontWeight: 700 }}>
                            ${cc.budgetVariance.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={pct}
                                color={pct > 90 ? 'error' : pct > 70 ? 'warning' : 'primary'}
                                sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="caption" fontWeight={600}>
                                {pct}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}

      {/* Add Dialog */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Cost Code</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Cost Code (e.g. 01-LAB-CONC)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Cost Code Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(Number(e.target.value) as CostCodeCategory)}
            >
              {Object.entries(CostCodeCategoryLabels).map(([catVal, catLabel]) => (
                <MenuItem key={catVal} value={Number(catVal)}>
                  {catLabel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Original Budget ($)"
            type="number"
            value={originalBudget}
            onChange={(e) => setOriginalBudget(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description / Scope Notes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={isCreating || !code || !name}>
            {isCreating ? 'Saving...' : 'Save Cost Code'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
