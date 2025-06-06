const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const Usuario = require("../models/Usuario")
const auth = require("../middleware/auth")
const { enviarCodigoVerificacion } = require("../utils/emailService")
const crypto = require("crypto")
require("dotenv").config()
const authController = require("../controllers/authController")

// Verificar que las variables de entorno estén cargadas
console.log("Verificando variables de entorno en authRoutes:")
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? "Configurado" : "No configurado"}`)
console.log(`MAILTRAP_API_TOKEN: ${process.env.MAILTRAP_API_TOKEN ? "Configurado" : "No configurado"}`)

// Generar código de verificación aleatorio
const generarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Registro de usuario
router.post("/register", authController.registrar)

// Verificar código
router.post("/verificar", authController.verificarCodigo)

// Reenviar código de verificación
router.post("/reenviar-codigo", authController.reenviarCodigo)

// Login de usuario
router.post("/login", authController.login)

// Obtener usuario actual
router.get("/me", auth, authController.getMe)

// Actualizar perfil de usuario
router.put("/perfil", auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Campos que se pueden actualizar
    if (req.body.nombreUsuario) usuario.nombreUsuario = req.body.nombreUsuario
    if (req.body.carrera) usuario.carrera = req.body.carrera
    if (req.body.ciclo) usuario.ciclo = req.body.ciclo

    await usuario.save()

    res.json({
      id: usuario._id,
      nombreUsuario: usuario.nombreUsuario,
      correo: usuario.correo,
      rol: usuario.rol,
      carrera: usuario.carrera,
      ciclo: usuario.ciclo,
    })
  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
})

module.exports = router
