// Script de prueba para verificar la conexión a la base de datos
const { connectDB, executeQuery } = require('./config/database');

async function testConnection() {
    console.log('🔍 Probando conexión a la base de datos...\n');

    try {
        // 1. Probar conexión
        await connectDB();
        console.log('✅ Conexión establecida correctamente\n');

        // 2. Verificar tablas
        console.log('📋 Verificando tablas...');
        const tables = await executeQuery(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_NAME
        `);
        console.log(`   Total de tablas: ${tables.recordset.length}`);
        console.log('   Tablas principales:');
        tables.recordset.slice(0, 10).forEach(table => {
            console.log(`   - ${table.TABLE_NAME}`);
        });
        console.log('');

        // 3. Verificar datos de catálogo
        console.log('📊 Verificando datos de catálogo...');
        
        const roles = await executeQuery('SELECT COUNT(*) as count FROM Cat_UserRoles');
        console.log(`   Roles de usuario: ${roles.recordset[0].count}`);
        
        const species = await executeQuery('SELECT COUNT(*) as count FROM Cat_Species');
        console.log(`   Especies: ${species.recordset[0].count}`);
        
        const roomTypes = await executeQuery('SELECT COUNT(*) as count FROM Cat_RoomTypes');
        console.log(`   Tipos de habitación: ${roomTypes.recordset[0].count}`);
        console.log('');

        // 4. Verificar datos de ejemplo
        console.log('👥 Verificando datos de ejemplo...');
        
        const users = await executeQuery('SELECT COUNT(*) as count FROM Users');
        console.log(`   Usuarios: ${users.recordset[0].count}`);
        
        const owners = await executeQuery('SELECT COUNT(*) as count FROM Owners');
        console.log(`   Dueños: ${owners.recordset[0].count}`);
        
        const pets = await executeQuery('SELECT COUNT(*) as count FROM Pets');
        console.log(`   Mascotas: ${pets.recordset[0].count}`);
        
        const rooms = await executeQuery('SELECT COUNT(*) as count FROM Rooms');
        console.log(`   Habitaciones: ${rooms.recordset[0].count}`);
        
        const reservations = await executeQuery('SELECT COUNT(*) as count FROM Reservations');
        console.log(`   Reservas: ${reservations.recordset[0].count}`);
        console.log('');

        // 5. Verificar usuarios de prueba
        console.log('🔐 Usuarios de prueba disponibles:');
        const testUsers = await executeQuery(`
            SELECT u.Username, u.Email, r.RoleName, u.IsActive
            FROM Users u
            INNER JOIN Cat_UserRoles r ON u.RoleId = r.RoleId
            ORDER BY r.RoleId
        `);
        
        testUsers.recordset.forEach(user => {
            console.log(`   - ${user.Username.padEnd(15)} | ${user.Email.padEnd(30)} | ${user.RoleName.padEnd(20)} | ${user.IsActive ? '✅ Activo' : '❌ Inactivo'}`);
        });
        console.log('');

        console.log('✅ Todas las verificaciones completadas exitosamente');
        console.log('');
        console.log('🚀 La base de datos está lista para usar');
        console.log('');
        console.log('💡 Credenciales de prueba:');
        console.log('   Admin:      admin / password123');
        console.log('   Recepción:  recepcion / password123');
        console.log('   Usuario:    jperez / password123');
        console.log('');
        console.log('⚠️  IMPORTANTE: Las contraseñas están sin hashear en la BD.');
        console.log('   Para hacer login, necesitas hashearlas primero con bcrypt.');

    } catch (error) {
        console.error('❌ Error en la prueba de conexión:');
        console.error(error.message);
        console.error('');
        console.error('💡 Verifica:');
        console.error('   1. SQL Server está corriendo');
        console.error('   2. El archivo .env tiene la configuración correcta');
        console.error('   3. La base de datos CuidadosLosPatitos existe');
        console.error('   4. Los scripts SQL se ejecutaron correctamente');
    }

    process.exit(0);
}

// Ejecutar prueba
testConnection();
