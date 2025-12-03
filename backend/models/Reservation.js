const { executeQuery, sql } = require('../config/database');

class Reservation {
    constructor(data) {
        this.id = data.id;
        this.pet_id = data.pet_id;
        this.start_date = data.start_date;
        this.end_date = data.end_date;
        this.is_indefinite = data.is_indefinite; // Estancia indefinida
        this.service_type = data.service_type;
        this.special_instructions = data.special_instructions;
        this.status = data.status;
        this.total_cost = data.total_cost;
        this.payment_status = data.payment_status;
        
        // Nivel de asistencia
        this.assistance_level = data.assistance_level;
        
        // Paquetes adicionales (JSON string)
        this.additional_packages = data.additional_packages;
        
        // Estancia en las instalaciones
        this.stay_schedule = data.stay_schedule; // Día, Mañana, Tarde, Full estancia
        
        // Tipo de habitación
        this.room_type = data.room_type; // Individual, Individual con cámara, Cuidados especiales
        this.room_id = data.room_id; // Referencia a la habitación asignada
        
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Crear una nueva reserva
    static async create(reservationData) {
        try {
            // Buscar IDs de los catálogos
            const serviceTypeQuery = `SELECT ServiceTypeId FROM Cat_ServiceTypes WHERE ServiceName = @service_type`;
            const serviceTypeResult = await executeQuery(serviceTypeQuery, { service_type: reservationData.service_type || 'Hospedaje Completo' });
            const ServiceTypeId = serviceTypeResult.recordset[0]?.ServiceTypeId || 1;

            const assistanceQuery = `SELECT AssistanceLevelId FROM Cat_AssistanceLevels WHERE LevelName = @level`;
            const assistanceResult = await executeQuery(assistanceQuery, { level: reservationData.assistance_level || 'Asistencia básica' });
            const AssistanceLevelId = assistanceResult.recordset[0]?.AssistanceLevelId || 1;

            const scheduleQuery = `SELECT StayScheduleId FROM Cat_StaySchedules WHERE ScheduleName = @schedule`;
            const scheduleResult = await executeQuery(scheduleQuery, { schedule: reservationData.stay_schedule || 'Full estancia' });
            const StayScheduleId = scheduleResult.recordset[0]?.StayScheduleId || 1;

            const statusQuery = `SELECT StatusId FROM Cat_ReservationStatuses WHERE StatusName = @status`;
            const statusResult = await executeQuery(statusQuery, { status: reservationData.status || 'Pendiente' });
            const StatusId = statusResult.recordset[0]?.StatusId || 1;

            const paymentQuery = `SELECT PaymentStatusId FROM Cat_PaymentStatuses WHERE StatusName = @payment_status`;
            const paymentResult = await executeQuery(paymentQuery, { payment_status: reservationData.payment_status || 'Pendiente' });
            const PaymentStatusId = paymentResult.recordset[0]?.PaymentStatusId || 1;

            // Buscar una habitación disponible del tipo solicitado
            const roomTypeQuery = `SELECT RoomTypeId FROM Cat_RoomTypes WHERE RoomTypeName = @room_type`;
            const roomTypeResult = await executeQuery(roomTypeQuery, { room_type: reservationData.room_type || 'Habitación individual' });
            const RoomTypeId = roomTypeResult.recordset[0]?.RoomTypeId;

            let RoomId = reservationData.room_id || null;
            if (!RoomId && RoomTypeId) {
                const availableRoomQuery = `
                    SELECT TOP 1 r.RoomId
                    FROM Rooms r
                    INNER JOIN Cat_RoomStatuses rs ON r.RoomStatusId = rs.RoomStatusId
                    WHERE r.RoomTypeId = @RoomTypeId AND rs.StatusName = 'Disponible'
                    ORDER BY r.RoomNumber
                `;
                const availableRoomResult = await executeQuery(availableRoomQuery, { RoomTypeId });
                RoomId = availableRoomResult.recordset[0]?.RoomId;
            }

            const query = `
                INSERT INTO Reservations (
                    PetId, RoomId, ServiceTypeId, AssistanceLevelId, StayScheduleId,
                    StartDate, EndDate, IsIndefinite, StatusId, PaymentStatusId,
                    TotalCost, SpecialInstructions
                )
                OUTPUT INSERTED.*
                VALUES (
                    @PetId, @RoomId, @ServiceTypeId, @AssistanceLevelId, @StayScheduleId,
                    @StartDate, @EndDate, @IsIndefinite, @StatusId, @PaymentStatusId,
                    @TotalCost, @SpecialInstructions
                )
            `;
            
            const params = {
                PetId: reservationData.pet_id,
                RoomId: RoomId,
                ServiceTypeId: ServiceTypeId,
                AssistanceLevelId: AssistanceLevelId,
                StayScheduleId: StayScheduleId,
                StartDate: reservationData.start_date,
                EndDate: reservationData.is_indefinite ? null : (reservationData.end_date || null),
                IsIndefinite: reservationData.is_indefinite || false,
                StatusId: StatusId,
                PaymentStatusId: PaymentStatusId,
                TotalCost: reservationData.total_cost || 0,
                SpecialInstructions: reservationData.special_instructions || null
            };

            const result = await executeQuery(query, params);
            const insertedData = result.recordset[0];
            
            // Mapear PascalCase a snake_case para el constructor
            const mappedData = {
                id: insertedData.ReservationId,
                pet_id: insertedData.PetId,
                room_id: insertedData.RoomId,
                start_date: insertedData.StartDate,
                end_date: insertedData.EndDate,
                is_indefinite: insertedData.IsIndefinite,
                service_type: reservationData.service_type,
                special_instructions: insertedData.SpecialInstructions,
                status: reservationData.status,
                total_cost: insertedData.TotalCost,
                payment_status: reservationData.payment_status,
                assistance_level: reservationData.assistance_level,
                additional_packages: reservationData.additional_packages,
                stay_schedule: reservationData.stay_schedule,
                room_type: reservationData.room_type,
                created_at: insertedData.CreatedAt,
                updated_at: insertedData.UpdatedAt
            };
            
            return new Reservation(mappedData);
        } catch (error) {
            throw new Error(`Error creando reserva: ${error.message}`);
        }
    }

    // Obtener todas las reservas
    static async findAll() {
        try {
            const query = `
                SELECT 
                    r.ReservationId,
                    r.PetId,
                    p.Name AS PetName,
                    r.RoomId,
                    rm.RoomNumber,
                    rt.RoomTypeName,
                    r.StartDate,
                    r.EndDate,
                    r.IsIndefinite,
                    r.StatusId,
                    rs.StatusName,
                    r.TotalCost,
                    r.SpecialInstructions,
                    r.CheckInDate,
                    r.CheckOutDate,
                    r.StayScheduleId,
                    ss.ScheduleName AS StayScheduleName,
                    r.AssistanceLevelId,
                    al.LevelName AS AssistanceLevelName,
                    o.Name AS OwnerName,
                    o.Cedula AS OwnerCedula,
                    r.CreatedAt,
                    r.UpdatedAt
                FROM Reservations r
                INNER JOIN Pets p ON r.PetId = p.PetId
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
                LEFT JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
                LEFT JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                LEFT JOIN Cat_StaySchedules ss ON r.StayScheduleId = ss.StayScheduleId
                LEFT JOIN Cat_AssistanceLevels al ON r.AssistanceLevelId = al.AssistanceLevelId
                ORDER BY r.CreatedAt DESC
            `;
            
            const result = await executeQuery(query);
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo reservas: ${error.message}`);
        }
    }

    // Obtener reserva por ID
    static async findById(id) {
        try {
            const query = `
                SELECT 
                    r.ReservationId,
                    r.PetId,
                    p.Name AS PetName,
                    r.RoomId,
                    rm.RoomNumber,
                    rt.RoomTypeName,
                    r.StartDate,
                    r.EndDate,
                    r.IsIndefinite,
                    r.StatusId,
                    rs.StatusName,
                    r.TotalCost,
                    r.SpecialInstructions,
                    r.CheckInDate,
                    r.CheckOutDate,
                    r.StayScheduleId,
                    ss.ScheduleName AS StayScheduleName,
                    r.AssistanceLevelId,
                    al.LevelName AS AssistanceLevelName,
                    o.Name AS OwnerName,
                    o.Cedula AS OwnerCedula,
                    r.CreatedAt,
                    r.UpdatedAt
                FROM Reservations r
                INNER JOIN Pets p ON r.PetId = p.PetId
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
                LEFT JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
                LEFT JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                LEFT JOIN Cat_StaySchedules ss ON r.StayScheduleId = ss.StayScheduleId
                LEFT JOIN Cat_AssistanceLevels al ON r.AssistanceLevelId = al.AssistanceLevelId
                WHERE r.ReservationId = @id
            `;
            
            const result = await executeQuery(query, { id });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error obteniendo reserva: ${error.message}`);
        }
    }

