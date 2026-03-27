import { useState } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Pagination, Chip, IconButton, Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useGetDailyLogsQuery, useApproveDailyLogMutation } from '@/features/daily-logs/api';
import { WeatherConditionLabels } from '@/types';
import Loading from '@/components/Loading';
import ErrorDisplay from '@/components/ErrorDisplay';
import PageHeader from '@/components/PageHeader';
import { useSnackbar } from 'notistack';

export default function DailyLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useGetDailyLogsQuery({ page, pageSize: 15 });
  const [approveLog] = useApproveDailyLogMutation();
  const { enqueueSnackbar } = useSnackbar();

  if (isLoading) return <Loading />;
  if (error) return <ErrorDisplay onRetry={refetch} />;

  const handleApprove = async (id: string) => {
    try { await approveLog(id).unwrap(); enqueueSnackbar('Log approved', { variant: 'success' }); }
    catch { enqueueSnackbar('Failed', { variant: 'error' }); }
  };

  return (
    <Box>
      <PageHeader title="Daily Logs" />
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Weather</TableCell>
                <TableCell align="right">Workers</TableCell>
                <TableCell align="right">Hours</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Photos</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    <Typography fontWeight={500}>{new Date(log.logDate).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={WeatherConditionLabels[log.weather] ?? log.weatherName} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">{log.workersOnSite}</TableCell>
                  <TableCell align="right">{log.totalHours}</TableCell>
                  <TableCell>{log.createdByName}</TableCell>
                  <TableCell><Chip label={log.photoCount} size="small" /></TableCell>
                  <TableCell>
                    <Chip label={log.isApproved ? 'Approved' : 'Pending'} size="small"
                      color={log.isApproved ? 'success' : 'warning'} variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    {!log.isApproved && (
                      <Tooltip title="Approve">
                        <IconButton size="small" color="success" onClick={() => handleApprove(log.id)}>
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(!data?.items || data.items.length === 0) && (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No daily logs found</Typography>
                </TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      {data && data.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={data.totalPages} page={page} onChange={(_e, v) => setPage(v)} color="primary" />
        </Box>
      )}
    </Box>
  );
}
