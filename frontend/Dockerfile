# Imagen oficial de Node.js como parent
# Description: Dockerfile para la parte del frontend
FROM node:22

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json de equipo local a ubicación actual del contenedor
COPY package.json ./

# Instalar dependencias definidas en package.json
RUN npm install

# Copiar el resto del código fuente de la app desde el host al sistema de archivos de la imagen
COPY . .

### PARA USAR EN MODO COMPILACIÓN
# # Crear los artefactos de build de React
# RUN npm run build

# FROM nginx:alpine

# COPY --from=builder /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD [ "nginx","-g","daemon off;"]



### PARA USAR EN MODO DESARROLLO
# Informar a Docker que se utilizará el puerto 5173
EXPOSE 5173

# Ejecutar comando específico dentro del contenedor para iniciar la app (modo desarrollador)
CMD [ "npm","run","start" ]