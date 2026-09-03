import { useSnackbar } from 'notistack';

/** Shape of the error body the API returns (see ExceptionHandlingMiddleware). */
interface ApiErrorBody {
  message?: string;
  error?: string;
  errors?: Array<{ field?: string; message?: string }>;
}

/**
 * Extracts a human-readable message from an RTK Query error.
 *
 * The API returns `{ statusCode, message, errors[] }` for handled failures, and validation
 * failures carry per-field detail worth surfacing rather than a generic "failed".
 */
export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const data = (err as { data?: ApiErrorBody })?.data;
  const status = (err as { status?: number | string })?.status;

  if (data?.errors?.length) {
    const detail = data.errors
      .map((e) => (e.field ? `${e.field}: ${e.message}` : e.message))
      .filter(Boolean)
      .join('; ');
    if (detail) return detail;
  }

  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (status === 403) return 'You do not have permission to do that.';
  if (status === 409) return 'That action conflicts with the current state of this record.';
  if (status === 'FETCH_ERROR') return 'Cannot reach the server. Check your connection and try again.';

  return fallback;
}

/**
 * Wraps a mutation call so failures surface to the user instead of becoming an unhandled
 * promise rejection.
 *
 * Many screens previously called `.unwrap()` bare: on failure the dialog stayed open with no
 * message, and users re-clicked Save — risking duplicate payments and approvals.
 *
 * Returns true when the action succeeded, so callers can close dialogs conditionally.
 */
export function useMutationHandler() {
  const { enqueueSnackbar } = useSnackbar();

  return async function run(
    action: () => Promise<unknown>,
    options?: { success?: string; failure?: string; onSuccess?: () => void },
  ): Promise<boolean> {
    try {
      await action();
      if (options?.success) {
        enqueueSnackbar(options.success, { variant: 'success' });
      }
      options?.onSuccess?.();
      return true;
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, options?.failure), { variant: 'error' });
      return false;
    }
  };
}
