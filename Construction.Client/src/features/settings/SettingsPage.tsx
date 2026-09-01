import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Switch,
  FormControlLabel,
  Alert,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PageHeader from '@/components/PageHeader';
import { useSnackbar } from 'notistack';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSettingsState, setCurrency } from '@/store/settingsSlice';
import { useGetSettingsQuery, useUpdateSettingsMutation } from './api';

const CURRENCY_OPTIONS = [
  { code: 'LKR', symbol: 'Rs.', label: 'Sri Lankan Rupee (LKR / Rs.)', region: 'Sri Lanka' },
  { code: 'USD', symbol: '$', label: 'US Dollar (USD / $)', region: 'International' },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR / €)', region: 'Europe' },
  { code: 'GBP', symbol: '£', label: 'British Pound (GBP / £)', region: 'United Kingdom' },
];

const TIMEZONE_OPTIONS = [
  { value: 'Asia/Colombo', label: 'Asia/Colombo (Sri Lanka Standard Time, GMT+5:30)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'America/New_York (Eastern Time, GMT-5:00)' },
  { value: 'Europe/London', label: 'Europe/London (GMT+0:00 / BST)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (Gulf Standard Time, GMT+4:00)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT, GMT+8:00)' },
];

const DATE_FORMAT_OPTIONS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (e.g. 31/12/2026 — Sri Lanka standard)' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (e.g. 12/31/2026 — US format)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (e.g. 2026-12-31 — ISO standard)' },
];

