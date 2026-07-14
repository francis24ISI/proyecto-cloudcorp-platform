import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════
   PALETA
══════════════════════════════════════════════════ */
const C = {
  bg:"#06080f", sur:"#0b1120", s2:"#101829", s3:"#141f32",
  bor:"#162038", bor2:"#1c2d50",
  blue:"#2563eb", b2:"#3b82f6", bG:"rgba(59,130,246,0.15)",
  aws:"#ff9900",  awG:"rgba(255,153,0,0.12)",
  grn:"#10b981",  red:"#ef4444", yel:"#f59e0b",
  pur:"#7c3aed",  cyn:"#06b6d4", pnk:"#ec4899",
  txt:"#edf2ff",  t2:"#7b93bb",  t3:"#334566",
};

/* ══════════════════════════════════════════════════
   ROLES
══════════════════════════════════════════════════ */
const ROLE = {
  admin:   { label:"Administrador de Red", color:C.aws,  icon:"🛡",  nav:["Dashboard","Usuarios","Monitor Archivos","Servicios AWS","Configuración"] },
  docente: { label:"Docente",              color:C.b2,   icon:"📚",  nav:["Dashboard","Subir Archivos","Mis Archivos","Servicios AWS"] },
  alumno:  { label:"Alumno",              color:C.grn,  icon:"🎓",  nav:["Dashboard","Subir Archivos","Mis Archivos"] },
};

/* ══════════════════════════════════════════════════
   USUARIOS INICIALES  (alumnos solo creados por admin)
══════════════════════════════════════════════════ */
const INIT_USERS = [
  { id:1, name:"Carlos Mendoza",  email:"admin@institutocloudcorp.edu.pe",      pass:"Admin2024!",   role:"admin",   avatar:"CM", equipo:"PC-Admin-01",  ip:"192.168.1.10", status:"active" },
  { id:2, name:"Prof. Ana Quispe",email:"ana.quispe@institutocloudcorp.edu.pe", pass:"Doc2024!",     role:"docente", avatar:"AQ", equipo:"PC-Docente-01",ip:"192.168.1.21", status:"active" },
  { id:3, name:"Prof. Luis Flores",email:"luis.flores@institutocloudcorp.edu.pe",pass:"Doc2024!",   role:"docente", avatar:"LF", equipo:"PC-Docente-02",ip:"192.168.1.22", status:"active" },
  { id:4, name:"María Torres",    email:"maria.torres@institutocloudcorp.edu.pe",pass:"Alu2024!",   role:"alumno",  avatar:"MT", equipo:"PC-Alumno-01", ip:"192.168.2.10", status:"active" },
  { id:5, name:"Pedro Ríos",      email:"pedro.rios@institutocloudcorp.edu.pe", pass:"Alu2024!",    role:"alumno",  avatar:"PR", equipo:"PC-Alumno-02", ip:"192.168.2.11", status:"active" },
  { id:6, name:"Sofía Mamani",    email:"sofia.mamani@institutocloudcorp.edu.pe",pass:"Alu2024!",   role:"alumno",  avatar:"SM", equipo:"PC-Alumno-03", ip:"192.168.2.12", status:"active" },
];

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

function addLog(user, tipo, archivo, size){
  const now = new Date();
  const pad = n=>String(n).padStart(2,"0");
  const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const ft = FILE_TYPES.find(f=>f.id===tipo);
  UPLOAD_LOG = [{ id:LOG_NEXT++, uid:user.id, name:user.name, equipo:user.equipo, ip:user.ip, role:user.role, tipo, archivo, size, ts, bucket:ft?.bucket||"media-bucket-prod", status:"ok" }, ...UPLOAD_LOG];
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

/* ══════════════════════════════════════════════════
   GRÁFICO DE BARRAS (archivos subidos por tipo/equipo)
══════════════════════════════════════════════════ */
function UploadChart({logs}){
  /* Por tipo */
  const byType = FILE_TYPES.map(ft=>{
    const count = logs.filter(l=>l.tipo===ft.id).length;
    return { label:ft.label, icon:ft.icon, color:ft.color, count };
  }).filter(x=>x.count>0);

  /* Por equipo */
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
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      {/* Por tipo */}
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

      {/* Por equipo */}
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
    </div>
  );
}

