import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        correo,
        contrasena,
      });

      localStorage.setItem('token', res.data.token);
      setError('');
      navigate('/admin/dashboard'); // Redirige a dashboard tras login exitoso
    } catch (err) {
      setError('');
      if (err.response) {
        setError(err.response.data.mensaje);
      } else {
        setError('Error al conectar con el servidor');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login Administrador</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Iniciar Sesión</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: 400,
    margin: '50px auto',
    padding: 20,
    border: '1px solid #ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    padding: 10,
    fontSize: 16,
  },
  button: {
    padding: 10,
    backgroundColor: '#2e7d32',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
};

export default LoginAdmin;
