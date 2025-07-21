"use client"

import { useState, useContext, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Mail, Lock, User, BookOpen, Calendar, UserPlus } from "lucide-react"
import toast from "react-hot-toast"
import axiosInstance from "../utils/axiosConfig"

const Register = () => {
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    correo: "",
    contrasena: "",
    confirmarContrasena: "",
    carrera: "",
    ciclo: "",
  })
  const [loading, setLoading] = useState(false)
  const [verificando, setVerificando] = useState(false)
  const [userId, setUserId] = useState(null)
  const [codigo, setCodigo] = useState("")
  const { verifyCode, user, authChecked } = useContext(AuthContext)
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

    // Validar que el correo sea del dominio @continental.edu.pe
    if (!formData.correo.endsWith("@continental.edu.pe")) {
      toast.error("Solo se permiten correos institucionales (@continental.edu.pe)")
      return
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post("/api/auth/register", {
        nombreUsuario: formData.nombreUsuario,
        correo: formData.correo,
        contrasena: formData.contrasena,
        carrera: formData.carrera,
        ciclo: Number.parseInt(formData.ciclo),
      })

      setUserId(response.data.userId)
      setVerificando(true)
      toast.success("Registro exitoso. Por favor verifica tu correo electrónico.")
    } catch (error) {
      console.error("Error de registro:", error)
      toast.error(error.response?.data?.message || "Error al registrarse")
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

  const carreras = [
    "Ingeniería de Sistemas e Informática",
    "Ingeniería Civil",
    "Ingeniería Eléctrica",
    "Ingeniería Industrial",
    "Ingeniería Mecánica",
    "Ingeniería Ambiental",
    "Administración",
    "Contabilidad",
    "Derecho",
    "Psicología",
    "Medicina Humana",
    "Arquitectura",
  ]

  return (
    <div className="max-w-md mx-auto">
      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">{verificando ? "Verificar Cuenta" : "Crear Cuenta"}</h1>

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
                <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="nombreUsuario"
                    name="nombreUsuario"
                    value={formData.nombreUsuario}
                    onChange={handleChange}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="carrera" className="block text-sm font-medium text-gray-700 mb-1">
                    Carrera
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="carrera"
                      name="carrera"
                      value={formData.carrera}
                      onChange={handleChange}
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar</option>
                      {carreras.map((carrera) => (
                        <option key={carrera} value={carrera}>
                          {carrera}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="ciclo" className="block text-sm font-medium text-gray-700 mb-1">
                    Ciclo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="ciclo"
                      name="ciclo"
                      value={formData.ciclo}
                      onChange={handleChange}
                      className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
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
                    minLength="6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmarContrasena"
                    name="confirmarContrasena"
                    value={formData.confirmarContrasena}
                    onChange={handleChange}
                    className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    minLength="6"
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
                    "Registrando..."
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Registrarse
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
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Inicia sesión
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Register
