const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const usuarioController = require("../controllers/usuarioController")

// Rutas protegidas - requieren autenticación
router.get("/perfil", auth, usuarioController.obtenerPerfil)
router.put("/perfil", auth, usuarioController.actualizarPerfil)
router.post("/cambiar-contrasena", auth, usuarioController.cambiarContrasena)
router.get("/estadisticas", auth, usuarioController.obtenerEstadisticas)
router.get("/comentarios", auth, usuarioController.obtenerComentarios)

// Rutas de administrador
router.get("/", [auth, admin], async (req, res) => {
  try {
    const Usuario = require("../models/Usuario")
    const usuarios = await Usuario.find().select("-hashContrasena").sort({ fechaCreacion: -1 })
    res.json(usuarios)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
})

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const Usuario = require("../models/Usuario")
    const usuario = await Usuario.findByIdAndDelete(req.params.id)

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
})

module.exports = router
