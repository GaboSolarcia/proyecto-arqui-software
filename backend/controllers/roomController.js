const Room = require('../models/Room');
const { validationResult } = require('express-validator');

class RoomController {
    // Obtener todas las habitaciones
    static async getAllRooms(req, res) {
        try {
            const rooms = await Room.findAll();
            res.status(200).json({
                success: true,
                data: rooms,
                count: rooms.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo habitaciones',
                error: error.message
            });
        }
    }

    // Obtener habitación por ID
    static async getRoomById(req, res) {
        try {
            const { id } = req.params;
            const room = await Room.findById(id);
            
            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: 'Habitación no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: room
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo habitación',
                error: error.message
            });
        }
    }

    // Crear nueva habitación
    static async createRoom(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const roomData = req.body;
            const newRoom = await Room.create(roomData);

            res.status(201).json({
                success: true,
                message: 'Habitación creada exitosamente',
                data: newRoom
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creando habitación',
                error: error.message
            });
        }
    }

    // Actualizar habitación
    static async updateRoom(req, res) {
        try {
            const { id } = req.params;
            const roomData = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const updatedRoom = await Room.update(id, roomData);
            
            if (!updatedRoom) {
                return res.status(404).json({
                    success: false,
                    message: 'Habitación no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Habitación actualizada exitosamente',
                data: updatedRoom
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error actualizando habitación',
                error: error.message
            });
        }
    }

    // Eliminar habitación
    static async deleteRoom(req, res) {
        try {
            const { id } = req.params;
            await Room.delete(id);

            res.status(200).json({
                success: true,
                message: 'Habitación eliminada exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error eliminando habitación',
                error: error.message
            });
        }
    }

    // Obtener habitaciones por estado
    static async getRoomsByStatus(req, res) {
        try {
            const { status } = req.params;
            const rooms = await Room.findByStatus(status);

            res.status(200).json({
                success: true,
                data: rooms,
                count: rooms.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo habitaciones por estado',
                error: error.message
            });
        }
    }

    // Obtener habitaciones disponibles
    static async getAvailableRooms(req, res) {
        try {
            const rooms = await Room.findAvailable();

            res.status(200).json({
                success: true,
                data: rooms,
                count: rooms.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo habitaciones disponibles',
                error: error.message
            });
        }
    }

    // Obtener habitaciones por tipo
    static async getRoomsByType(req, res) {
        try {
            const { type } = req.params;
            const rooms = await Room.findByType(type);

            res.status(200).json({
                success: true,
                data: rooms,
                count: rooms.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo habitaciones por tipo',
                error: error.message
            });
        }
    }

    // Registrar limpieza de habitación
    static async registerCleaning(req, res) {
        try {
            const { id } = req.params;
            const { cleaned_by } = req.body;

            if (!cleaned_by) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe especificar quién realizó la limpieza'
                });
            }

            const updatedRoom = await Room.registerCleaning(id, cleaned_by);
            
            if (!updatedRoom) {
                return res.status(404).json({
                    success: false,
                    message: 'Habitación no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Limpieza registrada exitosamente',
                data: updatedRoom
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error registrando limpieza',
                error: error.message
            });
        }
    }

    // Agregar nota de mantenimiento
    static async addMaintenanceNote(req, res) {
        try {
            const { id } = req.params;
            const noteData = req.body;

            const updatedRoom = await Room.addMaintenanceNote(id, noteData);
            
            if (!updatedRoom) {
                return res.status(404).json({
                    success: false,
                    message: 'Habitación no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Nota de mantenimiento agregada exitosamente',
                data: updatedRoom
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error agregando nota de mantenimiento',
                error: error.message
            });
        }
    }

    // Cambiar estado de habitación
    static async changeStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe especificar el nuevo estado'
                });
            }

            const updatedRoom = await Room.changeStatus(id, status);
            
            if (!updatedRoom) {
                return res.status(404).json({
                    success: false,
                    message: 'Habitación no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Estado de habitación actualizado exitosamente',
                data: updatedRoom
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error cambiando estado de habitación',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de habitaciones
    static async getStatistics(req, res) {
        try {
            const statistics = await Room.getStatistics();

            res.status(200).json({
                success: true,
                data: statistics
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo estadísticas',
                error: error.message
            });
        }
    }
}

module.exports = RoomController;
