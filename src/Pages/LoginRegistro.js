import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "../Styles/LoginRegistro.css"
import { API_BASE_URL } from "../config"

export default function LoginRegistro({ onLogin }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    nombre: "",
    username: "",
    email: "",
    password: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (location.pathname === "/registro") setIsLogin(false)
    else setIsLogin(true)
  }, [location.pathname])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleMode = () => {
    const nextLogin = !isLogin
    setIsLogin(nextLogin)
    navigate(nextLogin ? "/login" : "/registro")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (isLogin) {
        const res = await fetch(`${API_BASE_URL}/Usuarios/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        })
        if (!res.ok) throw new Error("Credenciales inválidas")
        const data = await res.json()
        localStorage.setItem("TokenJWT", data.token)
        localStorage.setItem("idUsuarioLogeado", data.idUsuario)
        if (onLogin) onLogin({ username: formData.email, idUsuario: data.idUsuario }, data.token)
        navigate(`/usuario/${data.idUsuario}`)
      } else {
        const res = await fetch(`${API_BASE_URL}/Usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: formData.nombre,
            username: formData.username,
            email: formData.email,
            password: formData.password
          })
        })
        if (!res.ok) throw new Error("Error al registrar")
        const loginRes = await fetch(`${API_BASE_URL}/Usuarios/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        })
        if (!loginRes.ok) throw new Error("No se pudo iniciar sesión")
        const loginData = await loginRes.json()
        localStorage.setItem("TokenJWT", loginData.token)
        localStorage.setItem("idUsuarioLogeado", loginData.idUsuario)
        if (onLogin) onLogin({ username: formData.username, idUsuario: loginData.idUsuario }, loginData.token)
        navigate(`/usuario/${loginData.idUsuario}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left"></div>
        <div className="login-right">
          <h2 className="login-title">{isLogin ? "Iniciar Sesión" : "Registrarse"}</h2>
          <form style={{ display: "flex", flexDirection: "column", gap: "12px" }} onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  className="login-input"
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <input
                  className="login-input"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </>
            )}
            <input
              className="login-input"
              type="email"
              name="email"
              placeholder="Correo"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="login-input"
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Cargando..." : isLogin ? "Ingresar" : "Registrarse"}
            </button>
            {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
          </form>
          <div className="login-switch" onClick={toggleMode}>
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </div>
        </div>
      </div>
    </div>
  )
}
