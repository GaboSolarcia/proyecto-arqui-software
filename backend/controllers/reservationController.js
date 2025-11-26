const Reservation = require('../models/Reservation');
const { validationResult } = require('express-validator');

class ReservationController {
    // Obtener todas las reservas
    static async getAllReservations(req, res) {
        try {
            const reservations = await Reservation.findAll();
            res.status(200).json({
                success: true,
                data: reservations,
                count: reservations.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo reservas',
                error: error.message
            });
        }
    }

    // Obtener reserva por ID
    static async getReservationById(req, res) {
        try {
            const { id } = req.params;
            const reservation = await Reservation.findById(id);
            
            if (!reservation) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: reservation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo reserva',
                error: error.message
            });
        }
    }

    // Crear nueva reserva
    static async createReservation(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const reservationData = req.body;
            
            // Verificar disponibilidad antes de crear la reserva
            const isAvailable = await Reservation.checkAvailability(
                reservationData.start_date,
                reservationData.end_date
            );

            if (!isAvailable) {
                return res.status(409).json({
                    success: false,
                    message: 'No hay disponibilidad para las fechas seleccionadas'
                });
            }

            const newReservation = await Reservation.create(reservationData);

            res.status(201).json({
                success: true,
                message: 'Reserva creada exitosamente',
                data: newReservation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creando reserva',
                error: error.message
            });
        }
    }

    // Actualizar reserva
    static async updateReservation(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const reservationData = req.body;
            
            // Si se están cambiando las fechas, verificar disponibilidad
            if (reservationData.start_date && reservationData.end_date) {
                const isAvailable = await Reservation.checkAvailability(
                    reservationData.start_date,
                    reservationData.end_date,
                    id // Excluir la reserva actual de la verificación
                );

                if (!isAvailable) {
                    return res.status(409).json({
                        success: false,
                        message: 'No hay disponibilidad para las fechas seleccionadas'
                    });
                }
            }
            
            const updatedReservation = await Reservation.update(id, reservationData);
            
            if (!updatedReservation) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Reserva actualizada exitosamente',
                data: updatedReservation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error actualizando reserva',
                error: error.message
            });
        }
    }

    // Eliminar reserva
    static async deleteReservation(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Reservation.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Reserva eliminada exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error eliminando reserva',
                error: error.message
            });
        }
    }

    // Obtener reservas por mascota
    static async getReservationsByPet(req, res) {
        try {
            const { petId } = req.params;
            const reservations = await Reservation.findByPetId(petId);

            res.status(200).json({
                success: true,
                data: reservations,
                count: reservations.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo reservas por mascota',
                error: error.message
            });
        }
    }

    // Obtener reservas por estado
    static async getReservationsByStatus(req, res) {
        try {
            const { status } = req.params;
            const reservations = await Reservation.findByStatus(status);

            res.status(200).json({
                success: true,
                data: reservations,
                count: reservations.length,
                status: status
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo reservas por estado',
                error: error.message
            });
        }
    }

    // Obtener reservas activas
    static async getActiveReservations(req, res) {
        try {
            const reservations = await Reservation.findActive();

            res.status(200).json({
                success: true,
                data: reservations,
                count: reservations.length,
                message: 'Reservas activas'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo reservas activas',
                error: error.message
            });
        }
    }

    // Obtener reservas por rango de fechas
    static async getReservationsByDateRange(req, res) {
        try {
            const { start_date, end_date } = req.query;
            
            if (!start_date || !end_date) {
                return res.status(400).json({
                    success: false,
                    message: 'Fechas de inicio y fin son requeridas'
                });
            }

            const reservations = await Reservation.findByDateRange(start_date, end_date);

            res.status(200).json({
                success: true,
                data: reservations,
                count: reservations.length,
                date_range: { start_date, end_date }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo reservas por rango de fechas',
                error: error.message
            });
        }
    }

    // Actualizar estado de reserva
    static async updateReservationStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado es requerido'
                });
            }

            const validStatuses = ['Pendiente', 'Confirmada', 'Activa', 'Completada', 'Cancelada'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado inválido',
                    valid_statuses: validStatuses
                });
            }

            const updatedReservation = await Reservation.updateStatus(id, status);
            
            if (!updatedReservation) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: `Estado de reserva actualizado a: ${status}`,
                data: updatedReservation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error actualizando estado de reserva',
                error: error.message
            });
        }
    }

    // Verificar disponibilidad
    static async checkAvailability(req, res) {
        try {
            const { start_date, end_date, exclude_reservation_id } = req.query;
            
            if (!start_date || !end_date) {
                return res.status(400).json({
                    success: false,
                    message: 'Fechas de inicio y fin son requeridas'
                });
            }

            const isAvailable = await Reservation.checkAvailability(
                start_date, 
                end_date, 
                exclude_reservation_id
            );

            res.status(200).json({
                success: true,
                available: isAvailable,
                date_range: { start_date, end_date }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error verificando disponibilidad',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de reservas
    static async getReservationStats(req, res) {
        try {
            const stats = await Reservation.getStats();

            res.status(200).json({
                success: true,
                data: stats,
                period: 'Mes actual'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo estadísticas de reservas',
                error: error.message
            });
        }
    }

    // Confirmar reserva
    static async confirmReservation(req, res) {
        try {
            const { id } = req.params;
            
            const updatedReservation = await Reservation.updateStatus(id, 'Confirmada');
            
            if (!updatedReservation) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Reserva confirmada exitosamente',
                data: updatedReservation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error confirmando reserva',
                error: error.message
            });
        }
    }

    // Cancelar reserva
    static async cancelReservation(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            
            const reservationData = {
                status: 'Cancelada',
                special_instructions: reason ? `Cancelada: ${reason}` : 'Cancelada por el usuario'
            };

            const updatedReservation = await Reservation.update(id, reservationData);
            
            if (!updatedReservation) {
                return res.status(404).json({
                    success: false,
                    message: 'Reserva no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Reserva cancelada exitosamente',
                data: updatedReservation
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error cancelando reserva',
                error: error.message
            });
        }
    }
}

module.exports = ReservationController;