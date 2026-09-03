import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { getApiErrorMessage } from '@/utils/useMutationHandler';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HistoryIcon from '@mui/icons-material/History';
import {
  useGetPendingApprovalsForMeQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
} from './api';
import { type ApprovalRequestDto } from '@/types';

export default function ApprovalsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { data: pendingApprovals = [], isLoading } = useGetPendingApprovalsForMeQuery();
  const [approveRequest, { isLoading: isApproving }] = useApproveRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();

  // Approve dialog
  const [approveItem, setApproveItem] = useState<ApprovalRequestDto | null>(null);
  const [approveComments, setApproveComments] = useState('');

  // Reject dialog
  const [rejectItem, setRejectItem] = useState<ApprovalRequestDto | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // History dialog
  const [historyItem, setHistoryItem] = useState<ApprovalRequestDto | null>(null);

  const handleApprove = async () => {
    try {
      if (!approveItem) return;
      await approveRequest({ id: approveItem.id, data: { comments: approveComments } }).unwrap();
      setApproveItem(null);
      setApproveComments('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  const handleReject = async () => {
    try {
      if (!rejectItem || !rejectionReason) return;
      await rejectRequest({ id: rejectItem.id, data: { rejectionReason } }).unwrap();
      setRejectItem(null);
      setRejectionReason('');
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err), { variant: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Universal Approval Inbox
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Centralized approval engine for Expenses, Material Requests, Purchase Orders, Subcontracts, Change Orders, and Billing.
        </Typography>
      </Box>

      {isLoading ? (
        <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />
      ) : pendingApprovals.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
          <Typography variant="h6" fontWeight={700}>
            All caught up!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You have no pending items waiting for your approval.
          </Typography>
        </Card>
      ) : (
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Module / Entity</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Reference #</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Submitted By</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Submission Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Decision Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingApprovals.map((req) => (
                  <TableRow key={req.id} hover>
                    <TableCell>
                      <Chip label={req.entityTypeName} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{req.entityReferenceNumber}</TableCell>
                    <TableCell>{req.projectName || '—'}</TableCell>
                    <TableCell>{req.requestedByName || 'Requester'}</TableCell>
                    <TableCell>
                      {req.submissionDate ? new Date(req.submissionDate).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 200 }}>{req.notes || '—'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View History">
                        <IconButton size="small" color="info" onClick={() => setHistoryItem(req)}>
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Approve">
                        <IconButton size="small" color="success" onClick={() => setApproveItem(req)}>
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton size="small" color="error" onClick={() => setRejectItem(req)}>
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Approve Dialog */}
      <Dialog open={Boolean(approveItem)} onClose={() => setApproveItem(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Approve {approveItem?.entityTypeName} ({approveItem?.entityReferenceNumber})</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Approval Comments (Optional)"
            value={approveComments}
            onChange={(e) => setApproveComments(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveItem(null)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleApprove} disabled={isApproving}>
            {isApproving ? 'Approving...' : 'Confirm Approval'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={Boolean(rejectItem)} onClose={() => setRejectItem(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Reject {rejectItem?.entityTypeName} ({rejectItem?.entityReferenceNumber})</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Rejection Reason (Required)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            multiline
            rows={3}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectItem(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleReject} disabled={isRejecting || !rejectionReason}>
            {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Audit History Dialog */}
      <Dialog open={Boolean(historyItem)} onClose={() => setHistoryItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Approval Audit Trail ({historyItem?.entityReferenceNumber})</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {historyItem?.history && historyItem.history.length > 0 ? (
            historyItem.history.map((h, i) => (
              <Box key={i} sx={{ mb: 1.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={700}>{h.action}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(h.actionDate).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  By: {h.actorName || 'User'}
                </Typography>
                {h.comments && <Typography variant="body2" sx={{ mt: 0.5 }}>{h.comments}</Typography>}
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">No history log recorded yet.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryItem(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
