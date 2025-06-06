const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Cargar variables de entorno
dotenv.config()

const testConnection = async () => {
  try {
    console.log("Probando conexión a MongoDB...")
    console.log(`URI: ${process.env.MONGODB_URI}`)

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("✅ Conexión a MongoDB exitosa")

    // Probar consultas básicas
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log(
      "📊 Colecciones disponibles:",
      collections.map((c) => c.name),
    )

    // Cerrar conexión
    await mongoose.connection.close()
    console.log("🔌 Conexión cerrada")
  } catch (error) {
    console.error("❌ Error de conexión:", error.message)
    process.exit(1)
  }
}

testConnection()
