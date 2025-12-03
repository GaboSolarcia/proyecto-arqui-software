import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Search, Filter, Trash2, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const ReservationList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Obtener rol del usuario
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.roleName);
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setReservations(data.data || []);
      } else {
        setError(data.message || 'Error al cargar reservaciones');
      }
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('¿Está seguro que desea cancelar esta reservación? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('No hay sesión activa');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Reservación cancelada exitosamente');
        fetchReservations();
      } else {
        toast.error(data.message || 'Error al cancelar la reservación');
      }
    } catch (err) {
      console.error('Error canceling reservation:', err);
      toast.error('Error de conexión con el servidor');
    }
  };

  const handleUpdateStatus = async (reservationId, newStatus) => {
    const statusMessages = {
      'Confirmada': '¿Confirmar esta reservación?',
      'Activa': '¿Marcar esta reservación como activa (Check-In)?',
      'Completada': '¿Marcar esta reservación como completada (Check-Out)?'
    };

    if (!window.confirm(statusMessages[newStatus] || '¿Actualizar el estado de esta reservación?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('No hay sesión activa');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/reservations/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Reservación actualizada a ${newStatus}`);
        fetchReservations();
      } else {
        toast.error(data.message || 'Error al actualizar la reservación');
      }
    } catch (err) {
      console.error('Error updating reservation status:', err);
      toast.error('Error de conexión con el servidor');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Confirmada': 'bg-blue-100 text-blue-800 border-blue-200',
      'Activa': 'bg-green-100 text-green-800 border-green-200',
      'Check-In': 'bg-green-100 text-green-800 border-green-200',
      'Completada': 'bg-gray-100 text-gray-800 border-gray-200',
      'Cancelada': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Activa': 
      case 'Check-In': 
      case 'Completada': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelada': return <XCircle className="h-4 w-4" />;
      case 'Pendiente': return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const petName = reservation.PetName || reservation.pet_name || '';
    const matchesSearch = petName.toLowerCase().includes(searchTerm.toLowerCase());
    const statusName = reservation.StatusName || reservation.status || '';
    const matchesStatus = filterStatus === 'all' || statusName === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statistics = {
    total: reservations.length,
    pendientes: reservations.filter(r => (r.StatusName || r.status) === 'Pendiente').length,
    confirmadas: reservations.filter(r => (r.StatusName || r.status) === 'Confirmada').length,
    activas: reservations.filter(r => {
      const status = r.StatusName || r.status;
      return status === 'Activa' || status === 'Check-In';
    }).length,
    completadas: reservations.filter(r => (r.StatusName || r.status) === 'Completada').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reservaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Error al cargar reservaciones</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchReservations} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">📋 Reservaciones</h1>
          <Link to="/reservations/book" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reserva
          </Link>
        </div>
        <p className="text-gray-600">Gestión completa de reservas y estadías</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{statistics.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{statistics.pendientes}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmadas</p>
              <p className="text-2xl font-bold text-blue-600">{statistics.confirmadas}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-green-600">{statistics.activas}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-gray-600">{statistics.completadas}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por mascota..."
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
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Activa">Activa</option>
              <option value="Check-In">Check-In</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de reservas */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mascota / Dueño
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Habitación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estancia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Costo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron reservas
                  </td>
                </tr>
              ) : (
                filteredReservations.map((reservation) => (
                  <tr key={reservation.ReservationId || reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          🐾 {reservation.PetName || reservation.pet_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.OwnerName || reservation.owner_name || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {reservation.OwnerCedula || reservation.owner_cedula || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {new Date(reservation.StartDate || reservation.start_date).toLocaleDateString('es-ES')}
                        </div>
                        {reservation.IsIndefinite || reservation.is_indefinite ? (
                          <span className="text-xs text-purple-600 font-medium">
                            ♾️ Indefinido
                          </span>
                        ) : (
                          <div className="text-xs text-gray-500">
                            hasta {new Date(reservation.EndDate || reservation.end_date).toLocaleDateString('es-ES')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {(reservation.RoomTypeName || reservation.room_type || '').includes('cámara') ? '📹' : 
                           (reservation.RoomTypeName || reservation.room_type || '').includes('especiales') ? '🏥' : '🛏️'} 
                          {' #' + (reservation.RoomNumber || reservation.room_number || 'N/A')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reservation.AssistanceLevelName || reservation.assistance_level || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {reservation.StayScheduleName || reservation.stay_schedule || 'N/A'}
                      </div>
                      {reservation.AdditionalServices && reservation.AdditionalServices.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {reservation.AdditionalServices.includes('Juegos') && <span className="text-xs">🎾</span>}
                          {reservation.AdditionalServices.includes('Paseos con acompañamiento') && <span className="text-xs">🚶</span>}
                          {reservation.AdditionalServices.includes('Piscina') && <span className="text-xs">🏊</span>}
                          {reservation.AdditionalServices.includes('Terapias') && <span className="text-xs">💧</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${getStatusColor(reservation.StatusName || reservation.status)}`}>
                        {getStatusIcon(reservation.StatusName || reservation.status)}
                        {reservation.StatusName || reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ${(reservation.TotalCost || reservation.total_cost || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {/* Botones para Admin/Recepcionista */}
                        {(userRole === 'Administrador' || userRole === 'Recepcionista') && (
                          <>
                            {/* Si está Pendiente, mostrar botón Confirmar */}
                            {(reservation.StatusName || reservation.status) === 'Pendiente' && (
                              <button 
                                onClick={() => handleUpdateStatus(reservation.ReservationId || reservation.id, 'Confirmada')}
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                title="Confirmar reservación"
                              >
                                <CheckCircle className="h-4 w-4 mr-1.5" />
                                Confirmar
                              </button>
                            )}
                            
                            {/* Si está Confirmada, mostrar botón Check-In */}
                            {(reservation.StatusName || reservation.status) === 'Confirmada' && (
                              <button 
                                onClick={() => handleUpdateStatus(reservation.ReservationId || reservation.id, 'Activa')}
                                className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                title="Realizar Check-In"
                              >
                                <CheckCircle className="h-4 w-4 mr-1.5" />
                                Check-In
                              </button>
                            )}
                            
                            {/* Si está Activa, mostrar botón Check-Out */}
                            {(reservation.StatusName || reservation.status) === 'Activa' && (
                              <button 
                                onClick={() => handleUpdateStatus(reservation.ReservationId || reservation.id, 'Completada')}
                                className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                title="Realizar Check-Out"
                              >
                                <CheckCircle className="h-4 w-4 mr-1.5" />
                                Check-Out
                              </button>
                            )}
                          </>
                        )}
                        
                        {/* Botón Cancelar (todos los roles, solo si no está completada o cancelada) */}
                        {!['Completada', 'Cancelada'].includes(reservation.StatusName || reservation.status) && (
                          <button 
                            onClick={() => handleCancelReservation(reservation.ReservationId || reservation.id)}
                            className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                            title="Cancelar reservación"
                          >
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            Cancelar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationList;
