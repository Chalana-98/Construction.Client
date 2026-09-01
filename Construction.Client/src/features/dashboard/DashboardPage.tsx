import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Chip,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BugReportIcon from '@mui/icons-material/BugReport';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import { useGetDashboardQuery } from '@/features/projects/api';
import { StatusChip, PriorityChip } from '@/components/StatusChip';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useAppSelector, type RootState } from '@/store';
import { useCurrency } from '@/utils/currency';

function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}) {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: color,
        }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.5}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useGetDashboardQuery();
  const user = useAppSelector((s: RootState) => s.auth.user);
  const { symbol } = useCurrency();

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const dashboard = data;

  const budgetUsed =
    dashboard && dashboard.totalBudget > 0
      ? ((dashboard.totalExpenses / dashboard.totalBudget) * 100).toFixed(1)
      : '0';

  return (
    <Box>
      <PageHeader title={`Welcome back, ${user?.name?.split(' ')[0] ?? 'User'}`} />

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Projects"
            value={dashboard?.activeProjects ?? 0}
            icon={<BusinessIcon sx={{ color: '#1565C0' }} />}
            color="#1565C0"
            subtitle={`${dashboard?.totalProjects ?? 0} total`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Tasks"
            value={dashboard?.totalTasks ?? 0}
            icon={<TaskAltIcon sx={{ color: '#2E7D32' }} />}
            color="#2E7D32"
            subtitle={`${dashboard?.overdueTasks ?? 0} overdue`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Open Issues"
            value={dashboard?.openIssues ?? 0}
            icon={<BugReportIcon sx={{ color: '#ED6C02' }} />}
            color="#ED6C02"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Budget Used"
            value={`${budgetUsed}%`}
            icon={<AttachMoneyIcon sx={{ color: '#9C27B0' }} />}
            color="#9C27B0"
            subtitle={`${symbol} ${(dashboard?.totalExpenses ?? 0).toLocaleString()} spent`}
          />
        </Grid>
      </Grid>

      {/* Content Panels */}
      <Grid container spacing={3}>
        {/* Recent Projects */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Projects
                </Typography>
                <Chip
                  label="View All"
                  size="small"
                  clickable
                  onClick={() => navigate('/projects')}
                />
              </Box>
              <List disablePadding>
                {dashboard?.recentProjects?.map((project) => (
                  <ListItemButton
                    key={project.id}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemText
                      primary={project.name}
                      secondary={project.clientName}
                    />
                    <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5}>
                      <StatusChip type="projectStatus" value={project.status} />
                      <Box width={80}>
                        <LinearProgress
                          variant="determinate"
                          value={project.completionPercentage}
                          sx={{ borderRadius: 5, height: 6 }}
                        />
                      </Box>
                    </Box>
                  </ListItemButton>
                ))}
                {(!dashboard?.recentProjects || dashboard.recentProjects.length === 0) && (
                  <EmptyState
                    icon={<ApartmentIcon />}
                    title="No projects yet!"
                    description="Create a project to track milestones and budget."
                    actionLabel="Add Project"
                    onAction={() => navigate('/projects')}
                    sx={{ py: 4 }}
                  />
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  <TaskAltIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Upcoming Tasks
                </Typography>
                <Chip
                  label="View All"
                  size="small"
                  clickable
                  onClick={() => navigate('/tasks')}
                />
              </Box>
              <List disablePadding>
                {dashboard?.upcomingTasks?.map((task) => (
                  <ListItemButton
                    key={task.id}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemText
                      primary={task.title}
                      secondary={
                        task.dueDate
                          ? `Due: ${new Date(task.dueDate).toLocaleDateString()}`
                          : 'No due date'
                      }
                    />
                    <PriorityChip value={task.priority} />
                  </ListItemButton>
                ))}
                {(!dashboard?.upcomingTasks || dashboard.upcomingTasks.length === 0) && (
                  <EmptyState
                    icon={<TaskAltIcon />}
                    title="No upcoming tasks!"
                    description="You are all caught up on scheduled deliverables."
                    sx={{ py: 4 }}
                  />
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Issues */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Issues
                </Typography>
                <Chip
                  label="View All"
                  size="small"
                  clickable
                  onClick={() => navigate('/issues')}
                />
              </Box>
              <List disablePadding>
                {dashboard?.recentIssues?.map((issue) => (
                  <ListItemButton
                    key={issue.id}
                    onClick={() => navigate(`/issues/${issue.id}`)}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">
                            {issue.issueNumber}
                          </Typography>
                          <Typography>{issue.title}</Typography>
                        </Box>
                      }
                      secondary={issue.assignedToName ?? 'Unassigned'}
                    />
                    <Box display="flex" gap={1}>
                      <StatusChip type="issueStatus" value={issue.status} />
                      <PriorityChip value={issue.priority} />
                    </Box>
                  </ListItemButton>
                ))}
                {(!dashboard?.recentIssues || dashboard.recentIssues.length === 0) && (
                  <EmptyState
                    icon={<ReportProblemIcon />}
                    title="No issues reported!"
                    description="Zero open defects or safety incidents recorded."
                    sx={{ py: 4 }}
                  />
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
