import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Heart, Calendar, Home, UserCheck, 
  TrendingUp, DollarSign, Activity, AlertCircle, Camera 
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPets: 0,
    pendingPets: 0,
    totalReservations: 0,
    activeReservations: 0,
    totalRooms: 0,
    occupiedRooms: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // Obtener mascotas
      const petsResponse = await fetch('http://localhost:3001/api/pets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const petsData = await petsResponse.json();

      if (petsData.success) {
        const pets = petsData.data;
        setStats(prev => ({
          ...prev,
          totalPets: pets.length,
          pendingPets: pets.filter(p => !p.IsApproved).length,
        }));
      }

      // Obtener reservaciones
      const reservationsResponse = await fetch('http://localhost:3001/api/reservations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reservationsData = await reservationsResponse.json();

      if (reservationsData.success) {
        const reservations = reservationsData.data;
        setStats(prev => ({
          ...prev,
          totalReservations: reservations.length,
          activeReservations: reservations.filter(r => 
            r.StatusName === 'Confirmada' || r.StatusName === 'Check-In' || r.StatusName === 'Activa'
          ).length,
        }));
      }

      // Obtener habitaciones
      const roomsResponse = await fetch('http://localhost:3001/api/rooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const roomsData = await roomsResponse.json();

      if (roomsData.success) {
        const rooms = roomsData.data;
        setStats(prev => ({
          ...prev,
          totalRooms: rooms.length,
          occupiedRooms: rooms.filter(r => r.StatusName === 'Ocupada').length,
        }));
      }

      // Obtener dueños
      const ownersResponse = await fetch('http://localhost:3001/api/owners', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ownersData = await ownersResponse.json();

      if (ownersData.success) {
        setStats(prev => ({
          ...prev,
          totalUsers: ownersData.data.length,
        }));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const occupancyRate = stats.totalRooms > 0 
    ? ((stats.occupiedRooms / stats.totalRooms) * 100).toFixed(1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
        <p className="text-gray-600">Gestión completa del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Usuarios */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.totalUsers}</span>
          </div>
          <h3 className="text-gray-600 font-medium">Usuarios</h3>
          <Link to="/owners" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
            Ver todos →
          </Link>
        </div>

        {/* Total Mascotas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.totalPets}</span>
          </div>
          <h3 className="text-gray-600 font-medium mb-2">Mascotas</h3>
          {stats.pendingPets > 0 && (
            <div className="flex items-center text-sm text-orange-600">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>{stats.pendingPets} pendientes de aprobación</span>
            </div>
          )}
          <Link to="/pets" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
            Ver todas →
          </Link>
        </div>

        {/* Reservaciones Activas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.activeReservations}</span>
          </div>
          <h3 className="text-gray-600 font-medium mb-2">Reservaciones Activas</h3>
          <p className="text-sm text-gray-500">{stats.totalReservations} totales</p>
          <Link to="/reservations" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
            Ver todas →
          </Link>
        </div>

        {/* Ocupación de Habitaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Home className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{occupancyRate}%</span>
          </div>
          <h3 className="text-gray-600 font-medium mb-2">Ocupación</h3>
          <p className="text-sm text-gray-500">{stats.occupiedRooms}/{stats.totalRooms} habitaciones</p>
          <Link to="/rooms" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
            Ver habitaciones →
          </Link>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          to="/pets"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            {stats.pendingPets > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {stats.pendingPets}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Gestión de Mascotas</h3>
          <p className="text-gray-600 text-sm">Aprobar registros y administrar mascotas</p>
        </Link>

        <Link
          to="/reservations"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Reservaciones</h3>
          <p className="text-gray-600 text-sm">Administrar todas las reservaciones</p>
        </Link>

        <Link
          to="/rooms"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Home className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Habitaciones</h3>
          <p className="text-gray-600 text-sm">Gestionar habitaciones y disponibilidad</p>
        </Link>

        <Link
          to="/specialists"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Especialistas</h3>
          <p className="text-gray-600 text-sm">Gestionar especialistas y servicios</p>
        </Link>

        <Link
          to="/pet-monitoring"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Camera className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Monitoreo de Cámaras</h3>
          <p className="text-gray-600 text-sm">Ver cámaras de habitaciones en vivo</p>
        </Link>

        <Link
          to="/owners"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 p-3 rounded-lg">
              <UserCheck className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Dueños</h3>
          <p className="text-gray-600 text-sm">Administrar clientes y propietarios</p>
        </Link>
      </div>

      {/* Alerts Section */}
      {stats.pendingPets > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-bold text-orange-800 mb-1">
                Acción Requerida
              </h3>
              <p className="text-orange-700">
                Hay {stats.pendingPets} mascota{stats.pendingPets > 1 ? 's' : ''} pendiente{stats.pendingPets > 1 ? 's' : ''} de aprobación.
              </p>
              <Link 
                to="/pets" 
                className="inline-block mt-3 text-orange-600 font-medium hover:underline"
              >
                Revisar ahora →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* System Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Información del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Estado del Sistema</p>
              <p className="font-medium text-gray-800">Operativo</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Tasa de Ocupación</p>
              <p className="font-medium text-gray-800">{occupancyRate}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Clientes Activos</p>
              <p className="font-medium text-gray-800">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
