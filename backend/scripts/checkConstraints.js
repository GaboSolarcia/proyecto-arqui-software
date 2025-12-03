const {executeQuery} = require('../config/database');

async function checkConstraints() {
    try {
        console.log('=== Verificando constraints en Specialists ===\n');
        
        // Buscar todas las foreign keys que referencian a Specialists
        const query = `
            SELECT 
                fk.name AS ForeignKeyName,
                OBJECT_NAME(fk.parent_object_id) AS TableName,
                COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS ColumnName,
                OBJECT_NAME(fk.referenced_object_id) AS ReferencedTable,
                COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS ReferencedColumn
            FROM sys.foreign_keys AS fk
            INNER JOIN sys.foreign_key_columns AS fkc 
                ON fk.object_id = fkc.constraint_object_id
            WHERE OBJECT_NAME(fk.referenced_object_id) = 'Specialists'
            ORDER BY TableName
        `;
        
        const result = await executeQuery(query);
        
        if (result.recordset.length === 0) {
            console.log('No se encontraron foreign keys que referencien a Specialists');
        } else {
            console.log('Foreign Keys que referencian a Specialists:\n');
            result.recordset.forEach(fk => {
                console.log(`Tabla: ${fk.TableName}`);
                console.log(`  Columna: ${fk.ColumnName}`);
                console.log(`  FK Name: ${fk.ForeignKeyName}`);
                console.log(`  Referencia: ${fk.ReferencedTable}.${fk.ReferencedColumn}`);
                console.log('');
            });
        }
        
        // Verificar si hay registros que usan SpecialistId
        console.log('\n=== Verificando uso de Specialists ===\n');
        
        const usageQueries = [
            { table: 'Rooms', column: 'CleanedBy' },
            { table: 'RoomMaintenanceHistory', column: 'PerformedBy' }
        ];
        
        for (const check of usageQueries) {
            try {
                const countQuery = `SELECT COUNT(*) as Count FROM ${check.table} WHERE ${check.column} IS NOT NULL`;
                const countResult = await executeQuery(countQuery);
                console.log(`${check.table}.${check.column}: ${countResult.recordset[0].Count} registros`);
            } catch (err) {
                console.log(`${check.table}.${check.column}: Error - ${err.message}`);
            }
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    process.exit();
}

checkConstraints();
