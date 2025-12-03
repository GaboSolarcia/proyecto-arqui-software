const { executeQuery, sql } = require('../config/database');
const Reservation = require('../models/Reservation');

class CameraController {
    // Verificar si el usuario tiene acceso a la cámara de una mascota específica
    static async checkCameraAccess(req, res) {
        try {
            const { petId } = req.params;
            const userId = req.user.userId;

            // Verificar que la mascota pertenece al usuario
            const petQuery = `
                SELECT p.PetId, p.Name, p.OwnerId, o.UserId
                FROM Pets p
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                WHERE p.PetId = @petId AND o.UserId = @userId
            `;

            const petResult = await executeQuery(petQuery, {
                petId: petId,
                userId: userId
            });

            if (petResult.recordset.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permiso para acceder a esta mascota'
                });
            }

            // Verificar que la mascota tiene una reservación activa con habitación con cámara
            const reservationQuery = `
                SELECT TOP 1 
                    r.ReservationId,
                    r.PetId,
                    r.RoomId,
                    r.StartDate,
                    r.EndDate,
                    r.IsIndefinite,
                    rt.RoomTypeName,
                    rm.RoomNumber,
                    rs.StatusName,
                    p.Name as PetName
                FROM Reservations r
                INNER JOIN Pets p ON r.PetId = p.PetId
                INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                INNER JOIN Rooms rm ON r.RoomId = rm.RoomId
                INNER JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
                WHERE r.PetId = @petId
                    AND rt.RoomTypeName = 'Habitación Individual con Cámara'
                    AND rs.StatusName IN ('Confirmada', 'Check-In', 'Activa')
                    AND (
                        r.IsIndefinite = 1 
                        OR (r.StartDate <= GETDATE() AND r.EndDate >= GETDATE())
                    )
                ORDER BY r.StartDate DESC
            `;

            const reservationResult = await executeQuery(reservationQuery, {
                petId: petId
            });

