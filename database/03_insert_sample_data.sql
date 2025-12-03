-- =====================================================
-- Script de datos de ejemplo
-- Base de Datos: Cuidados Los Patitos S.A.
-- Descripción: Datos de prueba para el sistema
-- =====================================================

USE CuidadosLosPatitos;
GO

-- =====================================================
-- INSERTAR DATOS DE EJEMPLO
-- =====================================================

-- Usuarios del sistema
-- NOTA: Las contraseñas deben ser hasheadas en producción
-- Password de ejemplo para todos: "password123" (debe ser hasheado con bcrypt)
DECLARE @AdminRoleId INT = (SELECT RoleId FROM Cat_UserRoles WHERE RoleName = 'Administrador');
DECLARE @UserRoleId INT = (SELECT RoleId FROM Cat_UserRoles WHERE RoleName = 'Usuario Normal');
DECLARE @VetRoleId INT = (SELECT RoleId FROM Cat_UserRoles WHERE RoleName = 'Veterinario');
DECLARE @RecepRoleId INT = (SELECT RoleId FROM Cat_UserRoles WHERE RoleName = 'Recepcionista');

INSERT INTO Users (Username, Email, PasswordHash, RoleId, FullName, Phone, IsActive) VALUES
('admin', 'admin@lospatitos.com', '$2a$10$example.hash.for.password123', @AdminRoleId, 'Administrador del Sistema', '8888-0000', 1),
('recepcion', 'recepcion@lospatitos.com', '$2a$10$example.hash.for.password123', @RecepRoleId, 'María Fernández', '8888-1111', 1),
('jperez', 'juan.perez@email.com', '$2a$10$example.hash.for.password123', @UserRoleId, 'Juan Pérez', '8888-2222', 1),
('alopez', 'ana.lopez@email.com', '$2a$10$example.hash.for.password123', @UserRoleId, 'Ana López', '8888-3333', 1),
('cmartinez', 'carlos.martinez@email.com', '$2a$10$example.hash.for.password123', @UserRoleId, 'Carlos Martínez', '8888-4444', 1);
GO

-- Dueños de mascotas
DECLARE @User1Id INT = (SELECT UserId FROM Users WHERE Username = 'jperez');
DECLARE @User2Id INT = (SELECT UserId FROM Users WHERE Username = 'alopez');
DECLARE @User3Id INT = (SELECT UserId FROM Users WHERE Username = 'cmartinez');

INSERT INTO Owners (Cedula, Name, Phone, Email, Address, EmergencyContact, EmergencyPhone, UserId) VALUES
('1-1234-5678', 'Juan Pérez Rodríguez', '8888-2222', 'juan.perez@email.com', 'San José, Escazú', 'María Pérez', '8888-2223', @User1Id),
('2-2345-6789', 'Ana López Fernández', '8888-3333', 'ana.lopez@email.com', 'Heredia, Santo Domingo', 'Pedro López', '8888-3334', @User2Id),
('1-3456-7890', 'Carlos Martínez Gómez', '8888-4444', 'carlos.martinez@email.com', 'Alajuela, Centro', 'Laura Martínez', '8888-4445', @User3Id),
('2-4567-8901', 'María Rodríguez Castro', '8888-5555', 'maria.rodriguez@email.com', 'Cartago, Centro', 'José Rodríguez', '8888-5556', NULL),
('1-5678-9012', 'Luis Hernández Vargas', '8888-6666', 'luis.hernandez@email.com', 'San José, Curridabat', 'Carmen Hernández', '8888-6667', NULL);
GO

-- Veterinarios
DECLARE @EspecialidadGeneral INT = (SELECT SpecialtyId FROM Cat_VeterinarySpecialties WHERE SpecialtyName = 'Medicina General');
DECLARE @EspecialidadExoticos INT = (SELECT SpecialtyId FROM Cat_VeterinarySpecialties WHERE SpecialtyName = 'Medicina de Animales Exóticos');
DECLARE @EspecialidadCirugia INT = (SELECT SpecialtyId FROM Cat_VeterinarySpecialties WHERE SpecialtyName = 'Cirugía');

