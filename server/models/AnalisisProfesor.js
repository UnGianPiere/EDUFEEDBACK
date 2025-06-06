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
  analisisPalabrasClave: [
    {
      palabra: String,
      frecuencia: Number,
    },
  ],
  tendenciasTemas: [
    {
      tema: String,
      frecuencia: Number,
    },
  ],
})

module.exports = mongoose.model("AnalisisProfesor", analisisProfesorSchema)
