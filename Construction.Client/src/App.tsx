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
import RFIsPage from './features/rfis/RFIsPage';
import ChangeOrdersPage from './features/change-orders/ChangeOrdersPage';
import VendorsPage from './features/vendors/VendorsPage';
import TimesheetsPage from './features/timesheets/TimesheetsPage';
import ProfilePage from './features/profile/ProfilePage';
import SettingsPage from './features/settings/SettingsPage';

// Enterprise Construction ERP Modules
import CostControlPage from './features/cost-control/CostControlPage';
import WbsPage from './features/wbs/WbsPage';
import ProcurementPage from './features/procurement/ProcurementPage';
import PurchaseOrdersPage from './features/purchase-orders/PurchaseOrdersPage';
import MaterialRequestsPage from './features/material-requests/MaterialRequestsPage';
import InventoryLedgerPage from './features/inventory-ledger/InventoryLedgerPage';
import PhysicalProgressPage from './features/physical-progress/PhysicalProgressPage';
import ScheduleGanttPage from './features/schedule/ScheduleGanttPage';
import ProjectBillingPage from './features/billing/ProjectBillingPage';
import SafetyPage from './features/safety/SafetyPage';
import QualityPage from './features/quality/QualityPage';
import SubcontractsPage from './features/subcontracts/SubcontractsPage';
import ApprovalsPage from './features/approvals/ApprovalsPage';
import KpiDashboardPage from './features/kpi-dashboard/KpiDashboardPage';
import EquipmentMaintenancePage from './features/equipment-maintenance/EquipmentMaintenancePage';

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
          <Route path="kpi-dashboard" element={<KpiDashboardPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="wbs" element={<WbsPage />} />
          <Route path="cost-control" element={<CostControlPage />} />
          <Route path="schedule" element={<ScheduleGanttPage />} />
          <Route path="physical-progress" element={<PhysicalProgressPage />} />
          <Route path="procurement" element={<ProcurementPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="material-requests" element={<MaterialRequestsPage />} />
          <Route path="inventory-ledger" element={<InventoryLedgerPage />} />
          <Route path="billing" element={<ProjectBillingPage />} />
          <Route path="subcontracts" element={<SubcontractsPage />} />
          <Route path="safety" element={<SafetyPage />} />
          <Route path="quality" element={<QualityPage />} />
          <Route path="equipment-maintenance" element={<EquipmentMaintenancePage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="daily-logs" element={<DailyLogsPage />} />
          <Route path="equipment" element={<EquipmentPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="milestones" element={<MilestonesPage />} />
          <Route path="issues" element={<IssuesPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="rfis" element={<RFIsPage />} />
          <Route path="change-orders" element={<ChangeOrdersPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="timesheets" element={<TimesheetsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

