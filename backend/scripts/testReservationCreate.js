const fetch = require('node-fetch');

async function testReservationCreate() {
    try {
        // 1. Login primero para obtener token
        console.log('1. Iniciando sesión...');
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
            return;
        }

        console.log('✅ Login exitoso. Usuario:', loginData.user.username);
        const token = loginData.token;

        // 2. Obtener mascotas del usuario
        console.log('\n2. Obteniendo mascotas...');
        const petsResponse = await fetch('http://localhost:3001/api/pets', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const petsData = await petsResponse.json();
        console.log('Mascotas disponibles:', petsData.data?.length || 0);
        
        if (petsData.data && petsData.data.length > 0) {
            console.log('Primera mascota:', petsData.data[0]);
        }

        // 3. Crear reserva
        console.log('\n3. Creando reserva...');
        const reservationData = {
            pet_id: 1, // Rocky
            start_date: '2025-12-02',
            end_date: '2025-12-10',
            is_indefinite: false,
            service_type: 'Guardería',
            special_instructions: 'Test de reserva',
            assistance_level: 'Asistencia básica',
            additional_packages: JSON.stringify({
                juegos: true,
                paseos_acompanamiento: false,
                piscina: false,
                terapias: false
            }),
            stay_schedule: 'Full estancia',
            room_type: 'Habitación individual',
            status: 'Pendiente',
            total_cost: 0
        };

        console.log('Datos a enviar:', reservationData);

        const reservationResponse = await fetch('http://localhost:3001/api/reservations', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        });

        const reservationResult = await reservationResponse.json();
        
        console.log('\n📊 Resultado:');
        console.log(JSON.stringify(reservationResult, null, 2));

        if (reservationResult.success) {
            console.log('\n✅ Reserva creada exitosamente!');
        } else {
            console.log('\n❌ Error creando reserva');
        }

    } catch (error) {
        console.error('\n❌ Error en el test:', error.message);
        console.error(error.stack);
    }
}

testReservationCreate();
