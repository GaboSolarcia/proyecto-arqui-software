import React from 'react';
import { Stethoscope } from 'lucide-react';

const VeterinarianList = () => {
  return (
    <div>
      <div className="flex items-center mb-8">
        <Stethoscope className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Veterinarios</h1>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Lista de Veterinarios</h3>
          <p className="text-gray-500">
            El módulo de gestión de veterinarios estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VeterinarianList;