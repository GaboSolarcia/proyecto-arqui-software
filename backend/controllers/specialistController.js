const Specialist = require('../models/Specialist');
const { validationResult } = require('express-validator');

class SpecialistController {
    // Obtener todos los especialistas
    static async getAllSpecialists(req, res) {
        try {
            const specialists = await Specialist.findAll();
            res.status(200).json({
                success: true,
                data: specialists,
                count: specialists.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo especialistas',
                error: error.message
            });
        }
    }

    // Obtener especialista por ID
    static async getSpecialistById(req, res) {
        try {
            const { id } = req.params;
            const specialist = await Specialist.findById(id);
            
            if (!specialist) {
                return res.status(404).json({
                    success: false,
                    message: 'Especialista no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: specialist
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo especialista',
                error: error.message
            });
        }
    }

    // Crear nuevo especialista
    static async createSpecialist(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const specialistData = req.body;
            
            // Verificar si ya existe un especialista con esa cédula
            const existingSpecialist = await Specialist.findByCedula(specialistData.cedula);
            if (existingSpecialist) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un especialista con esa cédula'
                });
            }

            const newSpecialist = await Specialist.create(specialistData);

            res.status(201).json({
                success: true,
                message: 'Especialista registrado exitosamente',
                data: newSpecialist
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creando especialista',
                error: error.message
            });
        }
    }

    // Actualizar especialista
    static async updateSpecialist(req, res) {
        try {
            const { id } = req.params;
            const specialistData = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const updatedSpecialist = await Specialist.update(id, specialistData);
            
            if (!updatedSpecialist) {
                return res.status(404).json({
                    success: false,
                    message: 'Especialista no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Especialista actualizado exitosamente',
                data: updatedSpecialist
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error actualizando especialista',
                error: error.message
            });
        }
    }

    // Eliminar especialista
    static async deleteSpecialist(req, res) {
        try {
            const { id } = req.params;
            await Specialist.delete(id);

            res.status(200).json({
                success: true,
                message: 'Especialista eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error eliminando especialista',
                error: error.message
            });
        }
    }

    // Obtener especialistas por horario
    static async getSpecialistsByShift(req, res) {
        try {
            const { shift } = req.params;
            const specialists = await Specialist.findByShift(shift);

            res.status(200).json({
                success: true,
                data: specialists,
                count: specialists.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo especialistas por horario',
                error: error.message
            });
        }
    }

    // Obtener especialistas activos
    static async getActiveSpecialists(req, res) {
        try {
            const specialists = await Specialist.findActive();

            res.status(200).json({
                success: true,
                data: specialists,
                count: specialists.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo especialistas activos',
                error: error.message
            });
        }
    }
}

module.exports = SpecialistController;
