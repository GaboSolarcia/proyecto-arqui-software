const { executeQuery } = require('../config/database');

class Owner {

    // ============= BÁSICOS =============

    static async findAll() {
        const result = await executeQuery(`
            SELECT 
                Id                      AS id,
                Name                    AS name,
                Phone                   AS phone,
                Email                   AS email,
                Address                 AS address,
                Emergency_Contact       AS emergency_contact,
                Emergency_Phone         AS emergency_phone,
                Created_at              AS created_at,
                updated_at              AS updated_at,
                cedula
            FROM Owners;
        `);

        return result.recordset;
    }

    static async findById(id) {
        const result = await executeQuery(`
            SELECT 
                Id                      AS id,
                Name                    AS name,
                Phone                   AS phone,
                Email                   AS email,
                Address                 AS address,
                Emergency_Contact       AS emergency_contact,
                Emergency_Phone         AS emergency_phone,
                Created_at              AS created_at,
                updated_at              AS updated_at,
                cedula
            FROM Owners
            WHERE Id = @id;
        `, { id });

        return result.recordset[0];
    }

    static async findByCedula(cedula) {
        const result = await executeQuery(`
            SELECT 
                Id                      AS id,
                Name                    AS name,
                Phone                   AS phone,
                Email                   AS email,
                Address                 AS address,
                Emergency_Contact       AS emergency_contact,
                Emergency_Phone         AS emergency_phone,
                Created_at              AS created_at,
                updated_at              AS updated_at,
                cedula
            FROM Owners
            WHERE cedula = @cedula;
        `, { cedula });

        return result.recordset[0];
    }

    static async create(data) {
        const result = await executeQuery(`
            INSERT INTO Owners (
                Name,
                Phone,
                Email,
                Address,
                Emergency_Contact,
                Emergency_Phone,
                cedula,
                Created_at
            )
            OUTPUT INSERTED.*
            VALUES (
                @name,
                @phone,
                @email,
                @address,
                @emergency_contact,
                @emergency_phone,
                @cedula,
                SYSDATETIME()
            );
        `, {
            name: data.name,
            phone: data.phone || null,
            email: data.email || null,
            address: data.address || null,
            emergency_contact: data.emergency_contact || null,
            emergency_phone: data.emergency_phone || null,
            cedula: data.cedula
        });

        return result.recordset[0];
    }

    static async update(id, data) {
        const result = await executeQuery(`
            UPDATE Owners
            SET
                Name                = @name,
                Phone               = @phone,
                Email               = @email,
                Address             = @address,
                Emergency_Contact   = @emergency_contact,
                Emergency_Phone     = @emergency_phone,
                cedula              = @cedula,
                updated_at          = SYSDATETIME()
            OUTPUT INSERTED.*
            WHERE Id = @id;
        `, {
            id,
            name: data.name,
            phone: data.phone || null,
            email: data.email || null,
            address: data.address || null,
            emergency_contact: data.emergency_contact || null,
            emergency_phone: data.emergency_phone || null,
            cedula: data.cedula
        });

        return result.recordset[0];
    }

    static async delete(id) {
        const result = await executeQuery(`
            DELETE FROM Owners
            WHERE Id = @id;
        `, { id });

        return result.rowsAffected[0] > 0;
    }

    // ============= BÚSQUEDAS EXTRA =============

    static async findByName(name) {
        const result = await executeQuery(`
            SELECT 
                Id      AS id,
                Name    AS name,
                Phone   AS phone,
                Email   AS email,
                Address AS address,
                Emergency_Contact AS emergency_contact,
                Emergency_Phone   AS emergency_phone,
                Created_at        AS created_at,
                updated_at        AS updated_at,
                cedula
            FROM Owners
            WHERE Name LIKE @name;
        `, { name: `%${name}%` });

        return result.recordset;
    }

    static async exists(cedula) {
        const result = await executeQuery(`
            SELECT 1 AS existsFlag
            FROM Owners
            WHERE cedula = @cedula;
        `, { cedula });

        return result.recordset.length > 0;
    }

    // ============= MASCOTAS RELACIONADAS =============

    // Mascotas por cédula del dueño
    static async getPets(cedula) {
        const result = await executeQuery(`
            SELECT 
                p.Id            AS id,
                p.Name          AS name,
                p.Species       AS species,
                p.Breed         AS breed,
                p.AdmissionDate AS admission_date,
                p.Allergies     AS allergies,
                p.BandageChanges AS bandage_changes,
                p.SpecialDiet   AS special_diet,
                o.Id            AS owner_id,
                o.Name          AS owner_name,
                o.cedula        AS owner_cedula
            FROM Pets p
            INNER JOIN Owners o ON p.OwnerId = o.Id
            WHERE o.cedula = @cedula;
        `, { cedula });

        return result.recordset;
    }

    // Info completa del dueño con sus mascotas (por id)
    static async getOwnerWithPets(id) {
        const owner = await this.findById(id);
        if (!owner) return null;

        const pets = await executeQuery(`
            SELECT 
                p.Id            AS id,
                p.Name          AS name,
                p.Species       AS species,
                p.Breed         AS breed,
                p.AdmissionDate AS admission_date,
                p.Allergies     AS allergies,
                p.BandageChanges AS bandage_changes,
                p.SpecialDiet   AS special_diet
            FROM Pets p
            WHERE p.OwnerId = @id;
        `, { id });

        return {
            ...owner,
            pets: pets.recordset
        };
    }
}

module.exports = Owner;