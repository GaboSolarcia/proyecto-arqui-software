-- =====================================================
-- Base de Datos: Cuidados Los Patitos S.A.
-- Descripción: Sistema de guardería de mascotas
-- Fecha: 2 de Diciembre 2025
-- Normalización: 1FN, 2FN, 3FN aplicadas
-- =====================================================

USE master;
GO

-- Eliminar base de datos si existe
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'CuidadosLosPatitos')
BEGIN
    ALTER DATABASE CuidadosLosPatitos SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CuidadosLosPatitos;
END
GO

-- Crear base de datos
CREATE DATABASE CuidadosLosPatitos;
GO

USE CuidadosLosPatitos;
GO

-- =====================================================
-- TABLAS CATÁLOGO (Valores predefinidos)
-- =====================================================

-- Catálogo: Roles de usuario
CREATE TABLE Cat_UserRoles (
    RoleId          INT IDENTITY(1,1) PRIMARY KEY,
    RoleName        NVARCHAR(50) NOT NULL UNIQUE,
    Description     NVARCHAR(200) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Especies de mascotas
CREATE TABLE Cat_Species (
    SpeciesId       INT IDENTITY(1,1) PRIMARY KEY,
    SpeciesName     NVARCHAR(50) NOT NULL UNIQUE,
    Description     NVARCHAR(200) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Razas de mascotas
CREATE TABLE Cat_Breeds (
    BreedId         INT IDENTITY(1,1) PRIMARY KEY,
    SpeciesId       INT NOT NULL,
    BreedName       NVARCHAR(100) NOT NULL,
    Description     NVARCHAR(200) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Breeds_Species FOREIGN KEY (SpeciesId) REFERENCES Cat_Species(SpeciesId),
    CONSTRAINT UK_Breeds_Species_Name UNIQUE (SpeciesId, BreedName)
);
GO

-- Catálogo: Tipos de servicio
CREATE TABLE Cat_ServiceTypes (
    ServiceTypeId   INT IDENTITY(1,1) PRIMARY KEY,
    ServiceName     NVARCHAR(100) NOT NULL UNIQUE,
    Description     NVARCHAR(300) NULL,
    BasePrice       DECIMAL(10,2) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Niveles de asistencia
CREATE TABLE Cat_AssistanceLevels (
    AssistanceLevelId   INT IDENTITY(1,1) PRIMARY KEY,
    LevelName           NVARCHAR(100) NOT NULL UNIQUE,
    Description         NVARCHAR(300) NULL,
    AdditionalCost      DECIMAL(10,2) NOT NULL DEFAULT 0,
    IsActive            BIT NOT NULL DEFAULT 1,
    CreatedAt           DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Horarios de estancia
CREATE TABLE Cat_StaySchedules (
    StayScheduleId  INT IDENTITY(1,1) PRIMARY KEY,
    ScheduleName    NVARCHAR(50) NOT NULL UNIQUE,
    Description     NVARCHAR(200) NULL,
    PriceMultiplier DECIMAL(5,2) NOT NULL DEFAULT 1.0,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Tipos de habitación
CREATE TABLE Cat_RoomTypes (
    RoomTypeId      INT IDENTITY(1,1) PRIMARY KEY,
    RoomTypeName    NVARCHAR(100) NOT NULL UNIQUE,
    Description     NVARCHAR(300) NULL,
    DailyRate       DECIMAL(10,2) NOT NULL,
    Capacity        INT NOT NULL DEFAULT 1,
    HasCamera       BIT NOT NULL DEFAULT 0,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Estados de reserva
CREATE TABLE Cat_ReservationStatuses (
    StatusId        INT IDENTITY(1,1) PRIMARY KEY,
    StatusName      NVARCHAR(50) NOT NULL UNIQUE,
    Description     NVARCHAR(200) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Estados de pago
CREATE TABLE Cat_PaymentStatuses (
    PaymentStatusId INT IDENTITY(1,1) PRIMARY KEY,
    StatusName      NVARCHAR(50) NOT NULL UNIQUE,
    Description     NVARCHAR(200) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Estados de habitación
CREATE TABLE Cat_RoomStatuses (
    RoomStatusId    INT IDENTITY(1,1) PRIMARY KEY,
    StatusName      NVARCHAR(50) NOT NULL UNIQUE,
    Description     NVARCHAR(200) NULL,
    Color           NVARCHAR(20) NULL, -- Para UI
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Especialidades veterinarias
CREATE TABLE Cat_VeterinarySpecialties (
    SpecialtyId     INT IDENTITY(1,1) PRIMARY KEY,
    SpecialtyName   NVARCHAR(100) NOT NULL UNIQUE,
    Description     NVARCHAR(300) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Turnos de trabajo
CREATE TABLE Cat_WorkShifts (
    ShiftId         INT IDENTITY(1,1) PRIMARY KEY,
    ShiftName       NVARCHAR(50) NOT NULL UNIQUE,
    StartTime       TIME NOT NULL,
    EndTime         TIME NOT NULL,
    Description     NVARCHAR(200) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- Catálogo: Paquetes adicionales
CREATE TABLE Cat_AdditionalPackages (
    PackageId       INT IDENTITY(1,1) PRIMARY KEY,
    PackageName     NVARCHAR(100) NOT NULL UNIQUE,
    Description     NVARCHAR(300) NULL,
    Price           DECIMAL(10,2) NOT NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO

-- =====================================================
-- TABLAS PRINCIPALES
-- =====================================================

-- Tabla: Usuarios del sistema
CREATE TABLE Users (
    UserId          INT IDENTITY(1,1) PRIMARY KEY,
    Username        NVARCHAR(50) NOT NULL UNIQUE,
    Email           NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash    NVARCHAR(255) NOT NULL,
    RoleId          INT NOT NULL,
    FullName        NVARCHAR(150) NOT NULL,
    Phone           NVARCHAR(20) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    LastLogin       DATETIME2 NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt       DATETIME2 NULL,
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES Cat_UserRoles(RoleId)
);
GO

-- Tabla: Dueños de mascotas
CREATE TABLE Owners (
    OwnerId             INT IDENTITY(1,1) PRIMARY KEY,
    Cedula              NVARCHAR(20) NOT NULL UNIQUE,
    Name                NVARCHAR(150) NOT NULL,
    Phone               NVARCHAR(20) NULL,
    Email               NVARCHAR(150) NULL,
    Address             NVARCHAR(250) NULL,
    EmergencyContact    NVARCHAR(150) NULL,
    EmergencyPhone      NVARCHAR(20) NULL,
    UserId              INT NULL, -- Vinculación opcional con usuario del sistema
    IsActive            BIT NOT NULL DEFAULT 1,
    CreatedAt           DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt           DATETIME2 NULL,
    CONSTRAINT FK_Owners_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Tabla: Veterinarios
CREATE TABLE Veterinarians (
    VeterinarianId  INT IDENTITY(1,1) PRIMARY KEY,
    Name            NVARCHAR(150) NOT NULL,
    LicenseNumber   NVARCHAR(50) NOT NULL UNIQUE,
    Phone           NVARCHAR(20) NULL,
    Email           NVARCHAR(150) NULL,
    SpecialtyId     INT NULL,
    UserId          INT NULL, -- Vinculación opcional con usuario del sistema
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt       DATETIME2 NULL,
    CONSTRAINT FK_Veterinarians_Specialties FOREIGN KEY (SpecialtyId) REFERENCES Cat_VeterinarySpecialties(SpecialtyId),
    CONSTRAINT FK_Veterinarians_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Tabla: Mascotas
CREATE TABLE Pets (
    PetId               INT IDENTITY(1,1) PRIMARY KEY,
    Name                NVARCHAR(150) NOT NULL,
    SpeciesId           INT NOT NULL,
    BreedId             INT NULL,
    OwnerId             INT NOT NULL,
    AdmissionDate       DATE NOT NULL,
    VeterinarianId      INT NULL,
    BirthDate           DATE NULL,
    Weight              DECIMAL(6,2) NULL,
    Color               NVARCHAR(50) NULL,
    Gender              NVARCHAR(10) NULL, -- Macho, Hembra
    IsNeutered          BIT NULL,
    Microchip           NVARCHAR(50) NULL,
    PhotoUrl            NVARCHAR(500) NULL,
    IsActive            BIT NOT NULL DEFAULT 1,
    CreatedAt           DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt           DATETIME2 NULL,
    CONSTRAINT FK_Pets_Species FOREIGN KEY (SpeciesId) REFERENCES Cat_Species(SpeciesId),
    CONSTRAINT FK_Pets_Breeds FOREIGN KEY (BreedId) REFERENCES Cat_Breeds(BreedId),
    CONSTRAINT FK_Pets_Owners FOREIGN KEY (OwnerId) REFERENCES Owners(OwnerId),
    CONSTRAINT FK_Pets_Veterinarians FOREIGN KEY (VeterinarianId) REFERENCES Veterinarians(VeterinarianId)
);
GO

-- Tabla: Cuidados especiales de mascotas (1FN - datos repetidos separados)
CREATE TABLE PetSpecialCare (
    SpecialCareId   INT IDENTITY(1,1) PRIMARY KEY,
    PetId           INT NOT NULL,
    CareType        NVARCHAR(50) NOT NULL, -- Alergia, Dieta, Vendaje, Medicamento
    Description     NVARCHAR(500) NOT NULL,
    Frequency       NVARCHAR(100) NULL, -- Ej: "Cada 2 días", "3 veces al día"
    Instructions    NVARCHAR(500) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt       DATETIME2 NULL,
    CONSTRAINT FK_PetSpecialCare_Pets FOREIGN KEY (PetId) REFERENCES Pets(PetId)
);
GO

-- Tabla: Habitaciones
CREATE TABLE Rooms (
    RoomId              INT IDENTITY(1,1) PRIMARY KEY,
    RoomNumber          NVARCHAR(20) NOT NULL UNIQUE,
    RoomTypeId          INT NOT NULL,
    RoomStatusId        INT NOT NULL,
    Floor               INT NULL,
    LastCleaningDate    DATETIME2 NULL,
    CleanedBy           INT NULL, -- Referencia a Specialists
    Notes               NVARCHAR(500) NULL,
    CreatedAt           DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt           DATETIME2 NULL,
    CONSTRAINT FK_Rooms_RoomTypes FOREIGN KEY (RoomTypeId) REFERENCES Cat_RoomTypes(RoomTypeId),
    CONSTRAINT FK_Rooms_RoomStatuses FOREIGN KEY (RoomStatusId) REFERENCES Cat_RoomStatuses(RoomStatusId)
);
GO

-- Tabla: Especialistas/Empleados
CREATE TABLE Specialists (
    SpecialistId    INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeName    NVARCHAR(150) NOT NULL,
    Cedula          NVARCHAR(20) NOT NULL UNIQUE,
    Phone           NVARCHAR(20) NULL,
    Email           NVARCHAR(150) NULL,
    AdmissionDate   DATE NOT NULL,
    ShiftId         INT NULL,
    Position        NVARCHAR(100) NULL, -- Cargo: Cuidador, Limpieza, etc.
    UserId          INT NULL, -- Vinculación opcional con usuario del sistema
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt       DATETIME2 NULL,
    CONSTRAINT FK_Specialists_WorkShifts FOREIGN KEY (ShiftId) REFERENCES Cat_WorkShifts(ShiftId),
    CONSTRAINT FK_Specialists_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Agregar FK de limpieza en Rooms
ALTER TABLE Rooms 
ADD CONSTRAINT FK_Rooms_Specialists FOREIGN KEY (CleanedBy) REFERENCES Specialists(SpecialistId);
GO

-- Tabla: Reservas
CREATE TABLE Reservations (
    ReservationId       INT IDENTITY(1,1) PRIMARY KEY,
    PetId               INT NOT NULL,
    RoomId              INT NULL,
    ServiceTypeId       INT NOT NULL,
    AssistanceLevelId   INT NULL,
    StayScheduleId      INT NULL,
    StartDate           DATETIME2 NOT NULL,
    EndDate             DATETIME2 NULL,
    IsIndefinite        BIT NOT NULL DEFAULT 0,
    StatusId            INT NOT NULL,
    PaymentStatusId     INT NOT NULL,
    TotalCost           DECIMAL(10,2) NOT NULL DEFAULT 0,
    Deposit             DECIMAL(10,2) NULL,
    SpecialInstructions NVARCHAR(500) NULL,
    CheckInDate         DATETIME2 NULL,
    CheckOutDate        DATETIME2 NULL,
    CreatedBy           INT NULL, -- Usuario que creó la reserva
    CreatedAt           DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt           DATETIME2 NULL,
    CONSTRAINT FK_Reservations_Pets FOREIGN KEY (PetId) REFERENCES Pets(PetId),
    CONSTRAINT FK_Reservations_Rooms FOREIGN KEY (RoomId) REFERENCES Rooms(RoomId),
    CONSTRAINT FK_Reservations_ServiceTypes FOREIGN KEY (ServiceTypeId) REFERENCES Cat_ServiceTypes(ServiceTypeId),
    CONSTRAINT FK_Reservations_AssistanceLevels FOREIGN KEY (AssistanceLevelId) REFERENCES Cat_AssistanceLevels(AssistanceLevelId),
    CONSTRAINT FK_Reservations_StaySchedules FOREIGN KEY (StayScheduleId) REFERENCES Cat_StaySchedules(StayScheduleId),
    CONSTRAINT FK_Reservations_Statuses FOREIGN KEY (StatusId) REFERENCES Cat_ReservationStatuses(StatusId),
    CONSTRAINT FK_Reservations_PaymentStatuses FOREIGN KEY (PaymentStatusId) REFERENCES Cat_PaymentStatuses(PaymentStatusId),
    CONSTRAINT FK_Reservations_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);
GO

-- Tabla intermedia: Paquetes adicionales por reserva (Relación N:M)
CREATE TABLE ReservationPackages (
    ReservationPackageId    INT IDENTITY(1,1) PRIMARY KEY,
    ReservationId           INT NOT NULL,
    PackageId               INT NOT NULL,
    Quantity                INT NOT NULL DEFAULT 1,
    UnitPrice               DECIMAL(10,2) NOT NULL,
    Subtotal                DECIMAL(10,2) NOT NULL,
    CreatedAt               DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_ReservationPackages_Reservations FOREIGN KEY (ReservationId) REFERENCES Reservations(ReservationId),
    CONSTRAINT FK_ReservationPackages_Packages FOREIGN KEY (PackageId) REFERENCES Cat_AdditionalPackages(PackageId),
    CONSTRAINT UK_ReservationPackages UNIQUE (ReservationId, PackageId)
);
GO

-- Tabla: Historial de mantenimiento de habitaciones
CREATE TABLE RoomMaintenanceHistory (
    MaintenanceId   INT IDENTITY(1,1) PRIMARY KEY,
    RoomId          INT NOT NULL,
    MaintenanceType NVARCHAR(100) NOT NULL, -- Limpieza, Reparación, Inspección
    Description     NVARCHAR(500) NULL,
    PerformedBy     INT NULL, -- Specialist
    MaintenanceDate DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Cost            DECIMAL(10,2) NULL,
    Notes           NVARCHAR(500) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_RoomMaintenance_Rooms FOREIGN KEY (RoomId) REFERENCES Rooms(RoomId),
    CONSTRAINT FK_RoomMaintenance_Specialists FOREIGN KEY (PerformedBy) REFERENCES Specialists(SpecialistId)
);
GO

-- Tabla: Historial de pagos
CREATE TABLE PaymentHistory (
    PaymentId       INT IDENTITY(1,1) PRIMARY KEY,
    ReservationId   INT NOT NULL,
    Amount          DECIMAL(10,2) NOT NULL,
    PaymentMethod   NVARCHAR(50) NULL, -- Efectivo, Tarjeta, Transferencia
    PaymentDate     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    TransactionRef  NVARCHAR(100) NULL,
    Notes           NVARCHAR(500) NULL,
    ProcessedBy     INT NULL, -- Usuario que procesó el pago
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PaymentHistory_Reservations FOREIGN KEY (ReservationId) REFERENCES Reservations(ReservationId),
    CONSTRAINT FK_PaymentHistory_Users FOREIGN KEY (ProcessedBy) REFERENCES Users(UserId)
);
GO

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices en Owners
CREATE INDEX IX_Owners_Cedula ON Owners(Cedula);
CREATE INDEX IX_Owners_Email ON Owners(Email);
CREATE INDEX IX_Owners_UserId ON Owners(UserId);

-- Índices en Pets
CREATE INDEX IX_Pets_OwnerId ON Pets(OwnerId);
CREATE INDEX IX_Pets_SpeciesId ON Pets(SpeciesId);
CREATE INDEX IX_Pets_VeterinarianId ON Pets(VeterinarianId);
CREATE INDEX IX_Pets_AdmissionDate ON Pets(AdmissionDate);

-- Índices en Reservations
CREATE INDEX IX_Reservations_PetId ON Reservations(PetId);
CREATE INDEX IX_Reservations_RoomId ON Reservations(RoomId);
CREATE INDEX IX_Reservations_StartDate ON Reservations(StartDate);
CREATE INDEX IX_Reservations_StatusId ON Reservations(StatusId);
CREATE INDEX IX_Reservations_PaymentStatusId ON Reservations(PaymentStatusId);

-- Índices en Users
CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Users_RoleId ON Users(RoleId);

-- Índices en Rooms
CREATE INDEX IX_Rooms_RoomTypeId ON Rooms(RoomTypeId);
CREATE INDEX IX_Rooms_RoomStatusId ON Rooms(RoomStatusId);

-- Índices en Specialists
CREATE INDEX IX_Specialists_Cedula ON Specialists(Cedula);
CREATE INDEX IX_Specialists_ShiftId ON Specialists(ShiftId);

-- Índices en Veterinarians
CREATE INDEX IX_Veterinarians_LicenseNumber ON Veterinarians(LicenseNumber);
CREATE INDEX IX_Veterinarians_SpecialtyId ON Veterinarians(SpecialtyId);

GO

PRINT 'Base de datos creada exitosamente con normalización 1FN, 2FN, 3FN aplicada';
PRINT 'Tablas catálogo creadas para valores predefinidos';
PRINT 'Sistema de usuarios con roles implementado';
GO
