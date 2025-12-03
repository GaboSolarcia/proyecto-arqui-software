import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Home, ArrowLeft, Calendar, User, AlertCircle, Wrench, Trash2, Save } from 'lucide-react';

const RoomDetail = () => {
  const { id } = useParams();
  const { register, handleSubmit, reset } = useForm();
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoomData();
  }, [id]);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3001/api/rooms/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setRoom(data.data);
      } else {
        setError(data.message || 'Error al cargar habitación');
      }
    } catch (err) {
      console.error('Error fetching room:', err);
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

  const handleRegisterCleaning = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const today = new Date().toISOString().split('T')[0];
      setRoom({
        ...room,
        last_cleaning_date: today,
        cleaned_by: data.cleaned_by
      });
      
      toast.success('Limpieza registrada exitosamente');
      reset();
    } catch (error) {
      toast.error('Error al registrar limpieza');
    }
  };

  const handleAddMaintenance = async (data) => {
    try {
      // TODO: Implementar API para agregar notas de mantenimiento
      toast.info('Funcionalidad en desarrollo');
      setShowMaintenanceForm(false);
      reset();
    } catch (error) {
      toast.error('Error al agregar nota');
    }
  };

  const handleDeleteMaintenance = (noteId) => {
    // TODO: Implementar API para eliminar notas de mantenimiento
    toast.info('Funcionalidad en desarrollo');
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`http://localhost:3001/api/rooms/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      const data = await response.json();

      if (data.success) {
        // Recargar los datos de la habitación para reflejar el cambio
        await fetchRoomData();
        toast.success('Estado actualizado exitosamente');
      } else {
        toast.error(data.message || 'Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error updating room status:', error);
      toast.error('Error al cambiar estado');
    }
  };

  const getMaintenanceTypeLabel = (type) => {
    const types = {
      'repairs': 'Reparación',
      'furniture': 'Actualización de Mobiliario',
      'recommended': 'Reparación Recomendada'
    };
    return types[type] || type;
  };

  const getMaintenanceTypeColor = (type) => {
    const colors = {
      'repairs': 'bg-red-100 text-red-800',
      'furniture': 'bg-blue-100 text-blue-800',
      'recommended': 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando habitación...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Error al cargar habitación</h3>
          <p className="text-gray-600 mb-4">{error || 'Habitación no encontrada'}</p>
          <Link to="/rooms" className="btn-primary">
            Volver a Habitaciones
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/rooms" className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Home className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Habitación {room.RoomNumber}</h1>
        </div>
        <p className="text-gray-600">{room.RoomTypeName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estado y tipo */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información General</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Estado actual:</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(room.StatusName)}`}>
                  {room.StatusName}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Tipo de habitación:</span>
                <span className="font-medium text-gray-800">{room.RoomTypeName}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Número de habitación:</span>
                <span className="font-medium text-gray-800 text-lg">{room.RoomNumber}</span>
              </div>
            </div>

            {/* Cambiar estado */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Cambiar estado:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleChangeStatus('Disponible')}
                  disabled={room.StatusName === 'Disponible'}
                  className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Disponible
                </button>
                <button
                  onClick={() => handleChangeStatus('Ocupada')}
                  disabled={room.StatusName === 'Ocupada'}
                  className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Ocupada
                </button>
                <button
                  onClick={() => handleChangeStatus('En Mantenimiento')}
                  disabled={room.StatusName === 'En Mantenimiento'}
                  className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Mantenimiento
                </button>
                <button
                  onClick={() => handleChangeStatus('Fuera de Servicio')}
                  disabled={room.StatusName === 'Fuera de Servicio'}
                  className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Fuera Servicio
                </button>
              </div>
            </div>
          </div>

          {/* Limpieza */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">Control de Limpieza</h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Última limpieza registrada</p>
                  <p className="text-lg font-bold text-blue-900 mt-1">
                    {room.LastCleaningDate ? new Date(room.LastCleaningDate).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'No registrada'}
                  </p>
                  {room.CleanedByName && (
                    <div className="flex items-center mt-2">
                      <User className="h-4 w-4 text-blue-600 mr-1" />
                      <p className="text-sm text-blue-700">Personal: {room.CleanedByName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(handleRegisterCleaning)} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Registrar nueva limpieza</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('cleaned_by', { required: true })}
                  placeholder="Nombre del personal que realizó la limpieza"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                <Save className="h-4 w-4 mr-2" />
                Registrar Limpieza
              </button>
            </form>
          </div>

          {/* Mantenimiento */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Wrench className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Historial de Mantenimiento</h2>
              </div>
              <button
                onClick={() => setShowMaintenanceForm(!showMaintenanceForm)}
                className="btn-primary text-sm"
              >
                {showMaintenanceForm ? 'Cancelar' : 'Agregar Nota'}
              </button>
            </div>

            {showMaintenanceForm && (
              <form onSubmit={handleSubmit(handleAddMaintenance)} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
                <div className="form-group">
                  <label className="form-label">Tipo de mantenimiento</label>
                  <select className="form-input" {...register('maintenance_type', { required: true })}>
                    <option value="">Seleccionar tipo...</option>
                    <option value="repairs">Reparación realizada</option>
                    <option value="furniture">Actualización de mobiliario</option>
                    <option value="recommended">Reparación recomendada</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reparación realizada</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    {...register('description')}
                    placeholder="Descripción de reparaciones realizadas..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Actualización de mobiliario</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    {...register('furniture_update')}
                    placeholder="Detalle de mobiliario actualizado..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Reparación recomendada</label>
                  <textarea
                    className="form-input"
                    rows="3"
                    {...register('recommended_repairs')}
                    placeholder="Reparaciones que se recomienda realizar..."
                  />
                </div>

                <button type="submit" className="btn-primary w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Nota
                </button>
              </form>
            )}

            <div className="space-y-3">
              {!room.MaintenanceNotes || room.MaintenanceNotes === '' ? (
                <p className="text-center text-gray-500 py-8">No hay notas de mantenimiento registradas</p>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{room.MaintenanceNotes}</p>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Link to="/reservations/booking" className="btn-primary w-full text-center">
                Crear Reserva
              </Link>
              <button className="btn-secondary w-full">
                Ver Historial
              </button>
              <button className="btn-secondary w-full">
                Generar Reporte
              </button>
            </div>
          </div>

          <div className="card bg-blue-50 border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-3">Información</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Registre la limpieza diariamente</li>
              <li>• Documente todos los mantenimientos</li>
              <li>• Actualice el estado según disponibilidad</li>
              <li>• Revise las recomendaciones pendientes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
