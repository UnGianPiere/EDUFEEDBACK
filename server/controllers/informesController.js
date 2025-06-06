const Usuario = require("../models/Usuario")
const Profesor = require("../models/Profesor")
const Comentario = require("../models/Comentario")
const Departamento = require("../models/Departamento")

// Obtener estadísticas generales
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Estadísticas de usuarios
    const totalUsuarios = await Usuario.countDocuments()
    const usuariosVerificados = await Usuario.countDocuments({ verificado: true })
    const porcentajeVerificados = totalUsuarios > 0 ? Math.round((usuariosVerificados / totalUsuarios) * 100) : 0

    // Estadísticas de comentarios
    const totalComentarios = await Comentario.countDocuments()
    const comentariosPositivos = await Comentario.countDocuments({ "analisis.sentimiento": "Positivo" })
    const comentariosCriticos = await Comentario.countDocuments({ "analisis.sentimiento": "Crítico (constructivo)" })
    const comentariosNegativos = await Comentario.countDocuments({ "analisis.sentimiento": "Negativo" })

    const porcentajePositivos = totalComentarios > 0 ? Math.round((comentariosPositivos / totalComentarios) * 100) : 0
    const porcentajeCriticos = totalComentarios > 0 ? Math.round((comentariosCriticos / totalComentarios) * 100) : 0
    const porcentajeNegativos = totalComentarios > 0 ? Math.round((comentariosNegativos / totalComentarios) * 100) : 0

    // Estadísticas de profesores
    const totalProfesores = await Profesor.countDocuments()
    const profesoresMejorCalificados = await Profesor.find()
      .sort({ calificacionPromedio: -1 })
      .limit(5)
      .select("nombre calificacionPromedio")

    const profesoresMasComentados = await Profesor.find()
      .sort({ totalComentarios: -1 })
      .limit(5)
      .select("nombre totalComentarios calificacionPromedio")

    // Usuarios más activos
    const usuariosMasActivos = await Comentario.aggregate([
      {
        $match: {
          idEstudiante: { $exists: true, $ne: null, $ne: "anonimo" },
          $expr: { $ne: [{ $type: "$idEstudiante" }, "string"] }, // Excluir strings como "anonimo"
        },
      },
      {
        $group: {
          _id: "$idEstudiante",
          totalComentarios: { $sum: 1 },
        },
      },
      { $sort: { totalComentarios: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "usuarios",
          localField: "_id",
          foreignField: "_id",
          as: "usuario",
        },
      },
      { $unwind: { path: "$usuario", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          nombreUsuario: { $ifNull: ["$usuario.nombreUsuario", "Usuario eliminado"] },
          correo: { $ifNull: ["$usuario.correo", "N/A"] },
          totalComentarios: 1,
        },
      },
    ])

    // Comentarios recientes
    const comentariosRecientes = await Comentario.aggregate([
      { $sort: { fechaHora: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "cursos",
          localField: "codigoCurso",
          foreignField: "codigo",
          as: "cursoInfo",
        },
      },
      {
        $addFields: {
          nombreCurso: { $arrayElemAt: ["$cursoInfo.nombre", 0] },
        },
      },
      {
        $project: {
          nombreProfesor: 1,
          codigoCurso: 1,
          nombreCurso: 1,
          texto: 1,
          calificacion: 1,
          fechaHora: 1,
          analisis: 1,
        },
      },
    ])

    res.json({
      usuarios: {
        total: totalUsuarios,
        verificados: usuariosVerificados,
        porcentajeVerificados,
      },
      comentarios: {
        total: totalComentarios,
        positivos: comentariosPositivos,
        criticos: comentariosCriticos,
        negativos: comentariosNegativos,
        porcentajePositivos,
        porcentajeCriticos,
        porcentajeNegativos,
      },
      profesores: {
        total: totalProfesores,
        mejorCalificados: profesoresMejorCalificados,
        masComentados: profesoresMasComentados,
      },
      usuariosMasActivos,
      comentariosRecientes,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({ message: "Error al obtener estadísticas" })
  }
}

