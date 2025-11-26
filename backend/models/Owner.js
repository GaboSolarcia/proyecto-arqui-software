const { executeQuery, sql } = require('../config/database');

class Owner {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.cedula = data.cedula;
        this.phone = data.phone;
        this.email = data.email;
        this.address = data.address;
        this.emergency_contact = data.emergency_contact;
        this.emergency_phone = data.emergency_phone;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    // Crear un nuevo dueño
    static async create(ownerData) {
        try {
            const query = `
                INSERT INTO Owners (name, cedula, phone, email, address, emergency_contact, emergency_phone)
                OUTPUT INSERTED.*
                VALUES (@name, @cedula, @phone, @email, @address, @emergency_contact, @emergency_phone)
            `;
            
            const params = {
                name: ownerData.name,
                cedula: ownerData.cedula,
                phone: ownerData.phone || null,
                email: ownerData.email || null,
                address: ownerData.address || null,
                emergency_contact: ownerData.emergency_contact || null,
                emergency_phone: ownerData.emergency_phone || null
            };

            const result = await executeQuery(query, params);
            return new Owner(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error creando dueño: ${error.message}`);
        }
    }

    // Obtener todos los dueños
    static async findAll() {
        try {
            const query = `
                SELECT o.*, COUNT(p.id) as pet_count
                FROM Owners o
                LEFT JOIN Pets p ON o.cedula = p.owner_cedula
                GROUP BY o.id, o.name, o.cedula, o.phone, o.email, o.address, 
                         o.emergency_contact, o.emergency_phone, o.created_at, o.updated_at
                ORDER BY o.name
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(owner => new Owner(owner));
        } catch (error) {
            throw new Error(`Error obteniendo dueños: ${error.message}`);
        }
    }

    // Obtener dueño por ID
    static async findById(id) {
        try {
            const query = 'SELECT * FROM Owners WHERE id = @id';
            const result = await executeQuery(query, { id });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Owner(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error obteniendo dueño: ${error.message}`);
        }
    }

    // Buscar dueño por cédula
    static async findByCedula(cedula) {
        try {
            const query = 'SELECT * FROM Owners WHERE cedula = @cedula';
            const result = await executeQuery(query, { cedula });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Owner(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error buscando dueño por cédula: ${error.message}`);
        }
    }

    // Buscar dueños por nombre (búsqueda parcial)
    static async findByName(name) {
        try {
            const query = `
                SELECT * FROM Owners 
                WHERE name LIKE @name
                ORDER BY name
            `;
            const result = await executeQuery(query, { name: `%${name}%` });
            return result.recordset.map(owner => new Owner(owner));
        } catch (error) {
            throw new Error(`Error buscando dueños por nombre: ${error.message}`);
        }
    }

    // Actualizar dueño
    static async update(id, ownerData) {
        try {
            const query = `
                UPDATE Owners 
                SET name = @name, 
                    cedula = @cedula,
                    phone = @phone,
                    email = @email,
                    address = @address,
                    emergency_contact = @emergency_contact,
                    emergency_phone = @emergency_phone,
                    updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE id = @id
            `;
            
            const params = {
                id,
                name: ownerData.name,
                cedula: ownerData.cedula,
                phone: ownerData.phone,
                email: ownerData.email,
                address: ownerData.address,
                emergency_contact: ownerData.emergency_contact,
                emergency_phone: ownerData.emergency_phone
            };

            const result = await executeQuery(query, params);
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return new Owner(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error actualizando dueño: ${error.message}`);
        }
    }

    // Eliminar dueño
    static async delete(id) {
        try {
            // Verificar si tiene mascotas asociadas
            const petsQuery = 'SELECT COUNT(*) as pet_count FROM Pets WHERE owner_cedula = (SELECT cedula FROM Owners WHERE id = @id)';
            const petsResult = await executeQuery(petsQuery, { id });
            
            if (petsResult.recordset[0].pet_count > 0) {
                throw new Error('No se puede eliminar un dueño que tiene mascotas registradas');
            }

            const query = 'DELETE FROM Owners WHERE id = @id';
            const result = await executeQuery(query, { id });
            return result.rowsAffected[0] > 0;
        } catch (error) {
            throw new Error(`Error eliminando dueño: ${error.message}`);
        }
    }

    // Obtener mascotas del dueño
    static async getPets(cedula) {
        try {
            const query = `
                SELECT p.*, v.name as veterinarian_name
                FROM Pets p
                LEFT JOIN Veterinarians v ON p.veterinarian_id = v.id
                WHERE p.owner_cedula = @cedula
                ORDER BY p.admission_date DESC
            `;
            
            const result = await executeQuery(query, { cedula });
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo mascotas del dueño: ${error.message}`);
        }
    }

    // Obtener información completa del dueño con sus mascotas
    static async getOwnerWithPets(id) {
        try {
            const owner = await Owner.findById(id);
            if (!owner) {
                return null;
            }

            const pets = await Owner.getPets(owner.cedula);
            
            return {
                ...owner,
                pets: pets
            };
        } catch (error) {
            throw new Error(`Error obteniendo información completa del dueño: ${error.message}`);
        }
    }

    // Validar si existe un dueño con la cédula especificada
    static async exists(cedula) {
        try {
            const query = 'SELECT COUNT(*) as count FROM Owners WHERE cedula = @cedula';
            const result = await executeQuery(query, { cedula });
            return result.recordset[0].count > 0;
        } catch (error) {
            throw new Error(`Error verificando existencia del dueño: ${error.message}`);
        }
    }
}

module.exports = Owner;