import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaPlus,
  FaTimes,
  FaLock,
  FaUnlock,
  FaSpinner,
} from 'react-icons/fa';
import ErrorMessage from '../components/ErrorMessage';

/**
 * Componente principal para editar una encuesta existente.
 * Muestra el título y las preguntas de la encuesta, y permite modificar, agregar o eliminar preguntas.
 * También permite cerrar y reabrir la encuesta.
 */
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
  const {
    data: encuesta,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['encuesta', id],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/encuestas/${id}`, {
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
        `h${import.meta.env.VITE_BASE_URL}/encuestas/${id}`,
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
        `${import.meta.env.VITE_BASE_URL}/encuestas/${id}/cerrar`,
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
        `${import.meta.env.VITE_BASE_URL}/encuestas/${id}/abrir`,
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

  /**
   * Abre el popup de edición y carga la pregunta seleccionada en el formulario.
   * @param {number} index El índice de la pregunta a editar.
   */
  const handleEditarPregunta = (index) => {
    setEditandoIndex(index);
    setPreguntaForm(preguntas[index]);
    setMostrarPopup(true);
  };

  /**
   * Muestra un toast de confirmación para eliminar una pregunta.
   * @param {number} index El índice de la pregunta a eliminar.
   */
  const handleEliminarPregunta = (index) => {
    toast((t) => (
      <div className="flex flex-col p-4 bg-white text-gray-800 rounded-xl shadow-lg">
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
            <FaTrash /> Sí, eliminar
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center gap-2"
            onClick={() => toast.dismiss(t.id)}
          >
            <FaTimes /> Cancelar
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  /**
   * Guarda una nueva pregunta o actualiza una existente en el estado local.
   */
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

  /**
   * Maneja el envío del formulario para actualizar la encuesta en la base de datos.
   * @param {Event} e El evento del formulario.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      toast.error('El título de la encuesta no puede estar vacío');
      return;
    }
    updateMutation.mutate({ titulo, preguntas });
  };

  /**
   * Muestra un toast de confirmación para cerrar o abrir la encuesta.
   */
  const handleCerrarAbrirEncuesta = () => {
    const isClosed = encuesta?.estaCerrada;
    if (isClosed) {
      toast((t) => (
        <div className="flex flex-col p-4 bg-white text-gray-800 rounded-xl shadow-lg">
          <span>¿Estás seguro de que quieres abrir esta encuesta?</span>
          <div className="flex gap-4 mt-4 justify-end">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
              onClick={() => {
                openMutation.mutate();
                toast.dismiss(t.id);
              }}
            >
              <FaUnlock /> Sí, abrir
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center gap-2"
              onClick={() => toast.dismiss(t.id)}
            >
              <FaTimes /> Cancelar
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    } else {
      toast((t) => (
        <div className="flex flex-col p-4 bg-white text-gray-800 rounded-xl shadow-lg">
          <span>¿Estás seguro de que quieres cerrar esta encuesta? No se podrán recibir más respuestas.</span>
          <div className="flex gap-4 mt-4 justify-end">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
              onClick={() => {
                closeMutation.mutate();
                toast.dismiss(t.id);
              }}
            >
              <FaLock /> Sí, cerrar
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition flex items-center gap-2"
              onClick={() => toast.dismiss(t.id)}
            >
              <FaTimes /> Cancelar
            </button>
          </div>
        </div>
      ), { duration: 5000 });
    }
  };


  if (isLoading)
    return <FaSpinner className="loading-icon"/>
  if (isError)
    return (<ErrorMessage error={error} message={"Error al recuperar los detalles de la encuesta."}/>);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 text-gray-800 flex justify-center font-sans antialiased">
      <Toaster />
      <div className="max-w-4xl w-full space-y-6">
        {/* Cabecera con título y botón de cerrar/abrir */}
        <div className="bg-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center sm:text-left">
            Editar Encuesta
          </h1>
          <button
            onClick={handleCerrarAbrirEncuesta}
            className={`px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
              encuesta?.estaCerrada
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {encuesta?.estaCerrada ? (
              <>
                <FaUnlock className="h-5 w-5" />
                Abrir Encuesta
              </>
            ) : (
              <>
                <FaLock className="h-5 w-5" />
                Cerrar Encuesta
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tarjeta para el título de la encuesta */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
            <label htmlFor="titulo" className="block text-lg font-bold mb-2 text-blue-600">
              Título de la Encuesta
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-300 bg-gray-50 p-4 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              placeholder="Escribe el título de la encuesta"
              required
            />
          </div>

          {/* Tarjeta para la sección de preguntas */}
          <div className="bg-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Preguntas</h2>
              <button
                type="button"
                onClick={() => {
                  setEditandoIndex(null);
                  setPreguntaForm({ tipo: '', texto: '', opciones: [''] });
                  setMostrarPopup(true);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <FaPlus className="h-5 w-5" />
                Agregar pregunta
              </button>
            </div>

            <div className="space-y-4">
              {preguntas.length > 0 ? (
                preguntas.map((pregunta, index) => (
                  <div
                    key={pregunta._id || index}
                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="grow">
                      <strong className="block mb-1 text-lg font-bold text-blue-600">
                        {pregunta.tipo}:
                      </strong>
                      <p className="text-gray-800 text-base mb-2">{pregunta.texto}</p>
                      {pregunta.opciones?.length > 0 && (
                        <ul className="list-disc list-inside text-gray-600 ml-4 space-y-1">
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
                        className="text-yellow-600 hover:text-yellow-700 transition p-2 rounded-full hover:bg-gray-200"
                        title="Editar pregunta"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEliminarPregunta(index)}
                        className="text-red-600 hover:text-red-700 transition p-2 rounded-full hover:bg-gray-200"
                        title="Eliminar pregunta"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-lg p-8 rounded-xl bg-gray-200">
                  Aún no hay preguntas añadidas.
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition font-bold text-lg flex items-center justify-center gap-2"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <>
                <FaSpinner className="animate-spin h-5 w-5 text-white" />
                Guardando...
              </>
            ) : (
              <>
                <FaSave className="h-5 w-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </form>

        {/* Popup para agregar/editar pregunta */}
        {mostrarPopup && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg w-full text-gray-800 space-y-6">
              <h3 className="text-2xl sm:text-3xl font-semibold text-center text-blue-600">
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
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                          className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                            className="text-red-600 hover:text-red-700 transition p-2 rounded-full hover:bg-gray-200"
                            title="Eliminar opción"
                          >
                            <FaTimes className="h-5 w-5" />
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
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm flex items-center justify-center gap-2 mt-4"
                      type="button"
                    >
                      <FaPlus className="h-4 w-4" />
                      Agregar opción
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGuardarPregunta}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  type="button"
                >
                  <FaSave className="h-5 w-5" />
                  {editandoIndex !== null ? 'Guardar Cambios' : 'Guardar Pregunta'}
                </button>
                <button
                  onClick={() => {
                    setMostrarPopup(false);
                    setEditandoIndex(null);
                    setPreguntaForm({ tipo: '', texto: '', opciones: [''] });
                  }}
                  className="w-full bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"
                  type="button"
                >
                  <FaTimes className="h-5 w-5" />
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