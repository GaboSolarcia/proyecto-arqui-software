-- =====================================================
-- Habilitar SQL Server Authentication y configurar usuario SA
-- Ejecutar en SQL Server Management Studio
-- =====================================================

USE master;
GO

-- 1. Habilitar autenticación de SQL Server y Windows (modo mixto)
EXEC xp_instance_regwrite 
    N'HKEY_LOCAL_MACHINE', 
    N'Software\Microsoft\MSSQLServer\MSSQLServer',
    N'LoginMode', 
    REG_DWORD, 
    2;
GO

-- 2. Habilitar el login 'sa' (si está deshabilitado)
ALTER LOGIN sa ENABLE;
GO

-- 3. Establecer una nueva contraseña para 'sa'
-- IMPORTANTE: Cambia 'TuPasswordSegura123!' por una contraseña segura
ALTER LOGIN sa WITH PASSWORD = 'TuPasswordSegura123!';
GO

-- 4. Otorgar permisos de sysadmin a 'sa'
ALTER SERVER ROLE sysadmin ADD MEMBER sa;
GO

-- 5. Verificar que el usuario 'sa' tiene acceso a la base de datos
USE CuidadosLosPatitos;
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'sa')
BEGIN
    CREATE USER sa FOR LOGIN sa;
END
GO

-- Otorgar permisos completos en la base de datos
ALTER ROLE db_owner ADD MEMBER sa;
GO

PRINT '✅ Usuario SA configurado correctamente';
PRINT '';
PRINT '⚠️  IMPORTANTE: Debes reiniciar SQL Server para que los cambios surtan efecto';
PRINT '   1. Abre SQL Server Configuration Manager';
PRINT '   2. Ve a SQL Server Services';
PRINT '   3. Click derecho en SQL Server (MSSQLSERVER)';
PRINT '   4. Selecciona Restart';
PRINT '';
PRINT 'Credenciales configuradas:';
PRINT '   Usuario: sa';
PRINT '   Contraseña: TuPasswordSegura123!';
PRINT '';
PRINT 'Actualiza tu archivo .env con:';
PRINT '   DB_USER=sa';
PRINT '   DB_PASSWORD=TuPasswordSegura123!';
GO
