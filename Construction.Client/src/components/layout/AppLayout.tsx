import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ConstructionIcon from '@mui/icons-material/Construction';
import InventoryIcon from '@mui/icons-material/Inventory';
import DescriptionIcon from '@mui/icons-material/Description';
import BugReportIcon from '@mui/icons-material/BugReport';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BoltIcon from '@mui/icons-material/Bolt';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EditNoteIcon from '@mui/icons-material/EditNote';
import StoreIcon from '@mui/icons-material/Store';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import SpeedIcon from '@mui/icons-material/Speed';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import TextField from '@mui/material/TextField';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useActiveProject } from '@/utils/useActiveProject';
import { logout } from '@/store/authSlice';

const DRAWER_WIDTH = 260;

/**
 * Navigation grouped by the role that uses it. A flat list of 30 items could not fit any
 * laptop viewport, so daily field screens sat below the fold alongside quarterly commercial ones.
 */
const navGroups: ReadonlyArray<{ heading: string | null; items: { path: string; label: string; icon: React.ReactNode }[] }> = [
  {
    heading: null,
    items: [
      { path: '/', label: 'Overview', icon: <DashboardIcon /> },
      { path: '/kpi-dashboard', label: 'KPI Dashboard', icon: <AssessmentIcon /> },
      { path: '/approvals', label: 'Approvals Inbox', icon: <HowToRegIcon /> },
    ],
  },
  {
    heading: 'Planning',
    items: [
      { path: '/projects', label: 'Projects', icon: <BusinessIcon /> },
      { path: '/wbs', label: 'Work Breakdown', icon: <AccountTreeIcon /> },
      { path: '/cost-control', label: 'Cost Codes & Budget', icon: <PriceCheckIcon /> },
      { path: '/schedule', label: 'Schedule', icon: <ViewTimelineIcon /> },
    ],
  },
  {
    heading: 'Site',
    items: [
      { path: '/daily-logs', label: 'Daily Logs', icon: <CalendarMonthIcon /> },
      { path: '/tasks', label: 'Tasks', icon: <TaskAltIcon /> },
      { path: '/physical-progress', label: 'Physical Progress', icon: <SpeedIcon /> },
      { path: '/issues', label: 'Site Issues', icon: <BugReportIcon /> },
      { path: '/rfis', label: 'RFIs', icon: <QuestionAnswerIcon /> },
      { path: '/safety', label: 'Safety', icon: <HealthAndSafetyIcon /> },
      { path: '/quality', label: 'Quality', icon: <FactCheckIcon /> },
    ],
  },
  {
    heading: 'Supply chain',
    items: [
      { path: '/material-requests', label: 'Material Requests', icon: <MoveToInboxIcon /> },
      { path: '/procurement', label: 'Procurement Requests', icon: <ShoppingCartIcon /> },
      { path: '/purchase-orders', label: 'Purchase Orders', icon: <ReceiptLongIcon /> },
      { path: '/inventory-ledger', label: 'Inventory Ledger', icon: <WarehouseIcon /> },
      { path: '/materials', label: 'Material Catalog', icon: <InventoryIcon /> },
      { path: '/vendors', label: 'Vendors', icon: <StoreIcon /> },
    ],
  },
  {
    heading: 'Commercial',
    items: [
      { path: '/billing', label: 'Project Billing', icon: <RequestQuoteIcon /> },
      { path: '/expenses', label: 'Expenses', icon: <AttachMoneyIcon /> },
      { path: '/change-orders', label: 'Change Orders', icon: <EditNoteIcon /> },
      { path: '/subcontracts', label: 'Subcontracts', icon: <HandshakeIcon /> },
      { path: '/timesheets', label: 'Timesheets', icon: <AccessTimeIcon /> },
    ],
  },
  {
    heading: 'Resources',
    items: [
      { path: '/equipment', label: 'Equipment', icon: <ConstructionIcon /> },
      { path: '/equipment-maintenance', label: 'Asset Maintenance', icon: <BuildCircleIcon /> },
      { path: '/team', label: 'Team', icon: <PeopleIcon /> },
      { path: '/documents', label: 'Documents', icon: <DescriptionIcon /> },
      { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
    ],
  },
];


export default function AppLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const settings = useAppSelector((s) => s.settings);
  const { activeProjectId, projects, selectProject } = useActiveProject();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <ConstructionIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
            ConstructionTracker
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Project Management
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 1, pt: 1 }} component="nav" aria-label="Main navigation">
        {navGroups.map((group) => (
          <Box key={group.heading ?? 'primary'} component="li" sx={{ listStyle: 'none' }}>
            {group.heading && (
              <ListSubheader
                disableSticky
                sx={{
                  bgcolor: 'transparent',
                  lineHeight: 2.2,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  mt: 1.5,
                }}
              >
                {group.heading}
              </ListSubheader>
            )}
            <List disablePadding>
              {group.items.map((item) => {
                // Exact match, or a true path segment. A `startsWith` test made
                // /equipment-maintenance also highlight /equipment.
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path + '/'));

                return (
                  <ListItemButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    selected={isActive}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => isMobile && setMobileOpen(false)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.3,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '& .MuiListItemIcon-root': { color: 'white' },
                        '&:hover': { backgroundColor: 'primary.dark' },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      slotProps={{ primary: { fontSize: 14, fontWeight: isActive ? 600 : 400 } }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Global project context. Every project-scoped screen reads from this one selection,
              so it no longer resets when navigating between modules. */}
          <TextField
            select
            size="small"
            value={activeProjectId || ''}
            onChange={(e) => selectProject(e.target.value)}
            aria-label="Active project"
            sx={{ minWidth: { xs: 150, sm: 260 }, mr: 2 }}
            slotProps={{ input: { 'aria-label': 'Active project' } }}
          >
            {projects.length === 0 && (
              <MenuItem value="" disabled>
                No projects yet
              </MenuItem>
            )}
            {projects.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.projectCode ? `${p.projectCode} — ${p.name}` : p.name}
              </MenuItem>
            ))}
          </TextField>

          <Box flex={1} />
          <Chip
            icon={<CurrencyExchangeIcon fontSize="small" />}
            label={`${settings?.currencySymbol || 'Rs.'} (${settings?.currency || 'LKR'})`}
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => navigate('/settings')}
            // Shown on mobile too: hiding it left money on screen with no currency indicator.
            sx={{ mr: 2, fontWeight: 600, cursor: 'pointer' }}
          />
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box px={2} py={1}>
              <Typography fontWeight={600}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography variant="caption" color="primary">
                {user?.role}
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}>
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '64px',
          bgcolor: 'background.default',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* Demo Mode Banner */}
        {user?.email === 'demo@constructiontracker.dev' && (
          <Box
            sx={{
              mb: 2, px: 2, py: 1, borderRadius: 2, display: 'flex',
              alignItems: 'center', gap: 1.5,
              bgcolor: 'warning.light', border: '1px dashed', borderColor: 'warning.main',
            }}
          >
            <BoltIcon color="warning" fontSize="small" />
            <Typography variant="body2" fontWeight={600} color="warning.dark" flex={1}>
              Demo Mode — You are browsing with mock credentials. API calls may return empty data.
            </Typography>
            <Typography
              variant="caption" color="warning.dark" fontWeight={700}
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={handleLogout}
            >
              Exit Demo
            </Typography>
          </Box>
        )}
        <Outlet />
      </Box>
    </Box>
  );
}
