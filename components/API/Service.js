import axios from "axios";

const AuthURL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: AuthURL,
  timeout: 10000,
});

export const GetServices = async () => {
  try {
    const res = await instance.get("/services", {
      withCredentials: true,
    });
    return res.status === 200 ? res.data : null;
  } catch (err) {
    return {
      error: err.response?.data?.message || "Error al obtener los servicios",
    };
  }
};
