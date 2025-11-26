import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaPlus, FaSave, FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';

// Componente principal para crear una nueva encuesta
const CrearEncuesta = () => {
    // Estado para el título de la encuesta
    const [titulo, setTitulo] = useState('');
    // Estado para la lista de preguntas
    const [preguntas, setPreguntas] = useState([]);
    // Estado para controlar la visibilidad del modal de agregar/editar pregunta
    const [mostrarPopup, setMostrarPopup] = useState(false);
    // Estado para almacenar el índice de la pregunta que se está editando
    const [editandoIndex, setEditandoIndex] = useState(null);
    // Estado para la nueva pregunta que se está creando o editando
    const [nuevaPregunta, setNuevaPregunta] = useState({
        tipo: '',
        texto: '',
        opciones: [''],
    });

    // Tipos de preguntas disponibles
    const tipos = ['Abierta', 'Cerrada', 'Opción múltiple'];

    /**
     * @description Maneja la adición o edición de una pregunta en la lista.
     */
    const handleAgregarOEditarPregunta = () => {
        // Validar que se haya seleccionado un tipo y escrito un texto
        if (!nuevaPregunta.tipo || !nuevaPregunta.texto.trim()) {
            toast.error('Debe seleccionar el tipo y escribir el texto de la pregunta');
            return;
        }
        // Validar que las opciones no estén vacías para preguntas cerradas o de opción múltiple
        if (
            ['Cerrada', 'Opción múltiple'].includes(nuevaPregunta.tipo) &&
            nuevaPregunta.opciones.some((op) => !op.trim())
        ) {
            toast.error('Las opciones no pueden estar vacías');
            return;
        }

        // Determinar si se está editando o agregando
        const preguntaAGuardar = {
            ...nuevaPregunta,
            // Las preguntas abiertas no tienen opciones
            opciones: nuevaPregunta.tipo === 'Abierta' ? [] : nuevaPregunta.opciones,
        };

        if (editandoIndex !== null) {
            // Lógica de edición
            const nuevasPreguntas = [...preguntas];
            nuevasPreguntas[editandoIndex] = preguntaAGuardar;
            setPreguntas(nuevasPreguntas);
            setEditandoIndex(null);
            toast.success('Pregunta editada correctamente.');
        } else {
            // Lógica de adición
            setPreguntas([...preguntas, preguntaAGuardar]);
            toast.success('Pregunta agregada correctamente.');
        }

        // Limpiar el estado de la pregunta y cerrar el popup
        setNuevaPregunta({ tipo: '', texto: '', opciones: [''] });
        setMostrarPopup(false);
    };

    /**
     * @description Prepara el formulario para editar una pregunta existente.
     * @param {number} index - El índice de la pregunta a editar.
     */
    const handleEditarPregunta = (index) => {
        setNuevaPregunta(preguntas[index]);
        setEditandoIndex(index);
        setMostrarPopup(true);
    };

    /**
     * @description Elimina una pregunta de la lista después de la confirmación.
     * @param {number} index - El índice de la pregunta a eliminar.
     */
    const handleEliminarPregunta = (index) => {
        toast((t) => (
            <div className="flex flex-col items-center p-4">
                <p className="text-gray-800 font-semibold text-lg mb-4">¿Estás seguro de que quieres eliminar esta pregunta?</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            const nuevasPreguntas = preguntas.filter((_, i) => i !== index);
                            setPreguntas(nuevasPreguntas);
                            toast.dismiss(t.id);
                            toast.success('Pregunta eliminada.');
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Sí, eliminar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            position: 'top-center',
        });
    };

    /**
     * @description Guarda la encuesta completa en la API.
     */
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
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/encuestas`, {
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
            // Limpiar los estados después de guardar
            setTitulo('');
            setPreguntas([]);
        } catch (err) {
            toast.error('Error: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-white p-4 sm:p-6 text-gray-900 flex flex-col items-center font-sans">
            <Toaster position="top-center" />
            
            <div className="max-w-4xl w-full bg-gray-100 rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 mt-8">
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-gray-900">
                    Crear Nueva Encuesta
                </h2>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Título de la encuesta"
                    className="border border-gray-300 bg-white p-3 sm:p-4 rounded-lg w-full mb-6 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out"
                />

                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
                    <h3 className="text-2xl font-semibold text-gray-900">Preguntas</h3>
                    <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
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
                                className="p-5 border border-gray-300 rounded-xl bg-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-300 ease-in-out"
                            >
                                <div className="flex-grow">
                                    <strong className="block mb-1 text-lg font-bold text-blue-600">
                                        {preg.tipo}:
                                    </strong>
                                    <p className="text-gray-800 text-base mb-2 break-words">{preg.texto}</p>
                                    {preg.opciones?.length > 0 && (
                                        <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
                                            {preg.opciones.map((op, j) => (
                                                <li key={j} className="break-words">{op}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="flex-shrink-0 flex gap-2">
                                    <button
                                        onClick={() => handleEditarPregunta(i)}
                                        className="p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-300 ease-in-out shadow-md"
                                        title="Editar pregunta"
                                    >
                                        <FaEdit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleEliminarPregunta(i)}
                                        className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out shadow-md"
                                        title="Eliminar pregunta"
                                    >
                                        <FaTrashAlt size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 text-lg py-12">
                        Aún no hay preguntas añadidas. Haz clic en "Agregar pregunta" para empezar.
                    </p>
                )}

                <button
                    onClick={guardarEncuesta}
                    className="w-full mt-8 px-8 py-4 bg-green-600 text-white rounded-lg font-bold text-xl hover:bg-green-700 transition duration-300 ease-in-out flex items-center justify-center gap-3 shadow-md"
                >
                    <FaSave /> Guardar Encuesta
                </button>
            </div>

            {mostrarPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full text-gray-900 card-animation">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl sm:text-3xl font-semibold text-center flex-grow">
                                {editandoIndex !== null ? 'Editar Pregunta' : 'Nueva Pregunta'}
                            </h3>
                            <button
                                onClick={() => {
                                    setMostrarPopup(false);
                                    setEditandoIndex(null);
                                    setNuevaPregunta({ tipo: '', texto: '', opciones: [''] });
                                }}
                                className="text-gray-500 hover:text-red-600 transition-colors"
                                title="Cerrar"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>
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
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
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
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                                    placeholder="Escribe la pregunta..."
                                />
                            </div>
                            {['Cerrada', 'Opción múltiple'].includes(nuevaPregunta.tipo) && (
                                <div>
                                    <label className="block mb-2 font-semibold">Opciones:</label>
                                    {nuevaPregunta.opciones.map((op, i) => (
                                        <div key={i} className="flex gap-2 mb-2 items-center">
                                            <input
                                                type="text"
                                                value={op}
                                                onChange={(e) => {
                                                    const opciones = [...nuevaPregunta.opciones];
                                                    opciones[i] = e.target.value;
                                                    setNuevaPregunta({ ...nuevaPregunta, opciones });
                                                }}
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                                                placeholder={`Opción ${i + 1}`}
                                            />
                                            {nuevaPregunta.opciones.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const opciones = [...nuevaPregunta.opciones];
                                                        opciones.splice(i, 1);
                                                        setNuevaPregunta({ ...nuevaPregunta, opciones });
                                                    }}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                    title="Eliminar opción"
                                                >
                                                    <FaTimes />
                                                </button>
                                            )}
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
                                className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-md"
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
                                className="w-full bg-gray-400 text-gray-900 px-4 py-3 rounded-lg font-semibold hover:bg-gray-500 transition flex items-center justify-center gap-2 shadow-md"
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