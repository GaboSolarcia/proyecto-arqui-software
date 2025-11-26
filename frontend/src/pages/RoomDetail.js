import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Home, ArrowLeft, Calendar, User, AlertCircle, Wrench, Trash2, Save } from 'lucide-react';

const RoomDetail = () => {
  const { id } = useParams();
  const { register, handleSubmit, reset } = useForm();
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);

  // Datos de ejemplo
  const [room, setRoom] = useState({
    id: parseInt(id),
    room_number: '101',
    room_type: 'Habitación individual con cámara',
    status: 'Disponible',
    last_cleaning_date: '2025-11-24',
    cleaned_by: 'María López',
    maintenance_notes: [
      {
        id: 1,
        date: '2025-11-15',
        type: 'repairs',
        description: 'Reparación de sistema de ventilación',
        furniture_update: null,
        recommended_repairs: null
      },
      {
        id: 2,
        date: '2025-10-20',
        type: 'furniture',
        description: null,
        furniture_update: 'Actualización de cama y accesorios',
        recommended_repairs: null
      },
      {
        id: 3,
        date: '2025-10-05',
        type: 'recommended',
        description: null,
        furniture_update: null,
        recommended_repairs: 'Se recomienda pintar las paredes'
      }
    ]
  });

  const getStatusColor = (status) => {
    const colors = {
      'Disponible': 'bg-green-100 text-green-800 border-green-200',
      'Reservada': 'bg-blue-100 text-blue-800 border-blue-200',
      'En mantenimiento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Cerrada': 'bg-red-100 text-red-800 border-red-200'
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newNote = {
        id: room.maintenance_notes.length + 1,
        date: new Date().toISOString().split('T')[0],
        type: data.maintenance_type,
        description: data.maintenance_type === 'repairs' ? data.description : null,
        furniture_update: data.maintenance_type === 'furniture' ? data.furniture_update : null,
        recommended_repairs: data.maintenance_type === 'recommended' ? data.recommended_repairs : null
      };
      
      setRoom({
        ...room,
        maintenance_notes: [newNote, ...room.maintenance_notes]
      });
      
      toast.success('Nota de mantenimiento agregada');
      setShowMaintenanceForm(false);
      reset();
    } catch (error) {
      toast.error('Error al agregar nota');
    }
  };

  const handleDeleteMaintenance = (noteId) => {
    setRoom({
      ...room,
      maintenance_notes: room.maintenance_notes.filter(note => note.id !== noteId)
    });
    toast.success('Nota eliminada');
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setRoom({ ...room, status: newStatus });
      toast.success('Estado actualizado');
    } catch (error) {
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/rooms" className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Home className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Habitación {room.room_number}</h1>
        </div>
        <p className="text-gray-600">{room.room_type}</p>
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
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(room.status)}`}>
                  {room.status}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Tipo de habitación:</span>
                <span className="font-medium text-gray-800">{room.room_type}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Número de habitación:</span>
                <span className="font-medium text-gray-800 text-lg">{room.room_number}</span>
              </div>
            </div>

            {/* Cambiar estado */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Cambiar estado:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleChangeStatus('Disponible')}
                  disabled={room.status === 'Disponible'}
                  className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Disponible
                </button>
                <button
                  onClick={() => handleChangeStatus('Reservada')}
                  disabled={room.status === 'Reservada'}
                  className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Reservada
                </button>
                <button
                  onClick={() => handleChangeStatus('En mantenimiento')}
                  disabled={room.status === 'En mantenimiento'}
                  className="px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Mantenimiento
                </button>
                <button
                  onClick={() => handleChangeStatus('Cerrada')}
                  disabled={room.status === 'Cerrada'}
                  className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Cerrada
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
                    {new Date(room.last_cleaning_date).toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <div className="flex items-center mt-2">
                    <User className="h-4 w-4 text-blue-600 mr-1" />
                    <p className="text-sm text-blue-700">Personal: {room.cleaned_by}</p>
                  </div>
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
              {room.maintenance_notes.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No hay notas de mantenimiento registradas</p>
              ) : (
                room.maintenance_notes.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMaintenanceTypeColor(note.type)}`}>
                          {getMaintenanceTypeLabel(note.type)}
                        </span>
                        <span className="ml-3 text-sm text-gray-500">
                          {new Date(note.date).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteMaintenance(note.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-700">
                      {note.description && <p><strong>Reparación:</strong> {note.description}</p>}
                      {note.furniture_update && <p><strong>Mobiliario:</strong> {note.furniture_update}</p>}
                      {note.recommended_repairs && (
                        <div className="flex items-start mt-2 p-2 bg-yellow-50 rounded">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                          <p className="text-yellow-800"><strong>Recomendación:</strong> {note.recommended_repairs}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
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
