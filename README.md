# ☁ CloudCorp — Plataforma Cloud de Gestión Comercial & Backup Multimedia

> **Intranet Corporativa B2E (Business to Employee)**  
> Proyecto de simulación para el curso de **Cloud Computing** — AWS

---

## 📋 Descripción

Plataforma web corporativa interna (B2E) para gestión comercial y backup multimedia,
diseñada para ser desplegada sobre infraestructura **Amazon Web Services (AWS)**.

### Funcionalidades del Dashboard:
- 📊 Métricas en tiempo real (Clientes, Storage S3, Backups, Costos AWS)
- ⚡ Acciones rápidas (Iniciar Backup, Nuevo Contrato, Subir Media, Ver Reporte)
- 🟠 Monitor de Servicios AWS (EC2, S3, RDS, CloudFront, IAM, AWS Backup)
- 🍩 Gráfico de almacenamiento S3 con desglose por tipo
- 🔄 Jobs de Backup con progreso animado en tiempo real
- 🔔 Panel de Alertas & Eventos (errores, advertencias, confirmaciones)
- 📋 Tabla de actividad de empleados con auditoría de accesos AWS

---

## 🏗 Arquitectura AWS

```
Internet
   │
   ▼
Amazon CloudFront (CDN)
   │
   ▼
Amazon S3 (hosting frontend estático)
   │
   ▼
Application Load Balancer
   │
   ▼
Amazon EC2 (t3.medium × 4 — Auto Scaling)
   │
   ├── Amazon RDS MySQL (Multi-AZ)
   ├── Amazon S3 (multimedia + backups)
   ├── AWS Backup (planes automáticos)
   ├── Amazon Cognito (autenticación B2E)
   ├── AWS IAM (control de acceso)
   └── Amazon CloudWatch (monitoreo)
```

---

## 🚀 Instalación y Ejecución Local

### Pre-requisitos:
- Node.js v16 o superior
- npm v8 o superior

### Pasos:
```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/cloudcorp-intranet-b2e.git
cd cloudcorp-intranet-b2e

# 2. Instalar dependencias
npm install

# 3. Iniciar en modo desarrollo
c
# La app abre en: http://localhost:3000
```

---

## 📦 Build para Producción (AWS S3)

```bash
# Generar build optimizado
npm run build

# Subir a S3
aws s3 sync build/ s3://TU-BUCKET-NAME --delete

# Invalidar caché CloudFront (opcional)
aws cloudfront create-invalidation \
  --distribution-id TU_DISTRIBUTION_ID \
  --paths "/*"
```

---

## 🛠 Tecnologías Utilizadas

| Tecnología       | Uso                                    |
|------------------|----------------------------------------|
| React 18         | Frontend SPA                           |
| CSS-in-JS        | Estilos inline con variables           |
| IBM Plex Mono    | Tipografía monoespaciada               |
| Syne             | Tipografía display/headings            |
| Amazon S3        | Almacenamiento + hosting estático      |
| Amazon EC2       | Servidores de aplicación               |
| Amazon RDS       | Base de datos MySQL Multi-AZ           |
| AWS Backup       | Respaldo automatizado                  |
| Amazon CloudFront| CDN para distribución de contenido     |
| AWS IAM          | Control de acceso y políticas          |
| Amazon Cognito   | Autenticación corporativa B2E          |
| Amazon CloudWatch| Monitoreo y alertas                    |

---

## 📁 Estructura del Proyecto

```
cloudcorp-intranet-b2e/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx        # Navegación lateral
│   │   ├── Topbar.jsx         # Barra superior
│   │   ├── MetricCard.jsx     # Tarjetas de métricas
│   │   ├── AwsServices.jsx    # Monitor servicios AWS
│   │   ├── BackupJobs.jsx     # Jobs de backup animados
│   │   ├── StorageDonut.jsx   # Gráfico donut S3
│   │   ├── AlertsPanel.jsx    # Panel de alertas
│   │   ├── BarChart.jsx       # Gráfico de actividad
│   │   └── ActivityTable.jsx  # Tabla de actividad
│   ├── data/
│   │   └── constants.js       # Datos y configuración
│   ├── App.jsx                # Componente raíz
│   ├── index.js               # Entry point
│   └── index.css              # Estilos globales
├── package.json
└── README.md
```

---

## 🔗 Simulación con VirtualBox

Para simular el entorno AWS con VirtualBox:
1. Instalar una VM Ubuntu Server 22.04
2. Instalar Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
3. Clonar el repo y ejecutar `npm install && npm start`
4. Acceder desde el host en: `http://IP_DE_LA_VM:3000`

---

## 📄 Licencia

Proyecto académico — Curso Cloud Computing.
