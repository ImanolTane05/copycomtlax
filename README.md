# Sitio web para Colegio de Periodistas y Comunicadores de Tlaxcala A.C.

Este proyecto está basado en la pila MERN (MongoDB, ExpressJS, React, Node.js).

## Instalación de paquetes
Desde la carpeta raíz, usar:
### `npm i`

## Ejecución
Se puede activar todo el entorno con el siguiente comando, desde la raíz del proyecto:

### `npm run start:all`

Alternativamente, se puede activar el backend y el frontend por separado desde la raíz del proyecto con:

### Backend: `npm run start:backend`
### Frontend: `npm run start:frontend`

## Ejecutar el frontend de producción
Activar todo el entorno con el siguiente comando, desde la raíz del proyecto:

### `npm run start:production`

Alternativamente, puede iniciarse únicamente el frontend con `npm run build-and-serve:frontend`.

De manera manual, los artefactos de construcción del frontend se pueden crear desde la carpeta de frontend con `npm run build`, y posteriormente ejecutar este entorno con `npm run serve`. Alternativamente, pueden ejecutarse ambos con `npm run build-and-serve`.

## Ejecución en contenedores
Este proyecto puede ejecutarse en contenedores para aislar los entornos de cada servicio.
Los contenedores se pueden ejecutar desde el directorio raíz con `docker-compose build` y `docker-compose up` (o `docker-compose up -d para ejecutar en segundo plano`).
La imagen del frontend puede configurarse desde el Dockerfile de la carpeta frontend para cambiar entre el entorno de desarrollo y un entorno con nginx para producción. Ambas configuraciones se encuentran en el archivo, y puede comentarse una o la otra para construir según el entorno deseado.