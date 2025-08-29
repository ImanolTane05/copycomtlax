const Noticia=require('../models/Noticia');

// Crear noticia (requiere token admin o ayudante)
exports.crearNoticia=async(req,res) => {
    try {
        const noticia=new Noticia({
            title:req.body.title,
            lead:req.body.lead,
            headerPic:req.body.headerPic,
            body:req.body.body,
            publishedDate:req.body.publishedDate,
            editedDate:req.body.editedDate
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
        const noticias=await Noticia.find({}).select('-body').sort({publishedDate:-1});
        res.json(noticias);
    } catch (e) {
        console.error('Error al consultar Noticias: ',e);
        res.status(500).json({mensaje:'Error al consultar noticias.'})
    }
}

// Consultar detalles de noticia
exports.obtenerNoticia=async(req,res)=>{
    try {
        const noticia=await Noticia.findById(req.params.id);
        res.json(noticia);
    } catch (e) {
        console.error('Error al consultar Noticia: ',e);
        res.status(500).json({mensaje:'Error al consultar la noticia.'})
    }
}

// Editar noticias TODO
exports.actualizarNoticia=async(req,res)=>{
    try {
        Noticia.findByIdAndUpdate(req.params.id,
            {
                title:req.body.title,
                lead:req.body.lead,
                headerPic:req.body.headerPic,
                body:req.body.body,
                editedDate:Date.now()
            }
        )
    } catch (e) {
        console.error('Error al consultar Noticia: ',e);
        res.status(500).json({mensaje:'Error al consultar noticias.'})
    }
}

// Eliminar noticias TODO
exports.eliminarNoticia=async(req,res)=>{
    try {
        Noticia.findByIdAndDelete(req.params.id);
    } catch (e) {
        console.error('Error al consultar Noticia: ',e);
        res.status(500).json({mensaje:'Error al consultar noticias.'})
    }
}