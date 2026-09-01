// ============================================
// Enums (matching backend C# enums)
// ============================================

export enum ProjectStatus {
  Planning = 0,
  Approved = 1,
  InProgress = 2,
  OnHold = 3,
  Completed = 4,
  Cancelled = 5,
}

export enum TaskStatus {
  NotStarted = 0,
  InProgress = 1,
  OnHold = 2,
  Completed = 3,
  Cancelled = 4,
  Blocked = 5,
}

export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

export enum IssuePriority {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

export enum IssueStatus {
  Open = 0,
  UnderReview = 1,
  InProgress = 2,
  Resolved = 3,
  Closed = 4,
  Rejected = 5,
}

export enum IssueType {
  General = 0,
  Safety = 1,
  Quality = 2,
  Design = 3,
  Material = 4,
  Equipment = 5,
  Weather = 6,
  RFI = 7,
  ChangeOrder = 8,
}

export enum ExpenseCategory {
  Labor = 0,
  Materials = 1,
  Equipment = 2,
  Subcontractor = 3,
  Permits = 4,
  Insurance = 5,
  Transportation = 6,
  Utilities = 7,
  Administrative = 8,
  Other = 9,
}

export enum EquipmentStatus {
  Available = 0,
  InUse = 1,
  UnderMaintenance = 2,
  OutOfService = 3,
  Retired = 4,
}

export enum DocumentType {
  Contract = 0,
  Blueprint = 1,
  Permit = 2,
  Inspection = 3,
  Safety = 4,
  Photo = 5,
  MeetingMinutes = 6,
  ChangeOrder = 7,
  Invoice = 8,
  Specification = 9,
  Other = 10,
}

export enum WeatherCondition {
  Clear = 0,
  PartlyCloudy = 1,
  Cloudy = 2,
  LightRain = 3,
  HeavyRain = 4,
  Snow = 5,
  Windy = 6,
  Extreme = 7,
}

export enum UserRole {
  Viewer = 0,
  Worker = 1,
  Manager = 2,
  Admin = 3,
  SuperAdmin = 99,
}

// ============================================
// Enum label maps
// ============================================

export const ProjectStatusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.Planning]: 'Planning',
  [ProjectStatus.Approved]: 'Approved',
  [ProjectStatus.InProgress]: 'In Progress',
  [ProjectStatus.OnHold]: 'On Hold',
  [ProjectStatus.Completed]: 'Completed',
  [ProjectStatus.Cancelled]: 'Cancelled',
};

export const TaskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatus.NotStarted]: 'Not Started',
  [TaskStatus.InProgress]: 'In Progress',
  [TaskStatus.OnHold]: 'On Hold',
  [TaskStatus.Completed]: 'Completed',
  [TaskStatus.Cancelled]: 'Cancelled',
  [TaskStatus.Blocked]: 'Blocked',
};

export const TaskPriorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.Low]: 'Low',
  [TaskPriority.Medium]: 'Medium',
  [TaskPriority.High]: 'High',
  [TaskPriority.Critical]: 'Critical',
};

export const IssuePriorityLabels: Record<IssuePriority, string> = {
  [IssuePriority.Low]: 'Low',
  [IssuePriority.Medium]: 'Medium',
  [IssuePriority.High]: 'High',
  [IssuePriority.Critical]: 'Critical',
};

export const IssueStatusLabels: Record<IssueStatus, string> = {
  [IssueStatus.Open]: 'Open',
  [IssueStatus.UnderReview]: 'Under Review',
  [IssueStatus.InProgress]: 'In Progress',
  [IssueStatus.Resolved]: 'Resolved',
  [IssueStatus.Closed]: 'Closed',
  [IssueStatus.Rejected]: 'Rejected',
};

export const IssueTypeLabels: Record<IssueType, string> = {
  [IssueType.General]: 'General',
  [IssueType.Safety]: 'Safety',
  [IssueType.Quality]: 'Quality',
  [IssueType.Design]: 'Design',
  [IssueType.Material]: 'Material',
  [IssueType.Equipment]: 'Equipment',
  [IssueType.Weather]: 'Weather',
  [IssueType.RFI]: 'RFI',
  [IssueType.ChangeOrder]: 'Change Order',
};

export const ExpenseCategoryLabels: Record<ExpenseCategory, string> = {
  [ExpenseCategory.Labor]: 'Labor',
  [ExpenseCategory.Materials]: 'Materials',
  [ExpenseCategory.Equipment]: 'Equipment',
  [ExpenseCategory.Subcontractor]: 'Subcontractor',
  [ExpenseCategory.Permits]: 'Permits',
  [ExpenseCategory.Insurance]: 'Insurance',
  [ExpenseCategory.Transportation]: 'Transportation',
  [ExpenseCategory.Utilities]: 'Utilities',
  [ExpenseCategory.Administrative]: 'Administrative',
  [ExpenseCategory.Other]: 'Other',
};

export const EquipmentStatusLabels: Record<EquipmentStatus, string> = {
  [EquipmentStatus.Available]: 'Available',
  [EquipmentStatus.InUse]: 'In Use',
  [EquipmentStatus.UnderMaintenance]: 'Under Maintenance',
  [EquipmentStatus.OutOfService]: 'Out of Service',
  [EquipmentStatus.Retired]: 'Retired',
};

export const DocumentTypeLabels: Record<DocumentType, string> = {
  [DocumentType.Contract]: 'Contract',
  [DocumentType.Blueprint]: 'Blueprint',
  [DocumentType.Permit]: 'Permit',
  [DocumentType.Inspection]: 'Inspection',
  [DocumentType.Safety]: 'Safety',
  [DocumentType.Photo]: 'Photo',
  [DocumentType.MeetingMinutes]: 'Meeting Minutes',
  [DocumentType.ChangeOrder]: 'Change Order',
  [DocumentType.Invoice]: 'Invoice',
  [DocumentType.Specification]: 'Specification',
  [DocumentType.Other]: 'Other',
};

export const WeatherConditionLabels: Record<WeatherCondition, string> = {
  [WeatherCondition.Clear]: 'Clear',
  [WeatherCondition.PartlyCloudy]: 'Partly Cloudy',
  [WeatherCondition.Cloudy]: 'Cloudy',
  [WeatherCondition.LightRain]: 'Light Rain',
  [WeatherCondition.HeavyRain]: 'Heavy Rain',
  [WeatherCondition.Snow]: 'Snow',
  [WeatherCondition.Windy]: 'Windy',
  [WeatherCondition.Extreme]: 'Extreme',
};

// ============================================
// API Response Types
// ============================================

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ApiError {
  error: string;
  errors?: Record<string, string[]>;
}

