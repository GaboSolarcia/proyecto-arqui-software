import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Plus, Search, Filter, AlertCircle, Edit } from 'lucide-react';

const RoomList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setRooms(data.data || []);
      } else {
        setError(data.message || 'Error al cargar habitaciones');
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Disponible': 'bg-green-100 text-green-800 border-green-200',
      'Ocupada': 'bg-red-100 text-red-800 border-red-200',
      'En Limpieza': 'bg-blue-100 text-blue-800 border-blue-200',
      'En Mantenimiento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Fuera de Servicio': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type) => {
    if (type.includes('cámara')) return '📹';
    if (type.includes('especiales')) return '🏥';
    return '🛏️';
  };

  const filteredRooms = rooms.filter(room => {
    const roomNumber = room.RoomNumber || room.room_number || '';
    const roomType = room.RoomTypeName || room.room_type || '';
    const status = room.StatusName || room.status || '';
    
    const matchesSearch = roomNumber.includes(searchTerm) ||
                         roomType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesType = filterType === 'all' || roomType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const statistics = {
    total: rooms.length,
    disponibles: rooms.filter(r => (r.StatusName || r.status) === 'Disponible').length,
    ocupadas: rooms.filter(r => (r.StatusName || r.status) === 'Ocupada').length,
    enLimpieza: rooms.filter(r => (r.StatusName || r.status) === 'En Limpieza').length,
    mantenimiento: rooms.filter(r => (r.StatusName || r.status) === 'En Mantenimiento').length,
    fueraServicio: rooms.filter(r => (r.StatusName || r.status) === 'Fuera de Servicio').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando habitaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Error al cargar habitaciones</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchRooms} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Home className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Habitaciones</h1>
          </div>
          <Link to="/rooms/create" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Habitación
          </Link>
        </div>
        <p className="text-gray-600">
          Gestión y control de habitaciones del centro de cuidados.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.total}</p>
            </div>
            <Home className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{statistics.disponibles}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-green-600"></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ocupadas</p>
              <p className="text-2xl font-bold text-red-600">{statistics.ocupadas}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-red-600"></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Limpieza</p>
              <p className="text-2xl font-bold text-blue-600">{statistics.enLimpieza}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-blue-600"></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mantenimiento</p>
              <p className="text-2xl font-bold text-yellow-600">{statistics.mantenimiento}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fuera Servicio</p>
              <p className="text-2xl font-bold text-gray-600">{statistics.fueraServicio}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-gray-600"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número o tipo..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="form-input pl-10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="Disponible">Disponible</option>
              <option value="Ocupada">Ocupada</option>
              <option value="En Limpieza">En Limpieza</option>
              <option value="En Mantenimiento">En Mantenimiento</option>
              <option value="Fuera de Servicio">Fuera de Servicio</option>
            </select>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="form-input pl-10"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Todos los tipos</option>
              <option value="Habitación individual">Individual</option>
              <option value="Habitación individual con cámara">Individual con cámara</option>
              <option value="Habitación de cuidados especiales">Cuidados especiales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de habitaciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron habitaciones</p>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div key={room.RoomId || room.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">{getTypeIcon(room.RoomTypeName || room.room_type)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Habitación {room.RoomNumber || room.room_number}</h3>
                    <p className="text-sm text-gray-600">{room.RoomTypeName || room.room_type}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.StatusName || room.status)}`}>
                    {room.StatusName || room.status}
                  </span>
                </div>

                {(room.LastCleaningDate || room.last_cleaning_date) && (
                  <div className="border-t border-gray-200 pt-3">
                    <p className="text-sm text-gray-600 mb-1">Última limpieza:</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(room.LastCleaningDate || room.last_cleaning_date).toLocaleDateString('es-ES')}
                    </p>
                    {(room.CleanedByName || room.cleaned_by) && (
                      <p className="text-xs text-gray-500">Por: {room.CleanedByName || room.cleaned_by}</p>
                    )}
                  </div>
                )}

                {(room.StatusName === 'En Mantenimiento' || room.status === 'En Mantenimiento') && room.MaintenanceNotes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-yellow-800">Mantenimiento pendiente</p>
                        <p className="text-xs text-yellow-700">{room.MaintenanceNotes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <Link 
                  to={`/rooms/${room.RoomId || room.id}`}
                  className="flex-1 text-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                >
                  Ver Detalles
                </Link>
                <Link 
                  to={`/rooms/${room.RoomId || room.id}`}
                  className="flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoomList;
