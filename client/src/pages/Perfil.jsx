"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { User, BookOpen, Calendar, Lock, Edit, Save, X, Star, MessageSquare, Upload, Trash2 } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const Perfil = () => {
  const { user, updateProfile, updateProfilePhoto, deleteProfilePhoto } = useContext(AuthContext)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [changePasswordMode, setChangePasswordMode] = useState(false)
  const [estadisticas, setEstadisticas] = useState(null)
  const [comentariosRecientes, setComentariosRecientes] = useState([])
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    nombreUsuario: "",
    carrera: "",
    ciclo: "",
  })

  const [passwordData, setPasswordData] = useState({
    contrasenaActual: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  })

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)

        // Obtener datos del usuario
        const userRes = await axios.get("/api/perfil")

        setFormData({
          nombreUsuario: userRes.data.nombreUsuario || "",
          carrera: userRes.data.carrera || "",
          ciclo: userRes.data.ciclo || "",
        })

        // Obtener estadísticas
        const statsRes = await axios.get("/api/perfil/estadisticas")
        setEstadisticas(statsRes.data)

        // Obtener comentarios recientes
        const comentariosRes = await axios.get("/api/perfil/comentarios")
        setComentariosRecientes(comentariosRes.data)

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar datos del perfil:", error)
        toast.error("Error al cargar datos del perfil")
        setLoading(false)
      }
    }

    fetchData()
  }, [user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await updateProfile(formData)
      toast.success("Perfil actualizado correctamente")
      setEditMode(false)
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      toast.error(error.response?.data?.message || "Error al actualizar perfil")
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.nuevaContrasena !== passwordData.confirmarContrasena) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (passwordData.nuevaContrasena.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    try {
      await axios.post("/api/perfil/cambiar-contrasena", {
        contrasenaActual: passwordData.contrasenaActual,
        nuevaContrasena: passwordData.nuevaContrasena,
      })

      toast.success("Contraseña actualizada correctamente")
      setChangePasswordMode(false)
      setPasswordData({
        contrasenaActual: "",
        nuevaContrasena: "",
        confirmarContrasena: "",
      })
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)
      toast.error(error.response?.data?.message || "Error al cambiar contraseña")
    }
  }

  const handlePhotoClick = () => {
    fileInputRef.current.click()
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar que sea una imagen
    if (!file.type.match(/image.*/)) {
      toast.error("Por favor selecciona una imagen válida")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen debe ser menor a 5MB")
      return
    }

    try {
      setUploading(true)
      await updateProfilePhoto(file)
      toast.success("Foto de perfil actualizada correctamente")
    } catch (error) {
      console.error("Error al subir foto:", error)
      toast.error("Error al subir la foto de perfil")
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async () => {
    try {
      await deleteProfilePhoto()
      toast.success("Foto de perfil eliminada correctamente")
    } catch (error) {
      console.error("Error al eliminar foto:", error)
      toast.error("Error al eliminar la foto de perfil")
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Obtener iniciales del nombre de usuario
  const getUserInitials = () => {
    if (!user || !user.nombreUsuario) return "U"

    const nameParts = user.nombreUsuario.split(" ")
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return nameParts[0][0].toUpperCase()
  }

  // Determinar color de fondo del avatar basado en el correo
  const getAvatarColor = () => {
    if (!user || !user.correo) return "bg-blue-600"

    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-yellow-600",
      "bg-red-600",
      "bg-indigo-600",
      "bg-teal-600",
    ]

    const hash = user.correo
      .split("@")[0]
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)

    return colors[hash % colors.length]
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

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Columna izquierda - Información del perfil */}
        <div className="md:col-span-1">
          <div className="border rounded-lg p-6 mb-6">
            <div className="flex flex-col items-center mb-6">
              {user.urlFoto ? (
                <div className="relative group">
                  <img
                    src={user.urlFoto || "/placeholder.svg"}
                    alt={user.nombreUsuario}
                    className="w-24 h-24 rounded-full object-cover mb-4 cursor-pointer"
                    onClick={handlePhotoClick}
                  />
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={handlePhotoClick}
                  >
                    <Edit className="w-6 h-6 text-white" />
                  </div>
                  {user.urlFoto && (
                    <button
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      onClick={handleDeletePhoto}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative group">
                  <div
                    className={`w-24 h-24 rounded-full ${getAvatarColor()} flex items-center justify-center text-white text-3xl font-semibold mb-4 cursor-pointer`}
                    onClick={handlePhotoClick}
                  >
                    {getUserInitials()}
                  </div>
                  <div
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={handlePhotoClick}
                  >
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
              <h1 className="text-xl font-bold text-center">{user.nombreUsuario}</h1>
              <p className="text-gray-600">{user.correo}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {user.rol === "admin" ? "Administrador" : user.rol === "moderador" ? "Moderador" : "Estudiante"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <div className="font-medium">Miembro desde</div>
                  <div className="text-sm">{formatDate(user.fechaCreacion)}</div>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <BookOpen className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <div className="font-medium">Carrera</div>
                  <div className="text-sm">{formData.carrera || "No especificada"}</div>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <div className="font-medium">Ciclo</div>
                  <div className="text-sm">{formData.ciclo || "No especificado"}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar Perfil
              </button>

              <button
                onClick={() => setChangePasswordMode(true)}
                className="w-full border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Cambiar Contraseña
              </button>
            </div>
          </div>

          {/* Estadísticas */}
          {estadisticas && (
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{estadisticas.totalComentarios}</div>
                  <div className="text-xs text-gray-500">Comentarios</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{estadisticas.promedioCalificaciones}</div>
                  <div className="text-xs text-gray-500">Calificación media</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{estadisticas.profesoresComentados}</div>
                  <div className="text-xs text-gray-500">Profesores</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha - Formularios y comentarios */}
        <div className="md:col-span-2">
          {/* Formulario de edición de perfil */}
          {editMode && (
            <div className="border rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Editar Perfil</h2>
                <button onClick={() => setEditMode(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

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

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-1 inline" />
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Formulario de cambio de contraseña */}
          {changePasswordMode && (
            <div className="border rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Cambiar Contraseña</h2>
                <button onClick={() => setChangePasswordMode(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="contrasenaActual" className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="contrasenaActual"
                        name="contrasenaActual"
                        value={passwordData.contrasenaActual}
                        onChange={handlePasswordChange}
                        className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="nuevaContrasena" className="block text-sm font-medium text-gray-700 mb-1">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="nuevaContrasena"
                        name="nuevaContrasena"
                        value={passwordData.nuevaContrasena}
                        onChange={handlePasswordChange}
                        className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                        minLength="6"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
                  </div>

                  <div>
                    <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="confirmarContrasena"
                        name="confirmarContrasena"
                        value={passwordData.confirmarContrasena}
                        onChange={handlePasswordChange}
                        className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                        minLength="6"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setChangePasswordMode(false)}
                      className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Actualizar Contraseña
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Comentarios recientes */}
          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Mis Comentarios Recientes</h2>

            {comentariosRecientes.length > 0 ? (
              <div className="space-y-4">
                {comentariosRecientes.map((comentario) => (
                  <div key={comentario._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{comentario.nombreProfesor}</div>
                        <div className="text-sm text-gray-500">{comentario.codigoCurso}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < comentario.calificacion ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{formatDate(comentario.fechaHora)}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{comentario.texto}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>Aún no has publicado comentarios</p>
                <button onClick={() => navigate("/profesores")} className="mt-2 text-blue-600 hover:underline">
                  Explorar profesores
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer simple */}
      <div className="mt-12 border-t pt-6 pb-8 text-center">
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} EduFeedback - Universidad Continental</p>
      </div>
    </div>
  )
}

export default Perfil
