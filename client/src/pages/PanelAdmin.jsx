"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import {
    Users,
    MessageSquare,
    UserCheck,
    Star,
    BarChart2,
    Trash2,
    Edit,
    Search,
    Download,
    Brain,
    TrendingUp,
    GraduationCap,
    RefreshCw,
} from "lucide-react"
import axios from "axios"
import toast from "react-hot-toast"

const PanelAdmin = () => {
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

    // Estados para Control Docente
    const [selectedProfesorAnalisis, setSelectedProfesorAnalisis] = useState(null)
    const [analisisData, setAnalisisData] = useState(null)
    const [loadingAnalisis, setLoadingAnalisis] = useState(false)
    const [filtros, setFiltros] = useState({
        departamento: "",
        curso: "",
        periodo: "",
        profesor: "",
    })
    const [llmAnalysis, setLlmAnalysis] = useState(null)
    const [loadingLLM, setLoadingLLM] = useState(false)

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
            fetchDepartamentos()
        }
    }, [user, authChecked, navigate])

    useEffect(() => {
        // Cargar datos según la pestaña activa
        if (activeTab === "usuarios") {
            fetchUsuarios()
        } else if (activeTab === "comentarios") {
            fetchComentarios()
        } else if (activeTab === "profesores") {
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

    const fetchAnalisisProfesor = async (profesorId) => {
        try {
            setLoadingAnalisis(true)
            const res = await axios.get(`/api/informes/analisis-profesor/${profesorId}`)
            setAnalisisData(res.data)
            setLoadingAnalisis(false)
        } catch (error) {
            console.error("Error al cargar análisis del profesor:", error)
            toast.error("Error al cargar análisis del profesor")
            setLoadingAnalisis(false)
        }
    }

    const generateLLMAnalysis = async (profesorId) => {
        try {
            setLoadingLLM(true)

            // Simulación por ahora - reemplazar con llamada real a la API
            const simulatedAnalysis = {
                resumenEjecutivo: `El docente mantiene un tono adecuado y motivador en el aula, destacando por su claridad al explicar contenidos. Sin embargo, se evidencia una deficiencia persistente en la aplicación práctica de los temas, particularmente en la ausencia de ejercicios guiados.`,
                fortalezas: [
                    "Los estudiantes valoran el entusiasmo de la docente y su disposición para resolver dudas en clase.",
                    "Se percibe claridad en los conceptos teóricos fundamentales.",
                ],
                debilidades: [
                    "Se reporta de forma recurrente una carencia de ejercicios resueltos en clase.",
                    "Los comentarios reflejan que la conexión entre teoría y práctica es limitada.",
                ],
                recomendaciones: [
                    "Incorporar ejercicios guiados en clase como parte del desarrollo del tema.",
                    "Utilizar ejemplos reales o contextualizados para reforzar la comprensión práctica.",
                ],
            }

            // Simular delay de API
            await new Promise((resolve) => setTimeout(resolve, 2000))

            setLlmAnalysis(simulatedAnalysis)
            setLoadingLLM(false)

            // TODO: Reemplazar con llamada real a la API
            /*
            const res = await axios.post(process.env.REACT_APP_LLM_API_URL || '/api/llm/analyze', {
              profesorId,
              comentarios: analisisData?.comentarios || []
            })
            setLlmAnalysis(res.data)
            setLoadingLLM(false)
            */
        } catch (error) {
            console.error("Error al generar análisis LLM:", error)
            toast.error("Error al generar análisis con IA")
            setLoadingLLM(false)
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

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case "Positivo":
                return "bg-green-100 text-green-800"
            case "Crítico (constructivo)":
                return "bg-yellow-100 text-yellow-800"
            case "Negativo":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getSentimentTags = () => {
        return [
            { name: "anticipación", color: "bg-blue-100 text-blue-800" },
            { name: "miedo", color: "bg-purple-100 text-purple-800" },
            { name: "negativo", color: "bg-red-100 text-red-800" },
            { name: "tristeza", color: "bg-gray-100 text-gray-800" },
            { name: "confianza", color: "bg-green-100 text-green-800" },
            { name: "ira", color: "bg-red-200 text-red-900" },
            { name: "disgusto", color: "bg-orange-100 text-orange-800" },
            { name: "alegría", color: "bg-yellow-100 text-yellow-800" },
            { name: "positivo", color: "bg-green-200 text-green-900" },
            { name: "sorpresa", color: "bg-pink-100 text-pink-800" },
        ]
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
                                className={`inline-block p-4 ${activeTab === "dashboard"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("dashboard")}
                            >
                                <BarChart2 className="w-5 h-5 inline-block mr-1" />
                                Dashboard General
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                className={`inline-block p-4 ${activeTab === "control-docente"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("control-docente")}
                            >
                                <GraduationCap className="w-5 h-5 inline-block mr-1" />
                                Control Docente
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                className={`inline-block p-4 ${activeTab === "usuarios"
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
                                className={`inline-block p-4 ${activeTab === "comentarios"
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
                                className={`inline-block p-4 ${activeTab === "profesores"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("profesores")}
                            >
                                <Users className="w-5 h-5 inline-block mr-1" />
                                Gestión Profesores
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Dashboard General */}
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
                                                            className={`w-4 h-4 ${i < comentario.calificacion ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
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
                                                    className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(comentario.analisis.sentimiento)}`}
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

                {/* Control Docente */}
                {activeTab === "control-docente" && (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">Análisis de Sentimientos - Control Docente</h2>

                            {/* Filtros */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                                        <select
                                            className="w-full border rounded-md px-3 py-2"
                                            value={filtros.departamento}
                                            onChange={(e) => setFiltros({ ...filtros, departamento: e.target.value })}
                                        >
                                            <option value="">Todos los departamentos</option>
                                            {departamentos.map((depto) => (
                                                <option key={depto._id} value={depto._id}>
                                                    {depto.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
                                        <select
                                            className="w-full border rounded-md px-3 py-2"
                                            value={filtros.curso}
                                            onChange={(e) => setFiltros({ ...filtros, curso: e.target.value })}
                                        >
                                            <option value="">Todos los cursos</option>
                                            {cursos.map((curso) => (
                                                <option key={curso._id} value={curso._id}>
                                                    {curso.nombre} ({curso.codigo})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                                        <select
                                            className="w-full border rounded-md px-3 py-2"
                                            value={filtros.periodo}
                                            onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
                                        >
                                            <option value="">Todos los períodos</option>
                                            <option value="2025-1">2025-1</option>
                                            <option value="2024-2">2024-2</option>
                                            <option value="2024-1">2024-1</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Profesor</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Buscar profesor..."
                                                className="w-full border rounded-md pl-10 pr-3 py-2"
                                                value={filtros.profesor}
                                                onChange={(e) => setFiltros({ ...filtros, profesor: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags de Sentimientos */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium mb-3">Sentimientos</h3>
                                <div className="flex flex-wrap gap-2">
                                    {getSentimentTags().map((tag) => (
                                        <span
                                            key={tag.name}
                                            className={`px-3 py-1 rounded-full text-sm ${tag.color} cursor-pointer hover:opacity-80`}
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Lista de Profesores para Análisis */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Lista de Profesores */}
                                <div className="lg:col-span-1">
                                    <h3 className="text-lg font-medium mb-4">Profesores</h3>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {profesores.map((profesor) => (
                                            <div
                                                key={profesor._id}
                                                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${selectedProfesorAnalisis?._id === profesor._id ? "bg-blue-50 border-blue-300" : ""
                                                    }`}
                                                onClick={() => {
                                                    setSelectedProfesorAnalisis(profesor)
                                                    fetchAnalisisProfesor(profesor._id)
                                                    setLlmAnalysis(null) // Reset LLM analysis when changing professor
                                                }}
                                            >
                                                <div className="font-medium">{profesor.nombre}</div>
                                                <div className="text-sm text-gray-500">{profesor.especializacion}</div>
                                                <div className="flex items-center mt-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                                                    <span className="text-sm">{profesor.calificacionPromedio || "0.0"}</span>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({profesor.totalComentarios || 0} comentarios)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Panel de Análisis */}
                                <div className="lg:col-span-2">
                                    {selectedProfesorAnalisis ? (
                                        <div className="space-y-6">
                                            {/* Header del Profesor Seleccionado */}
                                            <div className="bg-white border rounded-lg p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-semibold">
                                                            Docente Evaluado: {selectedProfesorAnalisis.nombre}
                                                        </h3>
                                                        <p className="text-gray-600">Período: 2025-1</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-3xl font-bold">{analisisData?.totalComentarios || 0}</div>
                                                        <div className="text-sm text-gray-500">Reviews</div>
                                                        <div className="flex items-center mt-1">
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${i < Math.round(selectedProfesorAnalisis.calificacionPromedio || 0)
                                                                                ? "text-yellow-500 fill-yellow-500"
                                                                                : "text-gray-300"
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="ml-1 text-sm">
                                                                {selectedProfesorAnalisis.calificacionPromedio || "0.0"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Botón para Análisis LLM */}
                                                <div className="flex justify-between items-center">
                                                    <button
                                                        onClick={() => generateLLMAnalysis(selectedProfesorAnalisis._id)}
                                                        disabled={loadingLLM}
                                                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 flex items-center"
                                                    >
                                                        <Brain className="w-4 h-4 mr-2" />
                                                        {loadingLLM ? "Generando..." : "Generar Análisis IA"}
                                                    </button>

                                                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center">
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Exportar Reporte
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Análisis LLM */}
                                            {llmAnalysis && (
                                                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                                                    <div className="flex items-center mb-4">
                                                        <Brain className="w-6 h-6 text-purple-600 mr-2" />
                                                        <h4 className="text-lg font-semibold text-purple-800">Análisis Generado por IA</h4>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div>
                                                            <h5 className="font-medium text-gray-800 mb-2">Resumen Ejecutivo</h5>
                                                            <p className="text-gray-700 text-sm leading-relaxed">{llmAnalysis.resumenEjecutivo}</p>
                                                        </div>

                                                        <div>
                                                            <h5 className="font-medium text-gray-800 mb-2">Desempeño Observado</h5>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <h6 className="font-medium text-green-700 mb-1">Fortalezas:</h6>
                                                                    <ul className="text-sm text-gray-700 space-y-1">
                                                                        {llmAnalysis.fortalezas.map((fortaleza, index) => (
                                                                            <li key={index} className="flex items-start">
                                                                                <span className="text-green-500 mr-2">•</span>
                                                                                {fortaleza}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                <div>
                                                                    <h6 className="font-medium text-red-700 mb-1">Debilidades:</h6>
                                                                    <ul className="text-sm text-gray-700 space-y-1">
                                                                        {llmAnalysis.debilidades.map((debilidad, index) => (
                                                                            <li key={index} className="flex items-start">
                                                                                <span className="text-red-500 mr-2">•</span>
                                                                                {debilidad}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h5 className="font-medium text-gray-800 mb-2">Recomendaciones</h5>
                                                            <ul className="text-sm text-gray-700 space-y-1">
                                                                {llmAnalysis.recomendaciones.map((recomendacion, index) => (
                                                                    <li key={index} className="flex items-start">
                                                                        <span className="text-blue-500 mr-2">•</span>
                                                                        {recomendacion}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Gráficos y Análisis */}
                                            {loadingAnalisis ? (
                                                <div className="text-center py-10">
                                                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                                                    <p>Cargando análisis...</p>
                                                </div>
                                            ) : analisisData ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Clasificación de Reviews */}
                                                    <div className="bg-white border rounded-lg p-6">
                                                        <h4 className="text-lg font-medium mb-4">Clasificación de Reviews</h4>
                                                        <div className="relative">
                                                            {/* Simulación de gráfico de dona */}
                                                            <div className="w-48 h-48 mx-auto relative">
                                                                <div className="w-full h-full rounded-full border-8 border-gray-200 relative">
                                                                    <div
                                                                        className="absolute inset-0 rounded-full border-8 border-green-500"
                                                                        style={{
                                                                            background: `conic-gradient(
                                           #10b981 0deg ${(analisisData.sentimientos?.positivo || 0) * 3.6}deg,
                                           #f59e0b ${(analisisData.sentimientos?.positivo || 0) * 3.6}deg ${((analisisData.sentimientos?.positivo || 0) + (analisisData.sentimientos?.critico || 0)) * 3.6}deg,
                                           #ef4444 ${((analisisData.sentimientos?.positivo || 0) + (analisisData.sentimientos?.critico || 0)) * 3.6}deg 360deg
                                         )`,
                                                                            borderRadius: "50%",
                                                                        }}
                                                                    ></div>
                                                                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                                                                        <div className="text-center">
                                                                            <div className="text-2xl font-bold">{analisisData.totalComentarios || 0}</div>
                                                                            <div className="text-sm text-gray-500">Reviews</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-4 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center">
                                                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                                                        <span className="text-sm">Positivo</span>
                                                                    </div>
                                                                    <span className="text-sm font-medium">
                                                                        {analisisData.sentimientos?.positivo || 0}%
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center">
                                                                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                                                        <span className="text-sm">Crítico</span>
                                                                    </div>
                                                                    <span className="text-sm font-medium">
                                                                        {analisisData.sentimientos?.critico || 0}%
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center">
                                                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                                                        <span className="text-sm">Negativo</span>
                                                                    </div>
                                                                    <span className="text-sm font-medium">
                                                                        {analisisData.sentimientos?.negativo || 0}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Palabras Más Frecuentes */}
                                                    <div className="bg-white border rounded-lg p-6">
                                                        <h4 className="text-lg font-medium mb-4">Puntuación Total por Palabra</h4>
                                                        <div className="space-y-3">
                                                            {analisisData.palabrasFreuentes?.slice(0, 8).map((palabra, index) => (
                                                                <div key={index} className="flex items-center justify-between">
                                                                    <span className="text-sm">{palabra.palabra}</span>
                                                                    <div className="flex items-center">
                                                                        <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                                                                            <div
                                                                                className="bg-red-500 h-2 rounded-full"
                                                                                style={{
                                                                                    width: `${(palabra.frecuencia / (analisisData.palabrasFreuentes[0]?.frecuencia || 1)) * 100}%`,
                                                                                }}
                                                                            ></div>
                                                                        </div>
                                                                        <span className="text-sm font-medium w-8 text-right">{palabra.frecuencia}</span>
                                                                    </div>
                                                                </div>
                                                            )) || <div className="text-gray-500 text-sm">No hay datos de palabras disponibles</div>}
                                                        </div>
                                                    </div>

                                                    {/* Tendencia Temporal */}
                                                    <div className="bg-white border rounded-lg p-6 md:col-span-2">
                                                        <h4 className="text-lg font-medium mb-4">Reviews por Año/Mes/Día</h4>
                                                        <div className="h-64 flex items-end justify-center space-x-2">
                                                            {/* Simulación de gráfico de líneas */}
                                                            <div className="text-center text-gray-500">
                                                                <TrendingUp className="w-16 h-16 mx-auto mb-2" />
                                                                <p>Gráfico de tendencias temporales</p>
                                                                <p className="text-sm">Datos de comentarios por período</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Nube de Palabras */}
                                                    <div className="bg-white border rounded-lg p-6 md:col-span-2">
                                                        <h4 className="text-lg font-medium mb-4">Nube de Palabras</h4>
                                                        <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                                                            <div className="text-center text-gray-500">
                                                                <MessageSquare className="w-16 h-16 mx-auto mb-2" />
                                                                <p>Visualización de nube de palabras</p>
                                                                <p className="text-sm">Palabras más frecuentes en los comentarios</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-10 text-gray-500">
                                                    <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                                    <p>Selecciona un profesor para ver su análisis detallado</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 text-gray-500">
                                            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                            <p>Selecciona un profesor de la lista para comenzar el análisis</p>
                                        </div>
                                    )}
                                </div>
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
                                                    className={`px-2 py-1 rounded-full text-xs ${usuario.rol === "admin"
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
                                            className={`px-3 py-1 border-t border-b ${pagination.page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
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
                                        className={`px-3 py-1 rounded-full text-sm ${sentimientoFilter === "" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                                            }`}
                                    >
                                        Todos
                                    </button>
                                    <button
                                        onClick={() => handleSentimientoFilter("Positivo")}
                                        className={`px-3 py-1 rounded-full text-sm ${sentimientoFilter === "Positivo"
                                                ? "bg-green-600 text-white"
                                                : "bg-green-100 text-green-800 hover:bg-green-200"
                                            }`}
                                    >
                                        Positivos
                                    </button>
                                    <button
                                        onClick={() => handleSentimientoFilter("Crítico (constructivo)")}
                                        className={`px-3 py-1 rounded-full text-sm ${sentimientoFilter === "Crítico (constructivo)"
                                                ? "bg-yellow-600 text-white"
                                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                            }`}
                                    >
                                        Críticos
                                    </button>
                                    <button
                                        onClick={() => handleSentimientoFilter("Negativo")}
                                        className={`px-3 py-1 rounded-full text-sm ${sentimientoFilter === "Negativo"
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
                                                        className={`w-4 h-4 ${i < comentario.calificacion ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
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
                                                    className={`text-xs px-2 py-1 rounded-full ${getSentimentColor(comentario.analisis.sentimiento)}`}
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
                                            className={`px-3 py-1 border-t border-b ${pagination.page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
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

                {/* Gestión Profesores */}
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
                                            className={`px-3 py-1 border-t border-b ${pagination.page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"
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

export default PanelAdmin
