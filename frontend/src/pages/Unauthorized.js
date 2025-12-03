import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-red-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Acceso Denegado
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-2">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Esta sección está restringida solo para administradores y personal autorizado.
          </p>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Volver Atrás
            </button>
            
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Ir al Inicio
            </Link>
          </div>

          {/* Help text */}
          <p className="text-sm text-gray-500 mt-6">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
