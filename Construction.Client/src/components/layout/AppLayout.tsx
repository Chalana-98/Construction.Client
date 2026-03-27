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
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
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
import FlagIcon from '@mui/icons-material/Flag';
import BugReportIcon from '@mui/icons-material/BugReport';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import BoltIcon from '@mui/icons-material/Bolt';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';

const DRAWER_WIDTH = 260;

const navItems = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/projects', label: 'Projects', icon: <BusinessIcon /> },
  { path: '/tasks', label: 'My Tasks', icon: <TaskAltIcon /> },
  { path: '/team', label: 'Team', icon: <PeopleIcon /> },
  { path: '/daily-logs', label: 'Daily Logs', icon: <CalendarMonthIcon /> },
  { path: '/expenses', label: 'Expenses', icon: <AttachMoneyIcon /> },
  { path: '/equipment', label: 'Equipment', icon: <ConstructionIcon /> },
  { path: '/materials', label: 'Materials', icon: <InventoryIcon /> },
  { path: '/documents', label: 'Documents', icon: <DescriptionIcon /> },
  { path: '/milestones', label: 'Milestones', icon: <FlagIcon /> },
  { path: '/issues', label: 'Issues & RFIs', icon: <BugReportIcon /> },
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

      <List sx={{ px: 1, pt: 1 }}>
        {navItems.map((item) => {
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={isActive}
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
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box flex={1} />
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
            <MenuItem onClick={() => { setAnchorEl(null); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Profile
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
