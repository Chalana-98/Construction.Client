import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, InputAdornment, IconButton, Divider, Chip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ConstructionIcon from '@mui/icons-material/Construction';
import BoltIcon from '@mui/icons-material/Bolt';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLoginMutation } from '@/features/auth/api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/authSlice';
import type { AuthResponse } from '@/types';

// ─── Demo bypass — no backend needed ────────────────────────────────────────
const DEMO_AUTH: AuthResponse = {
  token: 'demo-token',
  userId: 'demo-user-id',
  email: 'demo@constructiontracker.dev',
  fullName: 'Demo User',
  role: 'Admin',
  tenantId: 'demo-tenant',
  companyName: 'Demo Construction Co.',
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};
// ────────────────────────────────────────────────────────────────────────────

const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address.')
    .required('Email address is required.'),
  password: Yup.string()
    .required('Password is required.'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      setError('');
      try {
        const result = await login(values).unwrap();
        dispatch(setCredentials(result));
        navigate('/');
      } catch (err: unknown) {
        const apiErr = err as { data?: { error?: string } };
        setError(apiErr.data?.error ?? 'Login failed. Please check your credentials.');
      }
    },
  });

  const handleDemoLogin = () => {
    dispatch(setCredentials(DEMO_AUTH));
    navigate('/');
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Card sx={{ maxWidth: 440, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <ConstructionIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h5" fontWeight={700}>
              ConstructionTracker
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Sign in to your account
            </Typography>
          </Box>

          {/* ── Demo Banner ── */}
          <Box
            sx={{
              mb: 2, p: 1.5, borderRadius: 2,
              bgcolor: 'warning.light', border: '1px dashed',
              borderColor: 'warning.main', textAlign: 'center',
            }}
          >
            <Typography variant="body2" fontWeight={600} color="warning.dark" mb={1}>
              🚧 Just want to explore?
            </Typography>
            <Button
              fullWidth variant="contained" color="warning" size="large"
              startIcon={<BoltIcon />} onClick={handleDemoLogin}
              sx={{ py: 1.2, fontWeight: 700, fontSize: '1rem' }}
            >
              Continue as Demo (No Login Required)
            </Button>
            <Typography variant="caption" color="warning.dark" sx={{ mt: 0.5, display: 'block' }}>
              All UI features enabled · No data will be saved to backend
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Chip label="or sign in with your account" size="small" />
          </Divider>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={formik.handleSubmit}>
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
              margin="normal"
              required
              autoFocus
            />
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
              helperText={formik.touched.password && formik.errors.password}
              margin="normal"
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
            <Button
              type="submit" fullWidth variant="outlined" size="large"
              sx={{ mt: 3, mb: 2, py: 1.5 }} disabled={isLoading || formik.isSubmitting}
            >
              {isLoading || formik.isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Typography textAlign="center" variant="body2">
            Don't have an account?{' '}
            <Typography
              component={Link} to="/register" variant="body2"
              color="primary" fontWeight={600} sx={{ textDecoration: 'none' }}
            >
              Register
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
