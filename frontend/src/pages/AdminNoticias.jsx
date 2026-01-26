import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useModal from "../components/RichTextEditor/hooks/useModal";
import { Link } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { FaSpinner } from "react-icons/fa";

import ArticleCard from "../components/ArticleCard";

const AdminNoticias=()=>{
    const navigate=useNavigate();

    const [noticias,setNoticias]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    const [modal,showModal]=useModal();

    const fetchNoticias=()=>{
        axios.get(`${import.meta.env.VITE_BASE_URL}/noticias/`)
          .then(res=>setNoticias(res.data))
          .catch(err=>setError(err))
          .finally(setLoading(false));
    }

    useEffect(()=>{
        fetchNoticias();
    },[]);
    
    if (loading) {
        return <FaSpinner className="loading-icon"/>
    }

    if (error) {
        return <ErrorMessage error={error} message={"Error al recuperar noticias."}/>
    }
    
    return (
        <div className="flex flex-col m-5">
            <h1 className="text-3xl text-center">Administrar noticias</h1>
            <Link to="/admin/crear-noticia"
                className='mt-5 bg-amber-800 text-white py-3 px-6 w-fit hover:bg-amber-700 active:bg-amber-900 rounded-lg m-auto text-center text-2xl'
            >
              Nueva noticia
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 my-10 gap-10">
                {
                    noticias ?
                        noticias.map((noticia)=> (
                            <ArticleCard 
                                key={noticia._id}
                                id={noticia._id}
                                title={noticia.title}
                                lead={noticia.lead}
                                image={noticia.headerPic}
                                clickable={false}
                            >
                                <button
                                    className="bg-blue-900 hover:bg-blue-800 active:bg-blue-950 m-2 py-1 px-3 rounded-md transition-transform text-white cursor-pointer"
                                    onClick={()=>navigate(`editar/${noticia._id}`)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="bg-red-600 hover:bg-red-700 active:bg-red-900 m-2 py-1 px-3 rounded-md transition-transform text-white cursor-pointer"
                                    onClick={()=>{
                                        showModal("Eliminando noticia",(onClose)=>(
                                            <>
                                                ¿Eliminar Noticia? (Título: {noticia.title})
                                                <div className="flex flex-row">
                                                    <button
                                                        className="bg-red-600 hover:bg-red-700 active:bg-red-900 m-2 py-1 px-3 rounded-md transition-transform text-white cursor-pointer"
                                                        onClick={()=>{
                                                            const token=localStorage.getItem('token');
                                                            const config = token
                                                                ? { headers: { Authorization: `Bearer ${token}` } }
                                                                : {};
                                                            axios.delete(`${import.meta.env.VITE_BASE_URL}/noticias/${noticia._id}`,config)
                                                                .then(res=>{
                                                                    console.log(res);
                                                                    fetchNoticias();
                                                                })
                                                                .catch(err=>console.error("Error al eliminar:",err));
                                                            onClose();
                                                        }}
                                                    >
                                                        Eliminar
                                                    </button>
                                                    <button
                                                        className="bg-blue-900 hover:bg-blue-800 active:bg-blue-950 m-2 py-1 px-3 rounded-md transition-transform text-white cursor-pointer"
                                                        onClick={onClose}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </>
                                        ));
                                    }}
                                >
                                    Eliminar
                                </button>
                            </ArticleCard>
                        ))
                    :
                        <>No hay noticias</>
                }
            </div>
            {modal}
        </div>
    )
}

export default AdminNoticias;