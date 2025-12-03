const fetch = require('node-fetch');

async function testReservationsAPI() {
    try {
        console.log('🔍 Probando API de reservaciones...\n');

        // 1. Login como jperez
        console.log('🔑 Iniciando sesión como jperez...');
        const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emailOrUsername: 'jperez',
                password: 'password123'
            })
        });

        const loginData = await loginResponse.json();
        
        if (!loginData.success) {
            console.error('❌ Error en login:', loginData.message);
            process.exit(1);
        }

        console.log('✅ Login exitoso');
        console.log('Token:', loginData.token);
        console.log('Usuario:', loginData.user.username);
        console.log('Rol:', loginData.user.role);

        // 2. Obtener reservaciones
        console.log('\n📋 Obteniendo reservaciones...');
        const reservationsResponse = await fetch('http://localhost:3001/api/reservations', {
            headers: {
                'Authorization': `Bearer ${loginData.token}`,
                'Content-Type': 'application/json'
            }
        });

        const reservationsData = await reservationsResponse.json();
        
        console.log('\nRespuesta completa del servidor:');
        console.log(JSON.stringify(reservationsData, null, 2));

        if (reservationsData.success) {
            console.log('\n✅ Reservaciones obtenidas exitosamente');
            console.log('Total de reservaciones:', reservationsData.count);
            
            if (reservationsData.data && reservationsData.data.length > 0) {
                console.log('\n📋 Detalle de reservaciones:');
                reservationsData.data.forEach((res, index) => {
                    console.log(`\n${index + 1}. Reservación ID: ${res.ReservationId}`);
                    console.log(`   Mascota: ${res.PetName}`);
                    console.log(`   Habitación: ${res.RoomNumber || 'Sin asignar'}`);
                    console.log(`   Tipo: ${res.RoomTypeName || 'N/A'}`);
                    console.log(`   Estado: ${res.StatusName}`);
                    console.log(`   Inicio: ${res.StartDate}`);
                    console.log(`   Fin: ${res.EndDate}`);
                    console.log(`   Costo: $${res.TotalCost}`);
                });
            } else {
                console.log('⚠️  No se encontraron reservaciones');
            }
        } else {
            console.error('❌ Error obteniendo reservaciones:', reservationsData.message);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testReservationsAPI();
