import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus, Search, Filter, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const PetList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialCare, setFilterSpecialCare] = useState(false);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/pets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setPets(data.data || []);
      } else {
        setError(data.message || 'Error al cargar mascotas');
      }
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePet = async (petId, petName) => {
    if (!window.confirm(`¿Estás seguro de aprobar a ${petName}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/pets/${petId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Mascota ${petName} aprobada exitosamente`);
        fetchPets(); // Recargar la lista
      } else {
        toast.error(data.message || 'Error al aprobar la mascota');
      }
    } catch (err) {
      console.error('Error approving pet:', err);
      toast.error('Error de conexión con el servidor');
    }
  };

  const handleDeletePet = async (petId, petName) => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${petName}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3001/api/pets/${petId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Mascota ${petName} eliminada exitosamente`);
        fetchPets(); // Recargar la lista
      } else {
        toast.error(data.message || 'Error al eliminar la mascota');
      }
    } catch (err) {
      console.error('Error deleting pet:', err);
      toast.error('Error de conexión con el servidor');
    }
  };

  const filteredPets = pets.filter(pet => {
    const petName = pet.Name || pet.name || '';
    const ownerName = pet.OwnerName || pet.owner_name || '';
    const ownerCedula = pet.OwnerCedula || pet.owner_cedula || '';
    
    const matchesSearch = petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ownerCedula.includes(searchTerm);
    
    const hasSpecialCare = pet.HasSpecialCare || pet.hasSpecialCare || 
                          pet.Allergies || pet.BandageChanges || pet.SpecialDiet;
    
    const matchesFilter = !filterSpecialCare || hasSpecialCare;
    
    return matchesSearch && matchesFilter;
  });

  const getSpecialCareInfo = (pet) => {
    const care = [];
    if (pet.Allergies || pet.allergies) care.push('Alergias');
    if (pet.BandageChanges || pet.bandage_changes) care.push('Vendajes');
    if (pet.SpecialDiet || pet.special_diet) care.push('Dieta');
    return care;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mascotas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Error al cargar mascotas</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchPets} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center">
          <Heart className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Mascotas</h1>
        </div>
        {role !== 'Administrador' && (
          <Link to="/pets/register" className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Mascota
          </Link>
        )}
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
            {pets.filter(p => p.HasSpecialCare || p.hasSpecialCare || p.Allergies || p.BandageChanges || p.SpecialDiet).length}
          </div>
          <div className="text-gray-600">Cuidados Especiales</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {pets.filter(p => !p.IsApproved && p.IsApproved !== undefined).length}
          </div>
          <div className="text-gray-600">Pendientes Aprobación</div>
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
                  <th>Especie/Raza</th>
                  <th>Dueño</th>
                  <th>Cédula</th>
                  <th>Estado</th>
                  <th>Cuidados Especiales</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPets.map((pet) => {
                  const petId = pet.PetId || pet.id;
                  const petName = pet.Name || pet.name;
                  const species = pet.SpeciesName || pet.species_name || 'N/A';
                  const breed = pet.BreedName || pet.breed_name || '';
                  const ownerName = pet.OwnerName || pet.owner_name;
                  const ownerCedula = pet.OwnerCedula || pet.owner_cedula;
                  const isApproved = pet.IsApproved !== undefined ? pet.IsApproved : true;
                  const specialCareInfo = getSpecialCareInfo(pet);

                  return (
                    <tr key={petId}>
                      <td>
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Heart className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-800">{petName}</span>
                        </div>
                      </td>
                      <td className="text-gray-700">
                        <div className="text-sm">
                          <div className="font-medium">{species}</div>
                          {breed && <div className="text-gray-500 text-xs">{breed}</div>}
                        </div>
                      </td>
                      <td className="text-gray-700">{ownerName}</td>
                      <td className="font-mono text-sm text-gray-600">{ownerCedula}</td>
                      <td>
                        {isApproved ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Aprobada
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Pendiente
                          </span>
                        )}
                      </td>
                      <td>
                        {specialCareInfo.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {specialCareInfo.map((care, index) => (
                              <span key={index} className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                {care}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Ninguno</span>
                        )}
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          {!isApproved && (role === 'Administrador' || role === 'Recepcionista') && (
                            <button 
                              onClick={() => handleApprovePet(petId, petName)}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                              title="Aprobar mascota"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aprobar
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeletePet(petId, petName)}
                            className="p-1 text-red-600 hover:text-red-800" 
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
                : role === 'Administrador' 
                  ? 'Los clientes deben registrar sus propias mascotas.' 
                  : 'Comienza registrando tu primera mascota.'
              }
            </p>
            {!searchTerm && !filterSpecialCare && role !== 'Administrador' && (
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