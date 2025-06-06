const mongoose = require("mongoose")

const comentarioSchema = new mongoose.Schema({
  idEstudiante: {
    type: String,
    default: "anonimo",
  },
  idProfesor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profesor",
    required: true,
  },
  nombreProfesor: {
    type: String,
    required: true,
  },
  codigoCurso: {
    type: String,
    required: true,
  },
  nombreCurso: {
    type: String,
    required: true,
  },
  calificacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  texto: {
    type: String,
    required: true,
    trim: true,
  },
  fechaHora: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [{
    type: String, // id del usuario que dio like
  }],
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comentario",
    default: null,
  },
  analisis: {
    sentimiento: String,
    temas: [String],
    fortalezas: [String],
    areasAMejorar: [String],
    resumen: String,
  },
})

// Middleware para actualizar la calificación promedio del profesor después de guardar un comentario
comentarioSchema.post("save", async function () {
  try {
    const Profesor = mongoose.model("Profesor")
    const AnalisisProfesor = mongoose.model("AnalisisProfesor")

    // Calcular nueva calificación promedio
    const comentarios = await this.constructor.find({ idProfesor: this.idProfesor })
    const totalComentarios = comentarios.length
    const sumaCalificaciones = comentarios.reduce((sum, comentario) => sum + comentario.calificacion, 0)
    const calificacionPromedio = totalComentarios > 0 ? sumaCalificaciones / totalComentarios : 0

    // Actualizar profesor
    await Profesor.findByIdAndUpdate(this.idProfesor, {
      calificacionPromedio: calificacionPromedio.toFixed(1),
      totalComentarios,
    })

    // Crear o actualizar análisis del profesor
    const distribucionSentimientos = {
      positivos: comentarios.filter((c) => c.analisis?.sentimiento === "Positivo").length,
      neutrales: comentarios.filter((c) => c.analisis?.sentimiento === "Crítico (constructivo)").length,
      negativos: comentarios.filter((c) => c.analisis?.sentimiento === "Negativo").length,
    }

    // Extraer fortalezas y áreas a mejorar
    const todasFortalezas = comentarios.filter((c) => c.analisis?.fortalezas).flatMap((c) => c.analisis.fortalezas)

    const todasAreasAMejorar = comentarios
      .filter((c) => c.analisis?.areasAMejorar)
      .flatMap((c) => c.analisis.areasAMejorar)

    // Contar frecuencia de cada fortaleza y área a mejorar
    const contarFrecuencia = (arr) => {
      return arr.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1
        return acc
      }, {})
    }

    const fortalezasFrecuencia = contarFrecuencia(todasFortalezas)
    const areasAMejorarFrecuencia = contarFrecuencia(todasAreasAMejorar)

    // Convertir a array de objetos para almacenar
    const fortalezas = Object.entries(fortalezasFrecuencia)
      .map(([texto, frecuencia]) => ({ texto, frecuencia }))
      .sort((a, b) => b.frecuencia - a.frecuencia)
      .slice(0, 5)

    const areasAMejorar = Object.entries(areasAMejorarFrecuencia)
      .map(([texto, frecuencia]) => ({ texto, frecuencia }))
      .sort((a, b) => b.frecuencia - a.frecuencia)
      .slice(0, 5)

    // Actualizar o crear análisis
    await AnalisisProfesor.findOneAndUpdate(
      { idProfesor: this.idProfesor },
      {
        ultimaActualizacion: Date.now(),
        totalComentarios,
        calificacionPromedio: calificacionPromedio.toFixed(1),
        distribucionSentimientos,
        fortalezas,
        areasAMejorar,
      },
      { upsert: true, new: true },
    )
  } catch (error) {
    console.error("Error al actualizar análisis del profesor:", error)
  }
})

module.exports = mongoose.model("Comentario", comentarioSchema)
