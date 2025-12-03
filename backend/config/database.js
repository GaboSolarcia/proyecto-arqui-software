const sql = require('mssql');
require('dotenv').config();

// ⚙️ Configuración de conexión a SQL Server
const config = {
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    database: process.env.DB_NAME || 'CuidadosLosPatitos',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        trustedConnection: true,
        instanceName: process.env.DB_INSTANCE || ''
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Si hay usuario y contraseña configurados, usar SQL Authentication
if (process.env.DB_USER && process.env.DB_PASSWORD) {
    config.user = process.env.DB_USER;
    config.password = process.env.DB_PASSWORD;
    delete config.options.trustedConnection;
    config.authentication = {
        type: 'default'
    };
}

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