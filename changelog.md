# Historial de cambios

Los cambios realizados en el proyecto se registrarán en este archivo.

## [2025.12.1.2]
* Creado el estilo para un icono de carga (de momento solo utilizado en el módulo de noticias)
* Creado un componente de botón para luego homogeneizar el estilo de botones de acción en la página

## [2025.12.1.1]
* Añadidas las fechas de publicación y edición en los detalles de una noticia
* Modificado el diseño del texto de introducción en detalles de noticia para consistencia con la app móvil
* Modificadas tarjetas de noticias para limitar la cantidad de renglones del texto introductorio a 3, y colocar elipsis cuando el texto supere el límite (vía webkit)
* Actualizadas sintaxis de classNames en varias páginas y componentes a las recomendadas por Tailwind 4

## [2025.11.27.1]
* Movido paquete expo-server-sdk a backend en vez de en raíz
* Creados comandos para ejecutar previews del entorno de producción del frontend

## [2025.11.25.1]
* Eliminadas importaciones no utilizadas en componentes del editor de texto
* Cambiadas direcciones del backend utilizadas en el frontend por una variable de entorno

## [2025.11.24.1]
* Añadido y configurado el paquete react-plugin-pwa en entorno de desarrollo para convertir página en App Web Progresiva
* Creados comandos en los package.json de frontend y raíz para ejecutar todo el entorno de producción en un solo comando
* Actualizado README.md para describir el uso del proyecto en contenedores y probar el entorno de producción

## [2025.11.13.1]
* Agregados Dockerfiles y docker-compose.yml