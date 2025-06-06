module.exports = (req, res, next) => {
  // Verificar si el usuario es admin
  if (req.usuario && req.usuario.rol === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Acceso denegado. Se requieren permisos de administrador." })
  }
}