            if (reservationResult.recordset.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Esta mascota no tiene una reservación activa con habitación con cámara'
                });
            }

            const reservation = reservationResult.recordset[0];

            res.json({
                success: true,
                message: 'Acceso a cámara autorizado',
                data: {
                    petId: reservation.PetId,
                    petName: reservation.PetName,
                    roomId: reservation.RoomId,
                    roomNumber: reservation.RoomNumber,
                    roomType: reservation.RoomTypeName,
                    reservationId: reservation.ReservationId,
                    status: reservation.StatusName,
                    // URL del stream de la cámara (mismo para todas las habitaciones en esta simulación)
                    streamUrl: `/api/camera/stream/${reservation.RoomId}`
                }
            });

        } catch (error) {
            console.error('Error verificando acceso a cámara:', error);
            res.status(500).json({
                success: false,
                message: 'Error verificando acceso a cámara',
                error: error.message
            });
        }
    }

    // Obtener todas las mascotas del usuario que tienen acceso a cámara
    static async getUserPetsWithCamera(req, res) {
        try {
            const userId = req.user.userId;
            const userRole = req.user.roleName;

            // Si es Admin, Recepcionista o Veterinario, ver todas las mascotas con cámara
            let query;
            let params = {};

            if (userRole === 'Administrador' || userRole === 'Recepcionista' || userRole === 'Veterinario') {
                query = `
                    SELECT 
                        p.PetId,
                        p.Name as PetName,
                        sp.SpeciesName as Species,
                        br.BreedName as Breed,
                        o.Name as OwnerName,
                        o.Cedula as OwnerCedula,
                        r.ReservationId,
                        r.RoomId,
                        rm.RoomNumber,
                        rt.RoomTypeName,
                        rs.StatusName,
                        r.StartDate,
                        r.EndDate,
                        r.IsIndefinite
                    FROM Pets p
                    INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                    INNER JOIN Cat_Species sp ON p.SpeciesId = sp.SpeciesId
                    LEFT JOIN Cat_Breeds br ON p.BreedId = br.BreedId
                    INNER JOIN Reservations r ON p.PetId = r.PetId
                    INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                    INNER JOIN Rooms rm ON r.RoomId = rm.RoomId
                    INNER JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
                    WHERE rt.RoomTypeName = 'Habitación Individual con Cámara'
                        AND rs.StatusName IN ('Confirmada', 'Check-In', 'Activa')
                        AND (
                            r.IsIndefinite = 1 
                            OR (r.StartDate <= GETDATE() AND r.EndDate >= GETDATE())
                        )
                    ORDER BY p.Name
                `;
            } else {
                // Usuario normal: solo sus propias mascotas
                query = `
                    SELECT 
                        p.PetId,
                        p.Name as PetName,
                        sp.SpeciesName as Species,
                        br.BreedName as Breed,
                        o.Name as OwnerName,
                        o.Cedula as OwnerCedula,
                        r.ReservationId,
                        r.RoomId,
                        rm.RoomNumber,
                        rt.RoomTypeName,
                        rs.StatusName,
                        r.StartDate,
                        r.EndDate,
                        r.IsIndefinite
                    FROM Pets p
                    INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                    INNER JOIN Cat_Species sp ON p.SpeciesId = sp.SpeciesId
                    LEFT JOIN Cat_Breeds br ON p.BreedId = br.BreedId
                    INNER JOIN Reservations r ON p.PetId = r.PetId
                    INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                    INNER JOIN Rooms rm ON r.RoomId = rm.RoomId
                    INNER JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
                    WHERE o.UserId = @userId
                        AND rt.RoomTypeName = 'Habitación Individual con Cámara'
                        AND rs.StatusName IN ('Confirmada', 'Check-In', 'Activa')
                        AND (
                            r.IsIndefinite = 1 
                            OR (r.StartDate <= GETDATE() AND r.EndDate >= GETDATE())
                        )
                    ORDER BY p.Name
                `;
                params.userId = userId;
            }

            const result = await executeQuery(query, params);

            const pets = result.recordset.map(pet => ({
                petId: pet.PetId,
                petName: pet.PetName,
                species: pet.Species,
                breed: pet.Breed,
                ownerName: pet.OwnerName,
                ownerCedula: pet.OwnerCedula,
                reservationId: pet.ReservationId,
                roomId: pet.RoomId,
                roomNumber: pet.RoomNumber,
                roomType: pet.RoomTypeName,
                status: pet.StatusName,
                startDate: pet.StartDate,
                endDate: pet.EndDate,
                isIndefinite: pet.IsIndefinite,
                streamUrl: `/api/camera/stream/${pet.RoomId}`
            }));

            res.json({
                success: true,
                message: `${pets.length} mascota(s) con acceso a cámara encontrada(s)`,
                data: pets,
                role: userRole
            });

        } catch (error) {
            console.error('Error obteniendo mascotas con cámara:', error);
            res.status(500).json({
                success: false,
                message: 'Error obteniendo mascotas con cámara',
                error: error.message
            });
        }
    }

    // Endpoint para el streaming de video (placeholder - se implementará con tecnología específica)
    static async streamCamera(req, res) {
        try {
            const { roomId } = req.params;
            const userId = req.user.userId;

            // Verificar que el usuario tiene acceso a esta habitación
            const accessQuery = `
                SELECT COUNT(*) as AccessCount
                FROM Reservations r
                INNER JOIN Pets p ON r.PetId = p.PetId
                INNER JOIN Owners o ON p.OwnerId = o.OwnerId
                INNER JOIN Cat_ReservationStatuses rs ON r.StatusId = rs.StatusId
                INNER JOIN Rooms rm ON r.RoomId = rm.RoomId
                INNER JOIN Cat_RoomTypes rt ON rm.RoomTypeId = rt.RoomTypeId
                WHERE r.RoomId = @roomId
                    AND o.UserId = @userId
                    AND rt.RoomTypeName = 'Habitación Individual con Cámara'
                    AND rs.StatusName IN ('Confirmada', 'Check-In', 'Activa')
            `;

            const accessResult = await executeQuery(accessQuery, {
                roomId: roomId,
                userId: userId
            });

            if (accessResult.recordset[0].AccessCount === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes acceso a esta cámara'
                });
            }

            // Este es un placeholder - aquí se implementaría el streaming real
            // Por ahora solo indicamos que el acceso está autorizado
            res.json({
                success: true,
                message: 'Streaming autorizado',
                data: {
                    roomId: roomId,
                    streamType: 'webcam',
                    note: 'El stream de video se manejará desde el frontend usando getUserMedia'
                }
            });

        } catch (error) {
            console.error('Error en streaming de cámara:', error);
            res.status(500).json({
                success: false,
                message: 'Error en streaming de cámara',
                error: error.message
            });
        }
    }
}

module.exports = CameraController;
