import React from 'react';
import ArticleCard from '../components/ArticleCard';

const Visitor = () => {
  return (
    <div className='p-20 text-center'>
      <h1 className='text-3xl'>Periodistas Unidos</h1>
      <p>Bienvenido a la sección pública de noticias.</p>
      <div className='grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 my-10 gap-10'>
        <ArticleCard/>
        <ArticleCard/>
        <ArticleCard/>
      </div>
    </div>
  );
};

export default Visitor;
