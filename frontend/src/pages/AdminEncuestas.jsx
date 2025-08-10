// frontend/src/pages/AdminEncuestas.jsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FaEdit, FaTrashAlt, FaLock, FaUnlock } from 'react-icons/fa'; // Importamos iconos
import toast, { Toaster } from 'react-hot-toast'; // Importamos react-hot-toast

ChartJS.register(ArcElement, Tooltip, Legend);

const fetchEncuestas = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/encuestas/admin', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

const coloresGrafica = [
    '#2563EB', // azul
    '#F59E0B', // amarillo
    '#10B981', // verde
    '#EF4444', // rojo
    '#8B5CF6', // morado
    '#EC4899', // rosa
];

function calcularPorcentajes(resumen) {
    const total = Object.values(resumen).reduce((a, b) => a + b, 0);
    if (total === 0) return resumen;
    const porcentajes = {};
    for (const key in resumen) {
        porcentajes[key] = ((resumen[key] / total) * 100).toFixed(1);
    }
    return porcentajes;
}

const AdminEncuestas = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: encuestas = [], isLoading } = useQuery({
        queryKey: ['encuestas'],
        queryFn: fetchEncuestas,
    });

    const estadoMutation = useMutation({
        mutationFn: ({ id, estado }) => // Se corrigió la desestructuración
            axios.put(
                `http://localhost:5000/api/encuestas/${id}/estado`, { cerrada: estado },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            ),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['encuestas']);
            const mensaje = variables.estado ? 'Encuesta cerrada exitosamente.' : 'Encuesta abierta exitosamente.';
            toast.success(mensaje);
        },
        onError: (error) => {
            toast.error('Error al cambiar el estado de la encuesta.');
        },
    });

    const eliminarMutation = useMutation({
        mutationFn: (id) =>
            axios.delete(`http://localhost:5000/api/encuestas/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }),
        onSuccess: () => {
            queryClient.invalidateQueries(['encuestas']);
            toast.success('Encuesta eliminada exitosamente.');
        },
        onError: (error) => {
            toast.error('Error al eliminar la encuesta.');
        },
    });

    if (isLoading) return <div className="text-white p-6">Cargando encuestas...</div>;
    if (encuestas.length === 0)
        return <div className="text-white p-6">No hay encuestas disponibles.</div>;

    return (
        <div className="min-h-screen bg-[#1f2937] p-6 text-white">
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold">Panel de Administración</h1>
                <button
                    onClick={() => navigate('/admin/crear')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                >
                    <FaEdit />
                    Crear Encuesta
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {encuestas.map((encuesta) => (
                    <div
                        key={encuesta._id}
                        className="bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow flex flex-col justify-between"
                    >
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">{encuesta.titulo}</h2>
                            <p className="text-sm text-gray-400 mb-1">
                                Publicado: {new Date(encuesta.fechaPublicacion).toLocaleDateString()}
                            </p>
                            <p className="text-sm mb-4">
                                Estado:{' '}
                                <span
                                    className={`font-semibold ${
                                        encuesta.cerrada ? 'text-red-400' : 'text-green-400'
                                    }`}
                                >
                                    {encuesta.cerrada ? 'Cerrada' : 'Activa'}
                                </span>
                            </p>
                            {encuesta.preguntas.length > 0 ? (
                                encuesta.preguntas.map((pregunta) => {
                                    let dataGrafica = null;
                                    let resumenPorcentaje = null;
                                    if (
                                        pregunta.tipo === 'Cerrada' ||
                                        pregunta.tipo === 'Opción múltiple'
                                    ) {
                                        resumenPorcentaje = calcularPorcentajes(pregunta.resumen);
                                        dataGrafica = {
                                            labels: Object.keys(resumenPorcentaje),
                                            datasets: [
                                                {
                                                    label: '% de respuestas',
                                                    data: Object.values(resumenPorcentaje),
                                                    backgroundColor: coloresGrafica.slice(
                                                        0,
                                                        Object.keys(resumenPorcentaje).length
                                                    ),
                                                    borderWidth: 1,
                                                },
                                            ],
                                        };
                                    }
                                    return (
                                        <div key={pregunta._id} className="mb-6 bg-gray-700 p-4 rounded-xl">
                                            <h3 className="font-semibold text-lg mb-1">{pregunta.texto}</h3>
                                            <p className="mb-2 text-sm text-gray-300">
                                                Tipo: {pregunta.tipo}
                                            </p>
                                            {dataGrafica ? (
                                                <div className="flex flex-col md:flex-row items-center gap-4">
                                                    <div className="w-full md:w-1/2">
                                                        <Doughnut data={dataGrafica} />
                                                    </div>
                                                    <div className="w-full md:w-1/2 mt-4 md:mt-0">
                                                        {Object.entries(resumenPorcentaje).map(([opcion, porcentaje]) => (
                                                            <p key={opcion} className="text-sm text-gray-300">
                                                                {opcion}: {porcentaje}%
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">
                                                    Pregunta abierta, sin gráfico
                                                </p>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-400">No hay preguntas</p>
                            )}
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                                onClick={() => navigate(`/admin/editar/${encuesta._id}`)} // AQUÍ ESTÁ LA CORRECCIÓN
                            >
                                <FaEdit /> Editar
                            </button>
                            <button
                                className={`${
                                    encuesta.cerrada ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'
                                } px-4 py-2 rounded-lg font-semibold flex items-center gap-2`}
                                onClick={() => estadoMutation.mutate({ id: encuesta._id, estado: !encuesta.cerrada })}
                                title={encuesta.cerrada ? 'Abrir encuesta' : 'Cerrar encuesta'}
                            >
                                {encuesta.cerrada ? <FaUnlock /> : <FaLock />}
                                {encuesta.cerrada ? 'Abrir' : 'Cerrar'}
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
                                onClick={() => {
                                    toast((t) => (
                                        <div className="flex flex-col">
                                            <span>¿Estás seguro de eliminar esta encuesta? Esta acción es irreversible.</span>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    className="bg-red-600 text-white px-3 py-1 rounded"
                                                    onClick={() => {
                                                        eliminarMutation.mutate(encuesta._id);
                                                        toast.dismiss(t.id);
                                                    }}
                                                >
                                                    Sí, eliminar
                                                </button>
                                                <button
                                                    className="bg-gray-400 text-white px-3 py-1 rounded"
                                                    onClick={() => toast.dismiss(t.id)}
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ));
                                }}
                            >
                                <FaTrashAlt /> Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminEncuestas;