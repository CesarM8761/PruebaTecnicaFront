import React, { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { API_BASE_URL } from "../config"
import "../Styles/CrearPublicacion.css"

export default function PublicacionForm()
{
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()
    const tokenJWT = localStorage.getItem("TokenJWT")

    const isCrear = location.pathname === "/crearPublicacion"
    const [titulo, setTitulo] = useState("")
    const [contenido, setContenido] = useState("")
    const [categorias, setCategorias] = useState([])
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("")
    const [imagenBase64, setImagenBase64] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() =>
    {
        fetch(`${API_BASE_URL}/Categorias`)
            .then(res => res.json())
            .then(data => setCategorias(data))
            .catch(err => console.error("Error cargando categorías:", err))
    }, [])

    useEffect(() =>
    {
        if (!isCrear && id)
        {
            fetch(`${API_BASE_URL}/Publicaciones/${id}`)
                .then(res => res.json())
                .then(data =>
                {
                    setTitulo(data.titulo)
                    setContenido(data.contenido)
                    setCategoriaSeleccionada(data.idCategoria.toString())
                    if (data.imagenBase64) setImagenBase64(data.imagenBase64 || null)
                })
                .catch(err => console.error("Error cargando publicación:", err))
        }
    }, [isCrear, id])

    const handleFileChange = (e) =>
    {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onloadend = () => setImagenBase64(reader.result.split(",")[1])
        reader.readAsDataURL(file)
    }

    const handleSubmit = async () =>
    {
        if (!titulo || !contenido || !categoriaSeleccionada || !imagenBase64)
        {
            alert("Todos los campos son obligatorios")
            return
        }

        setLoading(true)
        try
        {
            let idImagen = 0
            if (imagenBase64)
            {
                const imgRes = await fetch(`${API_BASE_URL}/Imagenes`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenJWT}`
                    },
                    body: JSON.stringify({ idImagen: 0, base64: imagenBase64 })
                })
                const imgData = await imgRes.json()
                idImagen = imgData.idImagen
            }

            if (isCrear)
            {
                const pubRes = await fetch(`${API_BASE_URL}/Publicaciones`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenJWT}`
                    },
                    body: JSON.stringify({
                        titulo,
                        contenido,
                        idCategoria: parseInt(categoriaSeleccionada),
                        idImagenPublicacion: idImagen
                    })
                })
                const pubData = await pubRes.json()
                if (!pubRes.ok) throw new Error("Error creando publicación")
                navigate(`/publicacion/${pubData.idPublicacion}`)
            } else
            {
                const pubRes = await fetch(`${API_BASE_URL}/Publicaciones/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${tokenJWT}`
                    },
                    body: JSON.stringify({
                        titulo,
                        contenido,
                        idCategoria: parseInt(categoriaSeleccionada),
                        idImagenPublicacion: idImagen
                    })
                })
                if (!pubRes.ok) throw new Error("Error editando publicación")
                const updatedData = await pubRes.json()
                navigate(`/publicacion/${updatedData.idPublicacion || id}`)
            }
        } catch (err)
        {
            console.error(err)
            alert("Ocurrió un error al procesar la publicación")
        } finally
        {
            setLoading(false)
        }
    }

    return (
        <div className="page-crear-publicacion">
            <div className="contenedor-crear-publicacion">
                <h1 className="titulo-crear-publicacion">{isCrear ? "Crear Publicación" : "Editar Publicación"}</h1>

                <div className="campo-crear-publicacion">
                    <label className="etiqueta-crear-publicacion">Título</label>
                    <input
                        className="input-crear-publicacion"
                        type="text"
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}
                    />
                </div>

                <div className="campo-crear-publicacion">
                    <label className="etiqueta-crear-publicacion">Contenido</label>
                    <textarea
                        className="textarea-crear-publicacion"
                        value={contenido}
                        onChange={e => setContenido(e.target.value)}
                    />
                </div>

                <div className="campo-crear-publicacion">
                    <label className="etiqueta-crear-publicacion">Categoría</label>
                    <select
                        className="select-crear-publicacion"
                        value={categoriaSeleccionada}
                        onChange={e => setCategoriaSeleccionada(e.target.value)}
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map(cat => (
                            <option key={cat.idCategoria} value={cat.idCategoria}>
                                {cat.nombreCategoria}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="campo-crear-publicacion">
                    <label className="etiqueta-crear-publicacion">Imagen</label>
                    {isCrear && (
                        <label className="wrapper-archivo-crear-publicacion">
                            {imagenBase64 ? "Imagen seleccionada" : "Selecciona una imagen"}
                            <input
                                type="file"
                                accept="image/*"
                                className="input-archivo-crear-publicacion"
                                onChange={handleFileChange}
                            />
                        </label>
                    )}
                    {imagenBase64 && (
                        <img
                            src={`data:image/png;base64,${imagenBase64}`}
                            alt="Preview"
                            className="imagen-preview-crear-publicacion"
                        />
                    )}
                </div>

                <button
                    className="boton-crear-publicacion"
                    disabled={loading}
                    onClick={handleSubmit}
                >
                    {loading ? (isCrear ? "Creando..." : "Actualizando...") : (isCrear ? "Crear Publicación" : "Actualizar Publicación")}
                </button>
            </div>
        </div>
    )
}
