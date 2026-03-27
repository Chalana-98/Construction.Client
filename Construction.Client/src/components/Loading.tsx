import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
  readonly message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={300}
      gap={2}
    >
      <CircularProgress size={40} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}
