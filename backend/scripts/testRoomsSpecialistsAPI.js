const BASE_URL = 'http://localhost:3001/api';

async function testEndpoints() {
    try {
        console.log('🔐 Iniciando sesión como admin...');
        
        // Login
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
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
        
        if (!loginData.success) {
            console.error('❌ Error en login:', loginData.message);
            return;
        }

        const token = loginData.token;
        console.log('✅ Token obtenido\n');

        // Test Rooms endpoint
        console.log('🏠 Probando endpoint /api/rooms...');
        const roomsResponse = await fetch(`${BASE_URL}/rooms`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const roomsData = await roomsResponse.json();
        
        if (roomsData.success) {
            console.log(`✅ Rooms: ${roomsData.count} habitaciones`);
            if (roomsData.data && roomsData.data.length > 0) {
                console.log('Primera habitación:', JSON.stringify(roomsData.data[0], null, 2));
            }
        } else {
            console.error('❌ Error en rooms:', roomsData.message);
        }

        // Test Specialists endpoint
        console.log('\n👥 Probando endpoint /api/specialists...');
        const specialistsResponse = await fetch(`${BASE_URL}/specialists`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const specialistsData = await specialistsResponse.json();
        
        if (specialistsData.success) {
            console.log(`✅ Specialists: ${specialistsData.count} especialistas`);
            if (specialistsData.data && specialistsData.data.length > 0) {
                console.log('Primer especialista:', JSON.stringify(specialistsData.data[0], null, 2));
            }
        } else {
            console.error('❌ Error en specialists:', specialistsData.message);
        }

        console.log('\n✅ Todas las pruebas completadas!');

    } catch (error) {
        console.error('❌ Error en la prueba:');
        console.error(error.message);
        console.error(error.stack);
    }
}

testEndpoints();
