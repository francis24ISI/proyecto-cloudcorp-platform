import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════
/* ══════════════════════════════════════════════════
   PALETAS DE COLOR MODERNAS Y REFINADAS
══════════════════════════════════════════════════ */

// Paleta ADMIN (Gris Grafito / Slate moderno — Estilo Vercel/Tailwind, NO azul hacker)
const C = {
  bg: "#0f172a",   // Fondo slate oscuro profesional
  sur: "#1e293b",  // Tarjetas gris neutro
  s2: "#334155",   // Superficies secundarias
  s3: "#475569",
  bor: "#334155",  // Bordes finos
  bor2: "#475569",
  blue: "#3b82f6", b2: "#60a5fa", bG: "rgba(59,130,246,0.15)",
  aws: "#f59e0b",  awG: "rgba(245,158,11,0.12)",
  grn: "#10b981",  red: "#ef4444", yel: "#f59e0b",
  pur: "#8b5cf6",  cyn: "#06b6d4", pnk: "#ec4899",
  txt: "#f8fafc",  t2: "#94a3b8",  t3: "#64748b",
};

// Paleta DOCENTE / ALUMNO (Modo Claro Limpio — Estilo Intranet moderna)
const LC = {
  bg: "#f8fafc",   // Fondo gris perla ultra limpio
  sur: "#ffffff",  // Tarjetas blanco puro
  s2: "#f1f5f9",   // Botones y cajas secundarias suaves
  s3: "#e2e8f0",
  bor: "#e2e8f0",  // Bordes discretos
  bor2: "#cbd5e1",
  navy: "#2563eb",  // Azul cobalto brillante (reemplaza al azul oscuro pesado #0f2557)
  navy2: "#1d4ed8",
  nvG: "rgba(37,99,235,0.08)",
  grn: "#16a34a",  red: "#dc2626", yel: "#d97706",
  cyn: "#0891b2",  pnk: "#db2777", pur: "#7c3aed",
  txt: "#0f172a",  t2: "#475569",  t3: "#94a3b8",
};

// Devuelve la paleta según el rol
const theme = (role) => role === "admin" ? C : LC;
/* ══════════════════════════════════════════════════
   ROLES
══════════════════════════════════════════════════ */
const ROLE = {
  admin:   { label:"Administrador de Red", color:C.aws,  icon:"🛡",  nav:["Dashboard","Usuarios","Monitor Archivos","Servicios AWS","Configuración"] },
  docente: { label:"Docente", color:C.b2, icon:"📚", nav:["Dashboard","Mis Alumnos","Grupos","Revisar Entregas","Tareas","Subir Archivos","Mis Archivos"] },
  alumno: { label:"Alumno", color:C.grn, icon:"🎓", nav:["Dashboard","Mis Cursos","Tareas","Subir Archivos","Mis Archivos"] },
};

/* ══════════════════════════════════════════════════
   USUARIOS INICIALES  (alumnos solo creados por admin)
══════════════════════════════════════════════════ */
const INIT_USERS = [
  { id:1, name:"Carlos Mendoza",  email:"admin@institutocloudcorp.edu.pe",      pass:"Admin2024!",   role:"admin",   avatar:"CM", equipo:"PC-Admin-01",  ip:"192.168.1.10", status:"active" },
  { id:2, name:"Prof. Ana Quispe",email:"ana.quispe@institutocloudcorp.edu.pe", pass:"Doc2024!",     role:"docente", avatar:"AQ", equipo:"PC-Docente-01",ip:"192.168.1.21", status:"active" },
  { id:3, name:"Prof. Luis Flores",email:"luis.flores@institutocloudcorp.edu.pe",pass:"Doc2024!",   role:"docente", avatar:"LF", equipo:"PC-Docente-02",ip:"192.168.1.22", status:"active" },
  { id:4, name:"María Torres", email:"maria.torres@institutocloudcorp.edu.pe", pass:"Alu2024!", role:"alumno", avatar:"MT", equipo:"PC-Alumno-01", ip:"192.168.2.10", status:"active", cursos:[1,2,3] },
  { id:5, name:"Pedro Ríos",   email:"pedro.rios@institutocloudcorp.edu.pe",  pass:"Alu2024!", role:"alumno", avatar:"PR", equipo:"PC-Alumno-02", ip:"192.168.2.11", status:"active", cursos:[1,2] },
  { id:6, name:"Sofía Mamani", email:"sofia.mamani@institutocloudcorp.edu.pe",pass:"Alu2024!", role:"alumno", avatar:"SM", equipo:"PC-Alumno-03", ip:"192.168.2.12", status:"active", cursos:[2] },
];
const COURSES = [
   { id:1, nombre:"Español",     docenteId:2 },
  { id:2, nombre:"Aritmética",  docenteId:3 },
  { id:3, nombre:"Ciencia",     docenteId:2 },
  { id:4, nombre:"Portugués",   docenteId:3 },
];
// --- AGREGAR JUSTO DESPUÉS DE "const COURSES = [...]" (ANTES del bloque de GROUPS) ---
function misCursosDe(docenteId){
  return COURSES.filter(c=>c.docenteId===docenteId);
}
function alumnosDeDocente(docenteId){
  const idsCursos = misCursosDe(docenteId).map(c=>c.id);
  return INIT_USERS.filter(u=>u.role==="alumno" && u.cursos?.some(cid=>idsCursos.includes(cid)));
}

let PASSWORD_REQUESTS = [];
let PW_REQ_NEXT = 1;

function addPasswordRequest(email){
  const now = new Date();
  const pad = n=>String(n).padStart(2,"0");
  const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  PASSWORD_REQUESTS = [{ id:PW_REQ_NEXT++, email, ts, resuelto:false }, ...PASSWORD_REQUESTS];
  persistPwRequests();
}
function resolvePasswordRequest(id){
  PASSWORD_REQUESTS = PASSWORD_REQUESTS.map(r=>r.id===id?{...r,resuelto:true}:r);
  persistPwRequests();
}
function persistPwRequests(){
  try{ localStorage.setItem("pw_requests", JSON.stringify(PASSWORD_REQUESTS)); }catch(e){}
}
function loadPwRequests(){
  try{
    const raw = localStorage.getItem("pw_requests");
    if(raw){ PASSWORD_REQUESTS = JSON.parse(raw); PW_REQ_NEXT = Math.max(...PASSWORD_REQUESTS.map(r=>r.id),0)+1; }
  }catch(e){}
}
 // --- AGREGAR DESPUÉS DE LAS FUNCIONES misCursosDe/alumnosDeDocente/companerosDe ---
let GROUPS = [];
let GROUP_NEXT = 1;

function persistGroups(){ try{ localStorage.setItem("groups_log", JSON.stringify(GROUPS)); }catch(e){} }
function loadGroups(){
  try{
    const raw = localStorage.getItem("groups_log");
    if(raw){ GROUPS = JSON.parse(raw); GROUP_NEXT = Math.max(...GROUPS.map(g=>g.id),0)+1; }
  }catch(e){}
}

function generarGruposAleatorios(cursoId, cantidad){
  const alumnos = INIT_USERS.filter(u=>u.role==="alumno" && u.cursos?.includes(cursoId));
  const shuffled = [...alumnos].sort(()=>Math.random()-0.5);
  const grupos = Array.from({length:cantidad},()=>[]);
  shuffled.forEach((a,i)=> grupos[i%cantidad].push(a.id));
  GROUPS = GROUPS.filter(g=>g.cursoId!==cursoId); // reemplaza grupos previos de este curso
  grupos.forEach((miembros,idx)=>{
    GROUPS.push({ id:GROUP_NEXT++, cursoId, nombre:`Grupo ${idx+1}`, miembros });
  });
  persistGroups();
}

function miGrupoDe(alumnoId, cursoId){
  return GROUPS.find(g=>g.cursoId===cursoId && g.miembros.includes(alumnoId));
}

// Archivos compartidos DENTRO de un grupo (separado del UPLOAD_LOG personal)
let GROUP_FILES = [];
let GROUP_FILE_NEXT = 1;

function persistGroupFiles(){ try{ localStorage.setItem("group_files_log", JSON.stringify(GROUP_FILES)); }catch(e){} }
function loadGroupFiles(){
  try{
    const raw = localStorage.getItem("group_files_log");
    if(raw){ GROUP_FILES = JSON.parse(raw); GROUP_FILE_NEXT = Math.max(...GROUP_FILES.map(f=>f.id),0)+1; }
  }catch(e){}
}
function addGroupFile(groupId, user, file){
  const now = new Date();
  const pad = n=>String(n).padStart(2,"0");
  const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const url = URL.createObjectURL(file);
  GROUP_FILES = [{ id:GROUP_FILE_NEXT++, groupId, uid:user.id, name:user.name, archivo:file.name, mime:file.type, url, ts }, ...GROUP_FILES];
  persistGroupFiles();
}

/* Tipos de archivo */
const FILE_TYPES = [
  { id:"foto",     label:"Foto",      icon:"📷", color:C.pnk,  ext:".jpg",  bucket:"media-fotos"    },
  { id:"video",    label:"Video",     icon:"🎬", color:C.pur,  ext:".mp4",  bucket:"media-videos"   },
  { id:"audio",    label:"Audio",     icon:"🎵", color:C.cyn,  ext:".mp3",  bucket:"media-audio"    },
  { id:"documento",label:"Documento", icon:"📄", color:C.b2,   ext:".pdf",  bucket:"docs-bucket"    },
  { id:"agenda",   label:"Agenda",    icon:"📅", color:C.yel,  ext:".ical", bucket:"agendas-bucket" },
  { id:"zip",      label:"Archivo",   icon:"📦", color:C.aws,  ext:".zip",  bucket:"media-bucket-prod"},
];

/* Log global de subidas */
let UPLOAD_LOG = [
  { id:1, uid:4, name:"María Torres",    equipo:"PC-Alumno-01", ip:"192.168.2.10", role:"alumno",  tipo:"foto",     archivo:"Lab_Quimica.jpg",     size:"3.2 MB",  ts:"2025-06-09 08:05", bucket:"media-fotos",    status:"ok" },
  { id:2, uid:2, name:"Prof. Ana Quispe",equipo:"PC-Docente-01",ip:"192.168.1.21", role:"docente", tipo:"documento",archivo:"Tarea_Mate_U3.pdf",    size:"1.1 MB",  ts:"2025-06-09 08:20", bucket:"docs-bucket",    status:"ok" },
  { id:3, uid:5, name:"Pedro Ríos",      equipo:"PC-Alumno-02", ip:"192.168.2.11", role:"alumno",  tipo:"video",    archivo:"Expo_Ciencias.mp4",    size:"245 MB",  ts:"2025-06-09 08:45", bucket:"media-videos",   status:"ok" },
  { id:4, uid:6, name:"Sofía Mamani",    equipo:"PC-Alumno-03", ip:"192.168.2.12", role:"alumno",  tipo:"audio",    archivo:"Presentacion.mp3",     size:"8.4 MB",  ts:"2025-06-09 09:10", bucket:"media-audio",    status:"ok" },
  { id:5, uid:3, name:"Prof. Luis Flores",equipo:"PC-Docente-02",ip:"192.168.1.22",role:"docente", tipo:"documento",archivo:"Lab_Ciencias_Inf2.docx",size:"890 KB",  ts:"2025-06-09 09:30", bucket:"docs-bucket",    status:"ok" },
  { id:6, uid:4, name:"María Torres",    equipo:"PC-Alumno-01", ip:"192.168.2.10", role:"alumno",  tipo:"agenda",   archivo:"Agenda_Junio.ical",    size:"12 KB",   ts:"2025-06-09 09:55", bucket:"agendas-bucket", status:"ok" },
];
let LOG_NEXT = 7;
// --- REEMPLAZAR TODA LA FUNCIÓN addLog(){...} POR ESTA (ahora es async) ---
function fileToBase64(file){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = () => res(r.result); // "data:image/png;base64,...."
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
function addLog(user, tipo, file, tareaId){
  const now = new Date();
  const pad = n=>String(n).padStart(2,"0");
  const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const ft = FILE_TYPES.find(f=>f.id===tipo);
  const sizeMB = (file.size/1024/1024);
  const size = sizeMB<1 ? Math.round(file.size/1024)+" KB" : sizeMB.toFixed(1)+" MB";
  const url = URL.createObjectURL(file);
  UPLOAD_LOG = [{ id:LOG_NEXT++, uid:user.id, name:user.name, equipo:user.equipo, ip:user.ip, role:user.role, tipo, archivo:file.name, size, ts, bucket:ft?.bucket||"media-bucket-prod", status:"ok", url, mime:file.type, tareaId:tareaId||null }, ...UPLOAD_LOG];
  persistUploads();
}
function deleteUpload(id){
  UPLOAD_LOG = UPLOAD_LOG.filter(l=>l.id!==id);
  persistUploads();
}
// --- AGREGAR DESPUÉS DE LA FUNCIÓN addLog(){...} ---
let TASKS = [
  { id:1, docenteId:2, docenteName:"Prof. Ana Quispe", titulo:"Ensayo Unidad 3", descripcion:"Redacción de 300 palabras sobre el tema visto en clase.", limite:"2026-07-18T23:59", ts:"2026-07-14 09:00" },
];
let TASK_NEXT = 2;

// --- REEMPLAZAR addTask PARA GUARDAR EL CURSO ---
function addTask(docente, titulo, descripcion, limite, cursoId){
  const now = new Date();
  const pad = n=>String(n).padStart(2,"0");
  const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  TASKS = [{ id:TASK_NEXT++, docenteId:docente.id, docenteName:docente.name, titulo, descripcion, limite, cursoId, ts }, ...TASKS];
}

function deleteTask(id){ TASKS = TASKS.filter(t=>t.id!==id); }

function taskStatus(limite){
  const diff = new Date(limite) - new Date();
  if(diff<0) return { label:"Vencida", color:LC.red, icon:"⛔" };
  if(diff<86400000) return { label:"Vence hoy/mañana", color:LC.yel, icon:"⏳" };
  return { label:"A tiempo", color:LC.grn, icon:"🕐" };
}
// --- AGREGAR DESPUÉS DE LA FUNCIÓN deleteTask(){...} ---
function persistUploads(){
  try{ localStorage.setItem("uploads_log", JSON.stringify(UPLOAD_LOG)); }
  catch(e){ console.error("Error guardando entregas:", e); }
}
function loadUploads(){
  try{
    const raw = localStorage.getItem("uploads_log");
    if(raw){ UPLOAD_LOG = JSON.parse(raw); LOG_NEXT = Math.max(...UPLOAD_LOG.map(l=>l.id),0)+1; }
  }catch(e){}
}
function persistTasks(){
  try{ localStorage.setItem("tasks_log", JSON.stringify(TASKS)); }
  catch(e){ console.error("Error guardando tareas:", e); }
}
function loadTasks(){
  try{
    const raw = localStorage.getItem("tasks_log");
    if(raw){ TASKS = JSON.parse(raw); TASK_NEXT = Math.max(...TASKS.map(t=>t.id),0)+1; }
  }catch(e){}
}

/* ══════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════ */
const pill = (color, text, icon="") => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 10px",borderRadius:99,
    fontSize:10,fontFamily:"monospace",background:`${color}20`,color,border:`1px solid ${color}44`}}>
    {icon&&<span>{icon}</span>} {text}
  </span>
);

