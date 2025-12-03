const { executeQuery } = require('../config/database');

async function checkCameraAccess() {
    try {
        console.log('🔍 Verificando acceso a cámara...\n');

        // 1. Ver estados de reservaciones disponibles
        console.log('1️⃣ Estados de reservación en catálogo:');
        const statusQuery = `SELECT StatusId, StatusName FROM Cat_ReservationStatuses`;
        const statusResult = await executeQuery(statusQuery);
        console.table(statusResult.recordset);

        // 2. Ver tipos de habitación con cámara
        console.log('\n2️⃣ Tipos de habitación con cámara:');
        const roomTypesQuery = `SELECT RoomTypeId, RoomTypeName FROM Cat_RoomTypes WHERE RoomTypeName LIKE '%cámara%' OR RoomTypeName LIKE '%Cámara%'`;
        const roomTypesResult = await executeQuery(roomTypesQuery);
        console.table(roomTypesResult.recordset);

        // 3. Ver reservas activas con habitación con cámara
        console.log('\n3️⃣ Reservas con habitación con cámara:');
        const reservationsQuery = `
            SELECT 
                r.ReservationId,
                p.Name as PetName,
                o.Name as OwnerName,
                u.Username,
                rm.RoomNumber,
                rt.RoomTypeName,
                rs.StatusName,
                r.StartDate,
                r.EndDate,
                r.IsIndefinite
            FROM Reservations r
            INNER JOIN Pets p ON r.PetId = p.PetId
            INNER JOIN Owners o ON p.OwnerId = o.OwnerId
            INNER JOIN Users u ON o.UserId = u.UserId
            INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            INNER JOIN Rooms rm ON r.RoomId = rm.RoomId
            INNER JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
            WHERE rt.RoomTypeName LIKE '%Cámara%'
            ORDER BY r.ReservationId DESC
        `;
        const reservationsResult = await executeQuery(reservationsQuery);
        console.table(reservationsResult.recordset);

        // 4. Probar query específico para usuario jperez
        console.log('\n4️⃣ Mascotas con cámara para usuario jperez (UserId=3):');
        const userPetsQuery = `
            SELECT 
                p.PetId,
                p.Name as PetName,
                r.ReservationId,
                rm.RoomNumber,
                rt.RoomTypeName,
                rs.StatusName,
                r.StartDate,
                r.EndDate,
                CASE 
                    WHEN rs.StatusName IN ('Confirmada', 'Check-In', 'Activa') THEN 'Cumple condición estado'
                    ELSE 'NO cumple condición estado'
                END as EstadoCheck,
                CASE 
                    WHEN r.IsIndefinite = 1 OR (r.StartDate <= GETDATE() AND r.EndDate >= GETDATE()) THEN 'Cumple condición fecha'
                    ELSE 'NO cumple condición fecha'
                END as FechaCheck
            FROM Pets p
            INNER JOIN Owners o ON p.OwnerId = o.OwnerId
            INNER JOIN Reservations r ON p.PetId = r.PetId
            INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            INNER JOIN Rooms rm ON r.RoomId = rm.RoomId
            INNER JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
            WHERE o.UserId = 3
                AND rt.RoomTypeName LIKE '%Cámara%'
            ORDER BY r.ReservationId DESC
        `;
        const userPetsResult = await executeQuery(userPetsQuery);
        console.table(userPetsResult.recordset);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

checkCameraAccess();
