import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Camera } from 'lucide-react';

const ClientDashboard = () => {
  const [stats, setStats] = useState({
    totalPets: 0,
    pendingPets: 0,
    approvedPets: 0,
    totalReservations: 0,
    activeReservations: 0,
    completedReservations: 0,
  });
  const [recentPets, setRecentPets] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user'));

      // Obtener mascotas del usuario
      const petsResponse = await fetch(`http://localhost:3001/api/pets?ownerId=${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const petsData = await petsResponse.json();

      if (petsData.success) {
        const pets = petsData.data;
        setRecentPets(pets.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalPets: pets.length,
          pendingPets: pets.filter(p => !p.IsApproved).length,
          approvedPets: pets.filter(p => p.IsApproved).length,
        }));
      }

      // Obtener reservaciones del usuario
      const reservationsResponse = await fetch(`http://localhost:3001/api/reservations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reservationsData = await reservationsResponse.json();

      if (reservationsData.success) {
        const reservations = reservationsData.data;
        setRecentReservations(reservations.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalReservations: reservations.length,
          activeReservations: reservations.filter(r => r.StatusName === 'Confirmada' || r.StatusName === 'Check-In' || r.StatusName === 'Activa').length,
          completedReservations: reservations.filter(r => r.StatusName === 'Completada').length,
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Cliente</h1>
        <p className="text-gray-600">Gestiona tus mascotas y reservaciones</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Mascotas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.totalPets}</span>
          </div>
          <h3 className="text-gray-600 font-medium mb-2">Total Mascotas</h3>
          <div className="flex items-center text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            <span>{stats.approvedPets} aprobadas</span>
            {stats.pendingPets > 0 && (
              <>
                <span className="mx-2">•</span>
                <AlertCircle className="w-4 h-4 mr-1 text-yellow-500" />
                <span>{stats.pendingPets} pendientes</span>
              </>
            )}
          </div>
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
          <p className="text-sm text-gray-500">En curso o confirmadas</p>
        </div>

        {/* Reservaciones Completadas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{stats.completedReservations}</span>
          </div>
          <h3 className="text-gray-600 font-medium mb-2">Reservaciones Completadas</h3>
          <p className="text-sm text-gray-500">Historial de servicios</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/pets/register"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6 hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Registrar Mascota</h3>
              <p className="text-blue-100">Añade una nueva mascota a tu cuenta</p>
            </div>
            <Heart className="w-12 h-12 opacity-50" />
          </div>
        </Link>

        <Link
          to="/reservations/book"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Nueva Reservación</h3>
              <p className="text-green-100">Reserva una habitación para tu mascota</p>
            </div>
            <Calendar className="w-12 h-12 opacity-50" />
          </div>
        </Link>

        <Link
          to="/pet-monitoring"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6 hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Monitoreo en Vivo</h3>
              <p className="text-purple-100">Visualiza a tus mascotas en tiempo real</p>
            </div>
            <Camera className="w-12 h-12 opacity-50" />
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mascotas Recientes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Mis Mascotas</h2>
              <Link to="/pets" className="text-blue-600 text-sm hover:underline">
                Ver todas
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentPets.length > 0 ? (
              <div className="space-y-4">
                {recentPets.map((pet) => (
                  <div key={pet.PetId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Heart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{pet.Name}</h4>
                        <p className="text-sm text-gray-500">{pet.SpeciesName || 'Sin especie'} • {pet.BreedName || 'Sin raza'}</p>
                      </div>
                    </div>
                    <div>
                      {pet.IsApproved ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aprobada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No tienes mascotas registradas</p>
                <Link to="/pets/register" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                  Registra tu primera mascota
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Reservaciones Recientes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Mis Reservaciones</h2>
              <Link to="/reservations" className="text-blue-600 text-sm hover:underline">
                Ver todas
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentReservations.length > 0 ? (
              <div className="space-y-4">
                {recentReservations.map((reservation) => (
                  <div key={reservation.ReservationId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{reservation.PetName}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(reservation.StartDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        reservation.StatusName === 'Confirmada' ? 'bg-green-100 text-green-800' :
                        reservation.StatusName === 'Completada' ? 'bg-blue-100 text-blue-800' :
                        reservation.StatusName === 'Cancelada' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.StatusName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No tienes reservaciones</p>
                <Link to="/reservations/book" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                  Realiza tu primera reservación
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
