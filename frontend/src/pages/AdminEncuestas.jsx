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

// Función para convertir conteos a porcentajes con 1 decimal
function calcularPorcentajes(resumen) {
  const total = Object.values(resumen).reduce((a, b) => a + b, 0);
  if (total === 0) return resumen; // evitar división por cero
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

  const cerrarMutation = useMutation({
    mutationFn: (id) =>
      axios.put(
        `http://localhost:5000/api/encuestas/cerrar/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      ),
    onSuccess: () => queryClient.invalidateQueries(['encuestas']),
  });

  const eliminarMutation = useMutation({
    mutationFn: (id) =>
      axios.delete(`http://localhost:5000/api/encuestas/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
    onSuccess: () => queryClient.invalidateQueries(['encuestas']),
  });

  if (isLoading) return <div className="text-white">Cargando encuestas...</div>;

  if (encuestas.length === 0)
    return <div className="text-white">No hay encuestas disponibles.</div>;

  return (
    <div className="min-h-screen bg-[#1f2937] p-6 text-white">
      <h1 className="text-4xl font-extrabold mb-8">Encuestas - Panel Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {encuestas.map((encuesta) => (
          <div
            key={encuesta._id}
            className="bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between"
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
                    <div key={pregunta._id} className="mb-6">
                      <h3 className="font-semibold mb-1">{pregunta.texto}</h3>
                      <p className="mb-2 text-sm text-gray-300">
                        Tipo: {pregunta.tipo}
                      </p>
                      {dataGrafica ? (
                        <>
                          <Doughnut data={dataGrafica} />
                          <div className="mt-2">
                            {Object.entries(resumenPorcentaje).map(([opcion, porcentaje]) => (
                              <p key={opcion} className="text-sm text-gray-300">
                                {opcion}: {porcentaje}%
                              </p>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          Pregunta abierta, sin gráfico
                        </p>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No hay preguntas</p>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
                onClick={() => navigate(`/admin/editar/${encuesta._id}`)} // Aquí corregido
              >
                Editar
              </button>
              <button
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-semibold"
                onClick={() => cerrarMutation.mutate(encuesta._id)}
                disabled={encuesta.cerrada}
                title={encuesta.cerrada ? 'Encuesta ya está cerrada' : 'Cerrar encuesta'}
              >
                Cerrar
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
                onClick={() => {
                  if (
                    window.confirm('¿Estás seguro de eliminar esta encuesta? Esta acción no se puede deshacer.')
                  ) {
                    eliminarMutation.mutate(encuesta._id);
                  }
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEncuestas;
