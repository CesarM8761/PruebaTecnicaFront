import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { API_BASE_URL } from "../config"
import user from "../images/user.jpg"
import "../Styles/User.css"

export default function User()
{
    const navigate = useNavigate()
    const { id } = useParams()
    const loggedUserId = localStorage.getItem("idUsuarioLogeado")
    const tokenJWT = localStorage.getItem("TokenJWT")
    const [usuario, setUsuario] = useState(null)
    const [publicaciones, setPublicaciones] = useState([])

    useEffect(() =>
    {
        if (!id) return
        fetch(`${API_BASE_URL}/Usuarios/${id}`)
            .then(res =>
            {
                if (!res.ok) throw new Error("Usuario no encontrado")
                return res.json()
            })
            .then(data =>
            {
                if (!data || Object.keys(data).length === 0) navigate("/404")
                else setUsuario(data)
            })
            .catch(err => { console.error(err); navigate("/404") })

        fetch(`${API_BASE_URL}/Publicaciones/Usuario/${id}`)
            .then(res => res.json())
            .then(data => setPublicaciones(data))
            .catch(err => console.error(err))
    }, [id, navigate])

    const handleDelete = (idPublicacion) =>
    {
        if (!window.confirm("¿Deseas eliminar esta publicación?")) return
        fetch(`${API_BASE_URL}/Publicaciones/${idPublicacion}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${tokenJWT}` }
        })
            .then(res =>
            {
                if (res.ok) setPublicaciones(prev => prev.filter(pub => pub.idPublicacion !== idPublicacion))
                else console.error("Error eliminando la publicación")
            })
            .catch(err => console.error(err))
    }

    const isOwner = loggedUserId === id

    return (
        <div className="contenedor-usuario">
            <div className="tarjeta-usuario">
                <img src={user} alt="Usuario" className="imagen-usuario" />
                <div className="info-usuario">
                    <div className="etiqueta-usuario">Nombre</div>
                    <div className="valor-usuario">{usuario?.nombre || ""}</div>
                    <div className="etiqueta-usuario">Username</div>
                    <div className="valor-usuario">{usuario?.username || ""}</div>
                    <div className="etiqueta-usuario">Email</div>
                    <div className="valor-usuario">{usuario?.email || ""}</div>
                    {usuario?.telefono && <>
                        <div className="etiqueta-usuario">Teléfono</div>
                        <div className="valor-usuario">{usuario.telefono}</div>
                    </>}
                    {usuario?.direccion && <>
                        <div className="etiqueta-usuario">Dirección</div>
                        <div className="valor-usuario">{usuario.direccion}</div>
                    </>}
                </div>
            </div>
            <div className="contenido-principal">
                {isOwner && <button className="boton-crear" onClick={() => navigate("/crearPublicacion")}>+</button>}

                {publicaciones && publicaciones.length > 0 ? publicaciones.map(pub => (
                    <div key={pub.idPublicacion} className="tarjeta-publicacion">
                        <img
                            src={pub.imagenBase64 ? `data:image/png;base64,${pub.imagenBase64}` : "/placeholder-user.png"}
                            alt="Publicación"
                            className="imagen-publicacion-lista"
                        />
                        <div className="contenido-publicacion">
                            <div className="titulo-publicacion">{pub.titulo || "Sin título"}</div>
                            <div className="texto-publicacion">
                                {(pub.contenido || "").slice(0, 300)}
                                {(pub.contenido || "").length > 300 && <div className="degradado-final"></div>}
                            </div>
                            <div className="fecha-publicacion">
                                {pub.fechaCreacion ? new Date(pub.fechaCreacion).toLocaleDateString() : ""}
                            </div>
                            <div className="botones-publicacion">
                                {isOwner && <button className="boton-publicacion boton-editar" onClick={() => navigate(`/editarPublicacion/${pub.idPublicacion}`)}>Editar</button>}
                                <button className="boton-publicacion boton-ver" onClick={() => navigate(`/publicacion/${pub.idPublicacion}`)}>Ver Publicación</button>
                                {isOwner && <button className="boton-publicacion boton-eliminar" onClick={() => handleDelete(pub.idPublicacion)}>Eliminar</button>}
                            </div>
                        </div>
                    </div>
                )) : <div style={{ color: "#aaa" }}>No hay publicaciones</div>}
            </div>
        </div>

    )
}
