const Noticia=require('../models/Noticia');

// Crear noticia (requiere token admin o ayudante)
exports.crearNoticia=async(req,res) => {
    try {
        const noticia=new Noticia({
            title:req.body.title,
            authors:req.body.authors,
            lead:req.body.lead,
            headerPic:req.body.headerPic,
            body:req.body.body,
            publishedDate:req.body.publishedDate
        });
        await noticia.save();
        res.status(201).json(noticia);
    } catch (e) {
        console.error('Error al crear Noticia: ',e);
        res.status(500).json({mensaje:'Error al crear noticia.'})
    }
}

// Consultar noticias (excluyendo el cuerpo)
exports.obtenerNoticias=async(req,res)=>{
    try {
        const noticias=await Noticia.find().sort({publishedDate:-1});
        for (var i=0;i<noticias.length;i++) {
            noticias[i].delete('body');
        }
        res.json(noticias);
    } catch (e) {
        console.error('Error al consultar Noticias: ',e);
        res.status(500).json({mensaje:'Error al consultar noticias.'})
    }
}

// Consultar detalles de noticia
exports.obtenerNoticia=async(req,res)=>{
    try {
        const noticia=await Noticia.findOne(req._id);
        res.json(noticia);
    } catch (e) {
        console.error('Error al consultar Noticia: ',e);
        res.status(500).json({mensaje:'Error al consultar la noticia.'})
    }
}

// Editar noticias TODO
exports.actualizarNoticias=async(req,res)=>{
    try {

    } catch (e) {
        console.error('Error al consultar Noticia: ',e);
        res.status(500).json({mensaje:'Error al consultar noticias.'})
    }
}

// Eliminar noticias TODO
exports.eliminarNoticias=async(req,res)=>{
    try {

    } catch (e) {
        console.error('Error al consultar Noticia: ',e);
        res.status(500).json({mensaje:'Error al consultar noticias.'})
    }
}