"use client"

import { useContext, useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Search, User, LogOut, Menu, X, Settings } from "lucide-react"
import toast from "react-hot-toast"

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, authChecked } = useContext(AuthContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  // Cerrar menú de perfil al cambiar de ruta
  useEffect(() => {
    setIsProfileMenuOpen(false)
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/profesores?search=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleLogout = () => {
    logout()
    toast.success("Sesión cerrada correctamente")
    navigate("/")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  // Obtener iniciales del nombre de usuario
  const getUserInitials = () => {
    if (!user || !user.nombreUsuario) return "U"

    const nameParts = user.nombreUsuario.split(" ")
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    }
    return nameParts[0][0].toUpperCase()
  }

  // Determinar color de fondo del avatar basado en el correo
  const getAvatarColor = () => {
    if (!user || !user.correo) return "bg-blue-600"

    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-600",
      "bg-yellow-600",
      "bg-red-600",
      "bg-indigo-600",
      "bg-teal-600",
    ]

    const hash = user.correo
      .split("@")[0]
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)

    return colors[hash % colors.length]
  }

  return (
    <nav className="border-b border-gray-200 py-3 bg-white">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img src="/images/logo.png" alt="EduFeedback" className="h-12 mr-2" />
            <span className="text-blue-600 font-bold text-xl">EduFeedback</span>
          </Link>
          <div className="relative hidden md:block">
            <form onSubmit={handleSearch}>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="search"
                className="block w-64 p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar profesor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className={`flex items-center gap-1 ${location.pathname === "/" ? "text-blue-600" : "text-gray-700"}`}
          >
            <span>Inicio</span>
          </Link>
          <Link
            to="/profesores"
            className={`flex items-center gap-1 ${
              location.pathname === "/profesores" ? "text-blue-600" : "text-gray-700"
            }`}
          >
            <span>Profesores</span>
          </Link>
          <Link
            to="/foro"
            className={`flex items-center gap-1 ${
              location.pathname === "/foro" ? "text-blue-600 bg-blue-100 px-3 py-1 rounded-md" : "text-gray-700"
            }`}
          >
            <span>Foro</span>
          </Link>
          <Link
            to="/acerca-de"
            className={`flex items-center gap-1 ${location.pathname === "/acerca-de" ? "text-blue-600" : "text-gray-700"}`}
          >
            <span>Acerca de</span>
          </Link>
          {authChecked && user && user.rol === "admin" && (
            <Link
              to="/panel-admin"
              className={`flex items-center gap-1 ${
                location.pathname === "/panel-admin" ? "text-blue-600" : "text-gray-700"
              }`}
            >
              <span>Panel de Administración</span>
            </Link>
          )}
          {authChecked && user && user.rol === "admin" && (
            <Link
              to="/control-docente-admin"
              className={`flex items-center gap-1 ${
                location.pathname === "/control-docente-admin" ? "text-indigo-600" : "text-gray-700"
              }`}
            >
              <span>Control Docente Admin</span>
            </Link>
          )}

          {authChecked && user ? (
            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                {user.urlFoto ? (
                  <img
                    src={user.urlFoto || "/placeholder.svg"}
                    alt={user.nombreUsuario}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-8 h-8 rounded-full ${getAvatarColor()} flex items-center justify-center text-white`}
                  >
                    {getUserInitials()}
                  </div>
                )}
                <span className="hidden lg:inline">{user.nombreUsuario}</span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user.nombreUsuario}</div>
                    <div className="text-gray-500 truncate">{user.correo}</div>
                  </div>
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </Link>
                  {user.rol === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Panel de Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsProfileMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-md flex items-center"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-3 px-4 py-2 bg-white border-t border-gray-200">
          <div className="mb-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="search"
                className="block w-full p-2 pl-10 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar profesor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>

          <div className="space-y-3">
            <Link
              to="/"
              className={`block py-2 ${location.pathname === "/" ? "text-blue-600" : "text-gray-700"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/profesores"
              className={`block py-2 ${location.pathname === "/profesores" ? "text-blue-600" : "text-gray-700"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profesores
            </Link>
            <Link
              to="/foro"
              className={`block py-2 ${location.pathname === "/foro" ? "text-blue-600" : "text-gray-700"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Foro
            </Link>
            <Link
              to="/acerca-de"
              className={`block py-2 ${location.pathname === "/acerca-de" ? "text-blue-600" : "text-gray-700"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Acerca de
            </Link>
            {authChecked && user && user.rol === "admin" && (
              <Link
                to="/panel-admin"
                className={`block py-2 ${location.pathname === "/panel-admin" ? "text-blue-600" : "text-gray-700"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Panel de Administración
              </Link>
            )}
            {authChecked && user && user.rol === "admin" && (
              <Link
                to="/control-docente-admin"
                className={`block py-2 ${location.pathname === "/control-docente-admin" ? "text-indigo-600" : "text-gray-700"}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Control Docente Admin
              </Link>
            )}

            {authChecked && user ? (
              <>
                <div className="py-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    {user.urlFoto ? (
                      <img
                        src={user.urlFoto || "/placeholder.svg"}
                        alt={user.nombreUsuario}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full ${getAvatarColor()} flex items-center justify-center text-white`}
                      >
                        {getUserInitials()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{user.nombreUsuario}</div>
                      <div className="text-xs text-gray-500">{user.correo}</div>
                    </div>
                  </div>
                  <Link
                    to="/perfil"
                    className="block py-2 text-gray-700 flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </Link>
                  {user.rol === "admin" && (
                    <Link
                      to="/admin"
                      className="block py-2 text-gray-700 flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Panel de Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 text-gray-700 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 border-t border-gray-200">
                <Link
                  to="/login"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
