/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/

import {
    $createCodeNode,
    $isCodeNode,
    CODE_LANGUAGE_FRIENDLY_NAME_MAP,
    CODE_LANGUAGE_MAP,
    getLanguageFriendlyName
} from '@lexical/code';
import {$isLinkNode,TOGGLE_LINK_COMMAND} from '@lexical/link';
import {
    $isListNode,
    INSERT_CHECK_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    ListNode,
    REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {$isDecoratedBlockNode, $isDecoratorBlockNode} from '@lexical/react/LexicalDecoratorBlockNode';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    $isQuoteNode,
    HeadingTagType
} from '@lexical/rich-text';
import {
    $isParentElementRTL,
    $setBlocksType,
} from '@lexical/selection';
import {$isTableNode} from '@lexical/table';
import {
    $findMatchingParent,
    $getNearestBlockElementAncestorOrThrow,
    $getNearestNodeOfType,
    mergeRegister
} from '@lexical/utils';
import {
    $createParagraphNode,
    $getNodeByKey,
    $getSelection,
    $isRangeSelection,
    $isRootOrShadowRoot,
    $isTextNode,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    DEPRECATED_$isGridSelection,
    FORMAT_ELEMENT_COMMAND,
    INDENT_CONTENT_COMMAND,
    OUTDENT_CONTENT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND
} from 'lexical';
import { useCallback,useEffect,useState } from 'react';

// import useModal from '../../hooks/useModal';
import DropDown, {DropDownItem} from '../../ui/DropDown';
import {getSelectedNode} from '../../utils/getSelectedNode';
import {sanitizeUrl} from '../../utils/url';
// import {InsertInlineImageDialog} from '../InlineImagePlugin';
// import {InsertTableDialog} from '../TablePlugin';


