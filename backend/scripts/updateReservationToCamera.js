const { executeQuery, sql } = require('../config/database');

async function updateReservationToCamera() {
    try {
        console.log('🔄 Actualizando reservación de Rocky a habitación con cámara...\n');

        // Obtener habitación con cámara disponible
        const roomQuery = `
            SELECT TOP 1 r.RoomId, r.RoomNumber
            FROM Rooms r
            INNER JOIN Cat_RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
            WHERE rt.RoomTypeName = 'Habitación Individual con Cámara'
        `;
        const roomResult = await executeQuery(roomQuery);

        if (roomResult.recordset.length === 0) {
            console.log('❌ No hay habitaciones con cámara');
            process.exit(1);
        }

        const room = roomResult.recordset[0];
        console.log(`Habitación con cámara: ${room.RoomNumber} (ID: ${room.RoomId})`);

        // Actualizar la reservación
        const updateQuery = `
            UPDATE Reservations
            SET RoomId = @roomId
            WHERE ReservationId = 2
        `;

        await executeQuery(updateQuery, {
            roomId: sql.Int, roomId: room.RoomId
        });

        console.log('✅ Reservación actualizada exitosamente!\n');

        // Verificar
        const verifyQuery = `
            SELECT 
                r.ReservationId,
                p.Name as PetName,
                rm.RoomNumber,
                rt.RoomTypeName,
                rs.StatusName
            FROM Reservations r
            INNER JOIN Pets p ON r.PetId = p.PetId
            INNER JOIN Rooms rm ON r.RoomId = rm.RoomId
            INNER JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
            INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            WHERE r.ReservationId = 2
        `;

        const verify = await executeQuery(verifyQuery);
        console.log('Reservación actualizada:');
        console.log(verify.recordset[0]);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

updateReservationToCamera();
