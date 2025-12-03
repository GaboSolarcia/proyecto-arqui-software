import React, { useState, useEffect, useRef } from 'react';
import { Camera, Video, AlertCircle, CheckCircle, XCircle, Wifi, WifiOff, User } from 'lucide-react';

const PetMonitoring = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  useEffect(() => {
    fetchPetsWithCamera();
    
    // Cleanup: detener stream cuando el componente se desmonta
    return () => {
      stopCameraStream();
    };
  }, []);

  const fetchPetsWithCamera = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/camera/my-pets', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setPets(data.data);
        if (data.data.length > 0) {
          setSelectedPet(data.data[0]);
        } else {
          setError('No tienes mascotas con acceso a cámara. Asegúrate de tener una reservación activa con habitación con cámara.');
        }
      } else {
        setError(data.message || 'Error obteniendo mascotas con cámara');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error conectando con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const startCameraStream = async () => {
    try {
      setCameraError(null);
      console.log('🎥 Solicitando acceso a la cámara...');
      
      // Primero activar para renderizar el elemento video
      setCameraActive(true);
      
      // Pequeño delay para asegurar que el DOM se actualice
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Solicitar acceso a la cámara web
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: false 
      });
      
      console.log('✅ Stream obtenido:', stream);
      console.log('Tracks de video:', stream.getVideoTracks());
      
      streamRef.current = stream;
      
      // Verificar si el elemento video existe
      if (!videoRef.current) {
        console.error('❌ videoRef.current es null después del delay');
        setCameraError('Error: elemento de video no encontrado');
        setCameraActive(false);
        return;
      }
      
      console.log('✅ Elemento video encontrado:', videoRef.current);
      videoRef.current.srcObject = stream;
      
      // Esperar a que el video esté listo
      videoRef.current.onloadedmetadata = () => {
        console.log('✅ Metadata del video cargada');
        videoRef.current.play().then(() => {
          console.log('✅ Video reproduciéndose');
        }).catch(err => {
          console.error('Error al reproducir video:', err);
          setCameraError('Error al reproducir el video. Intenta nuevamente.');
          setCameraActive(false);
        });
      };
      
      videoRef.current.onerror = (err) => {
        console.error('Error en el elemento video:', err);
        setCameraError('Error en el elemento de video.');
        setCameraActive(false);
      };
      
    } catch (err) {
      console.error('❌ Error accediendo a la cámara:', err);
      console.error('Nombre del error:', err.name);
      console.error('Mensaje:', err.message);
      
      let errorMessage = 'No se pudo acceder a la cámara. ';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage += 'Permiso denegado. Por favor, permite el acceso a la cámara en tu navegador.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage += 'No se encontró ninguna cámara en tu dispositivo.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage += 'La cámara está siendo usada por otra aplicación.';
      } else {
        errorMessage += 'Error: ' + err.message;
      }
      
      setCameraError(errorMessage);
      setCameraActive(false);
    }
  };

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  };

  const handlePetSelect = (pet) => {
    setSelectedPet(pet);
    // Si la cámara está activa, no necesitamos reiniciarla ya que es la misma cámara física
  };

  const handleToggleCamera = () => {
    if (cameraActive) {
      stopCameraStream();
    } else {
      startCameraStream();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && pets.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-yellow-800 font-semibold">Sin acceso a cámara</h3>
              <p className="text-yellow-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          <Camera className="inline-block mr-2 mb-1" />
          Monitoreo de Mascotas
        </h1>
        <p className="text-gray-600">
          Visualiza a tus mascotas en tiempo real desde sus habitaciones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de mascotas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {userRole === 'Administrador' || userRole === 'Recepcionista' || userRole === 'Veterinario' 
                ? `Todas las Mascotas (${pets.length})` 
                : `Mis Mascotas (${pets.length})`}
            </h2>
            <div className="space-y-2">
              {pets.map((pet) => (
                <button
                  key={pet.petId}
                  onClick={() => handlePetSelect(pet)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedPet?.petId === pet.petId
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="font-semibold text-gray-800">{pet.petName}</div>
                  <div className="text-sm text-gray-600">{pet.species}</div>
                  {(userRole === 'Administrador' || userRole === 'Recepcionista' || userRole === 'Veterinario') && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {pet.ownerName} ({pet.ownerCedula})
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    Habitación {pet.roomNumber}
                  </div>
                  <div className="flex items-center mt-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">{pet.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visor de cámara */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Información de la mascota seleccionada */}
            {selectedPet && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <h2 className="text-2xl font-bold">{selectedPet.petName}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <div>
                    <span className="opacity-75">Especie:</span>
                    <span className="ml-2 font-semibold">{selectedPet.species}</span>
                  </div>
                  <div>
                    <span className="opacity-75">Raza:</span>
                    <span className="ml-2 font-semibold">{selectedPet.breed}</span>
                  </div>
                  {(userRole === 'Administrador' || userRole === 'Recepcionista' || userRole === 'Veterinario') && (
                    <div>
                      <span className="opacity-75">Dueño:</span>
                      <span className="ml-2 font-semibold">{selectedPet.ownerName}</span>
                    </div>
                  )}
                  <div>
                    <span className="opacity-75">Habitación:</span>
                    <span className="ml-2 font-semibold">{selectedPet.roomNumber}</span>
                  </div>
                  <div>
                    <span className="opacity-75">Tipo:</span>
                    <span className="ml-2 font-semibold">{selectedPet.roomType}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Área de video */}
            <div className="relative bg-gray-900 aspect-video flex items-center justify-center">
              {!cameraActive ? (
                <div className="text-center p-8">
                  <Video className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    La cámara está desactivada
                  </p>
                  <button
                    onClick={handleToggleCamera}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Camera className="inline-block mr-2 mb-1" />
                    Activar Cámara
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  
                  {/* Indicador de transmisión en vivo */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <span className="animate-pulse mr-2">●</span>
                    EN VIVO
                  </div>

                  {/* Información de la habitación */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded text-sm">
                    Habitación {selectedPet?.roomNumber}
                  </div>

                  {/* Estado de conexión */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded text-sm flex items-center">
                    <Wifi className="h-4 w-4 mr-2 text-green-400" />
                    Conectado
                  </div>
                </>
              )}
            </div>

            {/* Error de cámara */}
            {cameraError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-400 mr-2" />
                  <p className="text-red-700">{cameraError}</p>
                </div>
              </div>
            )}

            {/* Controles */}
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {cameraActive ? (
                  <span className="flex items-center">
                    <Wifi className="h-4 w-4 mr-2 text-green-500" />
                    Transmisión activa
                  </span>
                ) : (
                  <span className="flex items-center">
                    <WifiOff className="h-4 w-4 mr-2 text-gray-400" />
                    Transmisión inactiva
                  </span>
                )}
              </div>
              
              <button
                onClick={handleToggleCamera}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  cameraActive
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {cameraActive ? (
                  <>
                    <XCircle className="inline-block mr-2 mb-1 h-5 w-5" />
                    Detener Cámara
                  </>
                ) : (
                  <>
                    <Camera className="inline-block mr-2 mb-1 h-5 w-5" />
                    Iniciar Cámara
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Información adicional */}
          {selectedPet && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                ℹ️ Información de Reservación
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Fecha de inicio:</strong>{' '}
                  {new Date(selectedPet.startDate).toLocaleDateString('es-ES')}
                </p>
                {selectedPet.isIndefinite ? (
                  <p>
                    <strong>Estancia:</strong> Indefinida
                  </p>
                ) : (
                  <p>
                    <strong>Fecha de fin:</strong>{' '}
                    {new Date(selectedPet.endDate).toLocaleDateString('es-ES')}
                  </p>
                )}
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className="text-green-600 font-semibold">{selectedPet.status}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nota informativa */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">
          📹 Acerca del Monitoreo
        </h3>
        <p className="text-sm text-gray-600">
          Esta función te permite visualizar a tus mascotas en tiempo real desde sus habitaciones.
          Solo las mascotas con reservaciones activas en habitaciones "Individual con cámara" tienen
          acceso a esta funcionalidad. La transmisión utiliza tu cámara web para simular el monitoreo
          de cada habitación.
        </p>
      </div>
    </div>
  );
};

export default PetMonitoring;
