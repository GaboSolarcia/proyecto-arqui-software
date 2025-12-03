async function testPetsEndpoint() {
    try {
        console.log('🔍 Probando endpoint de mascotas...\n');

        // 1. Login con usuario jperez
        console.log('1️⃣ Iniciando sesión con jperez...');
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
            console.log('❌ Error en login:', loginData.message);
            process.exit(1);
        }

        console.log('✅ Login exitoso');
        console.log('   Usuario:', loginData.user.username);
        console.log('   Rol:', loginData.user.roleName);
        console.log('   UserId:', loginData.user.userId);
        console.log('');

        // 2. Obtener mascotas
        console.log('2️⃣ Obteniendo mascotas...');
        const petsResponse = await fetch('http://localhost:3001/api/pets', {
            headers: {
                'Authorization': `Bearer ${loginData.token}`,
                'Content-Type': 'application/json'
            }
        });

        const petsData = await petsResponse.json();

        if (!petsData.success) {
            console.log('❌ Error obteniendo mascotas:', petsData.message);
            process.exit(1);
        }

        console.log(`✅ ${petsData.count} mascota(s) encontrada(s):\n`);
        
        petsData.data.forEach((pet, index) => {
            console.log(`${index + 1}. ${pet.Name} (ID: ${pet.PetId})`);
            console.log(`   Especie: ${pet.SpeciesName || pet.Species}`);
            console.log(`   Raza: ${pet.BreedName || pet.Breed || 'N/A'}`);
            console.log(`   Dueño: ${pet.OwnerName}`);
            console.log(`   Aprobada: ${pet.IsApproved ? 'Sí' : 'No'}`);
            console.log('');
        });

        // 3. Probar con admin
        console.log('═══════════════════════════════════════════');
        console.log('3️⃣ Probando con usuario admin...\n');
        
        const adminLoginResponse = await fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emailOrUsername: 'admin',
                password: 'password123'
            })
        });

        const adminLoginData = await adminLoginResponse.json();
        
        if (!adminLoginData.success) {
            console.log('❌ Error en login admin:', adminLoginData.message);
            process.exit(1);
        }

        console.log('✅ Login admin exitoso');
        console.log('   Usuario:', adminLoginData.user.username);
        console.log('   Rol:', adminLoginData.user.roleName);
        console.log('');

        const adminPetsResponse = await fetch('http://localhost:3001/api/pets', {
            headers: {
                'Authorization': `Bearer ${adminLoginData.token}`,
                'Content-Type': 'application/json'
            }
        });

        const adminPetsData = await adminPetsResponse.json();

        if (!adminPetsData.success) {
            console.log('❌ Error obteniendo mascotas admin:', adminPetsData.message);
            process.exit(1);
        }

        console.log(`✅ Admin ve ${adminPetsData.count} mascota(s) (todas las del sistema):\n`);
        
        adminPetsData.data.forEach((pet, index) => {
            console.log(`${index + 1}. ${pet.Name} - Dueño: ${pet.OwnerName}`);
        });

        console.log('\n═══════════════════════════════════════════');
        console.log('✅ Prueba completada');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

testPetsEndpoint();
