import {CLEAR_EDITOR_COMMAND} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

export function Actions() {
    const [editor]=useLexicalComposerContext();

    function handleOnSave() {
        console.log(JSON.stringify(editor.getEditorState()));
    }

    function handleOnClear() {
        editor.dispatchCommand(CLEAR_EDITOR_COMMAND,undefined);
        editor.focus();
    }

    return (
        <div className='editor-actions'>
            <button onClick={handleOnSave}>Guardar</button>
            <button onClick={handleOnClear}>Borrar todo</button>
        </div>
    );
}