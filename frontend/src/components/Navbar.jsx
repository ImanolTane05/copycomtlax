// -- Archivo: frontend/src/components/Navbar.jsx --
// Este componente crea el navbar superior con el efecto de "pastilla"
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Iconos de Font Awesome

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAdmin = !!token;

  const handleLogout = () => {
    if (confirm("¿Cerrar la sesión?")) {
      localStorage.removeItem('token');
      navigate('/login'); // Redirige a la página de admin/login después de cerrar sesión
    }
  };

  return (
    <div className="flex justify-between items-center p-4">
      {/* Contenedor principal del navbar en forma de "pastilla" */}
      <div className="grow flex justify-center">
        <div className="bg-white rounded-full border-2 border-gray-800 shadow-xl p-2 md:p-3 flex items-center justify-center space-x-2 md:space-x-4">
          <Link to={'/'}>
            <img src="/logo/no-text192.png" alt="Logo CoPyComTlax" className='size-12 hover:bg-gray-200/50 rounded-full transition-colors active:bg-gray-400/50'/>
          </Link>
          <button
            onClick={() => navigate('/encuestas')}
            className="px-3 py-1 text-gray-800 rounded-full font-semibold transition-colors duration-300 hover:bg-gray-200/50 active:bg-gray-400/50"
          >
            Encuestas
          </button>
          <button
            onClick={() => navigate('/contacto')} 
            className="px-3 py-1 text-gray-800 rounded-full font-semibold transition-colors duration-300 hover:bg-gray-200/50 active:bg-gray-400/50"
          >
            Contacto
          </button>

          {isAdmin && (
            <>
              <button
                onClick={()=> navigate('/admin/noticias')}
                className='px-3 py-1 text-gray-800 rounded-full font-semibold transition-colors duration-300 hover:bg-gray-200/50 active:bg-gray-400/50'
              >
                Gestionar noticias
              </button>
              <button
                onClick={() => navigate('/admin/encuestas')}
                className="px-3 py-1 text-gray-800 rounded-full font-semibold transition-colors duration-300 hover:bg-gray-200/50 active:bg-gray-400/50"
              >
                Resultados Encuestas
              </button>
              <button
                onClick={() => navigate('/admin/crear-encuesta')}
                className="px-3 py-1 text-gray-800 rounded-full font-semibold transition-colors duration-300 hover:bg-gray-200/50 active:bg-gray-400/50"
              >
                Crear Encuesta
              </button>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-3 py-1 text-gray-800 rounded-full font-semibold transition-colors duration-300 hover:bg-gray-200/50 active:bg-gray-400/50"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-red-600 rounded-full font-semibold transition-colors duration-300 hover:bg-red-100/50 active:bg-red-200/50 flex items-center gap-2"
              >
                <FaSignOutAlt className="h-4 w-4" />
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
      
      {!isAdmin && (
        <div className="p-2 border border-gray-800 rounded-full">
          <FaUser className="h-4 w-4 text-gray-800" />
        </div>
      )}
    </div>
  );
};

export default Navbar;