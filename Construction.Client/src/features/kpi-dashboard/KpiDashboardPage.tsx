import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  LinearProgress,
  Chip,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SpeedIcon from '@mui/icons-material/Speed';
import { useGetProjectsQuery } from '@/features/projects/api';
import { useGetProjectKpiDashboardQuery } from './api';

export default function KpiDashboardPage() {
  const { data: projectsData } = useGetProjectsQuery({ page: 1, pageSize: 50 });
  const projects = projectsData?.items ?? [];

  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : '');

  const { data: kpi, isLoading } = useGetProjectKpiDashboardQuery(activeProjectId, {
    skip: !activeProjectId,
  });

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Construction Executive & Project KPI Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cross-module real-time intelligence: Financials, Schedule & Physical Progress, Field Operations, and Risk Matrix.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 220 }}>
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
      </Box>

      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : !activeProjectId || !kpi ? (
        <Alert severity="info">Please select a project to view the Construction KPI dashboard.</Alert>
      ) : (
        <>
          {/* SECTION 1: FINANCIAL HEALTH */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWalletIcon color="primary" /> Financial Health & Cost Control
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card sx={{ bgcolor: 'grey.50' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>CONTRACT VALUE</Typography>
                  <Typography variant="h6" fontWeight={700}>${kpi.financials.contractValue.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card sx={{ bgcolor: 'primary.50' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>REVISED BUDGET</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">${kpi.financials.revisedBudget.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card sx={{ bgcolor: 'warning.50' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>COMMITTED (POs & SCs)</Typography>
                  <Typography variant="h6" fontWeight={700} color="warning.dark">${kpi.financials.committedCost.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card sx={{ bgcolor: 'error.50' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>ACTUAL EXPENDITURE</Typography>
                  <Typography variant="h6" fontWeight={700} color="error.main">${kpi.financials.actualCost.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Card sx={{ bgcolor: kpi.financials.budgetVariance >= 0 ? 'success.50' : 'error.50' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>BUDGET VARIANCE</Typography>
                  <Typography variant="h6" fontWeight={700} color={kpi.financials.budgetVariance >= 0 ? 'success.dark' : 'error.dark'}>
                    ${kpi.financials.budgetVariance.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* SECTION 2: PROGRESS & SCHEDULE */}
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon color="primary" /> Schedule & Physical vs Financial Progress
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 2.5, height: '100%' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>
                  Overall Progress S-Curve Comparison
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>Physical Progress (Works Done)</Typography>
                    <Typography variant="body2" fontWeight={700} color="primary.main">{kpi.progress.physicalProgressPercentage}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={kpi.progress.physicalProgressPercentage} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>Financial Progress (Budget Spent)</Typography>
                    <Typography variant="body2" fontWeight={700} color="success.main">{kpi.progress.financialProgressPercentage}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={kpi.progress.financialProgressPercentage} color="success" sx={{ height: 10, borderRadius: 5 }} />
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 2.5, height: '100%' }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
                  Schedule Health ({kpi.progress.scheduleStatus})
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Completed Activities</Typography>
                    <Typography variant="h6" fontWeight={700} color="success.main">
                      {kpi.progress.completedActivities} / {kpi.progress.totalActivities}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Overdue / Delayed</Typography>
                    <Typography variant="h6" fontWeight={700} color="error.main">
                      {kpi.progress.overdueActivities} Overdue
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Chip
                      label={kpi.progress.scheduleDelayDays > 0 ? `${kpi.progress.scheduleDelayDays} Days Delay Alert` : 'On Schedule'}
                      color={kpi.progress.scheduleDelayDays > 0 ? 'warning' : 'success'}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          {/* SECTION 3: FIELD OPS & RISK MATRIX */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EngineeringIcon color="primary" /> Field Operations Snapshot
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Workers on Site Today:</Typography>
                  <Typography variant="body2" fontWeight={700}>{kpi.fieldOperations.workersOnSiteToday} workers</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Labor Hours Logged:</Typography>
                  <Typography variant="body2" fontWeight={700}>{kpi.fieldOperations.totalLaborHoursLogged} hrs</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Equipment Active in Use:</Typography>
                  <Typography variant="body2" fontWeight={700}>{kpi.fieldOperations.equipmentInUseCount} units</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Pending Material Requisitions:</Typography>
                  <Typography variant="body2" fontWeight={700} color="warning.dark">{kpi.fieldOperations.pendingMaterialRequestsCount}</Typography>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: 2.5 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningAmberIcon color="error" /> Risk & HSE Deficiencies Matrix
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Open / Overdue RFIs:</Typography>
                  <Typography variant="body2" fontWeight={700}>{kpi.risksAndIssues.openRFIs} ({kpi.risksAndIssues.overdueRFIs} overdue)</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Pending Change Orders:</Typography>
                  <Typography variant="body2" fontWeight={700}>{kpi.risksAndIssues.pendingChangeOrders}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Safety Incidents (YTD):</Typography>
                  <Typography variant="body2" fontWeight={700} color={kpi.risksAndIssues.totalSafetyIncidents > 0 ? 'error.main' : 'success.main'}>
                    {kpi.risksAndIssues.totalSafetyIncidents}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Open QA/QC NCR Deficiencies:</Typography>
                  <Typography variant="body2" fontWeight={700} color={kpi.risksAndIssues.openQualityDeficiencies > 0 ? 'error.main' : 'success.main'}>
                    {kpi.risksAndIssues.openQualityDeficiencies} open
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
