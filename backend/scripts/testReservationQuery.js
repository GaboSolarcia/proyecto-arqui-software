const { executeQuery } = require('../config/database');

async function testReservationQuery() {
    try {
        console.log('🔍 Probando query de reservaciones...\n');
        
        const query = `
            SELECT 
                r.ReservationId,
                r.PetId,
                p.Name AS PetName,
                r.RoomId,
                rm.RoomNumber,
                rt.RoomTypeName,
                r.StartDate,
                r.EndDate,
                r.IsIndefinite,
                r.StatusId,
                rs.StatusName,
                r.TotalCost,
                r.SpecialInstructions,
                r.CheckInDate,
                r.CheckOutDate,
                r.StayScheduleId,
                ss.ScheduleName AS StayScheduleName,
                r.AssistanceLevelId,
                al.LevelName AS AssistanceLevelName,
                o.Name AS OwnerName,
                o.Cedula AS OwnerCedula,
                r.CreatedAt,
                r.UpdatedAt
            FROM Reservations r
            INNER JOIN Pets p ON r.PetId = p.PetId
            INNER JOIN Owners o ON p.OwnerId = o.OwnerId
            LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
            LEFT JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
            LEFT JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            LEFT JOIN Cat_StaySchedules ss ON r.StayScheduleId = ss.StayScheduleId
            LEFT JOIN Cat_AssistanceLevels al ON r.AssistanceLevelId = al.AssistanceLevelId
            ORDER BY r.CreatedAt DESC
        `;
        
        console.log('📋 Ejecutando query...');
        const result = await executeQuery(query);
        
        console.log(`✅ Query exitoso!`);
        console.log(`Total de registros: ${result.recordset.length}\n`);
        
        if (result.recordset.length > 0) {
            console.log('Primera reservación:');
            console.log(JSON.stringify(result.recordset[0], null, 2));
        } else {
            console.log('⚠️  No hay reservaciones en la base de datos');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error ejecutando query:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testReservationQuery();


