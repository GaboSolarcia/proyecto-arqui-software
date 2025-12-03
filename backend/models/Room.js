const { executeQuery, sql } = require('../config/database');

class Room {
    constructor(data) {
        this.id = data.id;
        this.room_number = data.room_number;
        this.room_type = data.room_type; // Individual, Individual con cámara, Cuidados especiales
        this.status = data.status; // Disponible, Reservada, En mantenimiento, Cerrada
        this.last_cleaning_date = data.last_cleaning_date;
        this.cleaned_by = data.cleaned_by; // ID o nombre del personal
        this.maintenance_notes = data.maintenance_notes; // JSON con historial
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Crear una nueva habitación
    static async create(roomData) {
        try {
            const query = `
                INSERT INTO Rooms (room_number, room_type, status, last_cleaning_date, cleaned_by, maintenance_notes)
                OUTPUT INSERTED.*
                VALUES (@room_number, @room_type, @status, @last_cleaning_date, @cleaned_by, @maintenance_notes)
            `;
            
            const params = {
                room_number: roomData.room_number,
                room_type: roomData.room_type,
                status: roomData.status || 'Disponible',
                last_cleaning_date: roomData.last_cleaning_date || null,
                cleaned_by: roomData.cleaned_by || null,
                maintenance_notes: typeof roomData.maintenance_notes === 'object' 
                    ? JSON.stringify(roomData.maintenance_notes) 
                    : roomData.maintenance_notes || null
            };

            const result = await executeQuery(query, params);
            return new Room(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error creando habitación: ${error.message}`);
        }
    }

    // Obtener todas las habitaciones
    static async findAll() {
        try {
            const query = `
                SELECT 
                    r.RoomId,
                    r.RoomNumber,
                    r.RoomTypeId,
                    rt.RoomTypeName,
                    r.RoomStatusId,
                    rs.StatusName AS StatusName,
                    r.Floor,
                    r.LastCleaningDate,
                    r.CleanedBy,
                    s.EmployeeName AS CleanedByName,
                    r.Notes AS MaintenanceNotes,
                    r.CreatedAt,
                    r.UpdatedAt
                FROM Rooms r
                LEFT JOIN Cat_RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
                LEFT JOIN Cat_RoomStatuses rs ON r.RoomStatusId = rs.RoomStatusId
                LEFT JOIN Specialists s ON r.CleanedBy = s.SpecialistId
                ORDER BY r.RoomNumber ASC
            `;
            
            const result = await executeQuery(query);
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo habitaciones: ${error.message}`);
        }
    }

    // Obtener habitación por ID
    static async findById(id) {
        try {
            const query = `
                SELECT 
                    r.RoomId,
                    r.RoomNumber,
                    r.RoomTypeId,
                    rt.RoomTypeName,
                    r.RoomStatusId,
                    rs.StatusName AS StatusName,
                    r.Floor,
                    r.LastCleaningDate,
                    r.CleanedBy,
                    s.EmployeeName AS CleanedByName,
                    r.Notes AS MaintenanceNotes,
                    r.CreatedAt,
                    r.UpdatedAt
                FROM Rooms r
                LEFT JOIN Cat_RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
                LEFT JOIN Cat_RoomStatuses rs ON r.RoomStatusId = rs.RoomStatusId
                LEFT JOIN Specialists s ON r.CleanedBy = s.SpecialistId
                WHERE r.RoomId = @id
            `;
            
            const result = await executeQuery(query, { id });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error obteniendo habitación: ${error.message}`);
        }
    }

    // Obtener habitaciones por estado
    static async findByStatus(status) {
        try {
            const query = `
                SELECT 
                    r.RoomId,
                    r.RoomNumber,
                    r.RoomTypeId,
                    rt.RoomTypeName,
                    r.RoomStatusId,
                    rs.StatusName AS StatusName,
                    r.Floor,
                    r.LastCleaningDate,
                    r.CleanedBy,
                    s.EmployeeName AS CleanedByName,
                    r.Notes AS MaintenanceNotes
                FROM Rooms r
                LEFT JOIN Cat_RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
                INNER JOIN Cat_RoomStatuses rs ON r.RoomStatusId = rs.RoomStatusId
                LEFT JOIN Specialists s ON r.CleanedBy = s.SpecialistId
                WHERE rs.StatusName = @status
                ORDER BY r.RoomNumber ASC
            `;
            
            const result = await executeQuery(query, { status });
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo habitaciones por estado: ${error.message}`);
        }
    }

