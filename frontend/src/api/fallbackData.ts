import { Corridor, Asset, Department, MaintenanceRequest } from '../types';

export const FALLBACK_CORRIDORS: Corridor[] = [
  {
    id: 1,
    code: 'NDLS-GZB',
    name: 'New Delhi → Ghaziabad Junction',
    from_station_id: 1,
    to_station_id: 2,
    from_station_name: 'New Delhi (NDLS)',
    to_station_name: 'Ghaziabad Junction (GZB)',
    distance_km: 25.6,
    track_type: 'Double Line',
    max_speed: 130,
    status: 'NORMAL'
  },
  {
    id: 2,
    code: 'GZB-ALJN',
    name: 'Ghaziabad Junction → Aligarh Junction',
    from_station_id: 2,
    to_station_id: 3,
    from_station_name: 'Ghaziabad Junction (GZB)',
    to_station_name: 'Aligarh Junction (ALJN)',
    distance_km: 106.0,
    track_type: 'Quadruple Line',
    max_speed: 130,
    status: 'NORMAL'
  },
  {
    id: 3,
    code: 'ALJN-TDL',
    name: 'Aligarh Junction → Tundla Junction',
    from_station_id: 3,
    to_station_id: 4,
    from_station_name: 'Aligarh Junction (ALJN)',
    to_station_name: 'Tundla Junction (TDL)',
    distance_km: 78.4,
    track_type: 'Double Line',
    max_speed: 130,
    status: 'NORMAL'
  },
  {
    id: 4,
    code: 'TDL-CNB',
    name: 'Tundla Junction → Kanpur Central',
    from_station_id: 4,
    to_station_id: 5,
    from_station_name: 'Tundla Junction (TDL)',
    to_station_name: 'Kanpur Central (CNB)',
    distance_km: 228.0,
    track_type: 'Double Line',
    max_speed: 130,
    status: 'NORMAL'
  },
  {
    id: 5,
    code: 'BCT-BVI',
    name: 'Mumbai Central → Borivali Suburban',
    from_station_id: 6,
    to_station_id: 7,
    from_station_name: 'Mumbai Central (MMCT)',
    to_station_name: 'Borivali (BVI)',
    distance_km: 34.2,
    track_type: 'Quadruple Line',
    max_speed: 110,
    status: 'NORMAL'
  },
  {
    id: 6,
    code: 'BVI-VR',
    name: 'Borivali → Virar Corridor',
    from_station_id: 7,
    to_station_id: 8,
    from_station_name: 'Borivali (BVI)',
    to_station_name: 'Virar (VR)',
    distance_km: 26.0,
    track_type: 'Quadruple Line',
    max_speed: 110,
    status: 'NORMAL'
  }
];

export const FALLBACK_DEPARTMENTS: Department[] = [
  { id: 1, code: 'ELEC', name: 'Electrical Department (TRD / OHE)', hod_name: 'Rahul Patel', head_count: 55, icon: 'Zap' },
  { id: 2, code: 'SIG', name: 'Signalling Department (SMMS)', hod_name: 'Amit Shah', head_count: 48, icon: 'Radio' },
  { id: 3, code: 'CIVIL', name: 'Civil Engineering (TMS Track)', hod_name: 'Rajesh Sharma', head_count: 72, icon: 'Hammer' },
  { id: 4, code: 'TEL', name: 'Telecommunications', hod_name: 'Vikram Verma', head_count: 36, icon: 'Wifi' },
  { id: 5, code: 'MECH', name: 'Mechanical Department (Rolling Stock)', hod_name: 'Sanjay Gupta', head_count: 60, icon: 'Wrench' }
];

