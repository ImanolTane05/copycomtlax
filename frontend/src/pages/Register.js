import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Auth.module.css';

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      console.log('Registration form submitted', data);

      const response = await axios.post('http://localhost:3001/api/auth/register', data);

      if (response.status === 201) {
        alert('Registro exitoso');
        // Aquí puedes redirigir al login o limpiar el form
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        alert(error.response.data.message || 'Error al registrar');
      } else {
        alert('Error inesperado. Intenta de nuevo.');
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
        <h2 className={styles.authTitle}>Crear una cuenta</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>Nombre completo</label>
          <input
            id="name"
            type="text"
            className={styles.input}
            {...register('name', {
              required: 'El nombre es obligatorio',
              minLength: {
                value: 3,
                message: 'Debe tener al menos 3 caracteres',
              },
            })}
          />
          {errors.name && <div className={styles.error}>{errors.name.message}</div>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Correo electrónico</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            {...register('email', {
              required: 'El correo es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Correo inválido',
              },
            })}
          />
          {errors.email && <div className={styles.error}>{errors.email.message}</div>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="mobile" className={styles.label}>Teléfono</label>
          <input
            id="mobile"
            type="text"
            className={styles.input}
            {...register('mobile', {
              required: 'El teléfono es obligatorio',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Debe tener 10 dígitos',
              },
            })}
          />
          {errors.mobile && <div className={styles.error}>{errors.mobile.message}</div>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Contraseña</label>
          <input
            id="password"
            type="password"
            className={styles.input}
            {...register('password', {
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'Debe tener al menos 6 caracteres',
              },
            })}
          />
          {errors.password && <div className={styles.error}>{errors.password.message}</div>}
        </div>

        <button type="submit" className={styles.submitButton}>
          Registrarse
        </button>

        <p className={styles.toggleText}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className={styles.toggleLink}>Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
