import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Search, Filter, Eye, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';

const ReservationList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Datos de ejemplo
  const reservations = [
    {
      id: 1,
      pet_name: 'Max',
      pet_id: 1,
      owner_name: 'Juan Pérez',
      owner_cedula: '1-1234-5678',
      start_date: '2025-11-26',
      end_date: '2025-11-30',
      is_indefinite: false,
      stay_schedule: 'Full estancia',
      room_type: 'Habitación individual con cámara',
      room_number: '102',
      assistance_level: 'Asistencia básica',
      status: 'Confirmada',
      total_cost: 250.00,
      additional_packages: {
        juegos: true,
        paseos_acompanamiento: true,
        piscina: false,
        terapias: false
      }
    },
    {
      id: 2,
      pet_name: 'Luna',
      pet_id: 2,
      owner_name: 'María López',
      owner_cedula: '1-2345-6789',
      start_date: '2025-11-25',
      end_date: '2025-12-05',
      is_indefinite: false,
      stay_schedule: 'Día',
      room_type: 'Habitación de cuidados especiales',
      room_number: '103',
      assistance_level: 'Asistencia completa',
      status: 'Activa',
      total_cost: 450.00,
      additional_packages: {
        juegos: false,
        paseos_acompanamiento: false,
        piscina: true,
        terapias: true
      }
    },
    {
      id: 3,
      pet_name: 'Rocky',
      pet_id: 3,
      owner_name: 'Carlos Gómez',
      owner_cedula: '1-3456-7890',
      start_date: '2025-12-01',
      end_date: null,
      is_indefinite: true,
      stay_schedule: 'Full estancia',
      room_type: 'Habitación individual',
      room_number: '101',
      assistance_level: 'Asistencia para movilidad',
      status: 'Pendiente',
      total_cost: 0.00,
      additional_packages: {
        juegos: true,
        paseos_acompanamiento: false,
        piscina: false,
        terapias: false
      }
    },
    {
      id: 4,
      pet_name: 'Bella',
      pet_id: 4,
      owner_name: 'Ana Martínez',
      owner_cedula: '1-4567-8901',
      start_date: '2025-11-20',
      end_date: '2025-11-24',
      is_indefinite: false,
      stay_schedule: 'Mañana',
      room_type: 'Habitación individual',
      room_number: '104',
      assistance_level: 'Asistencia básica',
      status: 'Completada',
      total_cost: 150.00,
      additional_packages: {
        juegos: true,
        paseos_acompanamiento: true,
        piscina: false,
        terapias: false
      }
    },
    {
      id: 5,
      pet_name: 'Firulais',
      pet_id: 5,
      owner_name: 'José Ramírez',
      owner_cedula: '1-5678-9012',
      start_date: '2025-11-28',
      end_date: '2025-11-29',
      is_indefinite: false,
      stay_schedule: 'Tarde',
      room_type: 'Habitación individual',
      room_number: '105',
      assistance_level: 'Asistencia para alimentación',
      status: 'Cancelada',
      total_cost: 0.00,
      additional_packages: {
        juegos: false,
        paseos_acompanamiento: false,
        piscina: false,
        terapias: false
      }
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Confirmada': 'bg-blue-100 text-blue-800 border-blue-200',
      'Activa': 'bg-green-100 text-green-800 border-green-200',
      'Completada': 'bg-gray-100 text-gray-800 border-gray-200',
      'Cancelada': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Activa': return <CheckCircle className="h-4 w-4" />;
      case 'Completada': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelada': return <XCircle className="h-4 w-4" />;
      case 'Pendiente': return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.pet_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.owner_cedula.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statistics = {
    total: reservations.length,
    pendientes: reservations.filter(r => r.status === 'Pendiente').length,
    confirmadas: reservations.filter(r => r.status === 'Confirmada').length,
    activas: reservations.filter(r => r.status === 'Activa').length,
    completadas: reservations.filter(r => r.status === 'Completada').length
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Reservaciones</h1>
          </div>
          <Link to="/reservations/book" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Reserva
          </Link>
        </div>
        <p className="text-gray-600">
          Gestión y control de reservas de guardería para mascotas.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
              placeholder="Buscar por mascota, dueño o cédula..."
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
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          🐾 {reservation.pet_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {reservation.owner_name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {reservation.owner_cedula}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          {new Date(reservation.start_date).toLocaleDateString('es-ES')}
                        </div>
                        {reservation.is_indefinite ? (
                          <span className="text-xs text-purple-600 font-medium">
                            ♾️ Indefinido
                          </span>
                        ) : (
                          <div className="text-xs text-gray-500">
                            hasta {new Date(reservation.end_date).toLocaleDateString('es-ES')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.room_type.includes('cámara') ? '📹' : 
                           reservation.room_type.includes('especiales') ? '🏥' : '🛏️'} 
                          {' #' + reservation.room_number}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reservation.assistance_level}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {reservation.stay_schedule}
                      </div>
                      {(reservation.additional_packages.juegos || 
                        reservation.additional_packages.paseos_acompanamiento || 
                        reservation.additional_packages.piscina || 
                        reservation.additional_packages.terapias) && (
                        <div className="flex gap-1 mt-1">
                          {reservation.additional_packages.juegos && <span className="text-xs">🎾</span>}
                          {reservation.additional_packages.paseos_acompanamiento && <span className="text-xs">🚶</span>}
                          {reservation.additional_packages.piscina && <span className="text-xs">🏊</span>}
                          {reservation.additional_packages.terapias && <span className="text-xs">💧</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 ${getStatusColor(reservation.status)}`}>
                        {getStatusIcon(reservation.status)}
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ${reservation.total_cost.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-3" title="Ver detalles">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Editar">
                        <Edit className="h-4 w-4" />
                      </button>
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