export const FALLBACK_ASSETS_BY_DEPT: Record<string, Asset[]> = {
  ELEC: [
    { id: 101, asset_id: 'ELEC-OHE-014', name: '25kV Traction Catenary Wire Span 24/18', department_id: 1, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'OHE Catenary Wire', criticality: 'CRITICAL', status: 'HEALTHY', install_year: 2021, last_inspected: '2026-09-01' },
    { id: 102, asset_id: 'ELEC-INS-022', name: 'Composite Insulator Mast #48', department_id: 1, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'OHE Insulator', criticality: 'HIGH', status: 'DEGRADED', install_year: 2020, last_inspected: '2026-08-28' },
    { id: 103, asset_id: 'ELEC-PAN-031', name: 'Pantograph Clearance Sensor #031', department_id: 1, corridor_id: 2, corridor_code: 'GZB-ALJN', asset_type: 'Pantograph Sensor', criticality: 'HIGH', status: 'HEALTHY', install_year: 2022, last_inspected: '2026-09-02' },
    { id: 104, asset_id: 'ELEC-TSS-005', name: 'Traction Sub-Station (TSS) 132/25kV Transformer #2', department_id: 1, corridor_id: 3, corridor_code: 'ALJN-TDL', asset_type: 'Traction Transformer', criticality: 'CRITICAL', status: 'HEALTHY', install_year: 2019, last_inspected: '2026-08-15' },
    { id: 105, asset_id: 'ELEC-NEUT-012', name: 'Short Neutral Section Mast 104/12', department_id: 1, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'Neutral Section Assembly', criticality: 'HIGH', status: 'HEALTHY', install_year: 2023, last_inspected: '2026-08-30' },
    { id: 106, asset_id: 'ELEC-ISOL-018', name: 'Motorized Isolator Switch IS-04', department_id: 1, corridor_id: 2, corridor_code: 'GZB-ALJN', asset_type: 'Trackside Isolator', criticality: 'MEDIUM', status: 'HEALTHY', install_year: 2021, last_inspected: '2026-08-20' },
  ],
  SIG: [
    { id: 201, asset_id: 'SIG-POINT-102', name: 'Electric Point Machine Point 102A/B', department_id: 2, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'Point Machine', criticality: 'CRITICAL', status: 'DEGRADED', install_year: 2020, last_inspected: '2026-09-02' },
    { id: 202, asset_id: 'SIG-TC-204', name: 'Digital Axle Counter (DAC) Track Circuit 204', department_id: 2, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'Axle Counter Circuit', criticality: 'CRITICAL', status: 'HEALTHY', install_year: 2022, last_inspected: '2026-09-05' },
    { id: 203, asset_id: 'SIG-COLOR-012', name: '4-Aspect LED Automatic Signal S-12', department_id: 2, corridor_id: 2, corridor_code: 'GZB-ALJN', asset_type: 'LED Signal Unit', criticality: 'HIGH', status: 'HEALTHY', install_year: 2021, last_inspected: '2026-08-25' },
    { id: 204, asset_id: 'SIG-LC-044', name: 'Interlocked Level Crossing Gate LC-44', department_id: 2, corridor_id: 3, corridor_code: 'ALJN-TDL', asset_type: 'Level Crossing Barrier', criticality: 'HIGH', status: 'HEALTHY', install_year: 2018, last_inspected: '2026-08-10' },
    { id: 205, asset_id: 'SIG-EI-001', name: 'Electronic Interlocking (EI) VDU System', department_id: 2, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'Interlocking Hardware', criticality: 'CRITICAL', status: 'HEALTHY', install_year: 2023, last_inspected: '2026-09-01' },
  ],
  CIVIL: [
    { id: 301, asset_id: 'CIV-RAIL-056', name: '60kg UIC Continuous Welded Rail Km 28/4', department_id: 3, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'CWR Track Section', criticality: 'CRITICAL', status: 'DEGRADED', install_year: 2019, last_inspected: '2026-08-29' },
    { id: 302, asset_id: 'CIV-TURNOUT-014', name: '1 in 12 Curved Switch Turnout Point 21', department_id: 3, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'Track Turnout', criticality: 'HIGH', status: 'HEALTHY', install_year: 2021, last_inspected: '2026-09-03' },
    { id: 303, asset_id: 'CIV-SEJ-008', name: 'Switch Expansion Joint (SEJ) Km 52/12', department_id: 3, corridor_id: 2, corridor_code: 'GZB-ALJN', asset_type: 'Expansion Joint', criticality: 'HIGH', status: 'HEALTHY', install_year: 2020, last_inspected: '2026-08-22' },
    { id: 304, asset_id: 'CIV-BALLAST-03', name: 'Deep Screening Ballast Bed Km 112/10', department_id: 3, corridor_id: 3, corridor_code: 'ALJN-TDL', asset_type: 'Ballast Cushion', criticality: 'MEDIUM', status: 'HEALTHY', install_year: 2017, last_inspected: '2026-08-01' },
  ],
  TEL: [
    { id: 401, asset_id: 'TEL-OFC-001', name: 'Armored 24-Core Optical Fiber Cable Km 15-35', department_id: 4, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'Fiber Optic Backbone', criticality: 'CRITICAL', status: 'HEALTHY', install_year: 2022, last_inspected: '2026-09-04' },
    { id: 402, asset_id: 'TEL-VHF-010', name: 'VHF 25W Driver-Guard Communication Base', department_id: 4, corridor_id: 2, corridor_code: 'GZB-ALJN', asset_type: 'VHF Transceiver', criticality: 'HIGH', status: 'HEALTHY', install_year: 2021, last_inspected: '2026-08-27' },
    { id: 403, asset_id: 'TEL-PIS-004', name: 'Passenger Information Display System Controller', department_id: 4, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'Passenger Info System', criticality: 'MEDIUM', status: 'HEALTHY', install_year: 2023, last_inspected: '2026-09-01' },
  ],
  MECH: [
    { id: 501, asset_id: 'MECH-HABD-002', name: 'Hot Axle Box Detector (HABD) Sensor #2', department_id: 5, corridor_id: 1, corridor_code: 'NDLS-GZB', asset_type: 'Trackside Defect Detector', criticality: 'CRITICAL', status: 'HEALTHY', install_year: 2021, last_inspected: '2026-08-31' },
    { id: 502, asset_id: 'MECH-WILD-005', name: 'Wheel Impact Load Detector (WILD) Km 74', department_id: 5, corridor_id: 2, corridor_code: 'GZB-ALJN', asset_type: 'Wheel Impact Detector', criticality: 'HIGH', status: 'HEALTHY', install_year: 2020, last_inspected: '2026-08-18' },
  ]
};

