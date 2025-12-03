# 🐾 Cuidados Los Patitos S.A.

Sistema web completo para gestión de guardería de mascotas desarrollado con arquitectura en capas (MVC).

## 📋 Descripción del Proyecto

**Cuidados Los Patitos S.A.** es una plataforma integral para la gestión de servicios de guardería y cuidado de mascotas. El sistema facilita la administración completa del negocio, desde el registro de clientes y sus mascotas hasta el monitoreo en tiempo real mediante cámaras.

### Funcionalidades Principales

- 🔐 **Sistema de Autenticación y Roles:**
  - Autenticación JWT con tokens seguros
  - 4 roles diferenciados: Administrador, Recepcionista, Veterinario, Usuario Normal
  - Control de acceso basado en permisos
  - Dashboards personalizados por rol

- 📝 **Gestión de Mascotas:**
  - Registro de mascotas con información completa
  - Sistema de aprobación para nuevas mascotas
  - Gestión de cuidados especiales (alergias, dietas, vendajes)
  - Historial médico y de servicios

- 🏠 **Gestión de Habitaciones:**
  - Habitaciones individuales, compartidas y con cámara
  - Control de estados (Disponible, Ocupada, En Mantenimiento)
  - Asignación automática según tipo de servicio
  - Historial de limpieza y mantenimiento

- 📅 **Sistema de Reservaciones:**
  - Creación de reservas con selección de servicios
  - Estados: Pendiente, Confirmada, Check-In, Activa, Completada
  - Cálculo automático de costos
  - Gestión de paquetes adicionales (juegos, paseos, piscina, terapias)

- 📹 **Monitoreo en Tiempo Real:**
  - Sistema de cámaras para habitaciones especiales
  - Visualización en vivo para clientes
  - Acceso admin a todas las cámaras
  - Control de activación/desactivación de cámaras

- 👥 **Gestión de Personal:**
  - Registro de especialistas y veterinarios
  - Asignación de turnos de trabajo
  - Control de tareas y responsabilidades

- 💰 **Sistema de Pagos:**
  - Estados de pago (Pendiente, Pagado, Reembolsado)
  - Cálculo de costos según servicios
  - Historial de transacciones

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

### 🔐 Autenticación (`/api/auth`)
```
POST   /api/auth/register           # Registrar nuevo usuario
POST   /api/auth/login              # Iniciar sesión (JWT)
POST   /api/auth/logout             # Cerrar sesión
GET    /api/auth/profile            # Obtener perfil del usuario
```

### 🐾 Mascotas (`/api/pets`)
```
GET    /api/pets                     # Listar mascotas (filtrado por rol)
GET    /api/pets/:id                 # Obtener mascota por ID
POST   /api/pets                     # Crear nueva mascota
PUT    /api/pets/:id                 # Actualizar mascota
DELETE /api/pets/:id                 # Eliminar mascota
PATCH  /api/pets/:id/approve         # Aprobar mascota (Admin/Recepcionista)
```

### 👥 Dueños (`/api/owners`)
```
GET    /api/owners                   # Listar todos los dueños
GET    /api/owners/:id               # Obtener dueño por ID
POST   /api/owners                   # Crear nuevo dueño
PUT    /api/owners/:id               # Actualizar dueño
DELETE /api/owners/:id               # Eliminar dueño
```

### 📅 Reservas (`/api/reservations`)
```
GET    /api/reservations             # Listar reservas (filtrado por rol)
GET    /api/reservations/:id         # Obtener reserva por ID
POST   /api/reservations             # Crear reserva
PUT    /api/reservations/:id         # Actualizar reserva
DELETE /api/reservations/:id         # Eliminar reserva
PATCH  /api/reservations/:id/checkin # Hacer check-in
PATCH  /api/reservations/:id/checkout # Hacer check-out
```

### 🏠 Habitaciones (`/api/rooms`)
```
GET    /api/rooms                    # Listar habitaciones
GET    /api/rooms/:id                # Obtener habitación por ID
POST   /api/rooms                    # Crear habitación
PUT    /api/rooms/:id                # Actualizar habitación
DELETE /api/rooms/:id                # Eliminar habitación
PATCH  /api/rooms/:id/status         # Cambiar estado de habitación
GET    /api/rooms/available          # Habitaciones disponibles
```

### 👨‍⚕️ Especialistas (`/api/specialists`)
```
GET    /api/specialists              # Listar especialistas
GET    /api/specialists/:id          # Obtener especialista por ID
POST   /api/specialists              # Crear especialista
PUT    /api/specialists/:id          # Actualizar especialista
DELETE /api/specialists/:id          # Eliminar especialista
```

### 📹 Monitoreo de Cámaras (`/api/camera`)
```
GET    /api/camera/my-pets           # Mascotas con acceso a cámara
GET    /api/camera/access/:petId     # Verificar acceso a cámara
GET    /api/camera/stream/:roomId    # Stream de cámara de habitación
```

