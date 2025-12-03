import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Componente para proteger rutas basado en autenticación y roles
 * @param {Object} props
 * @param {React.Component} props.children - Componente hijo a renderizar si tiene acceso
 * @param {Array<string>} props.allowedRoles - Array de roles permitidos (ej: ['Administrador', 'Veterinario'])
 * @param {boolean} props.requireAuth - Si requiere estar autenticado (por defecto true)
 */
const ProtectedRoute = ({ children, allowedRoles = null, requireAuth = true }) => {
  const { isAuthenticated, hasRole, loading } = useAuth();

  // Mostrar loader mientras verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Verificar si requiere autenticación
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si no está autenticado y la ruta permite acceso sin auth, renderizar
  if (!requireAuth) {
    return children;
  }

  // Verificar roles permitidos
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si pasa todas las validaciones, renderizar el componente
  return children;
};

export default ProtectedRoute;
