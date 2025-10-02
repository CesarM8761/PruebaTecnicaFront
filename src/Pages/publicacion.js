import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../config"
import user from "../images/user.jpg"
import "../Styles/Publicacion.css"

export default function Publicacion() {
    const { id } = useParams()
    const navigate = useNavigate()
    const tokenJWT = localStorage.getItem("TokenJWT")
    const idUsuarioLogeado = parseInt(localStorage.getItem("idUsuarioLogeado"))

    const [publicacion, setPublicacion] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_BASE_URL}/Publicaciones/${id}`)
            .then(res => res.json())
            .then(data => {
                setPublicacion(data)
                setLoading(false)
            })
            .catch(err => {
                console.error("Error cargando publicación:", err)
                setLoading(false)
            })
    }, [id])

    const handleEliminar = async () => {
        if (!window.confirm("¿Deseas eliminar esta publicación?")) return
        try {
            const res = await fetch(`${API_BASE_URL}/Publicaciones/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${tokenJWT}` }
            })
            if (!res.ok) throw new Error("Error eliminando publicación")
            navigate(`/usuario/${idUsuarioLogeado}`)
        } catch (err) {
            console.error(err)
            alert("Ocurrió un error al eliminar la publicación")
        }
    }

    if (loading) return <div className="pagina-publicacion">Cargando...</div>
    if (!publicacion) return <div className="pagina-publicacion">No se encontró la publicación</div>

    const esAutor = publicacion.autorId === idUsuarioLogeado

    return (
        <div className="pagina-publicacion">
            <div className="contenedor-publicacion">
                <div className="columna-contenido">
                    {publicacion.imagenBase64 && (
                        <img
                            src={`data:image/png;base64,${publicacion.imagenBase64}`}
                            alt="Publicación"
                            className="imagen-publicacion"
                        />
                    )}
                    <h1 className="titulo-publicacion">{publicacion.titulo}</h1>
                    <p className="contenido-publicacion">{publicacion.contenido}</p>
                </div>
                <div className="columna-autor">
                    <img
                        src={user}
                        alt="Autor"
                        className="imagen-autor"
                    />
                    <div>
                        <div className="etiqueta-autor">Autor</div>
                        <div>{publicacion.autorUsername}</div>
                    </div>
                    <button
                        className="boton-general-publicacion boton-ver-perfil"
                        onClick={() => navigate(`/usuario/${publicacion.autorId}`)}
                    >
                        Ver perfil
                    </button>
                    {esAutor && (
                        <>
                            <button
                                className="boton-general-publicacion boton-editar"
                                onClick={() => navigate(`/editarPublicacion/${id}`)}
                            >
                                Editar
                            </button>
                            <button
                                className="boton-general-publicacion boton-eliminar"
                                onClick={handleEliminar}
                            >
                                Eliminar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
