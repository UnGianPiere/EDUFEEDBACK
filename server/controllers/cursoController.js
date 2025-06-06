const Curso = require("../models/Curso")

// Crear un nuevo curso
exports.crearCurso = async (req, res) => {
  try {
    const curso = new Curso(req.body)
    await curso.save()
    res.status(201).json(curso)
  } catch (error) {
    res.status(400).json({ message: "Error al crear el curso", error })
  }
}

// Obtener todos los cursos
exports.obtenerCursos = async (req, res) => {
  try {
    const cursos = await Curso.find()
    res.json(cursos)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los cursos", error })
  }
}

// Obtener un curso por ID
exports.obtenerCursoPorId = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id)
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" })
    res.json(curso)
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el curso", error })
  }
}

// Actualizar un curso
exports.actualizarCurso = async (req, res) => {
  try {
    const curso = await Curso.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" })
    res.json(curso)
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el curso", error })
  }
}

// Eliminar un curso
exports.eliminarCurso = async (req, res) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id)
    if (!curso) return res.status(404).json({ message: "Curso no encontrado" })
    res.json({ message: "Curso eliminado" })
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el curso", error })
  }
}
