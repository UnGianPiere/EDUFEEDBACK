const express = require("express")
const router = express.Router()
const Comentario = require("../models/Comentario")
const Profesor = require("../models/Profesor")
const Curso = require("../models/Curso")
const TrabajoAnalisis = require("../models/TrabajoAnalisis")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const analizarSentimiento = require("../utils/sentimentAnalysis")

// Obtener todos los comentarios
router.get("/", async (req, res) => {
  try {
    const comentarios = await Comentario.find().sort({ fechaHora: -1 }).limit(20)
    res.json(comentarios)
  } catch (error) {
    console.error("Error al obtener comentarios:", error)
    res.status(500).json({ message: "Error al obtener comentarios" })
  }
})

// Obtener comentarios recientes
router.get("/recientes", async (req, res) => {
  try {
    const comentarios = await Comentario.find().sort({ fechaHora: -1 }).limit(5)
    res.json(comentarios)
  } catch (error) {
    console.error("Error al obtener comentarios recientes:", error)
    res.status(500).json({ message: "Error al obtener comentarios recientes" })
  }
})

// Ruta alternativa para temas (alias de temas-destacados)
router.get("/temas", async (req, res) => {
  try {
    const comentarios = await Comentario.find({ "analisis.temas": { $exists: true, $ne: [] } })
    const todasPalabras = comentarios.flatMap((c) => c.analisis?.temas || [])

    // Contar frecuencia de cada tema
    const frecuenciaTemas = todasPalabras.reduce((acc, tema) => {
      acc[tema] = (acc[tema] || 0) + 1
      return acc
    }, {})

    // Convertir a array y ordenar por frecuencia
    const temasOrdenados = Object.entries(frecuenciaTemas)
      .map(([tema, frecuencia]) => ({ tema, frecuencia }))
      .sort((a, b) => b.frecuencia - a.frecuencia)
      .slice(0, 15)
      .map((item) => item.tema)

    res.json(temasOrdenados)
  } catch (error) {
    console.error("Error al obtener temas:", error)
    res.status(500).json({ message: "Error al obtener temas" })
  }
})

// Obtener temas destacados
router.get("/temas-destacados", async (req, res) => {
  try {
    const comentarios = await Comentario.find({ "analisis.temas": { $exists: true, $ne: [] } })
    const todasPalabras = comentarios.flatMap((c) => c.analisis?.temas || [])

    // Contar frecuencia de cada tema
    const frecuenciaTemas = todasPalabras.reduce((acc, tema) => {
      acc[tema] = (acc[tema] || 0) + 1
      return acc
    }, {})

    // Convertir a array y ordenar por frecuencia
    const temasOrdenados = Object.entries(frecuenciaTemas)
      .map(([tema, frecuencia]) => ({ tema, frecuencia }))
      .sort((a, b) => b.frecuencia - a.frecuencia)
      .slice(0, 15)
      .map((item) => item.tema)

    res.json(temasOrdenados)
  } catch (error) {
    console.error("Error al obtener temas destacados:", error)
    res.status(500).json({ message: "Error al obtener temas destacados" })
  }
})

// Obtener comentarios por profesor
router.get("/profesor/:id", async (req, res) => {
  try {
    const comentarios = await Comentario.find({ idProfesor: req.params.id }).sort({ fechaHora: -1 })
    res.json(comentarios)
  } catch (error) {
    console.error("Error al obtener comentarios del profesor:", error)
    res.status(500).json({ message: "Error al obtener comentarios del profesor" })
  }
})

