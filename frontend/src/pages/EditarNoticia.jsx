import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor/RichTextEditor";
import useModal from "../components/RichTextEditor/hooks/useModal";

import axios from "axios";

import "../App.css";
import { FaSpinner } from "react-icons/fa";

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
    const [oldBody,setOldBody]=useState(null);
    const [error,setError]=useState(null);
    const [isLoading,setIsLoading]=useState(true);
    useEffect(()=>{
        const fetchOldContent=async()=>{
            try {
                const res=await axios.get(`${import.meta.env.VITE_BASE_URL}/noticias/${id}`);
                setOldContent(res.data);
                setTitle(res.data.title);
                if (res.data.lead) {setLead(res.data.lead)};
                if (res.data.headerPic) {setHeaderPic(res.data.headerPic)};
                setEditorContent(res.data.body);
                setOldBody(res.data.body);
            } catch (err) {
                setError(error);
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
                ? { headers: { 
                    Authorization: `Bearer ${token}` } 
                 }
                : {};
            let body;
            if (editorContent===oldBody) {
                body=oldBody;
            } else {
                body=JSON.stringify(editorContent);
            }
            const response=await axios.put(`${import.meta.env.VITE_BASE_URL}/noticias/${id}`,{
                    title:data.title,
                    lead:data.lead,
                    headerPic:removeHeader||headerPic=='' ? '' : headerPic,
                    body:body??editorContent,
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
        return <FaSpinner className="loading-icon"/>
    }

    if (error) {
        return <ErrorMessage error={error} message={"Ocurrió un error al recuperar los datos de la noticia."}/>
    }

    return (
        <div className="grid-cols-subgrid m-5 bg-gray-100 rounded-xl shadow-2xl relative">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-gray-900 pt-6">
                Actualizar noticia
            </h1>
            <form className="space-y-5 mx-5" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="title" className="text-2xl font-semibold">Título</label>
                <div className="pb-2">
                    <input 
                        id="title"
                        onChange={(e)=>{setTitle(e.target.value)}}
                        type="text" 
                        className="w-full border p-3 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                        defaultValue={title}
                        {...register('title',{
                            required:"El título es obligatorio"
                        })}
                    />
                    {errors.name && <div className={styles.error}>{errors.name.message}</div>}
                </div>
                <label htmlFor="lead" className="text-2xl font-semibold">Introducción</label>
                <div className="pb-2">
                    <textarea 
                        id="lead"
                        onChange={(e)=>setLead(e.target.value)}
                        className="w-full border p-3 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                        defaultValue={lead}
                        {...register('lead')}
                    />
                </div>
                <p className="text-2xl font-semibold">Encabezado</p>
                <label 
                    htmlFor="headingImg" 
                    className="bg-amber-800 hover:bg-amber-700 active:bg-amber-900 w-fit px-2 justify-center text-white p-[5px] mx-auto rounded-md transition"
                >
                    Insertar imagen...
                </label>
                <div className="pb-2">
                    <input 
                        id="headingImg"
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        {...register('headerPic',{
                            onChange:(e)=>{if (e.target.files[0]) {handleSetHeading(e.target.files)}}
                        })}
                    />
                </div>
                {headerPic && <img src={headerPic} className="max-h-[200px] mx-auto" />}
                {
                    headerPic && 
                    <p>{headerPic==oldContent.headerPic && "Sin cambios"}
                        <button 
                            className="bg-red-900 hover:bg-red-700bg-red-900 hover:bg-red-600 active:bg-red-700 m-2 py-1 px-3 rounded-md text-white"
                            onClick={(e)=>{
                                e.preventDefault();
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
                <label htmlFor="body" className="text-2xl font-semibold">Contenido</label>
                <div className="editorWrapper">
                    <RichTextEditor
                        onEditorStateChange={handleEditorStateChange}
                        editorStateString={oldContent.body}
                    />
                </div>
                <input 
                    id="body"
                    type="text"
                    defaultValue={editorContent} 
                    hidden={true}
                    {...register('body')}
                />
                <button
                    type="submit"
                    className="bg-blue-900 hover:bg-blue-800 active:bg-blue-950 transition-transform text-white p-2 inline-block lg:w-[60%] md:w-[80%] sm:w-full rounded-lg mb-5 text-2xl font-semibold"
                >
                        Actualizar
                </button>
            </form>
        </div>
    )
}

export default EditarNoticia;