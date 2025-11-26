import React from 'react';
import { UserCheck } from 'lucide-react';

const OwnerList = () => {
  return (
    <div>
      <div className="flex items-center mb-8">
        <UserCheck className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Dueños</h1>
      </div>

      <div className="card">
        <div className="text-center py-12">
          <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Lista de Dueños</h3>
          <p className="text-gray-500">
            El módulo de gestión de dueños estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerList;