const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Validaciones para registro
const registerValidation = [
    body('username')
        .notEmpty()
        .withMessage('El nombre de usuario es requerido')
        .isLength({ min: 3, max: 50 })
        .withMessage('El username debe tener entre 3 y 50 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El username solo puede contener letras, números y guiones bajos'),
    
    body('email')
        .notEmpty()
        .withMessage('El email es requerido')
        .isEmail()
        .withMessage('Formato de email inválido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
    
    body('fullName')
        .notEmpty()
        .withMessage('El nombre completo es requerido')
        .isLength({ min: 2, max: 150 })
        .withMessage('El nombre completo debe tener entre 2 y 150 caracteres'),
    
    body('phone')
        .optional()
        .matches(/^[0-9\-\+\s()]+$/)
        .withMessage('Formato de teléfono inválido'),
    
    body('roleId')
        .optional()
        .isInt({ min: 1, max: 5 })
        .withMessage('Rol inválido')
];

// Validaciones para login
const loginValidation = [
    body('emailOrUsername')
        .notEmpty()
        .withMessage('Email o username es requerido'),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
];

// Validaciones para cambio de contraseña
const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('La contraseña actual es requerida'),
    
    body('newPassword')
        .notEmpty()
        .withMessage('La nueva contraseña es requerida')
        .isLength({ min: 6 })
        .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
];

// =============================================
// RUTAS PÚBLICAS (sin autenticación)
// =============================================

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', registerValidation, AuthController.register);

// POST /api/auth/login - Login de usuario
router.post('/login', loginValidation, AuthController.login);

// GET /api/auth/roles - Obtener roles disponibles
router.get('/roles', AuthController.getRoles);

// =============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// =============================================

// GET /api/auth/profile - Obtener perfil del usuario autenticado
router.get('/profile', authMiddleware, AuthController.getProfile);

// PUT /api/auth/change-password - Cambiar contraseña
router.put('/change-password', authMiddleware, changePasswordValidation, AuthController.changePassword);

module.exports = router;
