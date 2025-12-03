const { executeQuery, sql } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    constructor(data) {
        this.userId = data.UserId;
        this.username = data.Username;
        this.email = data.Email;
        this.passwordHash = data.PasswordHash;
        this.roleId = data.RoleId;
        this.roleName = data.RoleName;
        this.fullName = data.FullName;
        this.phone = data.Phone;
        this.isActive = data.IsActive;
        this.lastLogin = data.LastLogin;
        this.createdAt = data.CreatedAt;
        this.updatedAt = data.UpdatedAt;
    }

    // Crear un nuevo usuario
    static async create(userData) {
        try {
            // Hashear la contraseña
            const passwordHash = await bcrypt.hash(userData.password, 10);

            const query = `
                INSERT INTO Users (Username, Email, PasswordHash, RoleId, FullName, Phone, IsActive)
                OUTPUT INSERTED.UserId, INSERTED.Username, INSERTED.Email, INSERTED.RoleId, INSERTED.FullName, INSERTED.Phone, INSERTED.IsActive
                VALUES (@username, @email, @passwordHash, @roleId, @fullName, @phone, 1)
            `;

            const params = {
                username: userData.username,
                email: userData.email,
                passwordHash: passwordHash,
                roleId: userData.roleId || 2, // Por defecto: Usuario Normal
                fullName: userData.fullName,
                phone: userData.phone || null
            };

            const result = await executeQuery(query, params);
            
            // Obtener el rol del usuario
            const userWithRole = await User.findById(result.recordset[0].UserId);
            return userWithRole;
        } catch (error) {
            if (error.message.includes('duplicate') || error.message.includes('UNIQUE')) {
                throw new Error('El username o email ya están registrados');
            }
            throw new Error(`Error creando usuario: ${error.message}`);
        }
    }

    // Buscar usuario por ID
    static async findById(userId) {
        try {
            const query = `
                SELECT 
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.PasswordHash,
                    u.RoleId,
                    r.RoleName,
                    u.FullName,
                    u.Phone,
                    u.IsActive,
                    u.LastLogin,
                    u.CreatedAt,
                    u.UpdatedAt
                FROM Users u
                INNER JOIN Cat_UserRoles r ON u.RoleId = r.RoleId
                WHERE u.UserId = @userId
            `;

            const result = await executeQuery(query, { userId });

            if (result.recordset.length === 0) {
                return null;
            }

            return new User(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error obteniendo usuario: ${error.message}`);
        }
    }

    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const query = `
                SELECT 
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.PasswordHash,
                    u.RoleId,
                    r.RoleName,
                    u.FullName,
                    u.Phone,
                    u.IsActive,
                    u.LastLogin,
                    u.CreatedAt,
                    u.UpdatedAt
                FROM Users u
                INNER JOIN Cat_UserRoles r ON u.RoleId = r.RoleId
                WHERE u.Email = @email
            `;

            const result = await executeQuery(query, { email });

            if (result.recordset.length === 0) {
                return null;
            }

            return new User(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error buscando usuario por email: ${error.message}`);
        }
    }

    // Buscar usuario por username
    static async findByUsername(username) {
        try {
            const query = `
                SELECT 
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.PasswordHash,
                    u.RoleId,
                    r.RoleName,
                    u.FullName,
                    u.Phone,
                    u.IsActive,
                    u.LastLogin,
                    u.CreatedAt,
                    u.UpdatedAt
                FROM Users u
                INNER JOIN Cat_UserRoles r ON u.RoleId = r.RoleId
                WHERE u.Username = @username
            `;

            const result = await executeQuery(query, { username });

            if (result.recordset.length === 0) {
                return null;
            }

            return new User(result.recordset[0]);
        } catch (error) {
            throw new Error(`Error buscando usuario por username: ${error.message}`);
        }
    }

    // Validar contraseña
    async validatePassword(password) {
        return await bcrypt.compare(password, this.passwordHash);
    }

    // Actualizar último login
    static async updateLastLogin(userId) {
        try {
            const query = `
                UPDATE Users
                SET LastLogin = SYSDATETIME()
                WHERE UserId = @userId
            `;

            await executeQuery(query, { userId });
        } catch (error) {
            console.error('Error actualizando último login:', error);
        }
    }

    // Obtener todos los usuarios
    static async findAll() {
        try {
            const query = `
                SELECT 
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.RoleId,
                    r.RoleName,
                    u.FullName,
                    u.Phone,
                    u.IsActive,
                    u.LastLogin,
                    u.CreatedAt,
                    u.UpdatedAt
                FROM Users u
                INNER JOIN Cat_UserRoles r ON u.RoleId = r.RoleId
                ORDER BY u.CreatedAt DESC
            `;

            const result = await executeQuery(query);
            return result.recordset.map(user => new User(user));
        } catch (error) {
            throw new Error(`Error obteniendo usuarios: ${error.message}`);
        }
    }

    // Actualizar usuario
    static async update(userId, userData) {
        try {
            const query = `
                UPDATE Users
                SET Username = @username,
                    Email = @email,
                    FullName = @fullName,
                    Phone = @phone,
                    RoleId = @roleId,
                    UpdatedAt = SYSDATETIME()
                OUTPUT INSERTED.UserId
                WHERE UserId = @userId
            `;

            const params = {
                userId,
                username: userData.username,
                email: userData.email,
                fullName: userData.fullName,
                phone: userData.phone,
                roleId: userData.roleId
            };

            const result = await executeQuery(query, params);

            if (result.recordset.length === 0) {
                return null;
            }

            return await User.findById(userId);
        } catch (error) {
            throw new Error(`Error actualizando usuario: ${error.message}`);
        }
    }

    // Cambiar contraseña
    static async changePassword(userId, newPassword) {
        try {
            const passwordHash = await bcrypt.hash(newPassword, 10);

            const query = `
                UPDATE Users
                SET PasswordHash = @passwordHash,
                    UpdatedAt = SYSDATETIME()
                WHERE UserId = @userId
            `;

            await executeQuery(query, { userId, passwordHash });
            return true;
        } catch (error) {
            throw new Error(`Error cambiando contraseña: ${error.message}`);
        }
    }

    // Activar/Desactivar usuario
    static async toggleActive(userId) {
        try {
            const query = `
                UPDATE Users
                SET IsActive = ~IsActive,
                    UpdatedAt = SYSDATETIME()
                OUTPUT INSERTED.IsActive
                WHERE UserId = @userId
            `;

            const result = await executeQuery(query, { userId });

            if (result.recordset.length === 0) {
                return null;
            }

            return result.recordset[0].IsActive;
        } catch (error) {
            throw new Error(`Error cambiando estado del usuario: ${error.message}`);
        }
    }

    // Obtener todos los roles disponibles
    static async getRoles() {
        try {
            const query = `
                SELECT RoleId, RoleName, Description
                FROM Cat_UserRoles
                ORDER BY RoleId
            `;

            const result = await executeQuery(query);
            return result.recordset;
        } catch (error) {
            throw new Error(`Error obteniendo roles: ${error.message}`);
        }
    }

    // Método para obtener datos seguros del usuario (sin password)
    toJSON() {
        return {
            userId: this.userId,
            username: this.username,
            email: this.email,
            roleId: this.roleId,
            roleName: this.roleName,
            fullName: this.fullName,
            phone: this.phone,
            isActive: this.isActive,
            lastLogin: this.lastLogin,
            createdAt: this.createdAt
        };
    }
}

module.exports = User;
