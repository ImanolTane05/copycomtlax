const express=require('express');
const multer=require('multer');
const path=require('path');
const router=express.Router();

// Configurar almacenamiento local para Multer
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/'); // Guardar imágenes en la carpeta "uploads"
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+path.extname(file.originalname)); // Nombre de archivo único
    }
});

const upload=multer({storage:storage});

router.post('/',upload.single('image'),(req,res)=>{
    if (!req.file) {
        return res.status(400).send("No se subió ningún archivo");
    }
    const imageUrl=`uploads/${req.file.filename}`; // Se enviará esta ruta en el campo de imagen de la base de datos

    // Se debe guardar imageUrl en el documento (el registro) de MongoDB
    // Ej.: User.findByIdAndUpdate(userId,{photo:imageUrl},{new:true});

    res.status(200).json({message:"Imagen subida exitosamente.",imageUrl});
})

module.exports=router;