const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const Profesor = require("../models/Profesor")
const Departamento = require("../models/Departamento")
const Usuario = require("../models/Usuario")
const Comentario = require("../models/Comentario")
const Curso = require("../models/Curso")

dotenv.config()

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/edufeedback")
  .then(() => console.log("Conectado a MongoDB para seeds"))
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err)
    process.exit(1)
  })

// Datos de ejemplo
const departamentos = [
  // ... Copia los departamentos del seed original ...
]

const cursos = departamentos.flatMap((dep) =>
  dep.cursos.map((curso) => ({
    ...curso,
    departamento: dep.nombre,
  }))
)

const profesores = [
  // ... Copia los profesores del seed original ...
]

const usuarios = [
  // ... Copia los usuarios del seed original ...
]

const comentarios = [
  // ... Copia los comentarios del seed original ...
]

async function sembrarDatos() {
  try {
    await Departamento.deleteMany({})
    await Profesor.deleteMany({})
    await Usuario.deleteMany({})
    await Comentario.deleteMany({})
    await Curso.deleteMany({})

    console.log("Colecciones limpiadas")

    const departamentosInsertados = await Departamento.insertMany(departamentos)
    console.log(`${departamentosInsertados.length} departamentos insertados`)

    const cursosInsertados = await Curso.insertMany(cursos)
    console.log(`${cursosInsertados.length} cursos insertados`)

    // Mapear códigos de curso a ObjectId
    const codigoToId = {}
    cursosInsertados.forEach((curso) => {
      codigoToId[curso.codigo] = curso._id
    })

    // Asignar cursos como referencias a los profesores
    const profesoresConRefs = profesores.map((prof) => ({
      ...prof,
      cursos: prof.cursos.map((codigo) => codigoToId[codigo]).filter(Boolean),
    }))

    const profesoresInsertados = await Profesor.insertMany(profesoresConRefs)
    console.log(`${profesoresInsertados.length} profesores insertados`)

    const usuariosConHash = await Promise.all(
      usuarios.map(async (usuario) => {
        const salt = await bcrypt.genSalt(10)
        usuario.hashContrasena = await bcrypt.hash(usuario.hashContrasena, salt)
        return usuario
      })
    )
    const usuariosInsertados = await Usuario.insertMany(usuariosConHash)
    console.log(`${usuariosInsertados.length} usuarios insertados`)

    // Insertar comentarios
    const comentariosCompletos = comentarios.map((comentario, index) => {
      const profesor = profesoresInsertados[index % profesoresInsertados.length]
      const estudiante = usuariosInsertados[index % usuariosInsertados.length]
      return {
        ...comentario,
        idProfesor: profesor._id,
        nombreProfesor: profesor.nombre,
        idEstudiante: estudiante._id,
        idCurso: codigoToId[comentario.codigoCurso],
      }
    })
    const comentariosInsertados = await Comentario.insertMany(comentariosCompletos)
    console.log(`${comentariosInsertados.length} comentarios insertados`)

    // Actualizar calificaciones y contadores de profesores
    for (const profesor of profesoresInsertados) {
      const comentariosProfesor = comentariosInsertados.filter(
        (c) => c.idProfesor.toString() === profesor._id.toString()
      )
      const totalComentarios = comentariosProfesor.length
      const sumaCalificaciones = comentariosProfesor.reduce((sum, c) => sum + c.calificacion, 0)
      const calificacionPromedio = totalComentarios > 0 ? sumaCalificaciones / totalComentarios : 0
      await Profesor.findByIdAndUpdate(profesor._id, {
        totalComentarios,
        calificacionPromedio: calificacionPromedio.toFixed(1),
      })
    }

    console.log("Datos sembrados correctamente")
    process.exit(0)
  } catch (error) {
    console.error("Error al sembrar datos:", error)
    process.exit(1)
  }
}

sembrarDatos()
