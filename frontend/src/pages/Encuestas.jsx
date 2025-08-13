
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaPaperPlane } from 'react-icons/fa'; // Icono para el botón de envío

const Encuestas = () => {
    const [encuestas, setEncuestas] = useState([]);
    // Estado para guardar las respuestas de cada encuesta y pregunta
    const [respuestas, setRespuestas] = useState({});

    // Cargar las encuestas al iniciar el componente
    useEffect(() => {
        axios
            .get('http://localhost:5000/api/encuestas')
            .then((res) => setEncuestas(res.data))
            .catch((err) => {
                console.error('Error al cargar encuestas:', err);
                toast.error('Error al cargar las encuestas disponibles.');
            });
    }, []);

    // Manejar el cambio en los inputs (radio y textarea)
    const handleChange = (encuestaId, preguntaId, value) => {
        setRespuestas((prev) => ({
            ...prev,
            [encuestaId]: {
                ...prev[encuestaId],
                [preguntaId]: value,
            },
        }));
    };

    // Manejar el envío del formulario de una encuesta
    const handleSubmit = async (e, encuestaId) => {
        e.preventDefault();
        const respuestasEncuesta = respuestas[encuestaId];
        
        // Validar que se haya respondido al menos una pregunta
        if (!respuestasEncuesta || Object.keys(respuestasEncuesta).length === 0) {
            toast.error('Por favor, responde al menos una pregunta.');
            return;
        }

        const encuesta = encuestas.find((enc) => enc._id === encuestaId);

        // Validar que todas las preguntas obligatorias tengan una respuesta
        const preguntasSinRespuesta = encuesta.preguntas.filter(
            (p) => !respuestasEncuesta[p._id] || respuestasEncuesta[p._id].toString().trim() === ''
        );
        if (preguntasSinRespuesta.length > 0) {
            toast.error('Por favor, responde todas las preguntas antes de enviar.');
            return;
        }

        // Convertir las respuestas a un formato de array para la API
        const respuestasArray = Object.entries(respuestasEncuesta).map(([preguntaId, respuesta]) => ({
            preguntaId,
            respuesta,
        }));

        try {
            await axios.post(`http://localhost:5000/api/encuestas/${encuestaId}/responder`, {
                respuestas: respuestasArray,
                usuarioId: null, // Asumiendo que el usuario no está logueado
            });
            toast.success('Gracias por enviar tus respuestas.');
            // Limpiar las respuestas de la encuesta enviada
            setRespuestas((prev) => ({
                ...prev,
                [encuestaId]: {},
            }));
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Error al enviar respuestas.';
            toast.error(errorMessage);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-white p-4 sm:p-8 text-gray-800 font-inter pt-24">
            <Toaster position="top-center" />
            <div className="flex justify-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Encuestas Disponibles</h1>
            </div>
            
            {encuestas.length === 0 ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-xl text-gray-500 font-inter">No hay encuestas disponibles en este momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {encuestas.map((encuesta) => (
                        <div
                            key={encuesta._id}
                            className={`bg-gray-100 text-gray-800 rounded-3xl p-6 shadow-2xl transition-all duration-300 ease-in-out font-inter transform-gpu hover:scale-105
                                        ${encuesta.cerrada ? 'opacity-70' : ''}`}
                        >
                            <form onSubmit={(e) => handleSubmit(e, encuesta._id)}>
                                <h2 className="text-3xl font-extrabold mb-2 text-blue-600">{encuesta.titulo}</h2>
                                {encuesta.cerrada && (
                                    <p className="mb-4 text-red-500 font-semibold text-lg italic">Esta encuesta está cerrada</p>
                                )}
                                
                                {encuesta.preguntas.map((pregunta) => (
                                    <div key={pregunta._id} className="mb-6 bg-white p-4 rounded-xl shadow-md">
                                        <h3 className="text-xl font-semibold mb-3 text-gray-700">{pregunta.texto}</h3>
                                        {pregunta.tipo === 'Cerrada' || pregunta.tipo === 'Opción múltiple' ? (
                                            pregunta.opciones.map((opcion, idx) => (
                                                <label
                                                    key={idx}
                                                    className="block cursor-pointer mb-2 text-gray-700 hover:text-blue-600 transition"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={pregunta._id}
                                                        value={opcion}
                                                        checked={respuestas[encuesta._id]?.[pregunta._id] === opcion}
                                                        onChange={(e) =>
                                                            handleChange(encuesta._id, pregunta._id, e.target.value)
                                                        }
                                                        className="mr-3 accent-blue-600"
                                                        required
                                                        disabled={encuesta.cerrada}
                                                    />
                                                    {opcion}
                                                </label>
                                            ))
                                        ) : (
                                            <textarea
                                                placeholder="Escribe tu respuesta..."
                                                value={respuestas[encuesta._id]?.[pregunta._id] || ''}
                                                onChange={(e) =>
                                                    handleChange(encuesta._id, pregunta._id, e.target.value)
                                                }
                                                className="w-full border-2 border-gray-300 rounded-lg p-3 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                disabled={encuesta.cerrada}
                                                required
                                                rows={4}
                                            />
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="submit"
                                    disabled={encuesta.cerrada}
                                    className={`w-full mt-4 px-6 py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 ${
                                        encuesta.cerrada
                                            ? 'bg-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    <FaPaperPlane />
                                    Enviar respuestas
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Encuestas;