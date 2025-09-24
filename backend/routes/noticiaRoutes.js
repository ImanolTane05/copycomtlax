const express=require('express');
const router=express.Router();
const verifyToken=require('../middleware/verifyToken');

const {
    crearNoticia,
    obtenerNoticias,
    obtenerNoticia,
    actualizarNoticia,
    eliminarNoticia
}=require('../controllers/noticiaController');

// Crear noticia (admin autenticado)
router.post('/crear',verifyToken,crearNoticia);

// Consultar noticias (público)
router.get('/',obtenerNoticias);

// Consultar noticia (público)
router.get('/:id',obtenerNoticia);

// Actualizar noticia (admin autenticado)
router.put('/:id',verifyToken,actualizarNoticia);

// Eliminar noticia (admin autenticado)
router.delete('/:id',verifyToken,eliminarNoticia);

module.exports=router;