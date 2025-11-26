import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Importar páginas
import Home from './pages/Home';
import PetRegistration from './pages/PetRegistration';
import ReservationBooking from './pages/ReservationBooking';
import PetList from './pages/PetList';
import ReservationList from './pages/ReservationList';
import VeterinarianList from './pages/VeterinarianList';
import OwnerList from './pages/OwnerList';
import SpecialistList from './pages/SpecialistList';
import SpecialistRegistration from './pages/SpecialistRegistration';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';

// Importar componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Configurar React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Navbar />
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Página principal */}
              <Route path="/" element={<Home />} />
              
              {/* Gestión de mascotas */}
              <Route path="/pets" element={<PetList />} />
              <Route path="/pets/register" element={<PetRegistration />} />
              
              {/* Gestión de reservas */}
              <Route path="/reservations" element={<ReservationList />} />
              <Route path="/reservations/book" element={<ReservationBooking />} />
              
              {/* Gestión de veterinarios */}
              <Route path="/veterinarians" element={<VeterinarianList />} />
              
              {/* Gestión de dueños */}
              <Route path="/owners" element={<OwnerList />} />
              
              {/* Gestión de especialistas */}
              <Route path="/specialists" element={<SpecialistList />} />
              <Route path="/specialists/register" element={<SpecialistRegistration />} />
              
              {/* Gestión de habitaciones */}
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/rooms/:id" element={<RoomDetail />} />
              
              {/* Página 404 */}
              <Route path="*" element={
                <div className="text-center py-16">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Página no encontrada</p>
                  <a href="/" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                    Volver al inicio
                  </a>
                </div>
              } />
            </Routes>
          </main>
          
          <Footer />
          
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
      </Router>
    </QueryClientProvider>
  );
}

export default App;