import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ProjectContextState {
  /** The project the user is currently working on, shared across every project-scoped screen. */
  activeProjectId: string | null;
  activeProjectName: string | null;
}

const initialState: ProjectContextState = {
  activeProjectId: localStorage.getItem('activeProjectId'),
  activeProjectName: localStorage.getItem('activeProjectName'),
};

/**
 * Holds the active project for the whole application.
 *
 * Previously each of ~20 screens kept its own `selectedProjectId` in local component state, so
 * the choice was lost on every navigation and each page independently refetched the project
 * list. Keeping it here means the selection survives navigation and reloads.
 */
const projectSlice = createSlice({
  name: 'projectContext',
  initialState,
  reducers: {
    setActiveProject: (
      state,
      action: PayloadAction<{ id: string; name?: string } | null>,
    ) => {
      if (!action.payload) {
        state.activeProjectId = null;
        state.activeProjectName = null;
        localStorage.removeItem('activeProjectId');
        localStorage.removeItem('activeProjectName');
        return;
      }

      state.activeProjectId = action.payload.id;
      state.activeProjectName = action.payload.name ?? null;
      localStorage.setItem('activeProjectId', action.payload.id);
      if (action.payload.name) {
        localStorage.setItem('activeProjectName', action.payload.name);
      } else {
        localStorage.removeItem('activeProjectName');
      }
    },
  },
});

export const { setActiveProject } = projectSlice.actions;
export default projectSlice.reducer;
