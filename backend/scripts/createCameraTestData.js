const { executeQuery, sql } = require('../config/database');

async function createTestReservation() {
    console.log('🔧 Creando datos de prueba para monitoreo de cámaras...\n');

    try {
        // 1. Buscar un usuario normal
        console.log('1️⃣ Buscando usuario cliente...');
        const userQuery = `
            SELECT TOP 1 u.UserId, u.Username, u.Email
            FROM Users u
            INNER JOIN Cat_UserRoles r ON u.RoleId = r.RoleId
            WHERE r.RoleName = 'Usuario Normal'
        `;
        const userResult = await executeQuery(userQuery);

        if (userResult.recordset.length === 0) {
            console.log('❌ No se encontró ningún usuario normal. Por favor, registra un usuario primero.');
            process.exit(1);
        }

        const user = userResult.recordset[0];
        console.log(`✅ Usuario encontrado: ${user.Username} (ID: ${user.UserId})\n`);

        // 2. Buscar o crear un Owner vinculado
        console.log('2️⃣ Buscando dueño...');
        let ownerQuery = `SELECT OwnerId FROM Owners WHERE UserId = @userId`;
        let ownerResult = await executeQuery(ownerQuery, { userId: sql.Int, userId: user.UserId });

        let ownerId;
        if (ownerResult.recordset.length === 0) {
            console.log('Creando dueño...');
            const createOwnerQuery = `
                INSERT INTO Owners (Cedula, Name, Phone, Email, Address, UserId, IsActive)
                OUTPUT INSERTED.OwnerId
                VALUES (@cedula, @name, @phone, @email, @address, @userId, 1)
            `;
            const ownerInsert = await executeQuery(createOwnerQuery, {
                cedula: sql.NVarChar(20), cedula: `TEST${user.UserId}`,
                name: sql.NVarChar(150), name: user.Username,
                phone: sql.NVarChar(20), phone: '1234567890',
                email: sql.NVarChar(150), email: user.Email,
                address: sql.NVarChar(250), address: 'Dirección de Prueba',
                userId: sql.Int, userId: user.UserId
            });
            ownerId = ownerInsert.recordset[0].OwnerId;
            console.log(`✅ Dueño creado con ID: ${ownerId}\n`);
        } else {
            ownerId = ownerResult.recordset[0].OwnerId;
            console.log(`✅ Dueño encontrado con ID: ${ownerId}\n`);
        }

        // 3. Buscar o crear una mascota
        console.log('3️⃣ Buscando mascota...');
        let petQuery = `SELECT TOP 1 PetId, Name FROM Pets WHERE OwnerId = @ownerId AND IsActive = 1`;
        let petResult = await executeQuery(petQuery, { ownerId: sql.Int, ownerId: ownerId });

        let petId, petName;
        if (petResult.recordset.length === 0) {
            console.log('Creando mascota...');
            const createPetQuery = `
                INSERT INTO Pets (Name, SpeciesId, OwnerId, AdmissionDate, IsActive)
                OUTPUT INSERTED.PetId, INSERTED.Name
                VALUES (@name, @speciesId, @ownerId, GETDATE(), 1)
            `;
            const speciesResult = await executeQuery(`SELECT TOP 1 SpeciesId FROM Cat_Species WHERE SpeciesName = 'Perro'`);
            const petInsert = await executeQuery(createPetQuery, {
                name: sql.NVarChar(150), name: 'Max Test Camera',
                speciesId: sql.Int, speciesId: speciesResult.recordset[0].SpeciesId,
                ownerId: sql.Int, ownerId: ownerId
            });
            petId = petInsert.recordset[0].PetId;
            petName = petInsert.recordset[0].Name;
            console.log(`✅ Mascota creada: ${petName} (ID: ${petId})\n`);
        } else {
            petId = petResult.recordset[0].PetId;
            petName = petResult.recordset[0].Name;
            console.log(`✅ Mascota encontrada: ${petName} (ID: ${petId})\n`);
        }

        // 4. Buscar habitación con cámara disponible
        console.log('4️⃣ Buscando habitación con cámara...');
        const roomQuery = `
            SELECT TOP 1 r.RoomId, r.RoomNumber
            FROM Rooms r
            INNER JOIN Cat_RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
            INNER JOIN Cat_RoomStatuses rs ON r.RoomStatusId = rs.RoomStatusId
            WHERE rt.RoomTypeName = 'Habitación Individual con Cámara'
                AND rs.StatusName = 'Disponible'
        `;
        const roomResult = await executeQuery(roomQuery);

        if (roomResult.recordset.length === 0) {
            console.log('❌ No hay habitaciones con cámara disponibles');
            process.exit(1);
        }

        const room = roomResult.recordset[0];
        console.log(`✅ Habitación encontrada: ${room.RoomNumber} (ID: ${room.RoomId})\n`);

        // 5. Verificar si ya existe reservación activa
        console.log('5️⃣ Verificando reservaciones existentes...');
        const checkReservation = `
            SELECT COUNT(*) as Count
            FROM Reservations r
            INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            WHERE r.PetId = @petId
                AND rs.StatusName IN ('Confirmada', 'Activa', 'Check-In')
        `;
        const checkResult = await executeQuery(checkReservation, { petId: sql.Int, petId: petId });

        if (checkResult.recordset[0].Count > 0) {
            console.log('⚠️ Ya existe una reservación activa para esta mascota\n');
        } else {
            console.log('6️⃣ Creando reservación...');
            
            // Obtener IDs necesarios
            const serviceType = await executeQuery(`SELECT ServiceTypeId FROM Cat_ServiceTypes WHERE ServiceName = 'Guardería'`);
            const activeStatus = await executeQuery(`SELECT StatusId FROM Cat_ReservationStatuses WHERE StatusName = 'Activa'`);
            const paidStatus = await executeQuery(`SELECT PaymentStatusId FROM Cat_PaymentStatuses WHERE StatusName = 'Pagado'`);

            const createReservation = `
                INSERT INTO Reservations (
                    PetId, RoomId, ServiceTypeId, StartDate, EndDate,
                    IsIndefinite, StatusId, PaymentStatusId, TotalCost, CreatedBy
                )
                OUTPUT INSERTED.ReservationId
                VALUES (
                    @petId, @roomId, @serviceTypeId, @startDate, @endDate,
                    0, @statusId, @paymentStatusId, 500.00, @userId
                )
            `;

            const reservationInsert = await executeQuery(createReservation, {
                petId: sql.Int, petId: petId,
                roomId: sql.Int, roomId: room.RoomId,
                serviceTypeId: sql.Int, serviceTypeId: serviceType.recordset[0].ServiceTypeId,
                startDate: sql.DateTime2, startDate: new Date(Date.now() - 86400000), // Ayer
                endDate: sql.DateTime2, endDate: new Date(Date.now() + 7 * 86400000), // +7 días
                statusId: sql.Int, statusId: activeStatus.recordset[0].StatusId,
                paymentStatusId: sql.Int, paymentStatusId: paidStatus.recordset[0].PaymentStatusId,
                userId: sql.Int, userId: user.UserId
            });

            // Actualizar habitación a Ocupada
            const occupiedStatus = await executeQuery(`SELECT RoomStatusId FROM Cat_RoomStatuses WHERE StatusName = 'Ocupada'`);
            await executeQuery(
                `UPDATE Rooms SET RoomStatusId = @statusId WHERE RoomId = @roomId`,
                {
                    statusId: sql.Int, statusId: occupiedStatus.recordset[0].RoomStatusId,
                    roomId: sql.Int, roomId: room.RoomId
                }
            );

            console.log(`✅ Reservación creada exitosamente!\n`);
        }

        console.log('═══════════════════════════════════════════');
        console.log('📋 DATOS DE PRUEBA PARA MONITOREO');
        console.log('═══════════════════════════════════════════');
        console.log(`👤 Usuario: ${user.Username}`);
        console.log(`📧 Email: ${user.Email}`);
        console.log(`🐕 Mascota: ${petName}`);
        console.log(`🏠 Habitación: ${room.RoomNumber}`);
        console.log('═══════════════════════════════════════════');
        console.log('\n✅ Ahora puedes iniciar sesión y acceder al monitoreo!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        process.exit(0);
    }
}

createTestReservation();
