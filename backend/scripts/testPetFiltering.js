// Script para probar el filtrado de mascotas por usuario
const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api';

async function testPetFiltering() {
    try {
        console.log('🧪 PRUEBA DE FILTRADO DE MASCOTAS POR USUARIO\n');
        console.log('='.repeat(60));
        
        // 1. Login como Juan Pérez (Usuario Normal)
        console.log('\n📝 Paso 1: Login como Juan Pérez (jperez)...');
        const loginJuan = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emailOrUsername: 'jperez',
                password: 'password123'
            })
        });

        const juanData = await loginJuan.json();
        if (!juanData.success) {
            console.log('❌ Error en login de Juan:', juanData.message);
            return;
        }

        const juanToken = juanData.token;
        console.log('✅ Login exitoso - UserId:', juanData.user.userId);
        console.log('   Rol:', juanData.user.roleName);

        // 2. Obtener mascotas como Juan Pérez
        console.log('\n📝 Paso 2: Obteniendo mascotas de Juan Pérez...');
        const juanPetsResponse = await fetch(`${API_URL}/pets`, {
            headers: { 
                'Authorization': `Bearer ${juanToken}`,
                'Content-Type': 'application/json'
            }
        });

        const juanPets = await juanPetsResponse.json();
        console.log('📊 Resultado:', juanPets.success ? '✅ Exitoso' : '❌ Fallido');
        console.log('   Total de mascotas:', juanPets.count || 0);
        
        if (juanPets.data && juanPets.data.length > 0) {
            console.log('\n📋 Mascotas de Juan Pérez:');
            juanPets.data.forEach((pet, index) => {
                console.log(`   ${index + 1}. ${pet.Name || pet.name}`);
                console.log(`      Dueño: ${pet.OwnerName || pet.owner_name}`);
                console.log(`      Cédula: ${pet.OwnerCedula || pet.owner_cedula}`);
            });
        } else {
            console.log('⚠️  No se encontraron mascotas para este usuario');
        }

        console.log('\n' + '='.repeat(60));

        // 3. Login como Admin
        console.log('\n📝 Paso 3: Login como Administrador...');
        const loginAdmin = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emailOrUsername: 'admin',
                password: 'password123'
            })
        });

        const adminData = await loginAdmin.json();
        if (!adminData.success) {
            console.log('❌ Error en login de Admin:', adminData.message);
            return;
        }

        const adminToken = adminData.token;
        console.log('✅ Login exitoso - UserId:', adminData.user.userId);
        console.log('   Rol:', adminData.user.roleName);

        // 4. Obtener mascotas como Admin
        console.log('\n📝 Paso 4: Obteniendo todas las mascotas (Admin)...');
        const adminPetsResponse = await fetch(`${API_URL}/pets`, {
            headers: { 
                'Authorization': `Bearer ${adminToken}`,
                'Content-Type': 'application/json'
            }
        });

        const adminPets = await adminPetsResponse.json();
        console.log('📊 Resultado:', adminPets.success ? '✅ Exitoso' : '❌ Fallido');
        console.log('   Total de mascotas:', adminPets.count || 0);

        if (adminPets.data && adminPets.data.length > 0) {
            console.log('\n📋 Todas las mascotas del sistema:');
            adminPets.data.forEach((pet, index) => {
                console.log(`   ${index + 1}. ${pet.Name || pet.name}`);
                console.log(`      Dueño: ${pet.OwnerName || pet.owner_name}`);
                console.log(`      Cédula: ${pet.OwnerCedula || pet.owner_cedula}`);
            });
        }

        console.log('\n' + '='.repeat(60));
        console.log('\n✅ PRUEBA COMPLETADA');
        console.log('\n📌 VERIFICACIÓN:');
        console.log(`   - Juan Pérez debería ver solo ${juanPets.count || 0} mascota(s) (sus propias mascotas)`);
        console.log(`   - Admin debería ver ${adminPets.count || 0} mascota(s) (todas las mascotas del sistema)`);
        
        if ((juanPets.count || 0) < (adminPets.count || 0)) {
            console.log('\n🎉 ¡El filtrado funciona correctamente!');
        } else if ((juanPets.count || 0) === (adminPets.count || 0) && (adminPets.count || 0) > 0) {
            console.log('\n⚠️  ADVERTENCIA: Juan Pérez está viendo todas las mascotas (debería ver solo las suyas)');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la prueba:', error.message);
        process.exit(1);
    }
}

testPetFiltering();
