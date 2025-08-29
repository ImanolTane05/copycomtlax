import React, { useEffect,useState } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';

const Visitor = () => {
  const [noticias,setNoticias]=useState();

  useEffect(()=>{
    axios.get('http://localhost:5000/api/noticias/')
      .then(res=>setNoticias(res.data))
      .catch(err=>console.log("Error al cargar noticias:",err));
  },[]);
  

  return (
    <div className='p-20 text-center'>
      <h1 className='text-3xl'>Periodistas Unidos</h1>
      <p>Bienvenido a la sección pública de noticias.</p>
      { 
      noticias ?
        <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 my-10 gap-10'>
          {
            noticias.map((noticia)=>(
              <ArticleCard
                  id={noticia._id}
                  title={noticia.title}
                  lead={noticia.lead}
                  image={noticia.headerPic}
              />
            ))
          }
        </div>
      : 
        <div className='grid grid-cols-[(3,1fr)] gap-[10px] my-10'>
          <div>
            <img src="no_content.png" width={256} className='opacity-50 inline-block'/>
          </div>
          <p className='text-3xl opacity-50'>No hay noticias.</p>  
        </div>
      }
    </div>
  );
};

export default Visitor;
