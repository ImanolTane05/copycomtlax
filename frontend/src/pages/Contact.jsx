import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState(''); 

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Enviando mensaje...');
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('¡Mensaje enviado con éxito! Te responderemos pronto.');
                setFormData({ name: '', email: '', message: '' }); 
            } else {
                const errorData = await response.json();
                setStatus(`Error al enviar el mensaje: ${errorData.mensaje || response.statusText}`);
            }
        } catch (error) {
            console.error('Error de conexión o de red:', error);
            setStatus('Error de conexión. Asegúrate de que el servidor esté funcionando e inténtalo de nuevo.');
        }
    };

    return (
        <div style={styles.contactContainer}>
            <h2 style={styles.h2}>Contáctanos</h2>
            <p style={styles.p}>Por favor, llena el formulario a continuación para enviarnos un mensaje.</p>
            <form onSubmit={handleSubmit} style={styles.contactForm}>
                <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.label}>Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="message" style={styles.label}>Mensaje:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="6"
                        required
                        style={styles.textarea}
                    ></textarea>
                </div>
                <button type="submit" style={styles.button}>Enviar Mensaje</button>

                {status && (
                    <p style={{
                        ...styles.statusMessage,
                        ...(status.includes('éxito') ? styles.statusSuccess : styles.statusError)
                    }}>
                        {status}
                    </p>
                )}
            </form>
        </div>
    );
};

// Objeto de estilos
const styles = {
    contactContainer: {
        maxWidth: '700px',
        margin: '40px auto',
        padding: '35px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
    },
    h2: {
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '25px',
        fontSize: '2.2em',
        borderBottom: '2px solid #eee',
        paddingBottom: '15px',
    },
    p: {
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '1.1em',
        color: '#555',
    },
    contactForm: {
    },
    formGroup: {
        marginBottom: '25px',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontWeight: 'bold',
        color: '#444',
        fontSize: '1em',
    },
    input: {
        width: '100%',
        padding: '12px 15px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '1em',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    },
    textarea: {
        width: '100%',
        padding: '12px 15px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '1em',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        resize: 'vertical',
        minHeight: '120px',
    },
    button: {
        display: 'block',
        width: '100%',
        padding: '15px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '1.2em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        marginTop: '20px',
    },

    statusMessage: {
        marginTop: '25px',
        padding: '15px',
        borderRadius: '6px',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '1em',
    },
    statusSuccess: {
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb',
    },
    statusError: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
    }
};

export default Contact;