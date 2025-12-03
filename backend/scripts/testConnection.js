// Script para probar la conexión a la base de datos
const { connectDB, executeQuery } = require('../config/database');

const testConnection = async () => {
    try {
        console.log('🔄 Intentando conectar a SQL Server...');
        console.log('');
        
        await connectDB();
        
        console.log('✅ Conexión exitosa!');
        console.log('');
        
        // Probar consulta
        console.log('📊 Verificando datos en la base de datos...');
        console.log('');
        
        const queries = [
            { name: 'Roles de usuario', query: 'SELECT COUNT(*) as total FROM Cat_UserRoles' },
            { name: 'Usuarios', query: 'SELECT COUNT(*) as total FROM Users' },
            { name: 'Dueños', query: 'SELECT COUNT(*) as total FROM Owners' },
            { name: 'Mascotas', query: 'SELECT COUNT(*) as total FROM Pets' },
            { name: 'Especialistas', query: 'SELECT COUNT(*) as total FROM Specialists' },
            { name: 'Habitaciones', query: 'SELECT COUNT(*) as total FROM Rooms' },
            { name: 'Reservas', query: 'SELECT COUNT(*) as total FROM Reservations' }
        ];
        
        for (const { name, query } of queries) {
            const result = await executeQuery(query);
            console.log(`  ✓ ${name}: ${result.recordset[0].total}`);
        }
        
        console.log('');
        console.log('🎉 Base de datos configurada correctamente!');
        console.log('');
        console.log('Próximos pasos:');
        console.log('  1. Ejecutar: npm run hash-passwords');
        console.log('  2. Iniciar servidor: npm run dev');
        console.log('  3. Probar login en: http://localhost:3001/api/auth/login');
        
        process.exit(0);
    } catch (error) {
        console.error('');
        console.error('❌ Error de conexión:', error.message);
        console.error('');
        console.error('💡 Verifica:');
        console.error('  1. SQL Server está ejecutándose');
        console.error('  2. Las credenciales en .env son correctas');
        console.error('  3. La base de datos "CuidadosLosPatitos" existe');
        console.error('  4. El nombre de la instancia es correcto');
        console.error('');
        process.exit(1);
    }
};

testConnection();
