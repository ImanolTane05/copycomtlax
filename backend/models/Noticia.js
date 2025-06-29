const mongoose=require('mongoose');

/*
    Estructura de Noticia:
    Título: String
    Autores: Arreglo de IDs usuario
    Texto introductorio (puede mostrarse en la consulta de noticias)
    Imagen de encabezado (URL)
    Cuerpo
    Fecha de publicación
    Fecha de edición
*/

const NoticiaSchema=new mongoose.Schema({
    title:{type:String,required:true},
    authors:{type:[mongoose.Schema.Types.ObjectId],required:true,ref:'User'},
    lead:{type:mongoose.Schema.Types.String},
    headerPic:{type:mongoose.Schema.Types.String},
    body:{type:mongoose.Schema.Types.String,required:true},
    publishedDate:{type:Date,default:Date.now},
    editedDate:{type:Date}
})