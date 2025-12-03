# 🐾 Cuidados Los Patitos S.A.

Sistema web para gestión de guardería de mascotas desarrollado con arquitectura en capas (MVC).

## 📋 Descripción del Proyecto

**Cuidados Los Patitos S.A.** es un emprendimiento que nace de la necesidad de las personas de tener un cuidador profesional para sus mascotas. Con el crecimiento exponencial del sector (6 de cada 10 personas poseen una mascota), brindamos servicios de cuidados, guardería y acompañamiento mientras los dueños trabajan o viajan.

Este sistema web facilita la gestión completa de:
- 📝 Registro y gestión de mascotas
- 🏥 Asignación de veterinarios
- 📅 Sistema de reservas de guardería
- 🎯 Cuidados especiales (alergias, dietas, medicamentos)
- 👥 Gestión de dueños y clientes

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

**Frontend:**
- ⚛️ React.js 18
- 🎨 Tailwind CSS
- 📱 Responsive Design
- 🔄 React Query (manejo de estado)
- 📋 React Hook Form (formularios)

**Backend:**
- 🟢 Node.js con Express.js
- 🏗️ Arquitectura MVC en capas
- 🔐 Middleware de seguridad
- ✅ Validación de datos
- 📝 Logging y manejo de errores

**Base de Datos:**
- 🗄️ Microsoft SQL Server Express
- 📊 Modelo relacional normalizado
- 🔍 Índices optimizados
- 🔄 Triggers automáticos

## 📁 Estructura del Proyecto

```
Proyecto/
├── 📂 frontend/          # Aplicación React
│   ├── 📂 src/
│   │   ├── 📂 components/    # Componentes reutilizables
│   │   ├── 📂 pages/         # Páginas principales
│   │   ├── 📂 services/      # Servicios API
│   │   ├── 📂 hooks/         # Custom hooks
│   │   └── 📂 utils/         # Utilidades
│   ├── 📄 package.json
│   └── 📄 tailwind.config.js
├── 📂 backend/           # API Express.js
│   ├── 📂 controllers/       # Controladores MVC
│   ├── 📂 models/            # Modelos de datos
│   ├── 📂 routes/            # Rutas API
│   ├── 📂 config/            # Configuración
│   ├── 📂 middleware/        # Middleware personalizado
│   ├── 📄 server.js          # Servidor principal
│   └── 📄 package.json
├── 📂 database/          # Scripts SQL
│   ├── 📄 01_create_database.sql
│   └── 📄 02_sample_data.sql
├── 📄 package.json       # Scripts principales
└── 📄 README.md
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- 🟢 Node.js (v16 o superior)
- 🗄️ SQL Server Express
- 📦 npm o yarn

### 1. Clonar el Repositorio

```bash
git clone [url-del-repositorio]
cd "Arquitectura de Software/Proyecto"
```

### 2. Configurar Base de Datos

1. **Instalar SQL Server Express** (si no está instalado)
2. **Ejecutar scripts de base de datos:**
   ```sql
   -- En SQL Server Management Studio
   -- 1. Ejecutar: database/01_create_database.sql
   -- 2. Ejecutar: database/02_sample_data.sql
   ```

### 3. Configurar Backend

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de SQL Server
```

**Configuración de `.env`:**
```env
PORT=3001
DB_SERVER=localhost
DB_NAME=CuidadosLosPatitos
DB_USER=sa
DB_PASSWORD=TuPasswordSegura123!
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 4. Configurar Frontend

```bash
# Navegar al directorio frontend
cd ../frontend

