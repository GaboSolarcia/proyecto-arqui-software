const { executeQuery } = require('../config/database');

async function testReservationsList() {
    try {
        console.log('🔍 Verificando reservaciones en la base de datos...\n');

        // 1. Ver todas las reservaciones
        console.log('📋 Todas las reservaciones:');
        const allReservations = await executeQuery(`
            SELECT 
                r.ReservationId,
                r.PetId,
                p.Name AS PetName,
                r.RoomId,
                rm.RoomNumber,
                rt.RoomTypeName,
                r.StartDate,
                r.EndDate,
                rs.StatusName,
                r.TotalCost,
                o.Name AS OwnerName,
                o.UserId,
                u.Username,
                r.CreatedAt
            FROM Reservations r
            INNER JOIN Pets p ON r.PetId = p.PetId
            INNER JOIN Owners o ON p.OwnerId = o.OwnerId
            INNER JOIN Users u ON o.UserId = u.UserId
            LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
            LEFT JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
            LEFT JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            ORDER BY r.CreatedAt DESC
        `);
        
        console.table(allReservations.recordset);

        // 2. Ver las reservaciones más recientes (últimas 5)
        console.log('\n📌 Últimas 5 reservaciones creadas:');
        const recentReservations = await executeQuery(`
            SELECT TOP 5
                r.ReservationId,
                p.Name AS PetName,
                rt.RoomTypeName,
                rs.StatusName,
                FORMAT(r.StartDate, 'dd/MM/yyyy') AS StartDate,
                FORMAT(r.EndDate, 'dd/MM/yyyy') AS EndDate,
                r.TotalCost,
                u.Username,
                FORMAT(r.CreatedAt, 'dd/MM/yyyy HH:mm:ss') AS CreatedAt
            FROM Reservations r
            INNER JOIN Pets p ON r.PetId = p.PetId
            INNER JOIN Owners o ON p.OwnerId = o.OwnerId
            INNER JOIN Users u ON o.UserId = u.UserId
            LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
            LEFT JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
            LEFT JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            ORDER BY r.CreatedAt DESC
        `);
        
        console.table(recentReservations.recordset);

        // 3. Verificar reservaciones con cámara
        console.log('\n📷 Reservaciones con cámara:');
        const cameraReservations = await executeQuery(`
            SELECT 
                r.ReservationId,
                p.Name AS PetName,
                rt.RoomTypeName,
                rm.RoomNumber,
                rs.StatusName,
                FORMAT(r.StartDate, 'dd/MM/yyyy') AS StartDate,
                FORMAT(r.EndDate, 'dd/MM/yyyy') AS EndDate,
                u.Username,
                FORMAT(r.CreatedAt, 'dd/MM/yyyy HH:mm:ss') AS CreatedAt
            FROM Reservations r
            INNER JOIN Pets p ON r.PetId = p.PetId
            INNER JOIN Owners o ON p.OwnerId = o.OwnerId
            INNER JOIN Users u ON o.UserId = u.UserId
            INNER JOIN Rooms rm ON r.RoomId = rm.RoomId
            INNER JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
            LEFT JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            WHERE rt.RoomTypeName = 'Habitación Individual con Cámara'
            ORDER BY r.CreatedAt DESC
        `);
        
        if (cameraReservations.recordset.length > 0) {
            console.table(cameraReservations.recordset);
        } else {
            console.log('❌ No se encontraron reservaciones con cámara');
        }

        // 4. Verificar el usuario jperez específicamente
        console.log('\n👤 Reservaciones del usuario jperez:');
        const jperezReservations = await executeQuery(`
            SELECT 
                r.ReservationId,
                p.Name AS PetName,
                rt.RoomTypeName,
                rm.RoomNumber,
                rs.StatusName,
                FORMAT(r.StartDate, 'dd/MM/yyyy') AS StartDate,
                FORMAT(r.EndDate, 'dd/MM/yyyy') AS EndDate,
                r.TotalCost,
                FORMAT(r.CreatedAt, 'dd/MM/yyyy HH:mm:ss') AS CreatedAt
            FROM Reservations r
            INNER JOIN Pets p ON r.PetId = p.PetId
            INNER JOIN Owners o ON p.OwnerId = o.OwnerId
            INNER JOIN Users u ON o.UserId = u.UserId
            LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
            LEFT JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
            LEFT JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            WHERE u.Username = 'jperez'
            ORDER BY r.CreatedAt DESC
        `);
        
        if (jperezReservations.recordset.length > 0) {
            console.table(jperezReservations.recordset);
        } else {
            console.log('❌ No se encontraron reservaciones para jperez');
        }

        console.log('\n✅ Verificación completada');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testReservationsList();
