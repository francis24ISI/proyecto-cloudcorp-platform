import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   DATOS / BASE DE USUARIOS
═══════════════════════════════════════════════════════════════ */
const INITIAL_USERS = [
  { id:1, name:"Carlos Mendoza",   email:"admin@institutocloudcorp.edu.pe",   password:"Admin2024!",  role:"admin",    avatar:"CM", dept:"Dirección TI",       status:"active", joined:"2023-03-01" },
  { id:2, name:"Ana Quispe",       email:"ana.quispe@institutocloudcorp.edu.pe", password:"Emp2024!", role:"empleado", avatar:"AQ", dept:"Gestión Comercial",   status:"active", joined:"2023-06-15" },
  { id:3, name:"Luis Flores",      email:"luis.flores@institutocloudcorp.edu.pe",password:"Emp2024!", role:"empleado", avatar:"LF", dept:"Backup & Multimedia", status:"active", joined:"2024-01-10" },
  { id:4, name:"María Torres",     email:"m.torres@institutocloudcorp.edu.pe",  password:"User2024!",role:"usuario",  avatar:"MT", dept:"Docentes",            status:"active", joined:"2024-02-20" },
  { id:5, name:"Pedro Ríos",       email:"p.rios@institutocloudcorp.edu.pe",    password:"User2024!",role:"usuario",  avatar:"PR", dept:"Alumnos",             status:"inactive",joined:"2024-03-05" },
];

const ROLE_COLORS  = { admin:"#ff9900", empleado:"#3b82f6", usuario:"#10b981" };
const ROLE_LABELS  = { admin:"Administrador", empleado:"Empleado", usuario:"Usuario" };
const ROLE_ICONS   = { admin:"🛡", empleado:"🖥", usuario:"👤" };
const DEPT_OPTIONS = ["Dirección TI","Gestión Comercial","Backup & Multimedia","Docentes","Alumnos","Administración","Infraestructura AWS"];

const BACKUP_JOBS_DATA = [
  { id:1, name:"S3 — Media Bucket",   size:"8.3 GB",  pct:100, color:"#10b981", label:"Completado", time:"Hoy 06:00"  },
  { id:2, name:"RDS — DB Comercial",  size:"2.1 GB",  pct:72,  color:"#3b82f6", label:"En progreso",time:"Hoy 09:30", animate:true },
  { id:3, name:"EBS — Volumen EC2",   size:"512 GB",  pct:28,  color:"#ff9900", label:"En cola",    time:"Pendiente",  animate:true, slow:true },
  { id:4, name:"S3 — Documentos",     size:"1.5 GB",  pct:100, color:"#10b981", label:"Completado", time:"Hoy 05:00"  },
  { id:5, name:"Glacier — Histórico", size:"24 GB",   pct:45,  color:"#ef4444", label:"⚠ Fallido",  time:"Hoy 07:15"  },
];

const CLIENTS_DATA = [
  { id:1, name:"Instituto TechPeru",      plan:"Enterprise", status:"active",  mrr:"$480", since:"2023-01" },
  { id:2, name:"Colegio San Marcos",      plan:"Pro",        status:"active",  mrr:"$220", since:"2023-04" },
  { id:3, name:"UGEL Madre de Dios",      plan:"Basic",      status:"active",  mrr:"$95",  since:"2023-08" },
  { id:4, name:"Academia Digital Norte",  plan:"Pro",        status:"inactive",mrr:"$220", since:"2022-11" },
  { id:5, name:"Centro Cómputo Iquitos",  plan:"Enterprise", status:"active",  mrr:"$480", since:"2024-01" },
];

const MEDIA_FILES = [
  { id:1, name:"Presentacion_Cloud_2025.pptx", size:"12.4 MB", type:"📊", bucket:"media-bucket-prod", uploaded:"Hoy 08:15", by:"Ana Quispe"   },
  { id:2, name:"Backup_Manual_Marzo.zip",       size:"3.2 GB",  type:"📦", bucket:"backups-bucket",    uploaded:"Hoy 07:00", by:"Luis Flores"  },
  { id:3, name:"Video_Capacitacion_AWS.mp4",    size:"820 MB",  type:"🎬", bucket:"media-bucket-prod", uploaded:"Ayer",      by:"Carlos Mendoza"},
  { id:4, name:"Politica_IAM_v3.pdf",           size:"890 KB",  type:"📄", bucket:"docs-bucket",       uploaded:"Ayer",      by:"Carlos Mendoza"},
  { id:5, name:"Foto_Evento_2025.jpg",          size:"4.1 MB",  type:"🖼", bucket:"media-bucket-prod", uploaded:"22/05",     by:"María Torres"  },
];

const NAV_BY_ROLE = {
  admin:    ["Dashboard","Usuarios","Clientes & CRM","Backup & Jobs","Archivos S3","Servicios AWS","Reportes","Configuración"],
  empleado: ["Dashboard","Clientes & CRM","Backup & Jobs","Archivos S3","Reportes"],
  usuario:  ["Dashboard","Archivos S3","Reportes"],
};

const NAV_ICONS = {
  "Dashboard":"⬡","Usuarios":"👥","Clientes & CRM":"🗂","Backup & Jobs":"🔄",
  "Archivos S3":"📁","Servicios AWS":"☁","Reportes":"📊","Configuración":"⚙",
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS / TOKENS
═══════════════════════════════════════════════════════════════ */
const C = {
  bg:"#070b13",surface:"#0d1220",surface2:"#111827",
  border:"#172035",border2:"#1e2d4a",
  accent:"#1d4ed8",accent2:"#3b82f6",
  aws:"#ff9900",awsGlow:"rgba(255,153,0,0.14)",
  green:"#10b981",red:"#ef4444",yellow:"#f59e0b",purple:"#7c3aed",cyan:"#06b6d4",
  text:"#f0f4ff",text2:"#8899bb",text3:"#3d5070",
};

const pill = (color,text) => ({
  display:"inline-flex",alignItems:"center",gap:4,
  padding:"2px 10px",borderRadius:99,fontSize:10,fontFamily:"monospace",
  background:`${color}20`,color,border:`1px solid ${color}44`,
});

function useTick(ms){ const [t,setT]=useState(0); useEffect(()=>{const id=setInterval(()=>setT(x=>x+1),ms);return()=>clearInterval(id);},[ms]); return t; }

function Blink({color=C.green}){
  const [on,setOn]=useState(true);
  useEffect(()=>{const id=setInterval(()=>setOn(v=>!v),900);return()=>clearInterval(id);},[]);
  return <span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:color,opacity:on?1:0.2,transition:"opacity 0.4s",flexShrink:0}}/>;
}

