/**
 * Este archivo contiene la integración con el modelo de Python para NLP
 * En un entorno real, se utilizaría una API o un proceso de Python para ejecutar el modelo
 */

// Código del modelo de Python proporcionado
/*
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

# Cargar modelo y tokenizer
model_name = "UMUTeam/roberta-spanish-sentiment-analysis"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

# Función para analizar un solo comentario
def analizar_sentimiento(comentario):
    inputs = tokenizer(comentario, return_tensors="pt", truncation=True, padding=True, max_length=512)
    outputs = model(**inputs)
    probs = torch.softmax(outputs.logits, dim=1)[0]
    idx = torch.argmax(probs).item()
    etiqueta_modelo = model.config.id2label[idx]
    mapping = {
        "negative": "Negativo",
        "neutral": "Crítico (constructivo)",
        "positive": "Positivo"
    }
    etiqueta = mapping.get(etiqueta_modelo, etiqueta_modelo)
    confianza = float(probs[idx])
    return etiqueta, confianza
*/

/**
 * En un entorno real, esta función llamaría al modelo de Python
 * Por ahora, implementamos una versión simplificada
 */
// Modificar la función analizarComentario para usar la API externa

const axios = require("axios")

const sentimentApi = axios.create({
  baseURL: process.env.SENTIMENT_API_URL,
  timeout: 120000, // 2 minutos
})

async function analizarComentario(texto) {
  // Obtener análisis de sentimiento y palabras clave de la API externa
  const sentimientoResultado = await analizarSentimiento(texto)

  // Extraer temas (palabras clave) del resultado de la API
  const temas = sentimientoResultado.palabras_clave || []

  // Identificar fortalezas y áreas de mejora basadas en el sentimiento
  const { fortalezas, areasAMejorar } = identificarFortalezasYAreas(texto, sentimientoResultado.etiqueta)

  // Generar resumen
  const resumen = generarResumen(texto, sentimientoResultado.etiqueta, fortalezas, areasAMejorar)

  return {
    sentimiento: sentimientoResultado.etiqueta,
    temas,
    fortalezas,
    areasAMejorar,
    resumen,
  }
}

// Función simplificada para análisis de sentimiento
async function analizarSentimiento(texto) {
  const palabrasPositivas = [
    "excelente",
    "bueno",
    "genial",
    "increíble",
    "claro",
    "útil",
    "práctico",
    "organizado",
    "dinámico",
    "interesante",
    "recomendable",
    "encantó",
    "valoré",
    "aprendí",
    "didáctico",
    "paciente",
    "atento",
    "comprensivo",
    "actualizado",
  ]

  const palabrasNegativas = [
    "malo",
    "pésimo",
    "terrible",
    "confuso",
    "desorganizado",
    "aburrido",
    "difícil",
    "complicado",
    "incomprensible",
    "inútil",
    "desactualizado",
    "impuntual",
    "irrespetuoso",
    "injusto",
    "deficiente",
  ]

  const palabrasCriticas = [
    "mejorar",
    "podría",
    "aunque",
    "sin embargo",
    "pero",
    "falta",
    "necesita",
    "debería",
    "recomendaría",
    "sugeriría",
    "considerar",
    "revisar",
  ]

  // Convertir a minúsculas para comparación
  const textoLower = texto.toLowerCase()

  // Contar ocurrencias
  let conteoPositivas = 0
  let conteoNegativas = 0
  let conteoCriticas = 0

  palabrasPositivas.forEach((palabra) => {
    if (textoLower.includes(palabra)) conteoPositivas++
  })

  palabrasNegativas.forEach((palabra) => {
    if (textoLower.includes(palabra)) conteoNegativas++
  })

  palabrasCriticas.forEach((palabra) => {
    if (textoLower.includes(palabra)) conteoCriticas++
  })

  // Determinar sentimiento
  let etiqueta
  let confianza = 0.7 // Valor por defecto

  if (conteoNegativas > conteoPositivas && conteoNegativas > conteoCriticas) {
    etiqueta = "Negativo"
    confianza = 0.7 + conteoNegativas * 0.05
  } else if (conteoPositivas > conteoNegativas && conteoPositivas > conteoCriticas) {
    etiqueta = "Positivo"
    confianza = 0.7 + conteoPositivas * 0.05
  } else {
    etiqueta = "Crítico (constructivo)"
    confianza = 0.7 + conteoCriticas * 0.05
  }

  // Limitar confianza a 0.95
  confianza = Math.min(confianza, 0.95)

  return {
    etiqueta,
    confianza,
  }
}

