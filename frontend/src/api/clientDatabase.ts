import dbDump from '../data/databaseDump.json';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { MaintenanceRequest, MCRReport, MaintenanceBlock } from '../types';

// Persistent client-side storage keys
const STORAGE_REQUESTS_KEY = 'railway_client_requests';
const STORAGE_MCR_KEY = 'railway_client_mcr';
const STORAGE_BLOCKS_KEY = 'railway_client_blocks';

// Initialize mutable store from localStorage or bundled JSON
const getStoredRequests = (): MaintenanceRequest[] => {
  try {
    const saved = localStorage.getItem(STORAGE_REQUESTS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return (dbDump.maintenance_requests || []) as unknown as MaintenanceRequest[];
};

const saveRequests = (reqs: MaintenanceRequest[]) => {
  try {
    localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(reqs));
  } catch {}
};

const getStoredMCRs = (): MCRReport[] => {
  try {
    const saved = localStorage.getItem(STORAGE_MCR_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return (dbDump.mcr_reports || []) as unknown as MCRReport[];
};

const saveMCRs = (mcrs: MCRReport[]) => {
  try {
    localStorage.setItem(STORAGE_MCR_KEY, JSON.stringify(mcrs));
  } catch {}
};

const getStoredBlocks = (): MaintenanceBlock[] => {
  try {
    const saved = localStorage.getItem(STORAGE_BLOCKS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return (dbDump.maintenance_blocks || []) as unknown as MaintenanceBlock[];
};

const saveBlocks = (blocks: MaintenanceBlock[]) => {
  try {
    localStorage.setItem(STORAGE_BLOCKS_KEY, JSON.stringify(blocks));
  } catch {}
};

export const handleClientDatabaseFallback = (config?: AxiosRequestConfig): AxiosResponse | null => {
  if (!config || !config.url) return null;

  let rawUrl = config.url;
  try {
    if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
      const parsed = new URL(rawUrl);
      rawUrl = parsed.pathname + parsed.search;
    }
  } catch {}

  const url = rawUrl.replace(/^\/?api\/?/, '/');
  const method = (config.method || 'get').toLowerCase();
  const params: Record<string, any> = { ...(config.params || {}) };

  // Parse URL query params if present in URL
  const [pathname, queryString] = url.split('?');
  const queryParams = new URLSearchParams(queryString || '');
  for (const [key, value] of queryParams.entries()) {
    if (!params[key]) params[key] = value;
  }

  const makeResponse = (data: any, status = 200): AxiosResponse => ({
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: (config || {}) as any,
  });

  // --- 1. Master Data Endpoints ---
  if (pathname === '/master/corridors' || pathname === 'master/corridors') {
    const limit = Number(params.limit) || 200;
    return makeResponse(dbDump.corridors.slice(0, limit));
  }

  if (pathname === '/master/assets' || pathname === 'master/assets') {
    let assets = [...dbDump.assets];
    const deptId = params.department_id ? String(params.department_id).trim().toLowerCase() : null;
    const corrId = params.corridor_id ? String(params.corridor_id).trim().toLowerCase() : null;

    if (deptId && !['undefined', 'null', 'all', 'none', ''].includes(deptId)) {
      const dNum = Number(deptId);
      if (dNum > 0 && dNum !== 6) {
        assets = assets.filter(a => Number(a.department_id) === dNum);
      }
    }

    if (corrId && !['undefined', 'null', 'all', 'none', ''].includes(corrId)) {
      const cNum = Number(corrId);
      if (cNum > 0) {
        const corrMatched = assets.filter(a => Number(a.corridor_id) === cNum);
        if (corrMatched.length > 0) assets = corrMatched;
      }
    }

    const limit = Number(params.limit) || 400;
    return makeResponse(assets.slice(0, limit));
  }

  if (pathname === '/master/departments' || pathname === 'master/departments') {
    return makeResponse(dbDump.departments);
  }

  if (pathname === '/master/stations' || pathname === 'master/stations') {
    const limit = Number(params.limit) || 100;
    return makeResponse(dbDump.stations.slice(0, limit));
  }

  if (pathname === '/master/trains' || pathname === 'master/trains') {
    const limit = Number(params.limit) || 100;
    return makeResponse(dbDump.train_schedules.slice(0, limit));
  }

  if (pathname === '/master/notifications' || pathname === 'master/notifications') {
    return makeResponse(dbDump.notifications);
  }

  if (pathname === '/master/audit-logs' || pathname === 'master/audit-logs') {
    return makeResponse([]);
  }

  // --- 2. Maintenance Requests Endpoints ---
  if ((pathname === '/requests' || pathname === 'requests') && method === 'get') {
    let reqs = getStoredRequests();
    const deptId = params.department_id ? Number(params.department_id) : null;
    const status = params.status;
    const priority = params.priority;
    const corridorId = params.corridor_id ? Number(params.corridor_id) : null;

    if (deptId && deptId !== 6) {
      reqs = reqs.filter(r => Number(r.department_id) === deptId);
    }
    if (status && status !== 'ALL') {
      reqs = reqs.filter(r => r.status === status);
    }
    if (priority && priority !== 'ALL') {
      reqs = reqs.filter(r => r.priority === priority);
    }
    if (corridorId) {
      reqs = reqs.filter(r => Number(r.corridor_id) === corridorId);
    }

    const limit = Number(params.limit) || 200;
    return makeResponse(reqs.slice(0, limit));
  }

  if (pathname.match(/^\/requests\/\d+$/) && method === 'get') {
    const id = Number(pathname.split('/')[2]);
    const reqs = getStoredRequests();
    const found = reqs.find(r => r.id === id) || reqs[0];
    return makeResponse(found);
  }

  if ((pathname === '/requests' || pathname === 'requests') && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const reqs = getStoredRequests();
    const newId = reqs.length > 0 ? Math.max(...reqs.map(r => r.id)) + 1 : 1;
    const padNum = String(newId).padStart(5, '0');
    
    // Find corridor and asset names
    const corr = dbDump.corridors.find(c => c.id === body.corridor_id);
    const asset = dbDump.assets.find(a => a.id === body.asset_id);
    const dept = dbDump.departments.find(d => d.id === (asset?.department_id || 1));

    const newReq: MaintenanceRequest = {
      id: newId,
      problem_id: `PR-2026-${padNum}`,
      department_id: dept?.id || 1,
      department_code: dept?.code || 'ELEC',
      department_name: dept?.name || 'Electrical Department',
      corridor_id: body.corridor_id || 1,
      corridor_code: corr?.code || 'NDLS-GZB',
      corridor_name: corr?.name || 'New Delhi → Ghaziabad',
      from_station_id: corr?.from_station_id,
      to_station_id: corr?.to_station_id,
      from_station_name: (corr as any)?.from_station_name,
      to_station_name: (corr as any)?.to_station_name,
      asset_id: body.asset_id || 1,
      asset_code: asset?.asset_id || 'ASSET-001',
      asset_name: asset?.name || 'Infrastructure Asset',
      asset_criticality: body.asset_criticality || 'HIGH',
      work_description: body.work_description || 'Track defect reported by Lower HOD.',
      manpower_required: body.manpower_required || 4,
      manpower_available: body.manpower_available || 4,
      resources_required: body.resources_required || 'Standard Maintenance Toolkit',
      safety_risk: body.safety_risk || 'HIGH',
      isolation_required: Boolean(body.isolation_required),
      priority: body.priority || 'HIGH',
      requested_date: body.requested_date || new Date().toISOString().split('T')[0],
      requested_start_time: body.requested_start_time || '02:00',
      requested_end_time: body.requested_end_time || '04:00',
      max_duration_hours: body.max_duration_hours || 2.0,
      inspection_status: body.inspection_status || 'INSPECTED',
      inspection_remarks: body.inspection_remarks || 'Inspection verified by Lower HOD.',
      ai_priority: 'HIGH',
      ai_safety_risk: 'MEDIUM',
      ai_estimated_duration: body.max_duration_hours || 2.0,
      ai_train_impact: 'LOW',
      status: 'NEW',
      progress_percent: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    reqs.unshift(newReq);
    saveRequests(reqs);
    return makeResponse(newReq, 201);
  }

  if (pathname.includes('/approve') && pathname.includes('/requests/')) {
    const id = Number(pathname.split('/')[2]);
    const reqs = getStoredRequests();
    const target = reqs.find(r => r.id === id);
    if (target) {
      target.status = 'APPROVED';
      target.updated_at = new Date().toISOString();
      saveRequests(reqs);
    }
    return makeResponse({ message: 'Request approved successfully' });
  }

  if (pathname.includes('/start') && pathname.includes('/requests/')) {
    const id = Number(pathname.split('/')[2]);
    const reqs = getStoredRequests();
    const target = reqs.find(r => r.id === id);
    if (target) {
      target.status = 'IN_PROGRESS';
      target.actual_start_time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      target.updated_at = new Date().toISOString();
      saveRequests(reqs);
    }
    return makeResponse({ message: 'Work started' });
  }

  if (pathname.includes('/progress') && pathname.includes('/requests/')) {
    const id = Number(pathname.split('/')[2]);
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const reqs = getStoredRequests();
    const target = reqs.find(r => r.id === id);
    if (target) {
      target.progress_percent = body.progress_percent || 50;
      target.updated_at = new Date().toISOString();
      saveRequests(reqs);
    }
    return makeResponse({ message: 'Progress updated' });
  }

  if (pathname.includes('/delay') && pathname.includes('/requests/')) {
    const id = Number(pathname.split('/')[2]);
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const reqs = getStoredRequests();
    const target = reqs.find(r => r.id === id);
    if (target) {
      target.status = 'DELAYED';
      (target as any).delay_reason = body.delay_reason || 'Field delay reported';
      (target as any).delay_remarks = body.delay_remarks || '';
      target.updated_at = new Date().toISOString();
      saveRequests(reqs);
    }
    return makeResponse({ message: 'Delay reported successfully' });
  }

  if (pathname.includes('/reject') && pathname.includes('/requests/')) {
    const id = Number(pathname.split('/')[2]);
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const reqs = getStoredRequests();
    const target = reqs.find(r => r.id === id);
    if (target) {
      target.status = 'REJECTED';
      (target as any).reject_reason = body.reject_reason || 'Rejected by Higher HOD';
      target.updated_at = new Date().toISOString();
      saveRequests(reqs);
    }
    return makeResponse({ message: 'Request rejected' });
  }

  if (pathname.includes('/rework') && pathname.includes('/requests/')) {
    const id = Number(pathname.split('/')[2]);
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const reqs = getStoredRequests();
    const target = reqs.find(r => r.id === id);
    if (target) {
      target.status = 'REWORK';
      (target as any).rework_remarks = body.rework_remarks || 'Returned for rework';
      target.updated_at = new Date().toISOString();
      saveRequests(reqs);
    }
    return makeResponse({ message: 'Request sent for rework' });
  }

  if (pathname === '/requests/ai-preview' || pathname === 'requests/ai-preview') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const crit = body.asset_criticality || 'HIGH';
    return makeResponse({
      ai_priority: crit === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      ai_safety_risk: body.isolation_required ? 'HIGH' : 'MEDIUM',
      ai_estimated_duration: `${body.max_duration_hours || 2.0} Hours`,
      ai_train_impact: crit === 'CRITICAL' ? 'MEDIUM' : 'LOW',
      recommendation: 'Integrated Block Fusion optimization ready. Slot: 02:00–04:00 AM.'
    });
  }

  // --- 3. Maintenance Blocks Endpoints ---
  if ((pathname === '/blocks' || pathname === 'blocks') && method === 'get') {
    const blocks = getStoredBlocks();
    const limit = Number(params.limit) || 80;
    return makeResponse(blocks.slice(0, limit));
  }

  if (pathname.includes('/approve') && pathname.includes('/blocks/')) {
    const id = Number(pathname.split('/')[2]);
    const blocks = getStoredBlocks();
    const target = blocks.find(b => b.id === id);
    if (target) {
      target.status = 'APPROVED';
      saveBlocks(blocks);
    }
    return makeResponse({ message: 'Block approved' });
  }

  if (pathname.includes('/reject') && pathname.includes('/blocks/')) {
    const id = Number(pathname.split('/')[2]);
    const blocks = getStoredBlocks();
    const target = blocks.find(b => b.id === id);
    if (target) {
      target.status = 'CANCELLED';
      saveBlocks(blocks);
    }
    return makeResponse({ message: 'Block rejected' });
  }

  // --- 4. MCR Completion Endpoints ---
  if ((pathname === '/mcr' || pathname === 'mcr') && method === 'get') {
    const mcrs = getStoredMCRs();
    return makeResponse(mcrs);
  }

  if ((pathname === '/mcr' || pathname === 'mcr') && method === 'post') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const mcrs = getStoredMCRs();
    const reqs = getStoredRequests();
    const target = reqs.find(r => r.id === body.request_id);

    const newMCR: MCRReport = {
      id: mcrs.length + 1,
      mcr_id: `MCR-2026-${String(mcrs.length + 1).padStart(4, '0')}`,
      request_id: body.request_id,
      problem_id: target?.problem_id || `PR-2026-${body.request_id || 1}`,
      department_id: target?.department_id || 1,
      department_name: target?.department_name || 'Electrical Department',
      corridor_name: target?.corridor_name || 'NDLS-GZB Corridor',
      asset_name: target?.asset_name || 'Railway Fixed Asset',
      actual_work_performed: body.actual_work_performed || 'Maintenance work completed and track re-opened.',
      work_status: body.work_status || 'Completed',
      manpower_deployed: body.manpower_deployed || 6,
      resources_used: body.resources_used || 'Standard Machinery & Test Tools',
      actual_start_time: body.actual_start_time || '02:00 AM',
      actual_completion_time: body.actual_completion_time || '03:45 AM',
      actual_duration_hours: body.actual_duration_hours || 1.75,
      planned_commitment_hours: body.planned_commitment_hours || 2.0,
      commitment_met: body.actual_duration_hours <= body.planned_commitment_hours,
      delay_reason: body.delay_reason || '',
      safety_clearance: Boolean(body.safety_clearance),
      asset_restored: body.asset_restored || 'YES',
      supporting_docs: [],
      verification_status: 'AWAITING_VERIFICATION',
      created_at: new Date().toISOString()
    };
    mcrs.unshift(newMCR);
    saveMCRs(mcrs);

    // Update corresponding request
    if (target) {
      target.status = 'MCR_SUBMITTED';
      saveRequests(reqs);
    }

    return makeResponse(newMCR, 201);
  }

  if (pathname.includes('/verify') && pathname.includes('/mcr/')) {
    const id = Number(pathname.split('/')[2]);
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const mcrs = getStoredMCRs();
    const targetMcr = mcrs.find(m => m.id === id);
    if (targetMcr) {
      targetMcr.verification_status = 'VERIFIED';
      saveMCRs(mcrs);

      const reqs = getStoredRequests();
      const targetReq = reqs.find(r => r.id === targetMcr.request_id);
      if (targetReq) {
        targetReq.status = 'VERIFIED';
        targetReq.updated_at = new Date().toISOString();
        saveRequests(reqs);
      }
    }
    return makeResponse({ message: 'MCR verified successfully' });
  }

  // --- 5. AI Optimizer Endpoints ---
  if (pathname === '/ai/conflicts' || pathname === 'ai/conflicts') {
    return makeResponse(dbDump.conflicts || []);
  }

  if (pathname === '/ai/fusion-opportunities' || pathname === 'ai/fusion-opportunities') {
    return makeResponse([
      {
        id: 1,
        corridor_code: 'NDLS-GZB',
        corridor_name: 'New Delhi → Ghaziabad Junction',
        compatible_departments: ['Electrical (TRD)', 'Signalling (SMMS)', 'Civil (TMS)'],
        estimated_combined_window: '02:00 – 04:00 AM (2.0 Hrs)',
        jobs_bundled: 3,
        train_impact_reduction_percent: 66,
        safety_isolation: 'Single Traction Disconnection + S&T Route Release'
      },
      {
        id: 2,
        corridor_code: 'GZB-ALJN',
        corridor_name: 'Ghaziabad Junction → Aligarh Junction',
        compatible_departments: ['Civil (TMS)', 'Telecommunications'],
        estimated_combined_window: '01:30 – 03:30 AM (2.0 Hrs)',
        jobs_bundled: 2,
        train_impact_reduction_percent: 50,
        safety_isolation: 'Adjacent Track Speed Caution 30 km/h'
      }
    ]);
  }

  if (pathname === '/ai/generate-plan' || pathname === 'ai/generate-plan') {
    return makeResponse({
      status: 'SUCCESS',
      solver: 'Google OR-Tools CP-SAT Integer Optimizer',
      total_requests_analyzed: 205,
      blocks_synthesized: 14,
      conflicts_resolved: 4,
      train_punctuality_preserved_percent: 98.4
    });
  }

  // --- 6. Analytics & Live Operations ---
  if (pathname === '/analytics/dashboard' || pathname === 'analytics/dashboard') {
    const reqs = getStoredRequests();
    return makeResponse({
      total_requests: reqs.length,
      pending_approvals: reqs.filter(r => r.status === 'NEW').length,
      active_blocks: 4,
      completed_this_week: reqs.filter(r => ['VERIFIED', 'CLOSED', 'MCR_SUBMITTED'].includes(r.status)).length,
      conflicts_detected: 4,
      conflicts_resolved: 4,
      punctuality_impact_pct: 98.6,
      average_block_duration_hours: 2.1
    });
  }

  if (pathname === '/analytics/charts' || pathname === 'analytics/charts') {
    return makeResponse({
      department_breakdown: [
        { name: 'Electrical', count: 81 },
        { name: 'Signalling', count: 72 },
        { name: 'Civil', count: 95 },
        { name: 'Telecom', count: 52 },
        { name: 'Mechanical', count: 40 }
      ],
      weekly_trends: [
        { day: 'Mon', scheduled: 12, completed: 11 },
        { day: 'Tue', scheduled: 15, completed: 14 },
        { day: 'Wed', scheduled: 18, completed: 18 },
        { day: 'Thu', scheduled: 14, completed: 13 },
        { day: 'Fri', scheduled: 16, completed: 15 },
        { day: 'Sat', scheduled: 22, completed: 21 },
        { day: 'Sun', scheduled: 20, completed: 20 }
      ]
    });
  }

  if (pathname === '/live/events' || pathname === 'live/events') {
    return makeResponse([
      {
        id: 1,
        event_type: 'SIGNAL_FAILURE',
        corridor_code: 'NDLS-GZB',
        title: 'Point Machine S-102 Jammed',
        description: 'Point machine 102 failed normal detection. S&T gang dispatched under emergency caution.',
        timestamp: new Date().toISOString()
      }
    ]);
  }

  if (pathname === '/live/simulate' || pathname === 'live/simulate') {
    return makeResponse({ message: 'Incident simulated successfully' }, 201);
  }

  if (pathname.includes('/live/reoptimize-schedule')) {
    return makeResponse({
      message: 'Schedule successfully re-optimized and train timetable dynamically adjusted.',
      status: 'REOPTIMIZED',
      conflicts_avoided: 2
    });
  }

  if (pathname.includes('/read') && pathname.includes('/master/notifications/')) {
    return makeResponse({ message: 'Notification marked as read' });
  }

  // --- 7. Auth Endpoints ---
  if (pathname === '/auth/login' || pathname === 'auth/login') {
    const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});
    const empId = (body.emp_id || 'hod001').toLowerCase();
    const user = dbDump.users.find(u => u.emp_id.toLowerCase() === empId) || dbDump.users[0];
    return makeResponse({
      access_token: user.emp_id,
      token_type: 'bearer',
      user
    });
  }

  if (pathname === '/auth/me' || pathname === 'auth/me') {
    const token = localStorage.getItem('railway_token') || 'hod001';
    const user = dbDump.users.find(u => u.emp_id.toLowerCase() === token.toLowerCase()) || dbDump.users[0];
    return makeResponse(user);
  }

  return null;
};