// ============================================
// Auth Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  companyName: string;
  subdomain: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactPhone?: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
  tenantId: string;
  companyName: string;
}

export interface CurrentUser {
  userId: string;
  email: string;
  name: string;
  role: string;
  tenantId: string;
}

// ============================================
// Project Types
// ============================================

export interface ProjectDto {
  id: string;
  name: string;
  description?: string;
  projectCode: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  status: ProjectStatus;
  statusName: string;
  startDate?: string;
  endDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  budget: number;
  currency: string;
  totalArea?: number;
  areaUnit?: string;
  projectManagerId?: string;
  projectManagerName?: string;
  completionPercentage: number;
  coverImageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  taskCount: number;
  completedTaskCount: number;
  memberCount: number;
  openIssueCount: number;
  totalExpenses: number;
}

export interface ProjectListDto {
  id: string;
  name: string;
  projectCode: string;
  clientName: string;
  status: ProjectStatus;
  statusName: string;
  startDate?: string;
  endDate?: string;
  budget: number;
  currency?: string;
  completionPercentage: number;
  coverImageUrl?: string;
  projectManagerName?: string;
  createdAt: string;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  projectCode: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  startDate?: string;
  endDate?: string;
  budget: number;
  currency?: string;
  totalArea?: number;
  areaUnit?: string;
  projectManagerId?: string;
  notes?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  siteAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  budget?: number;
  currency?: string;
  totalArea?: number;
  areaUnit?: string;
  projectManagerId?: string;
  completionPercentage?: number;
  coverImageUrl?: string;
  notes?: string;
}

export interface ProjectStatisticsDto {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalMembers: number;
  openIssues: number;
  resolvedIssues: number;
  totalBudget: number;
  totalExpenses: number;
  remainingBudget: number;
  budgetUtilization: number;
  totalDailyLogs: number;
  totalDocuments: number;
  tasksByStatus: Record<string, number>;
  expensesByCategory: Record<string, number>;
}

export interface DashboardDto {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  overdueTasks: number;
  openIssues: number;
  totalBudget: number;
  totalExpenses: number;
  recentProjects: ProjectListDto[];
  upcomingTasks: TaskListDto[];
  recentIssues: IssueListDto[];
}

// ============================================
// Task Types
// ============================================

export interface TaskDto {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description?: string;
  taskCode?: string;
  status: TaskStatus;
  statusName: string;
  priority: TaskPriority;
  priorityName: string;
  assignedToId?: string;
  assignedToName?: string;
  createdById: string;
  createdByName: string;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  completionPercentage: number;
  parentTaskId?: string;
  milestoneId?: string;
  milestoneName?: string;
  tags?: string;
  notes?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt?: string;
  subTaskCount: number;
  commentCount: number;
}

export interface TaskListDto {
  id: string;
  projectId: string;
  title: string;
  taskCode?: string;
  status: TaskStatus;
  statusName: string;
  priority: TaskPriority;
  priorityName: string;
  assignedToName?: string;
  dueDate?: string;
  completionPercentage: number;
  sortOrder: number;
  hasSubTasks: boolean;
}

export interface CreateTaskDto {
  projectId: string;
  title: string;
  description?: string;
  taskCode?: string;
  priority?: TaskPriority;
  assignedToId?: string;
  startDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  parentTaskId?: string;
  milestoneId?: string;
  tags?: string;
  notes?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToId?: string;
  startDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  completionPercentage?: number;
  milestoneId?: string;
  tags?: string;
  notes?: string;
  sortOrder?: number;
}

export interface TaskCommentDto {
  id: string;
  content: string;
  createdByName: string;
  createdAt: string;
}

// ============================================
// Expense Types
// ============================================

