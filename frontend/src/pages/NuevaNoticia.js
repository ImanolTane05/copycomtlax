import React from "react";
import RichTextEditor from "../components/RichTextEditor";
import "../App.css";

const NuevaNoticia=()=> {
    return (
        <div className="grid-cols-subgrid m-5">
            <h1 className="text-center text-2xl font-semibold">
                Creando noticia...
            </h1>
            <form className="space-y-5">
                <label>Título</label>
                <div className="pb-2"><input type="text" className="w-[100%] border-[1px] p-1 border-black rounded-lg"></input></div>
                <label>Introducción</label>
                <div className="pb-2"><textarea className="w-[100%] border-[1px] border-black p-1 rounded-lg"></textarea></div>
                <label>Encabezado</label>
                <div className="pb-2"><input type="file" accept="image/png, image/jpeg"></input></div>
                <label>Contenido</label>
                <div className="editorWrapper">
                    <RichTextEditor/>
                </div>
                <input type="text" hidden={true}></input>
                <button className="bg-blue-900 hover:bg-blue-800 transition-transform text-white p-2 rounded-lg">Subir</button>
            </form>
        </div>
    )
}

export default NuevaNoticia;