# Instalar dependencias
npm install
```

### 5. Ejecutar el Sistema

**Opción 1: Ejecutar todo desde la raíz**
```bash
# Desde el directorio raíz del proyecto
npm install
npm run dev
```

**Opción 2: Ejecutar por separado**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 🌐 URLs de Acceso

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

## 📚 API Endpoints

### 🐾 Mascotas (`/api/pets`)
```
GET    /api/pets              # Listar todas las mascotas
GET    /api/pets/:id          # Obtener mascota por ID
POST   /api/pets              # Crear nueva mascota
PUT    /api/pets/:id          # Actualizar mascota
DELETE /api/pets/:id          # Eliminar mascota
GET    /api/pets/owner/:cedula # Mascotas por cédula del dueño
GET    /api/pets/special-care # Mascotas con cuidados especiales
```

### 👥 Dueños (`/api/owners`)
```
GET    /api/owners                    # Listar todos los dueños
GET    /api/owners/:id               # Obtener dueño por ID
POST   /api/owners                   # Crear nuevo dueño
PUT    /api/owners/:id               # Actualizar dueño
DELETE /api/owners/:id               # Eliminar dueño
GET    /api/owners/cedula/:cedula    # Buscar por cédula
```

### 📅 Reservas (`/api/reservations`)
```
GET    /api/reservations             # Listar reservas
GET    /api/reservations/:id         # Obtener reserva por ID
POST   /api/reservations             # Crear reserva
PUT    /api/reservations/:id         # Actualizar reserva
DELETE /api/reservations/:id         # Eliminar reserva
GET    /api/reservations/active      # Reservas activas
```

## 🗄️ Modelo de Base de Datos

### Tablas Principales

**Owners (Dueños)**
- `id`, `name`, `cedula`, `phone`, `email`, `address`
- `emergency_contact`, `emergency_phone`

**Pets (Mascotas)**
- `id`, `name`, `owner_name`, `owner_cedula`
- `admission_date`, `specialist_id`
- `allergies`, `bandage_changes`, `special_diet`

**Reservations (Reservas)**
- `id`, `pet_id`, `start_date`, `end_date`
- `service_type`, `status`, `total_cost`, `payment_status`

## 🎨 Características de la Interfaz

### 🏠 Página Principal
- Hero section atractivo
- Showcase de servicios
- Testimonios de clientes
- Estadísticas del negocio

### 📱 Diseño Responsivo
- ✅ Mobile-first design
- ✅ Navegación adaptable
- ✅ Componentes flexibles
- ✅ Touch-friendly

### 🎯 Funcionalidades Implementadas
- ✅ Registro de mascotas con validación
- ✅ Gestión de cuidados especiales
- ✅ Asignación de veterinarios
- ✅ Búsqueda y filtrado
- ✅ Interfaz intuitiva

## 🔧 Scripts Disponibles

### Raíz del Proyecto
```bash
npm run dev              # Ejecutar frontend y backend
npm run backend:dev      # Solo backend
npm run frontend:dev     # Solo frontend
npm run install:all      # Instalar todas las dependencias
```

### Backend
```bash
npm start               # Producción
npm run dev            # Desarrollo con nodemon
```

### Frontend
```bash
npm start              # Servidor de desarrollo
npm run build          # Build para producción
npm test               # Ejecutar tests
```

## 🤝 Contribución

Este proyecto es para fines académicos de la materia de Arquitectura de Software.

### Equipo de Desarrollo
- 👨‍💻 **Desarrollador Principal:**
- 🏛️ **Institución:** UIA
- 📚 **Materia:** Arquitectura de Software

## 📋 Requerimientos Cumplidos

### ✅ Requerimiento 1 (10%)
- [x] Sistema web funcional para empresa ficticia
- [x] Interfaz completa y navegable
- [x] Funcionalidades principales implementadas

### ✅ Requerimiento 2 (10%)
- [x] Arquitectura en capas (MVC)
- [x] Base de datos en SQL Server Express
- [x] Buenas prácticas aplicadas
- [x] Separación clara de responsabilidades

### 📋 Funcionalidades del Sistema
- [x] Página principal informativa
- [x] Módulo de registro de mascotas
- [x] Gestión de cuidados especiales:
  - [x] Alergias
  - [x] Cambios de vendajes
  - [x] Dietas especiales
- [x] Asignación de veterinarios
- [x] Base para sistema de reservas

## 🚀 Próximas Características

- [ ] Sistema completo de reservas
- [ ] Autenticación de usuarios
- [ ] Dashboard administrativo
- [ ] Notificaciones por email
- [ ] Reportes y estadísticas
- [ ] Sistema de pagos
- [ ] App móvil

## 📞 Soporte

Para preguntas o problemas técnicos:
- 📧 Email: [tu-email@estudiante.edu]
- 🐛 Issues: [Crear issue en el repositorio]

---

**📅 Última actualización:** Noviembre 2024  
**🎓 Proyecto Académico** - Arquitectura de Software  
**🏢 Desarrollado para:** Cuidados Los Patitos S.A. (Empresa Ficticia)