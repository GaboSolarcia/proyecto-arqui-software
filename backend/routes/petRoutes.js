const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const PetController = require('../controllers/petController');
const { authMiddleware } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Validaciones para mascotas
const petValidationRules = () => {
    return [
        body('name')
            .notEmpty()
            .withMessage('El nombre de la mascota es requerido')
            .isLength({ min: 2, max: 100 })
            .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
        
        body('owner_name')
            .notEmpty()
            .withMessage('El nombre del dueño es requerido')
            .isLength({ min: 2, max: 100 })
            .withMessage('El nombre del dueño debe tener entre 2 y 100 caracteres'),
        
        body('owner_cedula')
            .notEmpty()
            .withMessage('La cédula del dueño es requerida')
            .matches(/^\d{1}-\d{4}-\d{4}$/)
            .withMessage('Formato de cédula inválido. Use formato: 1-1234-5678'),
        
        body('specialist_id')
            .optional()
            .isInt({ min: 1 })
            .withMessage('ID de especialista debe ser un número entero positivo'),
        
        body('allergies')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Las alergias no pueden exceder 500 caracteres'),
        
        body('bandage_changes')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Las instrucciones de vendajes no pueden exceder 500 caracteres'),
        
        body('special_diet')
            .optional()
            .isLength({ max: 500 })
            .withMessage('La dieta especial no puede exceder 500 caracteres')
    ];
};

// =============================================
// RUTAS PARA MASCOTAS
// =============================================

// GET /api/pets - Obtener todas las mascotas
router.get('/', PetController.getAllPets);

// GET /api/pets/stats - Obtener estadísticas de mascotas
router.get('/stats', PetController.getPetStats);

// GET /api/pets/special-care - Obtener mascotas con cuidados especiales
router.get('/special-care', PetController.getPetsWithSpecialCare);

// GET /api/pets/search - Buscar mascotas
router.get('/search', PetController.searchPets);

// GET /api/pets/owner/:cedula - Obtener mascotas por cédula del dueño
router.get('/owner/:cedula', PetController.getPetsByOwnerCedula);

// GET /api/pets/:id - Obtener mascota por ID
router.get('/:id', PetController.getPetById);

// POST /api/pets - Crear nueva mascota
router.post('/', petValidationRules(), PetController.createPet);

// PATCH /api/pets/:id/approve - Aprobar mascota
router.patch('/:id/approve', PetController.approvePet);

// PUT /api/pets/:id - Actualizar mascota
router.put('/:id', petValidationRules(), PetController.updatePet);

// DELETE /api/pets/:id - Eliminar mascota
router.delete('/:id', PetController.deletePet);

module.exports = router;