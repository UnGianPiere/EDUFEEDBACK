"use client"

import { useState } from "react"
import { ThumbsUp, MessageCircle, Flag, Star, BookOpen, Calendar, Clock, Tag, Award } from "lucide-react"
import axiosInstance from "../../utils/axiosConfig"

const ComentarioCard = ({ comentario, onReply, onDelete, currentUser }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [likes, setLikes] = useState(comentario.likes || 0)
  const [hasLiked, setHasLiked] = useState(false)

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


  const handleLike = async () => {
    if (hasLiked) return
    try {
      await axiosInstance.post(`/api/comentarios/${comentario._id}/like`)
      setLikes(likes + 1)
      setHasLiked(true)
    } catch (error) {
      console.error("Error al dar like:", error)
    }
  }

  const handleReplySubmit = (e) => {
    e.preventDefault()
    if (replyText.trim()) {
      onReply && onReply(comentario._id, replyText)
      setReplyText("")
      setShowReplyForm(false)
    }
  }

  const handleDelete = () => {
    onDelete && onDelete(comentario._id)
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Renderizar estrellas según calificación
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`w-4 h-4 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />,
      )
    }
    return stars
  }

  // Obtener color según sentimiento
  const getSentimentColor = (sentiment) => {
    if (!sentiment) return "bg-gray-100 text-gray-600"
    if (sentiment.toLowerCase().includes("positivo")) return "bg-emerald-50 text-emerald-700 border-emerald-200"
    if (sentiment.toLowerCase().includes("crítico")) return "bg-amber-50 text-amber-700 border-amber-200"
    if (sentiment.toLowerCase().includes("negativo")) return "bg-red-50 text-red-700 border-red-200"
    return "bg-gray-100 text-gray-600"
  }

  // Obtener color según calificación
  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-emerald-600"
    if (rating >= 3) return "text-amber-600"
    return "text-red-600"
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900">{formatearNombre(comentario.nombreProfesor)}</h3>
          <div className="flex items-center gap-1">
            <div className={`flex ${getRatingColor(comentario.calificacion)}`}>
              {renderStars(comentario.calificacion)}
            </div>
            <span className={`font-bold ml-1 ${getRatingColor(comentario.calificacion)}`}>
              {comentario.calificacion}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
              {comentario.nombreCurso || comentario.codigoCurso || "Sin curso especificado"}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formatDate(comentario.fechaHora).split(",")[0]}</span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{formatDate(comentario.fechaHora).split(",")[1]}</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-5">
        <p className="text-gray-700 mb-4 leading-relaxed">{comentario.texto}</p>

        {/* Tags y análisis */}
        {comentario.analisis && (
          <div className="space-y-3 mb-4">
            {/* Sentimiento */}
            {comentario.analisis.sentimiento && (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium border ${getSentimentColor(
                    comentario.analisis.sentimiento,
                  )}`}
                >
                  {comentario.analisis.sentimiento}
                </span>
              </div>
            )}

            {/* Temas */}
            {comentario.analisis.temas && comentario.analisis.temas.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                <Tag className="w-4 h-4 text-blue-600 mr-1" />
                {comentario.analisis.temas.slice(0, 5).map((tema, i) => (
                  <span
                    key={i}
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium border border-blue-200"
                  >
                    {typeof tema === "object" ? tema.texto : tema}
                  </span>
                ))}
                {Array.isArray(comentario.analisis.temas) && comentario.analisis.temas.length > 5 && (
                  <span className="text-xs text-gray-500">+{comentario.analisis.temas.length - 5} más</span>
                )}
              </div>
            )}

            {/* Fortalezas */}
            {comentario.analisis.fortalezas && comentario.analisis.fortalezas.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                <Award className="w-4 h-4 text-emerald-600 mr-1" />
                {comentario.analisis.fortalezas.slice(0, 3).map((fortaleza, i) => (
                  <span
                    key={i}
                    className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-xs font-medium border border-emerald-200"
                  >
                    {typeof fortaleza === "object" ? fortaleza.texto : fortaleza}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={hasLiked}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                hasLiked
                  ? "bg-blue-100 text-blue-700 cursor-not-allowed"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-blue-600" : ""}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Responder</span>
              {comentario.respuestas && comentario.respuestas.length > 0 && (
                <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
                  {comentario.respuestas.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all">
              <Flag className="w-4 h-4" />
              <span>Reportar</span>
            </button>

            {currentUser && currentUser._id === comentario.idEstudiante && (
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>

        {/* Formulario de respuesta */}
        {showReplyForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowReplyForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Responder
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComentarioCard
