import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor/RichTextEditor";
import useModal from "../components/RichTextEditor/hooks/useModal";

import axios from "axios";

import "../App.css";

const NuevaNoticia=()=> {
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
    const [editorContent,setEditorContent]=useState(null);

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
        }
    }

    const onSubmit=async (data)=> {
        try {
            const token=localStorage.getItem('token');
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : {};
            const body=JSON.stringify(editorContent);
            const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/noticias/crear`,{
                    title:data.title,
                    lead:data.lead,
                    headerPic:headerPic,
                    body:body,
                    publishedDate:undefined,
                    editedDate:undefined
            },config);

            if (response.status===201) {
                alert("Noticia agregada.");
                navigate('/admin/dashboard');
            }
        }
        catch (error) {
            console.error("Error al crear noticia:",error);
            if (error.response) {
                alert(error);
            } else {
                alert("Error inesperado. Intenta de nuevo.")
            }
        }
    }
    
    return (
        <div className="grid-cols-subgrid m-5">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-gray-900">
                Creando noticia...
            </h1>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="title">Título</label>
                <div className="pb-2 mx-">
                    <input 
                        id="title"
                        onChange={(event)=>{
                            setTitle(event.target.value)
                            console.log("Title: ",title);
                        }}
                        type="text" 
                        className="w-[100%] border-[1px] p-1 border-black rounded-lg"
                        {...register('title',{
                            required:"El título es obligatorio"
                        })}
                    />
                    {errors.title && <div className={styles.error}>{errors.name.message}</div>}
                </div>
                <label htmlFor="lead">Introducción</label>
                <div className="pb-2">
                    <textarea 
                        id="lead"
                        onChange={(e)=>setLead(e.target.value)}
                        className="w-[100%] border-[1px] border-black p-1 rounded-lg px-1"
                        {...register('lead')}
                    />
                </div>
                <p>Encabezado</p>
                <label 
                    htmlFor="headingImg" 
                    className="bg-amber-800 hover:bg-amber-700 active:bg-amber-900 w-fit px-2 justify-center text-white p-[5px] mx-auto rounded-md"
                >
                    Insertar imagen...
                </label>
                    <input 
                        id="headingImg"
                        type="file" 
                        accept="image/*"
                        className="[display:none]"
                        {...register('headerPic',{
                            onChange:(e)=>{if (e.target.files[0]) {handleSetHeading(e.target.files)}}
                        })}
                    />
                {headerPic && <img src={headerPic} className="max-h-[200px] mx-auto" />}
                {
                    headerPic && 
                    <p>
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
                <label htmlFor="body">Contenido</label>
                <div className="editorWrapper">
                    <RichTextEditor
                        onEditorStateChange={handleEditorStateChange}
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
                    className="bg-blue-900 hover:bg-blue-800 active:bg-blue-950 transition-transform text-white p-2 rounded-lg"
                >
                        Subir
                </button>
            </form>
        </div>
    )
}

export default NuevaNoticia;