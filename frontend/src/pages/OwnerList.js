import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Mail, Phone, Heart, User, AlertCircle } from 'lucide-react';

const OwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/owners', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setOwners(data.data || []);
      } else {
        setError(data.message || 'Error al cargar dueños');
      }
    } catch (err) {
      console.error('Error fetching owners:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const filteredOwners = owners.filter(owner => {
    const name = owner.Name || '';
    const cedula = owner.Cedula || '';
    const email = owner.Email || '';
    
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cedula.includes(searchTerm) ||
           email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-1">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <UserCheck className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Dueños</h1>
        </div>
        <div className="text-sm text-gray-600">
          Total: <span className="font-bold text-blue-600">{filteredOwners.length}</span> dueño{filteredOwners.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Owners Grid */}
      {filteredOwners.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {searchTerm ? 'No se encontraron dueños' : 'No hay dueños registrados'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los dueños se crean automáticamente al registrar mascotas'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOwners.map((owner) => (
            <div
              key={owner.OwnerId}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              {/* Owner Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-3 mr-3">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {owner.Name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Cédula: {owner.Cedula}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {owner.Email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="truncate">{owner.Email}</span>
                  </div>
                )}
                {owner.Phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{owner.Phone}</span>
                  </div>
                )}
              </div>

              {/* Pets Count */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Heart className="w-4 h-4 mr-2 text-pink-500" />
                    <span>
                      {owner.PetCount || 0} mascota{owner.PetCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {owner.IsActive ? (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Activo
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      Inactivo
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerList;