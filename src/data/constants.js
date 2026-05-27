// ─── PALETA DE COLORES ─────────────────────────────────────────────────────
export const C = {
  bg:         '#090d17',
  surface:    '#0f1624',
  surface2:   '#141c2e',
  border:     '#1a2540',
  border2:    '#1f2f50',
  accent:     '#1d4ed8',
  accent2:    '#3b82f6',
  accentGlow: 'rgba(59,130,246,0.18)',
  aws:        '#ff9900',
  awsGlow:    'rgba(255,153,0,0.15)',
  green:      '#10b981',
  red:        '#ef4444',
  yellow:     '#f59e0b',
  purple:     '#7c3aed',
  text:       '#e2e8f0',
  text2:      '#94a3b8',
  text3:      '#475569',
};

// ─── NAVEGACIÓN SIDEBAR ────────────────────────────────────────────────────
export const NAV_SECTIONS = [
  {
    section: 'PRINCIPAL',
    items: [
      { icon: '◈', label: 'Dashboard',          badge: null,  badgeColor: null       },
      { icon: '📊', label: 'Gestión Comercial',  badge: '3',   badgeColor: C.accent   },
      { icon: '🗂', label: 'Clientes & CRM',     badge: null,  badgeColor: null       },
      { icon: '📋', label: 'Contratos',          badge: null,  badgeColor: null       },
    ],
  },
  {
    section: 'AWS BACKUP',
    items: [
      { icon: '🪣', label: 'S3 Multimedia',      badge: 'OK',  badgeColor: C.green    },
      { icon: '🔄', label: 'Jobs de Backup',      badge: '2',   badgeColor: C.red      },
      { icon: '📁', label: 'Archivos & Media',   badge: null,  badgeColor: null       },
      { icon: '🗄', label: 'RDS / Bases de Datos',badge: null, badgeColor: null       },
    ],
  },
  {
    section: 'INFRAESTRUCTURA',
    items: [
      { icon: '🖥', label: 'EC2 Instances',      badge: null,  badgeColor: null       },
      { icon: '🌐', label: 'CloudFront / CDN',   badge: null,  badgeColor: null       },
      { icon: '🔐', label: 'IAM & Seguridad',    badge: null,  badgeColor: null       },
      { icon: '💰', label: 'Costos & Billing',   badge: null,  badgeColor: null       },
    ],
  },
  {
    section: 'REPORTES',
    items: [
      { icon: '📈', label: 'Analytics',          badge: null,  badgeColor: null       },
      { icon: '📤', label: 'Exportar Datos',     badge: null,  badgeColor: null       },
    ],
  },
];

// ─── MÉTRICAS ──────────────────────────────────────────────────────────────
export const METRICS = [
  { label: 'Clientes Activos',  value: '1,284',  delta: '↑ 4.2% este mes',    up: true,  icon: '👥', color: C.accent2 },
  { label: 'Storage S3 Total',  value: '8.4 TB', delta: '↑ 12% vs sem. ant.', up: true,  icon: '🪣', color: C.green   },
  { label: 'Backups OK',        value: '97.8%',  delta: '↓ 2 fallidos hoy',   up: false, icon: '✅', color: C.aws     },
  { label: 'Costo AWS / Mes',   value: '$2,140', delta: 'Presup: $2,500',      up: null,  icon: '💰', color: C.purple  },
];

// ─── SERVICIOS AWS ─────────────────────────────────────────────────────────
export const AWS_SERVICES = [
  { name: 'Amazon S3',    icon: '🪣', desc: '3 buckets activos · 8.4 TB',    status: 'ok'   },
  { name: 'EC2',          icon: '🖥', desc: '4 instancias t3.medium',        status: 'ok'   },
  { name: 'RDS MySQL',    icon: '🗄', desc: 'Multi-AZ habilitado · 100 GB',  status: 'ok'   },
  { name: 'CloudFront',   icon: '🌐', desc: '12 distribuciones CDN activas', status: 'ok'   },
  { name: 'AWS Backup',   icon: '🔄', desc: 'Planes auto · retención 30 d.', status: 'warn' },
  { name: 'IAM / Cognito',icon: '🔐', desc: 'SSO activo · MFA habilitado',   status: 'ok'   },
];

