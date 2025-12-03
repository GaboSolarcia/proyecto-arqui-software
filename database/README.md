# 🗄️ Scripts de Base de Datos

Scripts SQL para configurar la base de datos de **Cuidados Los Patitos S.A.**

## 📋 Orden de Ejecución

Ejecuta los scripts en el siguiente orden usando **SQL Server Management Studio (SSMS)**:

### 1️⃣ `01_create_database.sql`
- Crea la base de datos `CuidadosLosPatitos`
- Crea todas las tablas (catálogo + principales)
- Configura relaciones y constraints

### 2️⃣ `02_insert_catalog_data.sql`
- Inserta datos en tablas catálogo:
  - Roles de usuario
  - Especies y razas
  - Tipos de servicio y habitación
  - Estados del sistema

### 3️⃣ `03_insert_sample_data.sql`
- Inserta datos de ejemplo para pruebas:
  - Usuarios del sistema
  - Dueños y mascotas
  - Habitaciones y reservaciones

---

## 🚀 Instalación Rápida

```sql
-- En SQL Server Management Studio, ejecuta en orden:

:r "01_create_database.sql"
:r "02_insert_catalog_data.sql"
:r "03_insert_sample_data.sql"
```

---

## 👤 Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `password123` | Administrador |
| `recepcion` | `password123` | Recepcionista |
| `jperez` | `password123` | Usuario Normal |

---

## ✅ Verificación

```sql
USE CuidadosLosPatitos;
GO

SELECT COUNT(*) FROM Users;
SELECT COUNT(*) FROM Pets;
SELECT COUNT(*) FROM Rooms;
```

---

## 🔄 Restablecer

```sql
USE master;
GO
ALTER DATABASE CuidadosLosPatitos SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE CuidadosLosPatitos;
GO
-- Luego ejecuta los 3 scripts nuevamente
```
