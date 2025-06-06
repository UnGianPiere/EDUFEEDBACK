"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"
import toast from "react-hot-toast"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  // Función para verificar el token almacenado y obtener datos del usuario
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        setAuthChecked(true)
        return
      }

      // Configurar el token en los headers de axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Obtener datos del usuario
      const res = await axios.get("/api/auth/me")
      setUser(res.data)
      console.log("Usuario autenticado:", res.data)
    } catch (error) {
      console.error("Error verificando autenticación:", error)
      // Limpiar token inválido
      localStorage.removeItem("token")
      delete axios.defaults.headers.common["Authorization"]
    } finally {
      setLoading(false)
      setAuthChecked(true)
    }
  }

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth()

    // Configurar interceptor para manejar errores de autenticación
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem("token")
          delete axios.defaults.headers.common["Authorization"]
          setUser(null)
          toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.")
        }
        return Promise.reject(error)
      },
    )

    // Limpiar interceptor al desmontar
    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

  const login = async (correo, contrasena) => {
    try {
      const res = await axios.post("/api/auth/login", { correo, contrasena })

      // Guardar token en localStorage
      localStorage.setItem("token", res.data.token)

      // Configurar token en headers de axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

      // Actualizar estado de usuario
      setUser(res.data.user)
      console.log("Login exitoso:", res.data.user)

      return res.data
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const res = await axios.post("/api/auth/register", userData)
      return res.data
    } catch (error) {
      console.error("Error en registro:", error)
      throw error
    }
  }

  const verifyCode = async (userId, codigo) => {
    try {
      const res = await axios.post("/api/auth/verificar", { userId, codigo })

      // Guardar token en localStorage
      localStorage.setItem("token", res.data.token)

      // Configurar token en headers de axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`

      // Actualizar estado de usuario
      setUser(res.data.user)
      console.log("Verificación exitosa:", res.data.user)

      return res.data
    } catch (error) {
      console.error("Error en verificación:", error)
      throw error
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put("/api/perfil", profileData)
      setUser((current) => ({ ...current, ...res.data }))
      return res.data
    } catch (error) {
      console.error("Error actualizando perfil:", error)
      throw error
    }
  }

  const updateProfilePhoto = async (photoFile) => {
    try {
      const formData = new FormData()
      formData.append("foto", photoFile)

      const res = await axios.post("/api/perfil/foto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Actualizar el usuario con la nueva URL de la foto
      setUser((current) => ({
        ...current,
        urlFoto: res.data.urlFoto,
      }))

      return res.data
    } catch (error) {
      console.error("Error subiendo foto de perfil:", error)
      throw error
    }
  }

  const deleteProfilePhoto = async () => {
    try {
      await axios.delete("/api/perfil/foto")

      // Actualizar el usuario removiendo la URL de la foto
      setUser((current) => ({
        ...current,
        urlFoto: "",
      }))

      return { success: true }
    } catch (error) {
      console.error("Error eliminando foto de perfil:", error)
      throw error
    }
  }

  const logout = () => {
    // Limpiar token del localStorage
    localStorage.removeItem("token")

    // Limpiar token de los headers de axios
    delete axios.defaults.headers.common["Authorization"]

    // Limpiar estado de usuario
    setUser(null)

    console.log("Logout exitoso")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authChecked,
        login,
        register,
        verifyCode,
        logout,
        checkAuth,
        updateProfile,
        updateProfilePhoto,
        deleteProfilePhoto,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