// Crear o actualizar un comentario
router.post("/", async (req, res) => {
  try {
    const profesor = await Profesor.findById(req.body.idProfesor)
    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" })
    }

    // Obtener información del curso
    const curso = await Curso.findById(req.body.codigoCurso)
    if (!curso) {
      return res.status(404).json({ message: "Curso no encontrado" })
    }

    // Si es respuesta (parentId), solo crear sin análisis de sentimiento
    if (req.body.parentId) {
      const nuevoComentario = new Comentario({
        ...req.body,
        nombreProfesor: profesor.nombre,
        nombreCurso: curso.nombre, // Agregar nombre del curso
      })
      await nuevoComentario.save()
      const nuevoTrabajo = new TrabajoAnalisis({ tipo: "comentario", idObjetivo: nuevoComentario._id })
      await nuevoTrabajo.save()
      return res.status(201).json(nuevoComentario)
    }

    // Si no es respuesta, buscar si ya existe comentario de este usuario para este profesor
    const existente = await Comentario.findOne({
      idProfesor: req.body.idProfesor,
      idEstudiante: req.body.idEstudiante,
      parentId: null,
    })
    if (existente) {
      // Actualizar comentario existente
      existente.texto = req.body.texto
      existente.calificacion = req.body.calificacion
      existente.codigoCurso = req.body.codigoCurso
      existente.nombreCurso = curso.nombre // Agregar nombre del curso
      existente.fechaHora = Date.now()
      try {
        const resultado = await analizarSentimiento(req.body.texto)
        existente.analisis = {
          sentimiento: resultado.etiqueta,
          temas: resultado.palabras_clave || [],
          fortalezas: [],
          areasAMejorar: [],
        }
      } catch (error) {
        console.error("Error al analizar sentimiento:", error)
      }
      await existente.save()
      return res.status(200).json(existente)
    } else {
      // Crear nuevo comentario principal
      const nuevoComentario = new Comentario({
        ...req.body,
        nombreProfesor: profesor.nombre,
        nombreCurso: curso.nombre, // Agregar nombre del curso
      })
      try {
        const resultado = await analizarSentimiento(req.body.texto)
        nuevoComentario.analisis = {
          sentimiento: resultado.etiqueta,
          temas: resultado.palabras_clave || [],
          fortalezas: [],
          areasAMejorar: [],
        }
      } catch (error) {
        console.error("Error al analizar sentimiento:", error)
      }

      await nuevoComentario.save()

      // Crear trabajo de análisis para el comentario
      const nuevoTrabajo = new TrabajoAnalisis({
        tipo: "comentario",
        idObjetivo: nuevoComentario._id,
      })
      await nuevoTrabajo.save()

      return res.status(201).json(nuevoComentario)
    }
  } catch (error) {
    console.error("Error al crear comentario:", error)
    res.status(500).json({ message: "Error al crear comentario" })
  }
})

// Like único por usuario
router.post("/:id/like", auth, async (req, res) => {
  try {
    const userId = req.usuario.id
    const comentario = await Comentario.findById(req.params.id)
    if (!comentario) {
      return res.status(404).json({ message: "Comentario no encontrado" })
    }
    if (comentario.likedBy.includes(userId)) {
      return res.status(400).json({ message: "Ya diste like a este comentario" })
    }
    comentario.likes += 1
    comentario.likedBy.push(userId)
    await comentario.save()
    res.json(comentario)
  } catch (error) {
    console.error("Error al dar like:", error)
    res.status(500).json({ message: "Error al dar like" })
  }
})

// Eliminar un comentario (solo admin)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const comentario = await Comentario.findByIdAndDelete(req.params.id)

    if (!comentario) {
      return res.status(404).json({ message: "Comentario no encontrado" })
    }

    // Actualizar contador y calificación del profesor
    const comentariosRestantes = await Comentario.find({ idProfesor: comentario.idProfesor })
    const totalComentarios = comentariosRestantes.length
    const sumaCalificaciones = comentariosRestantes.reduce((sum, c) => sum + c.calificacion, 0)
    const calificacionPromedio = totalComentarios > 0 ? sumaCalificaciones / totalComentarios : 0

    await Profesor.findByIdAndUpdate(comentario.idProfesor, {
      totalComentarios,
      calificacionPromedio: calificacionPromedio.toFixed(1),
    })

    res.json({ message: "Comentario eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar comentario:", error)
    res.status(500).json({ message: "Error al eliminar comentario" })
  }
})

module.exports = router
