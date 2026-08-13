import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Avatar,
  Grid, Divider, Alert, Chip, Skeleton, IconButton, InputAdornment,
  Paper, Stack,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from './api';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/authSlice';
import PageHeader from '@/components/PageHeader';

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const dispatch = useAppDispatch();

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    jobTitle: '',
  });

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Feedback state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber ?? '',
        jobTitle: profile.jobTitle ?? '',
      });
    }
  }, [profile]);

  const handleUpdate = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handlePasswordUpdate = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const result = await updateProfile({
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
        jobTitle: form.jobTitle,
      }).unwrap();

      // Update Redux store with the new name
      dispatch(updateUser({
        userId: result.userId,
        email: result.email,
        name: result.fullName,
        role: result.role,
        tenantId: result.tenantId,
      }));

      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      setErrorMessage(apiErr.data?.error ?? 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();

      setSuccessMessage('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: unknown) {
      const apiErr = err as { data?: { error?: string } };
      setErrorMessage(apiErr.data?.error ?? 'Failed to change password.');
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber ?? '',
        jobTitle: profile.jobTitle ?? '',
      });
    }
    setIsEditing(false);
    setErrorMessage('');
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Box>
        <PageHeader title="Profile" subtitle="Manage your account settings" />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rounded" height={320} />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rounded" height={320} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box>
        <PageHeader title="Profile" subtitle="Manage your account settings" />
        <Alert severity="error">Failed to load profile. Please try again later.</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Profile" subtitle="Manage your account settings" />

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* ── Left Column: Profile Card ── */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ textAlign: 'center' }}>
            <CardContent sx={{ py: 4 }}>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: 36,
                  fontWeight: 700,
                }}
              >
                {profile.firstName.charAt(0).toUpperCase()}{profile.lastName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight={700}>
                {profile.fullName}
              </Typography>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                {profile.email}
              </Typography>
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1.5 }}>
                <Chip
                  icon={<SecurityIcon />}
                  label={profile.role}
                  color="primary"
                  size="small"
                />
                {profile.emailVerified && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Verified"
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
              </Stack>
            </CardContent>

            <Divider />

            {/* Company Info Section */}
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <BusinessIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Company
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {profile.companyName}
                    </Typography>
                  </Box>
                </Box>
                {profile.jobTitle && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <BadgeIcon color="action" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Job Title
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {profile.jobTitle}
                      </Typography>
                    </Box>
                  </Box>
                )}
                {profile.phoneNumber && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {profile.phoneNumber}
                      </Typography>
                    </Box>
                  </Box>
                )}
                <Box display="flex" alignItems="center" gap={1.5}>
                  <CalendarTodayIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Member Since
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatDate(profile.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                {profile.lastLoginAt && (
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <CalendarTodayIcon color="action" fontSize="small" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Last Login
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatDate(profile.lastLoginAt)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </CardContent>

            <Divider />

            <CardContent>
              <Chip
                label={`${profile.subscriptionPlan.charAt(0).toUpperCase() + profile.subscriptionPlan.slice(1)} Plan`}
                variant="outlined"
                color="info"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* ── Right Column: Edit Form & Password ── */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Personal Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Personal Information
                  </Typography>
                </Box>
                {!isEditing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    size="small"
                  >
                    Edit
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                      size="small"
                      color="inherit"
                    >
                      Cancel
                    </Button>
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSaveProfile}
                      size="small"
                      variant="contained"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Saving...' : 'Save'}
                    </Button>
                  </Stack>
                )}
              </Box>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={form.firstName}
                    onChange={handleUpdate('firstName')}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'filled'}
                    slotProps={{ input: { readOnly: !isEditing } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={form.lastName}
                    onChange={handleUpdate('lastName')}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'filled'}
                    slotProps={{ input: { readOnly: !isEditing } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    disabled
                    variant="filled"
                    slotProps={{
                      input: {
                        readOnly: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    helperText="Email cannot be changed"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={form.phoneNumber}
                    onChange={handleUpdate('phoneNumber')}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'filled'}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Job Title"
                    value={form.jobTitle}
                    onChange={handleUpdate('jobTitle')}
                    disabled={!isEditing}
                    variant={isEditing ? 'outlined' : 'filled'}
                    slotProps={{
                      input: {
                        readOnly: !isEditing,
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={showPasswordForm ? 3 : 0}>
                <Box display="flex" alignItems="center" gap={1}>
                  <LockIcon color="primary" />
                  <Typography variant="h6" fontWeight={700}>
                    Security
                  </Typography>
                </Box>
                {!showPasswordForm && (
                  <Button
                    startIcon={<LockIcon />}
                    onClick={() => setShowPasswordForm(true)}
                    size="small"
                    color="warning"
                  >
                    Change Password
                  </Button>
                )}
              </Box>

              {showPasswordForm && (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <form onSubmit={handleChangePassword}>
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Current Password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordUpdate('currentPassword')}
                          required
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    edge="end"
                                    size="small"
                                  >
                                    {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="New Password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={handlePasswordUpdate('newPassword')}
                          required
                          helperText="Min 8 characters"
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    edge="end"
                                    size="small"
                                  >
                                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordUpdate('confirmPassword')}
                          required
                          error={
                            passwordForm.confirmPassword.length > 0 &&
                            passwordForm.newPassword !== passwordForm.confirmPassword
                          }
                          helperText={
                            passwordForm.confirmPassword.length > 0 &&
                            passwordForm.newPassword !== passwordForm.confirmPassword
                              ? 'Passwords do not match'
                              : ''
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                          <Button
                            onClick={() => {
                              setShowPasswordForm(false);
                              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                              setErrorMessage('');
                            }}
                            color="inherit"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            color="warning"
                            disabled={isChangingPassword}
                          >
                            {isChangingPassword ? 'Changing...' : 'Change Password'}
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
