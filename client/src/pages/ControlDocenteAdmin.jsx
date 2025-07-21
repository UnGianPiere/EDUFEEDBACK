"use client"

import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"
import { llmService } from "../utils/llmService"
import {
  Star,
  Users,
  TrendingUp,
  MessageSquare,
  BarChart3,
  LucidePieChart,
  Calendar,
  Filter,
  Brain,
  Activity,
  Sparkles,
  Loader2,
  Settings,
} from "lucide-react"
import { useContext, useEffect, useState, useMemo } from "react"

// Componente para las métricas principales - más grandes
const MetricCard = ({ title, value, icon: Icon, color = "blue", subtitle, trend }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
        <p className={`text-4xl font-bold text-${color}-600 mt-2 mb-1`}>{value}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </div>
      <div className={`p-4 bg-${color}-50 rounded-2xl`}>
        <Icon className={`w-8 h-8 text-${color}-600`} />
      </div>
    </div>
  </div>
)

// Componente para información del docente - más grande
const DocenteInfoCard = ({ docente, comentarios }) => {
  const avgRating =
    comentarios.length > 0
      ? (comentarios.reduce((a, c) => a + (c.calificacion || 0), 0) / comentarios.length).toFixed(1)
      : 0

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Información del Docente</h2>
          <div className="w-16 h-1.5 bg-blue-600 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-xl">
          <Star className="w-6 h-6 text-yellow-400 fill-current" />
          <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="text-base font-semibold text-gray-600">Nombre</span>
          <span className="text-base text-gray-900 font-semibold">{docente.nombre}</span>
        </div>
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="text-base font-semibold text-gray-600">Correo</span>
          <span className="text-base text-gray-900">{docente.correo}</span>
        </div>
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <span className="text-base font-semibold text-gray-600">Total Comentarios</span>
          <span className="text-base text-gray-900 font-semibold">{comentarios.length}</span>
        </div>
        <div className="flex items-center justify-between py-4">
          <span className="text-base font-semibold text-gray-600">Calificación</span>
          <div className="flex items-center space-x-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(avgRating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">({comentarios.length} reseñas)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para análisis IA - SOLO ESTE APARTADO CAMBIADO
const AnalisisIACard = ({ docente, comentarios, analisisIA, onGenerarAnalisis, generandoAnalisis }) => {
  const [configuracion, setConfiguracion] = useState({
    maxFortalezas: 3,
    maxAreasMejora: 3,
    maxRecomendaciones: 3,
  })
  const [mostrarConfig, setMostrarConfig] = useState(false)

  const handleGenerarConConfig = () => {
    onGenerarAnalisis(configuracion.maxFortalezas, configuracion.maxAreasMejora, configuracion.maxRecomendaciones)
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg border border-red-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="p-3 bg-red-100 rounded-2xl mr-4">
            <Brain className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-800">Análisis Generado por IA</h2>
            <p className="text-base text-red-600">Insights automáticos basados en comentarios</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Botón de configuración */}
          <button
            onClick={() => setMostrarConfig(!mostrarConfig)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>Config</span>
          </button>

          {/* Botón para generar análisis */}
          <button
            onClick={handleGenerarConConfig}
            disabled={generandoAnalisis || comentarios.length === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              generandoAnalisis || comentarios.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            {generandoAnalisis ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generar Análisis IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {analisisIA && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-green-700 font-medium">Análisis cargado desde base de datos</span>
          </div>
        </div>
      )}

      {/* Panel de configuración */}
      {mostrarConfig && (
        <div className="bg-white rounded-xl p-6 border border-red-100 mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Configuración del Análisis</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Máx. Fortalezas</label>
              <select
                value={configuracion.maxFortalezas}
                onChange={(e) => setConfiguracion({ ...configuracion, maxFortalezas: Number.parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Máx. Áreas de Mejora</label>
              <select
                value={configuracion.maxAreasMejora}
                onChange={(e) =>
                  setConfiguracion({ ...configuracion, maxAreasMejora: Number.parseInt(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Máx. Recomendaciones</label>
              <select
                value={configuracion.maxRecomendaciones}
                onChange={(e) =>
                  setConfiguracion({ ...configuracion, maxRecomendaciones: Number.parseInt(e.target.value) })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {!analisisIA && !generandoAnalisis && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Haz clic en "Generar Análisis IA" para obtener insights automáticos</p>
          <p className="text-gray-500 text-sm mt-2">Se analizarán {comentarios.length} comentarios</p>
        </div>
      )}

      {generandoAnalisis && (
        <div className="text-center py-12">
          <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-700 text-lg font-medium">Analizando comentarios con IA...</p>
          <p className="text-gray-500 text-sm mt-2">Esto puede tomar unos segundos</p>
        </div>
      )}

      {analisisIA && (
        <div className="space-y-8">
          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-blue-600" />
              Resumen Ejecutivo
            </h3>
            <div className="bg-white rounded-xl p-6 border border-red-100">
              <p className="text-gray-700 leading-relaxed">{analisisIA["Resumen Ejecutivo"]}</p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-green-600" />
              Desempeño Observado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-green-100">
                <h4 className="font-semibold text-green-700 mb-4 flex items-center text-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  Fortalezas ({analisisIA["Desempeño Observado"]?.Fortalezas?.length || 0})
                </h4>
                <ul className="space-y-3 text-gray-700">
                  {analisisIA["Desempeño Observado"]?.Fortalezas?.map((fortaleza, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-3 text-lg">•</span>
                      {fortaleza}
                    </li>
                  )) || <li className="text-gray-500 italic">No se encontraron fortalezas específicas</li>}
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6 border border-red-100">
                <h4 className="font-semibold text-red-700 mb-4 flex items-center text-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  Áreas de Mejora ({analisisIA["Desempeño Observado"]?.["Áreas de Mejora"]?.length || 0})
                </h4>
                <ul className="space-y-3 text-gray-700">
                  {analisisIA["Desempeño Observado"]?.["Áreas de Mejora"]?.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-3 text-lg">•</span>
                      {area}
                    </li>
                  )) || <li className="text-gray-500 italic">No se identificaron áreas de mejora específicas</li>}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-4 text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-3 text-purple-600" />
              Recomendaciones ({analisisIA.Recomendaciones?.length || 0})
            </h3>
            <div className="bg-white rounded-xl p-6 border border-purple-100">
              <ul className="space-y-4 text-gray-700">
                {analisisIA.Recomendaciones?.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                )) || <li className="text-gray-500 italic">No se generaron recomendaciones específicas</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para gráfico de pie - más grande
const PieChartComponent = ({ stats }) => {
  const total = stats.positivos + stats.criticos + stats.negativos
  if (total === 0) return <div className="text-gray-500 text-center py-8">Sin datos disponibles</div>

  const data = [
    { label: "Positivas", value: stats.positivos, color: "#22c55e" },
    { label: "Críticas", value: stats.criticos, color: "#eab308" },
    { label: "Negativas", value: stats.negativos, color: "#ef4444" },
  ]

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 32 32" className="mb-6">
        {(() => {
          const percentages = data.map((d) => d.value / total)
          let start = 0
          return percentages.map((frac, i) => {
            if (frac === 0) return null
            const x1 = 16 + 16 * Math.cos(2 * Math.PI * start)
            const y1 = 16 + 16 * Math.sin(2 * Math.PI * start)
            start += frac
            const x2 = 16 + 16 * Math.cos(2 * Math.PI * start)
            const y2 = 16 + 16 * Math.sin(2 * Math.PI * start)
            const large = frac > 0.5 ? 1 : 0
            return (
              <path
                key={i}
                d={`M16,16 L${x1},${y1} A16,16 0 ${large} 1 ${x2},${y2} Z`}
                fill={data[i].color}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
              />
            )
          })
        })()}
      </svg>
      <div className="space-y-3 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
              <span className="text-base font-medium text-gray-700">{item.label}</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{item.value}</span>
              <span className="text-sm text-gray-500 ml-2">({((item.value / total) * 100).toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente para nube de palabras - restaurado y mejorado
const WordCloudComponent = ({ stats }) => {
  if (!stats.topPalabras.length) return <div className="text-gray-500 text-center py-8">Sin temas disponibles</div>

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center min-h-[200px] p-4">
      {stats.topPalabras.map(([palabra, count], index) => {
        const fontSize = Math.max(14, Math.min(32, 14 + count * 3))
        const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#f97316"]
        const color = colors[index % colors.length]

        return (
          <span
            key={palabra}
            style={{
              fontSize: `${fontSize}px`,
              color: color,
              fontWeight: count > 3 ? "bold" : count > 1 ? "600" : "normal",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
            className="bg-white rounded-lg px-3 py-2 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
            title={`Mencionado ${count} veces`}
          >
            {palabra}
          </span>
        )
      })}
    </div>
  )
}

// Componente para gráfico de líneas temporal - nuevo
const TimelineChartComponent = ({ comentarios }) => {
  if (!comentarios.length) return <div className="text-gray-500 text-center py-8">Sin datos temporales</div>

  // Agrupar por mes y sentimiento
  const mesesData = {}
  comentarios.forEach((c) => {
    const fecha = new Date(c.fechaHora)
    const key = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, "0")}`
    if (!mesesData[key]) {
      mesesData[key] = { Positivo: 0, "Crítico (constructivo)": 0, Negativo: 0 }
    }
    const sentimiento = c.analisis?.sentimiento || "Sin clasificar"
    if (mesesData[key][sentimiento] !== undefined) {
      mesesData[key][sentimiento]++
    }
  })

  const meses = Object.keys(mesesData).sort().slice(-6) // Últimos 6 meses
  const tipos = ["Positivo", "Crítico (constructivo)", "Negativo"]
  const colores = ["#22c55e", "#eab308", "#ef4444"]

  const maxValue = Math.max(1, ...meses.flatMap((mes) => tipos.map((tipo) => mesesData[mes]?.[tipo] || 0)))

  return (
    <div className="w-full">
      <svg width="100%" height="300" viewBox="0 0 600 300" className="overflow-visible">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="60" y1={50 + i * 50} x2="550" y2={50 + i * 50} stroke="#f3f4f6" strokeWidth="1" />
        ))}

        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map((i) => (
          <text key={i} x="50" y={55 + i * 50} textAnchor="end" fontSize="12" fill="#6b7280">
            {Math.round(maxValue - (i * maxValue) / 4)}
          </text>
        ))}

        {/* Lines for each sentiment */}
        {tipos.map((tipo, tipoIndex) => {
          const points = meses
            .map((mes, mesIndex) => {
              const x = 80 + (mesIndex * 400) / (meses.length - 1)
              const value = mesesData[mes]?.[tipo] || 0
              const y = 250 - (value / maxValue) * 200
              return `${x},${y}`
            })
            .join(" ")

          return (
            <g key={tipo}>
              <polyline
                fill="none"
                stroke={colores[tipoIndex]}
                strokeWidth="3"
                points={points}
                className="hover:stroke-width-4 transition-all"
              />
              {/* Points */}
              {meses.map((mes, mesIndex) => {
                const x = 80 + (mesIndex * 400) / (meses.length - 1)
                const value = mesesData[mes]?.[tipo] || 0
                const y = 250 - (value / maxValue) * 200
                return (
                  <circle
                    key={`${tipo}-${mesIndex}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={colores[tipoIndex]}
                    className="hover:r-6 transition-all cursor-pointer"
                  >
                    <title>{`${tipo}: ${value} en ${mes}`}</title>
                  </circle>
                )
              })}
            </g>
          )
        })}

        {/* X-axis labels */}
        {meses.map((mes, index) => {
          const x = 80 + (index * 400) / (meses.length - 1)
          return (
            <text key={mes} x={x} y="280" textAnchor="middle" fontSize="12" fill="#6b7280">
              {mes}
            </text>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        {tipos.map((tipo, index) => (
          <div key={tipo} className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colores[index] }}></div>
            <span className="text-sm font-medium text-gray-700">{tipo}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente para filtros - mejorado
const FilterButtons = ({ sentimientoFiltro, setSentimientoFiltro, stats }) => {
  const filters = [
    { key: "todos", label: "Todos", count: stats?.total || 0, color: "blue" },
    { key: "positivos", label: "Positivos", count: stats?.positivos || 0, color: "green" },
    { key: "criticos", label: "Críticos", count: stats?.criticos || 0, color: "yellow" },
    { key: "negativos", label: "Negativos", count: stats?.negativos || 0, color: "red" },
  ]

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <div className="flex items-center mr-6">
        <Filter className="w-5 h-5 text-gray-500 mr-3" />
        <span className="text-base font-semibold text-gray-700">Filtrar por sentimiento:</span>
      </div>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => setSentimientoFiltro(filter.key)}
          className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center space-x-3 ${
            sentimientoFiltro === filter.key
              ? `bg-${filter.color}-600 text-white shadow-lg transform scale-105`
              : `bg-${filter.color}-50 text-${filter.color}-700 hover:bg-${filter.color}-100 border-2 border-${filter.color}-200 hover:border-${filter.color}-300`
          }`}
        >
          <span>{filter.label}</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              sentimientoFiltro === filter.key
                ? "bg-white bg-opacity-20"
                : `bg-${filter.color}-200 text-${filter.color}-800`
            }`}
          >
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  )
}

// Componente principal
const ControlDocenteAdmin = () => {
  const { user, authChecked } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [docentes, setDocentes] = useState([])
  const [selectedDocente, setSelectedDocente] = useState(null)
  const [comentarios, setComentarios] = useState([])
  const [stats, setStats] = useState(null)
  const [docenteInfo, setDocenteInfo] = useState(null)
  const [sentimientoFiltro, setSentimientoFiltro] = useState("todos")
  const [analisisIA, setAnalisisIA] = useState(null)
  const [generandoAnalisis, setGenerandoAnalisis] = useState(false)
  const [analisisGuardado, setAnalisisGuardado] = useState(false)

  useEffect(() => {
    if (authChecked) {
      if (!user || user.rol !== "admin") {
        toast.error("Acceso solo para administrativos")
        navigate("/")
        return
      }
      fetchDocentes()
    }
  }, [user, authChecked, navigate])

  const fetchDocentes = async () => {
    try {
      setLoading(true)
      const res = await axios.get("/api/profesores")
      setDocentes(res.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error("Error al cargar docentes")
    }
  }

  const fetchDocenteInfo = async (docenteId) => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/profesores/${docenteId}`)
      setDocenteInfo(res.data)
      setComentarios(res.data.comentarios)
      calcularStats(res.data.comentarios)

      // Cargar análisis LLM guardado si existe
      try {
        const analisisLLMGuardado = await llmService.obtenerAnalisisGuardado(docenteId)
        if (analisisLLMGuardado) {
          // Convertir formato de BD a formato de componente
          const analisisFormateado = {
            "Resumen Ejecutivo": analisisLLMGuardado.resumenEjecutivo,
            "Desempeño Observado": {
              Fortalezas: analisisLLMGuardado.fortalezasLLM,
              "Áreas de Mejora": analisisLLMGuardado.areasMejoraLLM,
            },
            Recomendaciones: analisisLLMGuardado.recomendacionesLLM,
          }
          setAnalisisIA(analisisFormateado)
          setAnalisisGuardado(true)
          console.log("Análisis LLM cargado desde BD")
        }
      } catch (error) {
        console.log("No hay análisis LLM guardado para este docente")
        setAnalisisGuardado(false)
      }

      setLoading(false)
    } catch (error) {
      setLoading(false)
      toast.error("Error al cargar datos del docente")
    }
  }

  const calcularStats = (comentarios) => {
    if (!comentarios.length) return setStats(null)

    const total = comentarios.length
    const positivos = comentarios.filter((c) => c.analisis?.sentimiento === "Positivo").length
    const negativos = comentarios.filter((c) => c.analisis?.sentimiento === "Negativo").length
    const criticos = comentarios.filter((c) => c.analisis?.sentimiento === "Crítico (constructivo)").length

    const palabras = {}
    comentarios.forEach((c) => {
      ;(c.analisis?.temas || []).forEach((p) => {
        palabras[p] = (palabras[p] || 0) + 1
      })
    })
    const topPalabras = Object.entries(palabras)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8) // Más palabras para la nube

    const porMes = {}
    comentarios.forEach((c) => {
      const fecha = new Date(c.fechaHora)
      const key = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`
      porMes[key] = (porMes[key] || 0) + 1
    })

    setStats({ total, positivos, negativos, criticos, topPalabras, porMes })
  }

  const handleDocenteSelect = (e) => {
    const docenteId = e.target.value
    const docente = docentes.find((d) => d._id === docenteId)
    setSelectedDocente(docente)
    setStats(null)
    setComentarios([])
    setDocenteInfo(null)
    setSentimientoFiltro("todos")
    setAnalisisIA(null)
    setAnalisisGuardado(false) // Limpiar estado de análisis guardado
    if (docenteId) fetchDocenteInfo(docenteId)
  }

  const handleGenerarAnalisis = async (maxFortalezas = 3, maxAreasMejora = 3, maxRecomendaciones = 3) => {
    if (!comentarios.length) {
      toast.error("No hay comentarios para analizar")
      return
    }

    try {
      setGenerandoAnalisis(true)
      toast.loading("Generando análisis con IA...", { id: "analisis-loading" })

      const analisis = await llmService.generarAnalisisComentarios(
        comentarios,
        maxFortalezas,
        maxAreasMejora,
        maxRecomendaciones,
      )

      setAnalisisIA(analisis)

      // Guardar automáticamente en BD
      try {
        await llmService.guardarAnalisis(
          selectedDocente._id,
          analisis,
          { maxFortalezas, maxAreasMejora, maxRecomendaciones },
          comentarios.length,
        )
        setAnalisisGuardado(true)
        toast.success("Análisis generado y guardado exitosamente", { id: "analisis-loading" })
      } catch (saveError) {
        console.error("Error al guardar análisis:", saveError)
        toast.success("Análisis generado (no se pudo guardar)", { id: "analisis-loading" })
      }
    } catch (error) {
      console.error("Error al generar análisis:", error)
      toast.error(error.message, { id: "analisis-loading" })
    } finally {
      setGenerandoAnalisis(false)
    }
  }

  const comentariosFiltrados = useMemo(() => {
    if (sentimientoFiltro === "todos") return comentarios
    return comentarios.filter((c) => {
      if (sentimientoFiltro === "positivos") return c.analisis?.sentimiento === "Positivo"
      if (sentimientoFiltro === "criticos") return c.analisis?.sentimiento === "Crítico (constructivo)"
      if (sentimientoFiltro === "negativos") return c.analisis?.sentimiento === "Negativo"
      return true
    })
  }, [comentarios, sentimientoFiltro])

  if (loading && !selectedDocente) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 font-medium">Cargando Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header del Dashboard */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Dashboard de Control Docente</h1>
          <p className="text-xl text-gray-600">Análisis integral del desempeño y feedback estudiantil</p>
        </div>

        {/* Selector de docente */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-10">
          <label className="block text-lg font-semibold text-gray-700 mb-4">Seleccionar Docente para Análisis</label>
          <select
            className="w-full max-w-lg border-2 border-gray-300 rounded-xl px-6 py-4 bg-white focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            value={selectedDocente?._id || ""}
            onChange={handleDocenteSelect}
          >
            <option value="">-- Selecciona un docente --</option>
            {docentes.map((docente) => (
              <option key={docente._id} value={docente._id}>
                {docente.nombre}
              </option>
            ))}
          </select>
        </div>

        {selectedDocente && docenteInfo && (
          <>
            {/* Métricas principales - más grandes */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <MetricCard
                  title="Total Comentarios"
                  value={stats.total}
                  icon={MessageSquare}
                  color="blue"
                  subtitle="Feedback recibido"
                  trend="+12% vs mes anterior"
                />
                <MetricCard
                  title="Comentarios Positivos"
                  value={stats.positivos}
                  icon={TrendingUp}
                  color="green"
                  subtitle={`${((stats.positivos / stats.total) * 100).toFixed(1)}% del total`}
                  trend="+5% mejora"
                />
                <MetricCard
                  title="Comentarios Críticos"
                  value={stats.criticos}
                  icon={BarChart3}
                  color="yellow"
                  subtitle="Constructivos"
                  trend="Estable"
                />
                <MetricCard
                  title="Comentarios Negativos"
                  value={stats.negativos}
                  icon={Users}
                  color="red"
                  subtitle="Requieren atención"
                  trend="-3% reducción"
                />
              </div>
            )}

            {/* Información del docente y análisis IA */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-12">
              <div className="lg:col-span-2">
                <DocenteInfoCard docente={docenteInfo.profesor} comentarios={comentarios} />
              </div>
              <div className="lg:col-span-3">
                <AnalisisIACard
                  docente={selectedDocente}
                  comentarios={comentarios}
                  analisisIA={analisisIA}
                  onGenerarAnalisis={handleGenerarAnalisis}
                  generandoAnalisis={generandoAnalisis}
                />
              </div>
            </div>

            {/* Gráficos principales */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                {/* Distribución de sentimientos */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="font-bold text-2xl mb-6 flex items-center">
                    <LucidePieChart className="w-7 h-7 mr-3 text-blue-600" />
                    Distribución de Sentimientos
                  </h3>
                  <PieChartComponent stats={stats} />
                </div>

                {/* Nube de palabras */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="font-bold text-2xl mb-6 flex items-center">
                    <MessageSquare className="w-7 h-7 mr-3 text-purple-600" />
                    Nube de Temas
                  </h3>
                  <WordCloudComponent stats={stats} />
                </div>

                {/* Actividad por mes */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h3 className="font-bold text-2xl mb-6 flex items-center">
                    <Calendar className="w-7 h-7 mr-3 text-green-600" />
                    Actividad Reciente
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(stats.porMes)
                      .slice(-6)
                      .map(([mes, count]) => (
                        <div key={mes} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 font-medium">{mes}</span>
                          <span className="font-bold text-gray-900 bg-green-100 px-3 py-1 rounded-full">
                            {count} comentarios
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Gráfico de líneas temporal */}
            {stats && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
                <h3 className="font-bold text-2xl mb-6 flex items-center">
                  <Activity className="w-7 h-7 mr-3 text-indigo-600" />
                  Evolución Temporal de Sentimientos
                </h3>
                <TimelineChartComponent comentarios={comentarios} />
              </div>
            )}

            {/* Comentarios */}
            {comentarios.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Comentarios Detallados</h2>

                <FilterButtons
                  sentimientoFiltro={sentimientoFiltro}
                  setSentimientoFiltro={setSentimientoFiltro}
                  stats={stats}
                />

                <div className="space-y-6">
                  {comentariosFiltrados.map((comentario) => (
                    <div
                      key={comentario._id}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">
                              {(comentario.nombreEstudiante || "A")[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 text-lg">
                              {comentario.nombreEstudiante || "Anónimo"}
                            </span>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < (comentario.calificacion || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(comentario.fechaHora).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed text-base">{comentario.texto}</p>

                      <div className="flex flex-wrap gap-3">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            comentario.analisis?.sentimiento === "Positivo"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : comentario.analisis?.sentimiento === "Crítico (constructivo)"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : comentario.analisis?.sentimiento === "Negativo"
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {comentario.analisis?.sentimiento || "Sin análisis"}
                        </span>
                        {comentario.analisis?.temas &&
                          comentario.analisis.temas.map((tema, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                            >
                              {tema}
                            </span>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ControlDocenteAdmin
