const axios = require("axios")

const analizarSentimiento = async (texto) => {
  try {
    const sentimentApiUrl = process.env.SENTIMENT_API_URL

    if (!sentimentApiUrl) {
      console.warn("SENTIMENT_API_URL no configurada, usando análisis básico")
      return {
        etiqueta: "Crítico (constructivo)",
        palabras_clave: [],
      }
    }

    console.log(`Analizando sentimiento para: "${texto.substring(0, 50)}..."`)

    const response = await axios.post(
      `${sentimentApiUrl}/analizar`,
      {
        comentario: texto,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // Para evitar la página de advertencia de ngrok
        },
        timeout:  120000, // 10 segundos de timeout
      },
    )

    const { sentimiento, palabras_clave } = response.data

    // Mapear los sentimientos a nuestro formato
    let sentimientoMapeado
    switch (sentimiento) {
      case "Positivo":
      case "positive":
        sentimientoMapeado = "Positivo"
        break
      case "Negativo":
      case "negative":
        sentimientoMapeado = "Negativo"
        break
      case "Crítico":
      case "neutral":
      default:
        sentimientoMapeado = "Crítico (constructivo)"
        break
    }

    console.log(`Análisis completado: ${sentimientoMapeado}`)

    return {
      etiqueta: sentimientoMapeado,
      palabras_clave: palabras_clave || [],
    }
  } catch (error) {
    console.error("Error al analizar sentimiento:", error.message)

    // Análisis básico de respaldo
    const palabrasPositivas = ["excelente", "bueno", "genial", "fantástico", "recomiendo", "claro", "didáctico"]
    const palabrasNegativas = ["malo", "terrible", "horrible", "no recomiendo", "confuso", "aburrido"]

    const textoLower = texto.toLowerCase()
    const tienePositivas = palabrasPositivas.some((palabra) => textoLower.includes(palabra))
    const tieneNegativas = palabrasNegativas.some((palabra) => textoLower.includes(palabra))

    let sentimiento
    if (tienePositivas && !tieneNegativas) {
      sentimiento = "Positivo"
    } else if (tieneNegativas && !tienePositivas) {
      sentimiento = "Negativo"
    } else {
      sentimiento = "Crítico (constructivo)"
    }

    return {
      etiqueta: sentimiento,
      palabras_clave: [],
    }
  }
}

module.exports = analizarSentimiento
