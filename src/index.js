import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Landing from "./Pages/landing"
import Publicacion from "./Pages/publicacion"
import User from "./Pages/user"
import CrearPublicacion from "./Pages/crearPublicacion"
import Layout from "./Components/Layout"
import LoginRegistro from "./Pages/LoginRegistro"
import "./index.css"
import Pagina404 from "./Pages/404"

const App = () =>
{
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() =>
  {
    const token = localStorage.getItem("TokenJWT")
    const nombre = localStorage.getItem("username") || ""
    if (token)
    {
      setIsLoggedIn(true)
      setUsername(nombre)
    }
  }, [])

  const handleLogin = (user, token) =>
  {
    localStorage.setItem("TokenJWT", token)
    localStorage.setItem("username", user.username)
    localStorage.setItem("idUsuarioLogeado", user.idUsuario)
    setIsLoggedIn(true)
    setUsername(user.username)
  }

  const handleLogout = () =>
  {
    localStorage.removeItem("TokenJWT")
    localStorage.removeItem("username")
    localStorage.removeItem("idUsuarioLogeado")
    setIsLoggedIn(false)
    setUsername("")
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />}>
          <Route path="/" element={<Landing />} />
          <Route path="/categorias/:id" element={<Landing />} />
          <Route path="/publicacion/:id" element={<Publicacion />} />
          <Route path="/login" element={<LoginRegistro onLogin={handleLogin} />} />
          <Route path="/registro" element={<LoginRegistro onLogin={handleLogin} />} />
          <Route path="/usuario/:id" element={<User />} />
          <Route path="/crearPublicacion" element={<CrearPublicacion />} />
          <Route path="/editarPublicacion/:id" element={<CrearPublicacion />} />
          <Route path="/404" element={<Pagina404/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)
