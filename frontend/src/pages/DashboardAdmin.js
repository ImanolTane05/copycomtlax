import React from 'react';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h1 className=' text-7xl'>Hola Administrador</h1>
      <p className='p-5'>Bienvenido a tu panel de control.</p>

      <Link to="/register"
      className="bg-blue-900 text-white p-1 hover:bg-blue-800 transition-transform rounded-lg"
      >
        Registrar Usuario
      </Link>
      <Link to="/noticias/crear"
      className='bg-amber-900 text-white p-1 hover:bg-amber transition-transform rounded-lg'
      >
        Nueva noticia
      </Link>
    </div>
  );
};

export default DashboardAdmin;
