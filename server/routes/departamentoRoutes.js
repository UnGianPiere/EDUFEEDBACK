const express = require("express")
const router = express.Router()
const Departamento = require("../models/Departamento")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")

// Obtener todos los departamentos
router.get("/", async (req, res) => {
  try {
    const departamentos = await Departamento.find().sort({ nombre: 1 })
    res.json(departamentos)
  } catch (error) {
    console.error("Error al obtener departamentos:", error)
    res.status(500).json({ message: "Error al obtener departamentos" })
  }
})

// Obtener un departamento por ID
router.get("/:id", async (req, res) => {
  try {
    const departamento = await Departamento.findById(req.params.id)

    if (!departamento) {
      return res.status(404).json({ message: "Departamento no encontrado" })
    }

    res.json(departamento)
  } catch (error) {
    console.error("Error al obtener departamento:", error)
    res.status(500).json({ message: "Error al obtener departamento" })
  }
})

// Obtener todos los cursos
router.get("/cursos/todos", async (req, res) => {
  try {
    const Curso = require("../models/Curso")
    const cursos = await Curso.find()
    res.json(cursos)
  } catch (error) {
    console.error("Error al obtener cursos:", error)
    res.status(500).json({ message: "Error al obtener cursos" })
  }
})

// Crear un nuevo departamento (solo admin)
router.post("/", [auth, admin], async (req, res) => {
  try {
    const nuevoDepartamento = new Departamento(req.body)
    await nuevoDepartamento.save()
    res.status(201).json(nuevoDepartamento)
  } catch (error) {
    console.error("Error al crear departamento:", error)
    res.status(500).json({ message: "Error al crear departamento" })
  }
})

// Actualizar un departamento (solo admin)
router.put("/:id", [auth, admin], async (req, res) => {
  try {
    const departamento = await Departamento.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!departamento) {
      return res.status(404).json({ message: "Departamento no encontrado" })
    }

    res.json(departamento)
  } catch (error) {
    console.error("Error al actualizar departamento:", error)
    res.status(500).json({ message: "Error al actualizar departamento" })
  }
})

// Eliminar un departamento (solo admin)
router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const departamento = await Departamento.findByIdAndDelete(req.params.id)

    if (!departamento) {
      return res.status(404).json({ message: "Departamento no encontrado" })
    }

    res.json({ message: "Departamento eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar departamento:", error)
    res.status(500).json({ message: "Error al eliminar departamento" })
  }
})

module.exports = router
