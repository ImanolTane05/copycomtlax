const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Accede a tu clave de API desde las variables de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = { genAI };