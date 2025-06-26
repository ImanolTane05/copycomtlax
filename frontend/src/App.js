import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Visitor from './pages/Visitor';
import LoginAdmin from './pages/LoginAdmin';
import DashboardAdmin from './pages/DashboardAdmin';
import Encuestas from './pages/Encuestas';
import AdminEncuestas from './pages/AdminEncuestas';
import Navbar from './components/Navbar';

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

        {/* Rutas admin */}
        <Route path="/admin" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <DashboardAdmin />
          </ProtectedRoute>
        }/>
        <Route path="/admin/encuestas" element={
          <ProtectedRoute>
            <AdminEncuestas />
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
