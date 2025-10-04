import axios from "axios";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useModal from "../components/RichTextEditor/hooks/useModal";
import { Link } from "react-router-dom";

const AdminNoticias=()=>{
    const navigate=useNavigate();

    const [noticias,setNoticias]=useState([]);
    const [error,setError]=useState(null);

    const [modal,showModal]=useModal();

    const fetchNoticias=()=>{
        axios.get('http://localhost:5000/api/noticias/')
          .then(res=>setNoticias(res.data))
          .catch(err=>setError(err));
    }

    useEffect(()=>{
        fetchNoticias();
    },[]);
    
    if (error) {
        return (
            <>
                Error al recuperar noticias.
            </>
        )
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
                            <div 
                                key={noticia._id} id={noticia._id} 
                                className="hover:scale-105 transition-transform border shadow-lg rounded-lg bg-slate-100 cursor-pointer min-w-52"
                            >
                                { noticia.headerPic ?
                                <div className="overflow-hidden max-w-[95%] m-auto pt-2">
                                    <img 
                                    src={noticia.headerPic}
                                    alt={`image-${noticia._id}`}
                                    className="m-auto"/>
                                </div>
                                : ""
                                }
                                <div className="p-5">
                                    <h2 className="text-2xl truncate font-black">
                                        {noticia.title ?? "Título de artículo"}
                                    </h2>
                                    <p className="text-justify resize-none h-auto min-w-[100px] w-11/12 whitespace-pre-wrap">
                                        {noticia.lead}
                                    </p>
                                </div>
                                <div className="flex flex-row">
                                    <button
                                        className="bg-blue-900 hover:bg-blue-800 m-2 py-1 px-3 rounded-md transition-transform text-white"
                                        onClick={()=>navigate(`editar/${noticia._id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-blue-900 hover:bg-blue-800 m-2 py-1 px-3 rounded-md transition-transform text-white"
                                        onClick={()=>{
                                            showModal("Eliminando noticia",(onClose)=>(
                                                <>
                                                    ¿Eliminar Noticia? (Título: {noticia.title})
                                                    <div className="flex flex-row">
                                                        <button
                                                            className="bg-red-900 hover:bg-red-600 m-2 py-1 px-3 rounded-md transition-transform text-white"
                                                            onClick={()=>{
                                                                const token=localStorage.getItem('token');
                                                                const config = token
                                                                    ? { headers: { Authorization: `Bearer ${token}` } }
                                                                    : {};
                                                                axios.delete(`http://localhost:5000/api/noticias/${noticia._id}`,config)
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
                                                            className="bg-blue-900 hover:bg-blue-800 m-2 py-1 px-3 rounded-md transition-transform text-white"
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
                                </div>
                            </div>
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