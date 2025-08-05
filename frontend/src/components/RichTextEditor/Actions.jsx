import {CLEAR_EDITOR_COMMAND} from 'lexical';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

import '../../App.css';

export function Actions() {
    const [editor]=useLexicalComposerContext();

    function handleOnSave(e) {
        e.preventDefault();
        console.log(JSON.stringify(editor.getEditorState()));
    }

    function handleOnClear(e) {
        e.preventDefault();
        if (confirm("¿Eliminar el contenido?")) {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND,undefined);
            editor.focus();
        }
    }

    return (
        <div className='flex p-2 gap-12 mb-[0.5em]'>
            {
                <button className=' ml-1 p-1 bg-[#774128] hover:bg-[#542d1c] active:bg-[#452517] text-white transition-transform rounded-md' onClick={handleOnSave}>Guardar</button>
            }
            <button className='p-1 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 transition-transform rounded-md' onClick={handleOnClear}>Borrar todo</button>
        </div>
    );
}