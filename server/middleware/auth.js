const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  // Obtener token del header
  const token = req.header("Authorization")?.replace("Bearer ", "")

  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." })
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "edufeedback_secret")

    // Verificar si el token está expirado
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < now) {
      return res.status(401).json({ message: "Token expirado" })
    }

    // Añadir datos del usuario al request
    req.usuario = decoded
    next()
  } catch (error) {
    console.error("Error de autenticación:", error.message)

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado" })
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido" })
    }

    res.status(401).json({ message: "Error de autenticación" })
  }
}
