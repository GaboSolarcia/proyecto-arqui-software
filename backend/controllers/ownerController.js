const Owner = require('../models/Owner');
const { validationResult } = require('express-validator');

class OwnerController {
    // Obtener todos los dueños
    static async getAllOwners(req, res) {
        try {
            const owners = await Owner.findAll();
            res.status(200).json({
                success: true,
                data: owners,
                count: owners.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo dueños',
                error: error.message
            });
        }
    }

    // Obtener dueño por ID
    static async getOwnerById(req, res) {
        try {
            const { id } = req.params;
            const owner = await Owner.findById(id);
            
            if (!owner) {
                return res.status(404).json({
                    success: false,
                    message: 'Dueño no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: owner
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo dueño',
                error: error.message
            });
        }
    }

    // Crear nuevo dueño
    static async createOwner(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const ownerData = req.body;
            
            // Verificar si ya existe un dueño con esa cédula
            const existingOwner = await Owner.findByCedula(ownerData.cedula);
            if (existingOwner) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un dueño registrado con esa cédula'
                });
            }

            const newOwner = await Owner.create(ownerData);

            res.status(201).json({
                success: true,
                message: 'Dueño registrado exitosamente',
                data: newOwner
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creando dueño',
                error: error.message
            });
        }
    }

    // Actualizar dueño
    static async updateOwner(req, res) {
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
            const ownerData = req.body;
            
            // Si se está actualizando la cédula, verificar que no exista en otro dueño
            if (ownerData.cedula) {
                const existingOwner = await Owner.findByCedula(ownerData.cedula);
                if (existingOwner && existingOwner.id != id) {
                    return res.status(409).json({
                        success: false,
                        message: 'Ya existe otro dueño con esa cédula'
                    });
                }
            }
            
            const updatedOwner = await Owner.update(id, ownerData);
            
            if (!updatedOwner) {
                return res.status(404).json({
                    success: false,
                    message: 'Dueño no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Dueño actualizado exitosamente',
                data: updatedOwner
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error actualizando dueño',
                error: error.message
            });
        }
    }

    // Eliminar dueño
    static async deleteOwner(req, res) {
        try {
            const { id } = req.params;
            const deleted = await Owner.delete(id);
            
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Dueño no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Dueño eliminado exitosamente'
            });
        } catch (error) {
            if (error.message.includes('mascotas registradas')) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Error eliminando dueño',
                error: error.message
            });
        }
    }

    // Buscar dueño por cédula
    static async getOwnerByCedula(req, res) {
        try {
            const { cedula } = req.params;
            const owner = await Owner.findByCedula(cedula);
            
            if (!owner) {
                return res.status(404).json({
                    success: false,
                    message: 'Dueño no encontrado con esa cédula'
                });
            }

            res.status(200).json({
                success: true,
                data: owner
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error buscando dueño por cédula',
                error: error.message
            });
        }
    }

    // Buscar dueños por nombre
    static async searchOwnersByName(req, res) {
        try {
            const { name } = req.query;
            
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Parámetro de nombre requerido'
                });
            }

            const owners = await Owner.findByName(name);

            res.status(200).json({
                success: true,
                data: owners,
                count: owners.length,
                query: name
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error buscando dueños por nombre',
                error: error.message
            });
        }
    }

    // Obtener mascotas de un dueño
    static async getOwnerPets(req, res) {
        try {
            const { id } = req.params;
            
            const owner = await Owner.findById(id);
            if (!owner) {
                return res.status(404).json({
                    success: false,
                    message: 'Dueño no encontrado'
                });
            }

            const pets = await Owner.getPets(owner.cedula);

            res.status(200).json({
                success: true,
                data: pets,
                count: pets.length,
                owner: {
                    id: owner.id,
                    name: owner.name,
                    cedula: owner.cedula
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo mascotas del dueño',
                error: error.message
            });
        }
    }

    // Obtener mascotas por cédula del dueño
    static async getPetsByCedula(req, res) {
        try {
            const { cedula } = req.params;
            
            const owner = await Owner.findByCedula(cedula);
            if (!owner) {
                return res.status(404).json({
                    success: false,
                    message: 'Dueño no encontrado con esa cédula'
                });
            }

            const pets = await Owner.getPets(cedula);

            res.status(200).json({
                success: true,
                data: pets,
                count: pets.length,
                owner: {
                    id: owner.id,
                    name: owner.name,
                    cedula: owner.cedula
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo mascotas por cédula',
                error: error.message
            });
        }
    }

    // Obtener información completa del dueño con sus mascotas
    static async getOwnerWithPets(req, res) {
        try {
            const { id } = req.params;
            const ownerWithPets = await Owner.getOwnerWithPets(id);
            
            if (!ownerWithPets) {
                return res.status(404).json({
                    success: false,
                    message: 'Dueño no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                data: ownerWithPets
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo información completa del dueño',
                error: error.message
            });
        }
    }

    // Verificar si existe un dueño
    static async checkOwnerExists(req, res) {
        try {
            const { cedula } = req.params;
            const exists = await Owner.exists(cedula);

            res.status(200).json({
                success: true,
                exists: exists,
                cedula: cedula
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error verificando existencia del dueño',
                error: error.message
            });
        }
    }

    // Validar y crear dueño si no existe (útil para registro rápido desde mascotas)
    static async createOwnerIfNotExists(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Datos de entrada inválidos',
                    errors: errors.array()
                });
            }

            const { cedula, name, phone, email } = req.body;
            
            // Verificar si ya existe
            const existingOwner = await Owner.findByCedula(cedula);
            if (existingOwner) {
                return res.status(200).json({
                    success: true,
                    message: 'Dueño ya existe',
                    data: existingOwner,
                    created: false
                });
            }

            // Crear nuevo dueño con datos mínimos
            const newOwner = await Owner.create({
                name,
                cedula,
                phone: phone || null,
                email: email || null
            });

            res.status(201).json({
                success: true,
                message: 'Dueño creado exitosamente',
                data: newOwner,
                created: true
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creando dueño',
                error: error.message
            });
        }
    }

    // Obtener estadísticas de dueños
    static async getOwnersStats(req, res) {
        try {
            const owners = await Owner.findAll();
            
            const stats = {
                total_owners: owners.length,
                owners_with_pets: owners.filter(owner => owner.pet_count > 0).length,
                owners_without_pets: owners.filter(owner => owner.pet_count === 0).length,
                total_pets_registered: owners.reduce((sum, owner) => sum + (owner.pet_count || 0), 0),
                average_pets_per_owner: owners.length > 0 ? 
                    (owners.reduce((sum, owner) => sum + (owner.pet_count || 0), 0) / owners.length).toFixed(2) : 0,
                owners_with_email: owners.filter(owner => owner.email).length,
                owners_with_emergency_contact: owners.filter(owner => owner.emergency_contact).length
            };

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error obteniendo estadísticas de dueños',
                error: error.message
            });
        }
    }
}

module.exports = OwnerController;