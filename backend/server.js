const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const veterinarianRoutes = require('./routes/veterinarianRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const specialistRoutes = require('./routes/specialistRoutes');
const roomRoutes = require('./routes/roomRoutes');

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Seguridad
app.use(cors()); // Permitir solicitudes cross-origin
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL encoded

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/veterinarians', veterinarianRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/specialists', specialistRoutes);
app.use('/api/rooms', roomRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Servidor Cuidados Los Patitos funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Ruta para la página principal
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a la API de Cuidados Los Patitos S.A.',
        version: '1.0.0',
        endpoints: [
            '/api/health',
            '/api/pets',
            '/api/owners',
            '/api/veterinarians',
            '/api/reservations',
            '/api/specialists',
            '/api/rooms'
        ]
    });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🏥 API Health Check: http://localhost:${PORT}/api/health`);
});

module.exports = app;