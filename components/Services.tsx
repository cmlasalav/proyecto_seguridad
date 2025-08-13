"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/authContext";
import { LogoutUser, UserType } from "./API/Auth";
import { GetServices } from "./API/Service";
import LoadingScreen from "./Extra/Loader";

interface Service {
  _id: string;
  ServiceName: string;
  ServiceDescription: string;
  ServicePrice: string;
  ServiceFeatures: string[];
}

export default function ServicesPage() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const router = useRouter();

  //Admin check
  const checkUser = async () => {
    const user = await UserType();
    if (user.ok) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    const service = await GetServices();
    setServices(service);
  };
  useEffect(() => {
    checkUser();
  }, [isAuthenticated]);

  const handleLogin = () => {
    router.push("/login");
  };

  const handleAdminAccess = () => {
    setLoading(true);
    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/404");
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    const response = await LogoutUser();
    if (response) {
      setIsAuthenticated(false);
      router.push("/");
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen message="Cerrando sesión..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">TechServices</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-700">Bienvenido</span>
                  {isAdmin && (
                    <button
                      onClick={handleAdminAccess}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Panel Admin
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => router.push("/register")}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Registrarse
                  </button>
                  <button
                    onClick={handleLogin}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Nuestros Servicios Profesionales
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Soluciones tecnológicas innovadoras para hacer crecer tu negocio
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Qué podemos hacer por ti?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios tecnológicos diseñados para
              impulsar tu empresa hacia el éxito digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-2xl font-bold text-gray-900">
                      {service.ServiceName}
                    </h4>
                    <span className="text-2xl font-bold text-blue-600">
                      {service.ServicePrice}$
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.ServiceDescription}
                  </p>

                  <div className="mb-6">
                    <h5 className="text-lg font-semibold text-gray-900 mb-3">
                      Incluye:
                    </h5>
                    <ul className="space-y-2">
                      {service.ServiceFeatures.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600"
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    Solicitar Información
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar tu proyecto?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contáctanos hoy mismo y descubre cómo podemos ayudarte a alcanzar
            tus objetivos digitales.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold">
            Contactar Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2024 TechServices. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
