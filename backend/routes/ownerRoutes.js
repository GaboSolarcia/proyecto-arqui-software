const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const OwnerController = require('../controllers/ownerController');

// Validaciones para dueños
const ownerValidationRules = () => {
    return [
        body('name')
            .notEmpty()
            .withMessage('El nombre del dueño es requerido')
            .isLength({ min: 2, max: 100 })
            .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
        
        body('cedula')
            .notEmpty()
            .withMessage('La cédula es requerida')
            .matches(/^\d{1}-\d{4}-\d{4}$/)
            .withMessage('Formato de cédula inválido. Use formato: 1-1234-5678'),
        
        body('phone')
            .optional()
            .matches(/^\+?506-?\d{4}-?\d{4}$/)
            .withMessage('Formato de teléfono inválido. Use formato: +506-1234-5678'),
        
        body('email')
            .optional()
            .isEmail()
            .withMessage('Formato de email inválido'),
        
        body('address')
            .optional()
            .isLength({ max: 200 })
            .withMessage('La dirección no puede exceder 200 caracteres'),
        
        body('emergency_contact')
            .optional()
            .isLength({ min: 2, max: 100 })
            .withMessage('El contacto de emergencia debe tener entre 2 y 100 caracteres'),
        
        body('emergency_phone')
            .optional()
            .matches(/^\+?506-?\d{4}-?\d{4}$/)
            .withMessage('Formato de teléfono de emergencia inválido. Use formato: +506-1234-5678')
    ];
};

// Validaciones para creación rápida de dueño
const quickOwnerValidationRules = () => {
    return [
        body('name')
            .notEmpty()
            .withMessage('El nombre del dueño es requerido')
            .isLength({ min: 2, max: 100 })
            .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
        
        body('cedula')
            .notEmpty()
            .withMessage('La cédula es requerida')
            .matches(/^\d{1}-\d{4}-\d{4}$/)
            .withMessage('Formato de cédula inválido. Use formato: 1-1234-5678'),
        
        body('phone')
            .optional()
            .matches(/^\+?506-?\d{4}-?\d{4}$/)
            .withMessage('Formato de teléfono inválido. Use formato: +506-1234-5678'),
        
        body('email')
            .optional()
            .isEmail()
            .withMessage('Formato de email inválido')
    ];
};

// =============================================
// RUTAS PARA DUEÑOS
// =============================================

// GET /api/owners - Obtener todos los dueños
router.get('/', OwnerController.getAllOwners);

// GET /api/owners/stats - Obtener estadísticas de dueños
router.get('/stats', OwnerController.getOwnersStats);

// GET /api/owners/search - Buscar dueños por nombre
router.get('/search', OwnerController.searchOwnersByName);

// GET /api/owners/cedula/:cedula - Buscar dueño por cédula
router.get('/cedula/:cedula', OwnerController.getOwnerByCedula);

// GET /api/owners/cedula/:cedula/pets - Obtener mascotas por cédula del dueño
router.get('/cedula/:cedula/pets', OwnerController.getPetsByCedula);

// GET /api/owners/cedula/:cedula/exists - Verificar si existe un dueño
router.get('/cedula/:cedula/exists', OwnerController.checkOwnerExists);

// GET /api/owners/:id - Obtener dueño por ID
router.get('/:id', OwnerController.getOwnerById);

// GET /api/owners/:id/pets - Obtener mascotas del dueño
router.get('/:id/pets', OwnerController.getOwnerPets);

// GET /api/owners/:id/complete - Obtener información completa del dueño
router.get('/:id/complete', OwnerController.getOwnerWithPets);

// POST /api/owners - Crear nuevo dueño
router.post('/', ownerValidationRules(), OwnerController.createOwner);

// POST /api/owners/quick - Crear dueño si no existe (registro rápido)
router.post('/quick', quickOwnerValidationRules(), OwnerController.createOwnerIfNotExists);

// PUT /api/owners/:id - Actualizar dueño
router.put('/:id', ownerValidationRules(), OwnerController.updateOwner);

// DELETE /api/owners/:id - Eliminar dueño
router.delete('/:id', OwnerController.deleteOwner);

module.exports = router;