const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/roomController');
const { body } = require('express-validator');

// Validaciones
const validateRoom = [
    body('room_number').notEmpty().withMessage('El número de habitación es requerido'),
    body('room_type').notEmpty().withMessage('El tipo de habitación es requerido')
        .isIn(['Habitación individual', 'Habitación individual con cámara', 'Habitación de cuidados especiales'])
        .withMessage('Tipo de habitación inválido'),
    body('status').optional()
        .isIn(['Disponible', 'Reservada', 'En mantenimiento', 'Cerrada'])
        .withMessage('Estado inválido')
];

// Rutas
router.get('/', RoomController.getAllRooms);
router.get('/statistics', RoomController.getStatistics);
router.get('/available', RoomController.getAvailableRooms);
router.get('/status/:status', RoomController.getRoomsByStatus);
router.get('/type/:type', RoomController.getRoomsByType);
router.get('/:id', RoomController.getRoomById);
router.post('/', validateRoom, RoomController.createRoom);
router.put('/:id', validateRoom, RoomController.updateRoom);
router.delete('/:id', RoomController.deleteRoom);
router.post('/:id/cleaning', RoomController.registerCleaning);
router.post('/:id/maintenance', RoomController.addMaintenanceNote);
router.patch('/:id/status', RoomController.changeStatus);

module.exports = router;
