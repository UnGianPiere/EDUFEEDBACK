"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Filter } from "lucide-react"
import axiosInstance from "../utils/axiosConfig"
import ComentarioCard from "../components/comentarios/ComentarioCard"

const Foro = () => {
  const [comentarios, setComentarios] = useState([])
  const [filteredComentarios, setFilteredComentarios] = useState([])
  const [profesoresPopulares, setProfesoresPopulares] = useState([])
  const [temasDestacados, setTemasDestacados] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("recientes")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comentariosRes, profesoresRes, temasRes] = await Promise.all([
          axiosInstance.get("/api/comentarios"),
          axiosInstance.get("/api/profesores/populares"),
          axiosInstance.get("/api/comentarios/temas-destacados"), // Cambiar de "/api/comentarios/temas" a "/api/comentarios/temas-destacados"
        ])

        setComentarios(comentariosRes.data || [])
        setFilteredComentarios(comentariosRes.data || [])
        setProfesoresPopulares(profesoresRes.data || [])
        setTemasDestacados(temasRes.data || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setComentarios([])
        setFilteredComentarios([])
        setProfesoresPopulares([])
        setTemasDestacados([])
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Lógica de filtrado
  useEffect(() => {
    let filtered = [...comentarios]
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (comentario) =>
          comentario.nombreProfesor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comentario.texto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          comentario.codigoCurso.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    switch (activeFilter) {
      case "recientes":
        filtered.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))
        break
      case "populares":
        filtered.sort((a, b) => b.likes - a.likes)
        break
      case "positivos":
        filtered = filtered.filter((c) => c.analisis?.sentimiento === "Positivo")
        break
      case "criticos":
        filtered = filtered.filter((c) => c.analisis?.sentimiento === "Crítico (constructivo)")
        break
      case "negativos":
        filtered = filtered.filter((c) => c.analisis?.sentimiento === "Negativo")
        break
      default:
        break
    }
    setFilteredComentarios(filtered)
  }, [searchTerm, activeFilter, comentarios])

  // Agrupar comentarios y respuestas
  const comentariosPrincipales = filteredComentarios.filter((c) => !c.parentId)
  const respuestasPorPadre = filteredComentarios.reduce((acc, c) => {
    if (c.parentId) {
      acc[c.parentId] = acc[c.parentId] || []
      acc[c.parentId].push(c)
    }
    return acc
  }, {})

  // Función para responder
  const handleReply = async (texto, parentId) => {
    try {
      await axiosInstance.post("/api/comentarios", {
        texto,
        parentId,
        idProfesor: comentarios.find((c) => c._id === parentId)?.idProfesor,
        idEstudiante: null, // El backend lo toma del token
        nombreProfesor: comentarios.find((c) => c._id === parentId)?.nombreProfesor,
        codigoCurso: comentarios.find((c) => c._id === parentId)?.codigoCurso,
        calificacion: 3,
      })
      // Refrescar comentarios
      const comentariosRes = await axiosInstance.get("/api/comentarios")
      setComentarios(comentariosRes.data)
    } catch (error) {
      console.error("Error al responder comentario:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Foro de Comentarios</h1>
            <p className="text-gray-600">Explora opiniones anónimas sobre profesores</p>
          </div>
          <Link
            to="/publicar-comentario"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            Publicar Comentario
          </Link>
        </div>

        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Comentarios</h2>
          <p className="text-sm text-gray-500 mb-4">Filtra y busca comentarios sobre profesores</p>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="search"
              className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por profesor o curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-2.5 bottom-2.5">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            <button
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                activeFilter === "recientes"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter("recientes")}
            >
              Recientes
            </button>
            <button
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                activeFilter === "populares"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter("populares")}
            >
              Populares
            </button>
            <button
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                activeFilter === "positivos"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter("positivos")}
            >
              Positivos
            </button>
            <button
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                activeFilter === "criticos"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter("criticos")}
            >
              Críticos
            </button>
            <button
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                activeFilter === "negativos"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter("negativos")}
            >
              Negativos
            </button>
          </div>

          <div className="space-y-6">
            {comentariosPrincipales.map((comentario) => (
              <ComentarioCard
                key={comentario._id}
                comentario={comentario}
                respuestas={respuestasPorPadre[comentario._id] || []}
                onReply={handleReply}
              />
            ))}

            {comentariosPrincipales.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No se encontraron comentarios con ese criterio de búsqueda.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="flex items-center text-lg font-semibold mb-4">
            <span className="text-blue-600 mr-2">⭐</span>
            Profesores Populares
          </h2>
          <div className="space-y-3">
            {profesoresPopulares.map((profesor) => (
              <div key={profesor._id} className="flex justify-between items-center">
                <Link to={`/profesores/${profesor._id}`} className="hover:text-blue-600">
                  {profesor.nombre}
                </Link>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {profesor.totalComentarios || profesor.comentarios || 0} comentarios
                </span>
              </div>
            ))}
          </div>
          <Link to="/profesores" className="block text-center text-blue-600 hover:underline mt-4 text-sm">
            Ver todos los profesores
          </Link>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="flex items-center text-lg font-semibold mb-4">
            <span className="text-blue-600 mr-2">💬</span>
            Temas Destacados
          </h2>
          <div className="flex flex-wrap gap-2">
            {temasDestacados.map((tema, index) => (
              <span
                key={index}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm cursor-pointer"
                onClick={() => setSearchTerm(tema)}
              >
                {tema}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Foro
