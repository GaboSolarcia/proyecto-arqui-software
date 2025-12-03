const BASE_URL = 'http://localhost:3001/api';

async function testReservations() {
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

        // Test reservations endpoint
        console.log('📋 Obteniendo reservaciones...');
        const reservationsResponse = await fetch(`${BASE_URL}/reservations`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const reservationsData = await reservationsResponse.json();
        
        console.log('✅ Respuesta recibida:');
        console.log(JSON.stringify(reservationsData, null, 2));
        
        if (reservationsData.success) {
            console.log(`\n✅ Total de reservaciones: ${reservationsData.count}`);
            if (reservationsData.data && reservationsData.data.length > 0) {
                console.log('\n📋 Primera reservación:');
                console.log(JSON.stringify(reservationsData.data[0], null, 2));
            }
        } else {
            console.error('❌ Error:', reservationsData.message);
            if (reservationsData.error) {
                console.error('Detalle:', reservationsData.error);
            }
        }

    } catch (error) {
        console.error('❌ Error en la prueba:');
        console.error(error.message);
        console.error(error.stack);
    }
}

testReservations();
