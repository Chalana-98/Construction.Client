/**
 * Demo Mode – Mock API responses keyed by URL prefix.
 * Used by the RTK Query baseQuery interceptor in api.ts when token === 'demo-token'.
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

// ─── Projects ────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'p1', name: 'Skyline Tower Complex', projectCode: 'SKY-001', clientName: 'Metro Developers Ltd',
    clientEmail: 'info@metrodev.com', clientPhone: '+1 555-0100', siteAddress: '100 Skyline Ave',
    city: 'New York', state: 'NY', country: 'USA', postalCode: '10001',
    budget: 12500000, currency: 'USD', totalExpenses: 3400000,
    status: 2, startDate: '2025-01-15T00:00:00Z', endDate: '2026-12-31T00:00:00Z',
    completionPercentage: 28, taskCount: 84, completedTaskCount: 23,
    memberCount: 12, openIssueCount: 5, projectManagerName: 'Sarah Chen',
    description: 'Mixed-use high-rise development featuring 45 floors of residential and commercial space.',
    notes: 'Phase 1 foundation work completed. Phase 2 structural steel erection in progress.',
  },
  {
    id: 'p2', name: 'Harbor Bridge Restoration', projectCode: 'HBR-002', clientName: 'City of Portland',
    clientEmail: 'projects@portland.gov', clientPhone: '+1 555-0200', siteAddress: '1 Harbor Way',
    city: 'Portland', state: 'OR', country: 'USA', postalCode: '97201',
    budget: 4800000, currency: 'USD', totalExpenses: 2100000,
    status: 2, startDate: '2025-03-01T00:00:00Z', endDate: '2026-06-30T00:00:00Z',
    completionPercentage: 44, taskCount: 56, completedTaskCount: 25,
    memberCount: 8, openIssueCount: 2, projectManagerName: 'James Rivera',
    description: 'Historic bridge restoration including structural reinforcement and aesthetic upgrades.',
    notes: 'West span restoration 60% complete. Environmental compliance reviews ongoing.',
  },
  {
    id: 'p3', name: 'Green Valley Residences', projectCode: 'GVR-003', clientName: 'GreenHome Properties',
    clientEmail: 'build@greenhome.com', clientPhone: '+1 555-0300', siteAddress: '45 Valley Rd',
    city: 'Austin', state: 'TX', country: 'USA', postalCode: '78701',
    budget: 7200000, currency: 'USD', totalExpenses: 1600000,
    status: 1, startDate: '2025-06-01T00:00:00Z', endDate: '2027-03-31T00:00:00Z',
    completionPercentage: 10, taskCount: 120, completedTaskCount: 12,
    memberCount: 9, openIssueCount: 1, projectManagerName: 'Maria Gonzalez',
    description: '48-unit eco-friendly residential community with solar panels and green roofs.',
    notes: 'Site preparation complete. Permit approvals received. Construction to begin July 2025.',
  },
  {
    id: 'p4', name: 'Riverside Office Park', projectCode: 'ROP-004', clientName: 'Apex Commercial',
    clientEmail: 'dev@apexcommercial.com', clientPhone: '+1 555-0400', siteAddress: '200 Riverside Blvd',
    city: 'Chicago', state: 'IL', country: 'USA', postalCode: '60601',
    budget: 9300000, currency: 'USD', totalExpenses: 9100000,
    status: 4, startDate: '2023-09-01T00:00:00Z', endDate: '2025-12-15T00:00:00Z',
    completionPercentage: 100, taskCount: 92, completedTaskCount: 92,
    memberCount: 14, openIssueCount: 0, projectManagerName: 'Tom Bradley',
    description: 'Three-building Class A office park with 250,000 sqft of leasable space.',
    notes: 'Project completed on schedule. Certificate of occupancy received.',
  },
];

const DASHBOARD = {
  activeProjectCount: 3,
  totalProjectCount: 4,
  activeTaskCount: 61,
  openIssueCount: 8,
  totalBudget: 33800000,
  totalExpenses: 16200000,
  recentProjects: PROJECTS.slice(0, 3).map(({ id, name, status, completionPercentage, projectCode, clientName }) =>
    ({ id, name, status, completionPercentage, projectCode, clientName })),
  recentTasks: [
    { id: 't1', title: 'Install rebar grid – Level 12', status: 1, priority: 2, projectName: 'Skyline Tower Complex', dueDate: '2026-04-10T00:00:00Z', assigneeName: 'Mike Torres' },
    { id: 't2', title: 'Concrete pour – West Abutment', status: 0, priority: 3, projectName: 'Harbor Bridge Restoration', dueDate: '2026-04-05T00:00:00Z', assigneeName: 'Ana Lima' },
    { id: 't3', title: 'Site survey & staking', status: 3, priority: 1, projectName: 'Green Valley Residences', dueDate: '2026-03-20T00:00:00Z', assigneeName: 'Bob Singh' },
  ],
  upcomingMilestones: [
    { id: 'm1', title: 'Structural Topping Out', projectName: 'Skyline Tower Complex', dueDate: '2026-07-01T00:00:00Z', isCompleted: false },
    { id: 'm2', title: 'East Span Handover', projectName: 'Harbor Bridge Restoration', dueDate: '2026-05-15T00:00:00Z', isCompleted: false },
  ],
  recentIssues: [
    { id: 'i1', issueNumber: 'ISS-001', title: 'Rebar spacing non-conformance', status: 1, priority: 2, typeName: 'Quality', projectName: 'Skyline Tower Complex' },
    { id: 'i2', issueNumber: 'ISS-002', title: 'Crane swing radius conflict', status: 0, priority: 3, typeName: 'Safety', projectName: 'Harbor Bridge Restoration' },
  ],
};

// ─── Tasks ────────────────────────────────────────────────────────────────────
const TASKS = [
  { id: 't1', title: 'Install rebar grid – Level 12', description: 'Install D16 rebar grid per structural drawings S-112.', status: 1, priority: 2, projectId: 'p1', projectName: 'Skyline Tower Complex', assigneeId: 'u2', assigneeName: 'Mike Torres', dueDate: '2026-04-10T00:00:00Z', startDate: '2026-04-01T00:00:00Z', estimatedHours: 40, actualHours: 18, completionPercentage: 45 },
  { id: 't2', title: 'Concrete pour – West Abutment', description: 'Schedule and supervise 120m³ concrete pour.', status: 0, priority: 3, projectId: 'p2', projectName: 'Harbor Bridge Restoration', assigneeId: 'u3', assigneeName: 'Ana Lima', dueDate: '2026-04-05T00:00:00Z', startDate: '2026-04-03T00:00:00Z', estimatedHours: 24, actualHours: 0, completionPercentage: 0 },
  { id: 't3', title: 'Site survey & staking', description: 'Final stakeout of building corners.', status: 3, priority: 1, projectId: 'p3', projectName: 'Green Valley Residences', assigneeId: 'u4', assigneeName: 'Bob Singh', dueDate: '2026-03-20T00:00:00Z', startDate: '2026-03-18T00:00:00Z', estimatedHours: 16, actualHours: 16, completionPercentage: 100 },
  { id: 't4', title: 'Formwork inspection – Level 11', description: 'Inspect and approve formwork prior to concrete pour.', status: 2, priority: 2, projectId: 'p1', projectName: 'Skyline Tower Complex', assigneeId: 'u2', assigneeName: 'Mike Torres', dueDate: '2026-03-28T00:00:00Z', startDate: '2026-03-27T00:00:00Z', estimatedHours: 8, actualHours: 8, completionPercentage: 100 },
  { id: 't5', title: 'Safety fence installation', description: 'Install perimeter safety fencing around new build zone.', status: 0, priority: 3, projectId: 'p3', projectName: 'Green Valley Residences', assigneeId: null, assigneeName: null, dueDate: '2026-04-15T00:00:00Z', startDate: null, estimatedHours: 12, actualHours: 0, completionPercentage: 0 },
];

// ─── Expenses ─────────────────────────────────────────────────────────────────
const EXPENSES = [
  { id: 'e1', projectId: 'p1', projectName: 'Skyline Tower Complex', title: 'Steel delivery – batch 3', category: 1, amount: 248000, currency: 'USD', expenseDate: '2026-03-15T00:00:00Z', vendor: 'SteelCo USA', isApproved: true, isPaid: true, receiptUrl: null, submittedByName: 'Mike Torres', notes: 'Includes freight surcharge.' },
  { id: 'e2', projectId: 'p2', projectName: 'Harbor Bridge Restoration', title: 'Scaffold rental – March', category: 3, amount: 18500, currency: 'USD', expenseDate: '2026-03-01T00:00:00Z', vendor: 'ScaffoldPro', isApproved: true, isPaid: false, receiptUrl: null, submittedByName: 'Ana Lima', notes: null },
  { id: 'e3', projectId: 'p1', projectName: 'Skyline Tower Complex', title: 'Concrete pump rental', category: 3, amount: 9200, currency: 'USD', expenseDate: '2026-03-20T00:00:00Z', vendor: 'RentRight Equipment', isApproved: false, isPaid: false, receiptUrl: null, submittedByName: 'Sarah Chen', notes: 'Pending PM approval.' },
  { id: 'e4', projectId: 'p3', projectName: 'Green Valley Residences', title: 'Survey equipment hire', category: 3, amount: 3400, currency: 'USD', expenseDate: '2026-03-18T00:00:00Z', vendor: 'GeoSurvey Inc', isApproved: true, isPaid: true, receiptUrl: null, submittedByName: 'Bob Singh', notes: null },
];

// ─── Daily Logs ───────────────────────────────────────────────────────────────
const DAILY_LOGS = [
  { id: 'dl1', projectId: 'p1', projectName: 'Skyline Tower Complex', logDate: '2026-03-25T00:00:00Z', weather: 1, temperature: 62, workerCount: 38, supervisorId: 'u2', supervisorName: 'Mike Torres', workSummary: 'Continued rebar installation on Level 12 north bay. Approx 65% complete.', isApproved: true, approvedByName: 'Sarah Chen', safetyIncidents: 0, delaysReported: false, equipmentUsed: 'Tower crane TC-1, Rebar bender RB-2', materialsUsed: 'D16 rebar – 4.2 tons', notes: null },
  { id: 'dl2', projectId: 'p2', projectName: 'Harbor Bridge Restoration', logDate: '2026-03-25T00:00:00Z', weather: 2, temperature: 55, workerCount: 22, supervisorId: 'u3', supervisorName: 'Ana Lima', workSummary: 'Temporary formwork installation on west abutment. Weather delay 2hrs AM.', isApproved: false, approvedByName: null, safetyIncidents: 0, delaysReported: true, equipmentUsed: 'Crane C-3, Formwork trailer', materialsUsed: 'Plywood forms – 80 sheets', notes: 'Wind gusts above safe crane ops limit caused 2hr morning delay.' },
  { id: 'dl3', projectId: 'p3', projectName: 'Green Valley Residences', logDate: '2026-03-24T00:00:00Z', weather: 0, temperature: 71, workerCount: 14, supervisorId: 'u4', supervisorName: 'Bob Singh', workSummary: 'Completed final survey staking. Began site preparation for building A footprint.', isApproved: true, approvedByName: 'Maria Gonzalez', safetyIncidents: 0, delaysReported: false, equipmentUsed: 'Total station, Mini excavator', materialsUsed: 'Survey stakes, marking paint', notes: null },
];

// ─── Equipment ────────────────────────────────────────────────────────────────
const EQUIPMENT = [
  { id: 'eq1', name: 'Tower Crane TC-1', equipmentCode: 'TC-001', category: 'Crane', manufacturer: 'Liebherr', model: '420 EC-B', serialNumber: 'LH420-2021-0831', status: 1, currentProjectId: 'p1', currentProjectName: 'Skyline Tower Complex', purchaseDate: '2021-06-01T00:00:00Z', purchasePrice: 890000, lastMaintenanceDate: '2026-01-15T00:00:00Z', nextMaintenanceDue: '2026-07-15T00:00:00Z', notes: 'Certified for 300-ton lift capacity.' },
  { id: 'eq2', name: 'Concrete Pump', equipmentCode: 'CP-002', category: 'Pump', manufacturer: 'Schwing', model: 'S45 SX', serialNumber: 'SW-S45-2022-1104', status: 0, currentProjectId: null, currentProjectName: null, purchaseDate: '2022-04-15T00:00:00Z', purchasePrice: 320000, lastMaintenanceDate: '2026-02-20T00:00:00Z', nextMaintenanceDue: '2026-08-20T00:00:00Z', notes: null },
  { id: 'eq3', name: 'Mini Excavator', equipmentCode: 'EX-003', category: 'Excavator', manufacturer: 'Caterpillar', model: '308 CR', serialNumber: 'CAT308-2023-0567', status: 1, currentProjectId: 'p3', currentProjectName: 'Green Valley Residences', purchaseDate: '2023-02-10T00:00:00Z', purchasePrice: 95000, lastMaintenanceDate: '2026-03-01T00:00:00Z', nextMaintenanceDue: '2026-09-01T00:00:00Z', notes: null },
  { id: 'eq4', name: 'Rebar Bender RB-2', equipmentCode: 'RB-004', category: 'Tool', manufacturer: 'BN Products', model: 'BNCE-40', serialNumber: 'BN-BNCE-2020-0312', status: 2, currentProjectId: null, currentProjectName: null, purchaseDate: '2020-11-01T00:00:00Z', purchasePrice: 4500, lastMaintenanceDate: '2026-03-10T00:00:00Z', nextMaintenanceDue: '2026-09-10T00:00:00Z', notes: 'Scheduled for replacement – nearing end of service life.' },
];

// ─── Materials ────────────────────────────────────────────────────────────────
const MATERIALS = [
  { id: 'mat1', name: 'D16 Deformed Rebar', materialCode: 'MAT-001', category: 'Steel', unit: 'ton', unitCost: 980, stockQuantity: 42.6, minStockLevel: 10, projectId: 'p1', projectName: 'Skyline Tower Complex', supplier: 'SteelCo USA', notes: null },
  { id: 'mat2', name: 'Ready-Mix Concrete (40 MPa)', materialCode: 'MAT-002', category: 'Concrete', unit: 'm³', unitCost: 185, stockQuantity: 0, minStockLevel: 50, projectId: 'p2', projectName: 'Harbor Bridge Restoration', supplier: 'PortlandMix Ltd', notes: 'Next delivery scheduled 2026-04-03.' },
  { id: 'mat3', name: 'Structural Plywood 18mm', materialCode: 'MAT-003', category: 'Timber', unit: 'sheet', unitCost: 42, stockQuantity: 320, minStockLevel: 80, projectId: 'p1', projectName: 'Skyline Tower Complex', supplier: 'TimberWorld', notes: null },
  { id: 'mat4', name: 'Waterproofing Membrane', materialCode: 'MAT-004', category: 'Waterproofing', unit: 'm²', unitCost: 18, stockQuantity: 1200, minStockLevel: 200, projectId: 'p3', projectName: 'Green Valley Residences', supplier: 'SealRight Inc', notes: 'ISO 9001 certified product.' },
  { id: 'mat5', name: 'Structural Steel I-Beam (W310)', materialCode: 'MAT-005', category: 'Steel', unit: 'm', unitCost: 210, stockQuantity: 7, minStockLevel: 20, projectId: 'p1', projectName: 'Skyline Tower Complex', supplier: 'SteelCo USA', notes: null },
];

// ─── Documents ────────────────────────────────────────────────────────────────
const DOCUMENTS = [
  { id: 'doc1', projectId: 'p1', projectName: 'Skyline Tower Complex', title: 'Structural Engineering Drawings – Rev C', documentType: 0, fileUrl: '#', fileSize: 18200000, uploadedByName: 'Sarah Chen', uploadedAt: '2026-02-10T00:00:00Z', isArchived: false, version: 'Rev C', description: 'Full structural set for Level 10–20.' },
  { id: 'doc2', projectId: 'p2', projectName: 'Harbor Bridge Restoration', title: 'Environmental Impact Assessment', documentType: 3, fileUrl: '#', fileSize: 4500000, uploadedByName: 'James Rivera', uploadedAt: '2025-12-01T00:00:00Z', isArchived: false, version: '1.0', description: 'Approved EIA report.' },
  { id: 'doc3', projectId: 'p1', projectName: 'Skyline Tower Complex', title: 'Construction Contract – Phase 1', documentType: 1, fileUrl: '#', fileSize: 2100000, uploadedByName: 'Sarah Chen', uploadedAt: '2025-01-10T00:00:00Z', isArchived: false, version: 'Final', description: 'Signed contract between Metro Developers and BuildRight Corp.' },
  { id: 'doc4', projectId: 'p3', projectName: 'Green Valley Residences', title: 'Soil Investigation Report', documentType: 3, fileUrl: '#', fileSize: 8700000, uploadedByName: 'Maria Gonzalez', uploadedAt: '2025-05-20T00:00:00Z', isArchived: false, version: '1.0', description: 'Geotechnical investigation report.' },
  { id: 'doc5', projectId: 'p1', projectName: 'Skyline Tower Complex', title: 'Safety Management Plan v1 (Superseded)', documentType: 2, fileUrl: '#', fileSize: 1800000, uploadedByName: 'Sarah Chen', uploadedAt: '2025-02-01T00:00:00Z', isArchived: true, version: 'v1', description: 'Original SMP – superseded by v2.' },
];

// ─── Milestones ───────────────────────────────────────────────────────────────
const MILESTONES = [
  { id: 'ms1', projectId: 'p1', projectName: 'Skyline Tower Complex', title: 'Foundation Completion', description: 'All below-grade work complete to ground floor slab.', dueDate: '2025-08-31T00:00:00Z', completedDate: '2025-08-28T00:00:00Z', isCompleted: true, paymentAmount: 1250000, paymentReceived: true, paymentReceivedDate: '2025-09-05T00:00:00Z', notes: 'Completed 3 days ahead of schedule.' },
  { id: 'ms2', projectId: 'p1', projectName: 'Skyline Tower Complex', title: 'Structural Topping Out', description: 'Final structural floor slab (Level 45) poured.', dueDate: '2026-07-01T00:00:00Z', completedDate: null, isCompleted: false, paymentAmount: 2500000, paymentReceived: false, paymentReceivedDate: null, notes: null },
  { id: 'ms3', projectId: 'p2', projectName: 'Harbor Bridge Restoration', title: 'East Span Restoration Complete', description: 'All structural and cosmetic works on east span finished.', dueDate: '2026-03-31T00:00:00Z', completedDate: '2026-03-29T00:00:00Z', isCompleted: true, paymentAmount: 1200000, paymentReceived: false, paymentReceivedDate: null, notes: 'Awaiting client payment within 30 days.' },
  { id: 'ms4', projectId: 'p2', projectName: 'Harbor Bridge Restoration', title: 'West Span Handover', description: 'Full handover of restored west span to City.', dueDate: '2026-05-15T00:00:00Z', completedDate: null, isCompleted: false, paymentAmount: 1800000, paymentReceived: false, paymentReceivedDate: null, notes: null },
  { id: 'ms5', projectId: 'p3', projectName: 'Green Valley Residences', title: 'Site Preparation & Utilities', description: 'All underground services and site prep complete.', dueDate: '2026-06-30T00:00:00Z', completedDate: null, isCompleted: false, paymentAmount: 720000, paymentReceived: false, paymentReceivedDate: null, notes: null },
];

// ─── Issues ───────────────────────────────────────────────────────────────────
const ISSUES = [
  { id: 'i1', issueNumber: 'ISS-001', projectId: 'p1', projectName: 'Skyline Tower Complex', title: 'Rebar spacing non-conformance – Level 12 north bay', description: 'Rebar spacing observed at 180mm vs specified 150mm on grid lines C-E.', type: 2, typeName: 'Quality', status: 1, priority: 2, location: 'Level 12, Grid C-E', reportedByName: 'Mike Torres', assignedToId: 'u5', assignedToName: 'Eng. David Park', dueDate: '2026-04-08T00:00:00Z', resolvedDate: null, notes: 'RFI submitted to structural engineer. Awaiting design confirmation.' },
  { id: 'i2', issueNumber: 'ISS-002', projectId: 'p2', projectName: 'Harbor Bridge Restoration', title: 'Crane swing radius conflict with overhead power lines', description: 'TC-3 swing arc intersects 11kV power line on east approach.', type: 1, typeName: 'Safety', status: 0, priority: 3, location: 'East approach, CH 0+180', reportedByName: 'Ana Lima', assignedToId: null, assignedToName: null, dueDate: '2026-04-02T00:00:00Z', resolvedDate: null, notes: 'Work stopped in affected area pending resolution. Utility company contacted.' },
  { id: 'i3', issueNumber: 'ISS-003', projectId: 'p1', projectName: 'Skyline Tower Complex', title: 'Design query – lift shaft dimension change', description: 'Architect revised lift shaft from 2.4m to 2.6m width. Impacts Level 8–45 formwork.', type: 3, typeName: 'Design', status: 2, priority: 2, location: 'Core – all levels', reportedByName: 'Sarah Chen', assignedToId: 'u6', assignedToName: 'Arch. Lisa Wong', dueDate: '2026-04-15T00:00:00Z', resolvedDate: null, notes: 'Revised drawings issued. Formwork subcontractor pricing change order.' },
  { id: 'i4', issueNumber: 'ISS-004', projectId: 'p3', projectName: 'Green Valley Residences', title: 'Stormwater easement encroachment', description: 'Proposed Building B footprint overlaps council stormwater easement by 0.8m.', type: 0, typeName: 'General', status: 1, priority: 1, location: 'Building B – south boundary', reportedByName: 'Bob Singh', assignedToId: 'u4', assignedToName: 'Bob Singh', dueDate: '2026-04-20T00:00:00Z', resolvedDate: null, notes: 'Survey confirmed. Council application for easement modification submitted.' },
  { id: 'i5', issueNumber: 'ISS-005', projectId: 'p1', projectName: 'Skyline Tower Complex', title: 'Concrete slump test failure – Batch 22C', description: 'Slump test on batch 22C returned 210mm vs max 180mm specified.', type: 2, typeName: 'Quality', status: 3, priority: 2, location: 'Level 11 pour', reportedByName: 'Mike Torres', assignedToId: 'u2', assignedToName: 'Mike Torres', dueDate: '2026-03-22T00:00:00Z', resolvedDate: '2026-03-22T00:00:00Z', notes: 'Batch rejected and removed. Replacement pour completed satisfactorily.' },
];

// ─── Team ─────────────────────────────────────────────────────────────────────
const TEAM_MEMBERS = [
  { id: 'pm1', projectId: 'p1', userId: 'u1', userName: 'Sarah Chen', userEmail: 'sarah.chen@buildright.com', userPhone: '+1 555-1001', userJobTitle: 'Project Manager', role: 'Manager', dailyRate: 850, joinedDate: '2025-01-15T00:00:00Z', leftDate: null, isActive: true, notes: null },
  { id: 'pm2', projectId: 'p1', userId: 'u2', userName: 'Mike Torres', userEmail: 'mike.torres@buildright.com', userPhone: '+1 555-1002', userJobTitle: 'Site Supervisor', role: 'Manager', dailyRate: 680, joinedDate: '2025-01-20T00:00:00Z', leftDate: null, isActive: true, notes: null },
  { id: 'pm3', projectId: 'p2', userId: 'u3', userName: 'Ana Lima', userEmail: 'ana.lima@buildright.com', userPhone: '+1 555-1003', userJobTitle: 'Site Engineer', role: 'Manager', dailyRate: 620, joinedDate: '2025-03-01T00:00:00Z', leftDate: null, isActive: true, notes: null },
  { id: 'pm4', projectId: 'p3', userId: 'u4', userName: 'Bob Singh', userEmail: 'bob.singh@buildright.com', userPhone: '+1 555-1004', userJobTitle: 'Surveyor', role: 'Worker', dailyRate: 520, joinedDate: '2025-06-01T00:00:00Z', leftDate: null, isActive: true, notes: null },
  { id: 'pm5', projectId: 'p1', userId: 'u5', userName: 'David Park', userEmail: 'david.park@structeng.com', userPhone: '+1 555-1005', userJobTitle: 'Structural Engineer', role: 'Viewer', dailyRate: null, joinedDate: '2025-02-01T00:00:00Z', leftDate: null, isActive: true, notes: 'External consultant.' },
  { id: 'pm6', projectId: 'p1', userId: 'u7', userName: 'Jack Nolan', userEmail: 'jack.nolan@buildright.com', userPhone: '+1 555-1007', userJobTitle: 'Labourer', role: 'Worker', dailyRate: 380, joinedDate: '2025-03-10T00:00:00Z', leftDate: '2025-12-31T00:00:00Z', isActive: false, notes: 'Contract ended Dec 2025.' },
];

// ─── Expense summary ──────────────────────────────────────────────────────────
const EXPENSE_SUMMARY = {
  totalBudget: 12500000, totalExpenses: 3400000, approvedExpenses: 3100000,
  pendingExpenses: 300000, paidExpenses: 2800000, unpaidExpenses: 300000,
  byCategory: [
    { category: 1, categoryName: 'Materials', total: 2480000 },
    { category: 3, categoryName: 'Equipment Rental', total: 620000 },
    { category: 2, categoryName: 'Labour', total: 180000 },
    { category: 0, categoryName: 'Other', total: 120000 },
  ],
};

// ─── Export map ───────────────────────────────────────────────────────────────
export const DEMO_MOCK_DATA: Record<string, unknown> = {
  '/projects/dashboard': DASHBOARD,
  '/projects': pagedOf(PROJECTS),
  '/projects/p1': PROJECTS[0],
  '/projects/p2': PROJECTS[1],
  '/projects/p3': PROJECTS[2],
  '/projects/p4': PROJECTS[3],
  '/tasks/my-tasks': pagedOf(TASKS),
  '/tasks': pagedOf(TASKS),
  '/tasks/t1': TASKS[0],
  '/expenses/summary': EXPENSE_SUMMARY,
  '/expenses': pagedOf(EXPENSES),
  '/dailylogs': pagedOf(DAILY_LOGS),
  '/equipment': pagedOf(EQUIPMENT),
  '/materials': pagedOf(MATERIALS),
  '/documents': pagedOf(DOCUMENTS),
  '/milestones': pagedOf(MILESTONES),
  '/issues': pagedOf(ISSUES),
  '/projectmembers': pagedOf(TEAM_MEMBERS),
};
