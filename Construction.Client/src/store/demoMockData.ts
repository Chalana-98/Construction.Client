/**
 * Demo Mode – Mock API responses keyed by URL prefix.
 * Used by the RTK Query baseQuery interceptor in api.ts when token === 'demo-token'.
 * Localized for Sri Lanka (LKR - Sri Lankan Rupees / Rs.) with realistic project figures.
 */

const pagedOf = <T>(items: T[]) => ({
  items,
  totalCount: items.length,
  page: 1,
  pageSize: 15,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
});

// ─── Settings ────────────────────────────────────────────────────────────────
const TENANT_SETTINGS = {
  tenantId: 'demo-tenant',
  companyName: 'Ceylon BuildTech Engineering (Pvt) Ltd',
  subdomain: 'ceylon-buildtech',
  contactEmail: 'contact@buildtech.lk',
  contactPhone: '+94 11 288 9400',
  address: 'Level 14, Lotus Tower Commercial Complex, Colombo 02, Sri Lanka',
  currency: 'LKR',
  currencySymbol: 'Rs.',
  timezone: 'Asia/Colombo',
  dateFormat: 'DD/MM/YYYY',
  taxRegistrationNumber: 'PV-00284719 / VAT-11482934-7000',
  defaultVatRate: 18.0,
  defaultRetentionRate: 5.0,
  defaultDailyWorkingHours: 8,
  autoApprovalLimit: 50000,
  subscriptionPlan: 'enterprise',
  createdAt: '2025-01-01T00:00:00Z',
};

// ─── Projects (Sri Lankan Context) ───────────────────────────────────────────
const PROJECTS = [
  {
    id: 'p1', name: 'Lotus Commercial Tower Complex', projectCode: 'CMB-001', clientName: 'Colombo Urban Real Estate PLC',
    clientEmail: 'projects@colombourban.lk', clientPhone: '+94 11 245 8800', siteAddress: 'No. 88, Galle Road, Kollupitiya',
    city: 'Colombo', state: 'Western Province', country: 'Sri Lanka', postalCode: '00300',
    budget: 85000000, currency: 'LKR', totalExpenses: 24500000,
    status: 2, startDate: '2025-01-15T00:00:00Z', endDate: '2026-12-31T00:00:00Z',
    completionPercentage: 35, taskCount: 84, completedTaskCount: 29,
    memberCount: 16, openIssueCount: 4, projectManagerName: 'Kasun Jayawardena (PE)',
    description: '35-storey mixed-use commercial and luxury residential tower in central Colombo.',
    notes: 'Substructure & piling completed. Core wall casting and structural steel level 12 in progress.',
  },
  {
    id: 'p2', name: 'Central Expressway Interchange & Flyover', projectCode: 'KDY-002', clientName: 'Road Development Authority (RDA)',
    clientEmail: 'procurement@rda.gov.lk', clientPhone: '+94 81 223 4500', siteAddress: 'Kadugannawa Bypass, Central Province',
    city: 'Kandy', state: 'Central Province', country: 'Sri Lanka', postalCode: '20000',
    budget: 42000000, currency: 'LKR', totalExpenses: 18500000,
    status: 2, startDate: '2025-03-01T00:00:00Z', endDate: '2026-08-30T00:00:00Z',
    completionPercentage: 48, taskCount: 56, completedTaskCount: 27,
    memberCount: 12, openIssueCount: 2, projectManagerName: 'Dinesh Perera',
    description: 'Heavy civil bridge and concrete girder installation for expressway link.',
    notes: 'Pier cap casting 80% complete. Pre-stressed beam lifting scheduled for next month.',
  },
  {
    id: 'p3', name: 'Galle Heritage Coastal Resort & Villas', projectCode: 'GAL-003', clientName: 'Southern Luxury Resorts Ltd',
    clientEmail: 'info@southernresorts.lk', clientPhone: '+94 91 224 1122', siteAddress: 'Lighthouse Promenade, Galle Fort',
    city: 'Galle', state: 'Southern Province', country: 'Sri Lanka', postalCode: '80000',
    budget: 28000000, currency: 'LKR', totalExpenses: 7800000,
    status: 1, startDate: '2025-06-01T00:00:00Z', endDate: '2027-03-31T00:00:00Z',
    completionPercentage: 15, taskCount: 110, completedTaskCount: 16,
    memberCount: 10, openIssueCount: 1, projectManagerName: 'Anusha Wickramasinghe',
    description: 'Eco-luxury heritage boutique resort adhering to coastal conservation standards.',
    notes: 'Substructure and site drainage complete. Coastal engineering clearance obtained.',
  },
  {
    id: 'p4', name: 'Rajagiriya IT Tech Park Phase 2', projectCode: 'RJG-004', clientName: 'Lanka Tech Ventures PLC',
    clientEmail: 'infrastructure@lankatech.lk', clientPhone: '+94 11 286 7799', siteAddress: 'Parliament Road, Rajagiriya',
    city: 'Sri Jayawardenepura Kotte', state: 'Western Province', country: 'Sri Lanka', postalCode: '10107',
    budget: 65000000, currency: 'LKR', totalExpenses: 64200000,
    status: 4, startDate: '2023-09-01T00:00:00Z', endDate: '2025-12-15T00:00:00Z',
    completionPercentage: 100, taskCount: 92, completedTaskCount: 92,
    memberCount: 14, openIssueCount: 0, projectManagerName: 'Chaminda Silva',
    description: 'High-tech green building certified IT facility with solar canopy.',
    notes: 'Completed on schedule. Final client payment certificate signed off.',
  },
];

