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
import { useRegisterMutation } from '@/features/auth/api';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/authSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({
    companyName: '',
    subdomain: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    contactPhone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');
    register(form).unwrap().then((result) => {
      dispatch(setCredentials(result));
      navigate('/');
    }).catch((err: unknown) => {
      const apiErr = err as { data?: { error?: string } };
      setError(apiErr.data?.error ?? 'Registration failed. Please try again.');
    });
  };

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

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={form.companyName}
                  onChange={update('companyName')}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Subdomain"
                  value={form.subdomain}
                  onChange={update('subdomain')}
                  required
                  helperText="Only lowercase letters, numbers and hyphens"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={form.firstName}
                  onChange={update('firstName')}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={form.lastName}
                  onChange={update('lastName')}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  required
                  helperText="Min 8 chars, with upper, lower, number & special char"
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
                  label="Contact Phone (optional)"
                  value={form.contactPhone}
                  onChange={update('contactPhone')}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
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
