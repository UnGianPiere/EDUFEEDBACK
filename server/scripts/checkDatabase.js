const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Cargar variables de entorno
dotenv.config()

const checkDatabase = async () => {
  try {
    console.log("Verificando conexión a MongoDB...")
    console.log(`URI: ${process.env.MONGODB_URI || "mongodb://localhost:27017/edufeedback"}`)

    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/edufeedback")

    console.log("✅ Conexión a MongoDB exitosa")
    console.log(`Host: ${conn.connection.host}`)
    console.log(`Base de datos: ${conn.connection.name}`)

    // Verificar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log("Colecciones disponibles:")
    collections.forEach((collection) => {
      console.log(`- ${collection.name}`)
    })

    // Verificar documentos en colecciones principales
    const profesoresCount = await conn.connection.db.collection("profesores").countDocuments()
    console.log(`Profesores: ${profesoresCount} documentos`)

    const comentariosCount = await conn.connection.db.collection("comentarios").countDocuments()
    console.log(`Comentarios: ${comentariosCount} documentos`)

    const usuariosCount = await conn.connection.db.collection("usuarios").countDocuments()
    console.log(`Usuarios: ${usuariosCount} documentos`)

    // Cerrar conexión
    await mongoose.connection.close()
    console.log("Conexión cerrada")
  } catch (error) {
    console.error("❌ Error de conexión:", error.message)
    process.exit(1)
  }
}

checkDatabase()