export interface ExpenseDto {
  id: string;
  projectId: string;
  projectName: string;
  description: string;
  category: ExpenseCategory;
  categoryName: string;
  amount: number;
  currency: string;
  expenseDate: string;
  vendorName?: string;
  invoiceNumber?: string;
  receiptUrl?: string;
  submittedById: string;
  submittedByName: string;
  approvedById?: string;
  approvedByName?: string;
  isApproved: boolean;
  isPaid: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateExpenseDto {
  projectId: string;
  description: string;
  category?: ExpenseCategory;
  amount: number;
  currency?: string;
  expenseDate: string;
  vendorName?: string;
  invoiceNumber?: string;
  receiptUrl?: string;
  notes?: string;
}

export interface UpdateExpenseDto {
  description?: string;
  category?: ExpenseCategory;
  amount?: number;
  currency?: string;
  expenseDate?: string;
  vendorName?: string;
  invoiceNumber?: string;
  receiptUrl?: string;
  isApproved?: boolean;
  isPaid?: boolean;
  notes?: string;
}

export interface ExpenseSummaryDto {
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  paidAmount: number;
  byCategory: Record<string, number>;
}

// ============================================
// Daily Log Types
// ============================================

export interface DailyLogDto {
  id: string;
  projectId: string;
  projectName: string;
  logDate: string;
  weather: WeatherCondition;
  weatherName: string;
  temperatureMorning?: number;
  temperatureAfternoon?: number;
  workSummary: string;
  workersOnSite: number;
  totalHours: number;
  equipmentUsed?: string;
  materialsReceived?: string;
  visitors?: string;
  safetyIncidents?: string;
  delays?: string;
  nextDayPlan?: string;
  notes?: string;
  createdById: string;
  createdByName: string;
  isApproved: boolean;
  approvedById?: string;
  approvedByName?: string;
  createdAt: string;
  updatedAt?: string;
  photoCount: number;
  photos: DailyLogPhotoDto[];
}

export interface DailyLogListDto {
  id: string;
  projectId: string;
  logDate: string;
  weather: WeatherCondition;
  weatherName: string;
  workersOnSite: number;
  totalHours: number;
  createdByName: string;
  isApproved: boolean;
  photoCount: number;
}

export interface DailyLogPhotoDto {
  id: string;
  caption?: string;
  fileName: string;
  photoUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  takenAt?: string;
  sortOrder: number;
}

export interface CreateDailyLogDto {
  projectId: string;
  logDate: string;
  weather?: WeatherCondition;
  temperatureMorning?: number;
  temperatureAfternoon?: number;
  workSummary: string;
  workersOnSite: number;
  totalHours: number;
  equipmentUsed?: string;
  materialsReceived?: string;
  visitors?: string;
  safetyIncidents?: string;
  delays?: string;
  nextDayPlan?: string;
  notes?: string;
}

export interface UpdateDailyLogDto {
  weather?: WeatherCondition;
  temperatureMorning?: number;
  temperatureAfternoon?: number;
  workSummary?: string;
  workersOnSite?: number;
  totalHours?: number;
  equipmentUsed?: string;
  materialsReceived?: string;
  visitors?: string;
  safetyIncidents?: string;
  delays?: string;
  nextDayPlan?: string;
  notes?: string;
  isApproved?: boolean;
}

// ============================================
// Equipment Types
// ============================================

export interface EquipmentDto {
  id: string;
  name: string;
  description?: string;
  equipmentCode: string;
  category: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  status: EquipmentStatus;
  statusName: string;
  isOwned: boolean;
  purchasePrice?: number;
  purchaseDate?: string;
  dailyRentalRate?: number;
  rentalCompany?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  currentLocation?: string;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  activeProjectCount: number;
}

export interface CreateEquipmentDto {
  name: string;
  description?: string;
  equipmentCode: string;
  category: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  isOwned?: boolean;
  purchasePrice?: number;
  purchaseDate?: string;
  dailyRentalRate?: number;
  rentalCompany?: string;
  currentLocation?: string;
  imageUrl?: string;
  notes?: string;
}

export interface UpdateEquipmentDto {
  name?: string;
  description?: string;
  category?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  status?: EquipmentStatus;
  dailyRentalRate?: number;
  rentalCompany?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  currentLocation?: string;
  imageUrl?: string;
  notes?: string;
}

export interface AssignEquipmentToProjectDto {
  projectId: string;
  equipmentId: string;
  assignedDate?: string;
  expectedReturnDate?: string;
  dailyRate?: number;
  quantity?: number;
  notes?: string;
}

// ============================================
// Material Types
// ============================================

export interface MaterialDto {
  id: string;
  name: string;
  description?: string;
  materialCode: string;
  category: string;
  unit: string;
  unitPrice: number;
  currency: string;
  quantityInStock: number;
  reorderLevel?: number;
  isLowStock: boolean;
  supplierName?: string;
  supplierContact?: string;
  storageLocation?: string;
  imageUrl?: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateMaterialDto {
  name: string;
  description?: string;
  materialCode: string;
  category: string;
  unit: string;
  unitPrice: number;
  currency?: string;
  quantityInStock?: number;
  reorderLevel?: number;
  supplierName?: string;
  supplierContact?: string;
  storageLocation?: string;
  imageUrl?: string;
  notes?: string;
}

export interface UpdateMaterialDto {
  name?: string;
  description?: string;
  category?: string;
  unit?: string;
  unitPrice?: number;
  currency?: string;
  quantityInStock?: number;
  reorderLevel?: number;
  supplierName?: string;
  supplierContact?: string;
  storageLocation?: string;
  imageUrl?: string;
  isActive?: boolean;
  notes?: string;
}

export interface AllocateMaterialToProjectDto {
  projectId: string;
  materialId: string;
  quantityAllocated: number;
  allocationDate?: string;
  purchaseOrderNumber?: string;
  notes?: string;
}

// ============================================
// Document Types
// ============================================

export interface DocumentDto {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  description?: string;
  type: DocumentType;
  typeName: string;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  contentType: string;
  fileUrl: string;
  uploadedById: string;
  uploadedByName: string;
  version: number;
  tags?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DocumentListDto {
  id: string;
  projectId: string;
  name: string;
  type: DocumentType;
  typeName: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedByName: string;
  version: number;
  isArchived: boolean;
  createdAt: string;
}

export interface CreateDocumentDto {
  projectId: string;
  name: string;
  description?: string;
  type?: DocumentType;
  fileName: string;
  fileSize: number;
  contentType: string;
  fileUrl: string;
  tags?: string;
}

export interface UpdateDocumentDto {
  name?: string;
  description?: string;
  type?: DocumentType;
  tags?: string;
  isArchived?: boolean;
}

// ============================================
// Issue Types
// ============================================

export interface IssueDto {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  issueNumber: string;
  type: IssueType;
  typeName: string;
  status: IssueStatus;
  statusName: string;
  priority: IssuePriority;
  priorityName: string;
  reportedById: string;
  reportedByName: string;
  assignedToId?: string;
  assignedToName?: string;
  dueDate?: string;
  resolvedDate?: string;
  resolution?: string;
  location?: string;
  costImpact?: number;
  scheduleImpactDays?: number;
  relatedTaskId?: string;
  relatedTaskTitle?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  commentCount: number;
  attachmentCount: number;
}

export interface IssueListDto {
  id: string;
  projectId: string;
  title: string;
  issueNumber: string;
  type: IssueType;
  typeName: string;
  status: IssueStatus;
  statusName: string;
  priority: IssuePriority;
  priorityName: string;
  assignedToName?: string;
  dueDate?: string;
  createdAt: string;
}

export interface CreateIssueDto {
  projectId: string;
  title: string;
  description: string;
  type?: IssueType;
  priority?: IssuePriority;
  assignedToId?: string;
  dueDate?: string;
  location?: string;
  costImpact?: number;
  scheduleImpactDays?: number;
  relatedTaskId?: string;
  notes?: string;
}

export interface UpdateIssueDto {
  title?: string;
  description?: string;
  type?: IssueType;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignedToId?: string;
  dueDate?: string;
  resolution?: string;
  location?: string;
  costImpact?: number;
  scheduleImpactDays?: number;
  relatedTaskId?: string;
  notes?: string;
}

// ============================================
// Milestone Types
// ============================================

export interface MilestoneDto {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  dueDate: string;
  completedDate?: string;
  isCompleted: boolean;
  sortOrder: number;
  paymentAmount?: number;
  paymentReceived: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  taskCount: number;
  completedTaskCount: number;
}

export interface CreateMilestoneDto {
  projectId: string;
  name: string;
  description?: string;
  dueDate: string;
  paymentAmount?: number;
  sortOrder?: number;
  notes?: string;
}

export interface UpdateMilestoneDto {
  name?: string;
  description?: string;
  dueDate?: string;
  isCompleted?: boolean;
  paymentAmount?: number;
  paymentReceived?: boolean;
  sortOrder?: number;
  notes?: string;
}

// ============================================
// Project Member Types
// ============================================

export interface ProjectMemberDto {
  id: string;
  projectId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userJobTitle?: string;
  role: string;
  dailyRate?: number;
  joinedDate: string;
  leftDate?: string;
  isActive: boolean;
  notes?: string;
}

export interface CreateProjectMemberDto {
  projectId: string;
  userId: string;
  role: string;
  dailyRate?: number;
  notes?: string;
}

export interface UpdateProjectMemberDto {
  role?: string;
  dailyRate?: number;
  isActive?: boolean;
  notes?: string;
}

// ============================================
// RFI Types
// ============================================

export enum RFIStatus {
  Draft = 0,
  Open = 1,
  UnderReview = 2,
  Answered = 3,
  Closed = 4,
  Void = 5,
}

export const RFIStatusLabels: Record<RFIStatus, string> = {
  [RFIStatus.Draft]: 'Draft',
  [RFIStatus.Open]: 'Open',
  [RFIStatus.UnderReview]: 'Under Review',
  [RFIStatus.Answered]: 'Answered',
  [RFIStatus.Closed]: 'Closed',
  [RFIStatus.Void]: 'Void',
};

export interface RFIDto {
  id: string;
  projectId: string;
  projectName: string;
  number: string;
  title: string;
  question: string;
  answer?: string;
  status: RFIStatus;
  statusName: string;
  assignedToId?: string;
  assignedToName?: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRFIDto {
  projectId: string;
  title: string;
  question: string;
  assignedToId?: string;
}

export interface UpdateRFIDto {
  title?: string;
  question?: string;
  answer?: string;
  status?: RFIStatus;
  assignedToId?: string;
}

export interface RFICommentDto {
  id: string;
  rfiId: string;
  content: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
}

export interface RFIAttachmentDto {
  id: string;
  rfiId: string;
  fileName: string;
  filePath: string;
  contentType: string;
  fileSize: number;
  createdById: string;
  createdByName: string;
  createdAt: string;
}

// ============================================
// Change Order Types
// ============================================

export enum ChangeOrderStatus {
  Draft = 0,
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  Void = 4,
}

export const ChangeOrderStatusLabels: Record<ChangeOrderStatus, string> = {
  [ChangeOrderStatus.Draft]: 'Draft',
  [ChangeOrderStatus.Pending]: 'Pending',
  [ChangeOrderStatus.Approved]: 'Approved',
  [ChangeOrderStatus.Rejected]: 'Rejected',
  [ChangeOrderStatus.Void]: 'Void',
};

export interface ChangeOrderDto {
  id: string;
  projectId: string;
  projectName: string;
  number: string;
  title: string;
  description: string;
  status: ChangeOrderStatus;
  statusName: string;
  requestedAmount: number;
  approvedAmount?: number;
  scheduleImpactDays: number;
  createdById: string;
  createdByName: string;
  approvedById?: string;
  approvedByName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateChangeOrderDto {
  projectId: string;
  title: string;
  description: string;
  requestedAmount: number;
  scheduleImpactDays: number;
}

export interface UpdateChangeOrderDto {
  title?: string;
  description?: string;
  status?: ChangeOrderStatus;
  requestedAmount?: number;
  scheduleImpactDays?: number;
}

// ============================================
// Vendor Types
// ============================================

export enum VendorType {
  Subcontractor = 0,
  Supplier = 1,
  Consultant = 2,
  EquipmentRental = 3,
  Other = 4,
}

export const VendorTypeLabels: Record<VendorType, string> = {
  [VendorType.Subcontractor]: 'Subcontractor',
  [VendorType.Supplier]: 'Supplier',
  [VendorType.Consultant]: 'Consultant',
  [VendorType.EquipmentRental]: 'Equipment Rental',
  [VendorType.Other]: 'Other',
};

export interface VendorDto {
  id: string;
  name: string;
  type: VendorType;
  typeName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateVendorDto {
  name: string;
  type: VendorType;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
}

export interface UpdateVendorDto {
  name?: string;
  type?: VendorType;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
}

// ============================================
// Timesheet Types
// ============================================

export interface TimesheetDto {
  id: string;
  projectId: string;
  projectName: string;
  workerId: string;
  workerName: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  isApproved: boolean;
  createdById: string;
  createdByName: string;
  approvedById?: string;
  approvedByName?: string;
  createdAt: string;
  updatedAt?: string;
  entries: TimesheetEntryDto[];
}

export interface TimesheetEntryDto {
  id: string;
  timesheetId: string;
  date: string;
  hours: number;
  description?: string;
  projectTaskId?: string;
  projectTaskTitle?: string;
}

export interface CreateTimesheetDto {
  projectId: string;
  workerId: string;
  startDate: string;
  endDate: string;
}

export interface UpdateTimesheetDto {
  startDate?: string;
  endDate?: string;
}

export interface CreateTimesheetEntryDto {
  date: string;
  hours: number;
  description?: string;
  projectTaskId?: string;
}

// ============================================
// Enterprise Construction ERP Types
// ============================================

// 1. Cost Codes & Cost Control
export enum CostCodeCategory {
  Labor = 1,
  Materials = 2,
  Equipment = 3,
  Subcontractor = 4,
  SiteOverhead = 5,
  Permits = 6,
  Other = 7,
}

export const CostCodeCategoryLabels: Record<CostCodeCategory, string> = {
  [CostCodeCategory.Labor]: 'Labor',
  [CostCodeCategory.Materials]: 'Materials',
  [CostCodeCategory.Equipment]: 'Equipment',
  [CostCodeCategory.Subcontractor]: 'Subcontractor',
  [CostCodeCategory.SiteOverhead]: 'Site Overhead',
  [CostCodeCategory.Permits]: 'Permits',
  [CostCodeCategory.Other]: 'Other',
};

export interface CostCodeDto {
  id: string;
  projectId: string;
  code: string;
  name: string;
  description?: string;
  category: CostCodeCategory;
  categoryName: string;
  originalBudget: number;
  committedCost: number;
  actualCost: number;
  remainingBudget: number;
  forecastCost: number;
  budgetVariance: number;
  notes?: string;
  createdAt: string;
}

export interface CreateCostCodeRequest {
  projectId: string;
  code: string;
  name: string;
  description?: string;
  category?: CostCodeCategory;
  originalBudget?: number;
  forecastCost?: number;
  notes?: string;
}

export interface UpdateCostCodeRequest {
  name: string;
  description?: string;
  category: CostCodeCategory;
  originalBudget: number;
  forecastCost: number;
  notes?: string;
}

export interface ProjectCostControlSummaryDto {
  projectId: string;
  projectName: string;
  totalOriginalBudget: number;
  totalCommittedCost: number;
  totalActualCost: number;
  totalRemainingBudget: number;
  totalForecastCost: number;
  totalVariance: number;
  costCodes: CostCodeDto[];
}

// 2. WBS
export enum WbsStatus {
  Planned = 1,
  InProgress = 2,
  Completed = 3,
  OnHold = 4,
  Delayed = 5,
}

export const WbsStatusLabels: Record<WbsStatus, string> = {
  [WbsStatus.Planned]: 'Planned',
  [WbsStatus.InProgress]: 'In Progress',
  [WbsStatus.Completed]: 'Completed',
  [WbsStatus.OnHold]: 'On Hold',
  [WbsStatus.Delayed]: 'Delayed',
};

export interface WbsNodeDto {
  id: string;
  projectId: string;
  wbsCode: string;
  name: string;
  description?: string;
  parentWbsId?: string;
  startDate?: string;
  endDate?: string;
  responsiblePersonId?: string;
  responsiblePersonName?: string;
  budget: number;
  rolledUpBudget: number;
  costCodeId?: string;
  costCodeName?: string;
  progressPercentage: number;
  status: WbsStatus;
  statusName: string;
  children: WbsNodeDto[];
  createdAt: string;
}

export interface CreateWbsNodeRequest {
  projectId: string;
  wbsCode: string;
  name: string;
  description?: string;
  parentWbsId?: string;
  startDate?: string;
  endDate?: string;
  responsiblePersonId?: string;
  budget?: number;
  costCodeId?: string;
  progressPercentage?: number;
  status?: WbsStatus;
}

export interface UpdateWbsNodeRequest {
  name: string;
  description?: string;
  parentWbsId?: string;
  startDate?: string;
  endDate?: string;
  responsiblePersonId?: string;
  budget: number;
  costCodeId?: string;
  progressPercentage: number;
  status: WbsStatus;
}

// 3. Procurement
export enum ProcurementStatus {
  Draft = 1,
  Submitted = 2,
  Approved = 3,
  Ordered = 4,
  PartiallyReceived = 5,
  Fulfilled = 6,
  Cancelled = 7,
}

export const ProcurementStatusLabels: Record<ProcurementStatus, string> = {
  [ProcurementStatus.Draft]: 'Draft',
  [ProcurementStatus.Submitted]: 'Submitted',
  [ProcurementStatus.Approved]: 'Approved',
  [ProcurementStatus.Ordered]: 'Ordered',
  [ProcurementStatus.PartiallyReceived]: 'Partially Received',
  [ProcurementStatus.Fulfilled]: 'Fulfilled',
  [ProcurementStatus.Cancelled]: 'Cancelled',
};

export interface ProcurementRequestDto {
  id: string;
  requestNumber: string;
  projectId: string;
  projectName?: string;
  wbsId?: string;
  wbsName?: string;
  costCodeId?: string;
  costCodeName?: string;
  requestedById: string;
  requestedByName?: string;
  vendorId?: string;
  vendorName?: string;
  requiredDate: string;
  priority: string;
  status: ProcurementStatus;
  statusName: string;
  estimatedTotalCost: number;
  notes?: string;
  items: ProcurementRequestItemDto[];
  createdAt: string;
}

export interface ProcurementRequestItemDto {
  id: string;
  procurementRequestId: string;
  materialId?: string;
  materialName?: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  notes?: string;
}

export interface CreateProcurementRequest {
  projectId: string;
  wbsId?: string;
  costCodeId?: string;
  vendorId?: string;
  requiredDate: string;
  priority?: string;
  notes?: string;
  items: {
    materialId?: string;
    description: string;
    quantity: number;
    unit: string;
    estimatedUnitPrice: number;
    notes?: string;
  }[];
}

export interface UpdateProcurementRequest {
  wbsId?: string;
  costCodeId?: string;
  vendorId?: string;
  requiredDate?: string;
  priority?: string;
  notes?: string;
}

// 4. Purchase Orders
export enum PurchaseOrderStatus {
  Draft = 1,
  PendingApproval = 2,
  Approved = 3,
  PartiallyReceived = 4,
  FullyReceived = 5,
  Closed = 6,
  Cancelled = 7,
}

export const PurchaseOrderStatusLabels: Record<PurchaseOrderStatus, string> = {
  [PurchaseOrderStatus.Draft]: 'Draft',
  [PurchaseOrderStatus.PendingApproval]: 'Pending Approval',
  [PurchaseOrderStatus.Approved]: 'Approved',
  [PurchaseOrderStatus.PartiallyReceived]: 'Partially Received',
  [PurchaseOrderStatus.FullyReceived]: 'Fully Received',
  [PurchaseOrderStatus.Closed]: 'Closed',
  [PurchaseOrderStatus.Cancelled]: 'Cancelled',
};

export interface PurchaseOrderDto {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName?: string;
  projectId: string;
  projectName?: string;
  wbsId?: string;
  wbsName?: string;
  costCodeId?: string;
  costCodeName?: string;
  procurementRequestId?: string;
  deliveryLocation: string;
  requestedDate: string;
  expectedDeliveryDate?: string;
  paymentTerms: string;
  currency: string;
  subtotalAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: PurchaseOrderStatus;
  statusName: string;
  notes?: string;
  approvedById?: string;
  approvedByName?: string;
  approvedAt?: string;
  items: PurchaseOrderItemDto[];
  createdAt: string;
}

export interface PurchaseOrderItemDto {
  id: string;
  purchaseOrderId: string;
  materialId?: string;
  materialName?: string;
  description: string;
  quantity: number;
  receivedQuantity: number;
  unit: string;
  unitPrice: number;
  taxRate: number;
  totalPrice: number;
}

export interface CreatePurchaseOrderRequest {
  vendorId: string;
  projectId: string;
  wbsId?: string;
  costCodeId?: string;
  procurementRequestId?: string;
  deliveryLocation: string;
  requestedDate: string;
  expectedDeliveryDate?: string;
  paymentTerms?: string;
  currency?: string;
  notes?: string;
  items: {
    materialId?: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    taxRate?: number;
  }[];
}

export interface ReceivePurchaseOrderGoodsRequest {
  receiptDate?: string;
  location?: string;
  notes?: string;
  items: {
    purchaseOrderItemId: string;
    receivedQuantity: number;
    unitCost?: number;
    location?: string;
  }[];
}

// 5. Material Requests
export enum MaterialRequestStatus {
  Draft = 1,
  Submitted = 2,
  Approved = 3,
  Procurement = 4,
  Received = 5,
  Issued = 6,
  Rejected = 7,
  Cancelled = 8,
}

export const MaterialRequestStatusLabels: Record<MaterialRequestStatus, string> = {
  [MaterialRequestStatus.Draft]: 'Draft',
  [MaterialRequestStatus.Submitted]: 'Submitted',
  [MaterialRequestStatus.Approved]: 'Approved',
  [MaterialRequestStatus.Procurement]: 'Procurement',
  [MaterialRequestStatus.Received]: 'Received',
  [MaterialRequestStatus.Issued]: 'Issued',
  [MaterialRequestStatus.Rejected]: 'Rejected',
  [MaterialRequestStatus.Cancelled]: 'Cancelled',
};

export interface MaterialRequestDto {
  id: string;
  requestNumber: string;
  projectId: string;
  projectName?: string;
  wbsId?: string;
  wbsName?: string;
  costCodeId?: string;
  costCodeName?: string;
  requestedById: string;
  requestedByName?: string;
  requiredDate: string;
  priority: string;
  status: MaterialRequestStatus;
  statusName: string;
  reason?: string;
  notes?: string;
  items: MaterialRequestItemDto[];
  createdAt: string;
}

export interface MaterialRequestItemDto {
  id: string;
  materialRequestId: string;
  materialId: string;
  materialName?: string;
  requestedQuantity: number;
  issuedQuantity: number;
  unit: string;
  notes?: string;
}

export interface CreateMaterialRequest {
  projectId: string;
  wbsId?: string;
  costCodeId?: string;
  requiredDate: string;
  priority?: string;
  reason?: string;
  notes?: string;
  items: {
    materialId: string;
    requestedQuantity: number;
    unit: string;
    notes?: string;
  }[];
}

// 6. Inventory Transactions
export enum InventoryTransactionType {
  OpeningStock = 1,
  PurchaseReceipt = 2,
  TransferIn = 3,
  MaterialIssue = 4,
  TransferOut = 5,
  Adjustment = 6,
}

export const InventoryTransactionTypeLabels: Record<InventoryTransactionType, string> = {
  [InventoryTransactionType.OpeningStock]: 'Opening Stock',
  [InventoryTransactionType.PurchaseReceipt]: 'Purchase Receipt',
  [InventoryTransactionType.TransferIn]: 'Transfer In',
  [InventoryTransactionType.MaterialIssue]: 'Material Issue',
  [InventoryTransactionType.TransferOut]: 'Transfer Out',
  [InventoryTransactionType.Adjustment]: 'Adjustment',
};

export interface InventoryTransactionDto {
  id: string;
  projectId: string;
  projectName?: string;
  materialId: string;
  materialName?: string;
  transactionType: InventoryTransactionType;
  transactionTypeName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  location: string;
  referenceNumber: string;
  costCodeId?: string;
  costCodeName?: string;
  wbsId?: string;
  wbsName?: string;
  transactionDate: string;
  userId: string;
  userName?: string;
  notes?: string;
}

export interface ProjectInventoryStockDto {
  id: string;
  projectId: string;
  materialId: string;
  materialName?: string;
  materialCode?: string;
  unit?: string;
  location: string;
  quantityOnHand: number;
  minimumStockLevel: number;
  averageUnitCost: number;
  totalStockValue: number;
  isLowStock: boolean;
  lastActivityAt: string;
}

export interface CreateInventoryTransactionRequest {
  projectId: string;
  materialId: string;
  transactionType: InventoryTransactionType;
  quantity: number;
  unit: string;
  unitCost?: number;
  location?: string;
  referenceNumber?: string;
  costCodeId?: string;
  wbsId?: string;
  notes?: string;
}

// 7. Physical Progress
export interface PhysicalProgressRecordDto {
  id: string;
  projectId: string;
  projectName?: string;
  wbsId?: string;
  wbsName?: string;
  scheduleActivityId?: string;
  activityName: string;
  plannedQuantity: number;
  completedQuantity: number;
  remainingQuantity: number;
  unit: string;
  progressPercentage: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  logDate: string;
  loggedById: string;
  loggedByName?: string;
  dailyLogId?: string;
  notes?: string;
}

export interface CreatePhysicalProgressRequest {
  projectId: string;
  wbsId?: string;
  scheduleActivityId?: string;
  activityName: string;
  plannedQuantity: number;
  completedQuantity: number;
  unit?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  dailyLogId?: string;
  notes?: string;
}

export interface UpdatePhysicalProgressRequest {
  completedQuantity?: number;
  plannedQuantity?: number;
  actualStartDate?: string;
  actualEndDate?: string;
  notes?: string;
}

export interface ProjectProgressSummaryDto {
  projectId: string;
  projectName: string;
  overallPhysicalProgress: number;
  overallFinancialProgress: number;
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  delayedActivities: number;
  records: PhysicalProgressRecordDto[];
}

// 8. Scheduling & Gantt
export enum ActivityDependencyType {
  FinishToStart = 1,
  StartToStart = 2,
  FinishToFinish = 3,
  StartToFinish = 4,
}

export interface ScheduleActivityDto {
  id: string;
  projectId: string;
  wbsId?: string;
  wbsName?: string;
  costCodeId?: string;
  costCodeName?: string;
  activityCode: string;
  activityName: string;
  description?: string;
  startDate: string;
  endDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  durationDays: number;
  responsiblePersonId?: string;
  responsiblePersonName?: string;
  status: TaskStatus;
  statusName: string;
  progressPercentage: number;
  plannedQuantity: number;
  completedQuantity: number;
  unit: string;
  isMilestone: boolean;
  isCriticalPath: boolean;
  isOverdue: boolean;
  isDelayed: boolean;
  predecessors: ScheduleDependencyDto[];
}

export interface ScheduleDependencyDto {
  id: string;
  predecessorActivityId: string;
  predecessorActivityName?: string;
  predecessorActivityCode?: string;
  successorActivityId: string;
  dependencyType: ActivityDependencyType;
  dependencyTypeName: string;
  lagDays: number;
}

export interface CreateScheduleActivityRequest {
  projectId: string;
  wbsId?: string;
  costCodeId?: string;
  activityCode: string;
  activityName: string;
  description?: string;
  startDate: string;
  endDate: string;
  responsiblePersonId?: string;
  plannedQuantity?: number;
  unit?: string;
  isMilestone?: boolean;
  predecessorIds?: string[];
}

export interface UpdateScheduleActivityRequest {
  activityName?: string;
  description?: string;
  wbsId?: string;
  costCodeId?: string;
  startDate?: string;
  endDate?: string;
  responsiblePersonId?: string;
  status?: TaskStatus;
  progressPercentage?: number;
  plannedQuantity?: number;
  completedQuantity?: number;
  unit?: string;
  isMilestone?: boolean;
}

export interface ProjectGanttChartDto {
  projectId: string;
  projectName: string;
  totalActivities: number;
  overdueActivitiesCount: number;
  delayedActivitiesCount: number;
  upcomingActivitiesCount: number;
  activities: ScheduleActivityDto[];
}

// 9. Project Billing
export enum BillingApplicationStatus {
  Draft = 1,
  Submitted = 2,
  UnderReview = 3,
  Approved = 4,
  Invoiced = 5,
  PartiallyPaid = 6,
  Paid = 7,
  Rejected = 8,
}

export const BillingApplicationStatusLabels: Record<BillingApplicationStatus, string> = {
  [BillingApplicationStatus.Draft]: 'Draft',
  [BillingApplicationStatus.Submitted]: 'Submitted',
  [BillingApplicationStatus.UnderReview]: 'Under Review',
  [BillingApplicationStatus.Approved]: 'Approved',
  [BillingApplicationStatus.Invoiced]: 'Invoiced',
  [BillingApplicationStatus.PartiallyPaid]: 'Partially Paid',
  [BillingApplicationStatus.Paid]: 'Paid',
  [BillingApplicationStatus.Rejected]: 'Rejected',
};

export interface ProjectBillingApplicationDto {
  id: string;
  applicationNumber: string;
  projectId: string;
  projectName?: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  contractValue: number;
  approvedChangeOrdersAmount: number;
  revisedContractValue: number;
  completedWorkAmount: number;
  previousBillingAmount: number;
  currentBillingAmount: number;
  retentionPercentage: number;
  retentionAmount: number;
  netBillingAmount: number;
  taxRate: number;
  taxAmount: number;
  totalInvoiceAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  status: BillingApplicationStatus;
  statusName: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  paymentDueDate?: string;
  notes?: string;
  items: ProjectBillingItemDto[];
  payments: ProjectPaymentRecordDto[];
  createdAt: string;
}

export interface ProjectBillingItemDto {
  id: string;
  projectBillingApplicationId: string;
  wbsId?: string;
  wbsName?: string;
  costCodeId?: string;
  costCodeName?: string;
  description: string;
  scheduledValue: number;
  previousCompletedAmount: number;
  currentCompletedAmount: number;
  totalCompletedAmount: number;
  progressPercentage: number;
}

export interface ProjectPaymentRecordDto {
  id: string;
  projectBillingApplicationId: string;
  projectId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber: string;
  notes?: string;
}

export interface CreateBillingApplicationRequest {
  projectId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  currentBillingAmount: number;
  retentionPercentage?: number;
  taxRate?: number;
  notes?: string;
  items?: {
    wbsId?: string;
    costCodeId?: string;
    description: string;
    scheduledValue: number;
    currentCompletedAmount: number;
  }[];
}

// 10. Safety
export enum SafetyIncidentSeverity {
  NearMiss = 1,
  Minor = 2,
  Moderate = 3,
  Severe = 4,
  Critical = 5,
  Fatal = 6,
}

export enum SafetyIncidentStatus {
  Reported = 1,
  Investigating = 2,
  ActionRequired = 3,
  Resolved = 4,
  Closed = 5,
}

export interface SafetyIncidentDto {
  id: string;
  incidentNumber: string;
  projectId: string;
  projectName?: string;
  incidentDateTime: string;
  location: string;
  personInvolved: string;
  incidentType: string;
  severity: SafetyIncidentSeverity;
  severityName: string;
  description: string;
  immediateAction: string;
  correctiveAction: string;
  photosOrDocumentsJson?: string;
  status: SafetyIncidentStatus;
  statusName: string;
  reportedById: string;
  reportedByName?: string;
  createdAt: string;
}

export interface SafetyInspectionDto {
  id: string;
  inspectionNumber: string;
  projectId: string;
  projectName?: string;
  inspectorId: string;
  inspectorName?: string;
  inspectionDate: string;
  checklistTitle: string;
  overallResult: QualityInspectionResult;
  overallResultName: string;
  summaryFindings?: string;
  hasIssues: boolean;
  attachmentsJson?: string;
  items: {
    id: string;
    safetyInspectionId: string;
    requirement: string;
    result: QualityInspectionResult;
    findings?: string;
    correctiveAction?: string;
    isClosed: boolean;
  }[];
  createdAt: string;
}

export interface ToolboxTalkDto {
  id: string;
  projectId: string;
  projectName?: string;
  topic: string;
  date: string;
  conductedById: string;
  conductedByName?: string;
  participantsJson: string;
  attendanceCount: number;
  notes?: string;
  isSignedOff: boolean;
  createdAt: string;
}

// 11. Quality
export enum QualityInspectionResult {
  Passed = 1,
  Failed = 2,
  PassedWithComments = 3,
}

export enum QualityIssueStatus {
  Open = 1,
  InProgress = 2,
  PendingReinspection = 3,
  Closed = 4,
}

export interface QualityInspectionDto {
  id: string;
  inspectionNumber: string;
  projectId: string;
  projectName?: string;
  wbsId?: string;
  wbsName?: string;
  scheduleActivityId?: string;
  activityName?: string;
  inspectorId: string;
  inspectorName?: string;
  inspectionDate: string;
  discipline: string;
  title: string;
  result: QualityInspectionResult;
  resultName: string;
  comments?: string;
  attachmentsJson?: string;
  items: {
    id: string;
    qualityInspectionId: string;
    requirement: string;
    result: QualityInspectionResult;
    notes?: string;
  }[];
  issues: QualityIssueDto[];
  createdAt: string;
}

export interface QualityIssueDto {
  id: string;
  issueNumber: string;
  qualityInspectionId: string;
  projectId: string;
  projectName?: string;
  wbsId?: string;
  wbsName?: string;
  description: string;
  rootCause: string;
  correctiveAction: string;
  targetResolutionDate?: string;
  reinspectionDate?: string;
  reinspectionResult?: QualityInspectionResult;
  status: QualityIssueStatus;
  statusName: string;
  resolutionNotes?: string;
  createdAt: string;
}

// 12. Subcontracts
export enum SubcontractStatus {
  Draft = 1,
  Active = 2,
  UnderReview = 3,
  Completed = 4,
  Terminated = 5,
}

export interface SubcontractDto {
  id: string;
  subcontractNumber: string;
  vendorId: string;
  vendorName?: string;
  projectId: string;
  projectName?: string;
  wbsId?: string;
  wbsName?: string;
  costCodeId?: string;
  costCodeName?: string;
  scopeOfWork: string;
  originalContractValue: number;
  approvedChangeOrdersAmount: number;
  revisedContractValue: number;
  workCompletedAmount: number;
  amountBilled: number;
  amountPaid: number;
  retentionPercentage: number;
  retentionAmount: number;
  remainingBalance: number;
  startDate: string;
  endDate: string;
  paymentTerms: string;
  status: SubcontractStatus;
  statusName: string;
  notes?: string;
  payments: SubcontractPaymentDto[];
  changeOrders: SubcontractChangeOrderDto[];
  createdAt: string;
}

export interface SubcontractPaymentDto {
  id: string;
  subcontractId: string;
  paymentNumber: string;
  paymentDate: string;
  grossAmount: number;
  retentionDeducted: number;
  netAmountPaid: number;
  referenceNumber: string;
  notes?: string;
}

export interface SubcontractChangeOrderDto {
  id: string;
  subcontractId: string;
  changeOrderNumber: string;
  title: string;
  description?: string;
  amount: number;
  scheduleImpactDays: number;
  status: ChangeOrderStatus;
  statusName: string;
  approvedDate?: string;
}

export interface CreateSubcontractRequest {
  vendorId: string;
  projectId: string;
  wbsId?: string;
  costCodeId?: string;
  scopeOfWork: string;
  originalContractValue: number;
  retentionPercentage?: number;
  startDate: string;
  endDate: string;
  paymentTerms?: string;
  notes?: string;
}

export interface CreateSubcontractPaymentRequest {
  grossAmount: number;
  retentionDeducted?: number;
  referenceNumber: string;
  notes?: string;
}

export interface CreateSubcontractChangeOrderRequest {
  title: string;
  description?: string;
  amount: number;
  scheduleImpactDays?: number;
}

// 13. Universal Approvals
export enum ApprovalEntityType {
  Expense = 1,
  MaterialRequest = 2,
  PurchaseOrder = 3,
  Timesheet = 4,
  DailyLog = 5,
  ChangeOrder = 6,
  Subcontract = 7,
  ProjectBilling = 8,
  ProcurementRequest = 9,
  SafetyIncident = 10,
  QualityInspection = 11,
}

export enum ApprovalStatus {
  Draft = 1,
  Submitted = 2,
  PendingApproval = 3,
  Approved = 4,
  Rejected = 5,
  Cancelled = 6,
}

export interface ApprovalRequestDto {
  id: string;
  entityType: ApprovalEntityType;
  entityTypeName: string;
  entityId: string;
  entityReferenceNumber: string;
  projectId: string;
  projectName?: string;
  requestedById: string;
  requestedByName?: string;
  currentApproverId?: string;
  currentApproverName?: string;
  status: ApprovalStatus;
  statusName: string;
  submissionDate?: string;
  decisionDate?: string;
  notes?: string;
  rejectionReason?: string;
  history: {
    id: string;
    approvalRequestId: string;
    action: string;
    actorId: string;
    actorName?: string;
    actionDate: string;
    resultingStatus: ApprovalStatus;
    comments?: string;
  }[];
  createdAt: string;
}

export interface SubmitForApprovalRequest {
  entityType: ApprovalEntityType;
  entityId: string;
  entityReferenceNumber: string;
  projectId: string;
  approverId?: string;
  notes?: string;
}

export interface ApproveDecisionRequest {
  comments?: string;
}

export interface RejectDecisionRequest {
  rejectionReason: string;
}

// 14. Construction KPI Dashboard
export interface ConstructionKpiDashboardDto {
  projectId: string;
  projectName: string;
  projectCode: string;
  status: string;
  financials: {
    contractValue: number;
    originalBudget: number;
    approvedChangeOrders: number;
    revisedBudget: number;
    committedCost: number;
    actualCost: number;
    remainingBudget: number;
    forecastCost: number;
    budgetVariance: number;
    totalBilledToClient: number;
    totalPaidByClient: number;
    clientOutstandingBalance: number;
  };
  progress: {
    physicalProgressPercentage: number;
    financialProgressPercentage: number;
    totalActivities: number;
    completedActivities: number;
    inProgressActivities: number;
    delayedActivities: number;
    overdueActivities: number;
    scheduleDelayDays: number;
    scheduleStatus: string;
  };
  fieldOperations: {
    workersOnSiteToday: number;
    totalLaborHoursLogged: number;
    equipmentInUseCount: number;
    pendingMaterialRequestsCount: number;
    totalDailyLogsLogged: number;
  };
  risksAndIssues: {
    openRFIs: number;
    overdueRFIs: number;
    pendingChangeOrders: number;
    totalSafetyIncidents: number;
    openSafetyIssues: number;
    openQualityDeficiencies: number;
  };
  equipmentSummary: {
    totalEquipmentAssigned: number;
    inOperation: number;
    maintenanceDue: number;
    underMaintenance: number;
    totalMaintenanceCost: number;
  };
}

// 15. Equipment Maintenance
export enum EquipmentMaintenanceType {
  Preventive = 1,
  Corrective = 2,
  Inspection = 3,
  Overhaul = 4,
}

export enum EquipmentMaintenanceStatus {
  Scheduled = 1,
  Due = 2,
  InProgress = 3,
  Completed = 4,
  Overdue = 5,
  Cancelled = 6,
}

export interface EquipmentMaintenanceRecordDto {
  id: string;
  equipmentId: string;
  equipmentName?: string;
  equipmentCode?: string;
  projectId?: string;
  projectName?: string;
  maintenanceType: EquipmentMaintenanceType;
  maintenanceTypeName: string;
  serviceDate: string;
  meterReadingHours: number;
  maintenanceCost: number;
  vendorId?: string;
  vendorName?: string;
  description: string;
  partsUsed?: string;
  nextServiceDate?: string;
  nextServiceMeterHours?: number;
  status: EquipmentMaintenanceStatus;
  statusName: string;
  notes?: string;
  isOverdue: boolean;
  createdAt: string;
}

export interface EquipmentMaintenanceSummaryDto {
  totalMaintenanceRecords: number;
  scheduledCount: number;
  dueCount: number;
  underMaintenanceCount: number;
  overdueCount: number;
  totalMaintenanceCost: number;
  records: EquipmentMaintenanceRecordDto[];
}

export interface CreateEquipmentMaintenanceRequest {
  equipmentId: string;
  projectId?: string;
  maintenanceType: EquipmentMaintenanceType;
  serviceDate: string;
  meterReadingHours: number;
  maintenanceCost: number;
  vendorId?: string;
  description: string;
  partsUsed?: string;
  nextServiceDate?: string;
  nextServiceMeterHours?: number;
  status: EquipmentMaintenanceStatus;
  notes?: string;
}

export interface UpdateEquipmentMaintenanceRequest {
  maintenanceType?: EquipmentMaintenanceType;
  serviceDate?: string;
  meterReadingHours?: number;
  maintenanceCost?: number;
  vendorId?: string;
  description?: string;
  partsUsed?: string;
  nextServiceDate?: string;
  nextServiceMeterHours?: number;
  status?: EquipmentMaintenanceStatus;
  notes?: string;
}

// ============================================
// Tenant & Localization Settings
// ============================================

export interface TenantSettingsDto {
  tenantId: string;
  companyName: string;
  subdomain: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  dateFormat: string;
  taxRegistrationNumber?: string;
  defaultVatRate: number;
  defaultRetentionRate: number;
  defaultDailyWorkingHours: number;
  autoApprovalLimit: number;
  subscriptionPlan: string;
  createdAt: string;
}

export interface UpdateTenantSettingsRequest {
  companyName: string;
  contactPhone?: string;
  address?: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  dateFormat: string;
  taxRegistrationNumber?: string;
  defaultVatRate: number;
  defaultRetentionRate: number;
  defaultDailyWorkingHours: number;
  autoApprovalLimit: number;
}