const DASHBOARD = {
  activeProjects: 3,
  totalProjects: 4,
  totalTasks: 68,
  overdueTasks: 4,
  openIssues: 7,
  totalBudget: 220000000,
  totalExpenses: 50800000,
  recentProjects: PROJECTS.slice(0, 3).map(({ id, name, status, completionPercentage, projectCode, clientName }) =>
    ({ id, name, status, completionPercentage, projectCode, clientName })),
  recentTasks: [
    { id: 't1', title: 'Install D16 rebar grid – Level 12 North Bay', status: 1, priority: 2, projectName: 'Lotus Commercial Tower Complex', dueDate: '2026-04-10T00:00:00Z', assigneeName: 'Nuwan Bandara' },
    { id: 't2', title: 'Concrete pour – Pier 4 Abutment (80 m³)', status: 0, priority: 3, projectName: 'Central Expressway Interchange', dueDate: '2026-04-05T00:00:00Z', assigneeName: 'Sunil Shantha' },
    { id: 't3', title: 'Site topography survey & benchmark staking', status: 3, priority: 1, projectName: 'Galle Heritage Coastal Resort', dueDate: '2026-03-20T00:00:00Z', assigneeName: 'Tharindu Fernando' },
  ],
  upcomingMilestones: [
    { id: 'm1', title: 'Level 15 Structural Slab Cast', projectName: 'Lotus Commercial Tower Complex', dueDate: '2026-07-01T00:00:00Z', isCompleted: false },
    { id: 'm2', title: 'Flyover Beam Erection Handover', projectName: 'Central Expressway Interchange', dueDate: '2026-05-15T00:00:00Z', isCompleted: false },
  ],
  recentIssues: [
    { id: 'i1', issueNumber: 'ISS-001', title: 'Rebar spacing non-conformance', status: 1, priority: 2, typeName: 'Quality', projectName: 'Lotus Commercial Tower Complex' },
    { id: 'i2', issueNumber: 'ISS-002', title: 'Crane swing clearance with utility poles', status: 0, priority: 3, typeName: 'Safety', projectName: 'Central Expressway Interchange' },
  ],
};

