import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Grid, Typography, Chip, LinearProgress,
  Tab, Tabs, Button, IconButton, Tooltip, Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGetProjectQuery, useDeleteProjectMutation } from '@/features/projects/api';
import { ProjectStatusLabels } from '@/types';
import { StatusChip } from '@/components/StatusChip';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import ConfirmDialog from '@/components/ConfirmDialog';
import ProjectFormDialog from './ProjectFormDialog';
import { useSnackbar } from 'notistack';

export default function ProjectDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { data: project, isLoading, error, refetch } = useGetProjectQuery(id);
  const [deleteProject, { isLoading: deleting }] = useDeleteProjectMutation();
  const [tab, setTab] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (error || !project) return <ErrorDisplay onRetry={refetch} />;

  const handleDelete = async () => {
    try {
      await deleteProject(project.id).unwrap();
      enqueueSnackbar('Project deleted', { variant: 'success' });
      navigate('/projects');
    } catch {
      enqueueSnackbar('Failed to delete project', { variant: 'error' });
    }
  };

  const info = [
    { label: 'Client', value: project.clientName },
    { label: 'Site Address', value: project.siteAddress },
    { label: 'City', value: [project.city, project.state, project.country].filter(Boolean).join(', ') || '—' },
    { label: 'Start Date', value: project.startDate ? new Date(project.startDate).toLocaleDateString() : '—' },
    { label: 'End Date', value: project.endDate ? new Date(project.endDate).toLocaleDateString() : '—' },
    { label: 'Budget', value: `${project.currency} ${project.budget.toLocaleString()}` },
    { label: 'Expenses', value: `${project.currency} ${project.totalExpenses.toLocaleString()}` },
    { label: 'PM', value: project.projectManagerName ?? '—' },
  ];

  return (
    <Box>
      <PageHeader
        title={project.name}
        breadcrumbs={[{ label: 'Projects', href: '/projects' }, { label: project.name }]}
      >
        <Tooltip title="Edit"><IconButton onClick={() => setEditOpen(true)}><EditIcon /></IconButton></Tooltip>
        <Tooltip title="Delete"><IconButton color="error" onClick={() => setDeleteOpen(true)}><DeleteIcon /></IconButton></Tooltip>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/projects')} variant="outlined" size="small">
          Back
        </Button>
      </PageHeader>

      {/* Status bar */}
      <Box display="flex" gap={2} alignItems="center" mb={3} flexWrap="wrap">
        <StatusChip type="projectStatus" value={project.status} size="medium" />
        <Chip label={project.projectCode} variant="outlined" />
        <Chip label={ProjectStatusLabels[project.status]} color="primary" variant="outlined" />
      </Box>

      {/* Stats cards */}
      <Grid container spacing={2} mb={3}>
        {[
          { label: 'Tasks', val: `${project.completedTaskCount}/${project.taskCount}` },
          { label: 'Members', val: project.memberCount },
          { label: 'Issues', val: project.openIssueCount },
          { label: 'Progress', val: `${project.completionPercentage}%` },
        ].map((s) => (
          <Grid key={s.label} size={{ xs: 6, sm: 3 }}>
            <Card><CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h5" fontWeight={700}>{s.val}</Typography>
              <Typography variant="caption" color="text.secondary">{s.label}</Typography>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>

      {/* Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography fontWeight={600}>Overall Progress</Typography>
            <Typography fontWeight={600}>{project.completionPercentage}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={project.completionPercentage} sx={{ height: 10, borderRadius: 5 }} />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={tab} onChange={(_e, v: number) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Details" />
          <Tab label="Description" />
          <Tab label="Notes" />
        </Tabs>
        <CardContent>
          {tab === 0 && (
            <Grid container spacing={2}>
              {info.map((i) => (
                <Grid key={i.label} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="caption" color="text.secondary">{i.label}</Typography>
                  <Typography fontWeight={500}>{i.value || '—'}</Typography>
                  <Divider sx={{ mt: 1 }} />
                </Grid>
              ))}
            </Grid>
          )}
          {tab === 1 && (
            <Typography whiteSpace="pre-wrap">{project.description || 'No description provided.'}</Typography>
          )}
          {tab === 2 && (
            <Typography whiteSpace="pre-wrap">{project.notes || 'No notes.'}</Typography>
          )}
        </CardContent>
      </Card>

      <ProjectFormDialog open={editOpen} onClose={() => setEditOpen(false)} project={project} />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? This cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        loading={deleting}
      />
    </Box>
  );
}