function useTick(ms){ const [t,setT]=useState(0); useEffect(()=>{const id=setInterval(()=>setT(x=>x+1),ms);return()=>clearInterval(id);},[ms]); return t; }

function Blink({color=C.grn,sz=7}){
  const [on,setOn]=useState(true);
  useEffect(()=>{const id=setInterval(()=>setOn(v=>!v),900);return()=>clearInterval(id);},[]);
  return <span style={{display:"inline-block",width:sz,height:sz,borderRadius:"50%",background:color,opacity:on?1:0.15,transition:"opacity 0.4s",flexShrink:0}}/>;
}
// --- NUEVO COMPONENTE: pegar después de function Blink(){...} ---
function FileIcon({tipo, size=22, color}){
  const c = color || "currentColor";
  const paths = {
    foto: <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3.2"/><path d="M8 5l1.5-2h5L16 5"/></>,
    video:<><rect x="2" y="5" width="14" height="14" rx="2"/><path d="M16 9l5-3v12l-5-3z"/></>,
    audio:<><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></>,
    documento:<><path d="M6 2h8l5 5v15H6z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h6"/></>,
    agenda:<><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    zip:<><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18M10 6h2M10 10h2M10 14h2"/></>,
  };
  return(
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {paths[tipo] || <><rect x="4" y="4" width="16" height="16" rx="2"/></>}
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   LOGO
══════════════════════════════════════════════════ */
function Logo({size=40}){
  return(
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <rect width="80" height="80" rx="16" fill="url(#lg)"/>
      <rect x="18" y="40" width="44" height="26" rx="2" fill="white" opacity="0.12"/>
      <rect x="24" y="34" width="32" height="6"  rx="1" fill="white" opacity="0.2"/>
      <rect x="30" y="26" width="20" height="8"  rx="1" fill="white" opacity="0.18"/>
      <ellipse cx="40" cy="22" rx="13" ry="7"  fill="white" opacity="0.95"/>
      <ellipse cx="30" cy="24" rx="9"  ry="6"  fill="white" opacity="0.95"/>
      <ellipse cx="50" cy="25" rx="8"  ry="5"  fill="white" opacity="0.95"/>
      <rect x="23" y="45" width="8" height="7" rx="1" fill="url(#wg)" opacity="0.9"/>
      <rect x="36" y="45" width="8" height="7" rx="1" fill="url(#wg)" opacity="0.9"/>
      <rect x="49" y="45" width="8" height="7" rx="1" fill="url(#wg)" opacity="0.9"/>
      <rect x="32" y="56" width="16" height="10" rx="1" fill="white" opacity="0.18"/>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#1e3a8a"/><stop offset="100%" stopColor="#1d4ed8"/>
        </linearGradient>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd"/><stop offset="100%" stopColor="#3b82f6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════ */
function Modal({title,onClose,children,wide}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:C.sur,border:`1px solid ${C.bor2}`,borderRadius:16,width:"100%",maxWidth:wide?720:520,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,0.7)"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 24px",borderBottom:`1px solid ${C.bor}`,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:C.sur,zIndex:1}}>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.t3,fontSize:22,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"22px 24px"}}>{children}</div>
      </div>
    </div>
  );
}
// --- NUEVO COMPONENTE: pegar después de function Modal({...}){...} ---
function ForgotPasswordModal({onClose}){
  const [email,setEmail]=useState("");
  const [sent,setSent]=useState(false);

  const enviar=()=>{
    if(!email.trim()) return;
    const existe = INIT_USERS.find(u=>u.email===email.trim());
    if(!existe){ setSent("error"); return; }
    addPasswordRequest(email.trim());
    setSent(true);
  };

  return(
    <Modal title="Recuperar contraseña" onClose={onClose}>
      {sent===true ? (
        <div style={{textAlign:"center",padding:"10px 0"}}>
          <div style={{fontSize:34,marginBottom:10}}>✅</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:LC.grn,marginBottom:8}}>Solicitud enviada</div>
          <div style={{fontSize:12,color:LC.t2}}>El Administrador verá tu solicitud y restablecerá tu acceso. Te contactará a tu correo institucional.</div>
        </div>
      ):(
        <>
          <div style={{fontSize:12,color:LC.t2,marginBottom:14}}>
            Ingresa tu correo institucional. El Administrador recibirá tu solicitud y te ayudará a recuperar el acceso.
          </div>
          <Field label="Correo institucional" value={email} onChange={setEmail} ph="usuario@institutocloudcorp.edu.pe"/>
          {sent==="error" && <div style={{background:`${LC.red}12`,border:`1px solid ${LC.red}44`,borderRadius:8,padding:"9px 12px",marginBottom:14,fontSize:11,color:LC.red,fontFamily:"monospace"}}>Ese correo no está registrado en la plataforma.</div>}
          <Btn onClick={enviar} color={LC.navy}>Enviar solicitud al Administrador</Btn>
        </>
      )}
    </Modal>
  );
}

function Field({label,value,onChange,type="text",ph="",opts,rows}){
  const s={width:"100%",background:C.bg,border:`1px solid ${C.bor2}`,borderRadius:8,padding:"9px 12px",color:C.txt,fontSize:13,fontFamily:"monospace",outline:"none"};
  return(
    <div style={{marginBottom:14}}>
      <label style={{display:"block",fontFamily:"monospace",fontSize:9,color:C.t3,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>{label}</label>
      {opts?<select value={value} onChange={e=>onChange(e.target.value)} style={s}>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>
       :rows?<textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={ph} style={{...s,resize:"vertical"}}/>
       :<input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={ph} style={s}/>}
    </div>
  );
}

function Btn({onClick,children,color=C.blue,small,ghost,disabled}){
  return(
    <button onClick={disabled?undefined:onClick} disabled={disabled}
      style={{background:disabled?C.bor:ghost?`${color}18`:`linear-gradient(135deg,${color},${color}dd)`,
        border:`1px solid ${ghost?color+"44":disabled?C.bor:"transparent"}`,borderRadius:8,
        padding:small?"6px 13px":"10px 20px",color:disabled?C.t3:ghost?color:"#fff",
        fontSize:small?10:13,fontWeight:700,fontFamily:"'Syne',sans-serif",
        cursor:disabled?"not-allowed":"pointer",boxShadow:ghost||disabled?"none":`0 4px 14px ${color}44`,
        letterSpacing:0.2,transition:"all 0.15s"}}>
      {children}
    </button>
  );
}

function Toast({msg,type,onDone}){
  useEffect(()=>{const id=setTimeout(onDone,3200);return()=>clearTimeout(id);},[]);
  const tc={success:C.grn,error:C.red,info:C.b2,warning:C.yel};
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:2000,background:C.s2,border:`1px solid ${tc[type]||C.bor2}`,
      borderRadius:11,padding:"12px 18px",display:"flex",alignItems:"center",gap:10,
      boxShadow:"0 8px 32px rgba(0,0,0,0.6)",fontFamily:"monospace",fontSize:12,color:C.txt,maxWidth:360}}>
      <span style={{color:tc[type],fontSize:18}}>{type==="success"?"✓":type==="error"?"✗":type==="warning"?"⚠":"ℹ"}</span>
      {msg}
    </div>
  );
}

// --- NUEVO COMPONENTE: pegar después de function Toast(){...} ---
function SubmissionBadge({status="enviado", ts}){
  const map = {
    enviado:  { color: LC.grn, icon:"✓", label:"Tarea enviada" },
    pendiente:{ color: LC.yel, icon:"⏳", label:"Pendiente de envío" },
    revisado: { color: LC.navy,icon:"👁", label:"Revisado por docente" },
  };
  const s = map[status] || map.enviado;
  return(
    <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 13px",borderRadius:99,
      background:`${s.color}14`,border:`1px solid ${s.color}44`,fontFamily:"monospace",fontSize:11,color:s.color}}>
      <span style={{fontSize:13}}>{s.icon}</span> {s.label}
      {ts && <span style={{color:LC.t3,marginLeft:4}}>· {ts}</span>}
    </div>
  );
}

