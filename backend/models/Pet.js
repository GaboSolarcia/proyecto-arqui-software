const { executeQuery, sql } = require('../config/database');

class Pet {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.owner_name = data.owner_name;
        this.owner_cedula = data.owner_cedula;
        this.admission_date = data.admission_date;
        this.veterinarian_id = data.veterinarian_id;
        
        // Cuidados especiales
        this.allergies = data.allergies;
        this.bandage_changes = data.bandage_changes;
        this.special_diet = data.special_diet;
        
        // Nivel de asistencia
        this.assistance_level = data.assistance_level;
        
        // Paquetes adicionales (JSON string)
        this.additional_packages = data.additional_packages;
        
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Crear una nueva mascota
    static async create(petData) {
        try {
            const query = `
                INSERT INTO Pets (name, owner_name, owner_cedula, admission_date, veterinarian_id, allergies, bandage_changes, special_diet, assistance_level, additional_packages)
                OUTPUT INSERTED.*
                VALUES (@name, @owner_name, @owner_cedula, @admission_date, @veterinarian_id, @allergies, @bandage_changes, @special_diet, @assistance_level, @additional_packages)
            `;
            
            const params = {
                name: petData.name,
                owner_name: petData.owner_name,
                owner_cedula: petData.owner_cedula,
                admission_date: petData.admission_date || new Date(),
                veterinarian_id: petData.veterinarian_id,
                allergies: petData.allergies || null,
                bandage_changes: petData.bandage_changes || null,
                special_diet: petData.special_diet || null,
                assistance_level: petData.assistance_level || 'Asistencia básica',
                additional_packages: typeof petData.additional_packages === 'object' 
                    ? JSON.stringify(petData.additional_packages) 
                    : petData.additional_packages || null
            };

            const result = await executeQuery(query, params);
            return new Pet(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error creando mascota: ${error.message}`);
        }
    }

    // Obtener todas las mascotas
    static async findAll() {
        try {
            const query = `
                SELECT p.*, v.name as veterinarian_name 
                FROM Pets p 
                LEFT JOIN Veterinarians v ON p.veterinarian_id = v.id
                ORDER BY p.admission_date DESC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(pet => new Pet(pet));
        } catch (error) {
            throw new Error(`Error obteniendo mascotas: ${error.message}`);
        }
    }

    // Obtener mascota por ID
    static async findById(id) {
        try {
            const query = `
                SELECT p.*, v.name as veterinarian_name 
                FROM Pets p 
                LEFT JOIN Veterinarians v ON p.veterinarian_id = v.id
                WHERE p.id = @id
            `;
            
            const result = await executeQuery(query, { id });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Pet(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error obteniendo mascota: ${error.message}`);
        }
    }

    // Buscar mascotas por cédula del dueño
    static async findByOwnerCedula(cedula) {
        try {
            const query = `
                SELECT p.*, v.name as veterinarian_name 
                FROM Pets p 
                LEFT JOIN Veterinarians v ON p.veterinarian_id = v.id
                WHERE p.owner_cedula = @cedula
                ORDER BY p.admission_date DESC
            `;
            
            const result = await executeQuery(query, { cedula });
            return result.recordset.map(pet => new Pet(pet));
        } catch (error) {
            throw new Error(`Error buscando mascotas por cédula: ${error.message}`);
        }
    }

    // Actualizar mascota
    static async update(id, petData) {
        try {
            const query = `
                UPDATE Pets 
                SET name = @name, 
                    owner_name = @owner_name, 
                    owner_cedula = @owner_cedula,
                    veterinarian_id = @veterinarian_id,
                    allergies = @allergies,
                    bandage_changes = @bandage_changes,
                    special_diet = @special_diet,
                    updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `;
            
            const params = {
                id,
                name: petData.name,
                owner_name: petData.owner_name,
                owner_cedula: petData.owner_cedula,
                veterinarian_id: petData.veterinarian_id,
                allergies: petData.allergies,
                bandage_changes: petData.bandage_changes,
                special_diet: petData.special_diet
            };

            const result = await executeQuery(query, params);
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Pet(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error actualizando mascota: ${error.message}`);
        }
    }

    // Eliminar mascota
    static async delete(id) {
        try {
            const query = 'DELETE FROM Pets WHERE id = @id';
            const result = await executeQuery(query, { id });
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Error eliminando mascota: ${error.message}`);
        }
    }

    // Buscar mascotas con cuidados especiales
    static async findWithSpecialCare() {
        try {
            const query = `
                SELECT p.*, v.name as veterinarian_name 
                FROM Pets p 
                LEFT JOIN Veterinarians v ON p.veterinarian_id = v.id
                WHERE p.allergies IS NOT NULL 
                   OR p.bandage_changes IS NOT NULL 
                   OR p.special_diet IS NOT NULL
                ORDER BY p.admission_date DESC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(pet => new Pet(pet));
        } catch (error) {
            throw new Error(`Error obteniendo mascotas con cuidados especiales: ${error.message}`);
        }
    }
}

module.exports = Pet;