const UserToken = require('../models/UserToken');
// No es necesario importar Expo aquí, se importará en el pushService

// @route   POST /api/tokens/register
// @desc    Registra el token de Expo Push del dispositivo.
// @access  Public
exports.registerToken = async (req, res) => {
    // El token viene en el cuerpo de la petición.
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ msg: 'Se requiere el token de Expo.' });
    }

    try {
        // Busca si el token ya existe
        let userToken = await UserToken.findOne({ token });

        if (userToken) {
            // Si existe, simplemente lo confirma y retorna para no duplicar
            return res.status(200).json({ msg: 'Token ya registrado.' });
        }

        // Si no existe, crea un nuevo registro
        userToken = new UserToken({ token });
        await userToken.save();

        res.status(201).json({ msg: 'Token registrado exitosamente.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor al registrar el token.');
    }
};

// Nota: No se requiere una función getAllTokens aquí. Se integrará en un servicio de push.