const http = require('http');

async function testCameraAPI() {
    console.log('🎥 Probando API de cámara...\n');

    try {
        // 1. Login
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

        const loginResponse = await new Promise((resolve, reject) => {
            const req = http.request(loginOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
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

        // 2. Obtener mascotas con cámara
        console.log('\n2️⃣ Obteniendo mascotas con cámara...');
        const petsOptions = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/camera/my-pets',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const petsResponse = await new Promise((resolve, reject) => {
            const req = http.request(petsOptions, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(JSON.parse(data)));
            });
            req.on('error', reject);
            req.end();
        });

        console.log('\n📊 Resultado:');
        console.log(JSON.stringify(petsResponse, null, 2));

        if (petsResponse.success && petsResponse.data.length > 0) {
            console.log('\n✅ ¡Acceso a cámara disponible!');
            console.log(`   Mascotas con cámara: ${petsResponse.data.length}`);
            petsResponse.data.forEach(pet => {
                console.log(`   - ${pet.petName} (${pet.species}) en habitación ${pet.roomNumber}`);
            });
        } else {
            console.log('\n⚠️  No se encontraron mascotas con acceso a cámara');
        }

    } catch (error) {
        console.error('\n💥 Error:', error.message);
    }
}

testCameraAPI();
