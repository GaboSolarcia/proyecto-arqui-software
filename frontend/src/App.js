import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Importar páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PetRegistration from './pages/PetRegistration';
import ReservationBooking from './pages/ReservationBooking';
import PetList from './pages/PetList';
import ReservationList from './pages/ReservationList';
import OwnerList from './pages/OwnerList';
import SpecialistList from './pages/SpecialistList';
import SpecialististRegistration from './pages/SpecialistRegistration';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Unauthorized from './pages/Unauthorized';
import PetMonitoring from './pages/PetMonitoring';

// Importar componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Configurar React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente para redirigir al dashboard según el rol
const DashboardRedirect = () => {
  const role = localStorage.getItem('role');
  
  if (role === 'Administrador' || role === 'Veterinario' || role === 'Recepcionista') {
    return <AdminDashboard />;
  } else {
    return <ClientDashboard />;
  }
};

// Layout solo para Login y register
function AppLayout() {
  const location = useLocation();
  const authRoutes = ['/login', '/register'];
  const hideLayout = authRoutes.includes(location.pathname);

  return (
    <div className="App min-h-screen bg-gray-50">
      {!hideLayout && <Navbar />}

      {/* Main solo para páginas normales */}
      {hideLayout ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <main className="container mx-auto px-4 py-8">
          <Routes>

            {/* Página principal - Redirige según el rol */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              } 
            />

            {/* Dashboards */}
            <Route 
              path="/client-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Usuario Normal']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Administrador', 'Veterinario', 'Recepcionista']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Gestión de mascotas - Acceso para todos los autenticados */}
            <Route 
              path="/pets" 
              element={
                <ProtectedRoute>
                  <PetList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pets/register" 
              element={
                <ProtectedRoute>
                  <PetRegistration />
                </ProtectedRoute>
              } 
            />

            {/* Gestión de reservas - Acceso para todos los autenticados */}
            <Route 
              path="/reservations" 
              element={
                <ProtectedRoute>
                  <ReservationList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reservations/book" 
              element={
                <ProtectedRoute>
                  <ReservationBooking />
                </ProtectedRoute>
              } 
            />

            {/* Monitoreo de mascotas - Acceso para usuarios normales con mascotas en habitaciones con cámara */}
            <Route 
              path="/pet-monitoring" 
              element={
                <ProtectedRoute>
                  <PetMonitoring />
                </ProtectedRoute>
              } 
            />

            {/* Gestión de dueños - Solo Admin */}
            <Route 
              path="/owners" 
              element={
                <ProtectedRoute allowedRoles={['Administrador', 'Recepcionista']}>
                  <OwnerList />
                </ProtectedRoute>
              } 
            />

            {/* Gestión de especialistas - Solo Admin */}
            <Route 
              path="/specialists" 
              element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <SpecialistList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/specialists/register" 
              element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <SpecialististRegistration />
                </ProtectedRoute>
              } 
            />

            {/* Gestión de habitaciones - Solo Admin y Recepcionista */}
            <Route 
              path="/rooms" 
              element={
                <ProtectedRoute allowedRoles={['Administrador', 'Recepcionista']}>
                  <RoomList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rooms/:id" 
              element={
                <ProtectedRoute allowedRoles={['Administrador', 'Recepcionista']}>
                  <RoomDetail />
                </ProtectedRoute>
              } 
            />

            {/* Página de acceso denegado */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Página 404 */}
            <Route
              path="*"
              element={
                <div className="text-center py-16">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    404
                  </h1>
                  <p className="text-gray-600 mb-8">
                    Página no encontrada
                  </p>
                  <a
                    href="/"
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Volver al inicio
                  </a>
                </div>
              }
            />
          </Routes>
        </main>
      )}

      {!hideLayout && <Footer />}

      {/* Notificaciones Toast */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppLayout />
      </Router>
    </QueryClientProvider>
  );
}

export default App;