INSERT INTO Veterinarians (Name, LicenseNumber, Phone, Email, SpecialtyId, IsActive) VALUES
('Dr. Pablo Méndez Solís', 'VET-2025-001', '7000-1111', 'pablo.mendez@lospatitos.com', @EspecialidadGeneral, 1),
('Dra. Laura Salas Mora', 'VET-2025-002', '7000-2222', 'laura.salas@lospatitos.com', @EspecialidadExoticos, 1),
('Dr. Roberto Jiménez', 'VET-2025-003', '7000-3333', 'roberto.jimenez@lospatitos.com', @EspecialidadCirugia, 1),
('Dra. Sofía Ramírez', 'VET-2025-004', '7000-4444', 'sofia.ramirez@lospatitos.com', @EspecialidadGeneral, 1);
GO

-- Especialistas/Empleados
DECLARE @TurnoMatutino INT = (SELECT ShiftId FROM Cat_WorkShifts WHERE ShiftName = 'Turno Matutino');
DECLARE @TurnoVespertino INT = (SELECT ShiftId FROM Cat_WorkShifts WHERE ShiftName = 'Turno Vespertino');
DECLARE @TurnoNocturno INT = (SELECT ShiftId FROM Cat_WorkShifts WHERE ShiftName = 'Turno Nocturno');

INSERT INTO Specialists (EmployeeName, Cedula, Phone, Email, AdmissionDate, ShiftId, Position, IsActive) VALUES
('Pedro Mora Castro', '1-2222-3333', '8999-1111', 'pedro.mora@lospatitos.com', '2024-01-15', @TurnoMatutino, 'Cuidador Principal', 1),
('Isabel Vargas López', '2-3333-4444', '8999-2222', 'isabel.vargas@lospatitos.com', '2024-03-10', @TurnoVespertino, 'Cuidadora', 1),
('Jorge Solís Ramírez', '1-4444-5555', '8999-3333', 'jorge.solis@lospatitos.com', '2024-06-01', @TurnoNocturno, 'Cuidador Nocturno', 1),
('Carmen Rojas Díaz', '2-5555-6666', '8999-4444', 'carmen.rojas@lospatitos.com', '2023-11-20', @TurnoMatutino, 'Personal de Limpieza', 1),
('Miguel Ángel Torres', '1-6666-7777', '8999-5555', 'miguel.torres@lospatitos.com', '2024-02-14', @TurnoVespertino, 'Cuidador', 1);
GO

-- Habitaciones
DECLARE @TipoIndividual INT = (SELECT RoomTypeId FROM Cat_RoomTypes WHERE RoomTypeName = 'Habitación Individual');
DECLARE @TipoConCamara INT = (SELECT RoomTypeId FROM Cat_RoomTypes WHERE RoomTypeName = 'Habitación Individual con Cámara');
DECLARE @TipoCuidadosEsp INT = (SELECT RoomTypeId FROM Cat_RoomTypes WHERE RoomTypeName = 'Sala de Cuidados Especiales');
DECLARE @TipoSuite INT = (SELECT RoomTypeId FROM Cat_RoomTypes WHERE RoomTypeName = 'Suite Familiar');

DECLARE @StatusDisponible INT = (SELECT RoomStatusId FROM Cat_RoomStatuses WHERE StatusName = 'Disponible');
DECLARE @StatusOcupada INT = (SELECT RoomStatusId FROM Cat_RoomStatuses WHERE StatusName = 'Ocupada');

