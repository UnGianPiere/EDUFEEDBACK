const express = require("express")
const router = express.Router()
const informesController = require("../controllers/informesController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const Profesor = require("../models/Profesor")
const Comentario = require("../models/Comentario")
const AnalisisProfesor = require("../models/AnalisisProfesor")

// Todas las rutas requieren autenticación de administrador
router.use([auth, admin])

// Estadísticas generales
router.get("/estadisticas", informesController.obtenerEstadisticas)

// Gestión de usuarios
router.get("/usuarios", informesController.obtenerUsuarios)
router.put("/usuarios/:id/rol", informesController.cambiarRolUsuario)

// Gestión de comentarios
router.get("/comentarios", informesController.obtenerComentarios)
router.delete("/comentarios/:id", informesController.eliminarComentario)

// Gestión de profesores
router.get("/profesores", informesController.obtenerProfesores)

// Departamentos
router.get("/departamentos", informesController.obtenerDepartamentos)

// Control Docente - Obtener profesores para análisis
router.get("/control-docente", async (req, res) => {
  try {
    console.log("=== CONTROL DOCENTE REQUEST ===")
    console.log("Query params:", req.query)

    const { departamento, curso, periodo, busqueda } = req.query

    const query = {}

    // Filtrar por departamento si se especifica
    if (departamento && departamento !== "") {
      console.log("Filtrando por departamento:", departamento)
      query.departamento = departamento
    }

    // Filtrar por búsqueda de nombre si se especifica
    if (busqueda && busqueda !== "") {
      console.log("Filtrando por búsqueda:", busqueda)
      query.nombre = { $regex: busqueda, $options: "i" }
    }

    console.log("Query final para profesores:", query)

    const profesores = await Profesor.find(query)
      .populate("departamento")
      .populate("cursos")
      .sort({ totalComentarios: -1 })
      .limit(50)

    console.log(`Profesores encontrados: ${profesores.length}`)

    // Filtrar por curso si se especifica
    let profesoresFiltrados = profesores
    if (curso && curso !== "") {
      console.log("Filtrando por curso:", curso)
      profesoresFiltrados = profesores.filter((p) => p.cursos && p.cursos.some((c) => c._id.toString() === curso))
      console.log(`Profesores después de filtrar por curso: ${profesoresFiltrados.length}`)
    }

    console.log("=== RESPONSE ===")
    console.log(`Total profesores a enviar: ${profesoresFiltrados.length}`)

    res.json({
      profesores: profesoresFiltrados,
      total: profesoresFiltrados.length,
    })
  } catch (error) {
    console.error("=== ERROR EN CONTROL DOCENTE ===")
    console.error("Error completo:", error)
    console.error("Stack trace:", error.stack)
    res.status(500).json({
      message: "Error al obtener datos de control docente",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

// Control Docente - Análisis detallado de un profesor
router.get("/profesor-analisis/:id", async (req, res) => {
  try {
    console.log("=== ANÁLISIS PROFESOR REQUEST ===")
    const profesorId = req.params.id
    console.log("ID del profesor:", profesorId)

    // Obtener profesor
    const profesor = await Profesor.findById(profesorId).populate("departamento").populate("cursos")

    if (!profesor) {
      console.log("Profesor no encontrado")
      return res.status(404).json({ message: "Profesor no encontrado" })
    }

    console.log("Profesor encontrado:", profesor.nombre)

    // Obtener comentarios del profesor
    const comentarios = await Comentario.find({ idProfesor: profesorId }).sort({ fechaHora: -1 })

    console.log(`Comentarios encontrados: ${comentarios.length}`)

    // Obtener análisis del profesor
    const analisis = await AnalisisProfesor.findOne({ idProfesor: profesorId })
    console.log("Análisis encontrado:", analisis ? "Sí" : "No")

    // Calcular distribución de sentimientos
    const distribucionSentimientos = {
      positivos: comentarios.filter((c) => c.analisis?.sentimiento === "Positivo").length,
      neutrales: comentarios.filter((c) => c.analisis?.sentimiento === "Crítico (constructivo)").length,
      negativos: comentarios.filter((c) => c.analisis?.sentimiento === "Negativo").length,
    }

    console.log("Distribución de sentimientos:", distribucionSentimientos)

    // Calcular comentarios por mes para el gráfico temporal
    const comentariosPorMes = {}

    comentarios.forEach((c) => {
      const fecha = new Date(c.fechaHora)
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`
      const sentimiento = c.analisis?.sentimiento || "Sin clasificar"

      // Contar por mes
      if (!comentariosPorMes[mes]) {
        comentariosPorMes[mes] = { total: 0, positivos: 0, neutrales: 0, negativos: 0 }
      }
      comentariosPorMes[mes].total++

      // Contar por sentimiento y mes
      if (sentimiento === "Positivo") {
        comentariosPorMes[mes].positivos++
      } else if (sentimiento === "Crítico (constructivo)") {
        comentariosPorMes[mes].neutrales++
      } else if (sentimiento === "Negativo") {
        comentariosPorMes[mes].negativos++
      }
    })

    console.log("Comentarios por mes:", comentariosPorMes)

    // Análisis de palabras frecuentes
    const palabrasFrequentes = {}
    comentarios.forEach((c) => {
      if (c.analisis?.temas) {
        c.analisis.temas.forEach((tema) => {
          palabrasFrequentes[tema] = (palabrasFrequentes[tema] || 0) + 1
        })
      }

      // También analizar palabras del texto
      const palabras = c.texto
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(
          (palabra) =>
            palabra.length > 3 &&
            ![
              "para",
              "pero",
              "esta",
              "este",
              "esta",
              "muy",
              "más",
              "que",
              "con",
              "por",
              "una",
              "del",
              "las",
              "los",
              "son",
              "como",
              "bien",
              "todo",
              "hace",
              "tiene",
              "puede",
              "debe",
              "sobre",
              "entre",
              "hasta",
              "desde",
            ].includes(palabra),
        )

      palabras.forEach((palabra) => {
        palabrasFrequentes[palabra] = (palabrasFrequentes[palabra] || 0) + 1
      })
    })

    // Top 10 palabras más frecuentes
    const topPalabras = Object.entries(palabrasFrequentes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([palabra, frecuencia]) => ({ palabra, frecuencia }))

    console.log("Top palabras:", topPalabras)

    const response = {
      profesor,
      comentarios,
      analisis,
      totalComentarios: comentarios.length,
      calificacionPromedio: profesor.calificacionPromedio || 0,
      distribucionSentimientos,
      comentariosPorMes,
      topPalabras,
      ultimaActualizacion: new Date(),
    }

    console.log("=== RESPONSE ANÁLISIS ===")
    console.log("Total comentarios:", response.totalComentarios)
    console.log("Calificación promedio:", response.calificacionPromedio)

    res.json(response)
  } catch (error) {
    console.error("=== ERROR EN ANÁLISIS PROFESOR ===")
    console.error("Error completo:", error)
    console.error("Stack trace:", error.stack)
    res.status(500).json({
      message: "Error al obtener análisis detallado del profesor",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    })
  }
})

module.exports = router
