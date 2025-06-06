"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useContext } from "react"
import Navbar from "./components/layout/Navbar"
import Home from "./pages/Home"
import Profesores from "./pages/Profesores"
import DetalleProfesor from "./pages/DetalleProfesor"
import Foro from "./pages/Foro"
import AcercaDe from "./pages/AcercaDe"
import Login from "./pages/Login"
import Register from "./pages/Register"
import PublicarComentario from "./pages/PublicarComentario"
import Perfil from "./pages/Perfil"
import { AuthProvider, AuthContext } from "./context/AuthContext"
// Importar la página de Informes
import Informes from "./pages/Informes"

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading, authChecked } = useContext(AuthContext)

  // Mientras se verifica la autenticación, mostrar cargando
  if (!authChecked) {
    return <div className="container mx-auto px-4 py-4 text-center">Cargando...</div>
  }

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Si hay usuario, mostrar el contenido
  return children
}

function AppContent() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Navbar />
      <div className="container mx-auto px-4 py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profesores" element={<Profesores />} />
          <Route path="/profesores/:id" element={<DetalleProfesor />} />
          <Route path="/foro" element={<Foro />} />
          <Route path="/acerca-de" element={<AcercaDe />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/informes"
            element={
              <ProtectedRoute>
                <Informes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publicar-comentario"
            element={
              <ProtectedRoute>
                <PublicarComentario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publicar-comentario/:profesorId"
            element={
              <ProtectedRoute>
                <PublicarComentario />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
