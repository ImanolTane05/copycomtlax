// ...mantener importaciones

const CrearEncuesta = () => {
  const [titulo, setTitulo] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [nuevaPregunta, setNuevaPregunta] = useState({ tipo: '', texto: '', opciones: [''] });

  const tipos = ['Abierta', 'Cerrada', 'Opción múltiple'];

  const agregarPregunta = () => {
    if (!nuevaPregunta.texto || !nuevaPregunta.tipo) return alert('Completa todos los campos');
    setPreguntas([...preguntas, nuevaPregunta]);
    setNuevaPregunta({ tipo: '', texto: '', opciones: [''] });
    setMostrarPopup(false);
  };

  const eliminarPregunta = (index) => {
    const actualizadas = [...preguntas];
    actualizadas.splice(index, 1);
    setPreguntas(actualizadas);
  };

  const guardarEncuesta = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/encuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ titulo, preguntas })
      });
      if (!res.ok) throw new Error('Fallo en guardar encuesta');
      alert('✅ Encuesta guardada correctamente');
      setTitulo('');
      setPreguntas([]);
    } catch (err) {
      console.error(err);
      alert('❌ Error al guardar la encuesta');
    }
  };

  const renderPopup = () => (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Agregar nueva pregunta</h3>

        <label className="block mb-2 font-semibold">Tipo de pregunta:</label>
        <select
          className="w-full mb-4 p-2 border rounded"
          value={nuevaPregunta.tipo}
          onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, tipo: e.target.value })}
        >
          <option value="">Seleccione</option>
          {tipos.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>

        <label className="block mb-2 font-semibold">Texto de la pregunta:</label>
        <input
          className="w-full mb-4 p-2 border rounded"
          type="text"
          value={nuevaPregunta.texto}
          onChange={(e) => setNuevaPregunta({ ...nuevaPregunta, texto: e.target.value })}
        />

        {['Opción múltiple', 'Cerrada'].includes(nuevaPregunta.tipo) && (
          <>
            <label className="block mb-2 font-semibold">Opciones:</label>
            {nuevaPregunta.opciones.map((op, i) => (
              <input
                key={i}
                className="w-full mb-2 p-2 border rounded"
                type="text"
                value={op}
                onChange={(e) => {
                  const nuevasOpciones = [...nuevaPregunta.opciones];
                  nuevasOpciones[i] = e.target.value;
                  setNuevaPregunta({ ...nuevaPregunta, opciones: nuevasOpciones });
                }}
              />
            ))}
            <button
              type="button"
              className="bg-blue-600 text-white px-3 py-1 rounded mb-4"
              onClick={() =>
                setNuevaPregunta({ ...nuevaPregunta, opciones: [...nuevaPregunta.opciones, ''] })
              }
            >
              + Agregar opción
            </button>
          </>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={agregarPregunta}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Guardar pregunta
          </button>
          <button
            onClick={() => setMostrarPopup(false)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Crear nueva encuesta</h2>

      <label className="block mb-2 font-semibold">Título de la encuesta:</label>
      <input
        className="w-full mb-4 p-2 border rounded"
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <button
        onClick={() => setMostrarPopup(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-6"
      >
        + Agregar pregunta
      </button>

      {preguntas.map((preg, i) => (
        <div key={i} className="mb-4 p-4 border rounded bg-gray-100">
          <strong>{preg.tipo}:</strong> {preg.texto}
          {preg.opciones?.length > 0 && (
            <ul className="list-disc ml-5 mt-2">
              {preg.opciones.map((op, j) => <li key={j}>{op}</li>)}
            </ul>
          )}
          <div className="flex justify-end space-x-2 mt-2">
            <button
              className="text-sm bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => eliminarPregunta(i)}
            >
              🗑 Eliminar
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={guardarEncuesta}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold"
      >
        📝 Guardar Encuesta
      </button>

      {mostrarPopup && renderPopup()}
    </div>
  );
};

export default CrearEncuesta;
