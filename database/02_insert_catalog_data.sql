-- =====================================================
-- Script de inserción de datos catálogo
-- Base de Datos: Cuidados Los Patitos S.A.
-- Descripción: Datos iniciales para tablas catálogo
-- =====================================================

USE CuidadosLosPatitos;
GO

-- =====================================================
-- INSERTAR DATOS EN TABLAS CATÁLOGO
-- =====================================================

-- Cat_UserRoles
INSERT INTO Cat_UserRoles (RoleName, Description) VALUES
('Administrador', 'Usuario con acceso total al sistema'),
('Usuario Normal', 'Usuario con acceso limitado (dueños de mascotas)'),
('Veterinario', 'Acceso a información médica de mascotas'),
('Recepcionista', 'Gestión de reservas y check-in/check-out'),
('Empleado', 'Personal de cuidado y limpieza');
GO

-- Cat_Species
INSERT INTO Cat_Species (SpeciesName, Description) VALUES
('Perro', 'Canino doméstico'),
('Gato', 'Felino doméstico'),
('Ave', 'Aves domésticas'),
('Conejo', 'Lagomorfo doméstico'),
('Roedor', 'Hamster, cobayo, etc.'),
('Reptil', 'Tortugas, iguanas, etc.'),
('Otro', 'Otras especies exóticas');
GO

-- Cat_Breeds (Razas de perros)
DECLARE @PerroId INT = (SELECT SpeciesId FROM Cat_Species WHERE SpeciesName = 'Perro');
DECLARE @GatoId INT = (SELECT SpeciesId FROM Cat_Species WHERE SpeciesName = 'Gato');
DECLARE @AveId INT = (SELECT SpeciesId FROM Cat_Species WHERE SpeciesName = 'Ave');
DECLARE @ConejoId INT = (SELECT SpeciesId FROM Cat_Species WHERE SpeciesName = 'Conejo');

INSERT INTO Cat_Breeds (SpeciesId, BreedName, Description) VALUES
-- Perros
(@PerroId, 'Labrador Retriever', 'Raza grande, amigable'),
(@PerroId, 'Golden Retriever', 'Raza grande, familiar'),
(@PerroId, 'Pastor Alemán', 'Raza grande, protector'),
(@PerroId, 'Bulldog', 'Raza mediana, tranquilo'),
(@PerroId, 'Poodle', 'Raza pequeña/mediana, inteligente'),
(@PerroId, 'Chihuahua', 'Raza pequeña, enérgico'),
(@PerroId, 'Beagle', 'Raza mediana, cazador'),
(@PerroId, 'Rottweiler', 'Raza grande, guardián'),
(@PerroId, 'Yorkshire Terrier', 'Raza pequeña, juguetón'),
(@PerroId, 'Boxer', 'Raza mediana, activo'),
(@PerroId, 'Mestizo', 'Mezcla de razas'),
(@PerroId, 'Otro', 'Otra raza no listada'),
-- Gatos
(@GatoId, 'Persa', 'Pelo largo, tranquilo'),
(@GatoId, 'Siamés', 'Elegante, vocal'),
(@GatoId, 'Maine Coon', 'Grande, pelo largo'),
(@GatoId, 'Bengalí', 'Manchado, activo'),
(@GatoId, 'Ragdoll', 'Dócil, grande'),
(@GatoId, 'British Shorthair', 'Robusto, calmado'),
(@GatoId, 'Mestizo', 'Mezcla de razas'),
(@GatoId, 'Otro', 'Otra raza no listada'),
-- Aves
(@AveId, 'Loro', 'Ave parlante'),
(@AveId, 'Periquito', 'Ave pequeña'),
(@AveId, 'Canario', 'Ave cantora'),
(@AveId, 'Ninfa', 'Cacatúa pequeña'),
(@AveId, 'Otro', 'Otra especie'),
-- Conejos
(@ConejoId, 'Holland Lop', 'Orejas caídas'),
(@ConejoId, 'Mini Rex', 'Pelo aterciopelado'),
(@ConejoId, 'Netherland Dwarf', 'Raza enana'),
(@ConejoId, 'Otro', 'Otra raza');
GO

-- Cat_ServiceTypes
INSERT INTO Cat_ServiceTypes (ServiceName, Description, BasePrice) VALUES
('Guardería Diurna', 'Cuidado durante el día', 15000.00),
('Guardería Nocturna', 'Cuidado durante la noche', 20000.00),
('Hospedaje Completo', 'Estancia 24/7', 35000.00),
('Daycare', 'Cuidado por horas', 8000.00),
('Baño y Peluquería', 'Servicio de grooming', 12000.00),
('Consulta Veterinaria', 'Revisión médica', 25000.00);
GO

-- Cat_AssistanceLevels
INSERT INTO Cat_AssistanceLevels (LevelName, Description, AdditionalCost) VALUES
('Asistencia Básica', 'Cuidado estándar sin necesidades especiales', 0.00),
('Asistencia Media', 'Requiere atención moderada (dieta, medicamento oral)', 5000.00),
('Asistencia Alta', 'Requiere atención constante (vendajes, medicamentos inyectables)', 15000.00),
('Cuidados Intensivos', 'Requiere supervisión veterinaria 24/7', 30000.00);
GO

