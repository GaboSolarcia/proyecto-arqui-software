const { executeQuery } = require('../config/database');

async function testMonitoringSetup() {
    console.log('🔍 Verificando configuración de monitoreo...\n');

    try {
        // 1. Verificar que existe el tipo de habitación con cámara
        console.log('1️⃣ Verificando tipos de habitación...');
        const roomTypesQuery = `SELECT * FROM Cat_RoomTypes`;
        const roomTypes = await executeQuery(roomTypesQuery);
        
        console.log('Tipos de habitación disponibles:');
        roomTypes.recordset.forEach(rt => {
            console.log(`   - ${rt.RoomTypeName} (ID: ${rt.RoomTypeId})`);
        });

        const cameraRoomType = roomTypes.recordset.find(rt => rt.RoomTypeName === 'Habitación Individual con Cámara');
        if (cameraRoomType) {
            console.log('✅ Tipo de habitación "Habitación Individual con Cámara" encontrado\n');
        } else {
            console.log('❌ ERROR: No se encontró el tipo de habitación "Habitación Individual con Cámara"\n');
            return;
        }

        // 2. Verificar habitaciones con cámara
        console.log('2️⃣ Verificando habitaciones con cámara...');
        const roomsQuery = `
            SELECT r.RoomId, r.RoomNumber, rt.RoomTypeName, rs.StatusName
            FROM Rooms r
            INNER JOIN Cat_RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
            INNER JOIN Cat_RoomStatuses rs ON r.RoomStatusId = rs.RoomStatusId
            WHERE rt.RoomTypeName = 'Habitación Individual con Cámara'
        `;
        const rooms = await executeQuery(roomsQuery);
        
        if (rooms.recordset.length > 0) {
            console.log(`✅ ${rooms.recordset.length} habitación(es) con cámara encontrada(s):`);
            rooms.recordset.forEach(room => {
                console.log(`   - Habitación ${room.RoomNumber} (ID: ${room.RoomId}) - Estado: ${room.StatusName}`);
            });
            console.log('');
        } else {
            console.log('⚠️ No hay habitaciones con cámara registradas\n');
        }

        // 3. Verificar reservaciones activas con cámara
        console.log('3️⃣ Verificando reservaciones activas con cámara...');
        const reservationsQuery = `
            SELECT 
                r.ReservationId,
                p.Name as PetName,
                o.Name as OwnerName,
                u.Username,
                rt.RoomTypeName,
                rm.RoomNumber,
                rs.StatusName,
                r.StartDate,
                r.EndDate,
                r.IsIndefinite
            FROM Reservations r
            INNER JOIN Pets p ON r.PetId = p.PetId
            INNER JOIN Owners o ON p.OwnerId = o.OwnerId
            INNER JOIN Users u ON o.UserId = u.UserId
            INNER JOIN Rooms rm ON r.RoomId = rm.RoomId
            INNER JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
            INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            WHERE rt.RoomTypeName = 'Habitación Individual con Cámara'
                AND rs.StatusName IN ('Confirmada', 'Check-In', 'Activa')
        `;
        const reservations = await executeQuery(reservationsQuery);
        
        if (reservations.recordset.length > 0) {
            console.log(`✅ ${reservations.recordset.length} reservación(es) activa(s) con cámara:`);
            reservations.recordset.forEach(res => {
                console.log(`   - ${res.PetName} (Dueño: ${res.OwnerName})`);
                console.log(`     Usuario: ${res.Username}`);
                console.log(`     Habitación: ${res.RoomNumber || 'No asignada'}`);
                console.log(`     Estado: ${res.StatusName}`);
                console.log(`     Fechas: ${new Date(res.StartDate).toLocaleDateString()} - ${res.IsIndefinite ? 'Indefinida' : new Date(res.EndDate).toLocaleDateString()}`);
                console.log('');
            });
        } else {
            console.log('⚠️ No hay reservaciones activas con cámara\n');
        }

        // 4. Sugerencias si no hay datos
        if (reservations.recordset.length === 0) {
            console.log('💡 SUGERENCIAS para probar la funcionalidad:');
            console.log('   1. Asegúrate de tener al menos una habitación con tipo "Habitación Individual con Cámara"');
            console.log('   2. Crea una reservación para una mascota seleccionando el tipo "Habitación Individual con Cámara"');
            console.log('   3. La reservación debe estar en estado "Confirmada", "Check-In" o "Activa"');
            console.log('   4. Las fechas de la reservación deben incluir la fecha actual\n');
        }

        // 5. Verificar estados de reservación disponibles
        console.log('4️⃣ Estados de reservación disponibles:');
        const statusQuery = `SELECT * FROM Cat_ReservationStatuses`;
        const statuses = await executeQuery(statusQuery);
        statuses.recordset.forEach(status => {
            console.log(`   - ${status.StatusName} (ID: ${status.StatusId})`);
        });

        console.log('\n✅ Verificación completada');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        process.exit(0);
    }
}

testMonitoringSetup();
