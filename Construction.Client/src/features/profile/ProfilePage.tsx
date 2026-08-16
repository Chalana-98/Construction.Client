import { useState } from 'react';
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from './api';
import { useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/authSlice';
import PageHeader from '@/components/PageHeader';

const profileValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters.')
    .required('First name is required.'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters.')
    .required('Last name is required.'),
  phoneNumber: Yup.string().optional(),
  jobTitle: Yup.string().optional(),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required.'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long.')
    .required('New password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match.')
    .required('Confirm password is required.'),
});

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const dispatch = useAppDispatch();

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Feedback state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const profileFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      phoneNumber: profile?.phoneNumber ?? '',
      jobTitle: profile?.jobTitle ?? '',
    },
    validationSchema: profileValidationSchema,
    onSubmit: async (values, { setErrors }) => {
      setErrorMessage('');
      setSuccessMessage('');
      try {
        const result = await updateProfile({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          phoneNumber: values.phoneNumber.trim() || undefined,
          jobTitle: values.jobTitle.trim() || undefined,
        }).unwrap();

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
        const apiErr = err as { data?: { error?: string; errors?: Record<string, string[]> } };
        if (apiErr?.data?.errors) {
          const sErrors: Record<string, string> = {};
          Object.entries(apiErr.data.errors).forEach(([k, msgs]) => {
            sErrors[k.charAt(0).toLowerCase() + k.slice(1)] = msgs.join(', ');
          });
          setErrors(sErrors);
        }
        setErrorMessage(apiErr?.data?.error ?? 'Failed to update profile.');
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values, { resetForm, setErrors }) => {
      setErrorMessage('');
      setSuccessMessage('');
      try {
        await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }).unwrap();

        setSuccessMessage('Password changed successfully!');
        resetForm();
        setShowPasswordForm(false);
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (err: unknown) {
        const apiErr = err as { data?: { error?: string; errors?: Record<string, string[]> } };
        if (apiErr?.data?.errors) {
          const sErrors: Record<string, string> = {};
          Object.entries(apiErr.data.errors).forEach(([k, msgs]) => {
            sErrors[k.charAt(0).toLowerCase() + k.slice(1)] = msgs.join(', ');
          });
          setErrors(sErrors);
        }
        setErrorMessage(apiErr?.data?.error ?? 'Failed to change password. Please check your current password.');
      }
    },
  });

  const handleStartEdit = () => {
    profileFormik.resetForm();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    profileFormik.resetForm();
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'MANAGER': return 'warning';
      default: return 'primary';
    }
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
        <Alert severity="error" sx={{ mt: 2 }}>Failed to load profile. Please try again later.</Alert>
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
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box position="relative" display="inline-block" mb={2}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: '2rem',
                    bgcolor: 'primary.main',
                    boxShadow: 3,
                    mx: 'auto',
                  }}
                >
                  {profile.firstName.charAt(0).toUpperCase()}
                  {profile.lastName.charAt(0).toUpperCase()}
                </Avatar>
              </Box>

              <Typography variant="h5" fontWeight={700} gutterBottom>
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {profile.email}
              </Typography>

              <Box display="flex" justifyContent="center" gap={1} mt={1.5}>
                <Chip
                  icon={<SecurityIcon sx={{ fontSize: '1rem !important' }} />}
                  label={profile.role}
                  color={getRoleBadgeColor(profile.role)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </CardContent>

            <Divider />

            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <BusinessIcon color="action" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Company
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {profile.companyName || 'No Company'}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <AccessTimeIcon color="action" fontSize="small" />
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
                    onClick={handleStartEdit}
                    size="small"
                    variant="outlined"
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
                      onClick={() => profileFormik.handleSubmit()}
                      size="small"
                      variant="contained"
                      disabled={isUpdating || profileFormik.isSubmitting}
                    >
                      {isUpdating || profileFormik.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Stack>
                )}
              </Box>

              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    required={isEditing}
                    value={profileFormik.values.firstName}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    disabled={!isEditing}
                    variant="outlined"
                    error={profileFormik.touched.firstName && Boolean(profileFormik.errors.firstName)}
                    helperText={profileFormik.touched.firstName && profileFormik.errors.firstName}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    required={isEditing}
                    value={profileFormik.values.lastName}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    disabled={!isEditing}
                    variant="outlined"
                    error={profileFormik.touched.lastName && Boolean(profileFormik.errors.lastName)}
                    helperText={profileFormik.touched.lastName && profileFormik.errors.lastName}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    disabled
                    variant="outlined"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    value={profileFormik.values.phoneNumber}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    disabled={!isEditing}
                    variant="outlined"
                    slotProps={{
                      input: {
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
                    id="jobTitle"
                    name="jobTitle"
                    label="Job Title"
                    value={profileFormik.values.jobTitle}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    disabled={!isEditing}
                    variant="outlined"
                    slotProps={{
                      input: {
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
                    onClick={() => {
                      passwordFormik.resetForm();
                      setShowPasswordForm(true);
                    }}
                    size="small"
                    variant="outlined"
                    color="primary"
                  >
                    Change Password
                  </Button>
                )}
              </Box>

              {showPasswordForm && (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <form onSubmit={passwordFormik.handleSubmit}>
                    <Grid container spacing={2.5}>
                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          id="currentPassword"
                          name="currentPassword"
                          label="Current Password"
                          required
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordFormik.values.currentPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                          error={passwordFormik.touched.currentPassword && Boolean(passwordFormik.errors.currentPassword)}
                          helperText={passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword}
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
                          id="newPassword"
                          name="newPassword"
                          label="New Password"
                          required
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordFormik.values.newPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                          error={passwordFormik.touched.newPassword && Boolean(passwordFormik.errors.newPassword)}
                          helperText={(passwordFormik.touched.newPassword && passwordFormik.errors.newPassword) || 'Min 8 characters'}
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
                          id="confirmPassword"
                          name="confirmPassword"
                          label="Confirm New Password"
                          required
                          type="password"
                          value={passwordFormik.values.confirmPassword}
                          onChange={passwordFormik.handleChange}
                          onBlur={passwordFormik.handleBlur}
                          error={passwordFormik.touched.confirmPassword && Boolean(passwordFormik.errors.confirmPassword)}
                          helperText={passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                          <Button
                            onClick={() => {
                              passwordFormik.resetForm();
                              setShowPasswordForm(false);
                              setErrorMessage('');
                            }}
                            color="inherit"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isChangingPassword || passwordFormik.isSubmitting}
                          >
                            {isChangingPassword || passwordFormik.isSubmitting ? 'Changing...' : 'Update Password'}
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
