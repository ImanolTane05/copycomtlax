import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaEdit, FaTrashAlt, FaLock, FaUnlock, FaTimes, FaRobot } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

ChartJS.register(ArcElement, Tooltip, Legend);

const coloresGrafica = [
    '#2B6CB0', '#4FD1C5', '#90CDF4', '#3182CE', '#81E6D9', '#EBF4FF',
    '#38B2AC', '#48BB78', '#68D391', '#9AE6B4', '#D6F6DE',
    '#ECC94B', '#F6E05E', '#FAD961', '#FCD34D', '#FBBF24',
];

function calcularPorcentajes(resumen) {
    const total = Object.values(resumen).reduce((a, b) => a + b, 0);
    if (total === 0) return resumen;
    const porcentajes = {};
    for (const key in resumen) {
        porcentajes[key] = parseFloat(((resumen[key] / total) * 100).toFixed(1));
    }
    return porcentajes;
}

const AdminEncuestas = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [expandedCard, setExpandedCard] = useState(null);
    const [resumenGemini, setResumenGemini] = useState({});
    const [loadingGemini, setLoadingGemini] = useState({});

    const fetchEncuestas = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/encuestas/admin`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    };

    const { data: encuestas = [], isLoading, isError } = useQuery({
        queryKey: ['encuestas'],
        queryFn: fetchEncuestas,
    });

    const estadoMutation = useMutation({
        mutationFn: ({ id, estado }) =>
            axios.patch(
                `${import.meta.env.VITE_BASE_URL}/encuestas/${id}/estado`,
                { cerrada: estado },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            ),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['encuestas'] });
            const mensaje = variables.estado ? 'Encuesta cerrada exitosamente.' : 'Encuesta abierta exitosamente.';
            toast.success(mensaje);
        },
        onError: (error) => {
            toast.error('Error al cambiar el estado de la encuesta.');
        },
    });

    const eliminarMutation = useMutation({
        mutationFn: (id) =>
            axios.delete(`${import.meta.env.VITE_BASE_URL}/encuestas/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['encuestas'] });
            toast.success('Encuesta eliminada exitosamente.');
        },
        onError: (error) => {
            toast.error('Error al eliminar la encuesta.');
        },
    });

    const handleEliminar = (id) => {
        toast((t) => (
            <div className="bg-gray-800 text-white rounded-lg p-4 shadow-xl flex flex-col space-y-4">
                <p className="text-sm font-semibold">¿Estás seguro de eliminar esta encuesta? Esta acción es irreversible.</p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            eliminarMutation.mutate(id);
                            toast.dismiss(t.id);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition"
                    >
                        Sí, eliminar
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-1 px-3 rounded transition"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        ), { duration: 5000, position: 'top-center' });
    };

    const fetchGeminiSummary = async (encuestaId, preguntaId) => {
        setLoadingGemini(prev => ({ ...prev, [preguntaId]: true }));
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/encuestas/${encuestaId}/pregunta/${preguntaId}/resumen`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setResumenGemini(prev => ({ ...prev, [preguntaId]: res.data }));
        } catch (error) {
            console.error("Error al obtener el resumen de Gemini:", error);
            toast.error("Error al obtener el resumen de la IA.");
        } finally {
            setLoadingGemini(prev => ({ ...prev, [preguntaId]: false }));
        }
    };

    if (isLoading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-gray-800 text-xl font-inter animate-pulse">Cargando encuestas...</p>
            </div>
        );
    if (isError)
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-red-600 text-xl font-inter text-center">
                    Error al cargar las encuestas.
                </p>
            </div>
        );
    if (encuestas.length === 0)
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <p className="text-gray-500 text-xl font-inter">No hay encuestas disponibles.</p>
            </div>
        );

    const renderEncuestas = (encuesta) => {
        const isExpanded = expandedCard === encuesta._id;

        return (
            <div
                key={encuesta._id}
                className={`relative bg-gray-100 text-gray-800 rounded-3xl p-6 shadow-2xl transition-all duration-300 ease-in-out font-inter transform-gpu
                     ${isExpanded ? 'scale-105' : 'hover:scale-105'}
                     flex flex-col`}
                onMouseEnter={() => setExpandedCard(encuesta._id)}
                onMouseLeave={() => setExpandedCard(null)}
                onClick={() => !isExpanded && setExpandedCard(encuesta._id)}
            >
                {isExpanded && (
                    <button
                        className="absolute top-4 right-4 p-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 z-50 transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCard(null);
                        }}
                    >
                        <FaTimes className="h-6 w-6" />
                    </button>
                )}

                <h2 className="text-3xl font-extrabold mb-2 text-blue-600">{encuesta.titulo}</h2>
                <p className="text-sm text-gray-500 mb-1">
                    Publicado: {new Date(encuesta.fechaPublicacion).toLocaleDateString()}
                </p>
                <p className="text-sm mb-4">
                    Estado:{' '}
                    <span className={`font-semibold ${encuesta.cerrada ? 'text-red-500' : 'text-green-500'}`}>
                        {encuesta.cerrada ? 'Cerrada' : 'Activa'}
                    </span>
                    {encuesta.fechaCierre && !encuesta.cerrada && (
                        <span className="ml-2 text-yellow-600">
                            (Cierre programado: {new Date(encuesta.fechaCierre).toLocaleString()})
                        </span>
                    )}
                </p>
                <p className="text-xl font-semibold mt-2">Votos totales: {encuesta.totalVotos}</p>

                {isExpanded && (
                    <div className="grow space-y-6 overflow-y-auto max-h-[80vh] pr-4 mt-4">
                        {encuesta.preguntas.length > 0 ? (
                            encuesta.preguntas.map((pregunta, index) => {
                                let dataGrafica = null;
                                let resumenPorcentaje = null;
                                if (pregunta.tipo !== 'Abierta') {
                                    resumenPorcentaje = calcularPorcentajes(pregunta.resumen || {});
                                    dataGrafica = {
                                        labels: Object.keys(resumenPorcentaje),
                                        datasets: [{
                                            label: '% de respuestas',
                                            data: Object.values(resumenPorcentaje),
                                            backgroundColor: coloresGrafica.slice(0, Object.keys(resumenPorcentaje).length),
                                            borderWidth: 1,
                                            borderColor: '#ffffff'
                                        }],
                                    };
                                }
                                const currentSummary = resumenGemini[pregunta._id];
                                return (
                                    <div key={pregunta._id || index} className="bg-white p-4 rounded-xl shadow-md space-y-3">
                                        <h3 className="font-semibold text-xl text-gray-700">{pregunta.texto}</h3>
                                        <p className="text-sm text-gray-400">Tipo: {pregunta.tipo}</p>
                                        {pregunta.tipo === 'Abierta' ? (
                                            <div className="mt-4">
                                                <h4 className="font-semibold text-lg mb-2">Resumen con IA:</h4>
                                                {currentSummary ? (
                                                    <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
                                                        <p className="text-gray-700 font-semibold mb-2">{currentSummary.resumen_general}</p>
                                                        <p className="text-sm">Sentimiento: 
                                                            <span className={`font-bold ml-1 ${
                                                                currentSummary.sentimiento_general === 'Positivo' ? 'text-green-600' :
                                                                currentSummary.sentimiento_general === 'Negativo' ? 'text-red-600' : 'text-yellow-600'
                                                            }`}>
                                                                {currentSummary.sentimiento_general}
                                                            </span>
                                                        </p>
                                                        <ul className="list-disc pl-5 mt-2 text-gray-600 text-sm">
                                                            {currentSummary.puntos_clave.map((punto, i) => (
                                                                <li key={i}>{punto}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : (
                                                    <p className="italic text-gray-500">{loadingGemini[pregunta._id] ? 'Generando resumen con IA...' : 'No se ha generado un resumen aún.'}</p>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        fetchGeminiSummary(encuesta._id, pregunta._id);
                                                    }}
                                                    className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                                                    disabled={loadingGemini[pregunta._id]}
                                                >
                                                    <FaRobot /> {loadingGemini[pregunta._id] ? 'Generando...' : 'Generar Resumen con IA'}
                                                </button>
                                            </div>
                                        ) : (
                                            dataGrafica ? (
                                                <div className="flex flex-col md:flex-row items-center gap-4">
                                                    <div className="w-full md:w-1/2 p-2 max-h-64 flex items-center justify-center">
                                                        <Doughnut data={dataGrafica} />
                                                    </div>
                                                    <div className="w-full md:w-1/2 mt-4 md:mt-0 text-sm max-h-64 overflow-y-auto pr-2">
                                                        {Object.entries(resumenPorcentaje).map(([opcion, porcentaje], i) => (
                                                            <div key={opcion} className="flex items-center mb-1">
                                                                <span className="inline-block w-3 h-3 rounded-full mr-2 shrink-0"
                                                                    style={{ backgroundColor: coloresGrafica[i % coloresGrafica.length] }}></span>
                                                                <span className="text-gray-700 wrap-break-word">{opcion}: {porcentaje}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">No hay respuestas para esta pregunta.</p>
                                            )
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500">No hay preguntas en esta encuesta.</p>
                        )}
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-3 flex-wrap">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/editar/${encuesta._id}`);
                        }}
                    >
                        <FaEdit /> Editar
                    </button>
                    <button
                        className={`${
                            encuesta.cerrada ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-500 hover:bg-yellow-600'
                        } text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition`}
                        onClick={(e) => {
                            e.stopPropagation();
                            estadoMutation.mutate({ id: encuesta._id, estado: !encuesta.cerrada });
                        }}
                        title={encuesta.cerrada ? 'Abrir encuesta' : 'Cerrar encuesta'}
                    >
                        {encuesta.cerrada ? <FaUnlock /> : <FaLock />}
                        {encuesta.cerrada ? 'Abrir' : 'Cerrar'}
                    </button>
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEliminar(encuesta._id);
                        }}
                    >
                        <FaTrashAlt /> Eliminar
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white p-4 sm:p-8 text-gray-800 font-inter pt-24">
            <Toaster position="top-center" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">PANEL RESULTADOS</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {encuestas.map(renderEncuestas)}
            </div>
        </div>
    );
};

export default AdminEncuestas;