// Flattened list for fallback when no department filter applies
export const ALL_FALLBACK_ASSETS: Asset[] = Object.values(FALLBACK_ASSETS_BY_DEPT).flat();

export const FALLBACK_REQUESTS: MaintenanceRequest[] = [
  {
    id: 1,
    problem_id: 'PR-2026-00101',
    department_id: 1,
    department_code: 'ELEC',
    department_name: 'Electrical Department (TRD / OHE)',
    corridor_id: 1,
    corridor_code: 'NDLS-GZB',
    corridor_name: 'New Delhi → Ghaziabad Junction',
    asset_id: 101,
    asset_code: 'ELEC-OHE-014',
    asset_name: '25kV Traction Catenary Wire Span 24/18',
    asset_criticality: 'CRITICAL',
    work_description: 'OHE Insulator flashover and contact wire tension adjustment on mast 24/18.',
    manpower_required: 6,
    manpower_available: 6,
    resources_required: 'Tower Wagon TW-04, HV Earth Rods, Tension Gauge',
    safety_risk: 'HIGH',
    isolation_required: true,
    priority: 'HIGH',
    requested_date: '2026-09-14',
    requested_start_time: '02:00',
    requested_end_time: '04:00',
    max_duration_hours: 2.0,
    inspection_status: 'INSPECTED',
    inspection_remarks: 'Field inspection confirmed tracking marks on insulator skirt.',
    ai_priority: 'HIGH',
    ai_safety_risk: 'MEDIUM',
    ai_estimated_duration: 2.0,
    ai_train_impact: 'LOW',
    status: 'IN_PROGRESS',
    actual_start_time: '02:00 AM',
    progress_percent: 65,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    problem_id: 'PR-2026-00102',
    department_id: 2,
    department_code: 'SIG',
    department_name: 'Signalling Department (SMMS)',
    corridor_id: 1,
    corridor_code: 'NDLS-GZB',
    corridor_name: 'New Delhi → Ghaziabad Junction',
    asset_id: 201,
    asset_code: 'SIG-POINT-102',
    asset_name: 'Electric Point Machine Point 102A/B',
    asset_criticality: 'CRITICAL',
    work_description: 'Point machine 102 micro-switch clearance out of tolerance, lubricant replacement.',
    manpower_required: 4,
    manpower_available: 4,
    resources_required: 'Signal Toolkit, Point Gauge, Multimeter',
    safety_risk: 'HIGH',
    isolation_required: true,
    priority: 'HIGH',
    requested_date: '2026-09-14',
    requested_start_time: '02:30',
    requested_end_time: '04:00',
    max_duration_hours: 1.5,
    inspection_status: 'INSPECTED',
    inspection_remarks: 'Obstruction test failed by 2mm. Requires re-setting.',
    ai_priority: 'HIGH',
    ai_safety_risk: 'LOW',
    ai_estimated_duration: 1.5,
    ai_train_impact: 'LOW',
    status: 'APPROVED',
    progress_percent: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    problem_id: 'PR-2026-00103',
    department_id: 3,
    department_code: 'CIVIL',
    department_name: 'Civil Engineering (TMS Track)',
    corridor_id: 2,
    corridor_code: 'GZB-ALJN',
    corridor_name: 'Ghaziabad Junction → Aligarh Junction',
    asset_id: 301,
    asset_code: 'CIV-RAIL-056',
    asset_name: '60kg UIC Continuous Welded Rail Km 28/4',
    asset_criticality: 'HIGH',
    work_description: 'Thermit weld joggled fishplate clamp installation and USFD re-testing.',
    manpower_required: 8,
    manpower_available: 8,
    resources_required: 'Hydraulic Rail Tensor, USFD Tester, Fishplate Set',
    safety_risk: 'HIGH',
    isolation_required: false,
    priority: 'HIGH',
    requested_date: '2026-09-15',
    requested_start_time: '01:30',
    requested_end_time: '04:00',
    max_duration_hours: 2.5,
    inspection_status: 'INSPECTED',
    inspection_remarks: 'Ultrasonic testing marked 12mm internal defect at weld seam.',
    ai_priority: 'HIGH',
    ai_safety_risk: 'MEDIUM',
    ai_estimated_duration: 2.5,
    ai_train_impact: 'LOW',
    status: 'NEW',
    progress_percent: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const getFallbackAssetsForUser = (departmentCode?: string | null, departmentId?: number | null): Asset[] => {
  if (departmentCode && FALLBACK_ASSETS_BY_DEPT[departmentCode.toUpperCase()]) {
    return FALLBACK_ASSETS_BY_DEPT[departmentCode.toUpperCase()];
  }
  // Map department_id to code if code is missing
  const deptCodeMap: Record<number, string> = { 1: 'ELEC', 2: 'SIG', 3: 'CIVIL', 4: 'TEL', 5: 'MECH' };
  if (departmentId && deptCodeMap[departmentId]) {
    return FALLBACK_ASSETS_BY_DEPT[deptCodeMap[departmentId]] || ALL_FALLBACK_ASSETS;
  }
  return ALL_FALLBACK_ASSETS;
};