## 🗄️ Modelo de Base de Datos

### Arquitectura de Base de Datos

El sistema utiliza **SQL Server Express** con un modelo relacional normalizado que incluye:

**Tablas Principales:**

- **Users**: Usuarios del sistema con roles diferenciados
- **Owners**: Dueños de mascotas (vinculados a Users)
- **Pets**: Información de mascotas (con aprobación requerida)
- **Reservations**: Reservas de servicios
- **Rooms**: Habitaciones disponibles
- **Specialists**: Personal especializado
- **PetSpecialCare**: Cuidados especiales de mascotas

**Tablas de Catálogo (Cat_):**

- **Cat_UserRoles**: Roles del sistema (Administrador, Recepcionista, Veterinario, Usuario Normal)
- **Cat_Species**: Especies de mascotas (Perro, Gato, Ave, etc.)
- **Cat_Breeds**: Razas por especie
- **Cat_ServiceTypes**: Tipos de servicios (Guardería, Hospedaje, Hotel)
- **Cat_RoomTypes**: Tipos de habitación (Individual, Compartida, Con Cámara)
- **Cat_RoomStatuses**: Estados de habitación (Disponible, Ocupada, En Mantenimiento)
- **Cat_ReservationStatuses**: Estados de reserva
- **Cat_PaymentStatuses**: Estados de pago
- **Cat_WorkShifts**: Turnos de trabajo
- **Cat_AssistanceLevels**: Niveles de asistencia
- **Cat_StaySchedules**: Horarios de estadía

### Características de la Base de Datos

- ✅ Normalización 3NF
- ✅ Integridad referencial con FK
- ✅ Índices optimizados para búsquedas
- ✅ Triggers para auditoría
- ✅ Stored procedures para operaciones complejas
- ✅ Vistas para reportes

## 🎨 Características de la Interfaz

### 🏠 Página Principal
- Hero section con información del negocio
- Showcase de servicios disponibles
- Sistema de navegación intuitivo
- Llamadas a acción claras

### 📱 Diseño Responsivo
- ✅ Mobile-first design
- ✅ Navegación adaptable
- ✅ Componentes flexibles
- ✅ Touch-friendly en dispositivos móviles
- ✅ Optimizado para tablets y desktop

### 👥 Dashboards Diferenciados

**Dashboard de Administrador:**
- Vista general de estadísticas del sistema
- Alertas de mascotas pendientes de aprobación
- Acceso rápido a todos los módulos
- Monitoreo de ocupación de habitaciones
- Gestión completa del personal

**Dashboard de Cliente:**
- Vista de mascotas registradas
- Estado de reservaciones activas
- Historial de servicios
- Acceso a monitoreo de cámaras
- Opciones para nueva reserva

**Dashboard de Recepcionista:**
- Gestión de check-in/check-out
- Aprobación de mascotas
- Administración de reservas
- Control de habitaciones

**Dashboard de Veterinario:**
- Vista de mascotas en guardería
- Información médica relevante
- Acceso a monitoreo

### 🎯 Funcionalidades por Módulo

**Módulo de Mascotas:**
- ✅ Registro con validación completa
- ✅ Sistema de aprobación (Admin/Recepcionista)
- ✅ Gestión de cuidados especiales
- ✅ Asociación con dueños
- ✅ Historial de servicios

**Módulo de Reservaciones:**
- ✅ Creación paso a paso
- ✅ Selección de tipo de habitación
- ✅ Configuración de paquetes adicionales
- ✅ Cálculo automático de costos
- ✅ Gestión de estados

**Módulo de Habitaciones:**
- ✅ Visualización de disponibilidad
- ✅ Cambio de estados
- ✅ Asignación automática
- ✅ Tipos especiales (con cámara)

**Módulo de Monitoreo:**
- ✅ Lista de mascotas con cámara
- ✅ Visualización en tiempo real
- ✅ Control de activación/desactivación
- ✅ Información de habitación
- ✅ Acceso diferenciado por rol

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

## 🔐 Sistema de Seguridad

### Autenticación y Autorización

**JWT (JSON Web Tokens):**
- Tokens seguros con expiración
- Renovación automática de sesión
- Logout seguro con limpieza de tokens

**Control de Acceso Basado en Roles (RBAC):**
- 4 roles con permisos diferenciados
- Middleware de verificación en backend
- Componente `ProtectedRoute` en frontend
- Validación doble (cliente y servidor)

**Roles y Permisos:**

| Rol | Permisos |
|-----|----------|
| **Administrador** | Acceso total al sistema, gestión de usuarios, aprobación de mascotas, configuración |
| **Recepcionista** | Check-in/out, aprobación de mascotas, gestión de reservas, habitaciones |
| **Veterinario** | Acceso a información médica, monitoreo de mascotas |
| **Usuario Normal** | Registro de mascotas, creación de reservas, monitoreo de sus mascotas |

