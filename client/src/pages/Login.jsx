"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Mail, Lock, LogIn } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"

const Login = () => {
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  })
  const [loading, setLoading] = useState(false)
  const [verificando, setVerificando] = useState(false)
  const [userId, setUserId] = useState(null)
  const [codigo, setCodigo] = useState("")
  const { login, verifyCode, user, authChecked } = useContext(AuthContext)
  const navigate = useNavigate()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (authChecked && user) {
      navigate("/")
    }
  }, [user, authChecked, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validar que el correo sea del dominio @continental.edu.pe
    if (!formData.correo.endsWith("@continental.edu.pe")) {
      toast.error("Solo se permiten correos institucionales (@continental.edu.pe)")
      setLoading(false)
      return
    }

    try {
      await login(formData.correo, formData.contrasena)
      toast.success("Inicio de sesión exitoso")
      navigate("/")
    } catch (error) {
      console.error("Error de inicio de sesión:", error)

      // Verificar si necesita verificación
      if (error.response?.status === 403 && error.response?.data?.requireVerification) {
        setUserId(error.response.data.userId)
        setVerificando(true)
        toast.info("Por favor verifica tu cuenta con el código enviado a tu correo")
      } else {
        toast.error(error.response?.data?.message || "Error al iniciar sesión")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerificar = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await verifyCode(userId, codigo)
      toast.success("Cuenta verificada correctamente")
      navigate("/")
    } catch (error) {
      console.error("Error de verificación:", error)
      toast.error(error.response?.data?.message || "Error al verificar la cuenta")
    } finally {
      setLoading(false)
    }
  }

  const handleReenviarCodigo = async () => {
    try {
      await axiosInstance.post("/api/auth/reenviar-codigo", {
        correo: formData.correo,
      })
      toast.success("Se ha enviado un nuevo código a tu correo")
    } catch (error) {
      console.error("Error al reenviar código:", error)
      toast.error(error.response?.data?.message || "Error al reenviar el código")
    }
  }

  // Si ya está autenticado y cargando, mostrar spinner
  if (!authChecked) {
    return <div className="text-center py-10">Cargando...</div>
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">{verificando ? "Verificar Cuenta" : "Iniciar Sesión"}</h1>

        {verificando ? (
          <form onSubmit={handleVerificar}>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Hemos enviado un código de verificación a tu correo electrónico. Por favor, ingrésalo a continuación:
                </p>
                <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
                  Código de Verificación
                </label>
                <input
                  type="text"
                  id="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ingresa el código de 6 dígitos"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? "Verificando..." : "Verificar Cuenta"}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleReenviarCodigo}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ¿No recibiste el código? Reenviar
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="usuario@continental.edu.pe"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Solo se permiten correos @continental.edu.pe</p>
              </div>

              <div>
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="contrasena"
                    name="contrasena"
                    value={formData.contrasena}
                    onChange={handleChange}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    "Iniciando sesión..."
                  ) : (
                    <>
                      <LogIn className="w-5 h-5 mr-2" />
                      Iniciar Sesión
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {!verificando && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800">
                Regístrate
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
