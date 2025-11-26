import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Clock, Search, Filter } from 'lucide-react';

const SpecialistList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterShift, setFilterShift] = useState('all');

  // Datos de ejemplo
  const specialists = [
    {
      id: 1,
      employee_name: 'Juan Carlos Pérez',
      cedula: '1-1234-5678',
      admission_date: '2024-01-15',
      shift_schedule: 'Horario 1',
      is_active: true
    },
    {
      id: 2,
      employee_name: 'María López Gómez',
      cedula: '1-2345-6789',
      admission_date: '2024-02-20',
      shift_schedule: 'Horario 2',
      is_active: true
    },
    {
      id: 3,
      employee_name: 'Carlos Rodríguez',
      cedula: '1-3456-7890',
      admission_date: '2024-03-10',
      shift_schedule: 'Horario 3',
      is_active: true
    },
    {
      id: 4,
      employee_name: 'Ana Martínez Silva',
      cedula: '1-4567-8901',
      admission_date: '2023-12-05',
      shift_schedule: 'Horario 1',
      is_active: false
    }
  ];

  const getShiftColor = (shift) => {
    const colors = {
      'Horario 1': 'bg-yellow-100 text-yellow-800',
      'Horario 2': 'bg-orange-100 text-orange-800',
      'Horario 3': 'bg-purple-100 text-purple-800'
    };
    return colors[shift] || 'bg-gray-100 text-gray-800';
  };

  const getShiftTime = (shift) => {
    const times = {
      'Horario 1': '6:00 AM - 3:00 PM',
      'Horario 2': '3:00 PM - 10:00 PM',
      'Horario 3': '10:00 PM - 6:00 AM'
    };
    return times[shift] || shift;
  };

  const filteredSpecialists = specialists.filter(specialist => {
    const matchesSearch = specialist.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialist.cedula.includes(searchTerm);
    const matchesFilter = filterShift === 'all' || specialist.shift_schedule === filterShift;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Especialistas</h1>
          </div>
          <Link to="/specialists/register" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Registrar Especialista
          </Link>
        </div>
        <p className="text-gray-600">
          Gestión de empleados especialistas del centro de cuidados.
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Especialistas</p>
              <p className="text-2xl font-bold text-gray-800">{specialists.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">
                {specialists.filter(s => s.is_active).length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-green-600"></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Turno Matutino</p>
              <p className="text-2xl font-bold text-yellow-600">
                {specialists.filter(s => s.shift_schedule === 'Horario 1').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Turno Nocturno</p>
              <p className="text-2xl font-bold text-purple-600">
                {specialists.filter(s => s.shift_schedule === 'Horario 3').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
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
              placeholder="Buscar por nombre o cédula..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              className="form-input pl-10"
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
            >
              <option value="all">Todos los horarios</option>
              <option value="Horario 1">Horario 1 - Matutino</option>
              <option value="Horario 2">Horario 2 - Vespertino</option>
              <option value="Horario 3">Horario 3 - Nocturno</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de especialistas */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Empleado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cédula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Ingreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSpecialists.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No se encontraron especialistas
                  </td>
                </tr>
              ) : (
                filteredSpecialists.map((specialist) => (
                  <tr key={specialist.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {specialist.employee_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{specialist.cedula}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(specialist.admission_date).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getShiftColor(specialist.shift_schedule)}`}>
                          {specialist.shift_schedule}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {getShiftTime(specialist.shift_schedule)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        specialist.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {specialist.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        Ver
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-4">
                        Editar
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

export default SpecialistList;
