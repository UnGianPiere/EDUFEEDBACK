import axios from "axios"

// Servicio para interactuar con la API LLM y BD
export const llmService = {
  // Obtener análisis LLM guardado de la BD
  async obtenerAnalisisGuardado(profesorId) {
    try {
      const response = await axios.get(`/api/analisis/llm/${profesorId}`)
      return response.data.analisisLLM
    } catch (error) {
      if (error.response?.status === 404) {
        return null // No hay análisis guardado
        console.error("Análisis LLM no encontrado para el profesor:",error)
      }
      throw error
    }
  },

  // Guardar análisis LLM en la BD
  async guardarAnalisis(profesorId, analisisData, parametrosUsados, comentariosAnalizados) {
    try {
      const payload = {
        resumenEjecutivo: analisisData["Resumen Ejecutivo"],
        fortalezasLLM: analisisData["Desempeño Observado"]?.Fortalezas || [],
        areasMejoraLLM: analisisData["Desempeño Observado"]?.["Áreas de Mejora"] || [],
        recomendacionesLLM: analisisData.Recomendaciones || [],
        parametrosUsados,
        comentariosAnalizados,
      }

      const response = await axios.post(`/api/analisis/llm/${profesorId}`, payload)
      return response.data
    } catch (error) {
      console.error("Error al guardar análisis LLM:", error)
      throw error
              console.error("Análisis LLM no encontrado para el profesor:",error)
    }
  },

  // Eliminar análisis LLM de la BD
  async eliminarAnalisis(profesorId) {
    try {
      const response = await axios.delete(`/api/analisis/llm/${profesorId}`)
      return response.data
    } catch (error) {
      console.error("Error al eliminar análisis LLM:", error)
      throw error
              console.error("Análisis LLM no encontrado para el profesor:",error)
    }
  },

  // Generar análisis de comentarios usando LLM
  async generarAnalisisComentarios(comentarios, maxFortalezas = 3, maxAreasMejora = 3, maxRecomendaciones = 3) {
    try {
      const llmApiUrl = process.env.REACT_APP_LLM_API_URL

      if (!llmApiUrl) {
        console.warn("REACT_APP_LLM_API_URL no configurada, usando análisis básico")
        return {
          "Resumen Ejecutivo": "No se pudo conectar con el servicio de análisis IA. Configurar REACT_APP_LLM_API_URL.",
          "Desempeño Observado": {
            Fortalezas: ["Análisis no disponible"],
            "Áreas de Mejora": ["Configurar servicio de IA"],
          },
          Recomendaciones: ["Verificar configuración de la API"],
        }
      }

      // Formatear comentarios para enviar a la API
      const comentariosTexto = comentarios.map((c) => `• ${c.texto}`).join("\n")

      console.log(`Analizando ${comentarios.length} comentarios con IA...`)

      const response = await axios.post(
        `${llmApiUrl}/evaluar-docente`,
        {
          comentarios: comentariosTexto,
        },
        {
          params: {
            max_fortalezas: maxFortalezas,
            max_areas_mejora: maxAreasMejora,
            max_recomendaciones: maxRecomendaciones,
          },
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 60000, // 60 segundos timeout para LLM
        },
      )

      const analisis = response.data

      // Verificar si hay error en la respuesta
      if (analisis.error) {
        console.error("Error en respuesta del modelo:", analisis.error)
        throw new Error(`Error del modelo IA: ${analisis.error}`)
      }

      console.log("Análisis IA completado exitosamente")

      return analisis
    } catch (error) {
      console.error("Error al analizar comentarios con IA:", error.message)

      // Análisis básico de respaldo
      const analisisRespaldo = {
        "Resumen Ejecutivo":
          "No se pudo generar análisis automático. El docente recibe feedback variado de los estudiantes que requiere revisión manual para obtener insights detallados.",
        "Desempeño Observado": {
          Fortalezas: [
            "Los estudiantes proporcionan feedback sobre el desempeño docente",
            "Existe comunicación entre estudiantes y docente",
          ],
          "Áreas de Mejora": [
            "Análisis detallado requiere revisión manual",
            "Servicio de IA no disponible temporalmente",
          ],
        },
        Recomendaciones: [
          "Revisar comentarios manualmente para obtener insights específicos",
          "Verificar configuración del servicio de análisis IA",
          "Considerar patrones comunes en los comentarios recibidos",
        ],
      }

      return analisisRespaldo
    }
  },
}
