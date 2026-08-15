import { Box, Typography, Breadcrumbs, Link as MuiLink, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly breadcrumbs?: readonly BreadcrumbItem[];
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly children?: React.ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  actionLabel,
  onAction,
  children,
}: PageHeaderProps) {
  return (
    <Box mb={3}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs sx={{ mb: 1 }}>
          {breadcrumbs.map((crumb) =>
            crumb.href ? (
              <MuiLink
                key={crumb.label}
                component={Link}
                to={crumb.href}
                underline="hover"
                color="inherit"
                fontSize={14}
              >
                {crumb.label}
              </MuiLink>
            ) : (
              <Typography key={crumb.label} color="text.primary" fontSize={14}>
                {crumb.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          {children}
          {actionLabel && onAction && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
