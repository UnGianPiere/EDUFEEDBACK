"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Users, MessageSquare, UserCheck, Star, BarChart2, Trash2, Edit } from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const Informes = () => {
  const { user, authChecked } = useContext(AuthContext)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [usuarios, setUsuarios] = useState([])
  const [comentarios, setComentarios] = useState([])
  const [profesores, setProfesores] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [cursos, setCursos] = useState([])
  const [cursosFiltrados, setCursosFiltrados] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })
  const [search, setSearch] = useState("")
  const [sentimientoFilter, setSentimientoFilter] = useState("")
  const [departamentoFilter, setDepartamentoFilter] = useState("")
  const [showProfesorModal, setShowProfesorModal] = useState(false)
  const [selectedProfesor, setSelectedProfesor] = useState(null)
  const [profesorForm, setProfesorForm] = useState({
    nombre: "",
    especializacion: "",
    departamento: "",
    email: "",
    cursos: [],
    biografia: "",
  })

  const [controlDocenteData, setControlDocenteData] = useState(null)
  const [selectedProfesorAnalisis, setSelectedProfesorAnalisis] = useState(null)
  const [filtros, setFiltros] = useState({
    departamento: "",
    curso: "",
    periodo: "2025-1",
    busqueda: "",
  })
  const [profesoresParaAnalisis, setProfesoresParaAnalisis] = useState([])

  useEffect(() => {
    // Verificar que el usuario sea administrador
    if (authChecked) {
      if (!user) {
        navigate("/login")
        return
      }

      if (user.rol !== "admin") {
        toast.error("No tienes permisos para acceder a esta página")
        navigate("/")
        return
      }

      // Cargar estadísticas iniciales
      fetchEstadisticas()
    }
  }, [user, authChecked, navigate])

  useEffect(() => {
    // Cargar datos según la pestaña activa
    if (activeTab === "usuarios") {
      fetchUsuarios()
    } else if (activeTab === "comentarios") {
      fetchComentarios()
    } else if (activeTab === "profesores") {
      fetchDepartamentos()
      fetchProfesores()
    }
  }, [activeTab, pagination.page])

  useEffect(() => {
    if (selectedProfesor) {
      setProfesorForm({
        nombre: selectedProfesor.nombre,
        especializacion: selectedProfesor.especializacion,
        departamento: selectedProfesor.departamento,
        email: selectedProfesor.email || "",
        cursos: selectedProfesor.cursos || [],
        biografia: selectedProfesor.biografia || "",
      })
    } else {
      resetProfesorForm()
    }
  }, [selectedProfesor])

  // Fetch cursos al abrir modal de profesor
  useEffect(() => {
    if (showProfesorModal) {
      axios
        .get("/api/cursos")
        .then((res) => setCursos(res.data))
        .catch(() => setCursos([]))
    }
  }, [showProfesorModal])

  // Filtrar cursos según departamento seleccionado
  useEffect(() => {
    if (!profesorForm.departamento) {
      setCursosFiltrados([])
      return
    }
    // Buscar nombre del departamento seleccionado
    const deptoObj = departamentos.find((d) => d._id === profesorForm.departamento)
    const nombreDepto = deptoObj ? deptoObj.nombre : null
    // Mostrar cursos cuyo departamento sea el seleccionado o "General"
    setCursosFiltrados(cursos.filter((c) => c.departamento === nombreDepto || c.departamento === "General"))
  }, [profesorForm.departamento, cursos, departamentos])

  useEffect(() => {
    if (activeTab === "control-docente") {
      console.log("=== USEEFFECT CONTROL DOCENTE ===")
      console.log("Tab activo:", activeTab)
      console.log("Filtros:", filtros)

      // Agregar un pequeño delay para evitar múltiples llamadas
      const timeoutId = setTimeout(() => {
        fetchControlDocenteData()
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [activeTab, filtros.departamento, filtros.curso, filtros.periodo, filtros.busqueda])

  const fetchEstadisticas = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/informes/estadisticas")
      setStats(res.data)
      setLoading(false)
    } catch (error) {
      console.error("Error al cargar estadísticas:", error)
      toast.error("Error al cargar estadísticas")
      setLoading(false)
    }
  }

  const fetchUsuarios = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `/api/informes/usuarios?page=${pagination.page}&limit=${pagination.limit}&search=${search}`,
      )
      setUsuarios(res.data.usuarios)
      setPagination(res.data.pagination)
      setLoading(false)
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      toast.error("Error al cargar usuarios")
      setLoading(false)
    }
  }

  const fetchComentarios = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `/api/informes/comentarios?page=${pagination.page}&limit=${pagination.limit}&search=${search}&sentimiento=${sentimientoFilter}`,
      )
      setComentarios(res.data.comentarios)
      setPagination(res.data.pagination)
      setLoading(false)
    } catch (error) {
      console.error("Error al cargar comentarios:", error)
      toast.error("Error al cargar comentarios")
      setLoading(false)
    }
  }

  const fetchProfesores = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `/api/informes/profesores?page=${pagination.page}&limit=${pagination.limit}&search=${search}&departamento=${departamentoFilter}`,
      )
      setProfesores(res.data.profesores)
      setPagination(res.data.pagination)
      setLoading(false)
    } catch (error) {
      console.error("Error al cargar profesores:", error)
      toast.error("Error al cargar profesores")
      setLoading(false)
    }
  }

  const fetchDepartamentos = async () => {
    try {
      const res = await axios.get("/api/informes/departamentos")
      setDepartamentos(res.data)
    } catch (error) {
      console.error("Error al cargar departamentos:", error)
      toast.error("Error al cargar departamentos")
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination({ ...pagination, page: 1 })
    if (activeTab === "usuarios") {
      fetchUsuarios()
    } else if (activeTab === "comentarios") {
      fetchComentarios()
    } else if (activeTab === "profesores") {
      fetchProfesores()
    }
  }

  const handleSentimientoFilter = (sentimiento) => {
    setSentimientoFilter(sentimiento)
    setPagination({ ...pagination, page: 1 })
    setTimeout(() => {
      fetchComentarios()
    }, 100)
  }

  const handleDeleteComentario = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este comentario?")) {
      return
    }

    try {
      await axios.delete(`/api/informes/comentarios/${id}`)
      toast.success("Comentario eliminado correctamente")
      fetchComentarios()
      // Actualizar estadísticas
      fetchEstadisticas()
    } catch (error) {
      console.error("Error al eliminar comentario:", error)
      toast.error("Error al eliminar comentario")
    }
  }

  const handleChangeUserRole = async (userId, newRole) => {
    try {
      await axios.put(`/api/informes/usuarios/${userId}/rol`, { rol: newRole })
      toast.success("Rol de usuario actualizado correctamente")
      fetchUsuarios()
    } catch (error) {
      console.error("Error al cambiar rol de usuario:", error)
      toast.error("Error al cambiar rol de usuario")
    }
  }

  const handleDeleteProfesor = async (id) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este profesor? Esta acción eliminará también todos sus comentarios asociados.",
      )
    ) {
      return
    }

    try {
      await axios.delete(`/api/profesores/${id}`)
      toast.success("Profesor eliminado correctamente")
      fetchProfesores()
      fetchEstadisticas()
    } catch (error) {
      console.error("Error al eliminar profesor:", error)
      toast.error("Error al eliminar profesor")
    }
  }

  const handleProfesorSubmit = async (e) => {
    e.preventDefault()

    try {
      if (selectedProfesor) {
        // Actualizar profesor existente
        await axios.put(`/api/profesores/${selectedProfesor._id}`, profesorForm)
        toast.success("Profesor actualizado correctamente")
      } else {
        // Crear nuevo profesor
        await axios.post("/api/profesores", profesorForm)
        toast.success("Profesor creado correctamente")
      }

      setShowProfesorModal(false)
      setSelectedProfesor(null)
      resetProfesorForm()
      fetchProfesores()
      fetchEstadisticas()
    } catch (error) {
      console.error("Error al guardar profesor:", error)
      toast.error("Error al guardar profesor")
    }
  }

  // Adaptar el cambio de formulario para cursos (select múltiple)
  const handleProfesorFormChange = (e) => {
    const { name, value, type, multiple, options } = e.target
    if (name === "departamento") {
      // Reset cursos when department changes
      setProfesorForm({ ...profesorForm, departamento: value, cursos: [] })
    } else if (name === "cursos" && multiple) {
      const selected = Array.from(options)
        .filter((o) => o.selected)
        .map((o) => o.value)
      setProfesorForm({ ...profesorForm, cursos: selected })
    } else {
      setProfesorForm({ ...profesorForm, [name]: value })
    }
  }

  const resetProfesorForm = () => {
    setProfesorForm({
      nombre: "",
      especializacion: "",
      departamento: "",
      email: "",
      cursos: [],
      biografia: "",
    })
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  const fetchControlDocenteData = async () => {
    try {
      console.log("=== FETCH CONTROL DOCENTE ===")
      console.log("Filtros actuales:", filtros)

      setLoading(true)

      // Primero cargar departamentos y cursos si no están cargados
      if (departamentos.length === 0) {
        console.log("Cargando departamentos...")
        await fetchDepartamentos()
      }
      if (cursos.length === 0) {
        console.log("Cargando cursos...")
        const cursosRes = await axios.get("/api/cursos")
        setCursos(cursosRes.data)
      }

      console.log("Haciendo request a control-docente con params:", filtros)
      const res = await axios.get("/api/informes/control-docente", {
        params: filtros,
      })

      console.log("Response recibida:", res.data)
      setProfesoresParaAnalisis(res.data.profesores)

      // Si hay profesores y no hay uno seleccionado, seleccionar el primero
      if (res.data.profesores.length > 0) {
        if (!selectedProfesorAnalisis) {
          const primerProfesor = res.data.profesores[0]
          console.log("Seleccionando primer profesor:", primerProfesor.nombre)
          setSelectedProfesorAnalisis(primerProfesor)
          await fetchProfesorAnalisisDetallado(primerProfesor._id)
        }
      } else {
        console.log("No se encontraron profesores")
        setSelectedProfesorAnalisis(null)
        setControlDocenteData(null)
      }

      setLoading(false)
    } catch (error) {
      console.error("=== ERROR FETCH CONTROL DOCENTE ===")
      console.error("Error completo:", error)
      console.error("Response data:", error.response?.data)
      toast.error(`Error al cargar datos de control docente: ${error.response?.data?.message || error.message}`)
      setLoading(false)
    }
  }

  const fetchProfesorAnalisisDetallado = async (profesorId) => {
    try {
      console.log("=== FETCH ANÁLISIS DETALLADO ===")
      console.log("ID del profesor:", profesorId)

      const res = await axios.get(`/api/informes/profesor-analisis/${profesorId}`)
      console.log("Análisis recibido:", res.data)
      setControlDocenteData(res.data)
    } catch (error) {
      console.error("=== ERROR ANÁLISIS DETALLADO ===")
      console.error("Error completo:", error)
      console.error("Response data:", error.response?.data)
      toast.error(`Error al cargar análisis detallado: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleFiltroChange = (campo, valor) => {
    console.log(`=== CAMBIO DE FILTRO ===`)
    console.log(`Campo: ${campo}, Valor: ${valor}`)

    setFiltros((prev) => {
      const newFiltros = { ...prev, [campo]: valor }

      // Si cambia el departamento, resetear el curso
      if (campo === "departamento") {
        newFiltros.curso = ""
        console.log("Reseteando curso por cambio de departamento")
      }

      console.log("Nuevos filtros:", newFiltros)
      return newFiltros
    })

    // Resetear profesor seleccionado cuando cambian los filtros
    setSelectedProfesorAnalisis(null)
    setControlDocenteData(null)
  }

  const handleProfesorSelect = (profesor) => {
    setSelectedProfesorAnalisis(profesor)
    if (profesor) {
      fetchProfesorAnalisisDetallado(profesor._id)
    }
  }

  if (loading && !stats) {
    return <div className="text-center py-10">Cargando...</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="border rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

        {/* Tabs */}
        <div className="border-b mb-6">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${
                  activeTab === "dashboard"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <BarChart2 className="w-5 h-5 inline-block mr-1" />
                Dashboard
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${
                  activeTab === "usuarios"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("usuarios")}
              >
                <Users className="w-5 h-5 inline-block mr-1" />
                Usuarios
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${
                  activeTab === "comentarios"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("comentarios")}
              >
                <MessageSquare className="w-5 h-5 inline-block mr-1" />
                Comentarios
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${
                  activeTab === "profesores"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("profesores")}
              >
                <Users className="w-5 h-5 inline-block mr-1" />
                Profesores
              </button>
            </li>
            <li className="mr-2">
              <button
                className={`inline-block p-4 ${
                  activeTab === "control-docente"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("control-docente")}
              >
                <BarChart2 className="w-5 h-5 inline-block mr-1" />
                Control Docente
              </button>
            </li>
          </ul>
        </div>

        {/* Dashboard */}
        {activeTab === "dashboard" && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border rounded-lg p-6 bg-blue-50">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Usuarios</h3>
                    <p className="text-3xl font-bold">{stats.usuarios.total}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Verificados: {stats.usuarios.verificados}</span>
                  <span>{stats.usuarios.porcentajeVerificados}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${stats.usuarios.porcentajeVerificados}%` }}
                  ></div>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-green-50">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Comentarios</h3>
                    <p className="text-3xl font-bold">{stats.comentarios.total}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="flex justify-between">
                      <span>Positivos</span>
                      <span className="font-medium">{stats.comentarios.porcentajePositivos}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${stats.comentarios.porcentajePositivos}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Críticos</span>
                      <span className="font-medium">{stats.comentarios.porcentajeCriticos}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${stats.comentarios.porcentajeCriticos}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span>Negativos</span>
                      <span className="font-medium">{stats.comentarios.porcentajeNegativos}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${stats.comentarios.porcentajeNegativos}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6 bg-purple-50">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Profesores</h3>
                    <p className="text-3xl font-bold">{stats.profesores.total}</p>
                  </div>
                </div>
                <div className="text-sm">
                  <p className="mb-1">Top profesores por calificación:</p>
                  {stats.profesores.mejorCalificados.slice(0, 3).map((profesor, index) => (
                    <div key={profesor._id} className="flex justify-between items-center mb-1">
                      <span>
                        {index + 1}. {profesor.nombre}
                      </span>
                      <span className="font-medium">{profesor.calificacionPromedio}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Profesores Más Comentados</h3>
                <div className="space-y-4">
                  {stats.profesores.masComentados.map((profesor) => (
                    <div key={profesor._id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{profesor.nombre}</div>
                        <div className="text-sm text-gray-500">{profesor.totalComentarios} comentarios</div>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span>{profesor.calificacionPromedio}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Usuarios Más Activos</h3>
                <div className="space-y-4">
                  {stats.usuariosMasActivos && stats.usuariosMasActivos.length > 0 ? (
                    stats.usuariosMasActivos.map((usuario, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{usuario.nombreUsuario || "Usuario sin nombre"}</div>
                          <div className="text-sm text-gray-500 truncate">{usuario.correo || "Sin correo"}</div>
                        </div>
                        <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {usuario.totalComentarios} comentarios
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-sm">No hay usuarios activos para mostrar</div>
                  )}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Comentarios Recientes</h3>
              <div className="space-y-4">
                {stats.comentariosRecientes.map((comentario) => (
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
                    {comentario.analisis?.sentimiento && (
                      <div className="mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            comentario.analisis.sentimiento === "Positivo"
                              ? "bg-green-100 text-green-800"
                              : comentario.analisis.sentimiento === "Crítico (constructivo)"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {comentario.analisis.sentimiento}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Usuarios */}
        {activeTab === "usuarios" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="search"
                  placeholder="Buscar usuarios..."
                  className="border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                  Buscar
                </button>
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left">Nombre</th>
                    <th className="py-3 px-4 text-left">Correo</th>
                    <th className="py-3 px-4 text-left">Rol</th>
                    <th className="py-3 px-4 text-left">Verificado</th>
                    <th className="py-3 px-4 text-left">Fecha de Registro</th>
                    <th className="py-3 px-4 text-left">Último Acceso</th>
                    <th className="py-3 px-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario._id} className="border-t hover:bg-gray-50">
                      <td className="py-3 px-4">{usuario.nombreUsuario}</td>
                      <td className="py-3 px-4">{usuario.correo}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            usuario.rol === "admin"
                              ? "bg-red-100 text-red-800"
                              : usuario.rol === "moderador"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {usuario.verificado ? (
                          <span className="text-green-600">
                            <UserCheck className="w-5 h-5" />
                          </span>
                        ) : (
                          <span className="text-red-600">No</span>
                        )}
                      </td>
                      <td className="py-3 px-4">{formatDate(usuario.fechaCreacion)}</td>
                      <td className="py-3 px-4">{formatDate(usuario.ultimoAcceso)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={usuario.rol}
                            onChange={(e) => handleChangeUserRole(usuario._id, e.target.value)}
                          >
                            <option value="estudiante">Estudiante</option>
                            <option value="moderador">Moderador</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded-l-md disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPagination({ ...pagination, page: i + 1 })}
                      className={`px-3 py-1 border-t border-b ${
                        pagination.page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })
                    }
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border rounded-r-md disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}

        {/* Comentarios */}
        {activeTab === "comentarios" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-xl font-semibold">Gestión de Comentarios</h2>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSentimientoFilter("")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      sentimientoFilter === "" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => handleSentimientoFilter("Positivo")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      sentimientoFilter === "Positivo"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    Positivos
                  </button>
                  <button
                    onClick={() => handleSentimientoFilter("Crítico (constructivo)")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      sentimientoFilter === "Crítico (constructivo)"
                        ? "bg-yellow-600 text-white"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}
                  >
                    Críticos
                  </button>
                  <button
                    onClick={() => handleSentimientoFilter("Negativo")}
                    className={`px-3 py-1 rounded-full text-sm ${
                      sentimientoFilter === "Negativo"
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    Negativos
                  </button>
                </div>

                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="search"
                    placeholder="Buscar comentarios..."
                    className="border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                    Buscar
                  </button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              {comentarios.map((comentario) => (
                <div key={comentario._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
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

                  <p className="text-gray-700 mb-3">{comentario.texto}</p>

                  <div className="flex justify-between items-center">
                    <div>
                      {comentario.analisis?.sentimiento && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            comentario.analisis.sentimiento === "Positivo"
                              ? "bg-green-100 text-green-800"
                              : comentario.analisis.sentimiento === "Crítico (constructivo)"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {comentario.analisis.sentimiento}
                        </span>
                      )}

                      {comentario.analisis?.temas && comentario.analisis.temas.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {comentario.analisis.temas.map((tema, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                              {tema}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteComentario(comentario._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar comentario"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {comentarios.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No se encontraron comentarios con los criterios de búsqueda.
                </div>
              )}
            </div>

            {/* Paginación */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded-l-md disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPagination({ ...pagination, page: i + 1 })}
                      className={`px-3 py-1 border-t border-b ${
                        pagination.page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })
                    }
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border rounded-r-md disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}

        {/* Profesores */}
        {activeTab === "profesores" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestión de Profesores</h2>
              <button
                onClick={() => setShowProfesorModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Añadir Profesor
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <div className="flex space-x-2">
                <select
                  className="border rounded-md px-3 py-2"
                  value={departamentoFilter}
                  onChange={(e) => {
                    setDepartamentoFilter(e.target.value)
                    setPagination({ ...pagination, page: 1 })
                    setTimeout(() => fetchProfesores(), 100)
                  }}
                >
                  <option value="">Todos los departamentos</option>
                  {departamentos.map((depto) => (
                    <option key={depto._id} value={depto._id}>
                      {depto.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <form onSubmit={handleSearch} className="flex">
                <input
                  type="search"
                  placeholder="Buscar profesores..."
                  className="border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                  Buscar
                </button>
              </form>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left">Nombre</th>
                    <th className="py-3 px-4 text-left">Especialización</th>
                    <th className="py-3 px-4 text-left">Departamento</th>
                    <th className="py-3 px-4 text-left">Calificación</th>
                    <th className="py-3 px-4 text-left">Cursos</th>
                    <th className="py-3 px-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {profesores.map((profesor) => {
                    // Buscar el nombre del departamento por su _id
                    const deptoObj = departamentos.find((d) => d._id === profesor.departamento)
                    const nombreDepto = deptoObj ? deptoObj.nombre : profesor.departamento

                    // Mostrar nombres de cursos - mejorado
                    let cursosNombres = ""
                    if (Array.isArray(profesor.cursos) && profesor.cursos.length > 0) {
                      if (typeof profesor.cursos[0] === "object" && profesor.cursos[0] !== null) {
                        // Si los cursos están poblados
                        cursosNombres = profesor.cursos.map((c) => c.nombre || c.codigo || "Sin nombre").join(", ")
                      } else {
                        // Si son solo IDs, buscar en la lista de cursos
                        cursosNombres = profesor.cursos
                          .map((cid) => {
                            const c = cursos.find((cu) => cu._id === cid)
                            return c ? c.nombre : "Curso no encontrado"
                          })
                          .join(", ")
                      }
                    } else {
                      cursosNombres = "Sin cursos asignados"
                    }

                    return (
                      <tr key={profesor._id} className="border-t hover:bg-gray-50">
                        <td className="py-3 px-4">{profesor.nombre}</td>
                        <td className="py-3 px-4">{profesor.especializacion || "No especificada"}</td>
                        <td className="py-3 px-4">{nombreDepto}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.round(profesor.calificacionPromedio || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="ml-2">{profesor.calificacionPromedio || "0.0"}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <div className="truncate" title={cursosNombres}>
                            {cursosNombres}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedProfesor(profesor)
                                setShowProfesorModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Editar profesor"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProfesor(profesor._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Eliminar profesor"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {profesores.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No se encontraron profesores con los criterios de búsqueda.
              </div>
            )}

            {/* Paginación */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded-l-md disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPagination({ ...pagination, page: i + 1 })}
                      className={`px-3 py-1 border-t border-b ${
                        pagination.page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })
                    }
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border rounded-r-md disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            )}

            {/* Modal para añadir/editar profesor */}
            {showProfesorModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedProfesor ? "Editar Profesor" : "Añadir Nuevo Profesor"}
                  </h2>

                  <form onSubmit={handleProfesorSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={profesorForm.nombre}
                          onChange={handleProfesorFormChange}
                          className="w-full border rounded-md px-3 py-2"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="especializacion" className="block text-sm font-medium text-gray-700 mb-1">
                          Especialización (opcional)
                        </label>
                        <input
                          type="text"
                          id="especializacion"
                          name="especializacion"
                          value={profesorForm.especializacion}
                          onChange={handleProfesorFormChange}
                          className="w-full border rounded-md px-3 py-2"
                          // No required
                        />
                      </div>

                      <div>
                        <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-1">
                          Departamento
                        </label>
                        <select
                          id="departamento"
                          name="departamento"
                          value={profesorForm.departamento}
                          onChange={handleProfesorFormChange}
                          className="w-full border rounded-md px-3 py-2"
                          required
                        >
                          <option value="">Seleccionar departamento</option>
                          {departamentos.map((depto) => (
                            <option key={depto._id} value={depto._id}>
                              {depto.nombre}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profesorForm.email}
                          onChange={handleProfesorFormChange}
                          className="w-full border rounded-md px-3 py-2"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="cursos" className="block text-sm font-medium text-gray-700 mb-1">
                        Cursos (elige uno o más)
                      </label>
                      <div className="w-full border rounded-md px-3 py-2 min-h-32 max-h-60 overflow-y-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cursosFiltrados.map((curso) => (
                          <label key={curso._id} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="cursos"
                              value={curso._id}
                              checked={profesorForm.cursos.includes(curso._id)}
                              onChange={(e) => {
                                let newCursos
                                if (e.target.checked) {
                                  newCursos = [...profesorForm.cursos, curso._id]
                                } else {
                                  newCursos = profesorForm.cursos.filter((id) => id !== curso._id)
                                }
                                setProfesorForm({ ...profesorForm, cursos: newCursos })
                              }}
                              className="accent-blue-600"
                            />
                            <span>
                              {curso.nombre} ({curso.codigo})
                            </span>
                          </label>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Solo se muestran cursos del departamento seleccionado o generales.
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="oficina" className="block text-sm font-medium text-gray-700 mb-1">
                        Oficina (opcional)
                      </label>
                      <input
                        type="text"
                        id="oficina"
                        name="oficina"
                        value={profesorForm.oficina || ""}
                        onChange={handleProfesorFormChange}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="horarioAtencion" className="block text-sm font-medium text-gray-700 mb-1">
                        Horario de atención (opcional)
                      </label>
                      <input
                        type="text"
                        id="horarioAtencion"
                        name="horarioAtencion"
                        value={profesorForm.horarioAtencion || ""}
                        onChange={handleProfesorFormChange}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="urlFoto" className="block text-sm font-medium text-gray-700 mb-1">
                        URL de foto (opcional)
                      </label>
                      <input
                        type="text"
                        id="urlFoto"
                        name="urlFoto"
                        value={profesorForm.urlFoto || ""}
                        onChange={handleProfesorFormChange}
                        className="w-full border rounded-md px-3 py-2"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfesorModal(false)
                          setSelectedProfesor(null)
                          resetProfesorForm()
                        }}
                        className="px-4 py-2 border rounded-md"
                      >
                        Cancelar
                      </button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        {selectedProfesor ? "Actualizar" : "Guardar"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Control Docente */}
        {/* BLOQUE ELIMINADO: Todo el dashboard y análisis de control docente ahora está en ControlDocenteAdmin.jsx */}

      </div>

      {/* Footer */}
      <div className="border rounded-lg p-6 text-center mb-8">
        <div className="flex flex-col items-center">
          <img src="/images/logo_conti.png" alt="Universidad Continental" className="h-16 mb-4" />
          <p className="text-gray-600">Panel de Administración - EduFeedback</p>
          <p className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} Universidad Continental. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Informes
