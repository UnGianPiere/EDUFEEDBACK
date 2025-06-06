const mongoose = require("mongoose")

const trabajoAnalisisSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["comentario", "profesor", "global"],
    required: true,
  },
  estado: {
    type: String,
    enum: ["pendiente", "procesando", "completado", "error"],
    default: "pendiente",
  },
  idObjetivo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  resultado: {
    type: Object,
    default: {},
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  fechaFinalizacion: {
    type: Date,
  },
  error: {
    type: String,
    default: "",
  },
})

module.exports = mongoose.model("TrabajoAnalisis", trabajoAnalisisSchema)
