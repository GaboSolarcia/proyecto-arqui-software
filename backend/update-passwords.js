// Script para actualizar las contraseñas de los usuarios de ejemplo con hashes bcrypt reales
const bcrypt = require('bcryptjs');
const { connectDB, executeQuery } = require('./config/database');

async function updatePasswords() {
    console.log('🔐 Actualizando contraseñas de usuarios de ejemplo...\n');

    try {
        await connectDB();

        // Password para todos los usuarios de ejemplo: "password123"
        const password = 'password123';
        const passwordHash = await bcrypt.hash(password, 10);

        console.log(`Hash generado para "${password}":`);
        console.log(passwordHash);
        console.log('');

        // Actualizar contraseñas de todos los usuarios de ejemplo
        const result = await executeQuery(`
            UPDATE Users
            SET PasswordHash = @passwordHash,
                UpdatedAt = SYSDATETIME()
            WHERE Username IN ('admin', 'recepcion', 'jperez', 'alopez', 'cmartinez')
        `, { passwordHash });

        console.log('✅ Contraseñas actualizadas exitosamente');
        console.log('');
        console.log('📋 Usuarios actualizados:');
        console.log('   - admin       -> password123');
        console.log('   - recepcion   -> password123');
        console.log('   - jperez      -> password123');
        console.log('   - alopez      -> password123');
        console.log('   - cmartinez   -> password123');
        console.log('');
        console.log('🚀 Ya puedes hacer login con estas credenciales');

    } catch (error) {
        console.error('❌ Error actualizando contraseñas:');
        console.error(error.message);
    }

    process.exit(0);
}

updatePasswords();
