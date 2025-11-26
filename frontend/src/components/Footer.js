import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de la empresa */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Cuidados Los Patitos</span>
                <span className="block text-sm text-gray-300">S.A.</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Brindamos servicios de cuidado, guardería y acompañamiento para mascotas 
              con amor y profesionalismo desde 2024.
            </p>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">+506 2234-5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">info@cuidadoslospatitos.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">San José, Costa Rica</span>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Horarios de Atención</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Lunes - Viernes:</span>
                <span className="text-white">7:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Sábados:</span>
                <span className="text-white">8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Domingos:</span>
                <span className="text-white">9:00 AM - 3:00 PM</span>
              </div>
              <div className="mt-3 p-2 bg-green-800 rounded text-xs">
                <span className="text-green-200">🟢 Servicios de emergencia 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-300">
              © {currentYear} Cuidados Los Patitos S.A. Todos los derechos reservados.
            </div>
            <div className="text-sm text-gray-400 mt-2 md:mt-0">
              Desarrollado con ❤️ por el Equipo de Arquitectura de Software
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;