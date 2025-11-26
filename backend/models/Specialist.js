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
            const query = `
                INSERT INTO Specialists (employee_name, cedula, admission_date, shift_schedule, is_active)
                OUTPUT INSERTED.*
                VALUES (@employee_name, @cedula, @admission_date, @shift_schedule, @is_active)
            `;
            
            const params = {
                employee_name: specialistData.employee_name,
                cedula: specialistData.cedula,
                admission_date: specialistData.admission_date || new Date(),
                shift_schedule: specialistData.shift_schedule,
                is_active: specialistData.is_active !== undefined ? specialistData.is_active : true
            };

            const result = await executeQuery(query, params);
            return new Specialist(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error creando especialista: ${error.message}`);
        }
    }

    // Obtener todos los especialistas
    static async findAll() {
        try {
            const query = `
                SELECT * FROM Specialists
                ORDER BY employee_name ASC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(specialist => new Specialist(specialist));
        } catch (error) {
            throw new Error(`Error obteniendo especialistas: ${error.message}`);
        }
    }

    // Obtener especialista por ID
    static async findById(id) {
        try {
            const query = `
                SELECT * FROM Specialists
                WHERE id = @id
            `;
            
            const result = await executeQuery(query, { id });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Specialist(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error obteniendo especialista: ${error.message}`);
        }
    }

    // Buscar especialista por cédula
    static async findByCedula(cedula) {
        try {
            const query = `
                SELECT * FROM Specialists
                WHERE cedula = @cedula
            `;
            
            const result = await executeQuery(query, { cedula });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Specialist(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error buscando especialista por cédula: ${error.message}`);
        }
    }

    // Obtener especialistas por horario
    static async findByShift(shift_schedule) {
        try {
            const query = `
                SELECT * FROM Specialists
                WHERE shift_schedule = @shift_schedule AND is_active = 1
                ORDER BY employee_name ASC
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

    // Eliminar (desactivar) especialista
    static async delete(id) {
        try {
            const query = `
                UPDATE Specialists
                SET is_active = 0, updated_at = GETDATE()
                WHERE id = @id
            `;
            
            await executeQuery(query, { id });
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
