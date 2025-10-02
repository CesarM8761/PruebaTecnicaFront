import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import "../Styles/Header.css";
import logo from "../images/logo.png";

export default function Header({ isLoggedIn, onLogout }) {
    const [username, setUsername] = useState("");
    const [showCategorias, setShowCategorias] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const idUsuarioLogeado = localStorage.getItem("idUsuarioLogeado");
    const navigate = useNavigate();
    const headerRef = useRef(null);

    useEffect(() => {
        if (idUsuarioLogeado) {
            fetch(`${API_BASE_URL}/Usuarios/${idUsuarioLogeado}`)
                .then(res => res.json())
                .then(data => setUsername(data.username))
                .catch(err => console.error("Error fetching user data:", err));
        }
    }, [idUsuarioLogeado]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/Categorias`)
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error("Error fetching categories:", err));
    }, []);

    const handleLogoutClick = () => {
        onLogout();
        navigate("/");
    };

    const handleCategoriaClick = () => {
        setShowCategorias(false);
    };

    return (
        <header
            className="encabezado"
            ref={headerRef}
            onMouseLeave={() => setShowCategorias(false)}
        >
            <div className="encabezado-izquierda">
                <Link to="/">
                    <img src={logo} alt="Logo" className="logo-header" />
                </Link>
                <nav className="navegacion-header">
                    <Link to="/" className="enlace-navegacion">Inicio</Link>
                    <div className="menu-desplegable">
                        <button
                            className="boton-desplegable"
                            onClick={() => setShowCategorias(prev => !prev)}
                        >
                            Categorías
                        </button>
                        {showCategorias && (
                            <div className="menu-items-desplegable">
                                {categorias.map(cat => (
                                    <Link
                                        key={cat.idCategoria}
                                        to={`/categorias/${cat.idCategoria}`}
                                        className="item-menu-desplegable"
                                        onClick={handleCategoriaClick}
                                    >
                                        {cat.nombreCategoria}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>
            </div>
            <div className="encabezado-derecha">
                {!isLoggedIn ? (
                    <>
                        <Link to="/login" className="boton-iniciar-sesion">Iniciar sesión</Link>
                        <Link to="/registro" className="boton-registrarse">Registrarse</Link>
                    </>
                ) : (
                    <div className="acciones-usuario">
                        <Link to={`/usuario/${idUsuarioLogeado}`} className="boton-registrarse">
                            {username}
                        </Link>
                        <button className="boton-cerrar-sesion" onClick={handleLogoutClick}>
                            Cerrar sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
