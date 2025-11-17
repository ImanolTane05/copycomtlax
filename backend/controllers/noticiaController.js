const Noticia=require('../models/Noticia');
// Importar el servicio de envío de notificaciones push
const pushService = require('../utils/pushService'); 

// Crear noticia (requiere token admin o ayudante)
const crearNoticia=async(req,res) => {
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

        // Lógica de Notificación Push para CREACIÓN
        pushService.sendPushNotification(
            '¡Nueva Noticia!', // Título visible
            noticia.title,     // Cuerpo visible
            { type: 'noticia', id: noticia._id.toString(), action: 'created' }, // Payload de datos
            false // Notificación visible
        );

        res.status(201).json(noticia);
    } catch (e) {
        console.error('Error al crear Noticia: ',e);
        res.status(500).json({mensaje:'Error al crear noticia.'})
    }
}

// Consultar noticias (excluyendo el cuerpo)
const obtenerNoticias=async(req,res)=>{
    try {
        const noticias=await Noticia.find({}).select('-body').sort({publishedDate:-1});
        // ---Intento de partición de resultados para paginado
        //const page=parseInt(req.query.page);
        //const pageSize=parseInt(req.query.pageSize);
        ////Calcular índices inicial y final p' la página solicitada
        //const startIndex=(page-1)*pageSize;
        //const endIndex=page*pageSize;
        ////Slice al arreglo de noticias según índices
        //const slicedNoticias=noticias.slice(startIndex,endIndex);
        ////Calcular total de páginas
        //const totalPages=Math.ceil(noticias.length/pageSize);
        // SUSTITUIR RES.JSON CON res.json({noticias:noticias,paginas:totalPages});
        // -----
        res.json(noticias);
    } catch (e) {
        console.error('Error al consultar Noticias: ',e);
        res.status(500).json({mensaje:'Error al consultar noticias.'})
    }
}

// Consultar detalles de noticia
const obtenerNoticia=async(req,res)=>{
    try {
        const noticia=await Noticia.findById(req.params.id);
        res.json(noticia);
    } catch (e) {
        console.error('Error al consultar Noticia: ',e);
        res.status(500).json({mensaje:'Error al consultar la noticia.'})
    }
}

const actualizarNoticia=async(req,res)=>{
    try {
        const noticia=await Noticia.findByIdAndUpdate(req.params.id,
            {
                title:req.body.title,
                lead:req.body.lead,
                headerPic:req.body.headerPic,
                body:req.body.body,
                editedDate:Date.now()
            },{new:true}
        );
        if (!noticia) return res.status(404).json({error:"No se encontró la noticia."});
        res.json(noticia);
    } catch (e) {
        console.error('Error al actualizar Noticia:\n',e);
        res.status(500).json({mensaje:'Error al consultar noticias.'});
    }
}

const eliminarNoticia=async(req,res)=>{
    try {
        // Usamos findByIdAndDelete para obtener el resultado de la operación
        const noticiaEliminada = await Noticia.findByIdAndDelete(req.params.id);

        if(!noticiaEliminada) {
            // No se encontró la noticia a eliminar
            res.status(404).send({
                message:`404 No se encontró noticia a eliminar.`
            });
        } else {
            
            // Lógica de Notificación Push para ELIMINACIÓN
            // Se envía una notificación silenciosa con la acción 'deleted'
            pushService.sendPushNotification(
                null,
                null,
                { type: 'noticia', id: req.params.id, action: 'deleted' }, // Payload de datos
                true // Notificación silenciosa
            );
            
            // Si la eliminación fue exitosa
            res.send({
                message:"Noticia eliminada exitosamente"
            })
        }
    } catch (e) {
        console.error('Error al eliminar Noticia: ',e);
        res.status(500).json({mensaje:'Error al eliminar noticia.'})
    }
}

module.exports={
    crearNoticia,
    obtenerNoticias,
    obtenerNoticia,
    actualizarNoticia,
    eliminarNoticia
}