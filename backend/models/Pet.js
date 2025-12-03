const { executeQuery, sql } = require('../config/database');

class Pet {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.owner_name = data.owner_name;
        this.owner_cedula = data.owner_cedula;
        this.admission_date = data.admission_date;
        this.specialist_id = data.specialist_id;
        
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
            // Buscar OwnerId usando la cédula
            const ownerQuery = `
                SELECT OwnerId FROM Owners WHERE Cedula = @owner_cedula
            `;
            const ownerResult = await executeQuery(ownerQuery, { owner_cedula: petData.owner_cedula });
            
            let ownerId;
            if (ownerResult.recordset.length === 0) {
                // Crear nuevo Owner si no existe
                const createOwnerQuery = `
                    INSERT INTO Owners (Name, Cedula, Phone, Email)
                    OUTPUT INSERTED.OwnerId
                    VALUES (@name, @cedula, @phone, @email)
                `;
                const newOwnerResult = await executeQuery(createOwnerQuery, {
                    name: petData.owner_name,
                    cedula: petData.owner_cedula,
                    phone: petData.owner_phone || null,
                    email: petData.owner_email || null
                });
                ownerId = newOwnerResult.recordset[0].OwnerId;
            } else {
                ownerId = ownerResult.recordset[0].OwnerId;
            }

            // Buscar SpeciesId (por defecto 'Perro' si no se especifica)
            const speciesQuery = `
                SELECT SpeciesId FROM Cat_Species WHERE SpeciesName = @species
            `;
            const speciesResult = await executeQuery(speciesQuery, { species: petData.species || 'Perro' });
            const speciesId = speciesResult.recordset[0]?.SpeciesId || 1;

            // Buscar BreedId (por defecto 'Mestizo' si no se especifica)
            const breedQuery = `
                SELECT BreedId FROM Cat_Breeds WHERE BreedName = @breed AND SpeciesId = @speciesId
            `;
            const breedResult = await executeQuery(breedQuery, { breed: petData.breed || 'Mestizo', speciesId: speciesId });
            const breedId = breedResult.recordset[0]?.BreedId || 1;

            // Insertar la mascota
            const query = `
                INSERT INTO Pets (Name, OwnerId, SpeciesId, BreedId, AdmissionDate, Weight, BirthDate, IsActive, IsApproved)
                OUTPUT INSERTED.*
                VALUES (@name, @ownerId, @speciesId, @breedId, @admissionDate, @weight, @birthDate, 1, 0)
            `;
            
            const params = {
                name: petData.name,
                ownerId: ownerId,
                speciesId: speciesId,
                breedId: breedId,
                admissionDate: petData.admission_date || new Date(),
                weight: petData.weight || null,
                birthDate: petData.birth_date || null
            };

            const result = await executeQuery(query, params);
            const newPet = result.recordset[0];

            // Insertar cuidados especiales si hay
            if (petData.allergies || petData.special_diet || petData.bandage_changes) {
                if (petData.allergies) {
                    await executeQuery(`
                        INSERT INTO PetSpecialCare (PetId, CareType, Description)
                        VALUES (@petId, 'Alergia', @description)
                    `, { petId: newPet.PetId, description: petData.allergies });
                }
                if (petData.special_diet) {
                    await executeQuery(`
                        INSERT INTO PetSpecialCare (PetId, CareType, Description)
                        VALUES (@petId, 'Dieta', @description)
                    `, { petId: newPet.PetId, description: petData.special_diet });
                }
                if (petData.bandage_changes) {
                    await executeQuery(`
                        INSERT INTO PetSpecialCare (PetId, CareType, Description)
                        VALUES (@petId, 'Vendaje', @description)
                    `, { petId: newPet.PetId, description: petData.bandage_changes });
                }
            }

