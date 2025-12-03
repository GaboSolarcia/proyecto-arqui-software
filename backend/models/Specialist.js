const { executeQuery, sql } = require('../config/database');

class Specialist {
    constructor(data) {
        this.id = data.id;
        this.employee_name = data.employee_name;
        this.cedula = data.cedula;
        this.admission_date = data.admission_date;
        this.shift_schedule = data.shift_schedule; // Horario 1, 2 o 3
        this.is_active = data.is_active;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Crear un nuevo especialista
    static async create(specialistData) {
        try {
            // Mapear nombres de horario a IDs
            const shiftMap = {
                'Horario 1': 1, // Turno Matutino
                'Horario 2': 2, // Turno Vespertino
                'Horario 3': 3  // Turno Nocturno
            };

            const shiftId = shiftMap[specialistData.shift_schedule] || 1;

            const query = `
                INSERT INTO Specialists (EmployeeName, Cedula, AdmissionDate, ShiftId, IsActive)
                VALUES (@employeeName, @cedula, @admissionDate, @shiftId, @isActive);
                
                SELECT s.SpecialistId, s.EmployeeName, s.Cedula, s.AdmissionDate, s.ShiftId,
                       ws.ShiftName AS ShiftScheduleName, s.IsActive
                FROM Specialists s
                LEFT JOIN Cat_WorkShifts ws ON s.ShiftId = ws.ShiftId
                WHERE s.SpecialistId = SCOPE_IDENTITY();
            `;
            
            const params = {
                employeeName: specialistData.employee_name,
                cedula: specialistData.cedula,
                admissionDate: specialistData.admission_date || new Date(),
                shiftId: shiftId,
                isActive: specialistData.is_active !== undefined ? specialistData.is_active : true
            };

            const result = await executeQuery(query, params);
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error creando especialista: ${error.message}`);
        }
    }

    // Obtener todos los especialistas
    static async findAll() {
        try {
            const query = `
                SELECT 
                    s.SpecialistId,
                    s.EmployeeName,
                    s.Cedula,
                    s.Phone,
                    s.Email,
                    s.AdmissionDate,
                    s.ShiftId,
                    ws.ShiftName AS ShiftScheduleName,
                    s.Position,
                    s.UserId,
                    s.IsActive,
                    s.CreatedAt,
                    s.UpdatedAt
                FROM Specialists s
                LEFT JOIN Cat_WorkShifts ws ON s.ShiftId = ws.ShiftId
                ORDER BY s.EmployeeName ASC
            `;
            
            const result = await executeQuery(query);
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo especialistas: ${error.message}`);
        }
    }

    // Obtener especialista por ID
    static async findById(id) {
        try {
            const query = `
                SELECT 
                    s.SpecialistId,
                    s.EmployeeName,
                    s.Cedula,
                    s.Phone,
                    s.Email,
                    s.AdmissionDate,
                    s.ShiftId,
                    ws.ShiftName AS ShiftScheduleName,
                    s.Position,
                    s.UserId,
                    s.IsActive,
                    s.CreatedAt,
                    s.UpdatedAt
                FROM Specialists s
                LEFT JOIN Cat_WorkShifts ws ON s.ShiftId = ws.ShiftId
                WHERE s.SpecialistId = @id
            `;
            
            const result = await executeQuery(query, { id });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error obteniendo especialista: ${error.message}`);
        }
    }

    // Buscar especialista por cédula
    static async findByCedula(cedula) {
        try {
            const query = `
                SELECT 
                    s.SpecialistId,
                    s.EmployeeName,
                    s.Cedula,
                    s.Phone,
                    s.Email,
                    s.AdmissionDate,
                    s.ShiftId,
                    ws.ShiftName AS ShiftScheduleName,
                    s.Position,
                    s.IsActive
                FROM Specialists s
                LEFT JOIN Cat_WorkShifts ws ON s.ShiftId = ws.ShiftId
                WHERE s.Cedula = @cedula
            `;
            
            const result = await executeQuery(query, { cedula });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error buscando especialista por cédula: ${error.message}`);
        }
    }

    // Obtener especialistas por horario
    static async findByShift(shift_schedule) {
        try {
            const query = `
                SELECT 
                    s.SpecialistId,
                    s.EmployeeName,
                    s.Cedula,
                    s.AdmissionDate,
                    s.ShiftId,
                    ws.ShiftName AS ShiftScheduleName,
                    s.Position,
                    s.IsActive
                FROM Specialists s
                INNER JOIN Cat_WorkShifts ws ON s.ShiftId = ws.ShiftId
                WHERE ws.ShiftName = @shift_schedule AND s.IsActive = 1
                ORDER BY s.EmployeeName ASC
            `;
            
            const result = await executeQuery(query, { shift_schedule });
            return result.recordset.map(specialist => new Specialist(specialist));
        } catch (error) {
            throw new Error(`Error obteniendo especialistas por horario: ${error.message}`);
        }
    }

    // Actualizar especialista
    static async update(id, specialistData) {
        try {
            const query = `
                UPDATE Specialists
                SET employee_name = @employee_name,
                    cedula = @cedula,
                    admission_date = @admission_date,
                    shift_schedule = @shift_schedule,
                    is_active = @is_active,
                    updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `;
            
            const params = {
                id,
                employee_name: specialistData.employee_name,
                cedula: specialistData.cedula,
                admission_date: specialistData.admission_date,
                shift_schedule: specialistData.shift_schedule,
                is_active: specialistData.is_active
            };

            const result = await executeQuery(query, params);
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Specialist(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error actualizando especialista: ${error.message}`);
        }
    }

    // Eliminar especialista
    static async delete(id) {
        try {
            // Primero, establecer en NULL las referencias en otras tablas
            const updateReferencesQuery = `
                UPDATE Rooms SET CleanedBy = NULL WHERE CleanedBy = @id;
                UPDATE RoomMaintenanceHistory SET PerformedBy = NULL WHERE PerformedBy = @id;
            `;
            
            await executeQuery(updateReferencesQuery, { id });
            
            // Luego, eliminar el especialista
            const deleteQuery = `
                DELETE FROM Specialists
                WHERE SpecialistId = @id
            `;
            
            await executeQuery(deleteQuery, { id });
            return true;
        } catch (error) {
            throw new Error(`Error eliminando especialista: ${error.message}`);
        }
    }

    // Obtener especialistas activos
    static async findActive() {
        try {
            const query = `
                SELECT * FROM Specialists
                WHERE is_active = 1
                ORDER BY employee_name ASC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(specialist => new Specialist(specialist));
        } catch (error) {
            throw new Error(`Error obteniendo especialistas activos: ${error.message}`);
        }
    }

    // Obtener nombre del horario
    static getShiftName(shift_schedule) {
        const shifts = {
            'Horario 1': '6:00 AM - 3:00 PM',
            'Horario 2': '3:00 PM - 10:00 PM',
            'Horario 3': '10:00 PM - 6:00 AM'
        };
        return shifts[shift_schedule] || shift_schedule;
    }
}

module.exports = Specialist;
