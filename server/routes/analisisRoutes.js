const express = require("express")
const router = express.Router()
const TrabajoAnalisis = require("../models/TrabajoAnalisis")
const Comentario = require("../models/Comentario")
const AnalisisProfesor = require("../models/AnalisisProfesor")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

// Obtener todos los trabajos de análisis (solo admin)
router.get("/trabajos", [auth, admin], async (req, res) => {
  try {
    const trabajos = await TrabajoAnalisis.find().sort({ fechaCreacion: -1 })
    res.json(trabajos)
  } catch (error) {
    console.error("Error al obtener trabajos de análisis:", error)
    res.status(500).json({ message: "Error al obtener trabajos de análisis" })
  }
})

// Obtener análisis de un profesor
router.get("/profesor/:id", async (req, res) => {
  try {
    const analisis = await AnalisisProfesor.findOne({ idProfesor: req.params.id })

    if (!analisis) {
      return res.status(404).json({ message: "Análisis no encontrado" })
    }

    res.json(analisis)
  } catch (error) {
    console.error("Error al obtener análisis del profesor:", error)
    res.status(500).json({ message: "Error al obtener análisis del profesor" })
  }
})

// Solicitar nuevo análisis para un profesor (solo admin)
router.post("/profesor/:id", [auth, admin], async (req, res) => {
  try {
    const nuevoTrabajo = new TrabajoAnalisis({
      tipo: "profesor",
      idObjetivo: req.params.id,
    })

    await nuevoTrabajo.save()
    res.status(201).json({ message: "Análisis solicitado correctamente", trabajo: nuevoTrabajo })
  } catch (error) {
    console.error("Error al solicitar análisis:", error)
    res.status(500).json({ message: "Error al solicitar análisis" })
  }
})

// Procesar un trabajo de análisis pendiente (simulado)
router.post("/procesar/:id", [auth, admin], async (req, res) => {
  try {
    const trabajo = await TrabajoAnalisis.findById(req.params.id)

    if (!trabajo) {
      return res.status(404).json({ message: "Trabajo no encontrado" })
    }

    if (trabajo.estado !== "pendiente") {
      return res.status(400).json({ message: "El trabajo no está pendiente" })
    }

    // Actualizar estado a procesando
    trabajo.estado = "procesando"
    await trabajo.save()

    // Simular procesamiento
    setTimeout(async () => {
      try {
        if (trabajo.tipo === "comentario") {
          // Procesar comentario
          const comentario = await Comentario.findById(trabajo.idObjetivo)
          if (comentario) {
            // Simular análisis completo
            comentario.analisis = {
              sentimiento: comentario.analisis?.sentimiento || "Positivo",
              temas: ["explicaciones", "ejemplos", "evaluaciones"],
              fortalezas: ["Buenas explicaciones", "Ejemplos claros"],
              areasAMejorar: ["Evaluaciones más equilibradas"],
              resumen:
                "Profesor con buenas explicaciones y ejemplos claros, pero con evaluaciones que podrían mejorar.",
            }
            await comentario.save()
          }
        } else if (trabajo.tipo === "profesor") {
          // Procesar análisis de profesor
          // En un entorno real, esto sería más complejo
          const analisis = await AnalisisProfesor.findOne({ idProfesor: trabajo.idObjetivo })
          if (analisis) {
            analisis.feedbackAutomatico =
              "Basado en los comentarios, este profesor destaca en explicaciones claras pero podría mejorar en la dificultad de las evaluaciones."
            await analisis.save()
          }
        }

        // Actualizar trabajo como completado
        trabajo.estado = "completado"
        trabajo.fechaFinalizacion = Date.now()
        await trabajo.save()
      } catch (error) {
        console.error("Error en procesamiento asíncrono:", error)
        trabajo.estado = "error"
        trabajo.error = error.message
        await trabajo.save()
      }
    }, 2000) // Simular 2 segundos de procesamiento

    res.json({ message: "Procesamiento iniciado" })
  } catch (error) {
    console.error("Error al procesar trabajo:", error)
    res.status(500).json({ message: "Error al procesar trabajo" })
  }
})

module.exports = router
