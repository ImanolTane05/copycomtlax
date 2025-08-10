// Este mi CrearEncuesta.jsx
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaPlus, FaSave, FaEdit, FaTrashAlt } from 'react-icons/fa';

const CrearEncuesta = () => {
    const [titulo, setTitulo] = useState('');
    const [preguntas, setPreguntas] = useState([]);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [editandoIndex, setEditandoIndex] = useState(null); // Nuevo estado para editar
    const [nuevaPregunta, setNuevaPregunta] = useState({
        tipo: '',
        texto: '',
        opciones: [''],
    });

    const tipos = ['Abierta', 'Cerrada', 'Opción múltiple'];

    const handleAgregarOEditarPregunta = () => {
        if (!nuevaPregunta.tipo || !nuevaPregunta.texto.trim()) {
            toast.error('Debe seleccionar el tipo y escribir el texto de la pregunta');
            return;
        }
        if (
            ['Cerrada', 'Opción múltiple'].includes(nuevaPregunta.tipo) &&
            nuevaPregunta.opciones.some((op) => !op.trim())
        ) {
            toast.error('Las opciones no pueden estar vacías');
            return;
        }

        if (editandoIndex !== null) {
            // Lógica de edición
            const nuevasPreguntas = [...preguntas];
            nuevasPreguntas[editandoIndex] = {
                ...nuevaPregunta,
                opciones:
                    nuevaPregunta.tipo === 'Abierta' ? [] : nuevaPregunta.opciones,
            };
            setPreguntas(nuevasPreguntas);
            setEditandoIndex(null);
            toast.success('Pregunta editada correctamente.');
        } else {
            // Lógica de adición
            setPreguntas([
                ...preguntas,
                {
                    ...nuevaPregunta,
                    opciones:
                        nuevaPregunta.tipo === 'Abierta' ? [] : nuevaPregunta.opciones,
                },
            ]);
            toast.success('Pregunta agregada correctamente.');
        }

        setNuevaPregunta({ tipo: '', texto: '', opciones: [''] });
        setMostrarPopup(false);
    };

    const handleEditarPregunta = (index) => {
        setNuevaPregunta(preguntas[index]);
        setEditandoIndex(index);
        setMostrarPopup(true);
    };

    const handleEliminarPregunta = (index) => {
        const nuevasPreguntas = preguntas.filter((_, i) => i !== index);
        setPreguntas(nuevasPreguntas);
        toast.success('Pregunta eliminada.');
    };

    const guardarEncuesta = async () => {
        if (!titulo.trim()) {
            toast.error('Debe ingresar un título para la encuesta');
            return;
        }
        if (preguntas.length === 0) {
            toast.error('Agregue al menos una pregunta');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/encuestas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ titulo, preguntas }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.mensaje || 'Error al crear encuesta');
            }
            toast.success('Encuesta creada exitosamente');
            setTitulo('');
            setPreguntas([]);
        } catch (err) {
            toast.error('Error: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#1f2937] p-6 text-white flex flex-col items-center">
            <Toaster />
            <div className="max-w-4xl w-full bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                <h2 className="text-4xl font-extrabold mb-8 text-center">
                    Crear Nueva Encuesta
                </h2>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título de la encuesta"
                    className="border border-gray-600 bg-gray-700 p-4 rounded-lg w-full mb-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                />

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold">Preguntas</h3>
                    <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                        onClick={() => {
                            setNuevaPregunta({ tipo: '', texto: '', opciones: [''] });
                            setEditandoIndex(null);
                            setMostrarPopup(true);
                        }}
                    >
                        <FaPlus /> Agregar pregunta
                    </button>
                </div>
                
                {preguntas.length > 0 ? (
                    <div className="space-y-4 mb-6">
                        {preguntas.map((preg, i) => (
                            <div
                                key={i}
                                className="p-5 border border-gray-700 rounded-xl bg-gray-700 shadow-md flex justify-between items-start"
                            >
                                <div>
                                    <strong className="block mb-1 text-lg font-bold text-blue-400">
                                        {preg.tipo}:
                                    </strong>
                                    <p className="text-gray-200 text-base mb-2">{preg.texto}</p>
                                    {preg.opciones?.length > 0 && (
                                        <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                                            {preg.opciones.map((op, j) => (
                                                <li key={j}>{op}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditarPregunta(i)}
                                        className="text-yellow-400 hover:text-yellow-500 transition"
                                        title="Editar pregunta"
                                    >
                                        <FaEdit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleEliminarPregunta(i)}
                                        className="text-red-400 hover:text-red-500 transition"
                                        title="Eliminar pregunta"
                                    >
                                        <FaTrashAlt size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 text-lg">
                        Aún no hay preguntas añadidas.
                    </p>
                )}

                <button
                    onClick={guardarEncuesta}
                    className="w-full mt-8 px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-xl hover:bg-green-700 transition flex items-center justify-center gap-3"
                >
                    <FaSave /> Guardar Encuesta
                </button>
            </div>

            {mostrarPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-white">
                        <h3 className="text-3xl font-semibold mb-6 text-center">
                            {editandoIndex !== null ? 'Editar Pregunta' : 'Nueva Pregunta'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 font-semibold">Tipo:</label>
                                <select
                                    value={nuevaPregunta.tipo}
                                    onChange={(e) =>
                                        setNuevaPregunta({
                                            ...nuevaPregunta,
                                            tipo: e.target.value,
                                            opciones: e.target.value === 'Abierta' ? [] : [''],
                                        })
                                    }
                                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="">Seleccione</option>
                                    {tipos.map((tipo) => (
                                        <option key={tipo} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 font-semibold">Texto:</label>
                                <input
                                    type="text"
                                    value={nuevaPregunta.texto}
                                    onChange={(e) =>
                                        setNuevaPregunta({ ...nuevaPregunta, texto: e.target.value })
                                    }
                                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    placeholder="Escribe la pregunta..."
                                />
                            </div>
                            {['Cerrada', 'Opción múltiple'].includes(nuevaPregunta.tipo) && (
                                <div>
                                    <label className="block mb-2 font-semibold">Opciones:</label>
                                    {nuevaPregunta.opciones.map((op, i) => (
                                        <div key={i} className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={op}
                                                onChange={(e) => {
                                                    const opciones = [...nuevaPregunta.opciones];
                                                    opciones[i] = e.target.value;
                                                    setNuevaPregunta({ ...nuevaPregunta, opciones });
                                                }}
                                                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                placeholder={`Opción ${i + 1}`}
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() =>
                                            setNuevaPregunta({
                                                ...nuevaPregunta,
                                                opciones: [...nuevaPregunta.opciones, ''],
                                            })
                                        }
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2 mt-2"
                                        type="button"
                                    >
                                        <FaPlus /> Agregar opción
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mt-8 flex justify-between gap-4">
                            <button
                                onClick={handleAgregarOEditarPregunta}
                                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                                type="button"
                            >
                                <FaSave />
                                {editandoIndex !== null ? 'Guardar Cambios' : 'Guardar Pregunta'}
                            </button>
                            <button
                                onClick={() => {
                                    setMostrarPopup(false);
                                    setEditandoIndex(null);
                                    setNuevaPregunta({ tipo: '', texto: '', opciones: [''] });
                                }}
                                className="w-full bg-gray-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"
                                type="button"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrearEncuesta;