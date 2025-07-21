"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Mail, BookOpen, Star, MessageSquare } from "lucide-react"
import axiosInstance from "../utils/axiosConfig"
import ComentarioCard from "../components/comentarios/ComentarioCard"

const DetalleProfesor = () => {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfesor = async () => {
      try {
        const res = await axiosInstance.get(`/api/profesores/${id}`)
        setData(res.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profesor:", error)
        setLoading(false)
      }
    }

    fetchProfesor()
  }, [id])

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>
  }

  if (!data) {
    return <div className="text-center py-10">Profesor no encontrado</div>
  }

  const { profesor, comentarios, analisis } = data

  // Determinar la letra inicial para el avatar
  const initial = profesor.nombre.split(" ")[1]
    ? profesor.nombre.split(" ")[0][0] + profesor.nombre.split(" ")[1][0]
    : profesor.nombre.split(" ")[0][0]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="border rounded-lg p-6 sticky top-4">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-semibold mb-4">
              {initial}
            </div>
            <h1 className="text-2xl font-bold text-center">{profesor.nombre}</h1>
            <p className="text-gray-600">{profesor.especializacion}</p>
            <div className="flex items-center mt-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="font-medium">{analisis?.calificacionPromedio?.toFixed(1) || "N/A"}</span>
              <span className="text-gray-500 text-sm ml-1">({comentarios.length} {comentarios.length === 1 ? "opinión" : "opiniones"})</span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <BookOpen className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">Cursos</div>
                <div className="flex flex-col gap-1 mt-1">
                  {Array.isArray(profesor.cursos) && profesor.cursos.length > 0
                    ? profesor.cursos.map((c, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium w-fit">
                          {typeof c === 'object' && c !== null && c.nombre ? c.nombre : String(c)}
                        </span>
                      ))
                    : <span className="text-gray-400">Sin cursos asignados</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Mail className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <div className="font-medium">Correo</div>
                <div className="text-sm">{profesor.correo ? profesor.correo : <span className="text-gray-400">Sin registrar</span>}</div>
              </div>
            </div>
          </div>

          <Link
            to={`/publicar-comentario/${profesor._id}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Publicar Opinión
          </Link>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Resumen de Opiniones</h2>

          {analisis ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="border rounded-lg p-4 text-center flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{analisis.calificacionPromedio || "N/A"}</div>
                  <div className="text-sm text-gray-500">Calificación promedio</div>
                </div>
                <div className="border rounded-lg p-4 text-center flex flex-col items-center justify-center">
                  <h3 className="font-medium mb-1 text-green-700">Opiniones positivas</h3>
                  <span className="text-2xl font-bold text-green-600 mb-1">{analisis.distribucionSentimientos?.positivos || 0}</span>
                  <span className="text-xs text-gray-500">Total positivas</span>
                </div>
                <div className="border rounded-lg p-4 text-center flex flex-col items-center justify-center">
                  <h3 className="font-medium mb-1 text-yellow-700">Opiniones constructivas</h3>
                  <span className="text-2xl font-bold text-yellow-600 mb-1">{analisis.distribucionSentimientos?.neutrales || 0}</span>
                  <span className="text-xs text-gray-500">Total constructivas</span>
                </div>
                <div className="border rounded-lg p-4 text-center flex flex-col items-center justify-center">
                  <h3 className="font-medium mb-1 text-red-700">Opiniones negativas</h3>
                  <span className="text-2xl font-bold text-red-600 mb-1">{analisis.distribucionSentimientos?.negativos || 0}</span>
                  <span className="text-xs text-gray-500">Total negativas</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Fortalezas destacadas</h3>
                  {analisis.fortalezas && analisis.fortalezas.length > 0 ? (
                    <ul className="space-y-2">
                      {analisis.fortalezas.map((fortaleza, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span>{fortaleza.texto}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No hay suficientes datos para mostrar fortalezas.</p>
                  )}
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Áreas de mejora</h3>
                  {analisis.areasAMejorar && analisis.areasAMejorar.length > 0 ? (
                    <ul className="space-y-2">
                      {analisis.areasAMejorar.map((area, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                          <span>{area.texto}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No hay suficientes datos para mostrar áreas de mejora.</p>
                  )}
                </div>
              </div>

              {analisis.feedbackAutomatico && (
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-medium mb-2">Resumen automático</h3>
                  <p className="text-gray-700">{analisis.feedbackAutomatico}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No hay suficientes datos para mostrar un análisis.</p>
          )}
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Opiniones de estudiantes
            <span className="text-gray-500 text-sm font-normal ml-2">
              {comentarios.length} {comentarios.length === 1 ? "opinión" : "opiniones"}
            </span>
          </h2>

          {comentarios.length > 0 ? (
            <div className="space-y-6">
              {comentarios.map((comentario) => (
                <ComentarioCard key={comentario._id} comentario={comentario} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Aún no hay opiniones para este profesor.</p>
              <p className="mt-2">
                <Link to={`/publicar-comentario/${profesor._id}`} className="text-blue-600 hover:underline">
                  Sé el primero en opinar
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DetalleProfesor