// --- NUEVO COMPONENTE: pegar después de function GalleryPicker(){...} ---
// --- EN StudentsRosterPage: REEMPLAZAR TODA LA FUNCIÓN POR ESTA (con aviso si falta configuración) ---
function StudentsRosterPage({toast,me}){
  const T = theme(me.role);
  const misCursos = misCursosDe(me.id);
  const alumnos = alumnosDeDocente(me.id);

  if(misCursos.length===0) return(
  <div style={{textAlign:"center",padding:50,color:T.t3,fontFamily:"monospace",fontSize:12}}>
    ⚠ No tienes cursos asignados todavía. Pide al Administrador que te asigne uno.
  </div>
);

  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:4,color:T.navy}}>Mis Alumnos — {misCursos.map(c=>c.nombre).join(" · ")}</div>
      <div style={{fontSize:11,color:T.t2,marginBottom:18}}>{alumnos.length} alumnos registrados en este curso</div>
      {alumnos.length===0 && <div style={{textAlign:"center",padding:40,color:T.t3,fontFamily:"monospace",fontSize:12}}>Aún no hay alumnos asignados a este curso.</div>}
      <div style={{background:T.sur,border:`1px solid ${T.bor}`,borderRadius:12,overflow:"hidden"}}>
        {alumnos.length>0 && (
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Alumno","Equipo","Entregas","Estado"].map(h=>(
            <th key={h} style={{textAlign:"left",fontFamily:"monospace",fontSize:8,textTransform:"uppercase",letterSpacing:1.5,color:T.t3,padding:"10px 16px",borderBottom:`1px solid ${T.bor}`}}>{h}</th>
          ))}</tr></thead>
          <tbody>{alumnos.map(a=>{
            const entregas = UPLOAD_LOG.filter(l=>l.uid===a.id).length;
            return(
              <tr key={a.id} style={{borderBottom:`1px solid ${T.bor}`}}>
                <td style={{padding:"11px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.navy}88,${T.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>{a.avatar}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif",color:T.txt}}>{a.name}</div>
                      <div style={{fontFamily:"monospace",fontSize:9,color:T.t3}}>{a.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:"11px 16px",fontFamily:"monospace",fontSize:10,color:T.cyn}}>{a.equipo}</td>
                <td style={{padding:"11px 16px",fontFamily:"monospace",fontSize:12,fontWeight:700,color:T.navy}}>{entregas}</td>
                <td style={{padding:"11px 16px"}}>{pill(a.status==="active"?T.grn:T.red,a.status==="active"?"Activo":"Inactivo")}</td>
              </tr>
            );
          })}</tbody>
        </table>
        )}
      </div>
    </div>
  );
}
// --- NUEVO COMPONENTE: pegar después de function StudentsRosterPage(){...} ---
// --- REEMPLAZAR LA FUNCIÓN TareasPage COMPLETA ---
function TareasPage({me,toast,taskVersion,onRefresh}){
  const T = theme(me.role);
  const [titulo,setTitulo]=useState("");
  const [desc,setDesc]=useState("");
  const [limite,setLimite]=useState("");
  const isDocente = me.role==="docente";
  const misCursos = isDocente ? misCursosDe(me.id) : [];
  const [cursoId,setCursoId] = useState(misCursos[0]?.id || null);

  const misAlumnos = isDocente ? alumnosDeDocente(me.id).map(a=>a.id) : [];
  const tasks = isDocente
    ? TASKS.filter(t=>t.docenteId===me.id)
    : TASKS.filter(t=> (INIT_USERS.find(u=>u.id===me.id)?.cursos||[]).includes(t.cursoId));

  const crear=()=>{
    if(!titulo.trim()||!limite||!cursoId){toast("Completa título, curso y fecha límite","error");return;}
    addTask(me,titulo.trim(),desc.trim(),limite,cursoId);
    persistTasks();
    setTitulo("");setDesc("");setLimite("");
    toast("Tarea asignada correctamente ✓","success");
    onRefresh&&onRefresh();
  };

  const eliminar=(id)=>{ deleteTask(id); persistTasks(); toast("Tarea eliminada","warning"); onRefresh&&onRefresh(); };

  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:4,color:T.navy}}>
        {isDocente?"Tareas Asignadas":"Mis Tareas"}
      </div>
      <div style={{fontSize:11,color:T.t2,marginBottom:18}}>
        {isDocente?"Crea trabajos con fecha límite para tus alumnos":"Revisa tus tareas pendientes por curso"}
      </div>

      {isDocente && misCursos.length>0 && (
        <div style={{background:T.sur,border:`1px solid ${T.bor}`,borderRadius:12,padding:"18px 20px",marginBottom:20}}>
          {misCursos.length>1 && (
            <Field label="Curso" value={String(cursoId)} onChange={v=>setCursoId(Number(v))} opts={misCursos.map(c=>String(c.id))}/>
          )}
          <Field label="Título del trabajo" value={titulo} onChange={setTitulo} ph="Ej. Ensayo Unidad 4"/>
          <Field label="Descripción" value={desc} onChange={setDesc} rows={3} ph="Instrucciones para el alumno..."/>
          <Field label="Fecha y hora límite" value={limite} onChange={setLimite} type="datetime-local"/>
          <Btn onClick={crear} color={T.navy}>+ Asignar Tarea</Btn>
        </div>
      )}

      <div style={{display:"grid",gap:12}}>
        {tasks.length===0 && <div style={{textAlign:"center",padding:"30px",color:T.t3,fontFamily:"monospace",fontSize:12}}>No hay tareas registradas.</div>}
        {tasks.map(t=>{
          const st = taskStatus(t.limite);
          const curso = COURSES.find(c=>c.id===t.cursoId);
          return(
            <div key={t.id} style={{background:T.sur,border:`1px solid ${T.bor}`,borderRadius:12,padding:"14px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:T.txt}}>{t.titulo}</div>
                  <div style={{fontSize:11,color:T.t2,marginTop:4}}>{t.descripcion}</div>
                  <div style={{fontFamily:"monospace",fontSize:9,color:T.t3,marginTop:6}}>
                    Curso: {curso?.nombre||"—"} {!isDocente && `· Docente: ${t.docenteName}`}
                  </div>
                </div>
                {isDocente && <Btn onClick={()=>eliminar(t.id)} color={T.red} small ghost>Eliminar</Btn>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 11px",borderRadius:99,background:`${st.color}14`,border:`1px solid ${st.color}44`,fontFamily:"monospace",fontSize:10,color:st.color}}>
                  {st.icon} {st.label}
                </span>
                <span style={{fontFamily:"monospace",fontSize:9,color:T.t3}}>Límite: {new Date(t.limite).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// --- EN MisCursosPage: REEMPLAZAR LA FUNCIÓN COMPLETA POR ESTA (agrega estado y apertura del detalle) ---
function MisCursosPage({me,toast}){
  const T = theme(me.role);
  const misCursos = COURSES.filter(c=>me.cursos?.includes(c.id));
  const [verCompaneros,setVerCompaneros] = useState(null);
  const [verDetalle,setVerDetalle] = useState(null);

  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:4,color:T.navy}}>Mis Cursos</div>
      <div style={{fontSize:11,color:T.t2,marginBottom:18}}>{misCursos.length} curso(s) matriculado(s) · haz clic en un curso para ver tareas, avance y tu grupo</div>

      {misCursos.length===0 && <div style={{textAlign:"center",padding:40,color:T.t3,fontFamily:"monospace",fontSize:12}}>No estás matriculado en ningún curso aún.</div>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
        {misCursos.map(c=>{
          const docente = INIT_USERS.find(u=>u.id===c.docenteId);
          const tareasCurso = TASKS.filter(t=>t.cursoId===c.id);
          const companeros = INIT_USERS.filter(u=>u.role==="alumno" && u.id!==me.id && u.cursos?.includes(c.id));
          return(
            <div key={c.id} onClick={()=>setVerDetalle(c)}
              style={{background:T.sur,border:`1px solid ${T.bor}`,borderRadius:12,padding:"18px 20px",cursor:"pointer"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:T.navy,marginBottom:8}}>{c.nombre}</div>
              <div style={{fontSize:11,color:T.t2,marginBottom:4}}>Docente: {docente?.name||"—"}</div>
              <div style={{fontFamily:"monospace",fontSize:9,color:T.t3,marginBottom:10}}>{tareasCurso.length} tarea(s) · {companeros.length} compañero(s)</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 11px",borderRadius:99,background:`${T.grn}14`,border:`1px solid ${T.grn}44`,fontFamily:"monospace",fontSize:10,color:T.grn}}>
                  ✓ Matriculado
                </span>
                <Btn onClick={(e)=>{e.stopPropagation();setVerCompaneros(c);}} color={T.navy} small ghost>Ver compañeros</Btn>
              </div>
            </div>
          );
        })}
      </div>

      {verCompaneros && (
        <Modal title={`Compañeros de ${verCompaneros.nombre}`} onClose={()=>setVerCompaneros(null)}>
          {INIT_USERS.filter(u=>u.role==="alumno" && u.id!==me.id && u.cursos?.includes(verCompaneros.id)).map(u=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${T.bor}`}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${T.navy}88,${T.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff"}}>{u.avatar}</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:T.txt}}>{u.name}</div>
                <div style={{fontFamily:"monospace",fontSize:9,color:T.t3}}>{u.equipo}</div>
              </div>
            </div>
          ))}
        </Modal>
      )}

      {verDetalle && <CourseDetailModal curso={verDetalle} me={me} onClose={()=>setVerDetalle(null)} toast={toast}/>}
    </div>
  );
}
// --- NUEVO COMPONENTE: pegar después de function MisCursosPage(){...} ---
function CourseDetailModal({curso, me, onClose, toast}){
  const T = theme(me.role);
  const tareasCurso = TASKS.filter(t=>t.cursoId===curso.id);
  const misEntregas = UPLOAD_LOG.filter(l=>l.uid===me.id);
  const grupo = miGrupoDe(me.id, curso.id);
  const miembrosGrupo = grupo ? INIT_USERS.filter(u=>grupo.miembros.includes(u.id)) : [];
  const [archivosGrupo,setArchivosGrupo] = useState(grupo ? GROUP_FILES.filter(f=>f.groupId===grupo.id) : []);
  const [showCall,setShowCall] = useState(false);
  const fileRef = useRef(null);

  const enviadas = tareasCurso.filter(t => misEntregas.some(e=>e.tareaId===t.id)).length;
  const progreso = tareasCurso.length ? Math.round((enviadas/tareasCurso.length)*100) : 0;

  const subirAlGrupo = (e) => {
    const file = e.target.files?.[0];
    if(!file || !grupo) return;
    addGroupFile(grupo.id, me, file);
    setArchivosGrupo(GROUP_FILES.filter(f=>f.groupId===grupo.id));
    toast("Archivo compartido con tu grupo ✓","success");
    e.target.value="";
  };

  const roomName = grupo ? `InstitutoCloudCorp-${curso.nombre.replace(/\s+/g,"")}-Grupo${grupo.id}` : null;

  return(
    <Modal title={curso.nombre} onClose={onClose} wide>
      {/* Progreso */}
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:T.navy}}>Tu avance en el curso</span>
          <span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:T.grn}}>{progreso}%</span>
        </div>
        <div style={{height:8,background:T.bor,borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progreso}%`,background:T.grn,borderRadius:99,transition:"width .6s"}}/>
        </div>
        <div style={{fontFamily:"monospace",fontSize:9,color:T.t3,marginTop:4}}>{enviadas} de {tareasCurso.length} tareas entregadas</div>
      </div>

      {/* Tareas */}
      <div style={{marginBottom:22}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,marginBottom:10,color:T.navy}}>Tareas del curso</div>
        {tareasCurso.length===0 && <div style={{fontSize:11,color:T.t3,fontFamily:"monospace"}}>Aún no hay tareas asignadas.</div>}
        {tareasCurso.map(t=>{
          const entregado = misEntregas.some(e=>e.tareaId===t.id);
          const st = taskStatus(t.limite);
          return(
            <div key={t.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:`1px solid ${T.bor}`}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:T.txt}}>{t.titulo}</div>
                <div style={{fontFamily:"monospace",fontSize:9,color:T.t3}}>Límite: {new Date(t.limite).toLocaleString()}</div>
              </div>
              {entregado
                ? <SubmissionBadge status="enviado"/>
                : <span style={{fontFamily:"monospace",fontSize:10,color:st.color}}>{st.icon} {st.label}</span>}
            </div>
          );
        })}
      </div>

      {/* Grupo de trabajo */}
      <div>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,marginBottom:10,color:T.navy}}>Grupo de trabajo</div>
        {!grupo && <div style={{fontSize:11,color:T.t3,fontFamily:"monospace"}}>Tu docente aún no ha creado grupos para este curso.</div>}
        {grupo && (
          <div style={{background:T.s2,border:`1px solid ${T.bor}`,borderRadius:10,padding:"14px 16px"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:T.navy,marginBottom:8}}>{grupo.nombre}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
              {miembrosGrupo.map(m=>(
                <span key={m.id} style={{display:"inline-flex",alignItems:"center",gap:6,background:"#fff",border:`1px solid ${T.bor}`,borderRadius:99,padding:"4px 10px",fontSize:10,fontFamily:"monospace"}}>
                  {m.avatar} {m.name}
                </span>
              ))}
            </div>

            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <Btn onClick={()=>setShowCall(true)} color={T.navy}>🎥 Unirse a videollamada</Btn>
              <Btn onClick={()=>fileRef.current.click()} color={T.grn}>📎 Compartir archivo</Btn>
              <input ref={fileRef} type="file" style={{display:"none"}} onChange={subirAlGrupo}/>
            </div>

            {archivosGrupo.length>0 && (
              <div>
                <div style={{fontFamily:"monospace",fontSize:9,color:T.t3,marginBottom:6}}>Archivos compartidos en el grupo:</div>
                {archivosGrupo.map(f=>(
                  <div key={f.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0"}}>
                    <span style={{fontSize:11,color:T.txt}}>{f.archivo} <span style={{color:T.t3,fontFamily:"monospace",fontSize:9}}>· {f.name}</span></span>
                    <a href={f.url} download={f.archivo} style={{fontFamily:"monospace",fontSize:10,color:T.navy}}>⬇ Descargar</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showCall && grupo && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:2000,display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 20px",background:T.navy}}>
            <span style={{color:"#fff",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:13}}>{grupo.nombre} — Videollamada</span>
            <button onClick={()=>setShowCall(false)} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer"}}>×</button>
          </div>
          <iframe
            src={`https://meet.jit.si/${roomName}`}
            style={{flex:1,border:"none"}}
            allow="camera; microphone; fullscreen; display-capture"
          />
        </div>
      )}
    </Modal>
  );
}
function GruposPage({me,toast}){
  const T = theme(me.role);
  const misCursos = misCursosDe(me.id);
  const [cursoId,setCursoId] = useState(misCursos[0]?.id||null);
  const [cantidad,setCantidad] = useState("4");
  const [,forceUpdate] = useState(0);

  const curso = COURSES.find(c=>c.id===cursoId);
  const alumnosCurso = curso ? INIT_USERS.filter(u=>u.role==="alumno" && u.cursos?.includes(curso.id)) : [];
  const gruposCurso = GROUPS.filter(g=>g.cursoId===cursoId);

  const generar = () => {
    if(!cursoId || !cantidad || Number(cantidad)<1){ toast("Elige un curso y una cantidad válida","error"); return; }
    if(alumnosCurso.length===0){ toast("Este curso no tiene alumnos matriculados","error"); return; }
    generarGruposAleatorios(cursoId, Number(cantidad));
    forceUpdate(v=>v+1);
    toast(`${cantidad} grupo(s) generado(s) para ${curso.nombre} ✓`,"success");
  };

  if(misCursos.length===0) return <div style={{textAlign:"center",padding:50,color:T.t3,fontFamily:"monospace",fontSize:12}}>No tienes cursos asignados.</div>;

  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:4,color:T.navy}}>Grupos de Trabajo</div>
      <div style={{fontSize:11,color:T.t2,marginBottom:18}}>Crea grupos aleatorios para trabajos colaborativos</div>

      <div style={{background:T.sur,border:`1px solid ${T.bor}`,borderRadius:12,padding:"18px 20px",marginBottom:20}}>
        <Field label="Curso" value={String(cursoId)} onChange={v=>setCursoId(Number(v))} opts={misCursos.map(c=>String(c.id))}/>
        <Field label="Cantidad de grupos" value={cantidad} onChange={setCantidad} type="number"/>
        <div style={{fontFamily:"monospace",fontSize:10,color:T.t3,marginBottom:14}}>{alumnosCurso.length} alumno(s) matriculado(s) en este curso</div>
        <Btn onClick={generar} color={T.navy}>🎲 Generar grupos aleatorios</Btn>
      </div>

      {gruposCurso.length>0 && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
          {gruposCurso.map(g=>{
            const miembros = INIT_USERS.filter(u=>g.miembros.includes(u.id));
            return(
              <div key={g.id} style={{background:T.sur,border:`1px solid ${T.bor}`,borderRadius:12,padding:"16px 18px"}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:T.navy,marginBottom:10}}>{g.nombre}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {miembros.map(m=>(
                    <span key={m.id} style={{display:"inline-flex",alignItems:"center",gap:6,background:T.s2,border:`1px solid ${T.bor}`,borderRadius:99,padding:"4px 10px",fontSize:10,fontFamily:"monospace"}}>
                      {m.avatar} {m.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- REEMPLAZAR TODA LA FUNCIÓN function RevisionEntregasPage({...}){...} POR ESTA ---
function RevisionEntregasPage({toast,logVersion,me}){
  const [filter,setFilter]=useState("all");
  const [preview,setPreview]=useState(null);

  const alumnos = alumnosDeDocente(me.id);
  const alumnoIds = alumnos.map(a=>a.id);

  const [entregas,setEntregas]=useState(UPLOAD_LOG.filter(l=>alumnoIds.includes(l.uid)));
  useEffect(()=>{
    setEntregas(UPLOAD_LOG.filter(l=>alumnoIds.includes(l.uid)));
  },[logVersion]);

  const filtered = filter==="all" ? entregas : entregas.filter(l=>l.tipo===filter);

  const eliminar = (id, nombreArchivo) => {
    if(!window.confirm(`¿Eliminar "${nombreArchivo}"? Esta acción no se puede deshacer.`)) return;
    deleteUpload(id);
    setEntregas(prev=>prev.filter(l=>l.id!==id));
    toast(`"${nombreArchivo}" eliminado`,"warning");
  };

  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:4,color:LC.navy}}>Revisión de Entregas</div>
      <div style={{fontSize:11,color:LC.t2,marginBottom:16}}>{entregas.length} archivos subidos por tus alumnos</div>

      <div style={{display:"flex",gap:7,marginBottom:18,flexWrap:"wrap"}}>
        {["all","foto","video","audio","documento"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{background:filter===f?LC.navy:LC.s2,border:`1px solid ${filter===f?LC.navy:LC.bor}`,
              borderRadius:7,padding:"5px 13px",color:filter===f?"#fff":LC.t2,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>
            {f==="all"?"Todos":f}
          </button>
        ))}
      </div>

      <div style={{background:LC.sur,border:`1px solid ${LC.bor}`,borderRadius:12,overflow:"hidden"}}>
        {filtered.length===0 && <div style={{textAlign:"center",padding:40,color:LC.t3,fontFamily:"monospace",fontSize:12}}>Sin entregas de este tipo.</div>}
        {filtered.map((l,i)=>{
          const ft = FILE_TYPES.find(f=>f.id===l.tipo);
          return(
            <div key={l.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 18px",
              borderBottom: i<filtered.length-1 ? `1px solid ${LC.bor}` : "none"}}>

              {/* Avatar + nombre alumno */}
              <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${LC.navy}88,${LC.navy})`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff",flexShrink:0}}>
                {l.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
              </div>
              <div style={{minWidth:150}}>
                <div style={{fontSize:13,fontWeight:700,color:LC.txt}}>{l.name}</div>
                <div style={{fontFamily:"monospace",fontSize:9,color:LC.t3}}>{l.equipo}</div>
              </div>

              {/* Icono + archivo (al costado del nombre) */}
              <div onClick={()=>setPreview(l)} style={{display:"flex",alignItems:"center",gap:10,flex:1,cursor:"pointer",minWidth:0}}>
                <div style={{width:38,height:38,borderRadius:8,background:LC.s2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                  {l.url && l.mime?.startsWith("image/")
                    ? <img src={l.url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    : <FileIcon tipo={l.tipo} size={20} color={ft?.color||LC.navy}/>}
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:LC.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.archivo}</div>
                  <div style={{fontFamily:"monospace",fontSize:9,color:LC.t3}}>{l.size} · {l.ts}</div>
                </div>
              </div>

              {/* Acciones */}
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <Btn onClick={()=>setPreview(l)} color={LC.navy} small ghost>Ver</Btn>
                <Btn onClick={()=>eliminar(l.id, l.archivo)} color={LC.red} small ghost>Eliminar</Btn>
              </div>
            </div>
          );
        })}
      </div>

      {preview && (
        <Modal title={preview.archivo} onClose={()=>setPreview(null)} wide>
          <div style={{textAlign:"center",marginBottom:14}}>
            {preview.mime?.startsWith("image/") && <img src={preview.url} style={{maxWidth:"100%",borderRadius:10}}/>}
            {preview.mime?.startsWith("video/") && <video src={preview.url} controls style={{maxWidth:"100%",borderRadius:10}}/>}
            {preview.mime?.startsWith("audio/") && <audio src={preview.url} controls style={{width:"100%"}}/>}
            {!preview.mime?.startsWith("image/") && !preview.mime?.startsWith("video/") && !preview.mime?.startsWith("audio/") && (
              <div style={{padding:30}}>
                <div style={{marginBottom:10,display:"flex",justifyContent:"center"}}><FileIcon tipo={preview.tipo} size={60} color={LC.navy}/></div>
                <div style={{fontFamily:"monospace",fontSize:12,color:LC.t2}}>{preview.archivo}</div>
              </div>
            )}
          </div>
          <div style={{fontFamily:"monospace",fontSize:11,color:LC.t2,marginBottom:14}}>
            Alumno: {preview.name} · {preview.equipo} · {preview.ts} · {preview.size}
          </div>
          <div style={{display:"flex",gap:10}}>
            <a href={preview.url} download={preview.archivo}
              style={{display:"inline-flex",alignItems:"center",gap:8,background:LC.navy,color:"#fff",borderRadius:8,
                padding:"10px 20px",fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,textDecoration:"none"}}>
              ⬇ Descargar
            </a>
            <Btn onClick={()=>{eliminar(preview.id, preview.archivo); setPreview(null);}} color={LC.red} ghost>Eliminar entrega</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
/* ══════════════════════════════════════════════════
   GRÁFICO DE BARRAS (archivos subidos por tipo/equipo)
══════════════════════════════════════════════════ */
// --- REEMPLAZAR TODA LA FUNCIÓN function UploadChart({...}){...} POR ESTA ---
function UploadChart({logs, hideEquipo}){
  const byType = FILE_TYPES.map(ft=>{
    const count = logs.filter(l=>l.tipo===ft.id).length;
    return { label:ft.label, icon:ft.icon, color:ft.color, count };
  }).filter(x=>x.count>0);

  const equipos = [...new Set(logs.map(l=>l.equipo))];
  const byEquipo = equipos.map(eq=>{
    const items = logs.filter(l=>l.equipo===eq);
    const role  = items[0]?.role;
    const color = role==="admin"?C.aws:role==="docente"?C.b2:C.grn;
    return { equipo:eq, count:items.length, color, ip:items[0]?.ip, name:items[0]?.name };
  }).sort((a,b)=>b.count-a.count);

  const maxType  = Math.max(...byType.map(x=>x.count),1);
  const maxEquip = Math.max(...byEquipo.map(x=>x.count),1);

  return(
    <div style={{display:"grid",gridTemplateColumns: hideEquipo ? "1fr" : "1fr 1fr",gap:16}}>
      <div style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"13px 18px",borderBottom:`1px solid ${C.bor}`,fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800}}>
          📊 Archivos por Tipo
        </div>
        <div style={{padding:"16px 18px"}}>
          {byType.length===0&&<div style={{textAlign:"center",padding:"24px",color:C.t3,fontFamily:"monospace",fontSize:11}}>Sin datos</div>}
          {byType.map(b=>(
            <div key={b.label} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
                <span style={{display:"flex",alignItems:"center",gap:6}}><span>{b.icon}</span>{b.label}</span>
                <span style={{fontFamily:"monospace",fontWeight:700,color:b.color}}>{b.count}</span>
              </div>
              <div style={{height:6,background:C.bor,borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(b.count/maxType)*100}%`,background:b.color,borderRadius:99,transition:"width 0.8s ease"}}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!hideEquipo && (
        <div style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,overflow:"hidden"}}>
          <div style={{padding:"13px 18px",borderBottom:`1px solid ${C.bor}`,fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800}}>
            🖥 Subidas por Equipo
          </div>
          <div style={{padding:"16px 18px"}}>
            {byEquipo.map(b=>(
              <div key={b.equipo} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{fontSize:11}}>
                    <div style={{fontWeight:600,color:b.color}}>{b.equipo}</div>
                    <div style={{fontFamily:"monospace",fontSize:9,color:C.t3}}>{b.ip} · {b.name}</div>
                  </div>
                  <span style={{fontFamily:"monospace",fontWeight:700,color:b.color,fontSize:14}}>{b.count}</span>
                </div>
                <div style={{height:6,background:C.bor,borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(b.count/maxEquip)*100}%`,background:b.color,borderRadius:99,transition:"width 0.8s"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
/* ══════════════════════════════════════════════════
   LOGIN — ESTILO SAAS ENTERPRISE (PRO)
══════════════════════════════════════════════════ */
// --- REEMPLAZAR TODA LA FUNCIÓN function LoginPage({...}){...} POR ESTA ---
function LoginPage({onLogin}){
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [show,setShow]=useState(false);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [users]=useState(INIT_USERS);
  const [forgotOpen,setForgotOpen]=useState(false);

  const demos=[
    {role:"admin",   email:"admin@institutocloudcorp.edu.pe",       pass:"Admin2024!"},
    {role:"docente", email:"ana.quispe@institutocloudcorp.edu.pe",  pass:"Doc2024!"},
    {role:"alumno",  email:"maria.torres@institutocloudcorp.edu.pe",pass:"Alu2024!"},
  ];

  const login=()=>{
    if(!email||!pass){setErr("Completa todos los campos.");return;}
    setLoading(true);setErr("");
    setTimeout(()=>{
      const u=users.find(x=>x.email===email&&x.pass===pass);
      if(!u){setErr("Credenciales incorrectas.");setLoading(false);return;}
      if(u.status==="inactive"){setErr("Cuenta inactiva. Contacta al Administrador.");setLoading(false);return;}
      onLogin(u);
    },800);
  };

  const googleLogin=()=>{
    toast_placeholder();
  };
  const toast_placeholder=()=>{
    setErr("El login con Google aún no está configurado. Requiere conexión con AWS Cognito.");
  };

  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",
  backgroundImage:`url('/instituto-fondo.jpg')`,
  backgroundSize:"cover", backgroundPosition:"center", backgroundAttachment:"fixed", padding:20}}>

      <div style={{width:"100%",maxWidth:420,background:"rgba(255,255,255,0.97)",borderRadius:18,padding:"36px 34px",
        boxShadow:"0 30px 80px rgba(0,0,0,0.4)"}}>

        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
          <Logo size={44}/>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:17,fontWeight:800,color:LC.navy,lineHeight:1.1}}>Instituto<br/>CloudCorp</div>
          </div>
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,color:LC.navy,marginBottom:4}}>Bienvenido de vuelta</div>
          <div style={{fontSize:12,color:LC.t2}}>Accede con tu cuenta institucional</div>
        </div>

        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontFamily:"monospace",fontSize:9,color:LC.t3,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Correo institucional</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="usuario@institutocloudcorp.edu.pe"
            style={{width:"100%",background:LC.s2,border:`1px solid ${LC.bor2}`,borderRadius:8,padding:"11px 14px",color:LC.txt,fontSize:13,fontFamily:"monospace",outline:"none"}}/>
        </div>

        <div style={{position:"relative",marginBottom:8}}>
          <label style={{display:"block",fontFamily:"monospace",fontSize:9,color:LC.t3,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Contraseña</label>
          <input value={pass} onChange={e=>setPass(e.target.value)} type={show?"text":"password"} placeholder="••••••••"
            style={{width:"100%",background:LC.s2,border:`1px solid ${LC.bor2}`,borderRadius:8,padding:"11px 14px",color:LC.txt,fontSize:13,fontFamily:"monospace",outline:"none"}}/>
          <button onClick={()=>setShow(v=>!v)} style={{position:"absolute",right:12,bottom:11,background:"none",border:"none",cursor:"pointer",color:LC.t3,fontSize:15}}>{show?"🙈":"👁"}</button>
        </div>

        <div style={{textAlign:"right",marginBottom:16}}>
          <span onClick={()=>setForgotOpen(true)} style={{fontSize:11,color:LC.navy,cursor:"pointer",fontFamily:"monospace",textDecoration:"underline"}}>¿Olvidaste tu contraseña?</span>
        </div>

        {err&&<div style={{background:`${LC.red}12`,border:`1px solid ${LC.red}44`,borderRadius:8,padding:"9px 12px",marginBottom:14,fontSize:11,color:LC.red,fontFamily:"monospace"}}>{err}</div>}

        <button onClick={login} onKeyDown={e=>e.key==="Enter"&&login()} disabled={loading}
          style={{width:"100%",background:loading?LC.bor2:LC.navy,border:"none",borderRadius:10,
            padding:"13px",color:"white",fontSize:14,fontWeight:800,fontFamily:"'Syne',sans-serif",
            cursor:loading?"not-allowed":"pointer",boxShadow:loading?"none":`0 4px 20px ${LC.navy}44`,marginBottom:14}}>
          {loading?"Ingresando...":"Iniciar Sesión →"}
        </button>

        <div style={{display:"flex",alignItems:"center",gap:10,margin:"14px 0"}}>
          <div style={{flex:1,height:1,background:LC.bor}}/>
          <span style={{fontSize:10,color:LC.t3,fontFamily:"monospace"}}>o continúa con</span>
          <div style={{flex:1,height:1,background:LC.bor}}/>
        </div>

        <button onClick={googleLogin}
          style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            background:"#fff",border:`1px solid ${LC.bor2}`,borderRadius:10,padding:"11px",cursor:"pointer",
            fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:LC.txt}}>
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 6 29.5 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 6 29.5 4 24 4c-7.4 0-13.8 4.1-17.1 10.1z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.4 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.9 39.6 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C40.9 36 44 30.7 44 24c0-1.3-.1-2.7-.4-3.5z"/></svg>
          Continuar con Google
        </button>

        <div style={{marginTop:22,background:LC.s2,border:`1px solid ${LC.bor}`,borderRadius:12,padding:"14px 16px"}}>
          <div style={{fontFamily:"monospace",fontSize:9,color:LC.t3,textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>Cuentas de demostración</div>
          {demos.map(d=>{
            const rc=ROLE[d.role];
            return(
              <div key={d.role} onClick={()=>{setEmail(d.email);setPass(d.pass);setErr("");}}
                style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,cursor:"pointer",marginBottom:6,
                  background:"#fff",border:`1px solid ${LC.bor}`}}>
                <span style={{fontSize:16}}>{rc.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:11,fontWeight:700,color:LC.navy}}>{rc.label}</div>
                </div>
                <span style={{fontFamily:"monospace",fontSize:8,color:LC.navy}}>Usar →</span>
              </div>
            );
          })}
        </div>
      </div>

      {forgotOpen && <ForgotPasswordModal onClose={()=>setForgotOpen(false)}/>}
    </div>
  );
}
/* ══════════════════════════════════════════════════
   UPLOAD SIMULATOR con barra de progreso real
══════════════════════════════════════════════════ */
// --- REEMPLAZAR TODA LA FUNCIÓN function UploadBox({...}){...} POR ESTA ---
function UploadBox({user,toast,onDone}){
  const [tareaId,setTareaId] = useState("");
  const misTareasPendientes = TASKS.filter(t=> (user.cursos||[]).includes(t.cursoId))
  const [tipo,setTipo]=useState("foto");
  const [fase,setFase]=useState("idle"); // idle | uploading | done
  const [lastFile,setLastFile]=useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const ft = FILE_TYPES.find(f=>f.id===tipo);

  const detectarTipo = (file) => {
  const m = file.type;
  if(m.startsWith("image/")) return "foto";
  if(m.startsWith("video/")) return "video";
  if(m.startsWith("audio/")) return "audio";
  return "documento";
};

// --- EN UploadBox: REEMPLAZAR procesarArchivo POR ESTA (agrega validación de tamaño 0) ---
const procesarArchivo=async (file)=>{
  if(!file) return;
  if(file.size===0){
    toast("El archivo está vacío (0 KB). No se puede subir.","error");
    return;
  }
  if(file.size > 3*1024*1024){
    toast("Archivo muy grande (máx. 3 MB por ahora). Usa uno más liviano.","error");
    return;
  }
  const tipoReal = detectarTipo(file);
  setTipo(tipoReal);
  setFase("uploading");
 addLog(user, tipoReal, file, tareaId||null);
  setLastFile(file);
  setFase("done");
  onDone&&onDone();
  toast(`"${file.name}" subido correctamente ✓`,"success");
};

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    procesarArchivo(file);
    e.target.value = ""; // permite volver a subir el mismo archivo
  };

  const reset=()=>{setFase("idle");setLastFile(null);setTipo("foto");};

  if(fase==="done") return(
    <div style={{textAlign:"center",padding:"28px"}}>
      <div style={{fontSize:40,marginBottom:12}}>✅</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:LC.grn,marginBottom:10}}>Archivo subido</div>
      <div style={{fontFamily:"monospace",fontSize:11,color:LC.t2,marginBottom:14}}>{lastFile?.name}</div>
      {lastFile && lastFile.type.startsWith("image/") && (
        <img src={URL.createObjectURL(lastFile)} style={{maxWidth:200,borderRadius:10,marginBottom:14}}/>
      )}
      <div><Btn onClick={reset} color={LC.navy}>Subir otro archivo</Btn></div>
    </div>
  );

  if(fase==="uploading") return(
    <div style={{padding:"28px",textAlign:"center"}}>
      <div style={{fontSize:32,marginBottom:12}}>{ft.icon}</div>
      <div style={{fontFamily:"monospace",fontSize:12,color:LC.t2}}>Subiendo archivo...</div>
    </div>
  );

  return(
    <div style={{padding:"20px"}}>
      {/* Tipo de archivo (solo clasificación visual) */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
        {FILE_TYPES.filter(f=>f.id!=="zip"&&f.id!=="agenda").map(ft2=>(
          <div key={ft2.id} style={{padding:"10px 8px",borderRadius:9,textAlign:"center",
            background:LC.s2,border:`1px solid ${LC.bor}`}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:4,color:ft2.color}}><FileIcon tipo={ft2.id} size={20} color={ft2.color}/></div>
            
            <div style={{fontFamily:"monospace",fontSize:9,color:LC.t2}}>{ft2.label}</div>
          </div>
        ))}
      </div>
      <div style={{fontFamily:"monospace",fontSize:9,color:LC.t3,textAlign:"center",marginBottom:14}}>
        El tipo se detecta automáticamente según el archivo que subas
      </div>
      {/* Input oculto: cámara nativa del dispositivo (celular abre la cámara real) */}
      <input ref={cameraInputRef} type="file" accept="image/*,video/*" capture="environment"
        onChange={onPickFile} style={{display:"none"}}/>
      {/* Input oculto: cualquier archivo desde el dispositivo/galería */}
      <input ref={fileInputRef} type="file" accept="*/*"
        onChange={onPickFile} style={{display:"none"}}/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div onClick={()=>cameraInputRef.current.click()} style={{background:LC.s2,border:`1px solid ${LC.bor}`,borderRadius:10,padding:"16px",textAlign:"center",cursor:"pointer"}}>
          <div style={{fontSize:24}}>📷</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:LC.navy,marginTop:4}}>Tomar foto/video</div>
        </div>
        <div onClick={()=>fileInputRef.current.click()} style={{background:LC.s2,border:`1px solid ${LC.bor}`,borderRadius:10,padding:"16px",textAlign:"center",cursor:"pointer"}}>
          <div style={{fontSize:24}}>📁</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:LC.navy,marginTop:4}}>Elegir archivo</div>
        </div>
      </div>

      <div style={{fontFamily:"monospace",fontSize:10,color:LC.t3,textAlign:"center"}}>
        Formatos aceptados: cualquier tipo · Máx. según tu navegador
      </div>
    </div>
  );
}
/* ══════════════════════════════════════════════════
   SERVICIOS AWS — botones que abren la consola real
══════════════════════════════════════════════════ */
const AWS_LINKS = {
  "Amazon S3":    "https://s3.console.aws.amazon.com/s3/home",
  "Amazon EC2":   "https://console.aws.amazon.com/ec2/v2/home",
  "Amazon RDS":   "https://console.aws.amazon.com/rds/home",
  "AWS Backup":   "https://console.aws.amazon.com/backup/home",
  "CloudFront":   "https://console.aws.amazon.com/cloudfront/v4/home",
  "IAM / Cognito":"https://console.aws.amazon.com/iamv2/home",
  "CloudWatch":   "https://console.aws.amazon.com/cloudwatch/home",
  "Amazon VPC":   "https://console.aws.amazon.com/vpc/home",
};

const AWS_SVCS = [
  {name:"Amazon S3",    icon:"🪣",st:"ok",  r:"us-east-1",detail:"3 buckets · 8.4 TB · Versioning ON · SSE-S3"},
  {name:"Amazon EC2",   icon:"🖥", st:"ok",  r:"us-east-1",detail:"4× t3.medium · Auto Scaling · ALB activo"},
  {name:"Amazon RDS",   icon:"🗄", st:"ok",  r:"us-east-1",detail:"MySQL 8.0 · Multi-AZ · 100 GB gp3 SSD"},
  {name:"AWS Backup",   icon:"🔄", st:"warn",r:"us-east-1",detail:"2 alertas · Planes diario/semanal/mensual"},
  {name:"CloudFront",   icon:"🌐", st:"ok",  r:"Global",   detail:"12 distribuciones · WAF · SSL/TLS activo"},
  {name:"IAM / Cognito",icon:"🔐", st:"ok",  r:"Global",   detail:"3 grupos de roles · MFA activo · CloudTrail"},
  {name:"CloudWatch",   icon:"📡", st:"ok",  r:"us-east-1",detail:"15+ métricas · Alarmas SNS configuradas"},
  {name:"Amazon VPC",   icon:"🔒", st:"ok",  r:"us-east-1",detail:"2 AZs · Subnets púb/priv · NAT Gateway"},
];

function AwsServicesPage({toast}){
  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,letterSpacing:-0.5,marginBottom:4}}>Servicios AWS</div>
      <div style={{fontSize:11,color:C.t2,marginBottom:6}}>Estado en tiempo real · Haz clic en <b>Consola →</b> para abrir la consola real de AWS.</div>
      <div style={{background:`${C.yel}12`,border:`1px solid ${C.yel}44`,borderRadius:9,padding:"10px 14px",marginBottom:18,fontFamily:"monospace",fontSize:11,color:C.yel}}>
        ⚠ Para que los botones abran la consola real: debes estar <b>logueado en console.aws.amazon.com</b> en otra pestaña del mismo navegador.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
        {AWS_SVCS.map(s=>(
          <div key={s.name} style={{background:C.sur,border:`1px solid ${s.st==="warn"?"rgba(245,158,11,.35)":C.bor}`,borderRadius:12,padding:"16px 18px",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:40,height:40,borderRadius:9,background:C.awG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"monospace",fontSize:12,fontWeight:600,color:C.aws,marginBottom:3}}>{s.name}</div>
              <div style={{fontSize:11,color:C.t2,marginBottom:5}}>{s.detail}</div>
              <div style={{display:"flex",gap:7,alignItems:"center"}}>
                <Blink color={s.st==="ok"?C.grn:C.yel}/>
                <span style={{fontFamily:"monospace",fontSize:9,color:s.st==="ok"?C.grn:C.yel}}>{s.st==="ok"?"Operativo":"2 alertas"}</span>
                <span style={{fontFamily:"monospace",fontSize:9,color:C.t3}}>· {s.r}</span>
              </div>
            </div>
            <a href={AWS_LINKS[s.name]||"https://console.aws.amazon.com"} target="_blank" rel="noreferrer"
              style={{background:`${C.b2}18`,border:`1px solid ${C.b2}44`,borderRadius:8,padding:"7px 14px",
                color:C.b2,fontSize:11,fontFamily:"monospace",fontWeight:700,textDecoration:"none",
                display:"inline-flex",alignItems:"center",gap:4,whiteSpace:"nowrap"}}>
              Consola →
            </a>
          </div>
        ))}
      </div>

      {/* Instrucciones para conectar cuenta real */}
      <div style={{marginTop:20,background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,padding:"18px 20px"}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,marginBottom:12,color:C.aws}}>🔑 Cómo conectar tu cuenta real de AWS</div>
        {[
          ["1","Ve a console.aws.amazon.com e inicia sesión con tu cuenta AWS."],
          ["2","Abre IAM → Users → Create user → Nombre: usuario-institutocloudcorp → Attach: AmazonS3FullAccess"],
          ["3","Security credentials → Create access key → Application outside AWS → Copiar AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY"],
          ["4","En la VM Ubuntu: sudo nano /var/www/cloudcorp/.env — y pega las claves"],
          ["5","Ahora los botones 'Consola →' te llevan directo al servicio dentro de tu cuenta."],
        ].map(([n,t])=>(
          <div key={n} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,color:"white"}}>{n}</div>
            <div style={{fontSize:12,color:C.t2,lineHeight:1.5}}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PÁGINAS
══════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════
   DASHBOARD — REDISEÑO MODERNO Y LIMPIO
══════════════════════════════════════════════════ */
function DashboardPage({ me, toast, onNav, logVersion }) {
  const T = theme(me.role);
  const tick = useTick(1200);

  // Colores dinámicos vinculados a la paleta actual (evita usar 'C' hardcodeado)
  const [jobs, setJobs] = useState([
    { id: 1, name: "S3 — Media Bucket", pct: 100, color: T.grn, label: "Completado" },
    { id: 2, name: "RDS — DB Comercial", pct: 72, color: T.navy || T.blue, label: "En progreso", a: true },
    { id: 3, name: "EBS — Volumen EC2", pct: 28, color: T.yel || T.aws, label: "En cola", a: true, slow: true },
  ]);

  useEffect(() => {
    setJobs(j => j.map(x => x.a && x.pct < 100 ? { ...x, pct: Math.min(100, x.pct + (x.slow ? 0.4 : 0.9)) } : x));
  }, [tick]);

  const myUploads = UPLOAD_LOG.filter(l => l.uid === me.id);
  const totalAll = UPLOAD_LOG.length;

  // Métricas según el rol
  const stats = me.role === "admin" ? [
    { label: "Total Subidas", val: totalAll, icon: "☁️", color: T.navy || T.blue },
    { label: "Usuarios Activos", val: INIT_USERS.filter(u => u.status === "active").length, icon: "👥", color: T.grn },
    { label: "Equipos Conectados", val: [...new Set(UPLOAD_LOG.map(l => l.equipo))].length, icon: "🖥️", color: T.yel },
    { label: "Storage Total", val: "8.4 TB", icon: "🪣", color: T.pur },
  ] : me.role === "docente" ? [
    { label: "Mis Subidas", val: myUploads.length, icon: "📤", color: T.navy },
    { label: "Documentos", val: myUploads.filter(l => l.tipo === "documento").length, icon: "📄", color: T.grn },
    { label: "Alumnos Activos", val: INIT_USERS.filter(u => u.role === "alumno" && u.status === "active").length, icon: "🎓", color: T.cyn },
    { label: "Mi Equipo", val: me.equipo, icon: "🖥️", color: T.pur },
  ] : [
    { label: "Mis Subidas", val: myUploads.length, icon: "📤", color: T.navy },
    { label: "Fotos", val: myUploads.filter(l => l.tipo === "foto").length, icon: "📷", color: T.pnk },
    { label: "Videos", val: myUploads.filter(l => l.tipo === "video").length, icon: "🎬", color: T.pur },
    { label: "Mi Equipo", val: me.equipo, icon: "🖥️", color: T.cyn },
  ];

  return (
    <div style={{ color: T.txt, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* ENCABEZADO Y SALUDO LIMPIO */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: T.txt, letterSpacing: "-0.5px" }}>
            {me.role === "admin" ? "Panel de Control 🛡️" : me.role === "docente" ? "Bienvenido, " + (me.name.split(" ")[1] || me.name) + " 📚" : "Mi Portal Estudiantil 🎓"}
          </div>
          <div style={{ fontSize: 13, color: T.t2, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ background: T.s2, padding: "4px 12px", borderRadius: 20, fontWeight: 600, fontSize: 12, color: T.txt }}>
              {ROLE[me.role].icon} {ROLE[me.role].label}
            </span>
            <span style={{ color: T.t2, fontWeight: 500 }}>{me.equipo}</span>
            {me.role === "admin" && (
              <>
                <span style={{ color: T.t3 }}>•</span>
                <span style={{ color: T.t3, fontFamily: "monospace", fontSize: 11 }}>{me.ip}</span>
                <span style={{ background: "rgba(245,158,11,0.12)", color: T.yel, fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                  AWS S3 · us-east-1
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: T.sur,
            border: `1px solid ${T.bor}`,
            borderRadius: 16,
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            position: "relative",
            overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.t2, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: T.txt, letterSpacing: "-0.5px" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* GRÁFICO PRINCIPAL */}
      <div style={{ marginBottom: 24, background: T.sur, border: `1px solid ${T.bor}`, borderRadius: 16, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
        <UploadChart
        logs={me.role==="docente" ? UPLOAD_LOG.filter(l=>alumnosDeDocente(me.id).map(a=>a.id).includes(l.uid)) : UPLOAD_LOG}hideEquipo={me.role==="alumno"}key={logVersion}/>
      </div>

      {/* SECCIÓN SOLO PARA ADMIN (JOBS Y ALERTAS AWS) */}
      {me.role === "admin" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          
          {/* JOBS DE BACKUP */}
          <div style={{ background: T.sur, border: `1px solid ${T.bor}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.bor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, display: "flex", gap: 8, alignItems: "center" }}>
                Jobs de Backup
                <span style={{ background: "rgba(245,158,11,0.15)", color: T.yel, fontSize: 10, padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>AWS</span>
              </div>
              <span onClick={() => toast("Nuevo job iniciado en AWS Backup ✓", "success")} style={{ fontSize: 12, color: T.navy || T.blue, cursor: "pointer", fontWeight: 600 }}>
                + Nuevo job
              </span>
            </div>
            <div style={{ padding: "20px" }}>
              {jobs.map(j => (
                <div key={j.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                    <span style={{ fontWeight: 600 }}>{j.name}</span>
                    <span style={{ fontSize: 11, color: T.t2, fontWeight: 500 }}>{j.label}</span>
                  </div>
                  <div style={{ height: 6, background: T.s2, borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${j.pct}%`, background: j.color, borderRadius: 99, transition: "width .7s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ALERTAS & EVENTOS */}
          <div style={{ background: T.sur, border: `1px solid ${T.bor}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.bor}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Alertas & Eventos</span>
              <span onClick={() => toast("Todas las alertas marcadas como leídas", "success")} style={{ fontSize: 12, color: T.navy || T.blue, cursor: "pointer", fontWeight: 600 }}>
                Marcar todo
              </span>
            </div>
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "🔴", title: "Backup Glacier falló", msg: "Timeout al conectar. Revisar permisos IAM.", time: "hace 18 min", bg: "rgba(239,68,68,0.05)", border: "rgba(239,68,68,0.2)" },
                { icon: "🟡", title: "S3 Bucket near limit", msg: "El bucket multimedia al 87% de capacidad.", time: "hace 1 h", bg: "rgba(245,158,11,0.05)", border: "rgba(245,158,11,0.2)" },
                { icon: "🟢", title: "RDS Snapshot OK", msg: "Backup automático DB Comercial ejecutado.", time: "hace 3 h", bg: "rgba(16,185,129,0.05)", border: "rgba(16,185,129,0.2)" },
              ].map(a => (
                <div key={a.title} style={{ display: "flex", gap: 12, padding: "12px", borderRadius: 10, background: a.bg, border: `1px solid ${a.border}`, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: T.t2, lineHeight: 1.4 }}>{a.msg}</div>
                    <div style={{ fontSize: 10, color: T.t3, marginTop: 4, fontWeight: 500 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SECCIÓN DOCENTE / ALUMNO (ÚLTIMA ENTREGA Y SUBIDA) */}
      {me.role !== "admin" && (
        <div style={{
          background: T.sur,
          border: `1px solid ${T.bor}`,
          borderRadius: 16,
          padding: "36px 24px",
          textAlign: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: T.txt, letterSpacing: "-0.5px" }}>
            {myUploads.length > 0 ? "Última entrega registrada" : "¿Listo para subir tu tarea?"}
          </div>
          <div style={{ fontSize: 13, color: T.t2, marginBottom: 16, maxWidth: 420, margin: "0 auto 16px" }}>
            {myUploads.length > 0 
              ? "Tu archivo fue procesado y guardado correctamente en la intranet." 
              : "Sube tus documentos o materiales docentes de forma rápida y segura."}
          </div>
          {myUploads.length > 0 && (
            <div style={{ marginBottom: 20, display: "inline-block" }}>
              <SubmissionBadge status="enviado" ts={myUploads[0].ts.slice(11)} />
            </div>
          )}
          <div>
            <Btn onClick={() => onNav("Subir Archivos")} color={T.navy}>
              📤 Ir a Subir Archivos
            </Btn>
          </div>
        </div>
      )}

    </div>
  );
}
/* USUARIOS (solo admin) */
function UsersPage({me,toast,onRefresh}){
  const [users,setUsers]=useState([...INIT_USERS]);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({name:"",email:"",pass:"",role:"alumno",equipo:"PC-Alumno-0X",ip:"192.168.2.X",cursos:[1]});

  const save=()=>{
    if(!form.name||!form.email||!form.pass){toast("Completa todos los campos","error");return;}
    if(modal==="new"){
      const u={id:Date.now(),...form,avatar:form.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),status:"active"};
      setUsers(p=>[...p,u]);INIT_USERS.push(u);
      toast(`Usuario "${form.name}" creado. Puede ingresar con ${form.email}`,"success");
    }else{
      setUsers(p=>p.map(u=>u.id===modal.id?{...u,...form}:u));
      const idx=INIT_USERS.findIndex(u=>u.id===modal.id);
      if(idx>=0)INIT_USERS[idx]={...INIT_USERS[idx],...form};
      toast("Usuario actualizado","success");
    }
    setModal(null);onRefresh&&onRefresh();
  };

  const toggle=u=>{
    if(u.id===me.id){toast("No puedes modificar tu propia cuenta","error");return;}
    setUsers(p=>p.map(x=>x.id===u.id?{...x,status:x.status==="active"?"inactive":"active"}:x));
    toast(`Usuario ${u.status==="active"?"desactivado":"activado"}`,"warning");
  };

  const del=u=>{
    if(u.id===me.id){toast("No puedes eliminarte","error");return;}
    setUsers(p=>p.filter(x=>x.id!==u.id));
    toast(`Usuario "${u.name}" eliminado`,"warning");
  };
  {(form.role==="alumno"||form.role==="docente") && (
  <Field label="Curso asignado" value={String(form.curso)} onChange={v=>setForm(p=>({...p,curso:Number(v)}))}
  opts={COURSES.map(c=>String(c.id))}/>
  )}
  {(form.role==="alumno"||form.role==="docente") && (
  <Field label="Curso asignado" value={String(form.curso)} onChange={v=>setForm(p=>({...p,curso:Number(v)}))}
  opts={COURSES.map(c=>String(c.id))}/>
  )}
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,letterSpacing:-0.5}}>Gestión de Usuarios</div>
          <div style={{fontSize:11,color:C.t2,marginTop:2}}>{users.length} usuarios · {byRole.docente.length} docentes · {byRole.alumno.length} alumnos</div>
        </div>
        <Btn onClick={()=>{setForm({name:"",email:"",pass:"",role:"alumno",equipo:"PC-Alumno-0X",ip:"192.168.2.X"});setModal("new");}} color={C.blue}>+ Crear Usuario</Btn>
      </div>
      <div style={{background:`${C.grn}10`,border:`1px solid ${C.grn}44`,borderRadius:9,padding:"10px 14px",marginBottom:18,fontFamily:"monospace",fontSize:11,color:C.grn}}>
        ℹ Solo el Administrador puede crear accesos. Los alumnos no pueden registrarse solos.
        {PASSWORD_REQUESTS.filter(r=>!r.resuelto).length>0 && (
          <div style={{background:`${C.yel}10`,border:`1px solid ${C.yel}44`,borderRadius:10,padding:"14px 18px",marginBottom:18}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:800,color:C.yel,marginBottom:10}}>
              🔑 Solicitudes de recuperación de contraseña ({PASSWORD_REQUESTS.filter(r=>!r.resuelto).length})
            </div>
            {PASSWORD_REQUESTS.filter(r=>!r.resuelto).map(r=>(
              <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.bor}`}}>
                <div>
                  <div style={{fontSize:12,fontWeight:600,fontFamily:"monospace"}}>{r.email}</div>
                  <div style={{fontSize:9,color:C.t3,fontFamily:"monospace"}}>{r.ts}</div>
                </div>
                <Btn onClick={()=>{
                  const u = users.find(x=>x.email===r.email);
                  if(u){ setForm({name:u.name,email:u.email,pass:u.pass,role:u.role,equipo:u.equipo,ip:u.ip,curso:u.curso||1}); setModal(u); }
                  resolvePasswordRequest(r.id);
                  toast(`Marcado como atendido. Cambia la contraseña de ${r.email} en el formulario.`,"success");
                }} color={C.yel} small>Atender y editar</Btn>
              </div>
            ))}
          </div>
        )}
      </div>

      {["admin","docente","alumno"].map(role=>(
        <div key={role} style={{marginBottom:20}}>
          <div style={{fontFamily:"monospace",fontSize:9,color:C.t3,textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>
            {ROLE[role].icon} {ROLE[role].label}s — {byRole[role].length}
          </div>
          <div style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Usuario","Equipo / IP","Estado","Acciones"].map(h=>(
                <th key={h} style={{textAlign:"left",fontFamily:"monospace",fontSize:8,textTransform:"uppercase",letterSpacing:1.5,color:C.t3,padding:"10px 16px",borderBottom:`1px solid ${C.bor}`}}>{h}</th>
              ))}</tr></thead>
              <tbody>{byRole[role].map(u=>(
                <tr key={u.id} style={{borderBottom:`1px solid ${C.bor}`}}>
                  <td style={{padding:"11px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${ROLE[role].color}88,${ROLE[role].color})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{u.avatar}</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>{u.name}</div>
                        <div style={{fontFamily:"monospace",fontSize:9,color:C.t3}}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"11px 16px"}}>
                    <div style={{fontFamily:"monospace",fontSize:10,color:C.cyn}}>{u.equipo}</div>
                    <div style={{fontFamily:"monospace",fontSize:9,color:C.t3}}>{u.ip}</div>
                  </td>
                  <td style={{padding:"11px 16px"}}>{pill(u.status==="active"?C.grn:C.red,u.status==="active"?"Activo":"Inactivo")}</td>
                  <td style={{padding:"11px 16px"}}>
                    <div style={{display:"flex",gap:6}}>
                      <Btn onClick={()=>{setForm({name:u.name,email:u.email,pass:u.pass,role:u.role,equipo:u.equipo,ip:u.ip});setModal(u);}} color={C.b2} small ghost>Editar</Btn>
                      <Btn onClick={()=>toggle(u)} color={C.yel} small ghost>{u.status==="active"?"Suspender":"Activar"}</Btn>
                      {u.id!==me.id&&<Btn onClick={()=>del(u)} color={C.red} small ghost>Eliminar</Btn>}
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      ))}

      {modal&&(
        <Modal title={modal==="new"?"Crear Usuario":`Editar: ${modal.name||""}`} onClose={()=>setModal(null)}>
          <Field label="Nombre completo" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} ph="Ej. Juan Pérez"/>
          <Field label="Correo institucional" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))} ph="usuario@institutocloudcorp.edu.pe"/>
          <Field label="Contraseña" value={form.pass} onChange={v=>setForm(p=>({...p,pass:v}))} type="password" ph="Mínimo 8 caracteres"/>
          <Field label="Rol" value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} opts={["admin","docente","alumno"]}/>

{form.role==="alumno" && (
  <div style={{marginBottom:14}}>
    <label style={{display:"block",fontFamily:"monospace",fontSize:9,color:C.t3,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Cursos asignados</label>
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {COURSES.map(c=>(
        <label key={c.id} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:12,color:C.txt}}>
          <input type="checkbox" checked={form.cursos?.includes(c.id)||false}
            onChange={e=>{
              setForm(p=>{
                const actuales = p.cursos||[];
                const nuevos = e.target.checked ? [...actuales,c.id] : actuales.filter(id=>id!==c.id);
                return {...p, cursos:nuevos};
              });
            }}/>
          {c.nombre}
        </label>
      ))}
    </div>
  </div>
)}
          <Field label="Rol" value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} opts={["admin","docente","alumno"]}/>
          <Field label="Equipo (VM/PC)" value={form.equipo} onChange={v=>setForm(p=>({...p,equipo:v}))} ph="PC-Alumno-04"/>
          <Field label="Dirección IP (VirtualBox)" value={form.ip} onChange={v=>setForm(p=>({...p,ip:v}))} ph="192.168.2.X"/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <button onClick={()=>setModal(null)} style={{background:C.bor2,border:"none",borderRadius:8,padding:"9px 18px",color:C.t2,fontSize:13,cursor:"pointer",fontFamily:"monospace"}}>Cancelar</button>
            <Btn onClick={save} color={C.blue}>{modal==="new"?"Crear Acceso":"Guardar"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* MONITOR ARCHIVOS (admin) */
function MonitorPage({ toast, logVersion }) {
  const [logs, setLogs] = useState([...UPLOAD_LOG]);
  const [filter, setFilter] = useState("all");
  const tick = useTick(4000);

  useEffect(() => {
    setLogs([...UPLOAD_LOG]);
  }, [tick, logVersion]);

  const filtered = filter === "all" ? logs : logs.filter(l => l.role === filter || l.tipo === filter);
  const roleColor = { admin: C.aws, docente: C.b2, alumno: C.grn };
  const tipoFt = (t) => FILE_TYPES.find(f => f.id === t) || { icon: "📦", color: C.t2 };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
            Monitor de Archivos
            <span style={{ fontFamily: "monospace", fontSize: 9, color: C.t3, marginLeft: 10, fontWeight: 400 }}>TIEMPO REAL</span>
          </div>
          <div style={{ fontSize: 11, color: C.t2, marginTop: 2 }}>Registro de todas las subidas · por equipo e IP</div>
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
          {["all", "admin", "docente", "alumno", "foto", "video", "documento", "audio"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                background: filter === f ? C.blue : `${C.bor2}60`, border: `1px solid ${filter === f ? C.blue : C.bor}`,
                borderRadius: 7, padding: "4px 11px", color: filter === f ? "white" : C.t2, fontSize: 9, fontFamily: "monospace", cursor: "pointer"
              }}>
              {f === "all" ? "Todos" : f}
            </button>
          ))}
          <button onClick={() => toast("Log exportado: monitor_" + new Date().toISOString().slice(0, 10) + ".csv", "success")}
            style={{ background: `${C.aws}18`, border: `1px solid ${C.aws}44`, borderRadius: 7, padding: "4px 11px", color: C.aws, fontSize: 9, fontFamily: "monospace", cursor: "pointer" }}>
            📥 CSV
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <UploadChart logs={logs} key={logVersion} />
      </div>

      <div style={{ background: C.sur, border: `1px solid ${C.bor}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr>
              {["Timestamp", "Usuario", "Rol", "Equipo / IP", "Tipo", "Archivo", "Bucket", "Estado"].map(h => (
                <th key={h} style={{ textAlign: "left", fontFamily: "monospace", fontSize: 8, textTransform: "uppercase", letterSpacing: 1.5, color: C.t3, padding: "10px 14px", borderBottom: `1px solid ${C.bor}`, whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => {
              const ft = tipoFt(l.tipo);
              return (
                <tr key={l.id} style={{ borderBottom: `1px solid ${C.bor}`, background: i % 2 === 0 ? C.sur : "transparent" }}>
                  <td style={{ padding: "9px 14px", fontFamily: "monospace", fontSize: 9, color: C.t3, whiteSpace: "nowrap" }}>{l.ts}</td>
                  <td style={{ padding: "9px 14px", fontSize: 11, fontWeight: 600 }}>{l.name}</td>
                  <td style={{ padding: "9px 14px" }}>
                    <span style={{ background: `${roleColor[l.role] || C.t2}20`, color: roleColor[l.role] || C.t2, padding: "2px 6px", borderRadius: 4, fontSize: 10 }}>
                      {ROLE[l.role]?.icon} {ROLE[l.role]?.label || l.role}
                    </span>
                  </td>
                  <td style={{ padding: "9px 14px" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 9, color: C.cyn }}>{l.equipo}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 9, color: C.t3 }}>{l.ip}</div>
                  </td>
                  <td style={{ padding: "9px 14px" }}><FileIcon tipo={l.tipo} size={18} color={ft.color}/></td>
                  <td style={{ padding: "9px 14px", fontFamily: "monospace", fontSize: 10, color: C.txt, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.archivo}</td>
                  <td style={{ padding: "9px 14px", fontFamily: "monospace", fontSize: 9, color: C.aws }}>{l.bucket}</td>
                  <td style={{ padding: "9px 14px" }}>
                    <span style={{ background: `${C.grn}20`, color: C.grn, padding: "2px 6px", borderRadius: 4, fontSize: 10 }}>✓ OK</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* MIS ARCHIVOS (docente/alumno) */
// --- REEMPLAZAR TODA LA FUNCIÓN function MisArchivosPage({...}){...} POR ESTA (agrega T) ---
function MisArchivosPage({me,toast,logVersion}){
  const T = theme(me.role);
  const [logs,setLogs]=useState(UPLOAD_LOG.filter(l=>l.uid===me.id));
  const [preview,setPreview]=useState(null);
  const tick=useTick(3000);
  useEffect(()=>setLogs(UPLOAD_LOG.filter(l=>l.uid===me.id)),[tick,logVersion]);

  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:4,color:T.txt}}>Mi Galería de Entregas</div>
      <div style={{fontSize:11,color:T.t2,marginBottom:18}}>{logs.length} archivos enviados · puedes descargarlos cuando quieras</div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
       {logs.length>0&&<div style={{marginBottom:18}}><UploadChart logs={logs} hideEquipo/></div>}
        {logs.map(l=>{
          const ft = FILE_TYPES.find(f=>f.id===l.tipo);
          return(
            <div key={l.id} style={{background:T.sur,border:`1px solid ${T.bor}`,borderRadius:12,overflow:"hidden"}}>
              <div onClick={()=>setPreview(l)} style={{height:110,background:T.s2,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",cursor:"pointer"}}>
                {l.url && l.mime?.startsWith("image/") ? <img src={l.url} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  : <FileIcon tipo={l.tipo} size={38} color={ft?.color||T.navy}/>}
              </div>
              <div style={{padding:"10px 12px"}}>
                <div style={{fontSize:12,fontWeight:700,color:T.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.archivo}</div>
                <div style={{fontFamily:"monospace",fontSize:9,color:T.t3,marginTop:3}}>{l.size} · {l.ts}</div>
                <a href={l.url} download={l.archivo}
                  style={{display:"inline-flex",alignItems:"center",gap:5,marginTop:8,background:`${T.navy}12`,border:`1px solid ${T.navy}33`,
                    borderRadius:7,padding:"5px 11px",color:T.navy,fontFamily:"monospace",fontSize:10,fontWeight:700,textDecoration:"none"}}>
                  ⬇ Descargar
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {preview && (
        <Modal title={preview.archivo} onClose={()=>setPreview(null)} wide>
          <div style={{textAlign:"center",marginBottom:14}}>
            {preview.mime?.startsWith("image/") && <img src={preview.url} style={{maxWidth:"100%",borderRadius:10}}/>}
            {preview.mime?.startsWith("video/") && <video src={preview.url} controls style={{maxWidth:"100%",borderRadius:10}}/>}
            {preview.mime?.startsWith("audio/") && <audio src={preview.url} controls style={{width:"100%"}}/>}
            {!preview.mime?.startsWith("image/") && !preview.mime?.startsWith("video/") && !preview.mime?.startsWith("audio/") && (
              <div style={{padding:30}}><FileIcon tipo={preview.tipo} size={60} color={T.navy}/></div>
            )}
          </div>
          <a href={preview.url} download={preview.archivo}
            style={{display:"inline-flex",alignItems:"center",gap:8,background:T.navy,color:"#fff",borderRadius:8,
              padding:"10px 20px",fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,textDecoration:"none"}}>
            ⬇ Descargar archivo
          </a>
        </Modal>
      )}
    </div>
  );
}

/* SUBIR ARCHIVOS */
function SubirPage({me,toast,onRefresh}){
  const T = theme(me.role);
  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:4,color:T.txt}}>Subir Archivos</div>
      <div style={{fontSize:11,color:T.t2,marginBottom:18}}>Equipo: <span style={{color:T.cyn,fontFamily:"monospace"}}>{me.equipo}</span> · IP: <span style={{fontFamily:"monospace",color:T.t3}}>{me.ip}</span></div>
      <div style={{background:T.sur,border:`1px solid ${T.bor}`,borderRadius:13,overflow:"hidden"}}>
        <UploadBox user={me} toast={toast} onDone={onRefresh}/>
      </div>
    </div>
  );
}
/* CONFIGURACIÓN */
function ConfigPage({me,toast}){
  const [region,setRegion]=useState("us-east-1");
  const [mfa,setMfa]=useState(true);
  const [key,setKey]=useState("AKIA••••••••XXXX");
  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:20}}>Configuración</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,padding:"20px 22px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,marginBottom:14,color:C.aws}}>☁ Configuración AWS</div>
          <Field label="Access Key ID" value={key} onChange={setKey} ph="AKIA..."/>
          <Field label="Región" value={region} onChange={setRegion} opts={["us-east-1","us-west-2","eu-west-1","sa-east-1"]}/>
          <Field label="Bucket Principal" value="media-bucket-prod" onChange={()=>{}} ph="bucket-name"/>
          <Btn onClick={()=>toast("Conexión AWS verificada correctamente ✓","success")} color={C.aws}>Verificar Conexión AWS</Btn>
        </div>
        <div style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,padding:"20px 22px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,marginBottom:14}}>🔐 Seguridad IAM</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.bor}`}}>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>MFA Obligatorio</div>
              <div style={{fontSize:10,color:C.t3,fontFamily:"monospace"}}>AWS Cognito · Todos los roles</div>
            </div>
            <div onClick={()=>{setMfa(v=>!v);toast(`MFA ${mfa?"desactivado":"activado"}`,"warning");}}
              style={{width:44,height:24,borderRadius:99,background:mfa?C.grn:C.bor2,cursor:"pointer",position:"relative",transition:"background 0.3s"}}>
              <div style={{position:"absolute",top:3,left:mfa?22:3,width:18,height:18,borderRadius:"50%",background:"white",transition:"left 0.3s"}}/>
            </div>
          </div>
          <div style={{padding:"12px 0"}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>VMs en Red</div>
            {INIT_USERS.slice(0,4).map(u=>(
              <div key={u.id} style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
                <Blink color={u.status==="active"?C.grn:C.red}/>
                <span style={{fontFamily:"monospace",fontSize:9,color:C.cyn}}>{u.equipo}</span>
                <span style={{fontFamily:"monospace",fontSize:9,color:C.t3}}>{u.ip}</span>
              </div>
            ))}
          </div>
          <Btn onClick={()=>toast("Política IAM actualizada","success")} color={C.pur}>Actualizar Política IAM</Btn>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════ */
export default function App(){
  const [session,setSession]=useState(null);
  const [page,setPage]=useState("Dashboard");
  const [toastS,setToastS]=useState(null);
  const [logVer,setLogVer]=useState(0);
  const [ready,setReady]=useState(false);
  

  useEffect(()=>{
    loadUploads();
    loadGroupFiles();
    loadPwRequests();
    loadTasks();
    const s = localStorage.getItem("session_id");
    const p = localStorage.getItem("current_page");
    if(s){
      const u = INIT_USERS.find(x=>x.id===Number(s));
      if(u) setSession(u);
    }
    if(p) setPage(p);
    setLogVer(v=>v+1);
    setReady(true);
  },[]);

  const toast=(msg,type="info")=>setToastS({msg,type,k:Date.now()});
  const refresh=()=>setLogVer(v=>v+1);

  const logout=()=>{
    setSession(null);setPage("Dashboard");
    localStorage.removeItem("session_id");
  };

  const doLogin = (u) => {
    setSession(u); setPage("Dashboard");
    localStorage.setItem("session_id", String(u.id));
    localStorage.setItem("current_page", "Dashboard");
  };

  const goPage = (p) => {
    setPage(p);
    localStorage.setItem("current_page", p);
  };

  if(!ready) return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.t2,fontFamily:"monospace"}}>Cargando...</div>;
  if(!session) return <LoginPage onLogin={doLogin}/>;

  const nav=ROLE[session.role]?.nav||["Dashboard"];
  const rc=ROLE[session.role]?.color||C.t2;
  const T = theme(session.role);

  const renderPage=()=>{
    switch(page){
      case "Dashboard":        return <DashboardPage me={session} toast={toast} onNav={goPage} logVersion={logVer}/>;
      case "Usuarios":         return <UsersPage me={session} toast={toast} onRefresh={refresh}/>;
      case "Monitor Archivos": return <MonitorPage toast={toast} logVersion={logVer}/>;
      case "Subir Archivos":   return <SubirPage me={session} toast={toast} onRefresh={refresh}/>;
      case "Mis Archivos":     return <MisArchivosPage me={session} toast={toast} logVersion={logVer}/>;
      case "Servicios AWS":    return <AwsServicesPage toast={toast}/>;
      case "Configuración":    return <ConfigPage me={session} toast={toast}/>;
      case "Mis Alumnos" :     return <StudentsRosterPage toast={toast} me={session}/>;
      case "Revisar Entregas": return <RevisionEntregasPage toast={toast} logVersion={logVer} me={session}/>;
      case "Mis Cursos":       return <MisCursosPage me={session} toast={toast}/>;
      case "Grupos":           return <GruposPage me={session} toast={toast}/>;
      case "Tareas":           return <TareasPage me={session} toast={toast} taskVersion={logVer} onRefresh={refresh}/>;
      default:                 return <DashboardPage me={session} toast={toast} onNav={goPage} logVersion={logVer}/>;
    }
  };

  return(
    <div style={{display:"flex",height:"100vh",background:T.bg,color:T.txt,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1c2d50;border-radius:99px}
        input,select,textarea,button{font-family:inherit;}
        body{font-family:'IBM Plex Mono',monospace;}
      `}</style>

      <aside style={{width:240,background:T.sur,borderRight:`1px solid ${T.bor}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"18px 16px 12px",borderBottom:`1px solid ${C.bor}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <Logo size={38}/>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,letterSpacing:-0.5,lineHeight:1.2,color:C.txt}}>Instituto<br/><span style={{color:C.b2}}>CloudCorp</span></div>
            </div>
          </div>
          <div style={{fontFamily:"monospace",fontSize:8,color:C.t3,textTransform:"uppercase",letterSpacing:1.5}}>Plataforma Educativa B2E · AWS</div>
          <div style={{marginTop:9,display:"flex",alignItems:"center",gap:6,background:"rgba(255,153,0,0.07)",border:"1px solid rgba(255,153,0,0.2)",borderRadius:6,padding:"5px 9px"}}>
            <Blink color={C.grn}/><span style={{fontFamily:"monospace",fontSize:8,color:C.aws}}>AWS S3 · us-east-1 · Online</span>
          </div>
        </div>

        <div style={{margin:"10px 12px",background:`${rc}14`,border:`1px solid ${rc}33`,borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>{ROLE[session.role]?.icon}</span>
          <div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:800,color:rc}}>{ROLE[session.role]?.label}</div>
            <div style={{fontFamily:"monospace",fontSize:8,color:C.t3}}>{session.equipo} · {session.ip}</div>
          </div>
        </div>

        <nav style={{flex:1,overflowY:"auto",padding:"8px 10px"}}>
          {nav.map(item=>{
            const active=item===page;
            const icons={"Dashboard":"⬡","Usuarios":"👥","Monitor Archivos":"📊","Subir Archivos":"📤","Mis Archivos":"📁","Servicios AWS":"☁","Configuración":"⚙","Mis Alumnos":"🧑‍🎓","Revisar Entregas":"🗂","Tareas":"📝","Mis Cursos":"🏫","Grupos":"👨‍👩‍👧‍👦"};
            return(
              <div key={item} onClick={()=>goPage(item)}
                style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:8,cursor:"pointer",marginBottom:2,
                  background:active?`${rc}18`:"transparent",border:active?`1px solid ${rc}35`:"1px solid transparent",
                  color:active?rc:C.t2,transition:"all 0.15s"}}
                onMouseEnter={e=>!active&&(e.currentTarget.style.background=C.s2)}
                onMouseLeave={e=>!active&&(e.currentTarget.style.background="transparent")}>
                <span style={{fontSize:14,minWidth:20,textAlign:"center"}}>{icons[item]||"○"}</span>
                <span style={{fontSize:12.5,fontWeight:500}}>{item}</span>
              </div>
            );
          })}
        </nav>

        <div style={{padding:"12px 13px",borderTop:`1px solid ${C.bor}`,display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${rc}77,${rc})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{session.avatar}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session.name.split(" ")[0]}</div>
            <div style={{fontFamily:"monospace",fontSize:8,color:rc,textTransform:"uppercase",letterSpacing:1}}>{ROLE[session.role]?.label}</div>
          </div>
          <button onClick={logout} title="Cerrar sesión" style={{background:`${C.red}18`,border:`1px solid ${C.red}44`,borderRadius:7,padding:"5px 9px",color:C.red,fontSize:13,cursor:"pointer",lineHeight:1}}>⏻</button>
        </div>
      </aside>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <header style={{background:T.sur,borderBottom:`1px solid ${T.bor}`,height:54,display:"flex",alignItems:"center",gap:12,padding:"0 22px",flexShrink:0}}>
          <div style={{flex:1,fontFamily:"monospace",fontSize:10,color:C.t3}}>Instituto CloudCorp / <span style={{color:rc}}>{page}</span></div>
          <div style={{display:"flex",alignItems:"center",background:C.bg,border:`1px solid ${C.bor2}`,borderRadius:7,padding:"6px 11px",gap:7,width:200}}>
            <span style={{color:C.t3}}>🔍</span>
            <input placeholder="Buscar..." style={{background:"none",border:"none",outline:"none",color:C.txt,fontSize:11,fontFamily:"monospace",width:"100%"}}/>
          </div>
          <div onClick={()=>toast("Sin nuevas notificaciones","info")} style={{width:32,height:32,borderRadius:7,border:`1px solid ${C.bor2}`,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",position:"relative"}}>
            🔔<span style={{position:"absolute",top:4,right:4,width:6,height:6,background:C.red,borderRadius:"50%",border:`1.5px solid ${C.sur}`}}/>
          </div>
          <div style={{background:`${rc}18`,border:`1px solid ${rc}44`,borderRadius:8,padding:"5px 12px",fontFamily:"monospace",fontSize:9,color:rc}}>
            {ROLE[session.role]?.icon} {session.equipo}
          </div>
        </header>
        <main style={{flex:1,overflowY:"auto",padding:"22px 26px"}}>{renderPage()}<div style={{height:28}}/></main>
      </div>

      {toastS&&<Toast key={toastS.k} msg={toastS.msg} type={toastS.type} onDone={()=>setToastS(null)}/>}
    </div>
  );
}