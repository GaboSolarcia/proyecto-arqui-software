import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    // Manejo específico de errores
    if (error.response) {
      // El servidor respondió con un código de error
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expirado o no válido
          localStorage.removeItem('authToken');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acceso denegado');
          break;
        case 404:
          console.error('Recurso no encontrado');
          break;
        case 500:
          console.error('Error interno del servidor');
          break;
        default:
          console.error(`Error ${status}: ${data?.message || 'Error desconocido'}`);
      }
      
      // Crear un error estructurado
      error.message = data?.message || error.message;
      error.errors = data?.errors || [];
    } else if (error.request) {
      // La petición fue hecha pero no hubo respuesta
      error.message = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    } else {
      // Algo pasó al configurar la petición
      error.message = 'Error al configurar la petición.';
    }
    
    return Promise.reject(error);
  }
);

// Funciones de utilidad
export const handleApiError = (error) => {
  if (error.response) {
    return {
      success: false,
      message: error.response.data?.message || 'Error en el servidor',
      errors: error.response.data?.errors || [],
      status: error.response.status
    };
  } else if (error.request) {
    return {
      success: false,
      message: 'No se pudo conectar con el servidor',
      errors: [],
      status: 0
    };
  } else {
    return {
      success: false,
      message: error.message || 'Error desconocido',
      errors: [],
      status: 0
    };
  }
};

// Función para verificar el estado de la API
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health');
    return {
      success: true,
      data: response.data,
      status: response.status
    };
  } catch (error) {
    return handleApiError(error);
  }
};

export default api;