const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ReservationController = require('../controllers/reservationController');
const { authMiddleware } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Validaciones para reservas
const reservationValidationRules = () => {
    return [
        body('pet_id')
            .notEmpty()
            .withMessage('El ID de la mascota es requerido')
            .isInt({ min: 1 })
            .withMessage('El ID de la mascota debe ser un número entero positivo'),
        
        body('start_date')
            .notEmpty()
            .withMessage('La fecha de inicio es requerida')
            .isISO8601()
            .withMessage('Formato de fecha de inicio inválido (use ISO 8601)'),
        
        body('end_date')
            .notEmpty()
            .withMessage('La fecha de fin es requerida')
            .isISO8601()
            .withMessage('Formato de fecha de fin inválido (use ISO 8601)')
            .custom((value, { req }) => {
                if (new Date(value) <= new Date(req.body.start_date)) {
                    throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
                }
                return true;
            }),
        
        body('service_type')
            .optional()
            .isString()
            .isLength({ min: 1, max: 100 })
            .withMessage('El tipo de servicio debe ser una cadena válida'),
        
        body('special_instructions')
            .optional()
            .isLength({ max: 1000 })
            .withMessage('Las instrucciones especiales no pueden exceder 1000 caracteres'),
        
        body('status')
            .optional()
            .isIn(['Pendiente', 'Confirmada', 'Activa', 'Completada', 'Cancelada'])
            .withMessage('Estado de reserva inválido'),
        
        body('total_cost')
            .optional()
            .isDecimal({ decimal_digits: '0,2' })
            .withMessage('El costo total debe ser un número decimal válido')
            .custom(value => {
                if (parseFloat(value) < 0) {
                    throw new Error('El costo total no puede ser negativo');
                }
                return true;
            }),
        
        body('payment_status')
            .optional()
            .isIn(['Pendiente', 'Pagado', 'Parcial', 'Reembolsado'])
            .withMessage('Estado de pago inválido')
    ];
};

// Validaciones para actualización de estado
const statusValidationRules = () => {
    return [
        body('status')
            .notEmpty()
            .withMessage('El estado es requerido')
            .isIn(['Pendiente', 'Confirmada', 'Activa', 'Completada', 'Cancelada'])
            .withMessage('Estado de reserva inválido')
    ];
};

// =============================================
// RUTAS PARA RESERVAS
// =============================================

// GET /api/reservations - Obtener todas las reservas
router.get('/', ReservationController.getAllReservations);

// GET /api/reservations/stats - Obtener estadísticas de reservas
router.get('/stats', ReservationController.getReservationStats);

// GET /api/reservations/active - Obtener reservas activas
router.get('/active', ReservationController.getActiveReservations);

// GET /api/reservations/availability - Verificar disponibilidad
router.get('/availability', ReservationController.checkAvailability);

// GET /api/reservations/date-range - Obtener reservas por rango de fechas
router.get('/date-range', ReservationController.getReservationsByDateRange);

// GET /api/reservations/status/:status - Obtener reservas por estado
router.get('/status/:status', ReservationController.getReservationsByStatus);

// GET /api/reservations/pet/:petId - Obtener reservas por mascota
router.get('/pet/:petId', ReservationController.getReservationsByPet);

// GET /api/reservations/:id - Obtener reserva por ID
router.get('/:id', ReservationController.getReservationById);

// POST /api/reservations - Crear nueva reserva
router.post('/', reservationValidationRules(), ReservationController.createReservation);

// PUT /api/reservations/:id - Actualizar reserva
router.put('/:id', reservationValidationRules(), ReservationController.updateReservation);

// PUT /api/reservations/:id/status - Actualizar estado de reserva
router.put('/:id/status', statusValidationRules(), ReservationController.updateReservationStatus);

// PUT /api/reservations/:id/confirm - Confirmar reserva
router.put('/:id/confirm', ReservationController.confirmReservation);

// PUT /api/reservations/:id/cancel - Cancelar reserva
router.put('/:id/cancel', [
    body('reason')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La razón de cancelación no puede exceder 500 caracteres')
], ReservationController.cancelReservation);

// DELETE /api/reservations/:id - Eliminar reserva
router.delete('/:id', ReservationController.deleteReservation);

module.exports = router;