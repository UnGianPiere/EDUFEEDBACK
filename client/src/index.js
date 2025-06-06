import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import axios from "axios"

// Configurar axios
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000"
axios.defaults.headers.post["Content-Type"] = "application/json"

// Interceptor para manejar errores
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
