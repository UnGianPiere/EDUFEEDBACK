const express = require("express")
const router = express.Router()
const informesController = require("../controllers/informesController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

// Todas las rutas requieren autenticación de administrador
router.use([auth, admin])

// Estadísticas generales
router.get("/estadisticas", informesController.obtenerEstadisticas)

// Gestión de usuarios
router.get("/usuarios", informesController.obtenerUsuarios)
router.put("/usuarios/:id/rol", informesController.cambiarRolUsuario)

// Gestión de comentarios
router.get("/comentarios", informesController.obtenerComentarios)
router.delete("/comentarios/:id", informesController.eliminarComentario)

// Gestión de profesores
router.get("/profesores", informesController.obtenerProfesores)

// Departamentos
router.get("/departamentos", informesController.obtenerDepartamentos)

module.exports = router
