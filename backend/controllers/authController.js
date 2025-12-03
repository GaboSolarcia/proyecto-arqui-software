const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Owner = require('../models/Owner');
const { validationResult } = require('express-validator');

// Registrar nuevo usuario
exports.register = async (req, res) => {
    try {
        // Validar errores de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: errors.array()
            });
        }

        const { username, email, password, fullName, phone, roleId, cedula } = req.body;

        // Verificar si el usuario ya existe
        const existingUserByEmail = await User.findByEmail(email);
        if (existingUserByEmail) {
            return res.status(409).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }

        const existingUserByUsername = await User.findByUsername(username);
        if (existingUserByUsername) {
            return res.status(409).json({
                success: false,
                message: 'El nombre de usuario ya está en uso'
            });
        }

        // Si se proporciona cédula, verificar que no esté registrada
        if (cedula) {
            const existingOwnerByCedula = await Owner.findByCedula(cedula);
            if (existingOwnerByCedula) {
                return res.status(409).json({
                    success: false,
                    message: 'La cédula ya está registrada'
                });
            }
        }

        // Crear el usuario
        const userData = {
            username,
            email,
            password,
            fullName,
            phone,
            roleId: roleId || 2 // Por defecto: Usuario Normal
        };

        const newUser = await User.create(userData);

        // Si el rol es "Usuario Normal" (roleId = 2), crear también un Owner
        let newOwner = null;
        if ((roleId || 2) === 2) {
            const ownerData = {
                userId: newUser.userId,
                name: fullName,
                cedula: cedula || null,
                email: email,
                phone: phone || null
            };

            try {
                newOwner = await Owner.create(ownerData);
            } catch (ownerError) {
                console.error('Error creando Owner:', ownerError);
                // No fallar el registro si falla la creación del Owner
            }
        }

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente' + (newOwner ? ' como cliente/dueño' : ''),
            data: {
                user: newUser.toJSON(),
                owner: newOwner ? { ownerId: newOwner.OwnerId || newOwner.id } : null
            }
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};

// Login de usuario
exports.login = async (req, res) => {
    try {
        // Validar errores de entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Datos de entrada inválidos',
                errors: errors.array()
            });
        }

        const { emailOrUsername, password } = req.body;

        // Buscar usuario por email o username
        let user = await User.findByEmail(emailOrUsername);
        if (!user) {
            user = await User.findByUsername(emailOrUsername);
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Usuario desactivado. Contacte al administrador'
            });
        }

        // Validar contraseña
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }

        // Actualizar último login
        await User.updateLastLogin(user.userId);

        // Generar token JWT
        const token = jwt.sign(
            {
                userId: user.userId,
                username: user.username,
                email: user.email,
                roleId: user.roleId,
                roleName: user.roleName
            },
            process.env.JWT_SECRET || 'tu_clave_secreta_super_segura',
            { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );

        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el proceso de login',
            error: error.message
        });
    }
};

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
    try {
        // req.user viene del middleware de autenticación
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: user.toJSON()
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo perfil de usuario',
            error: error.message
        });
    }
};

// Obtener todos los roles disponibles
exports.getRoles = async (req, res) => {
    try {
        const roles = await User.getRoles();

        res.json({
            success: true,
            data: roles
        });
    } catch (error) {
        console.error('Error obteniendo roles:', error);
        res.status(500).json({
            success: false,
            message: 'Error obteniendo roles',
            error: error.message
        });
    }
};

// Cambiar contraseña
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;

        // Validar que se proporcionaron ambas contraseñas
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren la contraseña actual y la nueva'
            });
        }

        // Obtener usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Validar contraseña actual
        const isValidPassword = await user.validatePassword(currentPassword);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña actual incorrecta'
            });
        }

        // Cambiar contraseña
        await User.changePassword(userId, newPassword);

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar contraseña',
            error: error.message
        });
    }
};
