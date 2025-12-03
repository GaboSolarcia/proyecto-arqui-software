const express = require('express');
const router = express.Router();
const CameraController = require('../controllers/cameraController');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener todas las mascotas del usuario que tienen acceso a cámara
router.get('/my-pets', CameraController.getUserPetsWithCamera);

// Verificar acceso a cámara para una mascota específica
router.get('/access/:petId', CameraController.checkCameraAccess);

// Stream de cámara para una habitación específica
router.get('/stream/:roomId', CameraController.streamCamera);

module.exports = router;
