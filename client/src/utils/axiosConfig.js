import axios from "axios"
import toast from "react-hot-toast"

// Crear instancia de axios con URL base
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("Error en petición:", error)

    // Mostrar mensaje de error
    if (error.response) {
      // El servidor respondió con un código de error
      const message = error.response.data.message || "Error en el servidor"
      toast.error(message)

      // Si es error de autenticación, redirigir a login
      if (error.response.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      toast.error("No se pudo conectar con el servidor. Verifica tu conexión.")
    } else {
      // Error al configurar la petición
      toast.error("Error al realizar la petición")
    }

    return Promise.reject(error)
  },
)

export default api
