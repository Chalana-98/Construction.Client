import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import DashboardPage from '@/features/dashboard/DashboardPage';
import ProjectsPage from '@/features/projects/ProjectsPage';
import DailyLogsPage from './features/daily-logs/DailyLogsPage';
import DocumentsPage from './features/documents/DocumentsPage';
import EquipmentPage from './features/equipment/EquipmentPage';
import ExpensesPage from './features/expenses/ExpensesPage';
import IssuesPage from './features/issues/IssuesPage';
import MaterialsPage from './features/materials/MaterialsPage';
import MilestonesPage from './features/milestones/MilestonesPage';
import ProjectDetailPage from './features/projects/ProjectDetailPage';
import TasksPage from './features/tasks/TasksPage';
import TeamPage from './features/team/TeamPage';



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="daily-logs" element={<DailyLogsPage />} />
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="milestones" element={<MilestonesPage />} />
          <Route path="issues" element={<IssuesPage />} />
          <Route path="team" element={<TeamPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
