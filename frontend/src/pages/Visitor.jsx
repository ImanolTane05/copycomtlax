import React, { useEffect,useState } from 'react';
import axios from 'axios';
import ArticleCard from '../components/ArticleCard';
import ContactCard from '../components/contactCard';
import { FaSpinner } from "react-icons/fa";
import { MdOutlineError,MdCloudOff } from "react-icons/md";
import { TbReload } from "react-icons/tb";
import ActionButton from '../components/ActionButton';

const LocalFooter = ({ children }) => {
  return(
    <footer className='bg-gray-800 text-white py-5 px-10 w-full mt-10'>
      <div className='max-w-1xl mx-auto flex justify-center'>
        {children}
      </div>
    </footer>
  )
}
const Visitor = () => {
  const [noticias,setNoticias]=useState();
  const [error,setError]=useState(null);
  const [isLoading,setIsLoading]=useState(true);

  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_BASE_URL}/noticias/`)
      .then(res=>setNoticias(res.data))
      .catch(err=>setError(err))
      .finally(setIsLoading(false));
  },[]);
  
  if (isLoading) {
    return <FaSpinner className="loading-icon" size={"15%"} color='#777'/>
  }

  if (error) {
    return <div className="text-gray-400 absolute top-[50%] left-[50%] transform-[translate(-50%,-50%)]">
      {
        error.code==='ERR_NETWORK' ? 
          <MdCloudOff size={"15%"} color='#777' className='justify-center mx-auto'/>
        :
          <MdOutlineError size={"15%"} color='#777' className='justify-center mx-auto'/>
      }
      <p className='mx-auto text-center'>
        {error.code==='ERR_NETWORK' ? "Ocurrió un problema de conexión. Intenta recargar." : "Error al recuperar noticias."}
      </p>
      <ActionButton 
        color={"bg-red-600"} 
        hoverColor={"bg-red-700"}
        activeColor={"bg-red-800"}
        style={"mx-auto"}
        onClick={(e)=>{
          e.preventDefault();
          window.location.reload();
        }}
      >
        <TbReload/> Reintentar
      </ActionButton>
    </div>
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <div className='p-20 text-center'>
        <h1 className='text-3xl'>Colegio de Periodistas y Comunicadores de Tlaxcala A.C.</h1>
          <p>Bienvenido a la sección pública de noticias.</p>
          { 
            noticias ?
              <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 my-10 gap-10'>
                {
                  noticias.map((noticia)=>(
                    <ArticleCard
                        key={noticia._id}
                        id={noticia._id}
                        title={noticia.title}
                        lead={noticia.lead}
                        image={noticia.headerPic}
                    />
                  ))
                }
              </div>
            : 
              <div className='grid grid-cols-[(3,1fr)] gap-2.5 my-10'>
                <div>
                  <img src="no_content.png" width={256} className='opacity-50 inline-block'/>
                </div>
                <p className='text-3xl opacity-50'>No hay noticias.</p>  
              </div>
      }
      </div>
      <LocalFooter>
        <ContactCard/>
      </LocalFooter>
    </div>
  );
};

export default Visitor;
