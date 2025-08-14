import { createRef,useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "../components/RichTextEditor/RichTextEditor";

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
    })

    const navigate=useNavigate();

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
            const response=await axios.post("http://localhost:5000/api/noticias/crear",{
                    title:data.title,
                    lead:data.lead,
                    headerPic:headerPic,
                    body:body,
                    publishedDate:undefined,
                    editedDate:undefined
            },config)

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

    // TODO Función para subir datos, necesita:
    // - CREAR MODELO DE DATOS Y RUTAS A API EN EL BACKEND
    // - DESPUÉS COPIAR ESTA PÁGINA PARA EDITAR NOTICIA 
    return (
        <div className="grid-cols-subgrid m-5">
            <h1 className="text-center text-2xl font-semibold">
                Creando noticia...
            </h1>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="title">Título</label>
                <div className="pb-2">
                    <input 
                        id="title"
                        onChange={(e)=>{setTitle(e.target.value)}}
                        type="text" 
                        className="w-[100%] border-[1px] p-1 border-black rounded-lg"
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
                </div>
                {headerPic && <img src={headerPic} className="inline-block h-[200px]" />}
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
                    className="bg-blue-900 hover:bg-blue-800 transition-transform text-white p-2 rounded-lg"
                >
                        Subir
                </button>
            </form>
        </div>
    )
}

export default NuevaNoticia;