-- Cat_StaySchedules
INSERT INTO Cat_StaySchedules (ScheduleName, Description, PriceMultiplier) VALUES
('Mañana', 'Solo turno matutino (6:00 AM - 12:00 PM)', 0.4),
('Tarde', 'Solo turno vespertino (12:00 PM - 6:00 PM)', 0.4),
('Día Completo', 'Turno diurno completo (6:00 AM - 6:00 PM)', 0.7),
('Noche', 'Solo turno nocturno (6:00 PM - 6:00 AM)', 0.6),
('Full Estancia 24/7', 'Estancia completa sin límite de horario', 1.0);
GO

-- Cat_RoomTypes
INSERT INTO Cat_RoomTypes (RoomTypeName, Description, DailyRate, Capacity, HasCamera) VALUES
('Habitación Individual', 'Habitación estándar para una mascota', 25000.00, 1, 0),
('Habitación Individual con Cámara', 'Habitación con monitoreo por cámara', 35000.00, 1, 1),
('Suite Familiar', 'Habitación para múltiples mascotas del mismo dueño', 45000.00, 3, 1),
('Sala de Cuidados Especiales', 'Con equipo médico y supervisión constante', 50000.00, 1, 1),
('Zona de Juegos Compartida', 'Espacio compartido para socialización', 15000.00, 5, 1);
GO

-- Cat_ReservationStatuses
INSERT INTO Cat_ReservationStatuses (StatusName, Description) VALUES
('Pendiente', 'Reserva creada pero no confirmada'),
('Confirmada', 'Reserva confirmada por el cliente'),
('Activa', 'Mascota actualmente hospedada'),
('Completada', 'Servicio finalizado exitosamente'),
('Cancelada', 'Reserva cancelada'),
('No Show', 'Cliente no se presentó');
GO

-- Cat_PaymentStatuses
INSERT INTO Cat_PaymentStatuses (StatusName, Description) VALUES
('Pendiente', 'Pago no realizado'),
('Pago Parcial', 'Depósito o anticipo realizado'),
('Pagado', 'Pago completo realizado'),
('Reembolsado', 'Pago devuelto al cliente'),
('Vencido', 'Pago atrasado');
GO

-- Cat_RoomStatuses
INSERT INTO Cat_RoomStatuses (StatusName, Description, Color) VALUES
('Disponible', 'Habitación lista para uso', '#22c55e'),
('Ocupada', 'Habitación actualmente en uso', '#ef4444'),
('En Limpieza', 'Habitación siendo limpiada', '#f59e0b'),
('En Mantenimiento', 'Requiere reparación', '#6366f1'),
('Fuera de Servicio', 'No disponible temporalmente', '#9ca3af');
GO

-- Cat_VeterinarySpecialties
INSERT INTO Cat_VeterinarySpecialties (SpecialtyName, Description) VALUES
('Medicina General', 'Veterinaria general para todas las especies'),
('Cirugía', 'Procedimientos quirúrgicos'),
('Dermatología', 'Problemas de piel y pelo'),
('Cardiología', 'Enfermedades del corazón'),
('Oncología', 'Tratamiento de cáncer'),
('Odontología', 'Salud dental'),
('Medicina de Animales Exóticos', 'Especialista en aves, reptiles, etc.'),
('Comportamiento Animal', 'Etología y problemas conductuales'),
('Nutrición', 'Dietas especiales y alimentación'),
('Geriatría', 'Cuidado de mascotas ancianas');
GO

-- Cat_WorkShifts
INSERT INTO Cat_WorkShifts (ShiftName, StartTime, EndTime, Description) VALUES
('Turno Matutino', '06:00:00', '14:00:00', 'Horario de mañana'),
('Turno Vespertino', '14:00:00', '22:00:00', 'Horario de tarde'),
('Turno Nocturno', '22:00:00', '06:00:00', 'Horario de noche'),
('Turno Completo', '08:00:00', '17:00:00', 'Jornada completa diurna');
GO

-- Cat_AdditionalPackages
INSERT INTO Cat_AdditionalPackages (PackageName, Description, Price) VALUES
('Juegos y Recreación', 'Sesiones de juego supervisadas 2 veces al día', 5000.00),
('Paseos y Acompañamiento', 'Paseos al aire libre 2 veces al día', 8000.00),
('Piscina', 'Acceso a piscina para mascotas con supervisión', 10000.00),
('Terapias', 'Sesiones de terapia física o relajación', 15000.00),
('Baño Semanal', 'Servicio de baño una vez por semana', 6000.00),
('Sesión de Fotos', 'Sesión fotográfica profesional', 12000.00),
('Video Llamada Diaria', 'Video llamada diaria con el dueño', 3000.00),
('Entrenamiento Básico', 'Sesiones de obediencia básica', 20000.00);
GO

PRINT 'Datos de catálogo insertados exitosamente';
GO
