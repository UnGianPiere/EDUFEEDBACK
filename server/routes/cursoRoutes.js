const express = require("express")
const router = express.Router()
const cursoController = require("../controllers/cursoController")

// Crear un nuevo curso
router.post("/", cursoController.crearCurso)

// Obtener todos los cursos
router.get("/", cursoController.obtenerCursos)

// Obtener un curso por ID
router.get("/:id", cursoController.obtenerCursoPorId)

// Actualizar un curso
router.put("/:id", cursoController.actualizarCurso)

// Eliminar un curso
router.delete("/:id", cursoController.eliminarCurso)

module.exports = router
