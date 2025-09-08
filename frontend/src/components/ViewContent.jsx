import React,{ useEffect } from "react";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import { createEditor } from 'lexical';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import Nodes from "./RichTextEditor/nodes/index-readonly";

import EditorTheme from "./themes/EditorTheme/EditorTheme";

//Definir configuración de editor con nodos y como solo lectura
const editorConfig={
    namespace:"view-only-editor",
    nodes:[...Nodes],
    editable:false,
    theme:EditorTheme,
    onError:(error)=>console.error(error)
};

// Componente para cargar editorState
function LoadInitialContent({editorStateString}) {
    const [editor]=useLexicalComposerContext();

    useEffect(()=>{
        if (editorStateString) {
            try {
                const editorState=editor.parseEditorState(editorStateString);
                editor.setEditorState(editorState);
            } catch (e) {
                console.error("Error al insertar editorState:",e);
            }
        }
    },[editor,editorStateString]);

    return null;
}

const ViewContent=({editorStateString})=>{
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="editor-container">
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input"/>}
                        placeholder={null}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin/>
                    <LoadInitialContent editorStateString={editorStateString}/>
                </div>
            </div>
        </LexicalComposer>
    );
};

export default ViewContent;