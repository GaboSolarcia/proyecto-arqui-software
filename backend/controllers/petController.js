const Pet = require('../models/Pet');
const { validationResult } = require('express-validator');

class PetController {
    // Obtener todas las mascotas
    static async getAllPets(req, res) {
        try {
            const userRole = req.user.roleName; // Viene del middleware de autenticación
            const userId = req.user.userId;
            
            let pets;
            
            // Si es Usuario Normal (cliente), solo ver sus propias mascotas
            if (userRole === 'Usuario Normal') {
                pets = await Pet.findByUserId(userId);
            } else {
                // Si es Admin, Veterinario o Recepcionista, ver todas
                pets = await Pet.findAll();
            }
            
            res.status(200).json({
                success: true,
                data: pets,
                count: pets.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo mascotas',
                error: error.message
            });
        }
    }

    // Obtener mascota por ID
    static async getPetById(req, res) {
        try {
            const { id } = req.params;
            const userRole = req.user.roleName;
            const userId = req.user.userId;
            
            const pet = await Pet.findById(id);
            
            if (!pet) {
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            // Si es Usuario Normal, verificar que sea su mascota
            if (userRole === 'Usuario Normal') {
                const ownerInfo = await Pet.getOwnerByPetId(id);
                if (!ownerInfo || ownerInfo.UserId !== userId) {
                    return res.status(403).json({
                        success: false,
                        message: 'No tienes permiso para ver esta mascota'
                    });
                }
            }

            res.status(200).json({
                success: true,
                data: pet
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo mascota',
                error: error.message
            });
        }
    }

    // Crear nueva mascota
    static async createPet(req, res) {
        try {
            // Validar errores de entrada
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const petData = req.body;
            const userId = req.user.userId;
            const userRole = req.user.roleName;

            // Si es Usuario Normal, obtener su OwnerId automáticamente
            if (userRole === 'Usuario Normal') {
                const ownerInfo = await Pet.getOwnerByUserId(userId);
                if (!ownerInfo) {
                    return res.status(404).json({
                        success: false,
                        message: 'No se encontró registro de dueño asociado a este usuario. Contacte al administrador.'
                    });
                }
                petData.ownerId = ownerInfo.OwnerId;
            }

            const newPet = await Pet.create(petData);

            res.status(201).json({
                success: true,
                message: 'Mascota registrada exitosamente. Pendiente de aprobación.',
                data: newPet
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creando mascota',
                error: error.message
            });
        }
    }

    // Aprobar mascota
    static async approvePet(req, res) {
        try {
            const { id } = req.params;
            const userRole = req.user.roleName;

            // Solo Admin y Recepcionista pueden aprobar
            if (userRole !== 'Administrador' && userRole !== 'Recepcionista') {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para aprobar mascotas'
                });
            }

            const approved = await Pet.approve(id);
            
            if (!approved) {
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Mascota aprobada exitosamente',
                data: approved
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error aprobando mascota',
                error: error.message
            });
        }
    }

    // Actualizar mascota
    static async updatePet(req, res) {
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
            const petData = req.body;
            
            const updatedPet = await Pet.update(id, petData);
            
            if (!updatedPet) {
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Mascota actualizada exitosamente',
                data: updatedPet
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error actualizando mascota',
                error: error.message
            });
        }
    }

    // Eliminar mascota
    static async deletePet(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Pet.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Mascota no encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Mascota eliminada exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error eliminando mascota',
                error: error.message
            });
        }
    }

    // Buscar mascotas por cédula del dueño
    static async getPetsByOwnerCedula(req, res) {
        try {
            const { cedula } = req.params;
            const pets = await Pet.findByOwnerCedula(cedula);

            res.status(200).json({
                success: true,
                data: pets,
                count: pets.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo mascotas por cédula',
                error: error.message
            });
        }
    }

    // Obtener mascotas con cuidados especiales
    static async getPetsWithSpecialCare(req, res) {
        try {
            const pets = await Pet.findWithSpecialCare();

            res.status(200).json({
                success: true,
                data: pets,
                count: pets.length,
                message: 'Mascotas con cuidados especiales'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo mascotas con cuidados especiales',
                error: error.message
            });
        }
    }

    // Buscar mascotas (por nombre o dueño)
    static async searchPets(req, res) {
        try {
            const { query } = req.query;
            
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetro de búsqueda requerido'
                });
            }

            // Por ahora, buscaremos por nombre del dueño usando la funcionalidad existente
            // En una implementación más avanzada, se podría crear un método de búsqueda más complejo
            const allPets = await Pet.findAll();
            const filteredPets = allPets.filter(pet => 
                pet.name.toLowerCase().includes(query.toLowerCase()) ||
                pet.owner_name.toLowerCase().includes(query.toLowerCase())
            );

            res.status(200).json({
                success: true,
                data: filteredPets,
                count: filteredPets.length,
                query: query
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error en búsqueda de mascotas',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de mascotas
    static async getPetStats(req, res) {
        try {
            const allPets = await Pet.findAll();
            const petsWithSpecialCare = await Pet.findWithSpecialCare();
            
            const stats = {
                total_pets: allPets.length,
                pets_with_special_care: petsWithSpecialCare.length,
                pets_with_allergies: allPets.filter(pet => pet.allergies).length,
                pets_with_bandage_changes: allPets.filter(pet => pet.bandage_changes).length,
                pets_with_special_diet: allPets.filter(pet => pet.special_diet).length,
                recent_admissions: allPets.filter(pet => {
                    const admissionDate = new Date(pet.admission_date);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return admissionDate >= sevenDaysAgo;
                }).length
            };

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo estadísticas',
                error: error.message
            });
        }
    }
}

module.exports = PetController;