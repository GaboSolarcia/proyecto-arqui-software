const express = require('express');
const router = express.Router();
const SpecialistController = require('../controllers/specialistController');
const { body } = require('express-validator');

// Validaciones
const validateSpecialist = [
    body('employee_name').notEmpty().withMessage('El nombre del empleado es requerido'),
    body('cedula').notEmpty().withMessage('La cédula es requerida'),
    body('shift_schedule').notEmpty().withMessage('El horario es requerido')
        .isIn(['Horario 1', 'Horario 2', 'Horario 3']).withMessage('Horario inválido')
];

// Rutas
router.get('/', SpecialistController.getAllSpecialists);
router.get('/active', SpecialistController.getActiveSpecialists);
router.get('/shift/:shift', SpecialistController.getSpecialistsByShift);
router.get('/:id', SpecialistController.getSpecialistById);
router.post('/', validateSpecialist, SpecialistController.createSpecialist);
router.put('/:id', validateSpecialist, SpecialistController.updateSpecialist);
router.delete('/:id', SpecialistController.deleteSpecialist);

module.exports = router;
