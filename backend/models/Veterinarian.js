const { executeQuery, sql } = require('../config/database');

class Veterinarian {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.license_number = data.license_number;
        this.phone = data.phone;
        this.email = data.email;
        this.specialty = data.specialty;
        this.is_active = data.is_active;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Crear un nuevo veterinario
    static async create(vetData) {
        try {
            const query = `
                INSERT INTO Veterinarians (name, license_number, phone, email, specialty, is_active)
                OUTPUT INSERTED.*
                VALUES (@name, @license_number, @phone, @email, @specialty, @is_active)
            `;
            
            const params = {
                name: vetData.name,
                license_number: vetData.license_number,
                phone: vetData.phone || null,
                email: vetData.email || null,
                specialty: vetData.specialty || 'General',
                is_active: vetData.is_active !== undefined ? vetData.is_active : true
            };

            const result = await executeQuery(query, params);
            return new Veterinarian(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error creando veterinario: ${error.message}`);
        }
    }

    // Obtener todos los veterinarios
    static async findAll(activeOnly = false) {
        try {
            let query = `
                SELECT * FROM Veterinarians 
            `;
            
            if (activeOnly) {
                query += 'WHERE is_active = 1 ';
            }
            
            query += 'ORDER BY name';
            
            const result = await executeQuery(query);
            return result.recordset.map(vet => new Veterinarian(vet));
        } catch (error) {
            throw new Error(`Error obteniendo veterinarios: ${error.message}`);
        }
    }

    // Obtener veterinario por ID
    static async findById(id) {
        try {
            const query = 'SELECT * FROM Veterinarians WHERE id = @id';
            const result = await executeQuery(query, { id });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Veterinarian(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error obteniendo veterinario: ${error.message}`);
        }
    }

    // Buscar veterinario por número de licencia
    static async findByLicenseNumber(licenseNumber) {
        try {
            const query = 'SELECT * FROM Veterinarians WHERE license_number = @license_number';
            const result = await executeQuery(query, { license_number: licenseNumber });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Veterinarian(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error buscando veterinario por licencia: ${error.message}`);
        }
    }

    // Actualizar veterinario
    static async update(id, vetData) {
        try {
            const query = `
                UPDATE Veterinarians 
                SET name = @name, 
                    license_number = @license_number,
                    phone = @phone,
                    email = @email,
                    specialty = @specialty,
                    is_active = @is_active,
                    updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `;
            
            const params = {
                id,
                name: vetData.name,
                license_number: vetData.license_number,
                phone: vetData.phone,
                email: vetData.email,
                specialty: vetData.specialty,
                is_active: vetData.is_active
            };

            const result = await executeQuery(query, params);
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Veterinarian(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error actualizando veterinario: ${error.message}`);
        }
    }

    // Eliminar veterinario (desactivar)
    static async delete(id) {
        try {
            const query = `
                UPDATE Veterinarians 
                SET is_active = 0, updated_at = GETDATE()
                WHERE id = @id
            `;
            const result = await executeQuery(query, { id });
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Error desactivando veterinario: ${error.message}`);
        }
    }

    // Obtener mascotas asignadas a un veterinario
    static async getPetsAssigned(veterinarianId) {
        try {
            const query = `
                SELECT p.*, COUNT(*) as pet_count
                FROM Pets p 
                WHERE p.veterinarian_id = @veterinarian_id
                GROUP BY p.id, p.name, p.owner_name, p.owner_cedula, p.admission_date, 
                         p.veterinarian_id, p.allergies, p.bandage_changes, p.special_diet,
                         p.created_at, p.updated_at
                ORDER BY p.admission_date DESC
            `;
            
            const result = await executeQuery(query, { veterinarian_id: veterinarianId });
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo mascotas asignadas: ${error.message}`);
        }
    }

    // Obtener estadísticas del veterinario
    static async getStats(veterinarianId) {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_pets,
                    COUNT(CASE WHEN p.allergies IS NOT NULL OR p.bandage_changes IS NOT NULL OR p.special_diet IS NOT NULL THEN 1 END) as pets_with_special_care,
                    COUNT(CASE WHEN DATEDIFF(day, p.admission_date, GETDATE()) <= 7 THEN 1 END) as recent_admissions
                FROM Pets p 
                WHERE p.veterinarian_id = @veterinarian_id
            `;
            
            const result = await executeQuery(query, { veterinarian_id: veterinarianId });
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error obteniendo estadísticas: ${error.message}`);
        }
    }
}

module.exports = Veterinarian;