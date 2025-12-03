# Sistema de Roles y Permisos

## Descripción General

El sistema cuenta con una arquitectura de roles que controla el acceso a diferentes funcionalidades según el tipo de usuario. Esto garantiza la seguridad y privacidad de la información sensible.

## Roles Disponibles

### 1. **Usuario Normal (Cliente)**
- **Descripción**: Dueños de mascotas
- **Acceso**: 
  - ✅ Dashboard de cliente
  - ✅ Registrar mascotas (sujeto a aprobación)
  - ✅ Ver sus propias mascotas
  - ✅ Ver su historial de reservaciones
  - ✅ Crear nuevas reservaciones
  - ❌ NO tiene acceso a información administrativa
  - ❌ NO puede ver datos de otros clientes
  - ❌ NO puede gestionar habitaciones, veterinarios o especialistas

### 2. **Administrador**
- **Descripción**: Acceso total al sistema
- **Acceso**:
  - ✅ Dashboard administrativo con estadísticas completas
  - ✅ Gestión completa de mascotas (aprobar/rechazar registros)
  - ✅ Gestión de todas las reservaciones
  - ✅ Gestión de habitaciones
  - ✅ Gestión de veterinarios
  - ✅ Gestión de especialistas
  - ✅ Gestión de dueños/clientes
  - ✅ Acceso a todos los módulos del sistema

### 3. **Veterinario**
- **Descripción**: Personal médico veterinario
- **Acceso**:
  - ✅ Dashboard administrativo
  - ✅ Ver información de mascotas
  - ✅ Ver información de veterinarios
  - ✅ Gestión médica de mascotas

### 4. **Recepcionista**
- **Descripción**: Personal de recepción
- **Acceso**:
  - ✅ Dashboard administrativo
  - ✅ Gestión de reservaciones
  - ✅ Gestión de habitaciones
  - ✅ Ver información de dueños
  - ✅ Check-in/Check-out

## Estructura del Sistema

### Componentes de Seguridad

#### `ProtectedRoute.js`
Componente que protege rutas basándose en:
- Estado de autenticación
- Roles permitidos

```javascript
<ProtectedRoute allowedRoles={['Administrador']}>
  <ComponenteProtegido />
</ProtectedRoute>
```

#### `useAuth.js` Hook
Hook personalizado que maneja:
- Estado de autenticación
- Información del usuario
- Funciones de login/logout
- Verificación de roles

### Dashboards Diferenciados

#### Dashboard de Cliente (`/client-dashboard`)
- Estadísticas personales
- Estado de mascotas registradas
- Historial de reservaciones
- Acciones rápidas: registrar mascota, nueva reserva

#### Dashboard de Administrador (`/admin-dashboard`)
- Estadísticas globales del sistema
- Alertas de mascotas pendientes de aprobación
- Ocupación de habitaciones
- Acceso rápido a todos los módulos administrativos

## Navegación por Rol

### Navbar para Clientes
- Inicio
- Mis Mascotas
- Mis Reservas
- Nueva Reserva

### Navbar para Administradores
- Inicio
- Mascotas
- Reservas
- Habitaciones
- Especialistas
- Veterinarios
- Dueños

## Flujo de Registro de Mascotas

1. **Cliente registra mascota**: El dueño completa el formulario de registro
2. **Estado pendiente**: La mascota queda en estado "Pendiente de Aprobación"
3. **Notificación al admin**: El dashboard administrativo muestra una alerta
4. **Revisión**: El personal de la veterinaria revisa la información
5. **Aprobación**: El administrador aprueba o rechaza el registro
6. **Notificación al cliente**: El cliente puede ver el estado actualizado

## Credenciales de Prueba

### Cliente
- **Usuario**: `jperez` o `juan.perez@email.com`
- **Contraseña**: `password123`

### Administrador
- **Usuario**: `admin` o `admin@lospatitos.com`
- **Contraseña**: `password123`

### Recepcionista
- **Usuario**: `recepcion` o `recepcion@lospatitos.com`
- **Contraseña**: `password123`

## Seguridad Implementada

1. **Autenticación JWT**: Token de sesión seguro
2. **Rutas protegidas**: Verificación en frontend y backend
3. **Validación de roles**: Doble verificación (cliente y servidor)
4. **Tokens en localStorage**: Gestión segura de sesiones
5. **Redirección automática**: Si no tiene permisos → `/unauthorized`
6. **Cierre de sesión**: Limpieza completa de datos locales

## Manejo de Errores

- **No autenticado**: Redirección a `/login`
- **Sin permisos**: Redirección a `/unauthorized`
- **Sesión expirada**: Logout automático y redirección a login

## Mejores Prácticas

1. **Nunca exponer información sensible** en el frontend
2. **Validar permisos en el backend** siempre
3. **Usar HTTPS** en producción
4. **Tokens con expiración** (24h por defecto)
5. **Logout en múltiples pestañas** (sincronización de localStorage)

## Extensibilidad

Para agregar un nuevo rol:

1. Agregar el rol en la base de datos (`Cat_UserRoles`)
2. Configurar permisos en `useAuth.js`
3. Actualizar rutas protegidas en `App.js`
4. Modificar navbar según necesidades
5. Crear dashboard específico si es necesario

## Arquitectura de Seguridad

```
Usuario → Login → JWT Token → localStorage
                ↓
        Verificación de Rol
                ↓
        ProtectedRoute Component
                ↓
        Dashboard Correspondiente
                ↓
        Navbar Filtrado por Rol
```

## Notas Importantes

- Los clientes **NO pueden ver** información de otros usuarios
- Las mascotas deben ser **aprobadas** antes de poder hacer reservaciones
- Solo el **personal autorizado** puede gestionar datos administrativos
- Todos los endpoints del backend validan el token y el rol
- El sistema registra la última vez que el usuario inició sesión
