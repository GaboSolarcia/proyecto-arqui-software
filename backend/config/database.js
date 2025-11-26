const sql = require('mssql');
require('dotenv').config();

// Configuración de la base de datos
// Soporta dos modos:
// 1. Windows Authentication (DB_USE_WINDOWS_AUTH=true)
// 2. SQL Server Authentication (usuario y contraseña)
const config = {
    server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
    database: process.env.DB_NAME || 'CuidadosLosPatitos',
    options: {
        encrypt: false, // Para conexiones locales
        trustServerCertificate: true,
        enableArithAbort: true,
        instanceName: 'SQLEXPRESS' // Nombre de la instancia
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    connectionTimeout: 15000,
    requestTimeout: 15000
};

// Agregar autenticación según el modo configurado
if (process.env.DB_USE_WINDOWS_AUTH === 'true') {
    // Autenticación de Windows (Integrated Security)
    config.options.trustedConnection = true;
    config.authentication = {
        type: 'ntlm',
        options: {
            domain: process.env.DB_DOMAIN || '',
            userName: process.env.DB_USER || '',
            password: process.env.DB_PASSWORD || ''
        }
    };
    console.log('📝 Configuración: Usando Windows Authentication');
} else {
    // Autenticación SQL Server (usuario y contraseña)
    config.user = process.env.DB_USER || 'sa';
    config.password = process.env.DB_PASSWORD || 'your_password';
    console.log('📝 Configuración: Usando SQL Server Authentication');
}

let pool;

const connectDB = async () => {
    try {
        if (!pool) {
            pool = await sql.connect(config);
            console.log('✅ Conectado a SQL Server Express');
        }
        return pool;
    } catch (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        throw err;
    }
};

const getPool = () => {
    if (!pool) {
        throw new Error('La base de datos no está conectada. Llama a connectDB() primero.');
    }
    return pool;
};

const closeDB = async () => {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('🔌 Conexión a la base de datos cerrada');
        }
    } catch (err) {
        console.error('❌ Error cerrando la conexión:', err);
    }
};

// Función para ejecutar consultas de manera segura
const executeQuery = async (query, params = {}) => {
    try {
        const poolConnection = await connectDB();
        const request = poolConnection.request();
        
        // Agregar parámetros si existen
        Object.keys(params).forEach(key => {
            request.input(key, params[key]);
        });
        
        const result = await request.query(query);
        return result;
    } catch (err) {
        console.error('❌ Error ejecutando consulta:', err);
        throw err;
    }
};

module.exports = {
    connectDB,
    getPool,
    closeDB,
    executeQuery,
    sql
};