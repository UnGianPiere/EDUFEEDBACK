const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Cargar variables de entorno
dotenv.config()

console.log("Verificando variables de entorno críticas:")
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? "Configurado" : "No configurado"}`)
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? "Configurado" : "No configurado"}`)
console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

const profesorRoutes = require("./routes/profesorRoutes")
const comentarioRoutes = require("./routes/comentarioRoutes")
const departamentoRoutes = require("./routes/departamentoRoutes")
const authRoutes = require("./routes/authRoutes")
const analisisRoutes = require("./routes/analisisRoutes")
const perfilRoutes = require("./routes/perfilRoutes")
const informesRoutes = require("./routes/informesRoutes")
const cursoRoutes = require("./routes/cursoRoutes")

const app = express()

// Permitir CORS desde todos los orígenes (público)
app.use(cors()) // <-- habilita acceso desde cualquier origen

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: false, limit: "10mb" }))
app.use("/uploads", express.static(path.join(__dirname, "../client/public/uploads")))

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/edufeedback")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err)
    process.exit(1)
  })

// Rutas API
app.use("/api/profesores", profesorRoutes)
app.use("/api/comentarios", comentarioRoutes)
app.use("/api/departamentos", departamentoRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/analisis", analisisRoutes)
app.use("/api/perfil", perfilRoutes)
app.use("/api/informes", informesRoutes)
app.use("/api/cursos", cursoRoutes)

app.get("/api/stats", async (req, res) => {
  try {
    const profesoresCount = await mongoose.model("Profesor").countDocuments()
    const comentariosCount = await mongoose.model("Comentario").countDocuments()
    const usuariosCount = await mongoose.model("Usuario").countDocuments()

    res.json({
      profesores: profesoresCount,
      comentarios: comentariosCount,
      usuarios: usuariosCount,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    res.status(500).json({ message: "Error al obtener estadísticas" })
  }
})

app.get("/api/test", (req, res) => {
  res.json({
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  })
})

// Servir frontend en producción
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")))
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"))
  })
}

app.use((err, req, res, next) => {
  console.error("Error no manejado:", err.stack)
  res.status(500).json({ message: "Error interno del servidor" })
})

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor ejecutándose en el puerto ${PORT}`)
  console.log(`🌍 Entorno: ${process.env.NODE_ENV}`)
})

process.on("unhandledRejection", (err, promise) => {
  console.log(`❌ Error no manejado: ${err.message}`)
  server.close(() => process.exit(1))
})

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM recibido, cerrando servidor...")
  server.close(() => console.log("💤 Proceso terminado"))
})
