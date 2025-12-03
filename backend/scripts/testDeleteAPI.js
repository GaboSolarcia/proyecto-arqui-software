const fetch = require('node-fetch');

async function testDeleteAPI() {
    try {
        console.log('=== Test: API de eliminación de Especialista ===\n');
        
        // 1. Login
        console.log('1. Haciendo login...');
        const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailOrUsername: 'admin',
                password: 'password123'
            })
        });
        
        const loginData = await loginResponse.json();
        
        if (!loginData.success || !loginData.token) {
            console.error('Error en login:', loginData.message);
            process.exit(1);
        }
        
        console.log('✓ Login exitoso');
        const token = loginData.token;
        
        // 2. Obtener lista de especialistas
        console.log('\n2. Obteniendo lista de especialistas...');
        const listResponse = await fetch('http://localhost:3001/api/specialists', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const listData = await listResponse.json();
        
        if (!listData.success || !listData.data || listData.data.length === 0) {
            console.log('No hay especialistas disponibles para eliminar');
            process.exit(0);
        }
        
        console.log(`✓ Total de especialistas: ${listData.data.length}`);
        
        // Usar el último especialista
        const specialist = listData.data[listData.data.length - 1];
        console.log(`\nEspecialista a eliminar:`);
        console.log(`  ID: ${specialist.SpecialistId}`);
        console.log(`  Nombre: ${specialist.EmployeeName}`);
        console.log(`  Cédula: ${specialist.Cedula}`);
        
        // 3. Eliminar especialista
        console.log(`\n3. Eliminando especialista ID ${specialist.SpecialistId}...`);
        const deleteResponse = await fetch(`http://localhost:3001/api/specialists/${specialist.SpecialistId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const deleteData = await deleteResponse.json();
        
        console.log('\nRespuesta del servidor:');
        console.log(JSON.stringify(deleteData, null, 2));
        
        if (deleteData.success) {
            console.log('\n✓ Especialista eliminado exitosamente');
        } else {
            console.log('\n✗ Error al eliminar:', deleteData.message);
        }
        
    } catch (error) {
        console.error('\n✗ Error:', error.message);
        console.error(error.stack);
    }
    
    process.exit();
}

testDeleteAPI();
