// este mi Encuestas.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaPaperPlane } from 'react-icons/fa';

const Encuestas = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [respuestas, setRespuestas] = useState({}); // { encuestaId: { preguntaId: respuesta, ... }, ... }

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/encuestas')
            .then((res) => setEncuestas(res.data))
            .catch((err) => {
                console.error('Error al cargar encuestas:', err);
                toast.error('Error al cargar las encuestas disponibles.');
            });
    }, []);

    const handleChange = (encuestaId, preguntaId, value) => {
        setRespuestas((prev) => ({
            ...prev,
            [encuestaId]: {
                ...prev[encuestaId],
                [preguntaId]: value,
            },
        }));
    };

    const handleSubmit = async (e, encuestaId) => {
        e.preventDefault();
        const respuestasEncuesta = respuestas[encuestaId];
        if (!respuestasEncuesta) {
            toast.error('Por favor, responde al menos una pregunta.');
            return;
        }

        const encuesta = encuestas.find((enc) => enc._id === encuestaId);
        const preguntasSinRespuesta = encuesta.preguntas.filter(
            (p) => !respuestasEncuesta[p._id] || respuestasEncuesta[p._id].toString().trim() === ''
        );
        if (preguntasSinRespuesta.length > 0) {
            toast.error('Por favor, responde todas las preguntas antes de enviar.');
            return;
        }

        const respuestasArray = Object.entries(respuestasEncuesta).map(([preguntaId, respuesta]) => ({
            preguntaId,
            respuesta,
        }));

        try {
            await axios.post(`http://localhost:5000/api/encuestas/${encuestaId}/responder`, {
                respuestas: respuestasArray,
                usuarioId: null,
            });
            toast.success('Gracias por enviar tus respuestas.');
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
        <div className="min-h-screen bg-[#1f2937] p-6 text-white flex justify-center">
            <Toaster />
            <div className="max-w-4xl w-full">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-white">Encuestas Disponibles</h1>
                {encuestas.length === 0 && <p className="text-center text-lg text-gray-400">No hay encuestas disponibles en este momento.</p>}
                <div className="space-y-8">
                    {encuestas.map((encuesta) => (
                        <form
                            key={encuesta._id}
                            onSubmit={(e) => handleSubmit(e, encuesta._id)}
                            className="p-8 border rounded-2xl shadow-xl bg-gray-800"
                        >
                            <h2 className="text-3xl font-bold mb-6 text-blue-400">{encuesta.titulo}</h2>
                            {encuesta.cerrada && (
                                <p className="mb-4 text-red-400 font-semibold text-lg">Esta encuesta está cerrada</p>
                            )}
                            {encuesta.preguntas.map((pregunta) => (
                                <div key={pregunta._id} className="mb-6">
                                    <h3 className="text-xl font-semibold mb-3 text-gray-200">{pregunta.texto}</h3>
                                    {pregunta.tipo === 'Cerrada' || pregunta.tipo === 'Opción múltiple' ? (
                                        pregunta.opciones.map((opcion, idx) => (
                                            <label
                                                key={idx}
                                                className="block cursor-pointer mb-2 text-gray-300 hover:text-blue-400 transition"
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
                                            className="w-full border border-gray-600 rounded-lg p-3 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                                className={`w-full mt-4 px-6 py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
                                    encuesta.cerrada
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                <FaPaperPlane />
                                Enviar respuestas
                            </button>
                        </form>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Encuestas;