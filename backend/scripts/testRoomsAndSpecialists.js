const { executeQuery } = require('../config/database');

async function testQueries() {
    try {
        console.log('🔍 Probando queries de Rooms y Specialists...\n');
        
        // Test Rooms
        console.log('📋 Probando query de Rooms...');
        const roomsQuery = `
            SELECT 
                r.RoomId,
                r.RoomNumber,
                r.RoomTypeId,
                rt.RoomTypeName,
                r.RoomStatusId,
                rs.StatusName AS StatusName,
                r.Floor,
                r.LastCleaningDate,
                r.CleanedBy,
                s.EmployeeName AS CleanedByName,
                r.Notes AS MaintenanceNotes,
                r.CreatedAt,
                r.UpdatedAt
            FROM Rooms r
            LEFT JOIN Cat_RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
            LEFT JOIN Cat_RoomStatuses rs ON r.RoomStatusId = rs.RoomStatusId
            LEFT JOIN Specialists s ON r.CleanedBy = s.SpecialistId
            ORDER BY r.RoomNumber ASC
        `;
        
        const roomsResult = await executeQuery(roomsQuery);
        console.log(`✅ Rooms query exitoso! Total: ${roomsResult.recordset.length}`);
        if (roomsResult.recordset.length > 0) {
            console.log('Primera habitación:');
            console.log(JSON.stringify(roomsResult.recordset[0], null, 2));
        }
        
        // Test Specialists
        console.log('\n📋 Probando query de Specialists...');
        const specialistsQuery = `
            SELECT 
                s.SpecialistId,
                s.EmployeeName,
                s.Cedula,
                s.Phone,
                s.Email,
                s.AdmissionDate,
                s.ShiftId,
                ws.ShiftName AS ShiftScheduleName,
                s.Position,
                s.UserId,
                s.IsActive,
                s.CreatedAt,
                s.UpdatedAt
            FROM Specialists s
            LEFT JOIN Cat_WorkShifts ws ON s.ShiftId = ws.ShiftId
            ORDER BY s.EmployeeName ASC
        `;
        
        const specialistsResult = await executeQuery(specialistsQuery);
        console.log(`✅ Specialists query exitoso! Total: ${specialistsResult.recordset.length}`);
        if (specialistsResult.recordset.length > 0) {
            console.log('Primer especialista:');
            console.log(JSON.stringify(specialistsResult.recordset[0], null, 2));
        }
        
        console.log('\n✅ Todas las pruebas completadas exitosamente!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error ejecutando queries:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testQueries();