/* ══════════════════════════════════════════════════
   LOGIN
══════════════════════════════════════════════════ */
function LoginPage({onLogin}){
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [show,setShow]=useState(false);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [users]=useState(INIT_USERS);

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

  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${C.bor}22 1px,transparent 1px),linear-gradient(90deg,${C.bor}22 1px,transparent 1px)`,backgroundSize:"48px 48px"}}/>
      <div style={{position:"absolute",top:"15%",left:"50%",transform:"translateX(-50%)",width:600,height:300,background:`radial-gradient(ellipse,${C.blue}14,transparent 65%)`,pointerEvents:"none"}}/>

      <div style={{position:"relative",width:"100%",maxWidth:460}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:14,marginBottom:12}}>
            <Logo size={58}/>
            <div style={{textAlign:"left"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,letterSpacing:-1,lineHeight:1.1,color:C.txt}}>
                Instituto<br/><span style={{color:C.b2}}>CloudCorp</span>
              </div>
              <div style={{fontFamily:"monospace",fontSize:8,color:C.t3,textTransform:"uppercase",letterSpacing:2,marginTop:3}}>Plataforma Educativa · AWS Cloud · B2E</div>
            </div>
          </div>
          <div style={{fontFamily:"monospace",fontSize:11,color:C.t2}}>Accede con tu cuenta institucional</div>
        </div>

        {/* Form */}
        <div style={{background:C.sur,border:`1px solid ${C.bor2}`,borderRadius:18,padding:"30px 34px",boxShadow:`0 24px 64px rgba(0,0,0,0.55)`}}>
          <Field label="Correo institucional" value={email} onChange={setEmail} ph="usuario@institutocloudcorp.edu.pe"/>
          <div style={{position:"relative",marginBottom:20}}>
            <Field label="Contraseña" value={pass} onChange={setPass} type={show?"text":"password"} ph="••••••••"/>
            <button onClick={()=>setShow(v=>!v)} style={{position:"absolute",right:12,bottom:11,background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:15}}>{show?"🙈":"👁"}</button>
          </div>
          {err&&<div style={{background:`${C.red}14`,border:`1px solid ${C.red}44`,borderRadius:8,padding:"9px 12px",marginBottom:14,fontSize:11,color:C.red,fontFamily:"monospace"}}>{err}</div>}
          <button onClick={login} onKeyDown={e=>e.key==="Enter"&&login()} disabled={loading}
            style={{width:"100%",background:loading?C.bor:`linear-gradient(135deg,${C.blue},#1d4ed8)`,border:"none",borderRadius:10,
              padding:"13px",color:"white",fontSize:14,fontWeight:800,fontFamily:"'Syne',sans-serif",
              cursor:loading?"not-allowed":"pointer",boxShadow:loading?"none":`0 4px 22px ${C.blue}55`,letterSpacing:0.5}}>
            {loading?"Autenticando con AWS Cognito...":"Iniciar Sesión →"}
          </button>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,marginTop:14,paddingTop:14,borderTop:`1px solid ${C.bor}`}}>
            <Blink color={C.grn}/><span style={{fontFamily:"monospace",fontSize:9,color:C.t3}}>TLS 1.3 · AWS Cognito · VirtualBox Simulation</span>
          </div>
        </div>

        {/* Demo accounts — botones FUNCIONALES */}
        <div style={{marginTop:16,background:C.sur,border:`1px solid ${C.bor}`,borderRadius:14,padding:"14px 18px"}}>
          <div style={{fontFamily:"monospace",fontSize:9,color:C.t3,textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>Cuentas de demostración — clic para rellenar</div>
          {demos.map(d=>{
            const rc=ROLE[d.role];
            return(
              <div key={d.role} onClick={()=>{setEmail(d.email);setPass(d.pass);setErr("");}}
                style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:9,cursor:"pointer",marginBottom:6,
                  background:C.bg,border:`1px solid ${C.bor}`,transition:"border-color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor=rc.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.bor}>
                <span style={{fontSize:18}}>{rc.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:12,fontWeight:700,color:rc.color}}>{rc.label}</div>
                  <div style={{fontFamily:"monospace",fontSize:9,color:C.t3,marginTop:1}}>{d.email}</div>
                </div>
                <span style={{fontFamily:"monospace",fontSize:9,color:rc.color,fontWeight:700}}>Clic para usar →</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   UPLOAD SIMULATOR con barra de progreso real
══════════════════════════════════════════════════ */
function UploadBox({user,toast,onDone}){
  const [tipo,setTipo]=useState("foto");
  const [nombre,setNombre]=useState("");
  const [progreso,setProgreso]=useState(0);
  const [fase,setFase]=useState("idle"); // idle | uploading | done
  const ft = FILE_TYPES.find(f=>f.id===tipo);

  const iniciar=()=>{
    if(!nombre.trim()){toast("Escribe el nombre del archivo","error");return;}
    setFase("uploading");setProgreso(0);
    const iv=setInterval(()=>{
      setProgreso(p=>{
        const next=p+Math.random()*10+4;
        if(next>=100){
          clearInterval(iv);
          const archivo=nombre.trim().endsWith(ft.ext)?nombre.trim():nombre.trim()+ft.ext;
          const size=tipo==="video"?Math.round(Math.random()*400+50)+" MB":(Math.random()*9+0.5).toFixed(1)+" MB";
          addLog(user,tipo,archivo,size);
          setFase("done");
          onDone&&onDone();
          toast(`${ft.label} "${archivo}" subido a S3 (${ft.bucket})  ✓`,"success");
          return 100;
        }
        return next;
      });
    },160);
  };

  const reset=()=>{setFase("idle");setProgreso(0);setNombre("");setTipo("foto");};

  if(fase==="done") return(
    <div style={{textAlign:"center",padding:"28px"}}>
      <div style={{fontSize:40,marginBottom:12}}>✅</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,color:C.grn,marginBottom:6}}>Subido correctamente a AWS S3</div>
      <div style={{fontFamily:"monospace",fontSize:11,color:C.t2,marginBottom:8}}>Bucket: <span style={{color:C.aws}}>{ft.bucket}</span></div>
      <div style={{fontFamily:"monospace",fontSize:10,color:C.t3,marginBottom:18}}>Equipo: {user.equipo} · IP: {user.ip}</div>
      <Btn onClick={reset} color={C.blue}>Subir otro archivo</Btn>
    </div>
  );

  if(fase==="uploading") return(
    <div style={{padding:"24px"}}>
      <div style={{textAlign:"center",fontSize:32,marginBottom:12}}>{ft.icon}</div>
      <div style={{fontFamily:"monospace",fontSize:12,color:C.t2,textAlign:"center",marginBottom:14}}>
        Subiendo <span style={{color:ft.color}}>{nombre}{ft.ext}</span> a S3...
      </div>
      <div style={{height:8,background:C.bor,borderRadius:99,overflow:"hidden",marginBottom:8}}>
        <div style={{height:"100%",width:`${progreso}%`,background:`linear-gradient(90deg,${C.blue},${ft.color})`,borderRadius:99,transition:"width 0.18s"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontFamily:"monospace",fontSize:11,color:C.t2}}>
        <span>Destino: s3://{ft.bucket}/</span>
        <span style={{color:ft.color,fontWeight:700}}>{Math.round(progreso)}%</span>
      </div>
      <div style={{marginTop:10,fontFamily:"monospace",fontSize:9,color:C.t3,textAlign:"center"}}>
        Equipo: {user.equipo} · IP: {user.ip}
      </div>
    </div>
  );

  return(
    <div style={{padding:"20px"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
        {FILE_TYPES.map(ft2=>(
          <div key={ft2.id} onClick={()=>setTipo(ft2.id)}
            style={{padding:"10px 8px",borderRadius:9,cursor:"pointer",textAlign:"center",
              background:tipo===ft2.id?`${ft2.color}20`:C.bg,
              border:`1px solid ${tipo===ft2.id?ft2.color:C.bor}`,transition:"all 0.15s"}}>
            <div style={{fontSize:20,marginBottom:3}}>{ft2.icon}</div>
            <div style={{fontFamily:"monospace",fontSize:10,color:tipo===ft2.id?ft2.color:C.t2}}>{ft2.label}</div>
          </div>
        ))}
      </div>
      <Field label={`Nombre del ${ft.label.toLowerCase()}`} value={nombre} onChange={setNombre} ph={`Ej. Mi_${ft.label}_2025`}/>
      <div style={{fontFamily:"monospace",fontSize:10,color:C.t3,marginBottom:14}}>
        Destino: <span style={{color:C.aws}}>s3://{ft.bucket}/</span> · Equipo: <span style={{color:C.cyn}}>{user.equipo}</span>
      </div>
      <Btn onClick={iniciar} color={ft.color}>☁ Subir {ft.label} a S3</Btn>
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

/* DASHBOARD */
function DashboardPage({me,toast,onNav,logVersion}){
  const tick=useTick(1200);
  const [jobs,setJobs]=useState([
    {id:1,name:"S3 — Media Bucket",pct:100,color:C.grn,label:"Completado"},
    {id:2,name:"RDS — DB Comercial",pct:72,color:C.b2,label:"En progreso",a:true},
    {id:3,name:"EBS — Volumen EC2",pct:28,color:C.aws,label:"En cola",a:true,slow:true},
  ]);
  useEffect(()=>{setJobs(j=>j.map(x=>x.a&&x.pct<100?{...x,pct:Math.min(100,x.pct+(x.slow?.4:.9))}:x));},[tick]);

  const myUploads = UPLOAD_LOG.filter(l=>l.uid===me.id);
  const totalAll  = UPLOAD_LOG.length;

  const stats = me.role==="admin"?[
    {label:"Total Subidas",   val:totalAll,              icon:"☁",  color:C.b2},
    {label:"Usuarios Activos",val:INIT_USERS.filter(u=>u.status==="active").length, icon:"👥",color:C.grn},
    {label:"Equipos Conectados",val:[...new Set(UPLOAD_LOG.map(l=>l.equipo))].length,icon:"🖥",color:C.aws},
    {label:"Storage Total",   val:"8.4 TB",              icon:"🪣",  color:C.pur},
  ]:me.role==="docente"?[
    {label:"Mis Subidas",     val:myUploads.length,      icon:"📤",  color:C.b2},
    {label:"Documentos",      val:myUploads.filter(l=>l.tipo==="documento").length,icon:"📄",color:C.grn},
    {label:"Alumnos Activos", val:INIT_USERS.filter(u=>u.role==="alumno"&&u.status==="active").length,icon:"🎓",color:C.aws},
    {label:"Mi Equipo",       val:me.equipo,             icon:"🖥",  color:C.cyn},
  ]:[
    {label:"Mis Subidas",     val:myUploads.length,      icon:"📤",  color:C.b2},
    {label:"Fotos",           val:myUploads.filter(l=>l.tipo==="foto").length,   icon:"📷",color:C.pnk},
    {label:"Videos",          val:myUploads.filter(l=>l.tipo==="video").length,  icon:"🎬",color:C.pur},
    {label:"Mi Equipo",       val:me.equipo,             icon:"🖥",  color:C.cyn},
  ];

  return(
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Syne',sans-serif",fontSize:21,fontWeight:800,marginBottom:4}}>
          {me.role==="admin"?"Panel de Control 🛡":me.role==="docente"?"Bienvenido, "+me.name.split(" ")[1]+" 📚":"Mi Portal Estudiantil 🎓"}
        </div>
        <div style={{fontSize:11,color:C.t2,display:"flex",gap:14,flexWrap:"wrap"}}>
          <span>{ROLE[me.role].icon} {ROLE[me.role].label}</span>
          <span style={{fontFamily:"monospace",color:C.cyn}}>{me.equipo}</span>
          <span style={{fontFamily:"monospace",color:C.t3}}>{me.ip}</span>
          <span style={{color:C.aws,fontFamily:"monospace",fontSize:10}}>AWS S3 · us-east-1</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:18}}>
        {stats.map((s,i)=>(
          <div key={s.label} style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,padding:"16px 18px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${s.color},transparent)`}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
              <span style={{fontFamily:"monospace",fontSize:9,color:C.t3,textTransform:"uppercase",letterSpacing:1.5}}>{s.label}</span>
              <span style={{fontSize:18}}>{s.icon}</span>
            </div>
            <div style={{fontFamily:"'Syne',sans-serif",fontSize:22,fontWeight:800,color:s.color}}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Gráfico siempre visible */}
      <div style={{marginBottom:16}}>
        <UploadChart logs={UPLOAD_LOG} key={logVersion}/>
      </div>

      {/* Backup + Alertas (solo admin/docente) */}
      {me.role!=="alumno"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.bor}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,display:"flex",gap:8,alignItems:"center"}}>
                Jobs de Backup
                <span style={{background:C.awG,border:"1px solid rgba(255,153,0,0.3)",color:C.aws,fontSize:8,padding:"2px 8px",borderRadius:99,fontFamily:"monospace"}}>AWS</span>
              </div>
              <span onClick={()=>toast("Nuevo job iniciado en AWS Backup ✓","success")} style={{fontSize:10,color:C.b2,cursor:"pointer",fontFamily:"monospace"}}>+ Nuevo job</span>
            </div>
            <div style={{padding:"16px 18px"}}>
              {jobs.map(j=>(
                <div key={j.id} style={{marginBottom:11}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:11}}>
                    <span>{j.name}</span><span style={{fontFamily:"monospace",fontSize:9,color:C.t3}}>{j.label}</span>
                  </div>
                  <div style={{height:4,background:C.bor,borderRadius:99,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${j.pct}%`,background:j.color,borderRadius:99,transition:"width .7s"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.bor}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800}}>Alertas & Eventos</span>
              <span onClick={()=>toast("Todas las alertas marcadas como leídas","success")} style={{fontSize:10,color:C.b2,cursor:"pointer",fontFamily:"monospace"}}>Marcar todo</span>
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
                    <div style={{fontSize:10.5,color:C.t2,lineHeight:1.4}}>{a.msg}</div>
                    <div style={{fontFamily:"monospace",fontSize:9,color:C.t3,marginTop:3}}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {me.role==="alumno"&&(
        <div style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,padding:"18px 20px",textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:10}}>☁</div>
          <div style={{fontFamily:"'Syne',sans-serif",fontSize:14,fontWeight:800,marginBottom:6}}>¿Listo para subir archivos?</div>
          <div style={{fontSize:11,color:C.t2,marginBottom:14}}>Sube tus fotos, videos, audios, documentos y más a AWS S3</div>
          <Btn onClick={()=>onNav("Subir Archivos")} color={C.grn}>📤 Ir a Subir Archivos</Btn>
        </div>
      )}
    </div>
  );
}

/* USUARIOS (solo admin) */
function UsersPage({me,toast,onRefresh}){
  const [users,setUsers]=useState([...INIT_USERS]);
  const [modal,setModal]=useState(null);
  const [form,setForm]=useState({name:"",email:"",pass:"",role:"alumno",equipo:"PC-Alumno-0X",ip:"192.168.2.X"});

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

  const byRole={admin:users.filter(u=>u.role==="admin"),docente:users.filter(u=>u.role==="docente"),alumno:users.filter(u=>u.role==="alumno")};

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
          <div style={{ fontSize: 11, color: C.t2, marginTop: 2 }}>Registro de todas las subidas a AWS S3 · por equipo e IP</div>
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

      {/* Gráfico */}
      <div style={{ marginBottom: 18 }}>
        <UploadChart logs={logs} key={logVersion} />
      </div>

      {/* Tabla */}
      <div style={{ background: C.sur, border: `1px solid ${C.bor}`, borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr>
              {["Timestamp", "Usuario", "Rol", "Equipo / IP", "Tipo", "Archivo", "Bucket S3", "Estado"].map(h => (
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
                  {/* Celda Rol */}
                  <td style={{ padding: "9px 14px" }}>
                    <span style={{ background: `${roleColor[l.role] || C.t2}20`, color: roleColor[l.role] || C.t2, padding: "2px 6px", borderRadius: 4, fontSize: 10 }}>
                      {ROLE[l.role]?.icon} {ROLE[l.role]?.label || l.role}
                    </span>
                  </td>
                  <td style={{ padding: "9px 14px" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 9, color: C.cyn }}>{l.equipo}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 9, color: C.t3 }}>{l.ip}</div>
                  </td>
                  <td style={{ padding: "9px 14px" }}><span style={{ fontSize: 16 }}>{ft.icon}</span></td>
                  <td style={{ padding: "9px 14px", fontFamily: "monospace", fontSize: 10, color: C.txt, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.archivo}</td>
                  <td style={{ padding: "9px 14px", fontFamily: "monospace", fontSize: 9, color: C.aws }}>{l.bucket}</td>
                  {/* Celda Estado */}
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
function MisArchivosPage({me,toast,logVersion}){
  const [logs,setLogs]=useState(UPLOAD_LOG.filter(l=>l.uid===me.id));
  const tick=useTick(3000);
  useEffect(()=>setLogs(UPLOAD_LOG.filter(l=>l.uid===me.id)),[tick,logVersion]);

  const tipoFt=(t)=>FILE_TYPES.find(f=>f.id===t)||{icon:"📦",color:C.t2,label:"Archivo"};

  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:4}}>Mis Archivos en S3</div>
      <div style={{fontSize:11,color:C.t2,marginBottom:6}}>Equipo: <span style={{color:C.cyn,fontFamily:"monospace"}}>{me.equipo}</span> · IP: <span style={{fontFamily:"monospace",color:C.t3}}>{me.ip}</span></div>

      {/* Mini gráfico propio */}
      {logs.length>0&&<div style={{marginBottom:18}}><UploadChart logs={logs}/></div>}

      <div style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:12,overflow:"hidden"}}>
        {logs.length===0&&<div style={{padding:"48px",textAlign:"center",color:C.t3,fontFamily:"monospace",fontSize:12}}>Aún no has subido archivos. Ve a <b>Subir Archivos</b>.</div>}
        {logs.length>0&&(
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["Tipo","Archivo","Tamaño","Bucket S3","Fecha"].map(h=>(
              <th key={h} style={{textAlign:"left",fontFamily:"monospace",fontSize:8,textTransform:"uppercase",letterSpacing:1.5,color:C.t3,padding:"10px 16px",borderBottom:`1px solid ${C.bor}`}}>{h}</th>
            ))}</tr></thead>
            <tbody>{logs.map(l=>{
              const ft=tipoFt(l.tipo);
              return(
                <tr key={l.id} style={{borderBottom:`1px solid ${C.bor}`}}>
                  <td style={{padding:"11px 16px"}}><span style={{fontSize:20}}>{ft.icon}</span></td>
                  <td style={{padding:"11px 16px",fontSize:13,fontWeight:600}}>{l.archivo}</td>
                  <td style={{padding:"11px 16px",fontFamily:"monospace",fontSize:10,color:C.t3}}>{l.size}</td>
                  <td style={{padding:"11px 16px",fontFamily:"monospace",fontSize:10,color:C.aws}}>{l.bucket}</td>
                  <td style={{padding:"11px 16px",fontFamily:"monospace",fontSize:10,color:C.t3}}>{l.ts}</td>
                </tr>
              );
            })}</tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* SUBIR ARCHIVOS */
function SubirPage({me,toast,onRefresh}){
  return(
    <div>
      <div style={{fontFamily:"'Syne',sans-serif",fontSize:20,fontWeight:800,marginBottom:4}}>Subir Archivos a AWS S3</div>
      <div style={{fontSize:11,color:C.t2,marginBottom:18}}>Equipo: <span style={{color:C.cyn,fontFamily:"monospace"}}>{me.equipo}</span> · IP: <span style={{fontFamily:"monospace",color:C.t3}}>{me.ip}</span></div>
      <div style={{background:C.sur,border:`1px solid ${C.bor}`,borderRadius:13,overflow:"hidden"}}>
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

  const toast=(msg,type="info")=>setToastS({msg,type,k:Date.now()});
  const refresh=()=>setLogVer(v=>v+1);
  const logout=()=>{setSession(null);setPage("Dashboard");};

  if(!session) return <LoginPage onLogin={u=>{setSession(u);setPage("Dashboard");}}/>;

  const nav=ROLE[session.role]?.nav||["Dashboard"];
  const rc=ROLE[session.role]?.color||C.t2;

  const renderPage=()=>{
    switch(page){
      case "Dashboard":        return <DashboardPage me={session} toast={toast} onNav={setPage} logVersion={logVer}/>;
      case "Usuarios":         return <UsersPage me={session} toast={toast} onRefresh={refresh}/>;
      case "Monitor Archivos": return <MonitorPage toast={toast} logVersion={logVer}/>;
      case "Subir Archivos":   return <SubirPage me={session} toast={toast} onRefresh={refresh}/>;
      case "Mis Archivos":     return <MisArchivosPage me={session} toast={toast} logVersion={logVer}/>;
      case "Servicios AWS":    return <AwsServicesPage toast={toast}/>;
      case "Configuración":    return <ConfigPage me={session} toast={toast}/>;
      default:                 return <DashboardPage me={session} toast={toast} onNav={setPage} logVersion={logVer}/>;
    }
  };

  return(
    <div style={{display:"flex",height:"100vh",background:C.bg,color:C.txt,overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1c2d50;border-radius:99px}
        input,select,textarea,button{font-family:inherit;}
        body{font-family:'IBM Plex Mono',monospace;}
      `}</style>

      {/* SIDEBAR */}
      <aside style={{width:240,background:C.sur,borderRight:`1px solid ${C.bor}`,display:"flex",flexDirection:"column",flexShrink:0}}>
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

        {/* Role badge */}
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
            const icons={"Dashboard":"⬡","Usuarios":"👥","Monitor Archivos":"📊","Subir Archivos":"📤","Mis Archivos":"📁","Servicios AWS":"☁","Configuración":"⚙"};
            return(
              <div key={item} onClick={()=>setPage(item)}
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

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <header style={{background:C.sur,borderBottom:`1px solid ${C.bor}`,height:54,display:"flex",alignItems:"center",gap:12,padding:"0 22px",flexShrink:0}}>
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