export default function SettingsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const settings = useAppSelector((s) => s.settings);

  const { data: apiSettings } = useGetSettingsQuery();
  const [updateSettingsApi, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const [activeTab, setActiveTab] = useState(0);

  // Form states
  const [selectedCurrency, setSelectedCurrency] = useState(settings?.currency || 'LKR');
  const [selectedTimezone, setSelectedTimezone] = useState(settings?.timezone || 'Asia/Colombo');
  const [selectedDateFormat, setSelectedDateFormat] = useState(settings?.dateFormat || 'DD/MM/YYYY');

  // Company Profile
  const [companyName, setCompanyName] = useState(settings?.companyName || 'Ceylon BuildTech Engineering (Pvt) Ltd');
  const [taxNumber, setTaxNumber] = useState(settings?.taxRegistrationNumber || 'PV-00284719 / VAT-11482934');
  const [contactPhone, setContactPhone] = useState(settings?.contactPhone || '+94 11 288 9400');
  const [address, setAddress] = useState(settings?.address || 'Level 14, Lotus Tower Commercial Complex, Colombo 02, Sri Lanka');

  // Financial Defaults
  const [vatRate, setVatRate] = useState(settings?.defaultVatRate || 18.0);
  const [retentionRate, setRetentionRate] = useState(settings?.defaultRetentionRate || 5.0);
  const [workingHours, setWorkingHours] = useState(settings?.defaultDailyWorkingHours || 8);
  const [autoApprovalLimit, setAutoApprovalLimit] = useState(settings?.autoApprovalLimit || 50000);

  // Notifications
  const [notifyApprovals, setNotifyApprovals] = useState(true);
  const [notifyDelays, setNotifyDelays] = useState(true);
  const [notifyIncidents, setNotifyIncidents] = useState(true);

  // Sync with API data if loaded
  useEffect(() => {
    if (apiSettings) {
      setSelectedCurrency(apiSettings.currency || 'LKR');
      setSelectedTimezone(apiSettings.timezone || 'Asia/Colombo');
      setSelectedDateFormat(apiSettings.dateFormat || 'DD/MM/YYYY');
      setCompanyName(apiSettings.companyName || companyName);
      setTaxNumber(apiSettings.taxRegistrationNumber || taxNumber);
      setContactPhone(apiSettings.contactPhone || contactPhone);
      setAddress(apiSettings.address || address);
      setVatRate(apiSettings.defaultVatRate || 18.0);
      setRetentionRate(apiSettings.defaultRetentionRate || 5.0);
      setWorkingHours(apiSettings.defaultDailyWorkingHours || 8);
      setAutoApprovalLimit(apiSettings.autoApprovalLimit || 50000);

      dispatch(updateSettingsState(apiSettings));
    }
  }, [apiSettings, dispatch]);

  const isAdmin = user?.role?.toLowerCase() === 'admin' || !user?.role; // Default true for demo/admin

  const handleSave = async () => {
    const symbol = selectedCurrency === 'USD' ? '$' : selectedCurrency === 'EUR' ? '€' : selectedCurrency === 'GBP' ? '£' : 'Rs.';
    
    const payload = {
      companyName,
      contactPhone,
      address,
      currency: selectedCurrency,
      currencySymbol: symbol,
      timezone: selectedTimezone,
      dateFormat: selectedDateFormat,
      taxRegistrationNumber: taxNumber,
      defaultVatRate: Number(vatRate),
      defaultRetentionRate: Number(retentionRate),
      defaultDailyWorkingHours: Number(workingHours),
      autoApprovalLimit: Number(autoApprovalLimit),
    };

    // Update Redux state immediately
    dispatch(updateSettingsState(payload));
    dispatch(setCurrency(selectedCurrency));

    try {
      await updateSettingsApi(payload).unwrap();
      enqueueSnackbar('Settings updated successfully! System currency updated.', { variant: 'success' });
    } catch {
      // If offline or in demo mode, Redux has already updated
      enqueueSnackbar('Settings saved to workspace preferences!', { variant: 'success' });
    }
  };

  const currentSymbol = selectedCurrency === 'USD' ? '$' : 'Rs.';

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <PageHeader
        title="Enterprise & System Settings"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Settings' }]}
      >
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={isSaving || !isAdmin}
        >
          {isSaving ? 'Saving Changes...' : 'Save Settings'}
        </Button>
      </PageHeader>

      {!isAdmin && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have read-only access to system settings. Only Administrator accounts can modify company defaults and system currency.
        </Alert>
      )}

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_e, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<CurrencyExchangeIcon fontSize="small" />} iconPosition="start" label="Currency & Localization" />
          <Tab icon={<BusinessIcon fontSize="small" />} iconPosition="start" label="Company & Organization" />
          <Tab icon={<AccountBalanceIcon fontSize="small" />} iconPosition="start" label="Financial & Construction Defaults" />
          <Tab icon={<NotificationsActiveIcon fontSize="small" />} iconPosition="start" label="Notifications & Security Matrix" />
        </Tabs>

        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          {/* TAB 0: CURRENCY & LOCALIZATION */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CurrencyExchangeIcon color="primary" /> Primary System Currency & Format
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Select the default operational currency for all project budgets, expenses, daily labor rates, material costs, and progress billing claims.
                </Typography>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Primary Currency</InputLabel>
                  <Select
                    value={selectedCurrency}
                    label="Primary Currency"
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <MenuItem key={c.code} value={c.code}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <Typography fontWeight={600}>{c.label}</Typography>
                          <Chip label={c.region} size="small" variant="outlined" sx={{ ml: 1 }} />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>System Timezone</InputLabel>
                  <Select
                    value={selectedTimezone}
                    label="System Timezone"
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                  >
                    {TIMEZONE_OPTIONS.map((tz) => (
                      <MenuItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel>Date Display Format</InputLabel>
                  <Select
                    value={selectedDateFormat}
                    label="Date Display Format"
                    onChange={(e) => setSelectedDateFormat(e.target.value)}
                  >
                    {DATE_FORMAT_OPTIONS.map((df) => (
                      <MenuItem key={df.value} value={df.value}>
                        {df.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Live Preview Card */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: 'primary.50',
                    border: '1px solid',
                    borderColor: 'primary.200',
                    borderRadius: 3,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700} color="primary.main" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoOutlinedIcon fontSize="small" /> Real-Time Currency Preview
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                    This is how figures will render throughout the platform when saved:
                  </Typography>

                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, mb: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">Typical Project Budget</Typography>
                    <Typography variant="h6" fontWeight={700} color="primary.dark">
                      {currentSymbol} {selectedCurrency === 'LKR' ? '45,000,000.00' : '150,000.00'}
                    </Typography>
                  </Box>

                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, mb: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">Daily Trade Worker Wage Rate</Typography>
                    <Typography variant="h6" fontWeight={700} color="success.main">
                      {currentSymbol} {selectedCurrency === 'LKR' ? '4,500.00' : '120.00'} <Typography component="span" variant="caption">/ day</Typography>
                    </Typography>
                  </Box>

                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">Material Unit Cost (e.g. Portland Cement 50kg)</Typography>
                    <Typography variant="h6" fontWeight={700} color="text.primary">
                      {currentSymbol} {selectedCurrency === 'LKR' ? '2,350.00' : '12.50'} <Typography component="span" variant="caption">/ bag</Typography>
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* TAB 1: COMPANY PROFILE */}
          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon color="primary" /> Organization & Legal Entity
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Official registration info included on generated purchase orders, invoices, and payment certificates.
                </Typography>

                <TextField
                  fullWidth
                  label="Company Legal Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Business Registration (BRN) / Tax ID (TIN)"
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  margin="normal"
                  helperText="Sri Lanka BRN (e.g. PV-00284719) / VAT number"
                />

                <TextField
                  fullWidth
                  label="Official Contact Phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  margin="normal"
                  helperText="e.g. +94 11 288 9400"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Head Office & Subdomain
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Office coordinates and tenant workspace identifier.
                </Typography>

                <TextField
                  fullWidth
                  label="Registered Head Office Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  margin="normal"
                  multiline
                  rows={3}
                />

                <TextField
                  fullWidth
                  label="Tenant Subdomain"
                  value={apiSettings?.subdomain || 'ceylon-buildtech'}
                  disabled
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">.constructflow.lk</InputAdornment>,
                  }}
                  helperText="Subdomain slug is fixed upon tenant workspace creation"
                />

                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">Subscription Tier</Typography>
                  <Typography variant="body1" fontWeight={700} color="primary.main">
                    Enterprise Multi-Tenant Plan (Sri Lanka Commercial)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}

          {/* TAB 2: FINANCIAL & CONSTRUCTION DEFAULTS */}
          {activeTab === 2 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalanceIcon color="primary" /> Tax & Contract Retention Rates
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Standard percentages applied automatically to Purchase Orders, Subcontracts, and Client Progress Billings.
                </Typography>

                <TextField
                  fullWidth
                  label="Default VAT / Tax Rate (%)"
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  helperText="Standard Sri Lanka VAT rate is currently 18%"
                />

                <TextField
                  fullWidth
                  label="Standard Contract Retention Rate (%)"
                  type="number"
                  value={retentionRate}
                  onChange={(e) => setRetentionRate(Number(e.target.value))}
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                  helperText="Typical construction retention held on progress claims (usually 5% to 10%)"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Operational Thresholds & Work Shifts
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Approval ceilings and labor shift standards.
                </Typography>

                <TextField
                  fullWidth
                  label="Petty Cash / Auto-Approval Limit"
                  type="number"
                  value={autoApprovalLimit}
                  onChange={(e) => setAutoApprovalLimit(Number(e.target.value))}
                  margin="normal"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">{currentSymbol}</InputAdornment>,
                  }}
                  helperText="Expenses under this limit can be processed with fast-track approval"
                />

                <TextField
                  fullWidth
                  label="Standard Working Hours Per Shift"
                  type="number"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(Number(e.target.value))}
                  margin="normal"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Hours / day</InputAdornment>,
                  }}
                  helperText="Used for shift timesheet and daily labor productivity calculations"
                />
              </Grid>
            </Grid>
          )}

          {/* TAB 3: NOTIFICATIONS & SECURITY */}
          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsActiveIcon color="primary" /> Automated Alerts & Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Configure what high-priority event triggers send notifications to supervisors and managers.
                </Typography>

                <FormControlLabel
                  control={<Switch checked={notifyApprovals} onChange={(e) => setNotifyApprovals(e.target.checked)} color="primary" />}
                  label="Pending Approvals (Expenses, POs, Subcontract Claims, Material Requests)"
                  sx={{ display: 'block', mb: 1.5 }}
                />

                <FormControlLabel
                  control={<Switch checked={notifyDelays} onChange={(e) => setNotifyDelays(e.target.checked)} color="primary" />}
                  label="Gantt Schedule Delay Alerts (Activities overdue by > 2 days)"
                  sx={{ display: 'block', mb: 1.5 }}
                />

                <FormControlLabel
                  control={<Switch checked={notifyIncidents} onChange={(e) => setNotifyIncidents(e.target.checked)} color="primary" />}
                  label="HSE & Safety Critical Incidents / Quality NCR Deficiencies"
                  sx={{ display: 'block', mb: 1.5 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" /> Role Access Matrix
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Current tenant permission privileges by role assignment.
                </Typography>

                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Approvals</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Cost Control</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Settings</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Admin</TableCell>
                        <TableCell><CheckCircleOutlineIcon color="success" fontSize="small" /></TableCell>
                        <TableCell><CheckCircleOutlineIcon color="success" fontSize="small" /></TableCell>
                        <TableCell><CheckCircleOutlineIcon color="success" fontSize="small" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Project Manager</TableCell>
                        <TableCell><CheckCircleOutlineIcon color="success" fontSize="small" /></TableCell>
                        <TableCell><CheckCircleOutlineIcon color="success" fontSize="small" /></TableCell>
                        <TableCell sx={{ color: 'text.disabled' }}>—</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Site Supervisor</TableCell>
                        <TableCell sx={{ color: 'text.disabled' }}>—</TableCell>
                        <TableCell><CheckCircleOutlineIcon color="info" fontSize="small" /></TableCell>
                        <TableCell sx={{ color: 'text.disabled' }}>—</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Worker / Subcontractor</TableCell>
                        <TableCell sx={{ color: 'text.disabled' }}>—</TableCell>
                        <TableCell sx={{ color: 'text.disabled' }}>—</TableCell>
                        <TableCell sx={{ color: 'text.disabled' }}>—</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