    // Obtener habitaciones disponibles
    static async findAvailable() {
        try {
            const query = `
                SELECT 
                    r.RoomId,
                    r.RoomNumber,
                    r.RoomTypeId,
                    rt.RoomTypeName,
                    r.RoomStatusId,
                    rs.StatusName AS StatusName
                FROM Rooms r
                LEFT JOIN Cat_RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
                INNER JOIN Cat_RoomStatuses rs ON r.RoomStatusId = rs.RoomStatusId
                WHERE rs.StatusName = 'Disponible'
                ORDER BY r.RoomNumber ASC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(room => new Room(room));
        } catch (error) {
            throw new Error(`Error obteniendo habitaciones disponibles: ${error.message}`);
        }
    }

    // Obtener habitaciones por tipo
    static async findByType(room_type) {
        try {
            const query = `
                SELECT * FROM Rooms
                WHERE room_type = @room_type
                ORDER BY room_number ASC
            `;
            
            const result = await executeQuery(query, { room_type });
            return result.recordset.map(room => new Room(room));
        } catch (error) {
            throw new Error(`Error obteniendo habitaciones por tipo: ${error.message}`);
        }
    }

    // Actualizar habitación
    static async update(id, roomData) {
        try {
            const query = `
                UPDATE Rooms
                SET room_number = @room_number,
                    room_type = @room_type,
                    status = @status,
                    last_cleaning_date = @last_cleaning_date,
                    cleaned_by = @cleaned_by,
                    maintenance_notes = @maintenance_notes,
                    updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `;
            
            const params = {
                id,
                room_number: roomData.room_number,
                room_type: roomData.room_type,
                status: roomData.status,
                last_cleaning_date: roomData.last_cleaning_date,
                cleaned_by: roomData.cleaned_by,
                maintenance_notes: typeof roomData.maintenance_notes === 'object' 
                    ? JSON.stringify(roomData.maintenance_notes) 
                    : roomData.maintenance_notes
            };

            const result = await executeQuery(query, params);
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Room(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error actualizando habitación: ${error.message}`);
        }
    }

    // Registrar limpieza
    static async registerCleaning(id, cleanedBy) {
        try {
            const query = `
                UPDATE Rooms
                SET last_cleaning_date = GETDATE(),
                    cleaned_by = @cleaned_by,
                    updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `;
            
            const result = await executeQuery(query, { id, cleaned_by: cleanedBy });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Room(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error registrando limpieza: ${error.message}`);
        }
    }

    // Agregar nota de mantenimiento
    static async addMaintenanceNote(id, note) {
        try {
            // Obtener notas actuales
            const room = await this.findById(id);
            if (!room) return null;

            let notes = [];
            if (room.maintenance_notes) {
                try {
                    notes = JSON.parse(room.maintenance_notes);
                } catch (e) {
                    notes = [];
                }
            }

            // Agregar nueva nota
            notes.push({
                date: new Date().toISOString(),
                ...note
            });

            const query = `
                UPDATE Rooms
                SET maintenance_notes = @maintenance_notes,
                    updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `;
            
            const result = await executeQuery(query, { 
                id, 
                maintenance_notes: JSON.stringify(notes) 
            });
            
            return new Room(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error agregando nota de mantenimiento: ${error.message}`);
        }
    }

    // Cambiar estado de habitación
    static async changeStatus(id, newStatus) {
        try {
            // Mapear nombre de estado a RoomStatusId
            const statusMap = {
                'Disponible': 1,
                'Ocupada': 2,
                'En Limpieza': 3,
                'En Mantenimiento': 4,
                'Fuera de Servicio': 5
            };

            const statusId = statusMap[newStatus];
            if (!statusId) {
                throw new Error(`Estado inválido: ${newStatus}`);
            }

            const query = `
                UPDATE Rooms
                SET RoomStatusId = @statusId,
                    UpdatedAt = GETDATE()
                WHERE RoomId = @roomId
            `;
            
            await executeQuery(query, { roomId: id, statusId });
            
            // Obtener la habitación actualizada
            return await this.findById(id);
        } catch (error) {
            throw new Error(`Error cambiando estado de habitación: ${error.message}`);
        }
    }

    // Eliminar habitación
    static async delete(id) {
        try {
            const query = `
                DELETE FROM Rooms
                WHERE id = @id
            `;
            
            await executeQuery(query, { id });
            return true;
        } catch (error) {
            throw new Error(`Error eliminando habitación: ${error.message}`);
        }
    }

    // Obtener estadísticas de habitaciones
    static async getStatistics() {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'Disponible' THEN 1 ELSE 0 END) as disponibles,
                    SUM(CASE WHEN status = 'Reservada' THEN 1 ELSE 0 END) as reservadas,
                    SUM(CASE WHEN status = 'En mantenimiento' THEN 1 ELSE 0 END) as en_mantenimiento,
                    SUM(CASE WHEN status = 'Cerrada' THEN 1 ELSE 0 END) as cerradas
                FROM Rooms
            `;
            
            const result = await executeQuery(query);
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error obteniendo estadísticas: ${error.message}`);
        }
    }
}

module.exports = Room;
