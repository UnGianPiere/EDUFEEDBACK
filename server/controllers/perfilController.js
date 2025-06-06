const Usuario = require("../models/Usuario")
const Comentario = require("../models/Comentario")
const bcrypt = require("bcryptjs")
const fs = require("fs")
const path = require("path")

// Obtener perfil del usuario actual
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select(
      "-hashContrasena -codigoVerificacion -expiracionCodigo",
    )

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.json(usuario)
  } catch (error) {
    console.error("Error al obtener perfil:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Actualizar perfil de usuario
exports.actualizarPerfil = async (req, res) => {
  try {
    const { nombreUsuario, carrera, ciclo } = req.body

    // Validar datos
    if (!nombreUsuario) {
      return res.status(400).json({ message: "El nombre de usuario es obligatorio" })
    }

    const usuario = await Usuario.findById(req.usuario.id)

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Actualizar campos
    usuario.nombreUsuario = nombreUsuario
    if (carrera) usuario.carrera = carrera
    if (ciclo) usuario.ciclo = Number.parseInt(ciclo) || usuario.ciclo

    await usuario.save()

    res.json({
      id: usuario._id,
      nombreUsuario: usuario.nombreUsuario,
      correo: usuario.correo,
      rol: usuario.rol,
      carrera: usuario.carrera,
      ciclo: usuario.ciclo,
      urlFoto: usuario.urlFoto,
      fechaCreacion: usuario.fechaCreacion,
      ultimoAcceso: usuario.ultimoAcceso,
      verificado: usuario.verificado,
    })
  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Cambiar contraseña
exports.cambiarContrasena = async (req, res) => {
  try {
    const { contrasenaActual, nuevaContrasena } = req.body

    // Validar datos
    if (!contrasenaActual || !nuevaContrasena) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" })
    }

    if (nuevaContrasena.length < 6) {
      return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres" })
    }

    const usuario = await Usuario.findById(req.usuario.id)

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Verificar contraseña actual
    const esValida = await usuario.compararContrasena(contrasenaActual)
    if (!esValida) {
      return res.status(400).json({ message: "La contraseña actual es incorrecta" })
    }

    // Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10)
    usuario.hashContrasena = await bcrypt.hash(nuevaContrasena, salt)

    await usuario.save()

    res.json({ message: "Contraseña actualizada correctamente" })
  } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Obtener estadísticas del usuario
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Contar comentarios del usuario
    const totalComentarios = await Comentario.countDocuments({ idEstudiante: req.usuario.id })

    // Obtener promedio de calificaciones dadas
    const comentarios = await Comentario.find({ idEstudiante: req.usuario.id })
    const sumaCalificaciones = comentarios.reduce((sum, c) => sum + c.calificacion, 0)
    const promedioCalificaciones = totalComentarios > 0 ? (sumaCalificaciones / totalComentarios).toFixed(1) : 0

    // Obtener profesores comentados
    const profesoresComentados = await Comentario.distinct("idProfesor", { idEstudiante: req.usuario.id })

    res.json({
      totalComentarios,
      promedioCalificaciones,
      profesoresComentados: profesoresComentados.length,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Obtener comentarios del usuario
exports.obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.find({ idEstudiante: req.usuario.id }).sort({ fechaHora: -1 }).limit(10)
    res.json(comentarios)
  } catch (error) {
    console.error("Error al obtener comentarios:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Subir foto de perfil
exports.subirFotoPerfil = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No se ha subido ninguna imagen" })
    }

    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Guardar la ruta de la imagen en la base de datos
    const imageUrl = `/uploads/profile/${req.file.filename}`

    // Si el usuario ya tenía una foto, eliminar la anterior
    if (usuario.urlFoto && usuario.urlFoto !== imageUrl) {
      const oldImagePath = path.join(__dirname, "..", "..", "client", "public", usuario.urlFoto)
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath)
      }
    }

    usuario.urlFoto = imageUrl
    await usuario.save()

    res.json({
      message: "Foto de perfil actualizada correctamente",
      urlFoto: usuario.urlFoto,
    })
  } catch (error) {
    console.error("Error al subir foto de perfil:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Eliminar foto de perfil
exports.eliminarFotoPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // Si el usuario tiene una foto, eliminarla
    if (usuario.urlFoto) {
      const imagePath = path.join(__dirname, "..", "..", "client", "public", usuario.urlFoto)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }

      usuario.urlFoto = ""
      await usuario.save()
    }

    res.json({ message: "Foto de perfil eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar foto de perfil:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}
