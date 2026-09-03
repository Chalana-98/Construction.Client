import type { FetchArgs } from '@reduxjs/toolkit/query';
import { DEMO_MOCK_DATA } from './demoMockData';

/**
 * Fixture-backed request handler for demo mode.
 *
 * Kept in its own module so that `store/api.ts` can import it dynamically behind an
 * `import.meta.env.DEV` guard — that keeps the fixtures (and the bypass they enable) out of
 * production bundles entirely.
 *
 * Reads fall back to an empty paged result rather than a bare `{ success: true }`, because the
 * previous stub returned an object with no `items` array, which left every enterprise module
 * rendering permanently empty in demo mode.
 */
const EMPTY_PAGE = {
  items: [],
  totalCount: 0,
  page: 1,
  pageSize: 20,
  totalPages: 0,
  hasPreviousPage: false,
  hasNextPage: false,
};

export async function demoBaseQuery(args: string | FetchArgs): Promise<{ data: unknown }> {
  const url = typeof args === 'string' ? args : args.url;
  const method = typeof args === 'string' ? 'GET' : (args.method ?? 'GET');

  if (method === 'GET') {
    for (const [pattern, data] of Object.entries(DEMO_MOCK_DATA)) {
      if (url.startsWith(pattern)) {
        return { data };
      }
    }
    // No fixture for this endpoint: return a well-formed empty page so list screens render
    // their empty state instead of breaking on a missing `items` array.
    return { data: EMPTY_PAGE };
  }

  return { data: { success: true, message: 'Demo mode: changes are not persisted.' } };
}
