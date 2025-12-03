const { executeQuery } = require('../config/database');

async function checkRoomsAndStatuses() {
    try {
        console.log('🔍 Verificando habitaciones y estados...\n');

        // 1. Ver estados de habitaciones disponibles
        console.log('1️⃣ Estados de habitaciones en catálogo:');
        const statusQuery = `SELECT RoomStatusId, StatusName FROM Cat_RoomStatuses`;
        const statusResult = await executeQuery(statusQuery);
        console.table(statusResult.recordset);

        // 2. Ver tipos de habitaciones
        console.log('\n2️⃣ Tipos de habitaciones:');
        const typesQuery = `SELECT RoomTypeId, RoomTypeName FROM Cat_RoomTypes`;
        const typesResult = await executeQuery(typesQuery);
        console.table(typesResult.recordset);

        // 3. Ver todas las habitaciones con su estado
        console.log('\n3️⃣ Habitaciones existentes:');
        const roomsQuery = `
            SELECT 
                r.RoomId,
                r.RoomNumber,
                rt.RoomTypeName,
                rs.StatusName
            FROM Rooms r
            INNER JOIN Cat_RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
            INNER JOIN Cat_RoomStatuses rs ON r.RoomStatusId = rs.RoomStatusId
            ORDER BY r.RoomNumber
        `;
        const roomsResult = await executeQuery(roomsQuery);
        console.table(roomsResult.recordset);

        // 4. Buscar habitaciones disponibles específicamente
        console.log('\n4️⃣ Habitaciones disponibles para "Habitación individual":');
        const availableQuery = `
            SELECT TOP 1 r.RoomId, r.RoomNumber, rt.RoomTypeName, rs.StatusName
            FROM Rooms r
            INNER JOIN Cat_RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
            INNER JOIN Cat_RoomStatuses rs ON r.RoomStatusId = rs.RoomStatusId
            WHERE rt.RoomTypeName = 'Habitación individual' AND rs.StatusName = 'Disponible'
            ORDER BY r.RoomNumber
        `;
        const availableResult = await executeQuery(availableQuery);
        if (availableResult.recordset.length > 0) {
            console.table(availableResult.recordset);
            console.log('✅ Hay habitaciones disponibles');
        } else {
            console.log('❌ No hay habitaciones disponibles de este tipo');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkRoomsAndStatuses();
