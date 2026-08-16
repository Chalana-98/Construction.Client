import React from 'react';
import { Box, Typography, Button, type SxProps, type Theme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon = <AddIcon />,
  sx,
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      flexGrow={1}
      py={{ xs: 8, sm: 10, md: 14 }}
      px={3}
      sx={{
        width: '100%',
        minHeight: '100%',
        ...sx,
      }}
    >
      {/* Centered Circular Icon Badge */}
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(66, 165, 245, 0.12)' : 'rgba(21, 101, 192, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
          color: 'primary.main',
          '& svg': {
            fontSize: 30,
            color: 'primary.main',
          },
        }}
      >
        {icon ?? <InboxOutlinedIcon />}
      </Box>

      {/* Title */}
      <Typography
        variant="h6"
        fontWeight={700}
        color="text.primary"
        sx={{
          mb: description ? 1 : 2.5,
          fontSize: { xs: '1.05rem', sm: '1.2rem' },
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </Typography>

      {/* Description */}
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 440,
            mb: actionLabel && onAction ? 3.5 : 0,
            lineHeight: 1.55,
            fontSize: '0.875rem',
          }}
        >
          {description}
        </Typography>
      )}

      {/* Action Button (Shown only when in empty state) */}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={actionIcon}
          onClick={onAction}
          sx={{
            mt: description ? 0 : 2,
            px: 3.5,
            py: 1.1,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.875rem',
            boxShadow: '0 2px 8px rgba(21, 101, 192, 0.25)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(21, 101, 192, 0.35)',
            },
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
