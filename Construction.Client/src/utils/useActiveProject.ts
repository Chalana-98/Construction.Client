import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setActiveProject } from '@/store/projectSlice';
import { useGetProjectsQuery } from '@/features/projects/api';

/**
 * Provides the project every project-scoped screen should operate on.
 *
 * Replaces the per-page `useState` selector that reset on each navigation. The choice is shared
 * app-wide and persisted, so moving from WBS to Cost Control to Billing keeps the same project.
 * When nothing is selected yet, the first project is adopted once and written to the store, so
 * the header reflects what the page is actually showing.
 */
export function useActiveProject() {
  const dispatch = useAppDispatch();
  const activeProjectId = useAppSelector((s) => s.projectContext.activeProjectId);

  const { data, isLoading } = useGetProjectsQuery({ page: 1, pageSize: 200 });

  // Memoised so the effect below does not re-run on every render when the query returns
  // undefined and the fallback array identity changes.
  const projects = useMemo(() => data?.items ?? [], [data]);

  // If the stored project is gone (deleted, or belongs to another tenant), fall back.
  const storedIsValid = activeProjectId
    ? projects.some((p) => p.id === activeProjectId)
    : false;

  useEffect(() => {
    if (isLoading || projects.length === 0) return;
    if (storedIsValid) return;

    const first = projects[0];
    dispatch(setActiveProject({ id: first.id, name: first.name }));
  }, [isLoading, projects, storedIsValid, dispatch]);

  const effectiveId = storedIsValid ? activeProjectId! : (projects[0]?.id ?? '');

  return {
    /** The project id to query with. Empty string when the tenant has no projects yet. */
    activeProjectId: effectiveId,
    activeProject: projects.find((p) => p.id === effectiveId),
    projects,
    isLoading,
    selectProject: (id: string) => {
      const project = projects.find((p) => p.id === id);
      dispatch(setActiveProject({ id, name: project?.name }));
    },
  };
}
