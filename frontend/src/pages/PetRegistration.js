import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Save, ArrowLeft, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const PetRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

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

      // Preparar datos para enviar
      const petData = {
        ...data,
        additional_packages: additionalPackages
      };

      // Eliminar campos de checkbox individuales
      delete petData.package_juegos;
      delete petData.package_paseos_acompanamiento;
      delete petData.package_piscina;
      delete petData.package_terapias;

      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Datos de la mascota:', petData);
      toast.success('Mascota registrada exitosamente');
      reset();
    } catch (error) {
      toast.error('Error al registrar la mascota');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/pets" className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Heart className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Registrar Nueva Mascota</h1>
        </div>
        <p className="text-gray-600">
          Complete la información de la mascota para registrarla en nuestro sistema.
        </p>
      </div>

      {/* Formulario */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información de la Mascota</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre de la Mascota *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('name', { 
                    required: 'El nombre es requerido',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                  })}
                  placeholder="Ej: Max, Luna, Bella..."
                />
                {errors.name && <p className="form-error">{errors.name.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de Ingreso</label>
                <input
                  type="date"
                  className="form-input"
                  {...register('admission_date')}
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          {/* Información del dueño */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Dueño</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre del Dueño *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('owner_name', { 
                    required: 'El nombre del dueño es requerido',
                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                  })}
                  placeholder="Nombre completo del dueño"
                />
                {errors.owner_name && <p className="form-error">{errors.owner_name.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Cédula del Dueño *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('owner_cedula', { 
                    required: 'La cédula es requerida',
                    pattern: {
                      value: /^\d{1}-\d{4}-\d{4}$/,
                      message: 'Formato inválido. Use: 1-1234-5678'
                    }
                  })}
                  placeholder="1-1234-5678"
                />
                {errors.owner_cedula && <p className="form-error">{errors.owner_cedula.message}</p>}
              </div>
            </div>
          </div>

          {/* Cuidados especiales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cuidados Especiales</h3>
            
            <div className="form-group">
              <label className="form-label">Alergias</label>
              <textarea
                className="form-input"
                rows="3"
                {...register('allergies')}
                placeholder="Describa cualquier alergia que pueda tener la mascota..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cambios de Vendajes</label>
              <textarea
                className="form-input"
                rows="3"
                {...register('bandage_changes')}
                placeholder="Instrucciones para cambio de vendajes (frecuencia, método, etc.)..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dieta Especial</label>
              <textarea
                className="form-input"
                rows="3"
                {...register('special_diet')}
                placeholder="Describa cualquier dieta especial o restricción alimentaria..."
              />
            </div>
          </div>

          {/* Veterinario */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Asignación de Veterinario</h3>
            <div className="form-group">
              <label className="form-label">Veterinario Asignado</label>
              <select
                className="form-input"
                {...register('veterinarian_id')}
              >
                <option value="">Seleccionar veterinario...</option>
                <option value="1">Dr. María González - Medicina General</option>
                <option value="2">Dr. Carlos Ramírez - Cirugía</option>
                <option value="3">Dra. Ana Morales - Dermatología</option>
                <option value="4">Dr. José Vargas - Cardiología</option>
                <option value="5">Dra. Laura Jiménez - Medicina Interna</option>
              </select>
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
                <option value="Asistencia básica">Asistencia básica</option>
                <option value="Asistencia para movilidad">Asistencia para movilidad</option>
                <option value="Asistencia para alimentación">Asistencia para alimentación</option>
                <option value="Asistencia para baño">Asistencia para baño</option>
                <option value="Asistencia completa">Asistencia completa</option>
              </select>
              {errors.assistance_level && <p className="form-error">{errors.assistance_level.message}</p>}
            </div>
          </div>

          {/* Paquetes Adicionales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Paquetes Adicionales</h3>
            <p className="text-sm text-gray-600 mb-4">Seleccione los servicios adicionales que desea para su mascota:</p>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('package_juegos')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-800">Disfrute de juegos</div>
                  <div className="text-sm text-gray-600">Sesiones de juego supervisadas para mantener a su mascota activa y feliz</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('package_paseos_acompanamiento')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-800">Paseos a sitios con acompañamiento</div>
                  <div className="text-sm text-gray-600">Paseos guiados por nuestro personal capacitado</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('package_piscina')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-800">Paseo a espacio con piscina</div>
                  <div className="text-sm text-gray-600">Acceso a nuestra área de piscina para mascotas</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('package_terapias')}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-gray-800">Terapias en piscina</div>
                  <div className="text-sm text-gray-600">Sesiones de hidroterapia supervisadas por especialistas</div>
                </div>
              </label>
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
                  Registrando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Registrar Mascota
                </>
              )}
            </button>
            
            <Link to="/pets" className="btn-secondary text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetRegistration;