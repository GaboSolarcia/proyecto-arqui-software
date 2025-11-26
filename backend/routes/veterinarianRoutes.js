const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const VeterinarianController = require('../controllers/veterinarianController');

// Validaciones para veterinarios
const veterinarianValidationRules = () => {
    return [
        body('name')
            .notEmpty()
            .withMessage('El nombre del veterinario es requerido')
            .isLength({ min: 2, max: 100 })
            .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
        
        body('license_number')
            .notEmpty()
            .withMessage('El número de licencia es requerido')
            .isLength({ min: 5, max: 50 })
            .withMessage('El número de licencia debe tener entre 5 y 50 caracteres'),
        
        body('phone')
            .optional()
            .matches(/^\+?506-?\d{4}-?\d{4}$/)
            .withMessage('Formato de teléfono inválido. Use formato: +506-1234-5678'),
        
        body('email')
            .optional()
            .isEmail()
            .withMessage('Formato de email inválido'),
        
        body('specialty')
            .optional()
            .isLength({ min: 2, max: 50 })
            .withMessage('La especialidad debe tener entre 2 y 50 caracteres'),
        
        body('is_active')
            .optional()
            .isBoolean()
            .withMessage('El estado activo debe ser verdadero o falso')
    ];
};

// =============================================
// RUTAS PARA VETERINARIOS
// =============================================

// GET /api/veterinarians - Obtener todos los veterinarios
router.get('/', VeterinarianController.getAllVeterinarians);

// GET /api/veterinarians/overview - Obtener resumen de veterinarios
router.get('/overview', VeterinarianController.getVeterinariansOverview);

// GET /api/veterinarians/license/:license_number - Buscar por número de licencia
router.get('/license/:license_number', VeterinarianController.getVeterinarianByLicense);

// GET /api/veterinarians/:id - Obtener veterinario por ID
router.get('/:id', VeterinarianController.getVeterinarianById);

// GET /api/veterinarians/:id/pets - Obtener mascotas asignadas
router.get('/:id/pets', VeterinarianController.getVeterinarianPets);

// GET /api/veterinarians/:id/stats - Obtener estadísticas del veterinario
router.get('/:id/stats', VeterinarianController.getVeterinarianStats);

// POST /api/veterinarians - Crear nuevo veterinario
router.post('/', veterinarianValidationRules(), VeterinarianController.createVeterinarian);

// PUT /api/veterinarians/:id - Actualizar veterinario
router.put('/:id', veterinarianValidationRules(), VeterinarianController.updateVeterinarian);

// PUT /api/veterinarians/:id/toggle-status - Activar/Desactivar veterinario
router.put('/:id/toggle-status', VeterinarianController.toggleVeterinarianStatus);

// DELETE /api/veterinarians/:id - Desactivar veterinario
router.delete('/:id', VeterinarianController.deleteVeterinarian);

module.exports = router;