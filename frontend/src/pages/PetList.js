import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';

const PetList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialCare, setFilterSpecialCare] = useState(false);

  // Datos de ejemplo - en producción vendrían de la API
  const [pets] = useState([
    {
      id: 1,
      name: 'Max',
      owner_name: 'Juan Pérez',
      owner_cedula: '1-1234-5678',
      admission_date: '2024-10-20',
      veterinarian_name: 'Dr. María González',
      allergies: 'Alérgico al pollo',
      special_diet: 'Dieta baja en grasas',
      hasSpecialCare: true
    },
    {
      id: 2,
      name: 'Luna',
      owner_name: 'Ana López',
      owner_cedula: '2-2345-6789',
      admission_date: '2024-10-25',
      veterinarian_name: 'Dr. Carlos Ramírez',
      bandage_changes: 'Cambio cada 12 horas',
      hasSpecialCare: true
    },
    {
      id: 3,
      name: 'Rocky',
      owner_name: 'Carlos Vargas',
      owner_cedula: '1-3456-7890',
      admission_date: '2024-10-15',
      veterinarian_name: 'Dr. María González',
      hasSpecialCare: false
    }
  ]);

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.owner_cedula.includes(searchTerm);
    
    const matchesFilter = !filterSpecialCare || pet.hasSpecialCare;
    
    return matchesSearch && matchesFilter;
  });

  const getSpecialCareInfo = (pet) => {
    const care = [];
    if (pet.allergies) care.push('Alergias');
    if (pet.bandage_changes) care.push('Vendajes');
    if (pet.special_diet) care.push('Dieta');
    return care;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center">
          <Heart className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Mascotas</h1>
        </div>
        <Link to="/pets/register" className="btn-primary flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Registrar Mascota
        </Link>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar por nombre, dueño o cédula..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={filterSpecialCare}
                onChange={(e) => setFilterSpecialCare(e.target.checked)}
              />
              <span className="text-sm text-gray-700">Solo cuidados especiales</span>
            </label>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{pets.length}</div>
          <div className="text-gray-600">Total Mascotas</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {pets.filter(p => p.hasSpecialCare).length}
          </div>
          <div className="text-gray-600">Cuidados Especiales</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {new Set(pets.map(p => p.owner_cedula)).size}
          </div>
          <div className="text-gray-600">Dueños Únicos</div>
        </div>
      </div>

      {/* Lista de mascotas */}
      <div className="card">
        {filteredPets.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Mascota</th>
                  <th>Dueño</th>
                  <th>Cédula</th>
                  <th>Veterinario</th>
                  <th>Cuidados Especiales</th>
                  <th>Fecha Ingreso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPets.map((pet) => (
                  <tr key={pet.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Heart className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800">{pet.name}</span>
                      </div>
                    </td>
                    <td className="text-gray-700">{pet.owner_name}</td>
                    <td className="font-mono text-sm text-gray-600">{pet.owner_cedula}</td>
                    <td className="text-gray-700">{pet.veterinarian_name}</td>
                    <td>
                      {pet.hasSpecialCare ? (
                        <div className="flex flex-wrap gap-1">
                          {getSpecialCareInfo(pet).map((care, index) => (
                            <span key={index} className="badge badge-warning text-xs">
                              {care}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Ninguno</span>
                      )}
                    </td>
                    <td className="text-gray-600">
                      {new Date(pet.admission_date).toLocaleDateString('es-ES')}
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800" title="Ver detalles">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-green-600 hover:text-green-800" title="Editar">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800" title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No se encontraron mascotas</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterSpecialCare 
                ? 'Intenta modificar los filtros de búsqueda.' 
                : 'Comienza registrando tu primera mascota.'
              }
            </p>
            {!searchTerm && !filterSpecialCare && (
              <Link to="/pets/register" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Primera Mascota
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PetList;