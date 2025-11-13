FROM node:22

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json de equipo local a ubicación actual del contenedor
COPY package.json ./

# Instalar dependencias definidas en package.json
RUN npm install

# Copiar el resto del código fuente de la app del host al sistema de archivos de la imagen
COPY . .

# Informar a Docker que se utilizará el puerto 5000
EXPOSE 5000

# Ejecutar comando dentro del contenedor para iniciar la app
CMD [ "npx","nodemon","index.js" ]