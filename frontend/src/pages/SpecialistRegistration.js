import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Save, ArrowLeft, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const SpecialistRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        toast.error('No hay sesión activa');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3001/api/specialists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Especialista registrado exitosamente');
        reset();
      } else {
        toast.error(result.message || 'Error al registrar el especialista');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/specialists" className="text-blue-600 hover:text-blue-800 mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Registrar Especialista</h1>
        </div>
        <p className="text-gray-600">
          Complete la información del empleado especialista.
        </p>
      </div>

      {/* Formulario */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Empleado</h3>
            
            <div className="form-group">
              <label className="form-label">Nombre del Empleado *</label>
              <input
                type="text"
                className="form-input"
                {...register('employee_name', { 
                  required: 'El nombre es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                })}
                placeholder="Nombre completo del empleado"
              />
              {errors.employee_name && <p className="form-error">{errors.employee_name.message}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Número de Cédula *</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('cedula', { 
                    required: 'La cédula es requerida',
                    pattern: {
                      value: /^\d{1}-\d{4}-\d{4}$/,
                      message: 'Formato inválido. Use: 1-1234-5678'
                    }
                  })}
                  placeholder="1-1234-5678"
                />
                {errors.cedula && <p className="form-error">{errors.cedula.message}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Fecha de Ingreso *</label>
                <input
                  type="date"
                  className="form-input"
                  {...register('admission_date', { required: 'La fecha de ingreso es requerida' })}
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
                {errors.admission_date && <p className="form-error">{errors.admission_date.message}</p>}
              </div>
            </div>
          </div>

          {/* Horario del puesto */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Horario del Puesto</h3>
            
            <div className="form-group">
              <label className="form-label">Horario Asignado *</label>
              <select
                className="form-input"
                {...register('shift_schedule', { required: 'El horario es requerido' })}
              >
                <option value="">Seleccionar horario...</option>
                <option value="Horario 1">Horario 1 - 6:00 AM a 3:00 PM</option>
                <option value="Horario 2">Horario 2 - 3:00 PM a 10:00 PM</option>
                <option value="Horario 3">Horario 3 - 10:00 PM a 6:00 AM</option>
              </select>
              {errors.shift_schedule && <p className="form-error">{errors.shift_schedule.message}</p>}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-blue-800 mb-2">Información de Horarios</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li><strong>Horario 1:</strong> 6:00 AM - 3:00 PM (Turno matutino)</li>
                <li><strong>Horario 2:</strong> 3:00 PM - 10:00 PM (Turno vespertino)</li>
                <li><strong>Horario 3:</strong> 10:00 PM - 6:00 AM (Turno nocturno)</li>
              </ul>
            </div>
          </div>

          {/* Estado */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado del Empleado</h3>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('is_active')}
                defaultChecked={true}
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-800">Empleado Activo</div>
                <div className="text-sm text-gray-600">Marque si el empleado está activo en el sistema</div>
              </div>
            </label>
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
                  Registrar Especialista
                </>
              )}
            </button>
            
            <Link to="/specialists" className="btn-secondary text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpecialistRegistration;
