import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imgbg from '../assets/imgbg.png';

function Register() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [cedula, setCedula] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordsMatch = pass && confirm && pass === confirm;
  const emailValid = email.includes('@');
  const formValid = emailValid && passwordsMatch && username && fullName && cedula;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          fullName,
          cedula,
          email,
          phone,
          password: pass,
          roleId: 2 // Usuario Normal
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* FORM */}
        <div className="p-8 md:p-10 lg:p-12 flex flex-col justify-center overflow-y-auto max-h-screen">
          <div className="mb-6 text-center">
            <h2 className="text-3xl font-semibold text-gray-800">Register</h2>
            <p className="text-base text-gray-500 mt-2">Crea tu cuenta</p>
          </div>

          <form className="space-y-3" onSubmit={handleRegister}>
            {/* Username */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="usuario123"
                required
              />
            </div>

            {/* Nombre Completo */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Juan Pérez"
                required
              />
            </div>

            {/* Cédula */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Cédula</label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="1-1234-5678"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Teléfono (opcional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="8888-8888"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirmar Contraseña</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full rounded-full px-4 py-2 text-sm focus:ring-2 outline-none ${
                  confirm === ''
                    ? 'border border-gray-300 focus:ring-indigo-500'
                    : passwordsMatch
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-red-500 focus:ring-red-500'
                }`}
                required
              />
              {confirm && !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">
                  Las contraseñas no coinciden
                </p>
              )}
            </div>

            {/* msg error */}
            {error && <p className="text-red-600 text-center text-sm">{error}</p>}

            {/* botón */}
            <button
              disabled={!formValid || loading}
              className={`w-full py-3 text-base rounded-full font-semibold transition ${
                formValid && !loading
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </div>

        {/* imagen logo */}
        <div className="hidden md:block">
          <img src={imgbg} className="w-full h-full object-cover" alt="bg" />
        </div>
      </div>
    </div>
  );
}

export default Register;
