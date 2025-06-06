const express = require("express")
const router = express.Router()
const profesorController = require("../controllers/profesorController")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

// Obtener todos los profesores
router.get("/", profesorController.obtenerTodos)

// Obtener profesores destacados
router.get("/destacados", profesorController.obtenerDestacados)

// Obtener profesores populares (con más comentarios)
router.get("/populares", profesorController.obtenerPopulares)

// Obtener un profesor por ID
router.get("/:id", profesorController.obtenerPorId)

// Crear un nuevo profesor (solo admin)
router.post("/", [auth, admin], profesorController.crear)

// Actualizar un profesor (solo admin)
router.put("/:id", [auth, admin], profesorController.actualizar)

// Eliminar un profesor (solo admin)
router.delete("/:id", [auth, admin], profesorController.eliminar)

module.exports = router
