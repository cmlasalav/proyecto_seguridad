"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/authContext";
import { LogoutUser, UserType } from "../API/Auth";
import { GetAdminData, DeleteAdminData } from "../API/Admin";
import { showToast } from "@components/Extra/ToastMessage";
import UserModal from "../Modals/UserModal";
import ServiceModal from "../Modals/ServiceModal";
import LoadingScreen from "../Extra/Loader";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  userStatus: boolean;
};

interface Service {
  _id: string;
  ServiceName: string;
  ServiceDescription: string;
  ServicePrice: string;
  ServiceFeatures: string[];
}

export default function AdminPage() {
  //User and Service
  const [users, setUsers] = useState<User[]>([]);
  const [service, setService] = useState<Service[]>([]);
  // Authentication and Admin Check
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  //Modal States
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isUserStatusModalOpen, setIsUserStatusModalOpen] = useState(false);
  //Selected Service and User
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  const checkUser = async () => {
    const user = await UserType();
    if (user.ok) {
      setIsAdmin(true);
      const adminData = await GetAdminData();
      if (!adminData.error) {
        setUsers(adminData.users);
        setService(adminData.services);
        // console.log(adminData);
      }
    } else {
      setIsAdmin(false);
    }
    setIsCheckingAdmin(false);
  };

  useEffect(() => {
    checkUser();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isCheckingAdmin) {
      if (!isAuthenticated || !isAdmin) {
        router.push("/404");
      }
    }
  }, [isAuthenticated, isAdmin, isCheckingAdmin, router]);

  if (isCheckingAdmin) {
    return <LoadingScreen message="Verificando permisos..." />;
  }

  const handleDeleteData = async (
    id: string,
    typeData: "Users" | "Services"
  ) => {
    setLoading(true);
    try {
      const response = await DeleteAdminData(id, typeData);

      if (response.ok) {
        showToast(response.message || "Desconocido", "success");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        //Toastify error
        showToast(response.error || "Desconocido", "error");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    } finally {
      setLoading(false);
    }
  };

  //Edit Service and User
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleEditUserStatus = (user: User) => {
    setSelectedUser(user);
    setIsUserStatusModalOpen(true);
  };

  const handleSaveService = (updatedService: Service) => {
    setService(
      service.map((service) =>
        service._id === updatedService._id ? updatedService : service
      )
    );
  };

  const handleSaveUserStatus = (updatedUser: User) => {
    setUsers(
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">
                Panel de Administración
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin</span>
              <button
                onClick={() => router.push("/")}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Ver Servicios
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Services Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Servicios</h2>
            <button
              onClick={() => {
                setSelectedService(null);
                setIsServiceModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar Servicio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {service.ServiceName}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {service.ServiceDescription}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Precio:</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {service.ServicePrice}$
                      </span>
                    </div>
                  </div>
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

                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteData(service._id, "Services")}
                      className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Users Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Usuarios</h2>
            {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Agregar Usuario
            </button> */}
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEditUserStatus(user)}
                          className={`px-2 py-1 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity ${
                            user.userStatus === true
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {user.userStatus === true ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {/* <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Editar
                          </button> */}
                          <button
                            onClick={() => handleDeleteData(user._id, "Users")}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        service={selectedService}
        onSave={handleSaveService}
      />

      <UserModal
        isOpen={isUserStatusModalOpen}
        onClose={() => setIsUserStatusModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUserStatus}
      />
    </div>
  );
}
