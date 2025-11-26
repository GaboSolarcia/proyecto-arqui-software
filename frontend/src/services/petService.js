import api, { handleApiError } from './api';

// =============================================
// SERVICIO PARA MASCOTAS
// =============================================

export const petService = {
  // Obtener todas las mascotas
  getAll: async () => {
    try {
      const response = await api.get('/pets');
      return {
        success: true,
        data: response.data.data,
        count: response.data.count
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Obtener mascota por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/pets/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Crear nueva mascota
  create: async (petData) => {
    try {
      const response = await api.post('/pets', petData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Actualizar mascota
  update: async (id, petData) => {
    try {
      const response = await api.put(`/pets/${id}`, petData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Eliminar mascota
  delete: async (id) => {
    try {
      const response = await api.delete(`/pets/${id}`);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Buscar mascotas por cédula del dueño
  getByOwnerCedula: async (cedula) => {
    try {
      const response = await api.get(`/pets/owner/${cedula}`);
      return {
        success: true,
        data: response.data.data,
        count: response.data.count
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Buscar mascotas
  search: async (query) => {
    try {
      const response = await api.get(`/pets/search?query=${encodeURIComponent(query)}`);
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
        query: response.data.query
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Obtener mascotas con cuidados especiales
  getWithSpecialCare: async () => {
    try {
      const response = await api.get('/pets/special-care');
      return {
        success: true,
        data: response.data.data,
        count: response.data.count
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Obtener estadísticas de mascotas
  getStats: async () => {
    try {
      const response = await api.get('/pets/stats');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  }
};

export default petService;