INSERT INTO Rooms (RoomNumber, RoomTypeId, RoomStatusId, Floor, Notes) VALUES
('101', @TipoIndividual, @StatusDisponible, 1, 'Habitación estándar, primer piso'),
('102', @TipoIndividual, @StatusDisponible, 1, 'Habitación estándar, primer piso'),
('103', @TipoConCamara, @StatusDisponible, 1, 'Con cámara HD'),
('104', @TipoConCamara, @StatusOcupada, 1, 'Con cámara HD'),
('201', @TipoSuite, @StatusDisponible, 2, 'Suite familiar, segundo piso'),
('202', @TipoIndividual, @StatusDisponible, 2, 'Vista al jardín'),
('203', @TipoConCamara, @StatusDisponible, 2, 'Con cámara y vista al jardín'),
('301', @TipoCuidadosEsp, @StatusDisponible, 3, 'Sala de cuidados intensivos'),
('302', @TipoCuidadosEsp, @StatusDisponible, 3, 'Sala de cuidados especiales');
GO

-- Mascotas
DECLARE @Owner1Id INT = (SELECT OwnerId FROM Owners WHERE Cedula = '1-1234-5678');
DECLARE @Owner2Id INT = (SELECT OwnerId FROM Owners WHERE Cedula = '2-2345-6789');
DECLARE @Owner3Id INT = (SELECT OwnerId FROM Owners WHERE Cedula = '1-3456-7890');
DECLARE @Owner4Id INT = (SELECT OwnerId FROM Owners WHERE Cedula = '2-4567-8901');
DECLARE @Owner5Id INT = (SELECT OwnerId FROM Owners WHERE Cedula = '1-5678-9012');

DECLARE @Vet1Id INT = (SELECT VeterinarianId FROM Veterinarians WHERE LicenseNumber = 'VET-2025-001');
DECLARE @Vet2Id INT = (SELECT VeterinarianId FROM Veterinarians WHERE LicenseNumber = 'VET-2025-002');
DECLARE @Vet3Id INT = (SELECT VeterinarianId FROM Veterinarians WHERE LicenseNumber = 'VET-2025-003');

DECLARE @PerroId INT = (SELECT SpeciesId FROM Cat_Species WHERE SpeciesName = 'Perro');
DECLARE @GatoId INT = (SELECT SpeciesId FROM Cat_Species WHERE SpeciesName = 'Gato');
DECLARE @ConejoId INT = (SELECT SpeciesId FROM Cat_Species WHERE SpeciesName = 'Conejo');

DECLARE @LabradorId INT = (SELECT BreedId FROM Cat_Breeds WHERE BreedName = 'Labrador Retriever');
DECLARE @SiamesId INT = (SELECT BreedId FROM Cat_Breeds WHERE BreedName = 'Siamés');
DECLARE @PersaId INT = (SELECT BreedId FROM Cat_Breeds WHERE BreedName = 'Persa');
DECLARE @BeagleId INT = (SELECT BreedId FROM Cat_Breeds WHERE BreedName = 'Beagle');

INSERT INTO Pets (Name, SpeciesId, BreedId, OwnerId, AdmissionDate, VeterinarianId, BirthDate, Weight, Color, Gender, IsNeutered, Microchip) VALUES
('Rocky', @PerroId, @LabradorId, @Owner1Id, '2024-11-15', @Vet1Id, '2022-03-10', 28.5, 'Dorado', 'Macho', 1, 'CR-2022-123456'),
('Luna', @GatoId, @SiamesId, @Owner1Id, '2024-11-15', @Vet1Id, '2021-07-20', 4.2, 'Siamés tradicional', 'Hembra', 1, 'CR-2021-789012'),
('Max', @PerroId, @BeagleId, @Owner2Id, '2024-12-01', @Vet2Id, '2023-01-15', 12.3, 'Tricolor', 'Macho', 0, NULL),
('Misu', @GatoId, @PersaId, @Owner3Id, '2024-11-20', @Vet1Id, '2020-05-05', 5.8, 'Blanco', 'Hembra', 1, 'CR-2020-345678'),
('Bella', @PerroId, @LabradorId, @Owner4Id, '2024-11-25', @Vet3Id, '2021-12-12', 25.0, 'Chocolate', 'Hembra', 1, 'CR-2021-901234'),
('Toby', @PerroId, @BeagleId, @Owner5Id, '2024-11-28', @Vet2Id, '2022-08-30', 11.5, 'Tricolor', 'Macho', 1, 'CR-2022-567890'),
('Pelusa', @ConejoId, NULL, @Owner2Id, '2024-12-01', @Vet2Id, '2023-04-01', 1.8, 'Blanco', 'Hembra', 0, NULL);

