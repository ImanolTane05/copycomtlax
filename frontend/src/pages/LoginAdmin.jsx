import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye,FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import styles from  './Auth.module.css'; 

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur', reValidateMode: 'onBlur' });

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
        correo: data.email,
        contrasena: data.password,
      });

      localStorage.setItem('token', res.data.token);
      alert('Inicio de sesión exitoso');
      navigate('/admin/dashboard');
    } catch (error) {
      if (error.response) {
        alert(error.response.data.mensaje || 'Error al iniciar sesión');
      } else {
        alert('Error inesperado. Intenta más tarde');
      }
    }
  };

  return (
    <>
      <div
        style={{
          position:'fixed',
          top:0,
          left:0,
          width:'100%',
          height:'100%',
          backgroundImage:`url('bg/negativespace-177557.jpg')`,
          backgroundSize:'cover',
          backgroundPosition:'center',
          zIndex:-1,
          filter:`blur(1px)`,
        }}
      ></div>
      <section className={styles.authSection}>
        <div className={styles.imageContainer}>
          <img src="/logo/Logo512.png" alt="Logo" className={styles.image} />
        </div>

        <div className={styles.formContainer}>
          <form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles.authTitle}>Login Administrador</h2>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Correo</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="Ingrese su correo"
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Correo inválido',
                  },
                })}
              />
            </div>
            {errors.email && <div className={styles.error}>{errors.email.message}</div>}

            <div className={styles.inputGroup} style={{ position: 'relative' }}>
              <label htmlFor="password" className={styles.label}>Contraseña</label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="Ingrese su contraseña"
                {...register('password', {
                  required: 'La contraseña es obligatoria',
                  minLength: {
                    value: 6,
                    message: 'Mínimo 6 caracteres',
                  },
                })}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position:'absolute',
                  right:'10px',
                  top:'60%',
                  border:'none',
                  cursor:'pointer',
                  background:'transparent',
                  padding:0
                }}
              >
                {showPassword ? <FaEye/> : <FaEyeSlash/>}
              </button>
            </div>
            {errors.password && <div className={styles.error}>{errors.password.message}</div>}

            <button type="submit" className={styles.submitButton}>
              Iniciar sesión
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default LoginAdmin;
