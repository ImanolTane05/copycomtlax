import { createRef,useEffect, useState } from "react";
import RichTextEditor from "../components/RichTextEditor/RichTextEditor";
import "../App.css";

const EditarNoticia=({
    id,
    old_title,
    old_intro,
    old_heading,
    old_body
})=> {
    const [title,setTitle]=useState('');
    const [intro,setIntro]=useState('');
    const [heading,setHeading]=useState();
    const [editorContent,setEditorContent]=useState(null);

    const handleEditorStateChange=(editorState) => {
        const serializedState=editorState.toJSON();
        setEditorContent(serializedState);
        console.log("Editor state in parent:",serializedState);
    };

    // TODO Función para subir datos, necesita:
    // - CREAR MODELO DE DATOS Y RUTAS A API EN EL BACKEND
    // - DESPUÉS COPIAR ESTA PÁGINA PARA EDITAR NOTICIA 

    return (
        <div className="grid-cols-subgrid m-5">
            <h1 className="text-center text-2xl font-semibold">
                Creando noticia...
            </h1>
            <form className="space-y-5">
                <label>Título</label>
                <div className="pb-2">
                    <input 
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        type="text" 
                        className="w-[100%] border-[1px] p-1 border-black rounded-lg"
                    />
                </div>
                <label>Introducción</label>
                <div className="pb-2">
                    <textarea 
                        value={intro}
                        onChange={(e)=>setIntro(e.target.value)}
                        className="w-[100%] border-[1px] border-black p-1 rounded-lg"
                    />
                </div>
                <label>Encabezado</label>
                <div className="pb-2">
                    <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        onChange={(e)=>setHeading(e.target.files[0])}
                    />
                </div>
                {heading && <img src={URL.createObjectURL(heading)} className="inline-block h-[200px]" />}
                <label>Contenido</label>
                <div className="editorWrapper">
                    <RichTextEditor
                        onEditorStateChange={handleEditorStateChange}
                    />
                </div>
                <button 
                    className="bg-blue-900 hover:bg-blue-800 transition-transform text-white p-2 rounded-lg"
                    onClick={(e)=>{
                        e.preventDefault();
                        console.log({
                            'titulo':title,
                            'introduccion':intro,
                            'encabezado':heading,
                            'contenido':JSON.stringify(editorContent)
                        })
                    }}
                >
                        Subir
                </button>
            </form>
        </div>
    )
}

export default EditarNoticia;