-- Cuidados especiales de mascotas
DECLARE @RockyId INT = (SELECT PetId FROM Pets WHERE Name = 'Rocky' AND OwnerId = @Owner1Id);
DECLARE @MaxId INT = (SELECT PetId FROM Pets WHERE Name = 'Max' AND OwnerId = @Owner2Id);
DECLARE @MisuId INT = (SELECT PetId FROM Pets WHERE Name = 'Misu' AND OwnerId = @Owner3Id);

INSERT INTO PetSpecialCare (PetId, CareType, Description, Frequency, Instructions) VALUES
(@RockyId, 'Alergia', 'Alergia al pollo', 'Permanente', 'NO dar alimentos con pollo. Revisar ingredientes de premios'),
(@RockyId, 'Dieta', 'Alimento hipoalergénico', 'Diaria', 'Royal Canin Hypoallergenic, 2 tazas al día divididas en 2 porciones'),
(@MaxId, 'Medicamento', 'Antibiótico para infección', '3 veces al día', 'Amoxicilina 250mg cada 8 horas con alimento. Completar 7 días'),
(@MaxId, 'Vendaje', 'Vendaje en pata trasera izquierda', 'Cada 2 días', 'Cambiar vendaje cada 48 horas, limpiar herida con suero'),
(@MisuId, 'Dieta', 'Alimento para problemas renales', 'Diaria', 'Hill''s k/d, 150g divididos en 3 porciones diarias'),
(@MisuId, 'Medicamento', 'Suplemento renal', '1 vez al día', 'Ipakitine, 1 sobre con comida en la mañana');
GO

-- Reservas
DECLARE @Owner1Id INT = (SELECT OwnerId FROM Owners WHERE Cedula = '1-1234-5678');
DECLARE @Owner2Id INT = (SELECT OwnerId FROM Owners WHERE Cedula = '2-2345-6789');
DECLARE @Owner3Id INT = (SELECT OwnerId FROM Owners WHERE Cedula = '1-3456-7890');
DECLARE @Owner4Id INT = (SELECT OwnerId FROM Owners WHERE Cedula = '2-4567-8901');
DECLARE @Owner5Id INT = (SELECT OwnerId FROM Owners WHERE Cedula = '1-5678-9012');

DECLARE @Room104Id INT = (SELECT RoomId FROM Rooms WHERE RoomNumber = '104');
DECLARE @Room201Id INT = (SELECT RoomId FROM Rooms WHERE RoomNumber = '201');
DECLARE @Room203Id INT = (SELECT RoomId FROM Rooms WHERE RoomNumber = '203');

DECLARE @ServicioHospedaje INT = (SELECT ServiceTypeId FROM Cat_ServiceTypes WHERE ServiceName = 'Hospedaje Completo');
DECLARE @ServicioGuarderia INT = (SELECT ServiceTypeId FROM Cat_ServiceTypes WHERE ServiceName = 'Guardería Diurna');

DECLARE @AsistenciaBasica INT = (SELECT AssistanceLevelId FROM Cat_AssistanceLevels WHERE LevelName = 'Asistencia Básica');
DECLARE @AsistenciaMedia INT = (SELECT AssistanceLevelId FROM Cat_AssistanceLevels WHERE LevelName = 'Asistencia Media');
DECLARE @AsistenciaAlta INT = (SELECT AssistanceLevelId FROM Cat_AssistanceLevels WHERE LevelName = 'Asistencia Alta');

