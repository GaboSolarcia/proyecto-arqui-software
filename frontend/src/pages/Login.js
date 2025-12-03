import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imgbg from '../assets/imgbg.png';

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('🔐 Intentando login con:', email);

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrUsername: email,
          password: pass,
        }),
      });

      console.log('📡 Respuesta recibida:', res.status);

      const data = await res.json();
      console.log('📦 Datos:', data);

      if (!res.ok) {
        console.log('❌ Login fallido:', data.message);
        setError(data.message || 'Credenciales incorrectas');
        setLoading(false);
        return;
      }

      console.log('✅ Login exitoso!');
      
      //  guardar token y datos del usuario
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('role', data.user.roleName);

      console.log('🔄 Redirigiendo según rol:', data.user.roleName);
      
      // Redirección según el rol
      if (data.user.roleName === 'Administrador' || 
          data.user.roleName === 'Veterinario' || 
          data.user.roleName === 'Recepcionista') {
        navigate('/admin-dashboard');
      } else {
        navigate('/client-dashboard');
      }

    } catch (err) {
      console.error('💥 Error en catch:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-5xl h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* form */}
        <div className="h-full p-10 md:p-14 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-semibold text-gray-800">Log In</h2>
            <p className="text-base text-gray-500 mt-2">Accede a tu cuenta</p>
          </div>

          <form className="space-y-7" onSubmit={handleLogin}>
            <div>
              <label className="block text-base text-gray-700 mb-2">Email o Usuario</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin o admin@lospatitos.com"
                className="w-full rounded-full border border-gray-300 px-6 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-base text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-6 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            {error && <p className="text-red-600 text-center">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 text-lg rounded-full font-semibold hover:bg-indigo-700 transition"
            >
              {loading ? 'Ingresando...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-base text-gray-600 mt-8">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Regístrate
            </Link>
          </p>
        </div>

        {/* imagen logo */}
        <div className="hidden md:block h-full">
          <img src={imgbg} className="w-full h-full object-cover" alt="bg" />
        </div>
      </div>
    </div>
  );
}

export default Login;
