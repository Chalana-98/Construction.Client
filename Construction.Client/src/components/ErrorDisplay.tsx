import { Alert, Box, Button, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorDisplayProps {
  readonly message?: string;
  readonly onRetry?: () => void;
}

export default function ErrorDisplay({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorDisplayProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={300}
      gap={2}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
      <Typography variant="h6" color="text.secondary">
        Oops!
      </Typography>
      <Alert severity="error" sx={{ maxWidth: 500 }}>
        {message}
      </Alert>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
}
