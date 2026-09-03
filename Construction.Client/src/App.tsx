import { lazy, Suspense } from 'react';
import Loading from '@/components/Loading';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import DashboardPage from '@/features/dashboard/DashboardPage';

// Route-level code splitting: only the screens actually visited are downloaded.
const ProjectsPage = lazy(() => import('@/features/projects/ProjectsPage'));
const DailyLogsPage = lazy(() => import('./features/daily-logs/DailyLogsPage'));
const DocumentsPage = lazy(() => import('./features/documents/DocumentsPage'));
const EquipmentPage = lazy(() => import('./features/equipment/EquipmentPage'));
const ExpensesPage = lazy(() => import('./features/expenses/ExpensesPage'));
const IssuesPage = lazy(() => import('./features/issues/IssuesPage'));
const MaterialsPage = lazy(() => import('./features/materials/MaterialsPage'));
const MilestonesPage = lazy(() => import('./features/milestones/MilestonesPage'));
const ProjectDetailPage = lazy(() => import('./features/projects/ProjectDetailPage'));
const TasksPage = lazy(() => import('./features/tasks/TasksPage'));
const TeamPage = lazy(() => import('./features/team/TeamPage'));
const RFIsPage = lazy(() => import('./features/rfis/RFIsPage'));
const ChangeOrdersPage = lazy(() => import('./features/change-orders/ChangeOrdersPage'));
const VendorsPage = lazy(() => import('./features/vendors/VendorsPage'));
const TimesheetsPage = lazy(() => import('./features/timesheets/TimesheetsPage'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));
const CostControlPage = lazy(() => import('./features/cost-control/CostControlPage'));
const WbsPage = lazy(() => import('./features/wbs/WbsPage'));
const ProcurementPage = lazy(() => import('./features/procurement/ProcurementPage'));
const PurchaseOrdersPage = lazy(() => import('./features/purchase-orders/PurchaseOrdersPage'));
const MaterialRequestsPage = lazy(() => import('./features/material-requests/MaterialRequestsPage'));
const InventoryLedgerPage = lazy(() => import('./features/inventory-ledger/InventoryLedgerPage'));
const PhysicalProgressPage = lazy(() => import('./features/physical-progress/PhysicalProgressPage'));
const ScheduleGanttPage = lazy(() => import('./features/schedule/ScheduleGanttPage'));
const ProjectBillingPage = lazy(() => import('./features/billing/ProjectBillingPage'));
const SafetyPage = lazy(() => import('./features/safety/SafetyPage'));
const QualityPage = lazy(() => import('./features/quality/QualityPage'));
const SubcontractsPage = lazy(() => import('./features/subcontracts/SubcontractsPage'));
const ApprovalsPage = lazy(() => import('./features/approvals/ApprovalsPage'));
const KpiDashboardPage = lazy(() => import('./features/kpi-dashboard/KpiDashboardPage'));
const EquipmentMaintenancePage = lazy(() => import('./features/equipment-maintenance/EquipmentMaintenancePage'));

// Enterprise Construction ERP Modules

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

