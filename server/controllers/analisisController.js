const AnalisisProfesor = require("../models/AnalisisProfesor")
const Comentario = require("../models/Comentario")
const Profesor = require("../models/Profesor")

// Controladores existentes...
exports.obtenerAnalisisProfesor = async (req, res) => {
  try {
    const analisis = await AnalisisProfesor.findOne({ idProfesor: req.params.id })
    if (!analisis) {
      return res.status(404).json({ message: "Análisis no encontrado" })
    }
    res.json(analisis)
  } catch (error) {
    console.error("Error al obtener análisis:", error)
    res.status(500).json({ message: "Error al obtener análisis" })
  }
}

exports.generarAnalisis = async (req, res) => {
  try {
    // Lógica existente para generar análisis básico...
    res.json({ message: "Análisis generado" })
  } catch (error) {
    console.error("Error al generar análisis:", error)
    res.status(500).json({ message: "Error al generar análisis" })
  }
}

// NUEVOS CONTROLADORES PARA LLM
exports.obtenerAnalisisLLM = async (req, res) => {
  try {
    const { profesorId } = req.params

    console.log(`[ANALISIS-LLM] Obteniendo análisis LLM para profesor: ${profesorId}`)

    // Verificar que el profesor existe
    const profesor = await Profesor.findById(profesorId)
    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" })
    }

    // Buscar análisis existente
    const analisis = await AnalisisProfesor.findOne({ idProfesor: profesorId })

    if (!analisis) {
      console.log(`[ANALISIS-LLM] No existe análisis para profesor ${profesorId}`)
      return res.status(404).json({ message: "No hay análisis LLM disponible" })
    }

    // Verificar si tiene análisis LLM
    if (!analisis.analisisLLM || !analisis.analisisLLM.fechaGeneracion) {
      console.log(`[ANALISIS-LLM] No hay análisis LLM generado para profesor ${profesorId}`)
      return res.status(404).json({ message: "No hay análisis LLM disponible" })
    }

    console.log(`[ANALISIS-LLM] Análisis LLM encontrado, generado el: ${analisis.analisisLLM.fechaGeneracion}`)

    // Devolver solo la parte del análisis LLM
    res.json({
      analisisLLM: analisis.analisisLLM,
      profesor: {
        id: profesor._id,
        nombre: profesor.nombre,
      },
    })
  } catch (error) {
    console.error("[ANALISIS-LLM] Error al obtener análisis LLM:", error)
    res.status(500).json({ message: "Error al obtener análisis LLM" })
  }
}

exports.guardarAnalisisLLM = async (req, res) => {
  try {
    const { profesorId } = req.params
    const {
      resumenEjecutivo,
      fortalezasLLM,
      areasMejoraLLM,
      recomendacionesLLM,
      parametrosUsados,
      comentariosAnalizados,
    } = req.body

    console.log(`[ANALISIS-LLM] Guardando análisis LLM para profesor: ${profesorId}`)
    console.log(`[ANALISIS-LLM] Datos recibidos:`, {
      resumenEjecutivo: resumenEjecutivo?.substring(0, 100) + "...",
      fortalezasCount: fortalezasLLM?.length,
      areasMejoraCount: areasMejoraLLM?.length,
      recomendacionesCount: recomendacionesLLM?.length,
      parametrosUsados,
      comentariosAnalizados,
    })

    // Verificar que el profesor existe
    const profesor = await Profesor.findById(profesorId)
    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" })
    }

    // Validar datos requeridos
    if (!resumenEjecutivo || !fortalezasLLM || !areasMejoraLLM || !recomendacionesLLM) {
      return res.status(400).json({ message: "Faltan datos requeridos del análisis LLM" })
    }

    // Buscar o crear análisis
    let analisis = await AnalisisProfesor.findOne({ idProfesor: profesorId })

    if (!analisis) {
      console.log(`[ANALISIS-LLM] Creando nuevo análisis para profesor ${profesorId}`)
      analisis = new AnalisisProfesor({
        idProfesor: profesorId,
      })
    } else {
      console.log(`[ANALISIS-LLM] Actualizando análisis existente para profesor ${profesorId}`)
    }

    // Actualizar campos LLM
    analisis.analisisLLM = {
      resumenEjecutivo,
      fortalezasLLM,
      areasMejoraLLM,
      recomendacionesLLM,
      fechaGeneracion: new Date(),
      parametrosUsados: parametrosUsados || {
        maxFortalezas: 3,
        maxAreasMejora: 3,
        maxRecomendaciones: 3,
      },
      comentariosAnalizados: comentariosAnalizados || 0,
      versionModelo: "llama3.2",
    }

    analisis.ultimaActualizacion = new Date()

    await analisis.save()

    console.log(`[ANALISIS-LLM] Análisis LLM guardado exitosamente para profesor ${profesorId}`)

    res.json({
      message: "Análisis LLM guardado exitosamente",
      analisisLLM: analisis.analisisLLM,
    })
  } catch (error) {
    console.error("[ANALISIS-LLM] Error al guardar análisis LLM:", error)
    res.status(500).json({ message: "Error al guardar análisis LLM", error: error.message })
  }
}

exports.eliminarAnalisisLLM = async (req, res) => {
  try {
    const { profesorId } = req.params

    console.log(`[ANALISIS-LLM] Eliminando análisis LLM para profesor: ${profesorId}`)

    // Buscar análisis
    const analisis = await AnalisisProfesor.findOne({ idProfesor: profesorId })

    if (!analisis) {
      return res.status(404).json({ message: "Análisis no encontrado" })
    }

    // Limpiar solo la parte LLM
    analisis.analisisLLM = {
      resumenEjecutivo: "",
      fortalezasLLM: [],
      areasMejoraLLM: [],
      recomendacionesLLM: [],
      fechaGeneracion: null,
      parametrosUsados: {
        maxFortalezas: 3,
        maxAreasMejora: 3,
        maxRecomendaciones: 3,
      },
      comentariosAnalizados: 0,
      versionModelo: "llama3.2",
    }

    analisis.ultimaActualizacion = new Date()
    await analisis.save()

    console.log(`[ANALISIS-LLM] Análisis LLM eliminado para profesor ${profesorId}`)

    res.json({ message: "Análisis LLM eliminado exitosamente" })
  } catch (error) {
    console.error("[ANALISIS-LLM] Error al eliminar análisis LLM:", error)
    res.status(500).json({ message: "Error al eliminar análisis LLM" })
  }
}
