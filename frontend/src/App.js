import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Visitor from './pages/Visitor';
import LoginAdmin from './pages/LoginAdmin';
import Register from './pages/Register';
import DashboardAdmin from './pages/DashboardAdmin';
import Encuestas from './pages/Encuestas';
import AdminEncuestas from './pages/AdminEncuestas';
import CrearEncuesta from './pages/CrearEncuesta';
import Navbar from './components/Navbar';
import Contact from './pages/Contact'; 

// Componente para proteger rutas admin
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/admin" replace />;
};

// Componente para controlar la visibilidad del Navbar según ruta
const AppWrapper = () => {
  const location = useLocation();

  // No mostrar navbar en login admin
  const noNavbarRoutes = ['/admin'];

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Visitor />} />
        <Route path="/encuestas" element={<Encuestas />} />
        <Route path="/contacto" element={<Contact />} />

        {/* Rutas admin */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <DashboardAdmin />
          </ProtectedRoute>
        } />

        <Route path="/admin/encuestas" element={
          <ProtectedRoute>
            <AdminEncuestas />
          </ProtectedRoute>
        } />

        <Route path="/admin/crear-encuesta" element={
          <ProtectedRoute>
            <CrearEncuesta />
          </ProtectedRoute>
        } />

        {/* Ruta por defecto (404) */}
        <Route path="*" element={<h1 style={{ textAlign: 'center', marginTop: '50px' }}>404 - Página no encontrada</h1>} />
      </Routes>
    </>
  );
};

// Envolvemos todo con el Router
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;