            return newPet;
        } catch (error) {
            throw new Error(`Error creando mascota: ${error.message}`);
        }
    }

    // Obtener todas las mascotas
    static async findAll() {
        try {
            const query = `
                SELECT 
                    p.PetId,
                    p.Name,
                    p.SpeciesId,
                    s.SpeciesName,
                    p.BreedId,
                    b.BreedName,
                    p.OwnerId,
                    o.Name AS OwnerName,
                    o.Cedula AS OwnerCedula,
                    p.AdmissionDate,
                    p.SpecialistId,
                    sp.EmployeeName AS SpecialistName,
                    p.BirthDate,
                    p.Weight,
                    p.Color,
                    p.Gender,
                    p.IsNeutered,
                    p.Microchip,
                    p.PhotoUrl,
                    p.IsActive,
                    p.CreatedAt,
                    p.UpdatedAt,
                    -- Verificar si tiene cuidados especiales
                    CASE WHEN EXISTS (SELECT 1 FROM PetSpecialCare WHERE PetId = p.PetId) THEN 1 ELSE 0 END AS HasSpecialCare,
                    -- Obtener alergias concatenadas
                    (SELECT STRING_AGG(Description, ', ') FROM PetSpecialCare WHERE PetId = p.PetId AND CareType = 'Alergia') AS Allergies,
                    -- Obtener dietas especiales
                    (SELECT STRING_AGG(Description, ', ') FROM PetSpecialCare WHERE PetId = p.PetId AND CareType = 'Dieta') AS SpecialDiet,
                    -- Obtener vendajes
                    (SELECT STRING_AGG(Description + ' (' + ISNULL(Frequency, 'sin frecuencia') + ')', '; ') FROM PetSpecialCare WHERE PetId = p.PetId AND CareType = 'Vendaje') AS BandageChanges,
                    p.IsApproved
                FROM Pets p
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                LEFT JOIN Cat_Species s ON p.SpeciesId = s.SpeciesId
                LEFT JOIN Cat_Breeds b ON p.BreedId = b.BreedId
                LEFT JOIN Specialists sp ON p.SpecialistId = sp.SpecialistId
                ORDER BY p.CreatedAt DESC
            `;
            
            const result = await executeQuery(query);
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo mascotas: ${error.message}`);
        }
    }

    // Obtener mascota por ID
    static async findById(id) {
        try {
            const query = `
                SELECT p.*, s.EmployeeName as specialist_name 
                FROM Pets p 
                LEFT JOIN Specialists s ON p.SpecialistId = s.SpecialistId
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
                SELECT p.*, s.EmployeeName as specialist_name 
                FROM Pets p 
                LEFT JOIN Specialists s ON p.SpecialistId = s.SpecialistId
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
                    SpecialistId = @specialist_id,
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
                specialist_id: petData.specialist_id,
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

    // Aprobar mascota
    static async approve(id) {
        try {
            const query = `
                UPDATE Pets 
                SET IsApproved = 1,
                    UpdatedAt = GETDATE()
                OUTPUT INSERTED.*
                WHERE PetId = @id
            `;
            
            const result = await executeQuery(query, { id });
            
            if (result.recordset.length === 0) {
                return null;
            }
            
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error aprobando mascota: ${error.message}`);
        }
    }

    // Eliminar mascota
    static async delete(id) {
        try {
            const query = 'DELETE FROM Pets WHERE PetId = @id';
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
                SELECT p.*, s.EmployeeName as specialist_name 
                FROM Pets p 
                LEFT JOIN Specialists s ON p.SpecialistId = s.SpecialistId
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

    // Buscar mascotas por UserId (a través de la tabla Owners)
    static async findByUserId(userId) {
        try {
            const query = `
                SELECT 
                    p.PetId,
                    p.Name,
                    p.SpeciesId,
                    s.SpeciesName,
                    p.BreedId,
                    b.BreedName,
                    p.OwnerId,
                    o.Name AS OwnerName,
                    o.Cedula AS OwnerCedula,
                    p.AdmissionDate,
                    p.SpecialistId,
                    sp.EmployeeName AS SpecialistName,
                    p.BirthDate,
                    p.Weight,
                    p.Color,
                    p.Gender,
                    p.IsNeutered,
                    p.Microchip,
                    p.PhotoUrl,
                    p.IsActive,
                    p.CreatedAt,
                    p.UpdatedAt,
                    -- Verificar si tiene cuidados especiales
                    CASE WHEN EXISTS (SELECT 1 FROM PetSpecialCare WHERE PetId = p.PetId) THEN 1 ELSE 0 END AS HasSpecialCare,
                    -- Obtener alergias concatenadas
                    (SELECT STRING_AGG(Description, ', ') FROM PetSpecialCare WHERE PetId = p.PetId AND CareType = 'Alergia') AS Allergies,
                    -- Obtener dietas especiales
                    (SELECT STRING_AGG(Description, ', ') FROM PetSpecialCare WHERE PetId = p.PetId AND CareType = 'Dieta') AS SpecialDiet,
                    -- Obtener vendajes
                    (SELECT STRING_AGG(Description + ' (' + ISNULL(Frequency, 'sin frecuencia') + ')', '; ') FROM PetSpecialCare WHERE PetId = p.PetId AND CareType = 'Vendaje') AS BandageChanges,
                    p.IsApproved
                FROM Pets p
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                LEFT JOIN Cat_Species s ON p.SpeciesId = s.SpeciesId
                LEFT JOIN Cat_Breeds b ON p.BreedId = b.BreedId
                LEFT JOIN Specialists sp ON p.SpecialistId = sp.SpecialistId
                WHERE o.UserId = @userId
                ORDER BY p.CreatedAt DESC
            `;
            
            const result = await executeQuery(query, { userId });
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo mascotas del usuario: ${error.message}`);
        }
    }

    // Obtener información del dueño por PetId
    static async getOwnerByPetId(petId) {
        try {
            const query = `
                SELECT o.OwnerId, o.UserId, o.Name, o.Cedula, o.Email
                FROM Owners o
                INNER JOIN Pets p ON o.OwnerId = p.OwnerId
                WHERE p.PetId = @petId
            `;
            
            const result = await executeQuery(query, { petId });
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error obteniendo información del dueño: ${error.message}`);
        }
    }

    // Obtener información del dueño por UserId
    static async getOwnerByUserId(userId) {
        try {
            const query = `
                SELECT OwnerId, UserId, Name, Cedula, Email, Phone
                FROM Owners
                WHERE UserId = @userId
            `;
            
            const result = await executeQuery(query, { userId });
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Error obteniendo información del dueño por UserId: ${error.message}`);
        }
    }
}

module.exports = Pet;