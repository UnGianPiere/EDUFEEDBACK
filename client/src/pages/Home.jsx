"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { MessageSquare, Users, BookOpen } from "lucide-react"
import axiosInstance from "../utils/axiosConfig"
import ComentarioCard from "../components/comentarios/ComentarioCard"

const Home = () => {
  const [stats, setStats] = useState({
    profesores: 0,
    comentarios: 0,
    cursos: 0
  })
  const [profesoresDestacados, setProfesoresDestacados] = useState([])
  const [comentariosRecientes, setComentariosRecientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [statsRes, profesoresRes, comentariosRes] = await Promise.all([
          axiosInstance.get("/api/stats"),
          axiosInstance.get("/api/profesores/destacados"),
          axiosInstance.get("/api/comentarios/recientes"),
        ])

        setStats(statsRes.data || { profesores: 0, comentarios: 0, cursos: 0 })
        setProfesoresDestacados(Array.isArray(profesoresRes.data) ? profesoresRes.data : [])
        setComentariosRecientes(Array.isArray(comentariosRes.data) ? comentariosRes.data : [])
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Error al cargar los datos")
        // Establecer valores por defecto en caso de error
        setStats({ profesores: 0, comentarios: 0, cursos: 0 })
        setProfesoresDestacados([])
        setComentariosRecientes([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>
  }

  return (
    <div className="grid md:grid-cols-5 gap-6">
      <div className="md:col-span-2">
        <div className="border rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <img src="/images/logo_conti.png" alt="Universidad Continental" className="h-9 mr-3" />
          </div>
          <p className="text-gray-600 mb-4">
            Bienvenido al sistema de opiniones sobre profesores de la Universidad Continental. Comparte tus experiencias
            y ayuda a otros estudiantes.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center">
              <div className="text-blue-600 mb-2">
                <Users className="w-6 h-6 mx-auto" />
              </div>
              <div className="text-2xl font-bold">{stats.profesores}</div>
              <div className="text-xs text-gray-500">Profesores</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-blue-600 mb-2">
                <MessageSquare className="w-6 h-6 mx-auto" />
              </div>
              <div className="text-2xl font-bold">{stats.comentarios}</div>
              <div className="text-xs text-gray-500">Comentarios</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-blue-600 mb-2">
                <BookOpen className="w-6 h-6 mx-auto" />
              </div>
              <div className="text-2xl font-bold">{stats.cursos}</div>
              <div className="text-xs text-gray-500">Cursos</div>
            </div>
          </div>

          <Link
            to="/publicar-comentario"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Publicar Comentario
          </Link>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="flex items-center text-lg font-semibold mb-4">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            Profesores Destacados
          </h2>
          <div className="space-y-4">
            {profesoresDestacados.map((profesor) => (
              <Link
                key={profesor._id}
                to={`/profesores/${profesor._id}`}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md"
              >
                <div className={`w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white`}>
                  {profesor.nombre.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{profesor.nombre}</div>
                  <div className="text-sm text-gray-500">{profesor.departamento}</div>
                </div>
                <div className="ml-auto">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400">
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/profesores" className="block text-center text-blue-600 hover:underline mt-4 text-sm">
            Ver todos los profesores
          </Link>
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Comentarios Recientes
            <span className="text-gray-500 text-sm font-normal ml-2">
              Últimas opiniones compartidas por estudiantes sobre los profesores
            </span>
          </h2>
          <div className="space-y-6">
            {comentariosRecientes.map((comentario) => (
              <ComentarioCard key={comentario._id} comentario={comentario} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
