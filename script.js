document.addEventListener("DOMContentLoaded", () => {
    // Seleccionamos todos los botones del documento
    const botones = document.querySelectorAll("button");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            // Buscamos el <a> que está justo antes del botón
            const link = boton.previousElementSibling;

            if (link && link.tagName === "A" && link.getAttribute("href")) {
                window.location.href = link.getAttribute("href");
            } else {
                console.warn("No se encontró un enlace válido para este botón");
            }
        });
    });
});