**Características de Seguridad:**
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de datos en frontend y backend
- ✅ Protección contra inyección SQL
- ✅ Sanitización de inputs
- ✅ Headers de seguridad (CORS, Helmet)
- ✅ Rate limiting en endpoints críticos

## 🎯 Flujos de Trabajo Principales

### Flujo de Registro de Cliente y Mascota
1. Usuario se registra en el sistema
2. Completa perfil de dueño
3. Registra información de mascota
4. Admin/Recepcionista revisa y aprueba
5. Mascota queda disponible para reservas

### Flujo de Reservación
1. Cliente selecciona mascota aprobada
2. Elige tipo de servicio y fechas
3. Selecciona tipo de habitación
4. Configura paquetes adicionales
5. Sistema calcula costo total
6. Confirma reservación
7. Sistema asigna habitación disponible
8. Cliente puede hacer check-in en fecha indicada

### Flujo de Check-In
1. Recepcionista verifica reservación
2. Confirma estado de mascota
3. Realiza check-in en sistema
4. Habitación cambia a estado "Ocupada"
5. Si tiene cámara, cliente obtiene acceso a monitoreo

### Flujo de Monitoreo
1. Cliente accede a módulo de monitoreo
2. Sistema verifica reservación activa con cámara
3. Cliente ve lista de sus mascotas con cámara
4. Puede activar/desactivar visualización
5. Admin/Veterinario puede ver todas las cámaras

## 📊 Tecnologías y Herramientas

### Frontend
- **React 18**: Framework principal
- **React Router**: Navegación SPA
- **Tailwind CSS**: Estilos utility-first
- **React Hook Form**: Manejo de formularios
- **React Toastify**: Notificaciones
- **Lucide React**: Iconos modernos
- **Axios**: Cliente HTTP

### Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web
- **bcryptjs**: Hash de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **express-validator**: Validación de datos
- **mssql**: Driver SQL Server
- **cors**: Manejo de CORS
- **dotenv**: Variables de entorno

### Base de Datos
- **SQL Server Express**: RDBMS
- **Modelo Relacional**: Normalizado 3NF
- **Triggers**: Auditoría automática
- **Stored Procedures**: Operaciones complejas
- **Views**: Consultas optimizadas

## 🔧 Configuración Avanzada

### Variables de Entorno Backend

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_SERVER=localhost
DB_NAME=CuidadosLosPatitos
DB_USER=sa
DB_PASSWORD=YourSecurePassword
DB_ENCRYPT=false
DB_TRUST_CERT=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Scripts de Base de Datos

El directorio `database/` contiene scripts SQL organizados:

1. **00_MASTER_INSTALL.sql**: Script maestro de instalación
2. **01_create_database.sql**: Creación de base de datos y tablas
3. **02_insert_catalog_data.sql**: Datos de catálogo (tipos, estados)
4. **03_insert_sample_data.sql**: Datos de prueba
5. **04_views_and_procedures.sql**: Vistas y procedimientos almacenados
6. **05_update_passwords.sql**: Hasheo de contraseñas
7. **06_add_isapproved_column.sql**: Columna de aprobación de mascotas

## 🧪 Testing

### Scripts de Prueba Backend

El proyecto incluye múltiples scripts de prueba:

```bash
# Probar conexión a base de datos
node backend/scripts/testConnection.js

# Probar login
node backend/scripts/testLogin.js

# Probar creación de mascotas
node backend/scripts/testPetFiltering.js

# Probar sistema de reservas
node backend/scripts/testReservations.js

# Probar monitoreo de cámaras
node backend/scripts/testMonitoring.js
```

## 📚 Documentación Adicional

- **ROLES_Y_PERMISOS.md**: Documentación detallada del sistema de roles
- **AUTH_SETUP.md**: Configuración de autenticación
- **DATABASE_DIAGRAM.md**: Diagrama de base de datos
- **QUERY_EXAMPLES.sql**: Ejemplos de consultas útiles

## 🚀 Despliegue

### Preparación para Producción

1. **Frontend:**
   ```bash
   cd frontend
   npm run build
   # Los archivos compilados estarán en build/
   ```

2. **Backend:**
   - Configurar variables de entorno de producción
   - Usar HTTPS
   - Configurar JWT_SECRET seguro
   - Habilitar rate limiting
   - Configurar logs

3. **Base de Datos:**
   - Migrar a SQL Server completo si es necesario
   - Configurar backups automáticos
   - Optimizar índices
   - Revisar planes de ejecución

---

**📅 Última actualización:** Diciembre 2024  
**🎓 Proyecto Académico** - Arquitectura de Software  
**🏢 Sistema desarrollado para:** Cuidados Los Patitos S.A. (Empresa Ficticia)