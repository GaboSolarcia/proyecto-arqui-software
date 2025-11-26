import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Shield, 
  Clock,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const services = [
    {
      icon: Heart,
      title: 'Guardería Diaria',
      description: 'Cuidado profesional para tu mascota durante el día mientras trabajas.',
      features: ['Supervisión constante', 'Ejercicio y juegos', 'Alimentación controlada']
    },
    {
      icon: Shield,
      title: 'Cuidados Especiales',
      description: 'Atención especializada para mascotas con necesidades médicas.',
      features: ['Administración de medicamentos', 'Dietas especiales', 'Cambio de vendajes']
    },
    {
      icon: Clock,
      title: 'Hospedaje Nocturno',
      description: 'Alojamiento seguro y cómodo para estancias prolongadas.',
      features: ['Monitoreo 24/7', 'Ambiente controlado', 'Comunicación diaria']
    }
  ];

  const stats = [
    { number: '500+', label: 'Mascotas Cuidadas' },
    { number: '150+', label: 'Familias Satisfechas' },
    { number: '24/7', label: 'Disponibilidad' },
    { number: '5★', label: 'Calificación Promedio' }
  ];

  const testimonials = [
    {
      name: 'María González',
      text: 'Excelente servicio. Mi perrita Luna está siempre feliz cuando la dejo aquí.',
      rating: 5
    },
    {
      name: 'Carlos Ramírez',
      text: 'Personal muy profesional y cariñoso. Recomiendo 100% sus servicios.',
      rating: 5
    },
    {
      name: 'Ana López',
      text: 'La mejor decisión fue confiar en ellos para el cuidado de mis mascotas.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow">
              Cuidados Los Patitos S.A.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Tu compañero de confianza para el cuidado profesional de mascotas
            </p>
            <p className="text-lg mb-10 text-blue-50 max-w-2xl mx-auto">
              Brindamos servicios de guardería, cuidados especiales y hospedaje 
              para que tus mascotas estén seguras mientras tú trabajas o viajas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/reservations/book" 
                className="btn-primary bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg font-semibold inline-flex items-center justify-center"
              >
                Reservar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/pets/register" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 text-lg font-semibold rounded-lg transition-colors inline-flex items-center justify-center"
              >
                Registrar Mascota
                <Heart className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios diseñados para garantizar 
              el bienestar y la felicidad de tu mascota.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="card hover:shadow-lg transition-shadow">
                  <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-lg text-gray-600">
              La satisfacción de nuestras familias es nuestra mayor recompensa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-4">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-gray-800">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para darle a tu mascota el mejor cuidado?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a las familias que confían en nosotros para el cuidado de sus compañeros peludos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/pets/register" 
              className="btn-primary bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold"
            >
              Comenzar Ahora
            </Link>
            <Link 
              to="/reservations" 
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
            >
              Ver Reservas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;