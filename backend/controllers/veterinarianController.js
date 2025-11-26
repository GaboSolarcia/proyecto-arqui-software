const Veterinarian = require('../models/Veterinarian');
const { validationResult } = require('express-validator');

class VeterinarianController {
    // Obtener todos los veterinarios
    static async getAllVeterinarians(req, res) {
        try {
            const { active_only } = req.query;
            const activeOnly = active_only === 'true';
            
            const veterinarians = await Veterinarian.findAll(activeOnly);
            
            res.status(200).json({
                success: true,
                data: veterinarians,
                count: veterinarians.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo veterinarios',
                error: error.message
            });
        }
    }

    // Obtener veterinario por ID
    static async getVeterinarianById(req, res) {
        try {
            const { id } = req.params;
            const veterinarian = await Veterinarian.findById(id);
            
            if (!veterinarian) {
                return res.status(404).json({
                    success: false,
                    message: 'Veterinario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: veterinarian
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo veterinario',
                error: error.message
            });
        }
    }

    // Crear nuevo veterinario
    static async createVeterinarian(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const vetData = req.body;
            
            // Verificar si ya existe un veterinario con ese número de licencia
            const existingVet = await Veterinarian.findByLicenseNumber(vetData.license_number);
            if (existingVet) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un veterinario con ese número de licencia'
                });
            }

            const newVeterinarian = await Veterinarian.create(vetData);

            res.status(201).json({
                success: true,
                message: 'Veterinario registrado exitosamente',
                data: newVeterinarian
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creando veterinario',
                error: error.message
            });
        }
    }

    // Actualizar veterinario
    static async updateVeterinarian(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const vetData = req.body;
            
            // Si se está actualizando el número de licencia, verificar que no exista en otro veterinario
            if (vetData.license_number) {
                const existingVet = await Veterinarian.findByLicenseNumber(vetData.license_number);
                if (existingVet && existingVet.id != id) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe otro veterinario con ese número de licencia'
                    });
                }
            }
            
            const updatedVeterinarian = await Veterinarian.update(id, vetData);
            
            if (!updatedVeterinarian) {
                return res.status(404).json({
                    success: false,
                    message: 'Veterinario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Veterinario actualizado exitosamente',
                data: updatedVeterinarian
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error actualizando veterinario',
                error: error.message
            });
        }
    }

    // Desactivar veterinario (eliminación lógica)
    static async deleteVeterinarian(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Veterinarian.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Veterinario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Veterinario desactivado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error desactivando veterinario',
                error: error.message
            });
        }
    }

    // Obtener mascotas asignadas a un veterinario
    static async getVeterinarianPets(req, res) {
        try {
            const { id } = req.params;
            
            // Verificar que el veterinario existe
            const veterinarian = await Veterinarian.findById(id);
            if (!veterinarian) {
                return res.status(404).json({
                    success: false,
                    message: 'Veterinario no encontrado'
                });
            }

            const pets = await Veterinarian.getPetsAssigned(id);

            res.status(200).json({
                success: true,
                data: pets,
                count: pets.length,
                veterinarian: veterinarian.name
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo mascotas asignadas',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de un veterinario
    static async getVeterinarianStats(req, res) {
        try {
            const { id } = req.params;
            
            // Verificar que el veterinario existe
            const veterinarian = await Veterinarian.findById(id);
            if (!veterinarian) {
                return res.status(404).json({
                    success: false,
                    message: 'Veterinario no encontrado'
                });
            }

            const stats = await Veterinarian.getStats(id);

            res.status(200).json({
                success: true,
                data: {
                    veterinarian: {
                        id: veterinarian.id,
                        name: veterinarian.name,
                        specialty: veterinarian.specialty
                    },
                    statistics: stats
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo estadísticas del veterinario',
                error: error.message
            });
        }
    }

    // Buscar veterinario por número de licencia
    static async getVeterinarianByLicense(req, res) {
        try {
            const { license_number } = req.params;
            const veterinarian = await Veterinarian.findByLicenseNumber(license_number);
            
            if (!veterinarian) {
                return res.status(404).json({
                    success: false,
                    message: 'Veterinario no encontrado con ese número de licencia'
                });
            }

            res.status(200).json({
                success: true,
                data: veterinarian
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error buscando veterinario por licencia',
                error: error.message
            });
        }
    }

    // Activar/Desactivar veterinario
    static async toggleVeterinarianStatus(req, res) {
        try {
            const { id } = req.params;
            
            const veterinarian = await Veterinarian.findById(id);
            if (!veterinarian) {
                return res.status(404).json({
                    success: false,
                    message: 'Veterinario no encontrado'
                });
            }

            const newStatus = !veterinarian.is_active;
            const updatedVeterinarian = await Veterinarian.update(id, { 
                ...veterinarian, 
                is_active: newStatus 
            });

            res.status(200).json({
                success: true,
                message: `Veterinario ${newStatus ? 'activado' : 'desactivado'} exitosamente`,
                data: updatedVeterinarian
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error cambiando estado del veterinario',
                error: error.message
            });
        }
    }

    // Obtener resumen general de veterinarios
    static async getVeterinariansOverview(req, res) {
        try {
            const allVeterinarians = await Veterinarian.findAll();
            const activeVeterinarians = await Veterinarian.findAll(true);

            const overview = {
                total_veterinarians: allVeterinarians.length,
                active_veterinarians: activeVeterinarians.length,
                inactive_veterinarians: allVeterinarians.length - activeVeterinarians.length,
                specialties: [...new Set(allVeterinarians.map(vet => vet.specialty))],
                veterinarians_by_specialty: {}
            };

            // Contar veterinarios por especialidad
            overview.specialties.forEach(specialty => {
                overview.veterinarians_by_specialty[specialty] = allVeterinarians.filter(
                    vet => vet.specialty === specialty && vet.is_active
                ).length;
            });

            res.status(200).json({
                success: true,
                data: overview
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo resumen de veterinarios',
                error: error.message
            });
        }
    }
}

module.exports = VeterinarianController;