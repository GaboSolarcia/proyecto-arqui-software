// Script simple para probar la creación de reserva con mejor manejo de errores
const http = require('http');

async function testReservation() {
    console.log('🔍 Iniciando prueba de creación de reserva...\n');

    // Paso 1: Login
    console.log('1️⃣ Iniciando sesión como jperez...');
    const loginData = JSON.stringify({
        emailOrUsername: 'jperez',
        password: 'password123'
    });

    const loginOptions = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginData)
        }
    };

    try {
        const loginResponse = await new Promise((resolve, reject) => {
            const req = http.request(loginOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error('Error parsing login response'));
                    }
                });
            });
            req.on('error', reject);
            req.write(loginData);
            req.end();
        });

        if (!loginResponse.success) {
            console.error('❌ Error en login:', loginResponse.message);
            return;
        }

        console.log('✅ Login exitoso');
        const token = loginResponse.token;

        // Paso 2: Crear reserva
        console.log('\n2️⃣ Creando reserva...');
        const reservationData = JSON.stringify({
            pet_id: 1,
            start_date: '2025-12-05',
            end_date: '2025-12-15',
            is_indefinite: false,
            service_type: 'Hospedaje Completo',
            special_instructions: 'Test de reserva',
            assistance_level: 'Asistencia básica',
            additional_packages: JSON.stringify({
                juegos: true,
                paseos_acompanamiento: false,
                piscina: false,
                terapias: false
            }),
            stay_schedule: 'Full estancia',
            room_type: 'Habitación Individual',
            status: 'Pendiente',
            total_cost: 0
        });

        const reservationOptions = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/reservations',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(reservationData)
            }
        };

        const reservationResponse = await new Promise((resolve, reject) => {
            const req = http.request(reservationOptions, (res) => {
                let data = '';
                console.log(`📡 Status Code: ${res.statusCode}`);
                res.on('data', chunk => {
                    data += chunk;
                    console.log('📦 Recibiendo datos...');
                });
                res.on('end', () => {
                    console.log('📨 Respuesta completa recibida');
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        console.error('⚠️ Respuesta no es JSON:', data);
                        reject(new Error('Error parsing reservation response: ' + data));
                    }
                });
            });
            
            req.on('error', (error) => {
                console.error('🔴 Error en la solicitud HTTP:', error.message);
                reject(error);
            });
            
            console.log('📤 Enviando datos al servidor...');
            req.write(reservationData);
            req.end();
        });

        console.log('\n📊 Resultado:');
        console.log(JSON.stringify(reservationResponse, null, 2));

        if (reservationResponse.success) {
            console.log('\n✅ ¡Reserva creada exitosamente!');
        } else {
            console.log('\n❌ Error en la respuesta:', reservationResponse.message);
        }

    } catch (error) {
        console.error('\n💥 Error durante la prueba:', error.message);
        if (error.stack) {
            console.error(error.stack);
        }
    }
}

testReservation();
