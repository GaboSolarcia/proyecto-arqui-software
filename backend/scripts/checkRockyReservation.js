const { executeQuery } = require('../config/database');

async function checkRockyReservation() {
    try {
        const query = `
            SELECT 
                r.ReservationId,
                p.Name as PetName,
                p.PetId,
                r.RoomId,
                rm.RoomNumber,
                rt.RoomTypeName,
                rs.StatusName,
                r.StartDate,
                r.EndDate,
                r.IsIndefinite
            FROM Reservations r
            INNER JOIN Pets p ON r.PetId = p.PetId
            INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
            LEFT JOIN Rooms rm ON r.RoomId = rm.RoomId
            LEFT JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
            WHERE p.Name = 'Rocky'
                AND rs.StatusName IN ('Confirmada', 'Activa', 'Check-In', 'Pendiente')
        `;

        const result = await executeQuery(query);

        console.log('Reservaciones de Rocky:');
        console.log(JSON.stringify(result.recordset, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit(0);
    }
}

checkRockyReservation();
