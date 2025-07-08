import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAdmin = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="space-x-4">
        {}
        <button
          onClick={() => navigate('/encuestas')}
          className="hover:bg-gray-700 px-3 py-1 rounded"
        >
          Encuestas
        </button>

       
        <button
          onClick={() => navigate('/contact')} 
          className="hover:bg-gray-700 px-3 py-1 rounded"
        >
          Contacto
        </button>

        {}
        {isAdmin && (
          <>
            <button
              onClick={() => navigate('/admin/encuestas')}
              className="hover:bg-gray-700 px-3 py-1 rounded"
            >
              Resultados Encuestas
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="hover:bg-gray-700 px-3 py-1 rounded"
            >
              Dashboard
            </button>
          </>
        )}
      </div>

      {}
      {isAdmin && (
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded font-semibold"
        >
          Cerrar sesión
        </button>
      )}
    </nav>
  );
};

export default Navbar;