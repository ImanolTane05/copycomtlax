import { useRef,useEffect,useState } from 'react'; 
import useMediaQuery from './hooks/useMediaQuery';

import {CheckListPlugin} from '@lexical/react/LexicalCheckListPlugin';
import {ClearEditorPlugin} from '@lexical/react/LexicalClearEditorPlugin';
import {HeadingNode,$createHeadingNode} from '@lexical/rich-text';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import {ListNode,ListItemNode,INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND} from '@lexical/list';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import {TRANSFORMERS} from '@lexical/markdown';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getSelection, $isRangeSelection} from 'lexical';
import {$setBlocksType} from '@lexical/selection';

import Nodes from './nodes';
import EditorTheme from '../themes/EditorTheme/EditorTheme';

import {Actions} from './Actions';
/*DESCOMENTAR AL AÑADIR PLUGINS*/
// import DragDropPaste from './plugins/DragDropPastePlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
// import TreeViewPlugin from './plugins/TreeViewPlugin';
import ContentEditable from './ui/ContentEditable';
import Placeholder from './ui/Placeholder';
// import LexicalAutoLinkPlugin from './plugins/AutoLinkPlugin/index';
// import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import InlineImagePlugin from './plugins/InlineImagePlugin';

const loadContent=()=> {
    // Editor 'vacío' (ver si puedo indexar de BD luego)
    const value='{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

    return value;
}


/** Plugin personalizado de AutoFocus de Lexical.\
 * Los plugins de Lexical React son componentes de React,
 * siendo altamente componibles. Pueden usarse como lazy loads
 * si así se desea, para reducir procesamiento hasta que
 * se usen.
*/
function CustomAutoFocusPlugin() {
    const [editor]=useLexicalComposerContext();

    useEffect(()=>{
        // Centrarse al editor al activar el efecto
        editor.focus();
    },[editor]);
    return null;
}

/**  Recibe y hace log de errores durante una actualización de Lexical
 o les hace throw como haga falta. Si no se hace throw, Lexical
 intentará recuperar sin perder datos de usuario.
*/
function onError(error) {
    console.error(error);
}

export default function RichTextEditor() {
    const isSmallWidthViewPort=useMediaQuery('(max-width:1025px)');
    const [floatingAnchorElem,setFloatingAnchorElem]=useState(null);
    const placeholder=<Placeholder>Introduce el contenido...</Placeholder>
    const initialEditorState=loadContent();
    const editorStateRef=useRef();
    const initialConfig={
        namespace:"ContentEditor",
        editorState:initialEditorState,
        theme:EditorTheme,
        onError,
        nodes:[...Nodes] // Falta crear algunos nodos
    };

    function handleOnChange(editorState) {
        editorState.current=editorState;
    }

    const onRef=(_floatingAnchorElem) => {
        if (_floatingAnchorElem!==null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-shell border-black border-[1px] rounded-md">
                <ToolbarPlugin/>
                <div className="editor-container tree-view">
                    <ClearEditorPlugin/>
                    <InlineImagePlugin/>
                    <CheckListPlugin/>
                    <RichTextPlugin
                        contentEditable={
                            <div className="editor-scroller">
                                <div className="editor" ref={onRef}>
                                    <ContentEditable/>
                                </div>
                            </div>
                        }
                        placeholder={placeholder}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={handleOnChange}/>
                    <HistoryPlugin/>
                    <CustomAutoFocusPlugin/>
                    <ListPlugin/>
                    <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true}/>
                    <HorizontalRulePlugin/>
                    <LinkPlugin/>
                    {floatingAnchorElem&&!isSmallWidthViewPort&& (
                        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem}/>
                    )}
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS}/>
                    <Actions/>
                </div>
            </div>
        </LexicalComposer>  
    );
}