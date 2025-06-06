import { Link } from "react-router-dom"
import { Mail, BookOpen, Star, MessageCircle, Award, MapPin } from "lucide-react"

const ProfesorCard = ({ profesor }) => {
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

  // Determinar las iniciales para el avatar
  const getInitials = (nombre) => {
    const nombreFormateado = formatearNombre(nombre)
    const palabras = nombreFormateado.split(" ")
    if (palabras.length >= 2) {
      return palabras[0][0] + palabras[1][0] // Primeras letras de nombres
    }
    return palabras[0][0] + (palabras[0][1] || "")
  }

  const initial = getInitials(profesor.nombre)

  // Determinar el color de fondo del avatar basado en la calificación
  const getAvatarColor = () => {
    const rating = profesor.analisis?.calificacionPromedio || profesor.calificacionPromedio || 0
    if (rating >= 4.5) return "from-emerald-500 to-teal-600"
    if (rating >= 4.0) return "from-blue-500 to-indigo-600"
    if (rating >= 3.5) return "from-amber-500 to-orange-600"
    if (rating >= 3.0) return "from-purple-500 to-pink-600"
    return "from-gray-500 to-slate-600"
  }

  // Obtener color de la calificación
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-emerald-600 bg-emerald-50 border-emerald-200"
    if (rating >= 4.0) return "text-blue-600 bg-blue-50 border-blue-200"
    if (rating >= 3.5) return "text-amber-600 bg-amber-50 border-amber-200"
    if (rating >= 3.0) return "text-purple-600 bg-purple-50 border-purple-200"
    return "text-gray-600 bg-gray-50 border-gray-200"
  }

  // Total comentarios seguro
  const totalComentarios = profesor.analisis?.totalComentarios || profesor.totalComentarios || 0
  const totalOpiniones = Array.isArray(totalComentarios) ? totalComentarios.length : totalComentarios

  const calificacion = profesor.analisis?.calificacionPromedio || profesor.calificacionPromedio || 0
  const calificacionNum = typeof calificacion === "string" ? Number.parseFloat(calificacion) : calificacion

  // Renderizar estrellas
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-4 h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>,
        )
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />)
      }
    }
    return stars
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 hover:-translate-y-1">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarColor()} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
            >
              {initial.toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {formatearNombre(profesor.nombre)}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{profesor.sede || "Huancayo"}</span>
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${getRatingColor(calificacionNum)}`}>
            <div className="flex items-center gap-1">{renderStars(calificacionNum)}</div>
            <span className="font-bold text-lg">{calificacionNum > 0 ? calificacionNum.toFixed(1) : "N/A"}</span>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">{totalOpiniones}</span>
            <span>{totalOpiniones === 1 ? "opinión" : "opiniones"}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Award className="w-4 h-4" />
            <span>{Array.isArray(profesor.cursos) ? profesor.cursos.length : 0} cursos</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Cursos */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Cursos que enseña</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(profesor.cursos) && profesor.cursos.length > 0 ? (
              <>
                {profesor.cursos.slice(0, 3).map((curso, i) => (
                  <span
                    key={i}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-shadow"
                  >
                    {typeof curso === "object" && curso !== null && curso.nombre
                      ? curso.nombre.length > 30
                        ? curso.nombre.substring(0, 30) + "..."
                        : curso.nombre
                      : String(curso).length > 30
                        ? String(curso).substring(0, 30) + "..."
                        : String(curso)}
                  </span>
                ))}
                {profesor.cursos.length > 3 && (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200">
                    +{profesor.cursos.length - 3} más
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-400 text-sm italic">Sin cursos asignados</span>
            )}
          </div>
        </div>

        {/* Contacto */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Mail className="w-4 h-4 text-gray-500" />
            {profesor.correo ? (
              <span className="font-medium">{profesor.correo}</span>
            ) : (
              <span className="text-gray-400 italic">Correo no registrado</span>
            )}
          </div>
        </div>

        {/* Fortalezas destacadas */}
        {profesor.analisis?.fortalezas && profesor.analisis.fortalezas.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">Fortalezas destacadas</h4>
            <div className="flex flex-wrap gap-1">
              {profesor.analisis.fortalezas.slice(0, 3).map((fortaleza, i) => (
                <span
                  key={i}
                  className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs font-medium border border-emerald-200"
                >
                  {typeof fortaleza === "object" ? fortaleza.texto : fortaleza}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer con acciones */}
      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 flex justify-between items-center">
        <Link
          to={`/profesores/${profesor._id}`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors hover:bg-blue-50 px-3 py-2 rounded-lg"
        >
          <Award className="w-4 h-4" />
          Ver perfil completo
        </Link>
        <Link
          to={`/publicar-comentario/${profesor._id}`}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Opinar
        </Link>
      </div>
    </div>
  )
}

export default ProfesorCard
