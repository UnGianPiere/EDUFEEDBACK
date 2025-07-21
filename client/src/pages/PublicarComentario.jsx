"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AlertCircle, BookOpen, Star } from "lucide-react"
import axiosInstance from "../utils/axiosConfig"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"

const PublicarComentario = () => {
  const { profesorId } = useParams()
  const navigate = useNavigate()
  const { user, authChecked } = useContext(AuthContext)

  const [formData, setFormData] = useState({
    idProfesor: profesorId || "",
    codigoCurso: "",
    calificacion: 3,
    texto: "",
  })

  const [profesor, setProfesor] = useState(null)
  const [profesores, setProfesores] = useState([])
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Función para formatear el nombre del profesor correctamente
  const formatearNombre = (nombre) => {
  if (!nombre) return "PROFESOR NO ESPECIFICADO"

  // Si el nombre contiene coma, lo formateamos correctamente
  if (nombre.includes(",")) {
    const partes = nombre.split(",")
    const primerApellido = partes[0].trim().toUpperCase() // CERRON
    const resto = partes[1].trim() // OCHOA Juan Silvio

    // Dividir el resto en palabras
    const palabrasResto = resto.split(" ")

    // Asumir que las últimas 2 palabras son nombres y el resto apellidos
    if (palabrasResto.length >= 3) {
      const segundoApellido = palabrasResto[0].toUpperCase() // OCHOA
      const nombres = palabrasResto.slice(1).join(" ").toUpperCase() // Juan Silvio
      return `${nombres} ${segundoApellido} ${primerApellido}` // JUAN SILVIO OCHOA CERRON
    } else if (palabrasResto.length === 2) {
      const segundoApellido = palabrasResto[0].toUpperCase()
      const nombre = palabrasResto[1].toUpperCase()
      return `${nombre} ${segundoApellido} ${primerApellido}`
    } else {
      return `${resto.toUpperCase()} ${primerApellido}`
    }
  }

  return nombre.toUpperCase()
}

  useEffect(() => {
    // Esperar a que se verifique la autenticación
    if (!authChecked) return

    // Redirigir si no hay usuario autenticado
    if (!user) {
      toast.error("Debes iniciar sesión para publicar un comentario")
      navigate("/login?redirect=" + encodeURIComponent(window.location.pathname))
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)

        // Si hay un profesorId, obtener datos del profesor
        if (profesorId) {
          const profesorRes = await axiosInstance.get(`/api/profesores/${profesorId}`)
          setProfesor(profesorRes.data.profesor)

          // Obtener cursos del profesor
          // OJO: profesorRes.data.profesor.cursos ya viene populado como objetos
          setCursos(profesorRes.data.profesor.cursos)

          // Actualizar formData con el nombre del profesor
          setFormData((prev) => ({
            ...prev,
            idProfesor: profesorId,
            nombreProfesor: profesorRes.data.profesor.nombre,
          }))
        } else {
          // Si no hay profesorId, obtener todos los profesores y cursos
          const [profesoresRes, cursosRes] = await Promise.all([
            axiosInstance.get("/api/profesores"),
            axiosInstance.get("/api/departamentos/cursos/todos"),
          ])
          setProfesores(profesoresRes.data)
          setCursos(cursosRes.data)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [profesorId, navigate, user, authChecked])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Si cambia el profesor y no estamos en la ruta con profesorId
    if (name === "idProfesor" && !profesorId) {
      const fetchProfesorCursos = async () => {
        try {
          const profesorRes = await axiosInstance.get(`/api/profesores/${value}`)
          const cursosRes = await axiosInstance.get("/api/departamentos/cursos/todos")

          const cursosFiltrados = cursosRes.data.filter((curso) =>
            profesorRes.data.profesor.cursos.some((cursoProfesor) =>
              cursoProfesor._id
                ? cursoProfesor._id.toString() === curso._id.toString()
                : cursoProfesor.toString() === curso._id.toString(),
            ),
          )

          setCursos(cursosFiltrados)
          setFormData((prev) => ({
            ...prev,
            codigoCurso: "",
            nombreProfesor: profesorRes.data.profesor.nombre,
          }))
        } catch (error) {
          console.error("Error al obtener cursos del profesor:", error)
        }
      }

      if (value) {
        fetchProfesorCursos()
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.idProfesor || !formData.codigoCurso || !formData.texto) {
      toast.error("Por favor completa todos los campos")
      return
    }

    setSubmitting(true)

    try {
      const comentarioData = {
        ...formData,
        idEstudiante: user.id,
      }

      await axiosInstance.post("/api/comentarios", comentarioData)
      toast.success("Comentario publicado con éxito")
      navigate(`/profesores/${formData.idProfesor}`)
    } catch (error) {
      console.error("Error al publicar comentario:", error)

      if (error.response?.status === 401) {
        toast.error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.")
        navigate("/login")
      } else {
        toast.error("Error al publicar el comentario")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!authChecked) {
    return <div className="text-center py-10">Cargando...</div>
  }

  if (loading) {
    return <div className="text-center py-10">Cargando datos...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Publicar una Opinión</h1>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
          <div>
            <p className="text-blue-800 text-sm">
              Tu comentario será anónimo. Por favor, sé respetuoso y constructivo en tus opiniones. Los comentarios
              ofensivos o inapropiados serán eliminados.
            </p>
          </div>
        </div>

        {profesor && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">Profesor seleccionado:</h2>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold mr-3">
                {formatearNombre(profesor.nombre).charAt(0)}
              </div>
              <div>
                <p className="font-medium">{formatearNombre(profesor.nombre)}</p>
                <p className="text-sm text-gray-600">{profesor.especializacion}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {!profesorId && (
              <div>
                <label htmlFor="idProfesor" className="block text-sm font-medium text-gray-700 mb-1">
                  Profesor
                </label>
                <select
                  id="idProfesor"
                  name="idProfesor"
                  value={formData.idProfesor}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona un profesor</option>
                  {profesores.map((prof) => (
                    <option key={prof._id} value={prof._id}>
                      {formatearNombre(prof.nombre)} - {prof.especializacion}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="codigoCurso" className="flex text-sm font-medium text-gray-700 mb-1 items-center">
                <BookOpen className="w-4 h-4 mr-1" /> Curso
              </label>
              <select
                id="codigoCurso"
                name="codigoCurso"
                value={formData.codigoCurso}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un curso</option>
                {cursos.map((curso) => (
                  <option key={curso._id} value={curso._id}>
                    {curso.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="calificacion" className="flex text-sm font-medium text-gray-700 mb-1 items-center">
                <Star className="w-4 h-4 mr-1" /> Calificación: {formData.calificacion}/5
              </label>
              <input
                type="range"
                id="calificacion"
                name="calificacion"
                min="1"
                max="5"
                step="1"
                value={formData.calificacion}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>

            <div>
              <label htmlFor="texto" className="block text-sm font-medium text-gray-700 mb-1">
                Tu opinión
              </label>
              <textarea
                id="texto"
                name="texto"
                rows="5"
                value={formData.texto}
                onChange={handleChange}
                placeholder="Comparte tu experiencia con este profesor..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              ></textarea>
              <p className="mt-1 text-sm text-gray-500">Mínimo 20 caracteres. Sé específico y constructivo.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? "Publicando..." : "Publicar Comentario"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PublicarComentario
