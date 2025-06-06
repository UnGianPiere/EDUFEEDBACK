"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import axios from "axios"
import ProfesorCard from "../components/profesores/ProfesorCard"

const Profesores = () => {
  const [profesores, setProfesores] = useState([])
  const [filteredProfesores, setFilteredProfesores] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const res = await axios.get("/api/profesores")
        setProfesores(res.data)
        setFilteredProfesores(res.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profesores:", error)
        setLoading(false)
      }
    }

    fetchProfesores()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProfesores(profesores)
    } else {
      const filtered = profesores.filter((profesor) => {
        const nombreMatch = profesor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        // Buscar en los nombres de los cursos
        let cursosMatch = false
        if (Array.isArray(profesor.cursos)) {
          cursosMatch = profesor.cursos
            .map((c) => (typeof c === "string" ? c : c.nombre))
            .some((nombreCurso) => nombreCurso && nombreCurso.toLowerCase().includes(searchTerm.toLowerCase()))
        }
        return nombreMatch || cursosMatch
      })
      setFilteredProfesores(filtered)
    }
  }, [searchTerm, profesores])

  if (loading) {
    return <div className="text-center py-10">Cargando...</div>
  }

  return (
    <div className="border rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-2">Profesores de Ingeniería de Sistemas</h1>
      <p className="text-gray-600 mb-6">
        Conoce a los profesores de la carrera y lee las opiniones de otros estudiantes sobre ellos.
      </p>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="search"
          className="block w-full p-3 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar por nombre o curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfesores.map((profesor) => (
          <ProfesorCard key={profesor._id} profesor={profesor} />
        ))}
      </div>

      {filteredProfesores.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No se encontraron profesores con ese criterio de búsqueda.
        </div>
      )}
    </div>
  )
}

export default Profesores