export default function ToolbarPlugin() {
    const [editor]=useLexicalComposerContext();
    const [activeEditor,setActiveEditor]=useState(editor);
    const [blockType,setBlockType]=useState('paragraph');
    const [rootType,setRootType]=useState('root');
    const [selectedElementKey,setSelectedElementKey]=useState(null,);

    const [isLink,setIsLink]=useState(false);
    const [isBold,setIsBold]=useState(false);
    const [isItalic,setIsItalic]=useState(false);
    const [isUnderline,setIsUnderline]=useState(false);
    const [isStrikeThrough,setIsStrikeThrough]=useState(false);
    const [isSubscript,setIsSubscript]=useState(false);
    const [isSuperScript,setIsSuperScript]=useState(false);
    const [isCode,setIsCode]=useState(false);
    const [canUndo,setCanUndo]=useState(false);
    const [canRedo,setCanRedo]=useState(false);
    //const [modal,showModal]=useModal();
    const [isRTL,setIsRTL]=useState(false);
    const [codeLanguage,setCodeLanguage]=useState('');
    const [isEditable,setIsEditable]=useState(()=>editor.isEditable());

    const $updateToolbar=useCallback(()=> {
        const selection=$getSelection();
        if ($isRangeSelection(selection)) {
            const anchorNode=selection.anchor.getNode();
            let element=
                anchorNode.getKey()==='root'
                    ? anchorNode
                    : $findMatchingParent(anchorNode, (e) => {
                        e.preventDefault();
                        const parent=e.getParent();
                        return parent!==null&&$isRootOrShadowRoot(parent);
                    });
            if (element===null) {
                element=anchorNode.getTopLevelElementOrThrow();
            }

            const elementKey=element.getKey();
            const elementDOM=activeEditor.getElementByKey(elementKey);

            // Actualizar formato de texto
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikeThrough(selection.hasFormat('strikethrough'));
            setIsSubscript(selection.hasFormat('subscript'));
            setIsSuperScript(selection.hasFormat('superscript'));
            setIsCode(selection.hasFormat('code'));
            setIsRTL($isParentElementRTL(selection));

            // Actualizar enlaces
            const node=getSelectedNode(selection);
            const parent=node.getParent();
            if ($isLinkNode(parent)||$isLinkNode(node)) {
                setIsLink(true);
            } else {
                setIsLink(false);
            }

            const tableNode=$findMatchingParent(node,$isTableNode);
            if ($isTableNode(tableNode)) {
                setRootType('table');
            } else {
                setRootType('root');
            }

            if (elementDOM!==null) {
                setSelectedElementKey(elementKey);
                if ($isListNode(element)) {
                    const parentList=$getNearestNodeOfType(
                        anchorNode,
                        ListNode
                    );
                    const type=parentList
                        ? parentList.getListType()
                        : element.getListType();
                    setBlockType(type);
                } else {
                    const type=$isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();
                    if (type in blockTypeToBlockName) {
                        setBlockType(type);
                    }
                    if ($isCodeNode(element)) {
                        const language=element.getLanguage();
                        setCodeLanguage(language ? CODE_LANGUAGE_MAP[language]||language : '');
                        return;
                    }
                }
            }
        }
    },[activeEditor]);

    useEffect(()=> {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            (_payload,newEditor) => {
                $updateToolbar();
                setActiveEditor(newEditor);
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );
    },[editor,$updateToolbar]);

    useEffect(()=> {
        return mergeRegister(
            editor.registerEditableListener((editable)=> {
                setIsEditable(editable);
            }),
            activeEditor.registerUpdateListener(({editorState})=> {
                editorState.read(()=> {
                    $updateToolbar();
                });
            }),
            activeEditor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload)=> {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
            activeEditor.registerCommand(
                CAN_REDO_COMMAND,
                (payload)=> {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL
            ),
        );
    },[$updateToolbar,activeEditor,editor]);

    const clearFormatting=useCallback(()=> {
        activeEditor.update(()=>{
            const selection=$getSelection();
            if ($isRangeSelection(selection)) {
                const anchor=selection.anchor;
                const focus=selection.focus;
                const nodes=selection.getNodes();

                if (anchor.key===focus.key&&anchor.offset===focus.offset) {
                    return;
                }

                nodes.forEach((node,idx)=> {
                    // Dividir el primer y último nodo por la selección
                    // Para no formatear texto no seleccionado dentro de dichos nodos
                    if ($isTextNode(node)) {
                        if (idx===0&&anchor.offset!=0) {
                            node=node.splitText(anchor.offset)[1]||node;
                        }
                        if (idx===nodes.length-1) {
                            node=node.splitText(focus.offset)[0]||node;
                        }
                        if (node.__style!=='') {
                            node.setStyle('');
                        }
                        if (node.__format!==0) {
                            node.setFormat(0);
                            $getNearestBlockElementAncestorOrThrow(node).setFormat('');
                        }
                    } else if ($isHeadingNode(node)||$isQuoteNode(node)) {
                        node.replace($createParagraphNode(node),true); 
                    } else if ($isDecoratorBlockNode(node)) {
                        node.setFormat('');
                    }
                });
            }
        });
    },[activeEditor]);

    const insertLink=useCallback(()=> {
        if(!isLink) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND,sanitizeUrl('https://'));
        } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND,null);
        }
    },[editor,isLink]);

    const onCodeLanguageSelect=useCallback(
        (value) => {
            activeEditor.update(()=> {
                if (selectedElementKey!=null) {
                    const node=$getNodeByKey(selectedElementKey);
                    if ($isCodeNode(node)) {
                        node.setLanguage(value);
                    }
                }
            });
        },
        [activeEditor,selectedElementKey],
    );

    return (
        <div className="toolbar">
            <button
                disabled={!canUndo||!isEditable}
                onClick={()=>{
                    activeEditor.dispatchCommand(UNDO_COMMAND,undefined);
                }}
                title={'Deshacer (Ctrl+Z)'}
                type="button"
                className="toolbar-item spaced"
                aria-label="Deshacer"
            >
                <i className="format undo"/>
            </button>
            <button
                disabled={!canUndo||!isEditable}
                onClick={()=> {
                    activeEditor.dispatchCommand(REDO_COMMAND,undefined);
                }}
                title={"Rehacer (Ctrl+Y)"}
                type="button"
                className="toolbar-item"
                aria-label="Rehacer"
            >
                <i className="format redo"/>
            </button>
            <Divider/>
            {blockType in blockTypeToBlockName&&activeEditor===editor&& (
                <>
                    <>

                    </>
                </>
            )}
        </div>
    );
}