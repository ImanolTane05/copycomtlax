/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
*/

export function sanitizeUrl(url) {
    /** Patrón que coincide con URLs seguras. */
    const SAFE_URL_PATTERN=
        /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;
    
    /** Patrón que coincide con URLs de datos seguras. */
    const DATA_URL_PATTERN=
        /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

    url=String(url).trim();

    if (url.match(SAFE_URL_PATTERN)||url.match(DATA_URL_PATTERN)) return url;

    return 'https://';
}

// Fuente: https://stackoverflow.com/a/8234912/2013580
const urlRegExp=new RegExp(
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
);
export function validateUrl(url) {
    // Tiene un problema para la UI al insertar links, no debería estar como una URL inválida por defecto como https://
    // Posible solución: mostrar dialogo donde usuario ingrese la URL antes de insertarla
    return url==='https://'||urlRegExp.test(url);
}