// Obtener usuarios con paginación
exports.obtenerUsuarios = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""

    const query = search
      ? {
          $or: [{ nombreUsuario: { $regex: search, $options: "i" } }, { correo: { $regex: search, $options: "i" } }],
        }
      : {}

    const total = await Usuario.countDocuments(query)
    const pages = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const usuarios = await Usuario.find(query)
      .select("-hashContrasena -codigoVerificacion -expiracionCodigo")
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      usuarios,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    })
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    res.status(500).json({ message: "Error al obtener usuarios" })
  }
}

// Obtener comentarios con paginación y filtros
exports.obtenerComentarios = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const sentimiento = req.query.sentimiento || ""

    const query = {}

    if (search) {
      query.$or = [
        { nombreProfesor: { $regex: search, $options: "i" } },
        { texto: { $regex: search, $options: "i" } },
        { codigoCurso: { $regex: search, $options: "i" } },
      ]
    }

    if (sentimiento) {
      query["analisis.sentimiento"] = sentimiento
    }

    const total = await Comentario.countDocuments(query)
    const pages = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const comentarios = await Comentario.find(query).sort({ fechaHora: -1 }).skip(skip).limit(limit)

    res.json({
      comentarios,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    })
  } catch (error) {
    console.error("Error al obtener comentarios:", error)
    res.status(500).json({ message: "Error al obtener comentarios" })
  }
}

// Obtener profesores con paginación y filtros
exports.obtenerProfesores = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const departamento = req.query.departamento || ""

    const query = {}

    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: "i" } },
        { especializacion: { $regex: search, $options: "i" } },
      ]
    }

    if (departamento) {
      query.departamento = departamento
    }

    const total = await Profesor.countDocuments(query)
    const pages = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const profesores = await Profesor.find(query)
      .populate("cursos", "nombre codigo")
      .sort({ nombre: 1 })
      .skip(skip)
      .limit(limit)

    res.json({
      profesores,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    })
  } catch (error) {
    console.error("Error al obtener profesores:", error)
    res.status(500).json({ message: "Error al obtener profesores" })
  }
}

// Obtener departamentos
exports.obtenerDepartamentos = async (req, res) => {
  try {
    const departamentos = await Departamento.find().sort({ nombre: 1 })
    res.json(departamentos)
  } catch (error) {
    console.error("Error al obtener departamentos:", error)
    res.status(500).json({ message: "Error al obtener departamentos" })
  }
}

// Eliminar comentario
exports.eliminarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findByIdAndDelete(req.params.id)

    if (!comentario) {
      return res.status(404).json({ message: "Comentario no encontrado" })
    }

    // Actualizar contador y calificación del profesor
    const comentariosRestantes = await Comentario.find({ idProfesor: comentario.idProfesor })
    const totalComentarios = comentariosRestantes.length
    const sumaCalificaciones = comentariosRestantes.reduce((sum, c) => sum + c.calificacion, 0)
    const calificacionPromedio = totalComentarios > 0 ? sumaCalificaciones / totalComentarios : 0

    await Profesor.findByIdAndUpdate(comentario.idProfesor, {
      totalComentarios,
      calificacionPromedio: calificacionPromedio.toFixed(1),
    })

    res.json({ message: "Comentario eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar comentario:", error)
    res.status(500).json({ message: "Error al eliminar comentario" })
  }
}

// Cambiar rol de usuario
exports.cambiarRolUsuario = async (req, res) => {
  try {
    const { rol } = req.body
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, { rol }, { new: true }).select("-hashContrasena")

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.json(usuario)
  } catch (error) {
    console.error("Error al cambiar rol de usuario:", error)
    res.status(500).json({ message: "Error al cambiar rol de usuario" })
  }
}