// ─── Tasks ────────────────────────────────────────────────────────────────────
const TASKS = [
  { id: 't1', title: 'Install D16 rebar grid – Level 12 North Bay', description: 'Install high-yield deformed bars per structural spec S-112.', status: 1, priority: 2, projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', assigneeId: 'u2', assigneeName: 'Nuwan Bandara', dueDate: '2026-04-10T00:00:00Z', startDate: '2026-04-01T00:00:00Z', estimatedHours: 40, actualHours: 18, completionPercentage: 45 },
  { id: 't2', title: 'Concrete pour – Pier 4 Abutment (80 m³)', description: 'Supervise Grade 40 ready-mix concrete pump pour.', status: 0, priority: 3, projectId: 'p2', projectName: 'Central Expressway Interchange', assigneeId: 'u3', assigneeName: 'Sunil Shantha', dueDate: '2026-04-05T00:00:00Z', startDate: '2026-04-03T00:00:00Z', estimatedHours: 24, actualHours: 0, completionPercentage: 0 },
  { id: 't3', title: 'Site topography survey & benchmark staking', description: 'Final GPS stakeout of coastal boundary offsets.', status: 3, priority: 1, projectId: 'p3', projectName: 'Galle Heritage Coastal Resort', assigneeId: 'u4', assigneeName: 'Tharindu Fernando', dueDate: '2026-03-20T00:00:00Z', startDate: '2026-03-18T00:00:00Z', estimatedHours: 16, actualHours: 16, completionPercentage: 100 },
  { id: 't4', title: 'Formwork inspection – Level 11 Slab', description: 'Civil QA inspection before concrete batching approval.', status: 2, priority: 2, projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', assigneeId: 'u2', assigneeName: 'Nuwan Bandara', dueDate: '2026-03-28T00:00:00Z', startDate: '2026-03-27T00:00:00Z', estimatedHours: 8, actualHours: 8, completionPercentage: 100 },
  { id: 't5', title: 'Perimeter safety barricade & hoarding', description: 'Install safety signage and perimeter barricading.', status: 0, priority: 3, projectId: 'p3', projectName: 'Galle Heritage Coastal Resort', assigneeId: null, assigneeName: null, dueDate: '2026-04-15T00:00:00Z', startDate: null, estimatedHours: 12, actualHours: 0, completionPercentage: 0 },
];

// ─── Expenses (Sri Lankan Rupee amounts) ───────────────────────────────────────
const EXPENSES = [
  { id: 'e1', projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', title: 'Ready-mix concrete delivery (Batch 14)', category: 1, amount: 2850000, currency: 'LKR', expenseDate: '2026-03-15T00:00:00Z', vendor: 'Tokyo Supermix (Pvt) Ltd', isApproved: true, isPaid: true, receiptUrl: null, submittedByName: 'Nuwan Bandara', notes: 'Grade 35 concrete for shear wall casting.' },
  { id: 'e2', projectId: 'p2', projectName: 'Central Expressway Interchange', title: 'Hydraulic mobile crane hire – 50 Ton', category: 3, amount: 950000, currency: 'LKR', expenseDate: '2026-03-01T00:00:00Z', vendor: 'Lanka Heavy Lift Rentals', isApproved: true, isPaid: false, receiptUrl: null, submittedByName: 'Sunil Shantha', notes: 'Pre-cast beam positioning.' },
  { id: 'e3', projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', title: 'Stationary concrete pump hire', category: 3, amount: 480000, currency: 'LKR', expenseDate: '2026-03-20T00:00:00Z', vendor: 'Ceylinco Equipment Hire', isApproved: false, isPaid: false, receiptUrl: null, submittedByName: 'Kasun Jayawardena', notes: 'Pending PM approval.' },
  { id: 'e4', projectId: 'p3', projectName: 'Galle Heritage Coastal Resort', title: 'Total Station & GPS Survey hire', category: 3, amount: 185000, currency: 'LKR', expenseDate: '2026-03-18T00:00:00Z', vendor: 'GeoTech Lanka Services', isApproved: true, isPaid: true, receiptUrl: null, submittedByName: 'Tharindu Fernando', notes: null },
];

// ─── Daily Logs ───────────────────────────────────────────────────────────────
const DAILY_LOGS = [
  { id: 'dl1', projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', logDate: '2026-03-25T00:00:00Z', weather: 0, temperature: 31, workerCount: 42, supervisorId: 'u2', supervisorName: 'Nuwan Bandara', workSummary: 'Level 12 shear wall formwork & D16 rebar tying. 70% complete.', isApproved: true, approvedByName: 'Kasun Jayawardena', safetyIncidents: 0, delaysReported: false, equipmentUsed: 'Tower Crane TC-01, Rebar Cutter', materialsUsed: 'Deformed Bar D16 – 3.8 tons, Binding Wire – 50 kg', notes: null },
  { id: 'dl2', projectId: 'p2', projectName: 'Central Expressway Interchange', logDate: '2026-03-25T00:00:00Z', weather: 2, temperature: 26, workerCount: 28, supervisorId: 'u3', supervisorName: 'Sunil Shantha', workSummary: 'Pier 4 footing reinforcement. Afternoon monsoon rain delayed casting by 1.5 hrs.', isApproved: false, approvedByName: null, safetyIncidents: 0, delaysReported: true, equipmentUsed: 'Excavator EX-03, Dewatering Pump', materialsUsed: 'Plywood formwork – 45 sheets', notes: 'Heavy rain in Kadugannawa caused temporary stoppage.' },
  { id: 'dl3', projectId: 'p3', projectName: 'Galle Heritage Coastal Resort', logDate: '2026-03-24T00:00:00Z', weather: 0, temperature: 30, workerCount: 18, supervisorId: 'u4', supervisorName: 'Tharindu Fernando', workSummary: 'Site clearing and ground leveling for Villa Block A.', isApproved: true, approvedByName: 'Anusha Wickramasinghe', safetyIncidents: 0, delaysReported: false, equipmentUsed: 'Backhoe Loader, Plate Compactor', materialsUsed: 'Quarry Dust – 2 cubes', notes: null },
];

// ─── Equipment Fleet ──────────────────────────────────────────────────────────
const EQUIPMENT = [
  { id: 'eq1', name: 'Liebherr Tower Crane 420 EC-B', equipmentCode: 'TC-001', category: 'Crane', manufacturer: 'Liebherr', model: '420 EC-B', serialNumber: 'LH-420-LK-8831', status: 1, currentProjectId: 'p1', currentProjectName: 'Lotus Commercial Tower Complex', purchaseDate: '2021-06-01T00:00:00Z', purchasePrice: 28500000, lastMaintenanceDate: '2026-01-15T00:00:00Z', nextMaintenanceDue: '2026-07-15T00:00:00Z', notes: 'Certified by National Construction Authority.' },
  { id: 'eq2', name: 'Schwing Stetter Concrete Pump', equipmentCode: 'CP-002', category: 'Pump', manufacturer: 'Schwing Stetter', model: 'S45 SX', serialNumber: 'SS-45-LK-1104', status: 0, currentProjectId: null, currentProjectName: null, purchaseDate: '2022-04-15T00:00:00Z', purchasePrice: 14500000, lastMaintenanceDate: '2026-02-20T00:00:00Z', nextMaintenanceDue: '2026-08-20T00:00:00Z', notes: 'Available at Kelaniya Central Yard.' },
  { id: 'eq3', name: 'CAT 308 Mini Hydraulic Excavator', equipmentCode: 'EX-003', category: 'Excavator', manufacturer: 'Caterpillar', model: '308 CR', serialNumber: 'CAT-308-2023-LK', status: 1, currentProjectId: 'p3', currentProjectName: 'Galle Heritage Coastal Resort', purchaseDate: '2023-02-10T00:00:00Z', purchasePrice: 8200000, lastMaintenanceDate: '2026-03-01T00:00:00Z', nextMaintenanceDue: '2026-09-01T00:00:00Z', notes: null },
  { id: 'eq4', name: 'Mikasa Plate Compactor 90kg', equipmentCode: 'PC-004', category: 'Compactor', manufacturer: 'Mikasa', model: 'MVC-F60', serialNumber: 'MK-F60-2022-99', status: 1, currentProjectId: 'p3', currentProjectName: 'Galle Heritage Coastal Resort', purchaseDate: '2022-11-01T00:00:00Z', purchasePrice: 420000, lastMaintenanceDate: '2026-03-10T00:00:00Z', nextMaintenanceDue: '2026-09-10T00:00:00Z', notes: null },
];

// ─── Materials Catalog (Sri Lankan Market Pricing in LKR) ─────────────────────
const MATERIALS = [
  { id: 'mat1', name: 'INSEE Sanstha Portland Composite Cement (50kg)', materialCode: 'MAT-001', category: 'Cement', unit: 'bag', unitCost: 2350, stockQuantity: 450, minStockLevel: 100, projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', supplier: 'Siam City Cement (Lanka) Ltd', notes: 'SLS 107 certified.' },
  { id: 'mat2', name: 'Grade 500 High-Yield Deformed Steel Rebar (16mm)', materialCode: 'MAT-002', category: 'Steel', unit: 'ton', unitCost: 385000, stockQuantity: 18.5, minStockLevel: 5, projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', supplier: 'Melwa Steel Lanka (Pvt) Ltd', notes: 'Standard 12m length bundles.' },
  { id: 'mat3', name: 'River Sand (Washed Coarse Sand)', materialCode: 'MAT-003', category: 'Aggregates', unit: 'cube', unitCost: 18500, stockQuantity: 24, minStockLevel: 10, projectId: 'p2', projectName: 'Central Expressway Interchange', supplier: 'Kelani River Sand Supplies', notes: 'GSMB permitted transport.' },
  { id: 'mat4', name: '3/4 inch Metal Aggregate (Crushed Stone)', materialCode: 'MAT-004', category: 'Aggregates', unit: 'cube', unitCost: 22000, stockQuantity: 35, minStockLevel: 15, projectId: 'p2', projectName: 'Central Expressway Interchange', supplier: 'Hanthana Quarries Ltd', notes: null },
  { id: 'mat5', name: 'Waterproofing Bituminous Membrane 4mm', materialCode: 'MAT-005', category: 'Waterproofing', unit: 'roll', unitCost: 8900, stockQuantity: 80, minStockLevel: 20, projectId: 'p3', projectName: 'Galle Heritage Coastal Resort', supplier: 'Sika Lanka (Pvt) Ltd', notes: 'Basement tanking application.' },
];

// ─── Documents ────────────────────────────────────────────────────────────────
const DOCUMENTS = [
  { id: 'doc1', projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', title: 'Architectural Working Drawings Rev D', documentType: 0, fileUrl: '#', fileSize: 18200000, uploadedByName: 'Kasun Jayawardena', uploadedAt: '2026-02-10T00:00:00Z', isArchived: false, version: 'Rev D', description: 'Approved structural & MEP drawings for Tower 1.' },
  { id: 'doc2', projectId: 'p2', projectName: 'Central Expressway Interchange', title: 'Environmental & CEA Clearance Certificate', documentType: 2, fileUrl: '#', fileSize: 4500000, uploadedByName: 'Dinesh Perera', uploadedAt: '2025-12-01T00:00:00Z', isArchived: false, version: '1.0', description: 'Central Environmental Authority Sri Lanka approval.' },
  { id: 'doc3', projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', title: 'CIDA Construction Contract & Agreement', documentType: 1, fileUrl: '#', fileSize: 2100000, uploadedByName: 'Kasun Jayawardena', uploadedAt: '2025-01-10T00:00:00Z', isArchived: false, version: 'Final', description: 'Standard CIDA / ICTAD Contract.' },
];

// ─── Milestones ───────────────────────────────────────────────────────────────
const MILESTONES = [
  { id: 'ms1', projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', title: 'Bored Piling & Substructure Completion', description: 'All 64 deep piles cast and tested with pile integrity testing.', dueDate: '2025-08-31T00:00:00Z', completedDate: '2025-08-28T00:00:00Z', isCompleted: true, paymentAmount: 18000000, paymentReceived: true, paymentReceivedDate: '2025-09-05T00:00:00Z', notes: 'Completed 3 days ahead of schedule.' },
  { id: 'ms2', projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', title: 'Level 15 Structural Slab Topping', description: 'Cast structural floor slab for Mid-Rise podium level.', dueDate: '2026-07-01T00:00:00Z', completedDate: null, isCompleted: false, paymentAmount: 22000000, paymentReceived: false, paymentReceivedDate: null, notes: null },
  { id: 'ms3', projectId: 'p2', projectName: 'Central Expressway Interchange', title: 'Pier 1 to 6 Girder Deck Placement', description: 'Erection of pre-stressed concrete girders.', dueDate: '2026-03-31T00:00:00Z', completedDate: '2026-03-29T00:00:00Z', isCompleted: true, paymentAmount: 14500000, paymentReceived: false, paymentReceivedDate: null, notes: 'Client invoice submitted to RDA.' },
];

// ─── Issues ───────────────────────────────────────────────────────────────────
const ISSUES = [
  { id: 'i1', issueNumber: 'ISS-001', projectId: 'p1', projectName: 'Lotus Commercial Tower Complex', title: 'Shear wall rebar pitch spacing on Grid D-F', description: 'Observed spacing at 175mm instead of 150mm specified on drawings.', type: 2, typeName: 'Quality', status: 1, priority: 2, location: 'Level 12, Grid D-F', reportedByName: 'Nuwan Bandara', assignedToId: 'u5', assignedToName: 'Eng. Priyantha Dissanayake', dueDate: '2026-04-08T00:00:00Z', resolvedDate: null, notes: 'RFI submitted to structural consultant.' },
  { id: 'i2', issueNumber: 'ISS-002', projectId: 'p2', projectName: 'Central Expressway Interchange', title: 'Crane swing safety clearance near 33kV line', description: 'Minimum 5m safety clearance required from CEB overhead power lines.', type: 1, typeName: 'Safety', status: 0, priority: 3, location: 'Pier 3 approach', reportedByName: 'Sunil Shantha', assignedToId: null, assignedToName: null, dueDate: '2026-04-02T00:00:00Z', resolvedDate: null, notes: 'CEB safety engineer requested for on-site line shutdown.' },
];

// ─── Team Members (Sri Lankan Labor Rates in LKR/day) ──────────────────────────
const TEAM_MEMBERS = [
  { id: 'pm1', projectId: 'p1', userId: 'u1', userName: 'Kasun Jayawardena', userEmail: 'kasun.j@buildtech.lk', userPhone: '+94 77 123 4567', userJobTitle: 'Project Manager (Chartered Civil)', role: 'Manager', dailyRate: 12500, joinedDate: '2025-01-15T00:00:00Z', leftDate: null, isActive: true, notes: null },
  { id: 'pm2', projectId: 'p1', userId: 'u2', userName: 'Nuwan Bandara', userEmail: 'nuwan.b@buildtech.lk', userPhone: '+94 77 234 5678', userJobTitle: 'Senior Site Supervisor', role: 'Manager', dailyRate: 6500, joinedDate: '2025-01-20T00:00:00Z', leftDate: null, isActive: true, notes: null },
  { id: 'pm3', projectId: 'p2', userId: 'u3', userName: 'Sunil Shantha', userEmail: 'sunil.s@buildtech.lk', userPhone: '+94 71 345 6789', userJobTitle: 'Resident Site Engineer', role: 'Manager', dailyRate: 8500, joinedDate: '2025-03-01T00:00:00Z', leftDate: null, isActive: true, notes: null },
  { id: 'pm4', projectId: 'p3', userId: 'u4', userName: 'Tharindu Fernando', userEmail: 'tharindu.f@buildtech.lk', userPhone: '+94 76 456 7890', userJobTitle: 'Licensed Land Surveyor', role: 'Worker', dailyRate: 5500, joinedDate: '2025-06-01T00:00:00Z', leftDate: null, isActive: true, notes: null },
  { id: 'pm5', projectId: 'p1', userId: 'u5', userName: 'Eng. Priyantha Dissanayake', userEmail: 'priyantha@strconsultants.lk', userPhone: '+94 77 567 8901', userJobTitle: 'Lead Structural Consultant', role: 'Viewer', dailyRate: null, joinedDate: '2025-02-01T00:00:00Z', leftDate: null, isActive: true, notes: 'External structural auditor.' },
  { id: 'pm6', projectId: 'p1', userId: 'u6', userName: 'Mahinda Gamage', userEmail: 'mahinda.g@buildtech.lk', userPhone: '+94 70 678 9012', userJobTitle: 'Master Mason / Trade Carpenter', role: 'Worker', dailyRate: 4500, joinedDate: '2025-03-10T00:00:00Z', leftDate: null, isActive: true, notes: 'Permanent trade craftsman.' },
  { id: 'pm7', projectId: 'p1', userId: 'u7', userName: 'Ajith Kumara', userEmail: 'ajith.k@buildtech.lk', userPhone: '+94 72 789 0123', userJobTitle: 'General Site Laborer', role: 'Worker', dailyRate: 3500, joinedDate: '2025-03-10T00:00:00Z', leftDate: null, isActive: true, notes: null },
];

// ─── KPI Dashboard ────────────────────────────────────────────────────────────
const KPI_DATA = {
  projectId: 'p1',
  projectName: 'Lotus Commercial Tower Complex',
  financials: {
    contractValue: 85000000,
    revisedBudget: 89500000,
    committedCost: 38200000,
    actualCost: 24500000,
    budgetVariance: 26800000,
    costPerformanceIndex: 1.08,
  },
  progress: {
    physicalProgressPercentage: 35,
    financialProgressPercentage: 27.4,
    schedulePerformanceIndex: 0.98,
    scheduleStatus: 'On Schedule',
    completedActivities: 29,
    totalActivities: 84,
    overdueActivities: 2,
    scheduleDelayDays: 0,
  },
  fieldOperations: {
    workersOnSiteToday: 42,
    totalLaborHoursLogged: 4860,
    equipmentInUseCount: 6,
    pendingMaterialRequestsCount: 2,
  },
  risksAndIssues: {
    openRFIs: 3,
    overdueRFIs: 0,
    pendingChangeOrders: 1,
    totalSafetyIncidents: 0,
    openQualityDeficiencies: 1,
  },
};

// ─── Export map ───────────────────────────────────────────────────────────────
export const DEMO_MOCK_DATA: Record<string, unknown> = {
  '/settings': TENANT_SETTINGS,
  '/projects/dashboard': DASHBOARD,
  '/projects': pagedOf(PROJECTS),
  '/projects/p1': PROJECTS[0],
  '/projects/p2': PROJECTS[1],
  '/projects/p3': PROJECTS[2],
  '/projects/p4': PROJECTS[3],
  '/kpidashboard/project/p1': KPI_DATA,
  '/tasks/my-tasks': pagedOf(TASKS),
  '/tasks': pagedOf(TASKS),
  '/tasks/t1': TASKS[0],
  '/expenses': pagedOf(EXPENSES),
  '/dailylogs': pagedOf(DAILY_LOGS),
  '/equipment': pagedOf(EQUIPMENT),
  '/materials': pagedOf(MATERIALS),
  '/documents': pagedOf(DOCUMENTS),
  '/milestones': pagedOf(MILESTONES),
  '/issues': pagedOf(ISSUES),
  '/projectmembers': pagedOf(TEAM_MEMBERS),
};
