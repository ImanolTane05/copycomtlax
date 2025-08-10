import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';

// Icono para editar (SVG)
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

// Icono para eliminar (SVG)
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.728-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

// Icono para guardar (SVG)
const SaveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

// Icono para cerrar (SVG)
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// Icono para agregar (SVG)
const AddIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

const EditarEncuesta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [titulo, setTitulo] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [editandoIndex, setEditandoIndex] = useState(null);
  const [preguntaForm, setPreguntaForm] = useState({
    tipo: '',
    texto: '',
    opciones: [''],
  });

  const tipos = ['Abierta', 'Cerrada', 'Opción múltiple'];

  // Query para obtener los datos de la encuesta
  const { data: encuesta, isLoading, isError, error } = useQuery({
    queryKey: ['encuesta', id],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/encuestas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // Datos frescos durante 5 minutos
  });

  // Usamos useEffect para cargar los datos de la encuesta en el estado local una vez que se obtengan
  useEffect(() => {
    if (encuesta) {
      setTitulo(encuesta.titulo);
      setPreguntas(encuesta.preguntas || []);
    }
  }, [encuesta]);

  // Mutación para actualizar la encuesta
  const updateMutation = useMutation({
    mutationFn: async (encuestaActualizada) => {
      const token = localStorage.getItem('token');
      return axios.put(
        `http://localhost:5000/api/encuestas/${id}`,
        encuestaActualizada,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encuestas'] });
      toast.success('Encuesta actualizada exitosamente.');
      navigate('/admin/encuestas');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Error al actualizar la encuesta');
    },
  });
  
  // Mutación para cerrar la encuesta
  const closeMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      return axios.patch(
        `http://localhost:5000/api/encuestas/${id}/cerrar`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encuestas'] });
      toast.success('Encuesta cerrada exitosamente.');
      navigate('/admin/encuestas');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Error al cerrar la encuesta');
    },
  });

  // Mutación para abrir la encuesta
  const openMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      return axios.patch(
        `http://localhost:5000/api/encuestas/${id}/abrir`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encuestas'] });
      toast.success('Encuesta abierta exitosamente.');
      navigate('/admin/encuestas');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Error al abrir la encuesta');
    },
  });

  const handleEditarPregunta = (index) => {
    setEditandoIndex(index);
    setPreguntaForm(preguntas[index]);
    setMostrarPopup(true);
  };

  const handleEliminarPregunta = (index) => {
    toast((t) => (
      <div className="flex flex-col p-4 bg-gray-700 text-white rounded-xl shadow-lg">
        <span>¿Estás seguro de eliminar esta pregunta?</span>
        <div className="flex gap-4 mt-4 justify-end">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
            onClick={() => {
              const updated = preguntas.filter((_, i) => i !== index);
              setPreguntas(updated);
              toast.success('Pregunta eliminada.');
              toast.dismiss(t.id);
            }}
          >
            <DeleteIcon /> Sí, eliminar
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center gap-2"
            onClick={() => toast.dismiss(t.id)}
          >
            <CloseIcon /> Cancelar
          </button>
        </div>
      </div>
    ),
    { duration: 5000 });
  };

  const handleGuardarPregunta = () => {
    if (!preguntaForm.tipo || !preguntaForm.texto.trim()) {
      toast.error('Debe seleccionar el tipo y escribir el texto de la pregunta');
      return;
    }

    if (
      ['Cerrada', 'Opción múltiple'].includes(preguntaForm.tipo) &&
      preguntaForm.opciones.some((op) => !op.trim())
    ) {
      toast.error('Las opciones no pueden estar vacías');
      return;
    }

    if (editandoIndex !== null) {
      const updated = [...preguntas];
      updated[editandoIndex] = {
        ...preguntaForm,
        opciones: preguntaForm.tipo === 'Abierta' ? [] : preguntaForm.opciones,
      };
      setPreguntas(updated);
      toast.success('Pregunta editada.');
    } else {
      setPreguntas([
        ...preguntas,
        {
          ...preguntaForm,
          opciones: preguntaForm.tipo === 'Abierta' ? [] : preguntaForm.opciones,
        },
      ]);
      toast.success('Pregunta agregada.');
    }

    setMostrarPopup(false);
    setEditandoIndex(null);
    setPreguntaForm({ tipo: '', texto: '', opciones: [''] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      toast.error('El título de la encuesta no puede estar vacío');
      return;
    }
    updateMutation.mutate({ titulo, preguntas });
  };
  
  const handleCerrarAbrirEncuesta = () => {
    const isClosed = encuesta?.estaCerrada;
    if (isClosed) {
      toast((t) => (
        <div className="flex flex-col p-4 bg-gray-700 text-white rounded-xl shadow-lg">
          <span>¿Estás seguro de que quieres abrir esta encuesta?</span>
          <div className="flex gap-4 mt-4 justify-end">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              onClick={() => {
                openMutation.mutate();
                toast.dismiss(t.id);
              }}
            >
              <SaveIcon /> Sí, abrir
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center gap-2"
              onClick={() => toast.dismiss(t.id)}
            >
              <CloseIcon /> Cancelar
            </button>
          </div>
        </div>
      ),
      { duration: 5000 });
    } else {
      toast((t) => (
        <div className="flex flex-col p-4 bg-gray-700 text-white rounded-xl shadow-lg">
          <span>¿Estás seguro de que quieres cerrar esta encuesta? No se podrán recibir más respuestas.</span>
          <div className="flex gap-4 mt-4 justify-end">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
              onClick={() => {
                closeMutation.mutate();
                toast.dismiss(t.id);
              }}
            >
              <CloseIcon /> Sí, cerrar
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center gap-2"
              onClick={() => toast.dismiss(t.id)}
            >
              <CloseIcon /> Cancelar
            </button>
          </div>
        </div>
      ),
      { duration: 5000 });
    }
  };


  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1f2937]">
        <p className="text-white text-xl animate-pulse">Cargando encuesta...</p>
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1f2937]">
        <p className="text-red-400 text-xl text-center">
          Error al cargar la encuesta: {error.message}
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#1f2937] p-4 sm:p-6 text-white flex justify-center">
      <Toaster />
      <div className="max-w-4xl w-full bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-white">
          Editar Encuesta
        </h1>
        
        {/* Botón para cerrar/abrir la encuesta */}
        <div className="flex justify-end">
          <button
            onClick={handleCerrarAbrirEncuesta}
            className={`px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
              encuesta?.estaCerrada
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {encuesta?.estaCerrada ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8V8a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2H7a1 1 0 010-2h2z" clipRule="evenodd" /></svg>
                Abrir Encuesta
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8V8a1 1 0 012 0v2h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2H7a1 1 0 010-2h2z" clipRule="evenodd" /></svg>
                Cerrar Encuesta
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-700 p-5 rounded-xl shadow-md">
            <label htmlFor="titulo" className="block text-lg font-bold mb-2">
              Título de la Encuesta
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-600 bg-gray-900 p-4 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Escribe el título de la encuesta"
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-2xl font-bold">Preguntas</h2>
              <button
                type="button"
                onClick={() => {
                  setEditandoIndex(null);
                  setPreguntaForm({ tipo: '', texto: '', opciones: [''] });
                  setMostrarPopup(true);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <AddIcon />
                Agregar pregunta
              </button>
            </div>

            <div className="space-y-4">
              {preguntas.length > 0 ? (
                preguntas.map((pregunta, index) => (
                  <div
                    key={pregunta._id || index}
                    className="bg-gray-700 p-5 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="flex-grow">
                      <strong className="block mb-1 text-lg font-bold text-blue-400">
                        {pregunta.tipo}:
                      </strong>
                      <p className="text-gray-200 text-base mb-2">{pregunta.texto}</p>
                      {pregunta.opciones?.length > 0 && (
                        <ul className="list-disc list-inside text-gray-300 ml-4 space-y-1">
                          {pregunta.opciones.map((op, j) => (
                            <li key={j}>{op}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleEditarPregunta(index)}
                        className="text-yellow-400 hover:text-yellow-500 transition p-2 rounded-full hover:bg-gray-600"
                        title="Editar pregunta"
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminarPregunta(index)}
                        className="text-red-400 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-600"
                        title="Eliminar pregunta"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 text-lg p-8 rounded-xl bg-gray-700">
                  Aún no hay preguntas añadidas.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition font-bold text-lg flex items-center justify-center gap-2"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Guardando...
              </>
            ) : (
              <>
                <SaveIcon />
                Guardar Cambios
              </>
            )}
          </button>
        </form>

        {mostrarPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-lg w-full text-white space-y-6">
              <h3 className="text-2xl sm:text-3xl font-semibold text-center text-blue-400">
                {editandoIndex !== null ? 'Editar Pregunta' : 'Nueva Pregunta'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold">Tipo:</label>
                  <select
                    value={preguntaForm.tipo}
                    onChange={(e) =>
                      setPreguntaForm({
                        ...preguntaForm,
                        tipo: e.target.value,
                        opciones: e.target.value === 'Abierta' ? [] : [''],
                      })
                    }
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Seleccione un tipo de pregunta</option>
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
                    value={preguntaForm.texto}
                    onChange={(e) =>
                      setPreguntaForm({ ...preguntaForm, texto: e.target.value })
                    }
                    className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Escribe la pregunta..."
                  />
                </div>
                {['Cerrada', 'Opción múltiple'].includes(preguntaForm.tipo) && (
                  <div>
                    <label className="block mb-2 font-semibold">Opciones:</label>
                    {preguntaForm.opciones.map((op, i) => (
                      <div key={i} className="flex gap-2 mb-2 items-center">
                        <input
                          type="text"
                          value={op}
                          onChange={(e) => {
                            const opciones = [...preguntaForm.opciones];
                            opciones[i] = e.target.value;
                            setPreguntaForm({ ...preguntaForm, opciones });
                          }}
                          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                          placeholder={`Opción ${i + 1}`}
                        />
                        {preguntaForm.opciones.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setPreguntaForm({
                                ...preguntaForm,
                                opciones: preguntaForm.opciones.filter(
                                  (_, idx) => idx !== i
                                ),
                              })
                            }
                            className="text-red-400 hover:text-red-500 transition p-2"
                            title="Eliminar opción"
                          >
                            <CloseIcon />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setPreguntaForm({
                          ...preguntaForm,
                          opciones: [...preguntaForm.opciones, ''],
                        })
                      }
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2 mt-4"
                      type="button"
                    >
                      <AddIcon />
                      Agregar opción
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGuardarPregunta}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                  type="button"
                >
                  <SaveIcon />
                  {editandoIndex !== null ? 'Guardar Cambios' : 'Guardar Pregunta'}
                </button>
                <button
                  onClick={() => {
                    setMostrarPopup(false);
                    setEditandoIndex(null);
                    setPreguntaForm({ tipo: '', texto: '', opciones: [''] });
                  }}
                  className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"
                  type="button"
                >
                  <CloseIcon />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditarEncuesta;