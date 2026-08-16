import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegisterMutation } from '@/features/auth/api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/authSlice';

const registerValidationSchema = Yup.object({
  companyName: Yup.string()
    .min(2, 'Company name must be at least 2 characters.')
    .required('Company name is required.'),
  subdomain: Yup.string()
    .matches(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens allowed.')
    .min(2, 'Subdomain must be at least 2 characters.')
    .required('Subdomain is required.'),
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters.')
    .required('First name is required.'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters.')
    .required('Last name is required.'),
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email address is required.'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters.')
    .required('Password is required.'),
  contactPhone: Yup.string().optional(),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      companyName: '',
      subdomain: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      contactPhone: '',
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setError('');
      try {
        const result = await register(values).unwrap();
        dispatch(setCredentials(result));
        navigate('/');
      } catch (err: unknown) {
        const apiErr = err as { data?: { error?: string } };
        setError(apiErr.data?.error ?? 'Registration failed. Please try again.');
      }
    },
  });

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      py={4}
    >
      <Card sx={{ maxWidth: 560, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <ConstructionIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              Create Account
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Register your company to get started
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="companyName"
                  name="companyName"
                  label="Company Name"
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                  helperText={formik.touched.companyName && formik.errors.companyName}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="subdomain"
                  name="subdomain"
                  label="Subdomain"
                  value={formik.values.subdomain}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.subdomain && Boolean(formik.errors.subdomain)}
                  helperText={(formik.touched.subdomain && formik.errors.subdomain) || 'Only lowercase letters, numbers, and hyphens'}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={(formik.touched.password && formik.errors.password) || 'Min 8 chars, with upper, lower, number & special char'}
                  required
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="contactPhone"
                  name="contactPhone"
                  label="Contact Phone (optional)"
                  value={formik.values.contactPhone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading || formik.isSubmitting}
            >
              {isLoading || formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <Typography textAlign="center" variant="body2">
            Already have an account?{' '}
            <Typography
              component={Link}
              to="/login"
              variant="body2"
              color="primary"
              fontWeight={600}
              sx={{ textDecoration: 'none' }}
            >
              Sign In
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
