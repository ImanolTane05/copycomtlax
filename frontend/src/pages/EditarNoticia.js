import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor/RichTextEditor";
import useModal from "../components/RichTextEditor/hooks/useModal";

import axios from "axios";

import "../App.css";

const EditarNoticia=()=> {
    const {id}=useParams();

    const {
        register,
        handleSubmit,
        formState:{errors},
    }=useForm({
        mode:'onChange',
        reValidateMode:'onChange'
    });

    const navigate=useNavigate();

    const [modal,showModal]=useModal();

    const [title,setTitle]=useState('');
    const [lead,setLead]=useState('');
    const [headerPic,setHeaderPic]=useState('');
    const [removeHeader,setRemoveHeader]=useState(false);
    const [editorContent,setEditorContent]=useState(null);

    const [oldContent,setOldContent]=useState(null);
    const [error,setError]=useState(null);
    const [isLoading,setIsLoading]=useState(true);
    useEffect(()=>{
        const fetchOldContent=async()=>{
            try {
                const res=await axios.get(`http://localhost:5000/api/noticias/${id}`)
                setOldContent(res.data);
                setTitle(res.data.title);
                if (res.data.lead) {setLead(res.data.lead)};
                if (res.data.headerPic) {setHeaderPic(res.data.headerPic)};
                setEditorContent(res.data.body);
            } catch (err) {
                setError("Error al recuperar el artículo.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOldContent();
    },[id]);

    const handleEditorStateChange=(editorState) => {
        const serializedState=editorState.toJSON();
        setEditorContent(serializedState);
    };

    const handleSetHeading=(files)=> {
        var reader=new FileReader();
        reader.onload=function () {
            if (typeof reader.result==='string') {
                setHeaderPic(reader.result);
            }
            return '';
        }
        if (files!=null) {
            reader.readAsDataURL(files[0]);
            setRemoveHeader(false);
        }
    }

    const onSubmit=async (data)=> {
        try {
            const token=localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};
            const body=JSON.stringify(editorContent);
            const response=await axios.put(`http://localhost:5000/api/noticias/${id}`,{
                    title:data.title,
                    lead:data.lead,
                    headerPic:removeHeader||headerPic=='' ? '' : headerPic,
                    body:body,
                    publishedDate:undefined,
                    editedDate:undefined
            },config);

            if (response.status===200) {
                alert("Noticia actualizada.");
                navigate('/admin/dashboard');
            }
        }
        catch (error) {
            console.error("Error al editar noticia:",error);
            if (error.response) {
                alert(error);
            } else {
                alert("Error inesperado. Intenta de nuevo.")
            }
        }
    }
    
    if (isLoading) {
        return <>
            Cargando...
        </>
    }

    if (error) {
        return <>Error al abrir el editor.</>
    }

    return (
        <div className="grid-cols-subgrid m-5">
            <h1 className="text-center text-2xl font-semibold">
                Editando noticia...
            </h1>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="title">Título</label>
                <div className="pb-2">
                    <input 
                        id="title"
                        onChange={(e)=>{setTitle(e.target.value)}}
                        type="text" 
                        className="w-[100%] border-[1px] p-1 border-black rounded-lg"
                        defaultValue={title}
                        {...register('title',{
                            required:"El título es obligatorio"
                        })}
                    />
                    {errors.name && <div className={styles.error}>{errors.name.message}</div>}
                </div>
                <label htmlFor="lead">Introducción</label>
                <div className="pb-2">
                    <textarea 
                        id="lead"
                        onChange={(e)=>setLead(e.target.value)}
                        className="w-[100%] border-[1px] border-black p-1 rounded-lg"
                        defaultValue={lead}
                        {...register('lead')}
                    />
                </div>
                <label htmlFor="headingImg">Encabezado</label>
                <div className="pb-2">
                    <input 
                        id="headingImg"
                        type="file" 
                        accept="image/*"
                        {...register('headerPic',{
                            onChange:(e)=>handleSetHeading(e.target.files)
                        })}
                    />
                    {
                        headerPic && 
                        <p>{headerPic==oldContent.headerPic && "Sin cambios"}
                            <button 
                                className="bg-red-900 hover:bg-red-700bg-red-900 hover:bg-red-600 active:bg-red-700 m-2 py-1 px-3 rounded-md text-white"
                                onClick={()=>{
                                    showModal("Eliminando encabezado",(onClose)=>(
                                        <>
                                            ¿Eliminar imagen de encabezado?
                                            <div className="flex flex-row">
                                                <button
                                                    className="bg-red-900 hover:bg-red-600 m-2 py-1 px-3 rounded-md transition-transform text-white"
                                                    onClick={()=>{
                                                        setRemoveHeader(true);
                                                        setHeaderPic('');
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
                            {modal}
                        </p>
                    }
                </div>
                {headerPic && <img src={headerPic} className="inline-block max-h-[200px]" />}
                <label htmlFor="body">Contenido</label>
                <div className="editorWrapper">
                    <RichTextEditor
                        onEditorStateChange={handleEditorStateChange}
                        editorStateString={oldContent.body}
                    />
                </div>
                <input 
                    id="body"
                    type="text"
                    defaultValue={JSON.stringify(editorContent)} 
                    hidden={true}
                    {...register('body')}
                />
                <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 transition-transform text-white p-2 rounded-lg"
                >
                        Actualizar
                </button>
            </form>
        </div>
    )
}

export default EditarNoticia;