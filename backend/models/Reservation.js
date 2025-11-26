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
            const query = `
                INSERT INTO Reservations (pet_id, start_date, end_date, is_indefinite, service_type, special_instructions, status, total_cost, payment_status, assistance_level, additional_packages, stay_schedule, room_type, room_id)
                OUTPUT INSERTED.*
                VALUES (@pet_id, @start_date, @end_date, @is_indefinite, @service_type, @special_instructions, @status, @total_cost, @payment_status, @assistance_level, @additional_packages, @stay_schedule, @room_type, @room_id)
            `;
            
            const params = {
                pet_id: reservationData.pet_id,
                start_date: reservationData.start_date,
                end_date: reservationData.is_indefinite ? null : reservationData.end_date,
                is_indefinite: reservationData.is_indefinite || false,
                service_type: reservationData.service_type || 'Guardería',
                special_instructions: reservationData.special_instructions || null,
                status: reservationData.status || 'Pendiente',
                total_cost: reservationData.total_cost || 0,
                payment_status: reservationData.payment_status || 'Pendiente',
                assistance_level: reservationData.assistance_level || 'Asistencia básica',
                additional_packages: typeof reservationData.additional_packages === 'object' 
                    ? JSON.stringify(reservationData.additional_packages) 
                    : reservationData.additional_packages || null,
                stay_schedule: reservationData.stay_schedule || 'Full estancia',
                room_type: reservationData.room_type || 'Habitación individual',
                room_id: reservationData.room_id || null
            };

            const result = await executeQuery(query, params);
            return new Reservation(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error creando reserva: ${error.message}`);
        }
    }

    // Obtener todas las reservas
    static async findAll() {
        try {
            const query = `
                SELECT r.*, p.name as pet_name, p.owner_name, p.owner_cedula, v.name as veterinarian_name
                FROM Reservations r
                INNER JOIN Pets p ON r.pet_id = p.id
                LEFT JOIN Veterinarians v ON p.veterinarian_id = v.id
                ORDER BY r.start_date DESC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(reservation => new Reservation(reservation));
        } catch (error) {
            throw new Error(`Error obteniendo reservas: ${error.message}`);
        }
    }

    // Obtener reserva por ID
    static async findById(id) {
        try {
            const query = `
                SELECT r.*, p.name as pet_name, p.owner_name, p.owner_cedula, v.name as veterinarian_name
                FROM Reservations r
                INNER JOIN Pets p ON r.pet_id = p.id
                LEFT JOIN Veterinarians v ON p.veterinarian_id = v.id
                WHERE r.id = @id
            `;
            
            const result = await executeQuery(query, { id });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Reservation(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error obteniendo reserva: ${error.message}`);
        }
    }

    // Obtener reservas por mascota
    static async findByPetId(petId) {
        try {
            const query = `
                SELECT r.*, p.name as pet_name, p.owner_name, p.owner_cedula
                FROM Reservations r
                INNER JOIN Pets p ON r.pet_id = p.id
                WHERE r.pet_id = @pet_id
                ORDER BY r.start_date DESC
            `;
            
            const result = await executeQuery(query, { pet_id: petId });
            return result.recordset.map(reservation => new Reservation(reservation));
        } catch (error) {
            throw new Error(`Error obteniendo reservas por mascota: ${error.message}`);
        }
    }

    // Obtener reservas por estado
    static async findByStatus(status) {
        try {
            const query = `
                SELECT r.*, p.name as pet_name, p.owner_name, p.owner_cedula, v.name as veterinarian_name
                FROM Reservations r
                INNER JOIN Pets p ON r.pet_id = p.id
                LEFT JOIN Veterinarians v ON p.veterinarian_id = v.id
                WHERE r.status = @status
                ORDER BY r.start_date DESC
            `;
            
            const result = await executeQuery(query, { status });
            return result.recordset.map(reservation => new Reservation(reservation));
        } catch (error) {
            throw new Error(`Error obteniendo reservas por estado: ${error.message}`);
        }
    }

    // Obtener reservas activas (en curso)
    static async findActive() {
        try {
            const query = `
                SELECT r.*, p.name as pet_name, p.owner_name, p.owner_cedula, v.name as veterinarian_name
                FROM Reservations r
                INNER JOIN Pets p ON r.pet_id = p.id
                LEFT JOIN Veterinarians v ON p.veterinarian_id = v.id
                WHERE r.status = 'Activa' 
                   OR (r.start_date <= GETDATE() AND r.end_date >= GETDATE() AND r.status = 'Confirmada')
                ORDER BY r.start_date
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(reservation => new Reservation(reservation));
        } catch (error) {
            throw new Error(`Error obteniendo reservas activas: ${error.message}`);
        }
    }

    // Obtener reservas por rango de fechas
    static async findByDateRange(startDate, endDate) {
        try {
            const query = `
                SELECT r.*, p.name as pet_name, p.owner_name, p.owner_cedula, v.name as veterinarian_name
                FROM Reservations r
                INNER JOIN Pets p ON r.pet_id = p.id
                LEFT JOIN Veterinarians v ON p.veterinarian_id = v.id
                WHERE r.start_date >= @start_date AND r.end_date <= @end_date
                ORDER BY r.start_date
            `;
            
            const result = await executeQuery(query, { 
                start_date: startDate, 
                end_date: endDate 
            });
            return result.recordset.map(reservation => new Reservation(reservation));
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
            const query = `
                UPDATE Reservations 
                SET status = @status, updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `;
            
            const result = await executeQuery(query, { id, status });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Reservation(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error actualizando estado de reserva: ${error.message}`);
        }
    }

    // Eliminar reserva
    static async delete(id) {
        try {
            const query = 'DELETE FROM Reservations WHERE id = @id';
            const result = await executeQuery(query, { id });
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
                FROM Reservations 
                WHERE (
                    (start_date <= @start_date AND end_date >= @start_date)
                    OR (start_date <= @end_date AND end_date >= @end_date)
                    OR (start_date >= @start_date AND end_date <= @end_date)
                )
                AND status IN ('Confirmada', 'Activa')
            `;
            
            const params = { start_date: startDate, end_date: endDate };
            
            if (excludeReservationId) {
                query += ' AND id != @exclude_id';
                params.exclude_id = excludeReservationId;
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
                    COUNT(CASE WHEN status = 'Pendiente' THEN 1 END) as pending_reservations,
                    COUNT(CASE WHEN status = 'Confirmada' THEN 1 END) as confirmed_reservations,
                    COUNT(CASE WHEN status = 'Activa' THEN 1 END) as active_reservations,
                    COUNT(CASE WHEN status = 'Completada' THEN 1 END) as completed_reservations,
                    COUNT(CASE WHEN status = 'Cancelada' THEN 1 END) as cancelled_reservations,
                    AVG(CAST(total_cost as FLOAT)) as average_cost,
                    SUM(CASE WHEN payment_status = 'Pagado' THEN total_cost ELSE 0 END) as total_revenue
                FROM Reservations
                WHERE MONTH(created_at) = MONTH(GETDATE()) AND YEAR(created_at) = YEAR(GETDATE())
            `;
            
            const result = await executeQuery(query);
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error obteniendo estadísticas: ${error.message}`);
        }
    }
}

module.exports = Reservation;