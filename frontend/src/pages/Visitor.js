import React from 'react';
import ArticleCard from '../components/ArticleCard';
import ContactCard from '../components/contactCard';


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
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='p-20 text-center'>
        <h1 className='text-3xl'>Periodistas Unidos</h1>
        <p>Bienvenido a la sección pública de noticias.</p>
        <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 my-10 gap-10'>
          <ArticleCard/>
          <ArticleCard/>
          <ArticleCard/>
        </div>
      </div>

      <LocalFooter>
        <ContactCard/>
      </LocalFooter>
    </div>
  );
};

export default Visitor;
