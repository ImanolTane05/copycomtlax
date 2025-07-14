import './richTextEditor.css';

import {$createTextNode, $getRoot,$getSelection} from 'lexical';
import { useEffect,useState } from 'react';

import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$createHeadingNode, HeadingNode} from '@lexical/rich-text';

// Estilo de editor
// El contenido se ajusta en un .CSS
// para dar variedad al contenido del editor
// mediante asignación de clase
// (Ver cómo funciona en https://lexical.dev/docs/getting-started/theming)
// Se utiliza dentro de initialConfig
const theme={
    heading:{
        h1:'rich-text-h1'
    },
    ltr:'ltr',
    rtl:'rtl',
    paragraph:'editor-paragraph',
    quote:'editor-quote',
    text:{
        bold:"rich-text-bold"
    }
}

// Recibe y hace log de errores durante una actualización de Lexical
// o tira throw como haga falta. Si no se hace throw, Lexical
// intentará recuperar sin perder datos de usuario.
function onError(error) {
    console.error(error);
}

// Puedes notificar cambios al editor con el
// OnChangePlugin
function EditorOnChange({ onChange }) {
    // Acceder al editor con LexicalComposerContext
    const [editor]=useLexicalComposerContext();
    // meter listener a useEffect para gestionar desmontaje y evitar referencias obsoletas
    useEffect(()=>{
        // Mayoría de listeners regresan función de desmontaje a llamar para limpiarlas.
        return editor.registerUpdateListener(({editorState})=>{
            // Llamar onChange y pasar el último estado al padre
            onChange(editorState);
        });
    },[editor,onChange]);
    return null;
}

function RichHeadingPlugin() {
    const [editor]=useLexicalComposerContext();
    const buttonOnClick=(e)=>{
        e.preventDefault();
        editor.update(()=> {
            const root=$getRoot();
            root.append($createHeadingNode('h1').append($createTextNode('Título')));
        });
    };
    return <button 
        onClick={buttonOnClick}
        className='border-x-[1px] border-t-[1px] rounded-t-md border-black transition-all hover:bg-slate-300 p-1'
        >
            Añadir título
    </button>;
}

export default function RichTextEditor() {
    const initialConfig={
        namespace:"ContentEditor",
        theme:theme,
        onError,
        nodes:[
            HeadingNode
        ]
    };

    const [editorState,setEditorState]=useState();

    /**
     * Ejemplo de cómo añadir un Plugin al editor de texto para almacenar el contenido en una variable de useState de React.
     * Se anexa como un componente dentro del objeto LexicalComposer.
     * @param editorState - variable que, mediante useEffect(), utiliza un listener para guardar el estado del editor
     */
    function onChange(editorState) {
        // Llamar toJSON en objeto EditorState, retorna String segura para serializacióñ
        const editorStateJSON=editorState.toJSON();
        // Ahora, como objeto de JavaScript, convertimos a String con JSON.stringify
        setEditorState(JSON.stringify(editorStateJSON));
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <RichHeadingPlugin/>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        className="contentEditable"
                        aria-placeholder={'Introduce el contenido...'}
                        placeholder={<div className="placeholder">Introduce el contenido...</div>}
                    />
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin/>
            <AutoFocusPlugin/>
            {/*
             Demostración de cómo añadir un plugin a Lexical:
             <EditorOnChange onChange={onChange}/> 
            */}
        </LexicalComposer>  
    );
}