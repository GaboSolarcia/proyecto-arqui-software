const Specialist = require('../models/Specialist');

async function testDeleteSpecialist() {
    try {
        console.log('=== Test: Eliminar Especialista ===\n');
        
        // Primero obtener la lista de especialistas
        console.log('Obteniendo lista de especialistas...');
        const specialists = await Specialist.findAll();
        
        if (specialists.length === 0) {
            console.log('No hay especialistas para eliminar');
            return;
        }
        
        console.log(`Total de especialistas: ${specialists.length}\n`);
        
        // Mostrar los primeros 3 especialistas
        specialists.slice(0, 3).forEach(s => {
            console.log(`ID: ${s.SpecialistId}, Nombre: ${s.EmployeeName}, Cédula: ${s.Cedula}`);
        });
        
        // Intentar eliminar el último especialista (asumiendo que es el menos usado)
        const specialistToDelete = specialists[specialists.length - 1];
        console.log(`\nIntentando eliminar especialista ID: ${specialistToDelete.SpecialistId}`);
        console.log(`Nombre: ${specialistToDelete.EmployeeName}`);
        
        const result = await Specialist.delete(specialistToDelete.SpecialistId);
        
        if (result) {
            console.log('\n✓ Especialista eliminado exitosamente');
            
            // Verificar que ya no existe
            const verify = await Specialist.findById(specialistToDelete.SpecialistId);
            if (!verify) {
                console.log('✓ Verificado: El especialista ya no existe en la base de datos');
            }
        }
        
    } catch (error) {
        console.error('\n✗ Error en test de eliminación:');
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
    }
    
    process.exit();
}

testDeleteSpecialist();