/* ═══════════════════════════════════════════════════════════════
   LOGO SVG — Instituto CloudCorp
═══════════════════════════════════════════════════════════════ */
function InstituteLogo({size=42}){
  return(
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" rx="16" fill="url(#lgd)"/>
      {/* Building */}
      <rect x="16" y="38" width="48" height="28" rx="2" fill="white" opacity="0.15"/>
      <rect x="22" y="32" width="36" height="6" rx="1" fill="white" opacity="0.25"/>
      <rect x="28" y="24" width="24" height="8" rx="1" fill="white" opacity="0.2"/>
      {/* Cloud */}
      <ellipse cx="40" cy="22" rx="14" ry="8" fill="white" opacity="0.9"/>
      <ellipse cx="30" cy="24" rx="9" ry="6" fill="white" opacity="0.9"/>
      <ellipse cx="50" cy="25" rx="8" ry="5" fill="white" opacity="0.9"/>
      {/* Windows */}
      <rect x="24" y="44" width="8" height="7" rx="1" fill="url(#wg)" opacity="0.9"/>
      <rect x="36" y="44" width="8" height="7" rx="1" fill="url(#wg)" opacity="0.9"/>
      <rect x="48" y="44" width="8" height="7" rx="1" fill="url(#wg)" opacity="0.9"/>
      <rect x="30" y="55" width="20" height="11" rx="1" fill="white" opacity="0.2"/>
      <defs>
        <linearGradient id="lgd" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#1e3a8a"/>
          <stop offset="100%" stopColor="#1d4ed8"/>
        </linearGradient>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd"/>
          <stop offset="100%" stopColor="#3b82f6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════════════ */
function LoginPage({onLogin}){
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [showPass,setShowPass]=useState(false);

  const handleLogin=()=>{
    if(!email||!pass){setErr("Completa todos los campos."); return;}
    setLoading(true); setErr("");
    setTimeout(()=>{
      const user=INITIAL_USERS.find(u=>u.email===email&&u.password===pass);
      if(!user){setErr("Credenciales incorrectas. Verifica tu email y contraseña.");setLoading(false);return;}
      if(user.status==="inactive"){setErr("Cuenta inactiva. Contacta al administrador.");setLoading(false);return;}
      onLogin(user);
    },900);
  };

  const hints=[
    {role:"Administrador",email:"admin@institutocloudcorp.edu.pe",pass:"Admin2024!",color:C.aws},
    {role:"Empleado",email:"ana.quispe@institutocloudcorp.edu.pe",pass:"Emp2024!",color:C.accent2},
    {role:"Usuario",email:"m.torres@institutocloudcorp.edu.pe",pass:"User2024!",color:C.green},
  ];

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      {/* BG grid */}
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${C.border}1a 1px,transparent 1px),linear-gradient(90deg,${C.border}1a 1px,transparent 1px)`,backgroundSize:"40px 40px",opacity:0.6}}/>
      {/* BG glow */}
      <div style={{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:600,height:300,background:`radial-gradient(ellipse,${C.accent}18,transparent 70%)`,pointerEvents:"none"}}/>

      <div style={{position:"relative",width:"100%",maxWidth:460}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:14,marginBottom:14}}>
            <InstituteLogo size={56}/>
            <div style={{textAlign:"left"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,letterSpacing:-0.5,color:C.text}}>
                Instituto<span style={{color:C.accent2}}> CloudCorp</span>
              </div>
              <div style={{fontFamily:"monospace",fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:2}}>Plataforma Cloud B2E · AWS</div>
            </div>
          </div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,color:C.text2}}>Inicia sesión en tu intranet corporativa</div>
        </div>

        {/* Card */}
        <div style={{background:C.surface,border:`1px solid ${C.border2}`,borderRadius:16,padding:"32px 36px",boxShadow:`0 24px 64px rgba(0,0,0,0.5),0 0 0 1px ${C.border}`}}>
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontFamily:"monospace",fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:1.5,marginBottom:7}}>Correo institucional</label>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="usuario@institutocloudcorp.edu.pe"
              style={{width:"100%",background:C.bg,border:`1px solid ${err?C.red:C.border2}`,borderRadius:9,padding:"11px 14px",color:C.text,fontSize:13,fontFamily:"monospace",outline:"none",transition:"border-color 0.2s"}}/>
          </div>
          <div style={{marginBottom:22,position:"relative"}}>
            <label style={{display:"block",fontFamily:"monospace",fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:1.5,marginBottom:7}}>Contraseña</label>
            <input value={pass} onChange={e=>setPass(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              type={showPass?"text":"password"}
              placeholder="••••••••••"
              style={{width:"100%",background:C.bg,border:`1px solid ${err?C.red:C.border2}`,borderRadius:9,padding:"11px 44px 11px 14px",color:C.text,fontSize:13,fontFamily:"monospace",outline:"none"}}/>
            <button onClick={()=>setShowPass(v=>!v)}
              style={{position:"absolute",right:12,bottom:11,background:"none",border:"none",cursor:"pointer",color:C.text3,fontSize:16}}>
              {showPass?"🙈":"👁"}
            </button>
          </div>
          {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:8,padding:"9px 12px",marginBottom:16,fontSize:12,color:C.red,fontFamily:"monospace"}}>{err}</div>}
          <button onClick={handleLogin} disabled={loading}
            style={{width:"100%",background:loading?C.border2:`linear-gradient(135deg,${C.accent},#2563eb)`,border:"none",borderRadius:9,padding:"13px",color:"white",fontSize:14,fontWeight:700,fontFamily:"'Syne',sans-serif",cursor:loading?"not-allowed":"pointer",transition:"all 0.2s",boxShadow:loading?"none":`0 4px 20px ${C.accent}44`,letterSpacing:0.3}}>
            {loading?"Autenticando...":"Iniciar Sesión →"}
          </button>

          {/* AWS badge */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:18,padding:"8px 0",borderTop:`1px solid ${C.border}`}}>
            <Blink color={C.green}/>
            <span style={{fontFamily:"monospace",fontSize:9,color:C.text3}}>Autenticación segura · AWS Cognito · TLS 1.3</span>
          </div>
        </div>

        {/* Demo hints */}
        <div style={{marginTop:20,background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px"}}>
          <div style={{fontFamily:"monospace",fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>Cuentas de demostración</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {hints.map(h=>(
              <div key={h.role} onClick={()=>{setEmail(h.email);setPass(h.pass);setErr("");}}
                style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,cursor:"pointer",background:C.bg,border:`1px solid ${C.border}`,transition:"border-color 0.2s"}}>
                <span style={pill(h.color,h.role)}>{ROLE_ICONS[h.role.toLowerCase().replace("administrador","admin")]||"👤"} {h.role}</span>
                <span style={{fontFamily:"monospace",fontSize:10,color:C.text3,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.email}</span>
                <span style={{fontFamily:"monospace",fontSize:9,color:C.border2}}>Clic para usar →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MODAL
═══════════════════════════════════════════════════════════════ */
function Modal({title,onClose,children}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div style={{background:C.surface,border:`1px solid ${C.border2}`,borderRadius:14,width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,0.6)"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 22px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.text3,fontSize:20,cursor:"pointer",lineHeight:1}}>×</button>
        </div>
        <div style={{padding:"20px 22px"}}>{children}</div>
      </div>
    </div>
  );
}

function Input({label,value,onChange,type="text",placeholder="",options}){
  return(
    <div style={{marginBottom:14}}>
      <label style={{display:"block",fontFamily:"monospace",fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>{label}</label>
      {options?(
        <select value={value} onChange={e=>onChange(e.target.value)}
          style={{width:"100%",background:C.bg,border:`1px solid ${C.border2}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,fontFamily:"monospace",outline:"none"}}>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ):(
        <input value={value} onChange={e=>onChange(e.target.value)} type={type} placeholder={placeholder}
          style={{width:"100%",background:C.bg,border:`1px solid ${C.border2}`,borderRadius:8,padding:"9px 12px",color:C.text,fontSize:13,fontFamily:"monospace",outline:"none"}}/>
      )}
    </div>
  );
}

function BtnPrimary({onClick,children,color=C.accent,small}){
  return(
    <button onClick={onClick}
      style={{background:`linear-gradient(135deg,${color},${color}cc)`,border:"none",borderRadius:8,padding:small?"7px 14px":"10px 20px",
        color:"#fff",fontSize:small?11:13,fontWeight:700,fontFamily:"'Syne',sans-serif",cursor:"pointer",
        boxShadow:`0 4px 14px ${color}44`,transition:"transform 0.1s",letterSpacing:0.2}}
      onMouseDown={e=>e.currentTarget.style.transform="scale(0.97)"}
      onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOAST NOTIFICATION
═══════════════════════════════════════════════════════════════ */
function Toast({msg,type,onDone}){
  useEffect(()=>{const id=setTimeout(onDone,2800);return()=>clearTimeout(id);},[]);
  const colors={success:C.green,error:C.red,info:C.accent2,warning:C.yellow};
  return(
    <div style={{position:"fixed",bottom:24,right:24,zIndex:2000,background:C.surface,border:`1px solid ${colors[type]||C.border2}`,
      borderRadius:10,padding:"12px 18px",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
      animation:"fadeUp 0.3s ease",fontFamily:"monospace",fontSize:12,color:C.text,maxWidth:320}}>
      <span style={{color:colors[type],fontSize:16}}>{type==="success"?"✓":type==="error"?"✗":type==="warning"?"⚠":"ℹ"}</span>
      {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGES
═══════════════════════════════════════════════════════════════ */

/* ─── DASHBOARD ─── */
function DashboardPage({user,toast}){
  const tick=useTick(1000);
  const [rjobs,setRjobs]=useState(BACKUP_JOBS_DATA.map(j=>({...j})));
  useEffect(()=>{
    setRjobs(prev=>prev.map(j=>{
      if(!j.animate||j.pct>=100)return j;
      return {...j,pct:Math.min(100,j.pct+(j.slow?0.4:0.8))};
    }));
  },[tick]);

  const metrics=[
    {label:"Clientes Activos",value:"1,284",delta:"↑ 4.2%",up:true,icon:"👥",color:C.accent2},
    {label:"Storage S3",value:"8.4 TB",delta:"↑ 12%",up:true,icon:"🪣",color:C.green},
    {label:"Backups OK",value:"97.8%",delta:"↓ 2 fallidos",up:false,icon:"✅",color:C.aws},
    {label:"Costo AWS/Mes",value:"$2,140",delta:"Presup $2,500",up:null,icon:"💰",color:C.purple},
  ];

  const qa=[
    {icon:"📤",label:"Iniciar Backup",sub:"S3 · CloudWatch",bg:"rgba(37,99,235,0.15)", fn:()=>toast("Job de backup iniciado en AWS Backup","success")},
    {icon:"🗂",label:"Nuevo Contrato",sub:"CRM Comercial",bg:"rgba(16,185,129,0.12)",  fn:()=>toast("Módulo CRM abierto","info")},
    {icon:"☁",label:"Subir Media",sub:"S3 · CloudFront",bg:C.awsGlow,                 fn:()=>toast("Selector de archivos abierto","info")},
    {icon:"📊",label:"Ver Reporte",sub:"Analytics AWS",bg:"rgba(124,58,237,0.15)",     fn:()=>toast("Generando reporte PDF…","info")},
  ];

  const visibleQA = user.role==="usuario" ? qa.slice(2) : qa;

  return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:21,fontWeight:800,letterSpacing:-0.5,marginBottom:4}}>
          Bienvenido, {user.name.split(" ")[0]} 👋
        </div>
        <div style={{fontSize:11,color:C.text2}}>
          {ROLE_LABELS[user.role]} · {user.dept} &nbsp;|&nbsp;
          <span style={{color:C.aws,fontFamily:"monospace",fontSize:10}}>AWS us-east-1 · Actualizado ahora</span>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{display:"grid",gridTemplateColumns:`repeat(${visibleQA.length},1fr)`,gap:10,marginBottom:18}}>
        {visibleQA.map(qa=>(
          <div key={qa.label} onClick={qa.fn}
            style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all 0.2s"}}>
            <div style={{width:32,height:32,borderRadius:8,background:qa.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{qa.icon}</div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:12.5,fontWeight:700,color:C.text}}>{qa.label}</div>
              <div style={{fontFamily:"monospace",fontSize:9,color:C.text3,marginTop:1}}>{qa.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
        {metrics.map((m,i)=>(
          <div key={m.label} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${m.color},transparent)`}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontFamily:"monospace",fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:1.5}}>{m.label}</span>
              <span style={{fontSize:17}}>{m.icon}</span>
            </div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:26,fontWeight:800,letterSpacing:-1,marginBottom:5}}>{m.value}</div>
            <div style={{fontFamily:"monospace",fontSize:11,color:m.up===true?C.green:m.up===false?C.red:C.text3}}>{m.delta}</div>
          </div>
        ))}
      </div>

      {/* Backup jobs */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,display:"flex",gap:8,alignItems:"center"}}>
              Jobs de Backup
              <span style={{background:C.awsGlow,border:"1px solid rgba(255,153,0,0.3)",color:C.aws,fontSize:8,padding:"2px 8px",borderRadius:99,fontFamily:"monospace"}}>AWS</span>
            </div>
            <span onClick={()=>toast("Iniciando nuevo job de backup...","success")} style={{fontSize:10,color:C.accent2,cursor:"pointer",fontFamily:"monospace"}}>+ Nuevo job</span>
          </div>
          <div style={{padding:"16px 18px"}}>
            {rjobs.map(j=>(
              <div key={j.id} style={{marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,fontWeight:500}}>{j.name}</span>
                  <span style={{fontFamily:"monospace",fontSize:9,color:C.text3}}>{j.size} · {j.label}</span>
                </div>
                <div style={{height:4,background:C.border,borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${j.pct}%`,background:j.color,borderRadius:99,transition:"width 0.7s ease"}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700}}>Alertas & Eventos</span>
            <span onClick={()=>toast("Todas las alertas marcadas como leídas","success")} style={{fontSize:10,color:C.accent2,cursor:"pointer",fontFamily:"monospace"}}>Marcar todo</span>
          </div>
          <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:8}}>
            {[
              {icon:"🔴",title:"Backup Glacier falló",msg:"Timeout al conectar. Revisar permisos IAM.",time:"hace 18 min",border:"rgba(239,68,68,0.3)"},
              {icon:"🟡",title:"S3 Bucket near limit",msg:"El bucket multimedia al 87% de capacidad.",time:"hace 1 h",border:"rgba(245,158,11,0.3)"},
              {icon:"🟢",title:"RDS Snapshot OK",msg:"Backup automático DB Comercial ejecutado.",time:"hace 3 h",border:"rgba(16,185,129,0.25)"},
            ].map(a=>(
              <div key={a.title} style={{display:"flex",gap:9,padding:"9px 11px",borderRadius:8,background:C.bg,border:`1px solid ${a.border}`,alignItems:"flex-start"}}>
                <span style={{fontSize:13,flexShrink:0}}>{a.icon}</span>
                <div>
                  <div style={{fontSize:11.5,fontWeight:600,fontFamily:"'Syne',sans-serif",marginBottom:2}}>{a.title}</div>
                  <div style={{fontSize:10.5,color:C.text2,lineHeight:1.4}}>{a.msg}</div>
                  <div style={{fontFamily:"monospace",fontSize:9,color:C.text3,marginTop:3}}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── USUARIOS (solo admin) ─── */
function UsersPage({currentUser,toast}){
  const [users,setUsers]=useState(INITIAL_USERS);
  const [modal,setModal]=useState(null); // null | "create" | {user}
  const [form,setForm]=useState({name:"",email:"",password:"",role:"usuario",dept:"Docentes"});
  const [search,setSearch]=useState("");

  const filtered=users.filter(u=>u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));

  const openCreate=()=>{setForm({name:"",email:"",password:"",role:"usuario",dept:"Docentes"});setModal("create");};
  const openEdit=u=>{setForm({name:u.name,email:u.email,password:u.password,role:u.role,dept:u.dept});setModal(u);};

  const saveUser=()=>{
    if(!form.name||!form.email||!form.password){toast("Completa todos los campos","error");return;}
    if(modal==="create"){
      const newUser={id:Date.now(),name:form.name,email:form.email,password:form.password,role:form.role,avatar:form.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),dept:form.dept,status:"active",joined:new Date().toISOString().slice(0,10)};
      setUsers(p=>[...p,newUser]);
      toast(`Usuario "${form.name}" creado correctamente`,"success");
    } else {
      setUsers(p=>p.map(u=>u.id===modal.id?{...u,...form}:u));
      toast(`Usuario "${form.name}" actualizado`,"success");
    }
    setModal(null);
  };

  const toggleStatus=u=>{
    if(u.id===currentUser.id){toast("No puedes desactivar tu propia cuenta","error");return;}
    setUsers(p=>p.map(x=>x.id===u.id?{...x,status:x.status==="active"?"inactive":"active"}:x));
    toast(`Usuario ${u.status==="active"?"desactivado":"activado"}`,"warning");
  };

  const deleteUser=u=>{
    if(u.id===currentUser.id){toast("No puedes eliminar tu propia cuenta","error");return;}
    setUsers(p=>p.filter(x=>x.id!==u.id));
    toast(`Usuario "${u.name}" eliminado`,"warning");
  };

  const roleColors={admin:C.aws,empleado:C.accent2,usuario:C.green};

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,letterSpacing:-0.5}}>Gestión de Usuarios</div>
          <div style={{fontSize:11,color:C.text2,marginTop:2}}>{users.length} usuarios registrados · AWS Cognito</div>
        </div>
        <BtnPrimary onClick={openCreate} color={C.accent}>+ Nuevo Usuario</BtnPrimary>
      </div>

      {/* Search */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 14px",display:"flex",gap:8,alignItems:"center",marginBottom:16,width:300}}>
        <span style={{color:C.text3}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar usuario..."
          style={{background:"none",border:"none",outline:"none",color:C.text,fontSize:12,fontFamily:"monospace",width:"100%"}}/>
      </div>

      {/* Table */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr>
              {["Usuario","Rol","Departamento","Estado","Ingresó","Acciones"].map(h=>(
                <th key={h} style={{textAlign:"left",fontFamily:"monospace",fontSize:9,textTransform:"uppercase",letterSpacing:1.5,color:C.text3,padding:"11px 18px",borderBottom:`1px solid ${C.border}`}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u=>(
              <tr key={u.id} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"11px 18px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${roleColors[u.role]}88,${roleColors[u.role]})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{u.avatar}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>{u.name}</div>
                      <div style={{fontFamily:"monospace",fontSize:9,color:C.text3}}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:"11px 18px"}}><span style={pill(roleColors[u.role],ROLE_LABELS[u.role])}>{ROLE_ICONS[u.role]} {ROLE_LABELS[u.role]}</span></td>
                <td style={{padding:"11px 18px",fontSize:12,color:C.text2}}>{u.dept}</td>
                <td style={{padding:"11px 18px"}}><span style={pill(u.status==="active"?C.green:C.red,u.status==="active"?"Activo":"Inactivo")}>● {u.status==="active"?"Activo":"Inactivo"}</span></td>
                <td style={{padding:"11px 18px",fontFamily:"monospace",fontSize:10,color:C.text3}}>{u.joined}</td>
                <td style={{padding:"11px 18px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>openEdit(u)} style={{background:`${C.accent2}20`,border:`1px solid ${C.accent2}44`,borderRadius:6,padding:"5px 10px",color:C.accent2,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>Editar</button>
                    <button onClick={()=>toggleStatus(u)} style={{background:`${C.yellow}20`,border:`1px solid ${C.yellow}44`,borderRadius:6,padding:"5px 10px",color:C.yellow,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>{u.status==="active"?"Desactivar":"Activar"}</button>
                    <button onClick={()=>deleteUser(u)} style={{background:`${C.red}20`,border:`1px solid ${C.red}44`,borderRadius:6,padding:"5px 10px",color:C.red,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal&&(
        <Modal title={modal==="create"?"Crear Nuevo Usuario":`Editar: ${modal.name}`} onClose={()=>setModal(null)}>
          <Input label="Nombre completo" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="Ej. Juan Pérez"/>
          <Input label="Correo institucional" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))} placeholder="usuario@institutocloudcorp.edu.pe"/>
          <Input label="Contraseña" value={form.password} onChange={v=>setForm(p=>({...p,password:v}))} type="password" placeholder="Mínimo 8 caracteres"/>
          <Input label="Rol" value={form.role} onChange={v=>setForm(p=>({...p,role:v}))} options={["admin","empleado","usuario"]}/>
          <Input label="Departamento" value={form.dept} onChange={v=>setForm(p=>({...p,dept:v}))} options={DEPT_OPTIONS}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <button onClick={()=>setModal(null)} style={{background:C.border2,border:"none",borderRadius:8,padding:"9px 18px",color:C.text2,fontSize:13,cursor:"pointer",fontFamily:"monospace"}}>Cancelar</button>
            <BtnPrimary onClick={saveUser} color={C.accent}>{modal==="create"?"Crear Usuario":"Guardar Cambios"}</BtnPrimary>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── CLIENTES & CRM ─── */
function ClientsPage({user,toast}){
  const [clients,setClients]=useState(CLIENTS_DATA);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({name:"",plan:"Basic",status:"active",mrr:"$95"});

  const canEdit=user.role!=="usuario";

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,letterSpacing:-0.5}}>Clientes & CRM</div>
          <div style={{fontSize:11,color:C.text2,marginTop:2}}>{clients.filter(c=>c.status==="active").length} clientes activos</div>
        </div>
        {canEdit&&<BtnPrimary onClick={()=>{setForm({name:"",plan:"Basic",status:"active",mrr:"$95"});setModal("create");}} color={C.green}>+ Nuevo Cliente</BtnPrimary>}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18}}>
        {[{label:"Total Clientes",val:clients.length,icon:"🏢",c:C.accent2},{label:"MRR Total",val:"$1,495",icon:"💵",c:C.green},{label:"Inactivos",val:clients.filter(c=>c.status==="inactive").length,icon:"⚠",c:C.yellow}].map(m=>(
          <div key={m.label} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:11,padding:"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontFamily:"monospace",fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:1.5}}>{m.label}</span>
              <span style={{fontSize:18}}>{m.icon}</span>
            </div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:m.c}}>{m.val}</div>
          </div>
        ))}
      </div>

      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr>{["Cliente","Plan","Estado","MRR","Desde",canEdit?"Acciones":""].filter(Boolean).map(h=>(
              <th key={h} style={{textAlign:"left",fontFamily:"monospace",fontSize:9,textTransform:"uppercase",letterSpacing:1.5,color:C.text3,padding:"11px 18px",borderBottom:`1px solid ${C.border}`}}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {clients.map(c=>(
              <tr key={c.id} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"11px 18px",fontSize:13,fontWeight:600,fontFamily:"'Syne',sans-serif"}}>{c.name}</td>
                <td style={{padding:"11px 18px"}}><span style={pill(c.plan==="Enterprise"?C.aws:c.plan==="Pro"?C.accent2:C.green,c.plan)}>{c.plan}</span></td>
                <td style={{padding:"11px 18px"}}><span style={pill(c.status==="active"?C.green:C.red,c.status==="active"?"Activo":"Inactivo")}>● {c.status==="active"?"Activo":"Inactivo"}</span></td>
                <td style={{padding:"11px 18px",fontFamily:"monospace",fontSize:12,color:C.green}}>{c.mrr}</td>
                <td style={{padding:"11px 18px",fontFamily:"monospace",fontSize:10,color:C.text3}}>{c.since}</td>
                {canEdit&&<td style={{padding:"11px 18px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>toast(`Abriendo perfil de ${c.name}`,"info")} style={{background:`${C.accent2}20`,border:`1px solid ${C.accent2}44`,borderRadius:6,padding:"5px 10px",color:C.accent2,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>Ver</button>
                    <button onClick={()=>{setForm({name:c.name,plan:c.plan,status:c.status,mrr:c.mrr});setModal(c);}} style={{background:`${C.yellow}20`,border:`1px solid ${C.yellow}44`,borderRadius:6,padding:"5px 10px",color:C.yellow,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>Editar</button>
                  </div>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal&&(
        <Modal title={modal==="create"?"Nuevo Cliente":`Editar: ${modal.name}`} onClose={()=>setModal(null)}>
          <Input label="Nombre del cliente" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="Ej. Colegio San Pablo"/>
          <Input label="Plan" value={form.plan} onChange={v=>setForm(p=>({...p,plan:v}))} options={["Basic","Pro","Enterprise"]}/>
          <Input label="Estado" value={form.status} onChange={v=>setForm(p=>({...p,status:v}))} options={["active","inactive"]}/>
          <Input label="MRR" value={form.mrr} onChange={v=>setForm(p=>({...p,mrr:v}))} placeholder="$220"/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <button onClick={()=>setModal(null)} style={{background:C.border2,border:"none",borderRadius:8,padding:"9px 18px",color:C.text2,fontSize:13,cursor:"pointer",fontFamily:"monospace"}}>Cancelar</button>
            <BtnPrimary onClick={()=>{
              if(modal==="create"){setClients(p=>[...p,{id:Date.now(),...form,since:new Date().toISOString().slice(0,7)}]);}
              else{setClients(p=>p.map(c=>c.id===modal.id?{...c,...form}:c));}
              toast("Cliente guardado correctamente","success");setModal(null);
            }} color={C.green}>{modal==="create"?"Crear Cliente":"Guardar"}</BtnPrimary>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ─── ARCHIVOS S3 ─── */
function S3Page({user,toast}){
  const [files,setFiles]=useState(MEDIA_FILES);
  const [uploading,setUploading]=useState(false);
  const [pct,setPct]=useState(0);

  const simulate=()=>{
    setUploading(true);setPct(0);
    const iv=setInterval(()=>setPct(p=>{
      if(p>=100){clearInterval(iv);setUploading(false);
        setFiles(prev=>[{id:Date.now(),name:"Archivo_"+Date.now()+".zip",size:"2.1 MB",type:"📦",bucket:"media-bucket-prod",uploaded:"Ahora",by:user.name},...prev]);
        toast("Archivo subido correctamente a S3","success");return 0;}
      return p+8;
    }),150);
  };

  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,letterSpacing:-0.5}}>Archivos & Media S3</div>
          <div style={{fontSize:11,color:C.text2,marginTop:2}}>{files.length} archivos · Amazon S3</div>
        </div>
        <BtnPrimary onClick={simulate} color={C.aws}>☁ Subir Archivo</BtnPrimary>
      </div>

      {uploading&&(
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontFamily:"monospace",fontSize:11,color:C.text2}}>Subiendo a S3...</span>
            <span style={{fontFamily:"monospace",fontSize:11,color:C.aws}}>{pct}%</span>
          </div>
          <div style={{height:6,background:C.border,borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.accent},${C.aws})`,borderRadius:99,transition:"width 0.15s"}}/>
          </div>
        </div>
      )}

      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr>{["Archivo","Tamaño","Bucket S3","Subido por","Fecha","Acciones"].map(h=>(
              <th key={h} style={{textAlign:"left",fontFamily:"monospace",fontSize:9,textTransform:"uppercase",letterSpacing:1.5,color:C.text3,padding:"11px 18px",borderBottom:`1px solid ${C.border}`}}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {files.map(f=>(
              <tr key={f.id} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"11px 18px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <span style={{fontSize:20}}>{f.type}</span>
                    <span style={{fontSize:12.5,fontWeight:500}}>{f.name}</span>
                  </div>
                </td>
                <td style={{padding:"11px 18px",fontFamily:"monospace",fontSize:11,color:C.text3}}>{f.size}</td>
                <td style={{padding:"11px 18px"}}><span style={{fontFamily:"monospace",fontSize:10,color:C.aws}}>{f.bucket}</span></td>
                <td style={{padding:"11px 18px",fontSize:11,color:C.text2}}>{f.by}</td>
                <td style={{padding:"11px 18px",fontFamily:"monospace",fontSize:10,color:C.text3}}>{f.uploaded}</td>
                <td style={{padding:"11px 18px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>toast(`Descargando ${f.name} desde S3...`,"info")} style={{background:`${C.green}20`,border:`1px solid ${C.green}44`,borderRadius:6,padding:"5px 10px",color:C.green,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>Descargar</button>
                    {user.role!=="usuario"&&<button onClick={()=>{setFiles(p=>p.filter(x=>x.id!==f.id));toast(`${f.name} eliminado de S3`,"warning");}} style={{background:`${C.red}20`,border:`1px solid ${C.red}44`,borderRadius:6,padding:"5px 10px",color:C.red,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>Eliminar</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── REPORTES ─── */
function ReportsPage({toast}){
  const [gen,setGen]=useState(null);
  const reports=[
    {id:1,name:"Reporte Mensual de Backups",desc:"Estado de todos los jobs de AWS Backup del mes",icon:"🔄",color:C.aws},
    {id:2,name:"Actividad Comercial",desc:"Contratos, renovaciones y MRR del período",icon:"📊",color:C.accent2},
    {id:3,name:"Uso de Storage S3",desc:"Desglose por bucket y tipo de archivo",icon:"🪣",color:C.green},
    {id:4,name:"Accesos & Auditoría IAM",desc:"Log de accesos y permisos del período",icon:"🔐",color:C.purple},
    {id:5,name:"Costos AWS",desc:"Desglose de facturación por servicio",icon:"💰",color:C.yellow},
  ];
  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,letterSpacing:-0.5,marginBottom:4}}>Reportes & Analytics</div>
      <div style={{fontSize:11,color:C.text2,marginBottom:20}}>Exporta reportes directamente desde AWS CloudWatch</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
        {reports.map(r=>(
          <div key={r.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:42,height:42,borderRadius:10,background:`${r.color}18`,border:`1px solid ${r.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{r.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,marginBottom:4}}>{r.name}</div>
              <div style={{fontSize:11,color:C.text2,lineHeight:1.5,marginBottom:12}}>{r.desc}</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setGen(r.id);setTimeout(()=>{setGen(null);toast(`Reporte "${r.name}" generado y descargado`,"success");},1800);}}
                  style={{background:`${r.color}20`,border:`1px solid ${r.color}44`,borderRadius:7,padding:"6px 14px",color:r.color,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>
                  {gen===r.id?"Generando...":"📥 Exportar PDF"}
                </button>
                <button onClick={()=>toast(`Abriendo reporte en CloudWatch...`,"info")} style={{background:`${C.accent2}15`,border:`1px solid ${C.accent2}33`,borderRadius:7,padding:"6px 14px",color:C.accent2,fontSize:10,fontFamily:"monospace",cursor:"pointer"}}>Ver en AWS →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SERVICIOS AWS ─── */
function AwsPage({toast}){
  const services=[
    {name:"Amazon S3",icon:"🪣",status:"ok",region:"us-east-1",detail:"3 buckets · 8.4 TB · Versioning ON"},
    {name:"Amazon EC2",icon:"🖥",status:"ok",region:"us-east-1",detail:"4 instancias t3.medium · Auto Scaling"},
    {name:"Amazon RDS",icon:"🗄",status:"ok",region:"us-east-1",detail:"MySQL 8.0 · Multi-AZ · 100 GB"},
    {name:"AWS Backup",icon:"🔄",status:"warn",region:"us-east-1",detail:"2 alertas · 30 días retención"},
    {name:"CloudFront",icon:"🌐",status:"ok",region:"Global",detail:"12 distribuciones · SSL/TLS"},
    {name:"IAM / Cognito",icon:"🔐",status:"ok",region:"Global",detail:"5 grupos · RBAC · MFA activo"},
    {name:"CloudWatch",icon:"📡",status:"ok",region:"us-east-1",detail:"15+ métricas · Alarmas SNS"},
    {name:"Amazon VPC",icon:"🔒",status:"ok",region:"us-east-1",detail:"2 AZs · Subnets pub/priv · NAT GW"},
  ];
  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,letterSpacing:-0.5,marginBottom:4}}>Servicios AWS</div>
      <div style={{fontSize:11,color:C.text2,marginBottom:20}}>Estado en tiempo real de la infraestructura cloud</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
        {services.map(s=>(
          <div key={s.name} style={{background:C.surface,border:`1px solid ${s.status==="warn"?"rgba(245,158,11,0.3)":C.border}`,borderRadius:12,padding:"16px 18px",display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:40,height:40,borderRadius:9,background:C.awsGlow,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"monospace",fontSize:12,fontWeight:600,color:C.aws,marginBottom:3}}>{s.name}</div>
              <div style={{fontSize:11,color:C.text2,marginBottom:5}}>{s.detail}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,fontFamily:"monospace"}}>
                <Blink color={s.status==="ok"?C.green:C.yellow}/>
                <span style={{color:s.status==="ok"?C.green:C.yellow}}>{s.status==="ok"?"Operativo":"2 alertas"}</span>
                <span style={{color:C.text3}}>· {s.region}</span>
              </div>
            </div>
            <button onClick={()=>toast(`Abriendo consola AWS para ${s.name}...`,"info")} style={{background:`${C.accent2}15`,border:`1px solid ${C.accent2}33`,borderRadius:7,padding:"6px 12px",color:C.accent2,fontSize:9,fontFamily:"monospace",cursor:"pointer"}}>Consola →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CONFIGURACIÓN ─── */
function ConfigPage({user,toast}){
  const [awsKey,setAwsKey]=useState("AKIA••••••••••••XXXX");
  const [region,setRegion]=useState("us-east-1");
  const [bucket,setBucket]=useState("media-bucket-prod");
  const [mfa,setMfa]=useState(true);

  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,letterSpacing:-0.5,marginBottom:20}}>Configuración del Sistema</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 22px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
            <span style={{background:C.awsGlow,border:"1px solid rgba(255,153,0,0.3)",color:C.aws,fontSize:8,padding:"2px 8px",borderRadius:99,fontFamily:"monospace"}}>AWS</span>
            Configuración AWS
          </div>
          <Input label="Access Key ID" value={awsKey} onChange={setAwsKey} placeholder="AKIA..."/>
          <Input label="Región" value={region} onChange={setRegion} options={["us-east-1","us-west-2","eu-west-1","ap-southeast-1"]}/>
          <Input label="Bucket Principal S3" value={bucket} onChange={setBucket} placeholder="mi-bucket"/>
          <BtnPrimary onClick={()=>toast("Conexión AWS verificada correctamente","success")} color={C.aws}>Verificar Conexión</BtnPrimary>
        </div>
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 22px"}}>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:700,marginBottom:16}}>🔐 Seguridad & IAM</div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <div>
              <div style={{fontSize:13,fontWeight:600}}>Autenticación MFA</div>
              <div style={{fontSize:11,color:C.text3,fontFamily:"monospace"}}>AWS Cognito · Multi-Factor</div>
            </div>
            <div onClick={()=>{setMfa(v=>!v);toast(`MFA ${mfa?"desactivado":"activado"}`,"warning");}}
              style={{width:44,height:24,borderRadius:99,background:mfa?C.green:C.border2,cursor:"pointer",position:"relative",transition:"background 0.3s"}}>
              <div style={{position:"absolute",top:3,left:mfa?22:3,width:18,height:18,borderRadius:"50%",background:"white",transition:"left 0.3s"}}/>
            </div>
          </div>
          <div style={{padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:6}}>Política IAM activa</div>
            <span style={pill(C.accent2,"BackupOperators-Policy-v3")}>📋 BackupOperators-Policy-v3</span>
          </div>
          <div style={{padding:"12px 0"}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>CloudTrail</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <Blink color={C.green}/>
              <span style={{fontSize:11,color:C.green,fontFamily:"monospace"}}>Auditoría activa · us-east-1</span>
            </div>
          </div>
          <BtnPrimary onClick={()=>toast("Abriendo consola IAM en AWS...","info")} color={C.purple}>Abrir IAM Console</BtnPrimary>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function App(){
  const [session,setSession]=useState(null);
  const [activePage,setActivePage]=useState("Dashboard");
  const [toast,setToast]=useState(null);

  const showToast=(msg,type="info")=>setToast({msg,type,key:Date.now()});

  const logout=()=>{setSession(null);setActivePage("Dashboard");};

  if(!session) return <LoginPage onLogin={u=>{setSession(u);setActivePage("Dashboard");}}/>;

  const navItems=NAV_BY_ROLE[session.role]||["Dashboard"];
  const roleColor=ROLE_COLORS[session.role]||C.text2;

  const renderPage=()=>{
    switch(activePage){
      case "Dashboard":      return <DashboardPage user={session} toast={showToast}/>;
      case "Usuarios":       return session.role==="admin"?<UsersPage currentUser={session} toast={showToast}/>:<DashboardPage user={session} toast={showToast}/>;
      case "Clientes & CRM": return <ClientsPage user={session} toast={showToast}/>;
      case "Backup & Jobs":  return <DashboardPage user={session} toast={showToast}/>;
      case "Archivos S3":    return <S3Page user={session} toast={showToast}/>;
      case "Servicios AWS":  return <AwsPage toast={showToast}/>;
      case "Reportes":       return <ReportsPage toast={showToast}/>;
      case "Configuración":  return session.role==="admin"?<ConfigPage user={session} toast={showToast}/>:<DashboardPage user={session} toast={showToast}/>;
      default:               return <DashboardPage user={session} toast={showToast}/>;
    }
  };

  return(
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.text,overflow:"hidden",fontFamily:"'IBM Plex Mono',monospace"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1e2d4a;border-radius:99px}
        input,select,button{font-family:inherit;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{width:240,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0}}>
        {/* Logo */}
        <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <InstituteLogo size={38}/>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,letterSpacing:-0.5,color:C.text}}>
                Instituto<br/><span style={{color:C.accent2}}>CloudCorp</span>
              </div>
            </div>
          </div>
          <div style={{fontFamily:"monospace",fontSize:8,color:C.text3,textTransform:"uppercase",letterSpacing:1.5,marginTop:6}}>Plataforma B2E · Cloud Computing</div>
          <div style={{marginTop:10,display:"flex",alignItems:"center",gap:6,background:"rgba(255,153,0,0.07)",border:"1px solid rgba(255,153,0,0.2)",borderRadius:6,padding:"5px 9px"}}>
            <Blink color={C.green}/>
            <span style={{fontFamily:"monospace",fontSize:8,color:C.aws}}>AWS us-east-1 · Online</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,overflowY:"auto",padding:"14px 10px"}}>
          {navItems.map(item=>{
            const isActive=item===activePage;
            return(
              <div key={item} onClick={()=>setActivePage(item)}
                style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:8,cursor:"pointer",marginBottom:2,
                  background:isActive?"rgba(37,99,235,0.15)":"transparent",
                  border:isActive?`1px solid rgba(37,99,235,0.28)`:"1px solid transparent",
                  color:isActive?C.accent2:C.text2,transition:"all 0.15s"}}>
                <span style={{fontSize:15,minWidth:20,textAlign:"center"}}>{NAV_ICONS[item]||"○"}</span>
                <span style={{fontSize:12.5,fontWeight:500}}>{item}</span>
              </div>
            );
          })}
        </nav>

        {/* User + logout */}
        <div style={{padding:"12px 14px",borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${roleColor}88,${roleColor})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>
            {session.avatar}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{session.name.split(" ")[0]}</div>
            <div style={{fontSize:8,color:roleColor,fontFamily:"monospace",textTransform:"uppercase",letterSpacing:1}}>{ROLE_LABELS[session.role]}</div>
          </div>
          <button onClick={logout} title="Cerrar sesión"
            style={{background:`${C.red}15`,border:`1px solid ${C.red}33`,borderRadius:7,padding:"5px 8px",color:C.red,fontSize:12,cursor:"pointer"}}>
            ⏻
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Topbar */}
        <header style={{background:C.surface,borderBottom:`1px solid ${C.border}`,height:54,display:"flex",alignItems:"center",gap:12,padding:"0 22px",flexShrink:0}}>
          <div style={{flex:1,fontFamily:"monospace",fontSize:10,color:C.text3}}>
            Instituto CloudCorp / <span style={{color:C.accent2}}>{activePage}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",background:C.bg,border:`1px solid ${C.border2}`,borderRadius:7,padding:"6px 11px",gap:7,width:210}}>
            <span style={{color:C.text3,fontSize:12}}>🔍</span>
            <input placeholder="Buscar recursos..." style={{background:"none",border:"none",outline:"none",color:C.text,fontSize:11,fontFamily:"monospace",width:"100%"}}/>
          </div>
          <div onClick={()=>showToast("Sin nuevas notificaciones","info")}
            style={{width:32,height:32,borderRadius:7,border:`1px solid ${C.border2}`,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:C.text2,cursor:"pointer",position:"relative"}}>
            🔔
            <span style={{position:"absolute",top:4,right:4,width:6,height:6,background:C.red,borderRadius:"50%",border:`1.5px solid ${C.surface}`}}/>
          </div>
          {/* Role badge */}
          <span style={pill(roleColor,ROLE_LABELS[session.role])}>{ROLE_ICONS[session.role]} {ROLE_LABELS[session.role]}</span>
        </header>

        {/* Page */}
        <main style={{flex:1,overflowY:"auto",padding:"22px 26px"}}>
          {renderPage()}
          <div style={{height:28}}/>
        </main>
      </div>

      {/* Toast */}
      {toast&&<Toast key={toast.key} msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
    </div>
  );
}
