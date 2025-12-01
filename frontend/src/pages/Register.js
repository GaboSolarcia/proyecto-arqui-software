import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imgbg from '../assets/imgbg.png';

function Register() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordsMatch = pass && confirm && pass === confirm;
  const emailValid = email.includes('@');
  const formValid = emailValid && passwordsMatch;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: pass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error al registrarse');
        setLoading(false);
        return;
      }

      // redigir al login
      navigate('/login');

    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-5xl h-[700px] bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* FORM */}
        <div className="h-full p-10 md:p-14 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-semibold text-gray-800">Register</h2>
            <p className="text-base text-gray-500 mt-2">Crea tu cuenta</p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {/* email */}
            <div>
              <label className="block text-base text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-6 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            {/* contraseña */}
            <div>
              <label className="block text-base text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-6 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {/* confirmar */}
            <div>
              <label className="block text-base text-gray-700 mb-2">Confirmar contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full rounded-full px-6 py-3 focus:ring-2 outline-none ${
                  confirm === ''
                    ? 'border border-gray-300 focus:ring-indigo-500'
                    : passwordsMatch
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-red-500 focus:ring-red-500'
                }`}
                required
              />
              {confirm && !passwordsMatch && (
                <p className="text-sm text-red-500 mt-2">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* msg error */}
            {error && <p className="text-red-600 text-center">{error}</p>}

            {/* botón */}
            <button
              disabled={!formValid || loading}
              className={`w-full py-4 text-lg rounded-full font-semibold transition ${
                formValid && !loading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-base text-gray-600 mt-8">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Iniciar sesión
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

export default Register;