    // Obtener reservas por mascota
    static async findByPetId(petId) {
        try {
            const query = `
                SELECT 
                    r.ReservationId,
                    r.PetId,
                    p.Name AS PetName,
                    r.RoomId,
                    rm.RoomNumber,
                    r.StartDate,
                    r.EndDate,
                    r.StatusId,
                    rs.StatusName,
                    r.TotalCost,
                    o.Name AS OwnerName,
                    o.Cedula AS OwnerCedula
                FROM Reservations r
                INNER JOIN Pets p ON r.PetId = p.PetId
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
                LEFT JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                WHERE r.PetId = @pet_id
                ORDER BY r.CreatedAt DESC
            `;
            
            const result = await executeQuery(query, { pet_id: petId });
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo reservas por mascota: ${error.message}`);
        }
    }

    // Obtener reservas por estado
    static async findByStatus(status) {
        try {
            const query = `
                SELECT 
                    r.ReservationId,
                    r.PetId,
                    p.Name AS PetName,
                    r.RoomId,
                    rm.RoomNumber,
                    r.StartDate,
                    r.EndDate,
                    r.StatusId,
                    rs.StatusName,
                    r.TotalCost,
                    o.Name AS OwnerName,
                    o.Cedula AS OwnerCedula
                FROM Reservations r
                INNER JOIN Pets p ON r.PetId = p.PetId
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
                INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                WHERE rs.StatusName = @status
                ORDER BY r.CreatedAt DESC
            `;
            
            const result = await executeQuery(query, { status });
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo reservas por estado: ${error.message}`);
        }
    }

    // Obtener reservas activas (en curso)
    static async findActive() {
        try {
            const query = `
                SELECT 
                    r.ReservationId,
                    r.PetId,
                    p.Name AS PetName,
                    r.RoomId,
                    rm.RoomNumber,
                    r.StartDate,
                    r.EndDate,
                    r.StatusId,
                    rs.StatusName,
                    r.TotalCost,
                    o.Name AS OwnerName,
                    o.Cedula AS OwnerCedula
                FROM Reservations r
                INNER JOIN Pets p ON r.PetId = p.PetId
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
                INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                WHERE rs.StatusName IN ('Activa', 'Check-In')
                   OR (r.StartDate <= GETDATE() AND r.EndDate >= GETDATE() AND rs.StatusName = 'Confirmada')
                ORDER BY r.StartDate
            `;
            
            const result = await executeQuery(query);
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo reservas activas: ${error.message}`);
        }
    }

    // Obtener reservas por rango de fechas
    static async findByDateRange(startDate, endDate) {
        try {
            const query = `
                SELECT 
                    r.ReservationId,
                    r.PetId,
                    p.Name AS PetName,
                    r.RoomId,
                    rm.RoomNumber,
                    r.StartDate,
                    r.EndDate,
                    r.StatusId,
                    rs.StatusName,
                    r.TotalCost,
                    o.Name AS OwnerName,
                    o.Cedula AS OwnerCedula
                FROM Reservations r
                INNER JOIN Pets p ON r.PetId = p.PetId
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
                LEFT JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                WHERE r.StartDate >= @start_date AND r.EndDate <= @end_date
                ORDER BY r.StartDate
            `;
            
            const result = await executeQuery(query, { 
                start_date: startDate, 
                end_date: endDate 
            });
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo reservas por rango de fechas: ${error.message}`);
        }
    }

    // Actualizar reserva
    static async update(id, reservationData) {
        try {
            const query = `
                UPDATE Reservations 
                SET start_date = @start_date,
                    end_date = @end_date,
                    service_type = @service_type,
                    special_instructions = @special_instructions,
                    status = @status,
                    total_cost = @total_cost,
                    payment_status = @payment_status,
                    updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `;
            
            const params = {
                id,
                start_date: reservationData.start_date,
                end_date: reservationData.end_date,
                service_type: reservationData.service_type,
                special_instructions: reservationData.special_instructions,
                status: reservationData.status,
                total_cost: reservationData.total_cost,
                payment_status: reservationData.payment_status
            };

            const result = await executeQuery(query, params);
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Reservation(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error actualizando reserva: ${error.message}`);
        }
    }

    // Actualizar estado de la reserva
    static async updateStatus(id, status) {
        try {
            // Buscar el StatusId del catálogo
            const statusQuery = `SELECT StatusId FROM Cat_ReservationStatuses WHERE StatusName = @StatusName`;
            const statusResult = await executeQuery(statusQuery, { StatusName: status });
            
            if (statusResult.recordset.length === 0) {
                throw new Error(`Estado '${status}' no encontrado en el catálogo`);
            }
            
            const StatusId = statusResult.recordset[0].StatusId;
            
            const query = `
                UPDATE Reservations 
                SET StatusId = @StatusId, UpdatedAt = GETDATE()
                OUTPUT INSERTED.*
                WHERE ReservationId = @ReservationId
            `;
            
            const result = await executeQuery(query, { ReservationId: id, StatusId });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            // Mapear resultado a formato esperado por el constructor
            const insertedData = result.recordset[0];
            const mappedData = {
                id: insertedData.ReservationId,
                pet_id: insertedData.PetId,
                room_id: insertedData.RoomId,
                start_date: insertedData.StartDate,
                end_date: insertedData.EndDate,
                is_indefinite: insertedData.IsIndefinite,
                service_type: status,
                special_instructions: insertedData.SpecialInstructions,
                status: status,
                total_cost: insertedData.TotalCost,
                created_at: insertedData.CreatedAt,
                updated_at: insertedData.UpdatedAt
            };
            
            return new Reservation(mappedData);
        } catch (error) {
            throw new Error(`Error actualizando estado de reserva: ${error.message}`);
        }
    }

    // Eliminar reserva
    static async delete(id) {
        try {
            const query = 'DELETE FROM Reservations WHERE ReservationId = @ReservationId';
            const result = await executeQuery(query, { ReservationId: id });
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Error eliminando reserva: ${error.message}`);
        }
    }

    // Verificar disponibilidad para una nueva reserva
    static async checkAvailability(startDate, endDate, excludeReservationId = null) {
        try {
            let query = `
                SELECT COUNT(*) as conflicting_reservations
                FROM Reservations r
                INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                WHERE (
                    (r.StartDate <= @StartDate AND r.EndDate >= @StartDate)
                    OR (r.StartDate <= @EndDate AND r.EndDate >= @EndDate)
                    OR (r.StartDate >= @StartDate AND r.EndDate <= @EndDate)
                )
                AND rs.StatusName IN ('Confirmada', 'Activa')
            `;
            
            const params = { StartDate: startDate, EndDate: endDate };
            
            if (excludeReservationId) {
                query += ' AND r.ReservationId != @ExcludeId';
                params.ExcludeId = excludeReservationId;
            }
            
            const result = await executeQuery(query, params);
            return result.recordset[0].conflicting_reservations === 0;
        } catch (error) {
            throw new Error(`Error verificando disponibilidad: ${error.message}`);
        }
    }

    // Obtener estadísticas de reservas
    static async getStats() {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_reservations,
                    COUNT(CASE WHEN rs.StatusName = 'Pendiente' THEN 1 END) as pending_reservations,
                    COUNT(CASE WHEN rs.StatusName = 'Confirmada' THEN 1 END) as confirmed_reservations,
                    COUNT(CASE WHEN rs.StatusName = 'Activa' THEN 1 END) as active_reservations,
                    COUNT(CASE WHEN rs.StatusName = 'Completada' THEN 1 END) as completed_reservations,
                    COUNT(CASE WHEN rs.StatusName = 'Cancelada' THEN 1 END) as cancelled_reservations,
                    AVG(CAST(r.TotalCost as FLOAT)) as average_cost,
                    SUM(CASE WHEN ps.StatusName = 'Pagado' THEN r.TotalCost ELSE 0 END) as total_revenue
                FROM Reservations r
                INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                INNER JOIN Cat_PaymentStatuses ps ON r.PaymentStatusId = ps.PaymentStatusId
                WHERE MONTH(r.CreatedAt) = MONTH(GETDATE()) AND YEAR(r.CreatedAt) = YEAR(GETDATE())
            `;
            
            const result = await executeQuery(query);
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error obteniendo estadísticas: ${error.message}`);
        }
    }

    // Obtener reservas por UserId (a través de Owners y Pets)
    static async findByUserId(userId) {
        try {
            const query = `
                SELECT 
                    r.ReservationId,
                    r.PetId,
                    p.Name AS PetName,
                    r.RoomId,
                    rm.RoomNumber,
                    rt.RoomTypeName,
                    r.StartDate,
                    r.EndDate,
                    r.IsIndefinite,
                    r.StatusId,
                    s.StatusName,
                    r.TotalCost,
                    r.SpecialInstructions,
                    r.CheckInDate,
                    r.CheckOutDate,
                    r.StayScheduleId,
                    ss.ScheduleName AS StayScheduleName,
                    r.AssistanceLevelId,
                    al.LevelName AS AssistanceLevelName,
                    o.Name AS OwnerName,
                    o.Cedula AS OwnerCedula,
                    r.CreatedAt,
                    r.UpdatedAt
                FROM Reservations r
                INNER JOIN Pets p ON r.PetId = p.PetId
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
                LEFT JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
                LEFT JOIN Cat_ReservationStatuses s ON r.StatusId = s.StatusId
                LEFT JOIN Cat_StaySchedules ss ON r.StayScheduleId = ss.StayScheduleId
                LEFT JOIN Cat_AssistanceLevels al ON r.AssistanceLevelId = al.AssistanceLevelId
                WHERE o.UserId = @userId
                ORDER BY r.CreatedAt DESC
            `;
            
            const result = await executeQuery(query, { userId });
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo reservas del usuario: ${error.message}`);
        }
    }
}

module.exports = Reservation;

