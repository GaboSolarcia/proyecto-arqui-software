const sql = require('mssql');
require('dotenv').config();

// ⚙️ Configuración de conexión a SQL Server
const config = {
    server: process.env.DB_SERVER || 'localhost',
    database: process.env.DB_NAME || 'CuidadosLosPatitos',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'TuPasswordSegura123!',
    options: {
        encrypt: false,                 // para conexiones locales
        trustServerCertificate: true,
        instanceName: process.env.DB_INSTANCE || 'SQL2022'
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool;

// Conecta (una sola vez) y reutiliza el pool
const connectDB = async () => {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log('✅ Conectado a SQL Server');
        }
        return pool;
    } catch (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        throw err;
    }
};

// Ejecutar consultas con parámetros opcionales
const executeQuery = async (query, params = {}) => {
    const pool = await connectDB();
    const request = pool.request();

    // params es un objeto { nombreParametro: valor }
    Object.entries(params).forEach(([name, value]) => {
        request.input(name, value);
    });

    const result = await request.query(query);
    return result;
};

module.exports = {
    sql,
    connectDB,
    executeQuery
};