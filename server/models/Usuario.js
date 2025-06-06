const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const usuarioSchema = new mongoose.Schema({
  nombreUsuario: {
    type: String,
    required: true,
    trim: true,
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    match: [/^[\w-.]+@continental\.edu\.pe$/, "Por favor ingrese un correo institucional válido (@continental.edu.pe)"],
  },
  hashContrasena: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ["estudiante", "admin", "moderador"],
    default: "estudiante",
  },
  verificado: {
    type: Boolean,
    default: false,
  },
  codigoVerificacion: {
    type: String,
  },
  expiracionCodigo: {
    type: Date,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  ultimoAcceso: {
    type: Date,
    default: Date.now,
  },
  carrera: {
    type: String,
    trim: true,
  },
  ciclo: {
    type: Number,
    min: 1,
    max: 10,
  },
  urlFoto: {
    type: String,
    default: "",
  },
})

// Método para comparar contraseñas
usuarioSchema.methods.compararContrasena = async function (contrasena) {
  return await bcrypt.compare(contrasena, this.hashContrasena)
}

// Middleware para hashear la contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("hashContrasena")) {
    return next()
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.hashContrasena = await bcrypt.hash(this.hashContrasena, salt)
    next()
  } catch (error) {
    next(error)
  }
})

module.exports = mongoose.model("Usuario", usuarioSchema)
