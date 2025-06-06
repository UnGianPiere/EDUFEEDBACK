const Profesor = require("../models/Profesor")
const Comentario = require("../models/Comentario")
const AnalisisProfesor = require("../models/AnalisisProfesor")

exports.obtenerTodos = async (req, res) => {
  try {
    const profesores = await Profesor.find().sort({ nombre: 1 }).populate('cursos');

    const profesoresConAnalisis = await Promise.all(
      profesores.map(async (profesor) => {
        const analisis = await AnalisisProfesor.findOne({ idProfesor: profesor._id });
        return {
          ...profesor.toObject(),
          analisis: analisis || null,
        };
      })
    );

    res.json(profesoresConAnalisis);
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({ message: 'Error al obtener profesores' });
  }
};


// Obtener un profesor por ID
exports.obtenerPorId = async (req, res) => {
  try {
    const profesor = await Profesor.findById(req.params.id).populate("cursos")

    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" })
    }

    // Obtener comentarios del profesor
    const comentarios = await Comentario.find({ idProfesor: req.params.id }).sort({ fechaHora: -1 })

    // Obtener análisis del profesor
    const analisis = await AnalisisProfesor.findOne({ idProfesor: req.params.id })

    res.json({
      profesor,
      comentarios,
      analisis,
    })
  } catch (error) {
    console.error("Error al obtener profesor:", error)
    res.status(500).json({ message: "Error al obtener profesor" })
  }
}

// Crear un nuevo profesor
exports.crear = async (req, res) => {
  try {
    // LOG: Mostrar datos recibidos
    console.log("[PROFESOR] Datos recibidos:", req.body)
    // Corregir: aceptar 'email' o 'correo' del frontend
    const nombre = req.body.nombre
    const correo = req.body.correo || req.body.email // aceptar ambos
    const departamento = req.body.departamento
    const cursos = req.body.cursos
    if (!nombre || !correo || !departamento || !Array.isArray(cursos) || cursos.length === 0) {
      console.log("[PROFESOR] Faltan campos obligatorios")
      return res.status(400).json({ message: "Nombre, correo, departamento y al menos un curso son obligatorios" })
    }

    // Validar que los cursos existan y sean del departamento o generales
    const cursosDB = await require("../models/Curso").find({ _id: { $in: cursos } })
    const departamentoDB = await require("../models/Departamento").findById(departamento)
    console.log("[PROFESOR] Cursos recibidos:", cursos)
    console.log("[PROFESOR] Cursos encontrados en DB:", cursosDB.map(c=>({id:c._id, nombre:c.nombre, departamento:c.departamento})))
    console.log("[PROFESOR] Departamento recibido:", departamento)
    console.log("[PROFESOR] Departamento encontrado en DB:", departamentoDB)
    if (!departamentoDB) {
      console.log("[PROFESOR] Departamento no válido")
      return res.status(400).json({ message: "Departamento no válido" })
    }
    // Un curso es válido si es del departamento o si es general (departamento: 'General')
    const cursosValidos = cursosDB.filter(c => c.departamento === departamentoDB.nombre || c.departamento === 'General')
    console.log("[PROFESOR] Cursos válidos:", cursosValidos.map(c=>({id:c._id, nombre:c.nombre, departamento:c.departamento})))
    if (cursosValidos.length !== cursos.length) {
      console.log("[PROFESOR] Error: Uno o más cursos no son válidos para el departamento seleccionado")
      return res.status(400).json({ message: "Uno o más cursos no son válidos para el departamento seleccionado" })
    }

    // Crear el profesor solo con los campos esenciales y opcionales
    const nuevoProfesor = new Profesor({
      nombre,
      correo,
      departamento,
      cursos,
      especializacion: req.body.especializacion || "",
      oficina: req.body.oficina || "",
      horarioAtencion: req.body.horarioAtencion || "",
      urlFoto: req.body.urlFoto || "",
    })
    await nuevoProfesor.save()
    res.status(201).json(nuevoProfesor)
  } catch (error) {
    console.error("[PROFESOR] Error al crear profesor:", error)
    res.status(500).json({ message: "Error al crear profesor", error: error.message, stack: error.stack })
  }
}

// Actualizar un profesor
exports.actualizar = async (req, res) => {
  try {
    const profesor = await Profesor.findByIdAndUpdate(
      req.params.id,
      { ...req.body, fechaActualizacion: Date.now() },
      { new: true },
    )

    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" })
    }

    res.json(profesor)
  } catch (error) {
    console.error("Error al actualizar profesor:", error)
    res.status(500).json({ message: "Error al actualizar profesor" })
  }
}

// Eliminar un profesor
exports.eliminar = async (req, res) => {
  try {
    const profesor = await Profesor.findByIdAndDelete(req.params.id)

    if (!profesor) {
      return res.status(404).json({ message: "Profesor no encontrado" })
    }

    // Eliminar comentarios asociados
    await Comentario.deleteMany({ idProfesor: req.params.id })

    // Eliminar análisis asociado
    await AnalisisProfesor.deleteOne({ idProfesor: req.params.id })

    res.json({ message: "Profesor eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar profesor:", error)
    res.status(500).json({ message: "Error al eliminar profesor" })
  }
}

// Obtener profesores destacados
exports.obtenerDestacados = async (req, res) => {
  try {
    const profesores = await Profesor.find()
      .sort({ calificacionPromedio: -1, totalComentarios: -1 })
      .limit(3)
      .populate("departamento")
    // Mapear para incluir nombre del departamento
    const profesoresConDepto = profesores.map((p) => ({
      _id: p._id,
      nombre: p.nombre,
      departamento: p.departamento?.nombre || "",
      calificacionPromedio: p.calificacionPromedio,
      totalComentarios: p.totalComentarios,
    }))
    res.json(profesoresConDepto)
  } catch (error) {
    console.error("Error al obtener profesores destacados:", error)
    res.status(500).json({ message: "Error al obtener profesores destacados" })
  }
}

// Obtener profesores populares
exports.obtenerPopulares = async (req, res) => {
  try {
    const profesores = await Profesor.find()
      .sort({ totalComentarios: -1 })
      .limit(5)
      .select("_id nombre totalComentarios")

    const result = profesores.map((p) => ({
      _id: p._id,
      nombre: p.nombre,
      comentarios: p.totalComentarios,
    }))

    res.json(result)
  } catch (error) {
    console.error("Error al obtener profesores populares:", error)
    res.status(500).json({ message: "Error al obtener profesores populares" })
  }
}
