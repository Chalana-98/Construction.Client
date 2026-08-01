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

