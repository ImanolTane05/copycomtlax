import './EditorTheme.css'; 

// Estilo de editor
// El contenido se ajusta en el .CSS
// para dar variedad al contenido del editor
// mediante asignación de clase
// (Ver cómo funciona en https://lexical.dev/docs/getting-started/theming)
// Se utiliza dentro de initialConfig en el RichTextEditor
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

export default theme