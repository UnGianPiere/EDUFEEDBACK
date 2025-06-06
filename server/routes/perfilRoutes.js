const express = require("express")
const router = express.Router()
const perfilController = require("../controllers/perfilController")
const auth = require("../middleware/auth")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Configurar multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Crear directorio si no existe
    const uploadDir = path.join(__dirname, "../../client/public/uploads/profile")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Generar nombre único
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// Filtrar archivos (solo imágenes)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Solo se permiten imágenes"), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
})

// Rutas del perfil
router.get("/", auth, perfilController.obtenerPerfil)
router.put("/", auth, perfilController.actualizarPerfil)
router.post("/cambiar-contrasena", auth, perfilController.cambiarContrasena)
router.get("/estadisticas", auth, perfilController.obtenerEstadisticas)
router.get("/comentarios", auth, perfilController.obtenerComentarios)
router.post("/foto", auth, upload.single("foto"), perfilController.subirFotoPerfil)
router.delete("/foto", auth, perfilController.eliminarFotoPerfil)

module.exports = router
