// frontend/src/pages/EditarEncuesta.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const EditarEncuesta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [titulo, setTitulo] = useState('');
  const [preguntas, setPreguntas] = useState([]);

  const { isLoading, isError } = useQuery({
    queryKey: ['encuesta', id],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/encuestas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: (data) => {
      setTitulo(data.titulo);
      setPreguntas(data.preguntas || []);
    },
  });

  const mutation = useMutation({
    mutationFn: async (encuestaActualizada) => {
      const token = localStorage.getItem('token');
      return axios.put(`http://localhost:5000/api/encuestas/${id}`, encuestaActualizada, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['encuestas'] });
      navigate('/admin/encuestas');
    },
    onError: (err) => {
      console.error(err);
      alert('Error al actualizar la encuesta');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ titulo, preguntas });
  };

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error al cargar la encuesta</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Encuesta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          placeholder="Título de la encuesta"
          required
        />
        {preguntas.map((pregunta, index) => (
          <div key={index} className="bg-gray-100 p-3 rounded shadow">
            <label className="block font-medium mb-1">Pregunta {index + 1}</label>
            <input
              type="text"
              value={pregunta.texto || ''}
              onChange={(e) => {
                const updated = [...preguntas];
                updated[index].texto = e.target.value;
                setPreguntas(updated);
              }}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditarEncuesta;
