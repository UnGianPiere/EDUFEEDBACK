const mongoose = require("mongoose")

const analisisProfesorSchema = new mongoose.Schema({
  idProfesor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profesor",
    required: true,
  },
  ultimaActualizacion: {
    type: Date,
    default: Date.now,
  },
  totalComentarios: {
    type: Number,
    default: 0,
  },
  calificacionPromedio: {
    type: Number,
    default: 0,
  },
  distribucionSentimientos: {
    positivos: {
      type: Number,
      default: 0,
    },
    neutrales: {
      type: Number,
      default: 0,
    },
    negativos: {
      type: Number,
      default: 0,
    },
  },
  fortalezas: [
    {
      texto: String,
      frecuencia: Number,
    },
  ],
  areasAMejorar: [
    {
      texto: String,
      frecuencia: Number,
    },
  ],
  feedbackAutomatico: {
    type: String,
    default: "",
  },
  // NUEVOS CAMPOS ESPECÍFICOS PARA LLM
  analisisLLM: {
    resumenEjecutivo: {
      type: String,
      default: "",
    },
    fortalezasLLM: [
      {
        type: String,
      },
    ],
    areasMejoraLLM: [
      {
        type: String,
      },
    ],
    recomendacionesLLM: [
      {
        type: String,
      },
    ],
    fechaGeneracion: {
      type: Date,
      default: null,
    },
    parametrosUsados: {
      maxFortalezas: {
        type: Number,
        default: 3,
      },
      maxAreasMejora: {
        type: Number,
        default: 3,
      },
      maxRecomendaciones: {
        type: Number,
        default: 3,
      },
    },
    comentariosAnalizados: {
      type: Number,
      default: 0,
    },
    versionModelo: {
      type: String,
      default: "llama3.2",
    },
  },
})

module.exports = mongoose.model("AnalisisProfesor", analisisProfesorSchema)