DECLARE @HorarioFull INT = (SELECT StayScheduleId FROM Cat_StaySchedules WHERE ScheduleName = 'Full Estancia 24/7');
DECLARE @HorarioDia INT = (SELECT StayScheduleId FROM Cat_StaySchedules WHERE ScheduleName = 'Día Completo');

DECLARE @StatusActiva INT = (SELECT StatusId FROM Cat_ReservationStatuses WHERE StatusName = 'Activa');
DECLARE @StatusConfirmada INT = (SELECT StatusId FROM Cat_ReservationStatuses WHERE StatusName = 'Confirmada');
DECLARE @StatusPendiente INT = (SELECT StatusId FROM Cat_ReservationStatuses WHERE StatusName = 'Pendiente');

DECLARE @PagoCompleto INT = (SELECT PaymentStatusId FROM Cat_PaymentStatuses WHERE StatusName = 'Pagado');
DECLARE @PagoParcial INT = (SELECT PaymentStatusId FROM Cat_PaymentStatuses WHERE StatusName = 'Pago Parcial');
DECLARE @PagoPendiente INT = (SELECT PaymentStatusId FROM Cat_PaymentStatuses WHERE StatusName = 'Pendiente');

DECLARE @RecepUserId INT = (SELECT UserId FROM Users WHERE Username = 'recepcion');

INSERT INTO Reservations (PetId, RoomId, ServiceTypeId, AssistanceLevelId, StayScheduleId, StartDate, EndDate, IsIndefinite, StatusId, PaymentStatusId, TotalCost, Deposit, SpecialInstructions, CheckInDate, CreatedBy) VALUES
-- Reserva activa de Luna (Gato Siamés)
((SELECT PetId FROM Pets WHERE Name = 'Luna'), @Room104Id, @ServicioHospedaje, @AsistenciaBasica, @HorarioFull, '2024-11-28', '2024-12-10', 0, @StatusActiva, @PagoCompleto, 455000.00, NULL, 'Gata tranquila, le gusta estar cerca de ventanas', '2024-11-28 09:30:00', @RecepUserId),

-- Reserva confirmada de Max (necesita cuidados especiales)
(@MaxId, @Room203Id, @ServicioHospedaje, @AsistenciaAlta, @HorarioFull, '2024-12-05', '2024-12-12', 0, @StatusConfirmada, @PagoParcial, 560000.00, 200000.00, 'Requiere cambio de vendaje cada 2 días y medicamento cada 8 horas', NULL, @RecepUserId),

-- Reserva pendiente de Bella
((SELECT PetId FROM Pets WHERE Name = 'Bella'), NULL, @ServicioGuarderia, @AsistenciaBasica, @HorarioDia, '2024-12-15', '2024-12-20', 0, @StatusPendiente, @PagoPendiente, 105000.00, NULL, 'Primera vez en guardería', NULL, @RecepUserId),

-- Reserva confirmada de Toby
((SELECT PetId FROM Pets WHERE Name = 'Toby'), @Room201Id, @ServicioHospedaje, @AsistenciaBasica, @HorarioFull, '2024-12-08', '2024-12-22', 0, @StatusConfirmada, @PagoParcial, 490000.00, 150000.00, 'Le gusta jugar con otros perros pequeños', NULL, @RecepUserId);
GO

-- Paquetes adicionales en reservas
DECLARE @PaqJuegos INT = (SELECT PackageId FROM Cat_AdditionalPackages WHERE PackageName = 'Juegos y Recreación');
DECLARE @PaqPaseos INT = (SELECT PackageId FROM Cat_AdditionalPackages WHERE PackageName = 'Paseos y Acompañamiento');
DECLARE @PaqPiscina INT = (SELECT PackageId FROM Cat_AdditionalPackages WHERE PackageName = 'Piscina');
DECLARE @PaqVideo INT = (SELECT PackageId FROM Cat_AdditionalPackages WHERE PackageName = 'Video Llamada Diaria');