// Función para extraer temas del texto
function extraerTemas(texto) {
  const temasPosibles = [
    "explicaciones",
    "ejemplos",
    "evaluaciones",
    "clases prácticas",
    "disponibilidad",
    "proyecto final",
    "teoría vs práctica",
    "laboratorios",
    "material",
    "organización",
    "puntualidad",
    "claridad",
    "didáctica",
    "conocimiento",
    "atención",
    "exámenes",
    "trabajos",
    "comunicación",
  ]

  const textoLower = texto.toLowerCase()
  const temasEncontrados = temasPosibles.filter((tema) => textoLower.includes(tema))

  // Si no se encontraron temas específicos, inferir algunos basados en palabras clave
  if (temasEncontrados.length === 0) {
    if (textoLower.includes("explica") || textoLower.includes("explicó")) {
      temasEncontrados.push("explicaciones")
    }
    if (textoLower.includes("ejemplo") || textoLower.includes("ejemplos")) {
      temasEncontrados.push("ejemplos")
    }
    if (textoLower.includes("examen") || textoLower.includes("exámenes") || textoLower.includes("evaluación")) {
      temasEncontrados.push("evaluaciones")
    }
    if (textoLower.includes("práctica") || textoLower.includes("práctico")) {
      temasEncontrados.push("clases prácticas")
    }
    if (textoLower.includes("teoría") || textoLower.includes("teórico")) {
      temasEncontrados.push("teoría vs práctica")
    }
  }

  return temasEncontrados
}

// Función para identificar fortalezas y áreas de mejora
function identificarFortalezasYAreas(texto, sentimiento) {
  const fortalezasPosibles = [
    "Explicaciones claras",
    "Buenos ejemplos",
    "Evaluaciones justas",
    "Clases prácticas",
    "Disponibilidad para consultas",
    "Proyectos interesantes",
    "Conocimiento de la materia",
    "Material actualizado",
    "Buena organización",
    "Puntualidad",
    "Comunicación efectiva",
    "Retroalimentación útil",
  ]

  const areasPosibles = [
    "Mejorar explicaciones",
    "Más ejemplos prácticos",
    "Equilibrar dificultad de exámenes",
    "Más práctica",
    "Mayor disponibilidad",
    "Proyectos más relevantes",
    "Actualizar conocimientos",
    "Actualizar material",
    "Mejorar organización",
    "Mejorar puntualidad",
    "Mejorar comunicación",
    "Dar más retroalimentación",
  ]

  const textoLower = texto.toLowerCase()
  const fortalezas = []
  const areasAMejorar = []

  // Identificar fortalezas basadas en frases positivas
  if (textoLower.includes("explica bien") || textoLower.includes("buena explicación")) {
    fortalezas.push("Explicaciones claras")
  }
  if (textoLower.includes("buenos ejemplos") || textoLower.includes("ejemplos claros")) {
    fortalezas.push("Buenos ejemplos")
  }
  if (textoLower.includes("disponible") || textoLower.includes("accesible")) {
    fortalezas.push("Disponibilidad para consultas")
  }
  if (textoLower.includes("conoce") || textoLower.includes("sabe")) {
    fortalezas.push("Conocimiento de la materia")
  }
  if (textoLower.includes("actualizado") || textoLower.includes("al día")) {
    fortalezas.push("Material actualizado")
  }

  // Identificar áreas de mejora basadas en frases negativas o sugerencias
  if (textoLower.includes("difícil de entender") || textoLower.includes("confuso")) {
    areasAMejorar.push("Mejorar explicaciones")
  }
  if (textoLower.includes("más ejemplos") || textoLower.includes("faltan ejemplos")) {
    areasAMejorar.push("Más ejemplos prácticos")
  }
  if (textoLower.includes("exámenes difíciles") || textoLower.includes("evaluaciones injustas")) {
    areasAMejorar.push("Equilibrar dificultad de exámenes")
  }
  if (textoLower.includes("más práctica") || textoLower.includes("muy teórico")) {
    areasAMejorar.push("Más práctica")
  }
  if (textoLower.includes("desactualizado") || textoLower.includes("obsoleto")) {
    areasAMejorar.push("Actualizar material")
  }

  // Si no se identificaron fortalezas o áreas específicas, inferir basado en el sentimiento
  if (fortalezas.length === 0 && sentimiento === "Positivo") {
    fortalezas.push("Buena metodología de enseñanza")
  }

  if (areasAMejorar.length === 0 && (sentimiento === "Negativo" || sentimiento === "Crítico (constructivo)")) {
    areasAMejorar.push("Revisar metodología de enseñanza")
  }

  return { fortalezas, areasAMejorar }
}

// Función para generar un resumen del comentario
function generarResumen(texto, sentimiento, fortalezas, areasAMejorar) {
  let resumen = ""

  if (sentimiento === "Positivo") {
    resumen = "Profesor valorado positivamente. "
    if (fortalezas.length > 0) {
      resumen += `Destaca en: ${fortalezas.join(", ")}. `
    }
    if (areasAMejorar.length > 0) {
      resumen += `Podría mejorar en: ${areasAMejorar.join(", ")}.`
    }
  } else if (sentimiento === "Crítico (constructivo)") {
    resumen = "Evaluación constructiva del profesor. "
    if (fortalezas.length > 0) {
      resumen += `Aspectos positivos: ${fortalezas.join(", ")}. `
    }
    if (areasAMejorar.length > 0) {
      resumen += `Áreas de mejora: ${areasAMejorar.join(", ")}.`
    }
  } else {
    resumen = "Evaluación negativa del profesor. "
    if (areasAMejorar.length > 0) {
      resumen += `Necesita mejorar en: ${areasAMejorar.join(", ")}. `
    }
    if (fortalezas.length > 0) {
      resumen += `Aspectos rescatables: ${fortalezas.join(", ")}.`
    }
  }

  return resumen
}

module.exports = {
  analizarComentario,
}