// ─── BACKUP JOBS ───────────────────────────────────────────────────────────
export const BACKUP_JOBS = [
  { name: 'S3 — Media Bucket',  size: '8.3 GB',  pct: 100, color: C.green,   label: 'Completado', animate: false },
  { name: 'RDS — DB Comercial', size: '2.1 GB',  pct: 68,  color: C.accent2, label: 'En progreso',animate: true  },
  { name: 'EBS — Volumen EC2',  size: '512 GB',  pct: 22,  color: C.aws,     label: 'En cola',    animate: true, slow: true },
  { name: 'S3 — Documentos',    size: '1.5 GB',  pct: 100, color: C.green,   label: 'Completado', animate: false },
  { name: 'Glacier — Histórico',size: '24 GB',   pct: 45,  color: C.red,     label: '⚠ Fallido', animate: false },
];

// ─── ALERTAS ───────────────────────────────────────────────────────────────
export const ALERTS = [
  {
    icon: '🔴', title: 'Backup Glacier falló',
    msg: 'Timeout al conectar. Revisar permisos IAM en política de Glacier.',
    time: 'hace 18 min', border: 'rgba(239,68,68,0.35)',
  },
  {
    icon: '🟡', title: 'S3 Bucket near limit',
    msg: 'El bucket multimedia está al 87% de capacidad asignada.',
    time: 'hace 1 h', border: 'rgba(245,158,11,0.35)',
  },
  {
    icon: '🟢', title: 'RDS Snapshot completado',
    msg: 'Backup automático DB Comercial ejecutado correctamente.',
    time: 'hace 3 h', border: 'rgba(16,185,129,0.25)',
  },
  {
    icon: '🔵', title: 'Nuevo usuario IAM creado',
    msg: 'dev.martinez añadido al grupo BackupOperators.',
    time: 'ayer 16:40', border: '#1f2f50',
  },
];

// ─── ACTIVIDAD DE EMPLEADOS ────────────────────────────────────────────────
export const ACTIVITY = [
  { initials:'JR', grad:['#7c3aed','#2563eb'], name:'Juan Rivera',   action:'Inició backup manual',    resource:'S3 · media-bucket-prod',   status:'Completado', sColor: C.green,   time:'Hoy 09:14' },
  { initials:'AM', grad:['#059669','#10b981'], name:'Ana Martínez',  action:'Subió archivos multimedia',resource:'S3 · uploads-2025',        status:'Completado', sColor: C.green,   time:'Hoy 08:55' },
  { initials:'CL', grad:['#dc2626','#f87171'], name:'Carlos López',  action:'Intentó acceder a RDS',   resource:'RDS · db-comercial',        status:'Denegado',   sColor: C.red,     time:'Hoy 08:33' },
  { initials:'PS', grad:['#d97706','#f59e0b'], name:'Paula Soto',    action:'Exportó reporte comercial',resource:'CloudWatch · analytics',   status:'En proceso', sColor: C.accent2, time:'Hoy 08:10' },
  { initials:'MR', grad:['#0891b2','#06b6d4'], name:'Miguel Ramos',  action:'Configuró política IAM',  resource:'IAM · BackupPolicy-v3',     status:'Completado', sColor: C.green,   time:'Ayer 17:50' },
];

// ─── GRÁFICO DE BARRAS ─────────────────────────────────────────────────────
export const CHART_DAYS      = ['L','M','X','J','V','S','D','L','M','X','J','V','S','D'];
export const CHART_CONTRATOS = [45,60,38,72,55,30,20,65,80,50,90,75,40,68];
export const CHART_RENOV     = [20,35,25,40,30,15,10,45,55,30,60,50,25,42];

// ─── STORAGE BREAKDOWN ─────────────────────────────────────────────────────
export const STORAGE_ITEMS = [
  { label:'Media & Video', value:'4.8 TB', color: C.accent2, pct: 0.57 },
  { label:'Backups BD',    value:'2.1 TB', color: C.green,   pct: 0.25 },
  { label:'Documentos',    value:'1.5 TB', color: C.aws,     pct: 0.18 },
  { label:'Libre',         value:'2.8 TB', color: C.border2, pct: null },
];

// ─── QUICK ACTIONS ─────────────────────────────────────────────────────────
export const QUICK_ACTIONS = [
  { icon:'📤', label:'Iniciar Backup', sub:'S3 · CloudWatch', bg:'rgba(37,99,235,0.16)'  },
  { icon:'🗂', label:'Nuevo Contrato', sub:'CRM Comercial',   bg:'rgba(16,185,129,0.12)' },
  { icon:'☁',  label:'Subir Media',   sub:'S3 · CloudFront', bg:'rgba(255,153,0,0.14)'  },
  { icon:'📊', label:'Ver Reporte',   sub:'Analytics AWS',   bg:'rgba(124,58,237,0.14)' },
];