DECLARE @ReservaLuna INT = (SELECT ReservationId FROM Reservations WHERE PetId = (SELECT PetId FROM Pets WHERE Name = 'Luna') AND StatusId = @StatusActiva);
DECLARE @ReservaMax INT = (SELECT ReservationId FROM Reservations WHERE PetId = @MaxId AND StatusId = @StatusConfirmada);
DECLARE @ReservaToby INT = (SELECT ReservationId FROM Reservations WHERE PetId = (SELECT PetId FROM Pets WHERE Name = 'Toby') AND StatusId = @StatusConfirmada);

INSERT INTO ReservationPackages (ReservationId, PackageId, Quantity, UnitPrice, Subtotal) VALUES
(@ReservaLuna, @PaqVideo, 12, 3000.00, 36000.00),
(@ReservaMax, @PaqJuegos, 7, 5000.00, 35000.00),
(@ReservaMax, @PaqVideo, 7, 3000.00, 21000.00),
(@ReservaToby, @PaqPaseos, 14, 8000.00, 112000.00),
(@ReservaToby, @PaqPiscina, 14, 10000.00, 140000.00);
GO

-- Historial de pagos
INSERT INTO PaymentHistory (ReservationId, Amount, PaymentMethod, TransactionRef, Notes, ProcessedBy) VALUES
(@ReservaLuna, 455000.00, 'Tarjeta', 'TRX-20241128-001', 'Pago completo con tarjeta VISA', @RecepUserId),
(@ReservaMax, 200000.00, 'Transferencia', 'TRX-20241201-002', 'Depósito del 35%', @RecepUserId),
(@ReservaToby, 150000.00, 'Efectivo', NULL, 'Anticipo en efectivo', @RecepUserId);
GO

-- Historial de mantenimiento de habitaciones
DECLARE @Especialista1 INT = (SELECT SpecialistId FROM Specialists WHERE Cedula = '2-5555-6666'); -- Carmen Rojas (Limpieza)

INSERT INTO RoomMaintenanceHistory (RoomId, MaintenanceType, Description, PerformedBy, MaintenanceDate, Notes) VALUES
(@Room104Id, 'Limpieza', 'Limpieza profunda antes de check-in', @Especialista1, '2024-11-28 07:00:00', 'Habitación lista para ocupación'),
(@Room203Id, 'Limpieza', 'Limpieza estándar diaria', @Especialista1, '2024-12-01 08:00:00', 'Limpieza de rutina'),
(@Room201Id, 'Limpieza', 'Limpieza profunda', @Especialista1, '2024-12-01 09:30:00', 'Preparación para nueva reserva');
GO

-- Actualizar última fecha de limpieza en habitaciones
UPDATE Rooms 
SET LastCleaningDate = '2024-11-28 07:00:00', CleanedBy = @Especialista1
WHERE RoomId = @Room104Id;

UPDATE Rooms 
SET LastCleaningDate = '2024-12-01 08:00:00', CleanedBy = @Especialista1
WHERE RoomId = @Room203Id;

UPDATE Rooms 
SET LastCleaningDate = '2024-12-01 09:30:00', CleanedBy = @Especialista1
WHERE RoomId = @Room201Id;
GO

PRINT '==================================================';
PRINT 'Datos de ejemplo insertados exitosamente';
PRINT '==================================================';
PRINT 'Usuarios creados: 5 (1 admin, 1 recepcionista, 3 usuarios normales)';
PRINT 'Dueños: 5';
PRINT 'Veterinarios: 4';
PRINT 'Especialistas: 5';
PRINT 'Mascotas: 7 (con cuidados especiales)';
PRINT 'Habitaciones: 9';
PRINT 'Reservas: 4 (1 activa, 2 confirmadas, 1 pendiente)';
PRINT '==================================================';
PRINT 'CREDENCIALES DE PRUEBA:';
PRINT 'Admin: admin / password123';
PRINT 'Recepción: recepcion / password123';
PRINT 'Usuario: jperez / password123';
PRINT '==================================================';
GO
