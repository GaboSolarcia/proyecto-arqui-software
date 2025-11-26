import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Calendar, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReservationBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();

  const startDate = watch('start_date');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Construir objeto de paquetes adicionales
      const additionalPackages = {
        juegos: data.package_juegos || false,
        paseos_acompanamiento: data.package_paseos_acompanamiento || false,
        piscina: data.package_piscina || false,
        terapias: data.package_terapias || false
      };

      // Preparar datos de la reserva
      const reservationData = {
        pet_id: data.pet_id,
        start_date: data.start_date,
        end_date: data.end_date,
        service_type: 'Guardería',
        special_instructions: data.special_instructions,
        assistance_level: data.assistance_level,
        additional_packages: additionalPackages,
        status: 'Pendiente'
      };

      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Datos de la reserva:', reservationData);
      toast.success('Reserva creada exitosamente');
      reset();
    } catch (error) {
      toast.error('Error al crear la reserva');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/reservations" className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Calendar className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Reservar Guardería</h1>
        </div>
        <p className="text-gray-600">
          Complete la información para reservar un espacio de guardería para su mascota.
        </p>
      </div>

      {/* Formulario */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Selección de Mascota */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de la Reserva</h3>
            <div className="form-group">
              <label className="form-label">Mascota *</label>
              <select
                className="form-input"
                {...register('pet_id', { required: 'Debe seleccionar una mascota' })}
              >
                <option value="">Seleccionar mascota...</option>
                <option value="1">Max - Golden Retriever (Dueño: Juan Pérez)</option>
                <option value="2">Luna - Gato Siamés (Dueño: María López)</option>
                <option value="3">Rocky - Bulldog Francés (Dueño: Carlos Gómez)</option>
                <option value="4">Bella - Poodle (Dueño: Ana Martínez)</option>
              </select>
              {errors.pet_id && <p className="form-error">{errors.pet_id.message}</p>}
              <p className="text-sm text-gray-500 mt-1">
                ¿No encuentra su mascota? <Link to="/pets/register" className="text-blue-600 hover:underline">Regístrela aquí</Link>
              </p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha de Ingreso *</label>
                <input
                  type="date"
                  className="form-input"
                  {...register('start_date', { 
                    required: 'La fecha de ingreso es requerida',
                    validate: value => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const selected = new Date(value);
                      return selected >= today || 'La fecha debe ser hoy o posterior';
                    }
                  })}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.start_date && <p className="form-error">{errors.start_date.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de Salida</label>
                <input
                  type="date"
                  className="form-input"
                  {...register('end_date', { 
                    validate: value => {
                      if (!startDate || !value) return true;
                      const start = new Date(startDate);
                      const end = new Date(value);
                      return end > start || 'La fecha de salida debe ser posterior al ingreso';
                    }
                  })}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
                {errors.end_date && <p className="form-error">{errors.end_date.message}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  {...register('is_indefinite')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-800">Estancia indefinida</div>
                  <div className="text-sm text-gray-600">Marque si no hay fecha de salida definida</div>
                </div>
              </label>
            </div>
          </div>

          {/* Estancia en las instalaciones */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estancia en las Instalaciones</h3>
            
            <div className="form-group">
              <label className="form-label">Tipo de Estancia *</label>
              <select
                className="form-input"
                {...register('stay_schedule', { required: 'El tipo de estancia es requerido' })}
                defaultValue="Full estancia"
              >
                <option value="">Seleccionar estancia...</option>
                <option value="Día">Día (8:00 AM - 5:00 PM)</option>
                <option value="Mañana">Mañana (8:00 AM - 2:00 PM)</option>
                <option value="Tarde">Tarde (2:00 PM - 6:00 PM)</option>
                <option value="Full estancia">Full estancia (24 horas)</option>
              </select>
              {errors.stay_schedule && <p className="form-error">{errors.stay_schedule.message}</p>}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-800 mb-2">Horarios Disponibles</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li><strong>Día:</strong> 8:00 AM - 5:00 PM (9 horas)</li>
                <li><strong>Mañana:</strong> 8:00 AM - 2:00 PM (6 horas)</li>
                <li><strong>Tarde:</strong> 2:00 PM - 6:00 PM (4 horas)</li>
                <li><strong>Full estancia:</strong> Cuidado completo 24 horas</li>
              </ul>
            </div>
          </div>

          {/* Tipo de habitación */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tipo de Habitación</h3>
            
            <div className="form-group">
              <label className="form-label">Habitación Requerida *</label>
              <select
                className="form-input"
                {...register('room_type', { required: 'El tipo de habitación es requerido' })}
                defaultValue="Habitación individual"
              >
                <option value="">Seleccionar habitación...</option>
                <option value="Habitación individual">Habitación individual - Cuidado estándar</option>
                <option value="Habitación individual con cámara">Habitación individual con cámara - Monitoreo 24/7</option>
                <option value="Habitación de cuidados especiales">Habitación de cuidados especiales - Atención intensiva</option>
              </select>
              {errors.room_type && <p className="form-error">{errors.room_type.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                <div className="text-2xl mb-2">🛏️</div>
                <h4 className="font-semibold text-gray-800 mb-1">Individual</h4>
                <p className="text-sm text-gray-600">Espacio cómodo y seguro para su mascota</p>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                <div className="text-2xl mb-2">📹</div>
                <h4 className="font-semibold text-gray-800 mb-1">Con Cámara</h4>
                <p className="text-sm text-gray-600">Monitoreo en tiempo real desde cualquier lugar</p>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 transition">
                <div className="text-2xl mb-2">🏥</div>
                <h4 className="font-semibold text-gray-800 mb-1">Cuidados Especiales</h4>
                <p className="text-sm text-gray-600">Atención médica y cuidado intensivo</p>
              </div>
            </div>
          </div>

          {/* Nivel de Asistencia */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nivel de Asistencia Requerido</h3>
            <div className="form-group">
              <label className="form-label">Nivel de Asistencia *</label>
              <select
                className="form-input"
                {...register('assistance_level', { required: 'El nivel de asistencia es requerido' })}
                defaultValue="Asistencia básica"
              >
                <option value="Asistencia básica">Asistencia básica - Cuidado estándar</option>
                <option value="Asistencia para movilidad">Asistencia para movilidad - Ayuda para desplazarse</option>
                <option value="Asistencia para alimentación">Asistencia para alimentación - Ayuda para comer</option>
                <option value="Asistencia para baño">Asistencia para baño - Higiene y limpieza</option>
                <option value="Asistencia completa">Asistencia completa - Cuidado integral 24/7</option>
              </select>
              {errors.assistance_level && <p className="form-error">{errors.assistance_level.message}</p>}
            </div>
          </div>

          {/* Paquetes Adicionales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Paquetes Adicionales</h3>
            <p className="text-sm text-gray-600 mb-4">Mejore la experiencia de su mascota con nuestros servicios premium:</p>
            
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  {...register('package_juegos')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">🎾 Disfrute de juegos</div>
                  <div className="text-sm text-gray-600 mt-1">Sesiones de juego supervisadas para mantener a su mascota activa y feliz</div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  {...register('package_paseos_acompanamiento')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">🚶 Paseos a sitios con acompañamiento</div>
                  <div className="text-sm text-gray-600 mt-1">Paseos guiados por nuestro personal capacitado en áreas seguras</div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  {...register('package_piscina')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">🏊 Paseo a espacio con piscina</div>
                  <div className="text-sm text-gray-600 mt-1">Acceso a nuestra área de piscina para mascotas con supervisión</div>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  {...register('package_terapias')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">💧 Terapias en piscina</div>
                  <div className="text-sm text-gray-600 mt-1">Sesiones de hidroterapia supervisadas por especialistas certificados</div>
                </div>
              </label>
            </div>
          </div>

          {/* Instrucciones Especiales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Instrucciones Especiales</h3>
            <div className="form-group">
              <label className="form-label">Notas Adicionales</label>
              <textarea
                className="form-input"
                rows="4"
                {...register('special_instructions')}
                placeholder="Indique cualquier cuidado especial, medicamentos, horarios específicos u otra información relevante..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Incluya información sobre alergias, dietas especiales, medicamentos, o cualquier otro detalle importante.
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Confirmar Reserva
                </>
              )}
            </button>
            
            <Link to="/reservations" className="btn-secondary text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationBooking;