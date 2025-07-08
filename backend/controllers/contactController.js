const handleContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    console.log('Mensaje de contacto recibido:', { name, email, message });
    return res.status(200).json({ message: 'Mensaje recibido (solo consola por ahora).' });
};

module.exports = {
    handleContactForm
};