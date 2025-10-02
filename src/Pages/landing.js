import React, { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { API_BASE_URL } from "../config"
import "../Styles/Landing.css"

export default function Landing() {
    const navigate = useNavigate()
    const { id: categoriaId } = useParams()
    const location = useLocation()

    const [publicaciones, setPublicaciones] = useState([])
    const [categorias, setCategorias] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${API_BASE_URL}/Categorias`)
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error("Error cargando categorías:", err))
    }, [])

    useEffect(() => {
        setLoading(true)
        fetch(`${API_BASE_URL}/Publicaciones`)
            .then(res => res.json())
            .then(data => {
                if (categoriaId) {
                    const filtradas = data.filter(pub => pub.idCategoria.toString() === categoriaId)
                    setPublicaciones(filtradas)
                } else {
                    setPublicaciones(data)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error("Error cargando publicaciones:", err)
                setLoading(false)
            })
    }, [categoriaId, location])

    if (loading) return <div className="landing-pagina">Cargando publicaciones...</div>
    if (publicaciones.length === 0) return <div className="landing-pagina">No hay publicaciones disponibles</div>

    return (
        <div className="landing-pagina">
            <div className="landing-contenedor">
                {publicaciones.map(pub => {
                    const categoria = categorias.find(cat => cat.idCategoria === pub.idCategoria)
                    return (
                        <div key={pub.idPublicacion} className="landing-card">
                            {pub.imagenBase64 && (
                                <img
                                    src={`data:image/png;base64,${pub.imagenBase64}`}
                                    alt={pub.titulo}
                                    className="landing-card-imagen"
                                />
                            )}
                            <div className="landing-card-cuerpo">
                                <div className="landing-card-titulo">{pub.titulo}</div>
                                {categoria && <div className="landing-card-etiqueta">{categoria.nombreCategoria}</div>}
                                <div className="landing-card-previa">
                                    {pub.contenido.length > 100
                                        ? pub.contenido.substring(0, 100) + "..."
                                        : pub.contenido
                                    }
                                </div>
                                <button
                                    className="landing-card-boton"
                                    onClick={() => navigate(`/publicacion/${pub.idPublicacion}`)}
                                >
                                    Ver publicación
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
