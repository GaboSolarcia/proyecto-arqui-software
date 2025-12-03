// Script para actualizar las contraseñas de los usuarios de ejemplo con bcrypt
const bcrypt = require('bcryptjs');
const { executeQuery, connectDB } = require('../config/database');

const updatePasswords = async () => {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await connectDB();
        
        console.log('🔐 Hasheando contraseñas...');
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('📝 Actualizando contraseñas de usuarios...');
        
        const query = `
            UPDATE Users 
            SET PasswordHash = @passwordHash
            WHERE Username IN ('admin', 'recepcion', 'jperez', 'alopez', 'cmartinez')
        `;
        
        const result = await executeQuery(query, { passwordHash: hashedPassword });
        
        console.log('✅ Contraseñas actualizadas exitosamente!');
        console.log(`   Usuarios actualizados: ${result.rowsAffected[0]}`);
        console.log('');
        console.log('📋 Credenciales de prueba:');
        console.log('   - admin / password123');
        console.log('   - recepcion / password123');
        console.log('   - jperez / password123');
        console.log('   - alopez / password123');
        console.log('   - cmartinez / password123');
        console.log('');
        console.log('🎉 ¡Listo! Ahora puedes hacer login con estas credenciales');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

updatePasswords();
