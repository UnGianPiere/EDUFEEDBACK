const Usuario = require("../models/Usuario")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { enviarCodigoVerificacion } = require("../utils/emailService")
require("dotenv").config()

// Generar código de verificación aleatorio
const generarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Registro de usuario
exports.registrar = async (req, res) => {
  try {
    console.log("Iniciando registro de usuario:", req.body.correo)

    // Verificar si el correo es del dominio @continental.edu.pe
    if (!req.body.correo.endsWith("@continental.edu.pe")) {
      return res.status(400).json({ message: "Solo se permiten correos institucionales (@continental.edu.pe)" })
    }

    // Verificar si el usuario ya existe
    let usuario = await Usuario.findOne({ correo: req.body.correo })
    if (usuario) {
      return res.status(400).json({ message: "El usuario ya existe" })
    }

    // Generar código de verificación
    const codigo = generarCodigo()
    const expiracion = new Date()
    expiracion.setMinutes(expiracion.getMinutes() + 30) // Expira en 30 minutos

    console.log(`Código de verificación generado: ${codigo}`)

    // Crear nuevo usuario
    usuario = new Usuario({
      nombreUsuario: req.body.nombreUsuario,
      correo: req.body.correo,
      hashContrasena: req.body.contrasena,
      carrera: req.body.carrera || "",
      ciclo: req.body.ciclo || null,
      codigoVerificacion: codigo,
      expiracionCodigo: expiracion,
      verificado: false,
    })

    await usuario.save()
    console.log(`Usuario guardado con ID: ${usuario._id}`)

    // Enviar correo con código de verificación
    try {
      console.log("Intentando enviar correo de verificación...")
      await enviarCodigoVerificacion(usuario.correo, codigo, usuario.nombreUsuario)
      console.log("Correo de verificación enviado correctamente")
    } catch (emailError) {
      console.error("Error al enviar correo de verificación:", emailError)
      // No devolvemos error, continuamos con el registro
    }

    res.status(201).json({
      message: "Usuario registrado. Por favor verifica tu correo electrónico.",
      userId: usuario._id,
    })
  } catch (error) {
    console.error("Error en registro:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Verificar código
exports.verificarCodigo = async (req, res) => {
  try {
    const { userId, codigo } = req.body

    const usuario = await Usuario.findById(userId)
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Verificar si el código es válido y no ha expirado
    if (usuario.codigoVerificacion !== codigo) {
      return res.status(400).json({ message: "Código de verificación inválido" })
    }

    if (new Date() > usuario.expiracionCodigo) {
      return res.status(400).json({ message: "El código ha expirado. Solicita uno nuevo." })
    }

    // Marcar usuario como verificado
    usuario.verificado = true
    usuario.codigoVerificacion = undefined
    usuario.expiracionCodigo = undefined
    await usuario.save()

    // Generar token
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET || "edufeedback_secret", {
      expiresIn: "30d", // 30 días
    })

    res.json({
      token,
      user: {
        id: usuario._id,
        nombreUsuario: usuario.nombreUsuario,
        correo: usuario.correo,
        rol: usuario.rol,
        carrera: usuario.carrera,
        ciclo: usuario.ciclo,
        urlFoto: usuario.urlFoto,
      },
    })
  } catch (error) {
    console.error("Error en verificación:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Reenviar código de verificación
exports.reenviarCodigo = async (req, res) => {
  try {
    const { correo } = req.body

    const usuario = await Usuario.findOne({ correo })
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    if (usuario.verificado) {
      return res.status(400).json({ message: "Este usuario ya está verificado" })
    }

    // Generar nuevo código
    const codigo = generarCodigo()
    const expiracion = new Date()
    expiracion.setMinutes(expiracion.getMinutes() + 30) // Expira en 30 minutos

    usuario.codigoVerificacion = codigo
    usuario.expiracionCodigo = expiracion
    await usuario.save()

    // Enviar correo con código de verificación
    await enviarCodigoVerificacion(usuario.correo, codigo, usuario.nombreUsuario)

    res.json({
      message: "Código de verificación reenviado",
      userId: usuario._id,
    })
  } catch (error) {
    console.error("Error al reenviar código:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Login de usuario
exports.login = async (req, res) => {
  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ correo: req.body.correo })
    if (!usuario) {
      return res.status(400).json({ message: "Credenciales inválidas" })
    }

    // Verificar contraseña
    const esValida = await usuario.compararContrasena(req.body.contrasena)
    if (!esValida) {
      return res.status(400).json({ message: "Credenciales inválidas" })
    }

    // Verificar si el usuario está verificado
    if (!usuario.verificado) {
      // Generar nuevo código
      const codigo = generarCodigo()
      const expiracion = new Date()
      expiracion.setMinutes(expiracion.getMinutes() + 30) // Expira en 30 minutos

      usuario.codigoVerificacion = codigo
      usuario.expiracionCodigo = expiracion
      await usuario.save()

      // Enviar correo con código de verificación
      await enviarCodigoVerificacion(usuario.correo, codigo, usuario.nombreUsuario)

      return res.status(403).json({
        message: "Cuenta no verificada. Se ha enviado un nuevo código de verificación a tu correo.",
        userId: usuario._id,
        requireVerification: true,
      })
    }

    // Actualizar último acceso
    usuario.ultimoAcceso = Date.now()
    await usuario.save()

    // Generar token
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET || "edufeedback_secret", {
      expiresIn: "30d", // 30 días
    })

    res.json({
      token,
      user: {
        id: usuario._id,
        nombreUsuario: usuario.nombreUsuario,
        correo: usuario.correo,
        rol: usuario.rol,
        carrera: usuario.carrera,
        ciclo: usuario.ciclo,
        urlFoto: usuario.urlFoto,
      },
    })
  } catch (error) {
    console.error("Error en login:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Obtener usuario actual
exports.getMe = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select(
      "-hashContrasena -codigoVerificacion -expiracionCodigo",
    )
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }
    res.json(usuario)
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}
