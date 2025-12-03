// Script para agregar la columna IsApproved a la tabla Pets
const { executeQuery, connectDB } = require('../config/database');

async function addIsApprovedColumn() {
    try {
        console.log('🔄 Conectando a la base de datos...');
        await connectDB();
        
        console.log('📝 Verificando si la columna ya existe...');
        
        // Verificar si la columna existe
        const checkQuery = `
            SELECT COUNT(*) as count
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Pets' AND COLUMN_NAME = 'IsApproved'
        `;
        
        const result = await executeQuery(checkQuery);
        
        if (result.recordset[0].count === 0) {
            console.log('📝 Agregando columna IsApproved...');
            
            // Agregar columna
            await executeQuery(`ALTER TABLE Pets ADD IsApproved BIT NOT NULL DEFAULT 0`);
            console.log('✅ Columna IsApproved agregada');
            
            // Aprobar mascotas existentes
            await executeQuery(`UPDATE Pets SET IsApproved = 1 WHERE IsActive = 1`);
            console.log('✅ Mascotas existentes marcadas como aprobadas');
        } else {
            console.log('⚠️  La columna IsApproved ya existe');
        }
        
        console.log('');
        console.log('✅ Migración completada exitosamente!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addIsApprovedColumn();
