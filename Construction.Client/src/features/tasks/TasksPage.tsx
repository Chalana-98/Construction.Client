import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, MenuItem, Chip, IconButton, Tooltip,
  Typography, LinearProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useGetMyTasksQuery } from '@/features/tasks/api';
import { TaskStatus, TaskStatusLabels } from '@/types';
import { StatusChip, PriorityChip } from '@/components/StatusChip';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const { data: tasks, isLoading, error, refetch } = useGetMyTasksQuery(
    statusFilter === '' ? undefined : statusFilter,
  );

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  return (
    <Box>
      <PageHeader title="My Tasks" />

      <Box display="flex" gap={2} mb={3}>
        <TextField
          size="small" select label="Status" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All</MenuItem>
          {Object.entries(TaskStatusLabels).map(([v, l]) => (
            <MenuItem key={v} value={v}>{l}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Progress</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks?.map((task) => (
                <TableRow key={task.id} hover>
                  <TableCell>
                    <Typography fontWeight={500}>{task.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={task.taskCode ?? '—'} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell><StatusChip type="taskStatus" value={task.status} /></TableCell>
                  <TableCell><PriorityChip value={task.priority} /></TableCell>
                  <TableCell>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <LinearProgress variant="determinate" value={task.completionPercentage} sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                      <Typography variant="caption">{task.completionPercentage}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View">
                      <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {(!tasks || tasks.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No tasks assigned to you</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
