"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { showToast } from "../Extra/ToastMessage";
import { PostService, UpdateData } from "../API/Admin";

interface Service {
  _id: string;
  ServiceName: string;
  ServiceDescription: string;
  ServicePrice: string;
  ServiceFeatures: string[];
}

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSave: (service: Service) => void;
}

export default function EditServiceModal({
  isOpen,
  onClose,
  service,
  onSave,
}: EditServiceModalProps) {
  const [formData, setFormData] = useState<Service>({
    _id: "",
    ServiceName: "",
    ServiceDescription: "",
    ServicePrice: "",
    ServiceFeatures: [],
  });

  const [errors, setErrors] = useState<Partial<Service>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        ...service,
        ServicePrice: String(service.ServicePrice),
      });
    }
  }, [service]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Service> = {};

    if (!formData.ServiceName.trim()) {
      newErrors.ServiceName = "El título es requerido";
    }

    if (!formData.ServiceDescription.trim()) {
      newErrors.ServiceDescription = "La descripción es requerida";
    }

    if (!formData.ServicePrice.trim()) {
      newErrors.ServicePrice = "El precio es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "clients" ? Number.parseInt(value) || 0 : value,
    }));

    if (errors[name as keyof Service]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    let response;
    // console.log(formData);
    if (formData._id) {
      response = await UpdateData(formData._id, formData, "Services");
    } else {
      response = await PostService(formData);
    }

    if (response.ok) {
      showToast(response.message || "Desconocido", "success");
      setTimeout(() => {
        onSave(formData);
        setIsLoading(false);
        onClose();
      }, 2000);
      window.location.reload();
    } else {
      showToast(response.error || "Desconocido", "error");
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      _id: "",
      ServiceName: "",
      ServiceDescription: "",
      ServicePrice: "",
      ServiceFeatures: [],
    });

    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {service ? "Editar Servicio" : "Nuevo Servicio"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Título del Servicio
            </label>
            <input
              id="title"
              name="ServiceName"
              type="text"
              value={formData.ServiceName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.ServiceName
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              placeholder="Ej: Desarrollo Web"
            />
            {errors.ServiceName && (
              <p className="mt-1 text-sm text-red-600">{errors.ServiceName}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="ServiceDescription"
              rows={4}
              value={formData.ServiceDescription}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                errors.ServiceDescription
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              placeholder="Describe el servicio en detalle..."
            />
            {errors.ServiceDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ServiceDescription}
              </p>
            )}
          </div>

          {/* Price and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Precio
              </label>
              <input
                id="price"
                name="ServicePrice"
                type="text"
                value={formData.ServicePrice}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.ServicePrice
                    ? "border-red-300 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
                placeholder="Ej: $2,500"
              />
              {errors.ServicePrice && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.ServicePrice}
                </p>
              )}
            </div>
          </div>
          {/* Features */}
          <div>
            <label
              htmlFor="features"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Características del Servicio
            </label>
            <textarea
              id="features"
              name="ServiceFeatures"
              rows={3}
              value={formData.ServiceFeatures.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ServiceFeatures: e.target.value
                    .split(",")
                    .map((f) => f.trim()),
                })
              }
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
              placeholder="Ej: Soporte 24/7, Mantenimiento mensual, etc."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Guardando...
                </div>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
