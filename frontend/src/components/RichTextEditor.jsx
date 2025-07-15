import './richTextEditor.css';

import {$getSelection, $isRangeSelection} from 'lexical';
import { useEffect,useState } from 'react';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$setBlocksType} from '@lexical/selection';

import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HeadingNode,$createHeadingNode} from '@lexical/rich-text';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {ListNode,ListItemNode,INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND} from '@lexical/list';

// Estilo de editor
// El contenido se ajusta en un .CSS
// para dar variedad al contenido del editor
// mediante asignación de clase
// (Ver cómo funciona en https://lexical.dev/docs/getting-started/theming)
// Se utiliza dentro de initialConfig
const theme={
    heading:{
        h1:'rich-text-h1',
        h2:'rich-text-h2',
        h3:'rich-text-h3'
    },
    ltr:'ltr',
    rtl:'rtl',
    paragraph:'editor-paragraph',
    quote:'editor-quote',
    text:{
        bold:"rich-text-bold"
    }
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

function HeadingToolbarPlugin() {
    const [editor]=useLexicalComposerContext();
    const headingTags=['h1','h2','h3'];
    const buttonOnClick=(tag)=>{
        editor.update(()=> {
            const selection=$getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection,()=>$createHeadingNode(tag));
            }
        });
    };
    return (
        <>{headingTags.map((tag)=>(
            <button 
                onClick={(e)=>{
                    e.preventDefault();
                    buttonOnClick(tag);
                }}
                key={tag}
                className='border-[1px] border-black transition-all hover:bg-slate-300 py-1 px-3'
            >
                {tag.toUpperCase()}
            </button>
    ))}</>
    );
}

function ListToolbarPlugin() {
    const [editor]=useLexicalComposerContext();
    const listTags=['ol','ul'];
    const buttonOnClick=(tag)=>{
        if (tag=='ol') {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND,undefined);
            return;
        }
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND,undefined);
    };
    return <>{listTags.map((tag)=>(
        <button 
            onClick={(e)=>{
                e.preventDefault();
                buttonOnClick(tag);
            }}
            key={tag}
            className='border-[1px] border-black transition-all hover:bg-slate-300 py-1 px-3'
        >{tag.toUpperCase()}</button>
    ))}</>
}



function ToolbarPlugin() {
    return <div className='toolbar-wrapper'>
        <HeadingToolbarPlugin/>
        <ListToolbarPlugin/>
    </div>
}

// Recibe y hace log de errores durante una actualización de Lexical
// o tira throw como haga falta. Si no se hace throw, Lexical
// intentará recuperar sin perder datos de usuario.
function onError(error) {
    console.error(error);
}

export default function RichTextEditor() {
    const initialConfig={
        namespace:"ContentEditor",
        theme:theme,
        onError,
        nodes:[
            HeadingNode,
            ListNode,
            ListItemNode
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
            <ToolbarPlugin/>
            <ListPlugin/>
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
            {/*
             Demostración de cómo añadir un plugin a Lexical:
             <EditorOnChange onChange={onChange}/> 
            */}
        </LexicalComposer>  
    );
}