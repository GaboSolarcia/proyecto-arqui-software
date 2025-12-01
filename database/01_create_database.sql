

--CREAR BASE DE DATOS DESDE CERO

IF DB_ID('CuidadosLosPatitos') IS NOT NULL
BEGIN
    ALTER DATABASE CuidadosLosPatitos SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CuidadosLosPatitos;
END;
GO

CREATE DATABASE CuidadosLosPatitos;
GO

USE CuidadosLosPatitos;
GO


-- TABLA OWNERS (DUEÑOS)

CREATE TABLE Owners (
    Id                  INT IDENTITY(1,1) PRIMARY KEY,
    Name                NVARCHAR(150) NOT NULL,
    Cedula              NVARCHAR(20)  NOT NULL UNIQUE,
    Phone               NVARCHAR(20)  NULL,
    Email               NVARCHAR(150) NULL,
    Address             NVARCHAR(250) NULL,
    EmergencyContact    NVARCHAR(150) NULL,
    EmergencyPhone      NVARCHAR(20)  NULL,
    CreatedAt           DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO


-- TABLA VETERINARIANS (VETERINARIOS)

CREATE TABLE Veterinarians (
    Id                INT IDENTITY(1,1) PRIMARY KEY,
    Name              NVARCHAR(150) NOT NULL,
    LicenseNumber     NVARCHAR(50)  NOT NULL UNIQUE,
    Phone             NVARCHAR(20)  NULL,
    Email             NVARCHAR(150) NULL,
    Specialty         NVARCHAR(150) NULL,
    IsActive          BIT           NOT NULL DEFAULT 1,
    CreatedAt         DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO


-- TABLA PETS (MASCOTAS)

CREATE TABLE Pets (
    Id               INT IDENTITY(1,1) PRIMARY KEY,
    Name             NVARCHAR(150) NOT NULL,
    Species          NVARCHAR(50)  NULL,
    Breed            NVARCHAR(100) NULL,
    OwnerId          INT           NOT NULL,
    AdmissionDate    DATE          NOT NULL,
    VeterinarianId   INT           NULL,
    Allergies        NVARCHAR(250) NULL,
    BandageChanges   NVARCHAR(250) NULL,
    SpecialDiet      NVARCHAR(250) NULL,

    CONSTRAINT FK_Pets_Owners
        FOREIGN KEY (OwnerId) REFERENCES Owners(Id),

    CONSTRAINT FK_Pets_Veterinarians
        FOREIGN KEY (VeterinarianId) REFERENCES Veterinarians(Id)
);
GO


-- TABLA RESERVATIONS (RESERVAS)

CREATE TABLE Reservations (
    Id             INT IDENTITY(1,1) PRIMARY KEY,
    PetId          INT           NOT NULL,
    StartDate      DATETIME2     NOT NULL,
    EndDate        DATETIME2     NOT NULL,
    ServiceType    NVARCHAR(100) NOT NULL,   -- guardería, paseo, hospedaje, etc.
    Status         NVARCHAR(50)  NOT NULL DEFAULT 'PENDIENTE',  
    TotalCost      DECIMAL(10,2) NOT NULL DEFAULT 0,
    PaymentStatus  NVARCHAR(50)  NOT NULL DEFAULT 'PENDIENTE',
    Notes          NVARCHAR(500) NULL,

    CONSTRAINT FK_Reservations_Pets
        FOREIGN KEY (PetId) REFERENCES Pets(Id)
);
GO

CREATE TABLE Users (
    Id            INT IDENTITY(1,1) PRIMARY KEY,
    Email         NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash  NVARCHAR(250) NOT NULL,
    Role          NVARCHAR(50)  NOT NULL,   -- admin, usuario
    CreatedAt     DATETIME2     NOT NULL DEFAULT SYSDATETIME()
);
GO


-- ÍNDICES ÚTILES

CREATE INDEX IX_Owners_Cedula ON Owners (Cedula);
CREATE INDEX IX_Pets_OwnerId ON Pets (OwnerId);
CREATE INDEX IX_Reservations_PetId ON Reservations (PetId);
GO


-- DATOS DE EJEMPLO

INSERT INTO Owners (Name, Cedula, Phone, Email, Address, EmergencyContact, EmergencyPhone)
VALUES 
('Carlos Ramírez', '1-1111-1111', '8888-1111', 'carlos@correo.com', 'San José', 'María Ramírez', '8888-2222'),
('Ana López', '2-2222-2222', '8888-3333', 'ana@correo.com', 'Heredia', 'Juan López', '8888-4444');

INSERT INTO Veterinarians (Name, LicenseNumber, Phone, Email, Specialty)
VALUES 
('Dr. Pablo Méndez', 'VET-001', '7000-1111', 'pablo@vets.com', 'Perros y gatos'),
('Dra. Laura Salas', 'VET-002', '7000-2222', 'laura@vets.com', 'Animales exóticos');

INSERT INTO Pets (Name, Species, Breed, OwnerId, AdmissionDate, VeterinarianId, Allergies, BandageChanges, SpecialDiet)
VALUES
('Rocky', 'Perro', 'Labrador', 1, GETDATE(), 1, 'Alergia a pollo', 'Cambio cada 2 días', 'Concentrado hipoalergénico'),
('Misu', 'Gato', 'Siames', 2, GETDATE(), 2, NULL, NULL, 'Dieta para riñones');

INSERT INTO Reservations (PetId, StartDate, EndDate, ServiceType, Status, TotalCost, PaymentStatus, Notes)
VALUES
(1, DATEADD(DAY, 1, GETDATE()), DATEADD(DAY, 3, GETDATE()), 'Guardería diaria', 'ACTIVA', 45000, 'PAGADO', 'Dueño viaja por trabajo'),
(2, DATEADD(DAY, 2, GETDATE()), DATEADD(DAY, 5, GETDATE()), 'Hospedaje completo', 'PENDIENTE', 60000, 'PENDIENTE', NULL);
GO