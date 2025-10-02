import React from "react"
import { useNavigate } from "react-router-dom"
import "../Styles/404.css"

export default function Pagina404() {
    const navigate = useNavigate()

    return (
        <div className="pagina404-contenedor">
            <div className="pagina404-card">
                <h1 className="pagina404-titulo">404</h1>
                <p className="pagina404-mensaje">
                    La página que buscas no existe o ha sido eliminada
                </p>
                <button
                    className="pagina404-boton"
                    onClick={() => navigate("/")}
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    )
}
