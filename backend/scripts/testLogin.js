const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function testLogin() {
    try {
        console.log('🔍 Buscando usuario "admin"...');
        
        // Buscar por username
        const user = await User.findByUsername('admin');
        
        if (!user) {
            console.log('❌ Usuario no encontrado');
            return;
        }
        
        console.log('✅ Usuario encontrado:');
        console.log('   - UserId:', user.userId);
        console.log('   - Username:', user.username);
        console.log('   - Email:', user.email);
        console.log('   - RoleName:', user.roleName);
        console.log('   - IsActive:', user.isActive);
        console.log('   - PasswordHash:', user.passwordHash);
        
        console.log('\n🔐 Probando contraseña "password123"...');
        const isValid = await user.validatePassword('password123');
        
        if (isValid) {
            console.log('✅ Contraseña correcta!');
        } else {
            console.log('❌ Contraseña incorrecta');
            
            // Probar hash directo
            console.log('\n🔬 Verificación adicional:');
            const testHash = await bcrypt.hash('password123', 10);
            console.log('   Test hash generado:', testHash);
            const testCompare = await bcrypt.compare('password123', testHash);
            console.log('   Test compare resultado:', testCompare);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testLogin();
