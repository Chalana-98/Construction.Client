import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  TextField,
  MenuItem,
  Pagination,
  InputAdornment,
  Chip,
  CardActionArea,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useGetProjectsQuery } from '@/features/projects/api';
import { ProjectStatus, ProjectStatusLabels } from '@/types';
import { StatusChip } from '@/components/StatusChip';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ProjectFormDialog from './ProjectFormDialog';


export default function ProjectsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data, isLoading, error, refetch } = useGetProjectsQuery({
    page,
    pageSize: 12,
    status: statusFilter === '' ? undefined : statusFilter,
    search: search || undefined,
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const hasItems = Boolean(data?.items && data.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 'calc(100vh - 120px)' }}>
      <PageHeader
        title="Projects"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Projects' }]}
        actionLabel={hasItems ? "New Project" : undefined}
        onAction={hasItems ? () => setShowCreateDialog(true) : undefined}
      />

      {/* Filters (show when has items or searching) */}
      {(hasItems || search || statusFilter) && (
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <TextField
            size="small"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ minWidth: 280 }}
          />
          <TextField
            size="small"
            select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as ProjectStatus | ''); setPage(1); }}
            label="Status"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {Object.entries(ProjectStatusLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      {/* Project Cards Grid */}
      {hasItems && (
        <Grid container spacing={3}>
          {data?.items.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardActionArea onClick={() => navigate(`/projects/${project.id}`)}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="h6" fontWeight={600} noWrap sx={{ maxWidth: '70%' }}>
                        {project.name}
                      </Typography>
                      <StatusChip type="projectStatus" value={project.status} />
                    </Box>

                    <Chip label={project.projectCode} size="small" variant="outlined" sx={{ mb: 1.5 }} />

                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      Client: {project.clientName}
                    </Typography>

                    {project.projectManagerName && (
                      <Typography variant="body2" color="text.secondary" mb={1.5}>
                        PM: {project.projectManagerName}
                      </Typography>
                    )}

                    <Box mb={1}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                          Progress
                        </Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {project.completionPercentage}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={project.completionPercentage}
                        sx={{ borderRadius: 5, height: 8 }}
                      />
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        ${project.budget.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {project.startDate
                          ? new Date(project.startDate).toLocaleDateString()
                          : 'No start date'}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!hasItems && (
        <Card sx={{ flexGrow: 1, minHeight: 'calc(100vh - 180px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState
            icon={<ApartmentIcon />}
            title="No projects yet!"
            description="Create your first construction project to manage tasks, daily logs, and financials."
            actionLabel="Add Project"
            onAction={() => setShowCreateDialog(true)}
          />
        </Card>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={data.totalPages}
            page={page}
            onChange={(_e, v) => setPage(v)}
            color="primary"
          />
        </Box>
      )}

      <ProjectFormDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </Box>
  );
}
