const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const authMiddleware = (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token de autenticación no proporcionado'
            });
        }

        // El token viene en formato: "Bearer TOKEN"
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Formato de token inválido'
            });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_super_segura');

        // Agregar información del usuario al request
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            roleId: decoded.roleId,
            roleName: decoded.roleName
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado. Por favor, inicie sesión nuevamente'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error en autenticación',
            error: error.message
        });
    }
};

// Middleware para verificar roles específicos
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        // Verificar si el rol del usuario está en los roles permitidos
        if (!allowedRoles.includes(req.user.roleName)) {
            return res.status(403).json({
                success: false,
                message: 'No tiene permisos para realizar esta acción'
            });
        }

        next();
    };
};

// Middleware para verificar si es administrador
const isAdmin = (req, res, next) => {
    return checkRole('Administrador')(req, res, next);
};

// Middleware para verificar si es recepcionista o admin
const isReceptionist = (req, res, next) => {
    return checkRole('Administrador', 'Recepcionista')(req, res, next);
};

module.exports = {
    authMiddleware,
    checkRole,
    isAdmin,
    isReceptionist
};
