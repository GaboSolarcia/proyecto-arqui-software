const {executeQuery} = require('../config/database');

async function listTables() {
    try {
        console.log('=== Tablas en la base de datos ===\n');
        
        const result = await executeQuery(
            "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME"
        );
        
        result.recordset.forEach(t => {
            console.log(t.TABLE_NAME);
        });
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    process.exit();
}

listTables();
