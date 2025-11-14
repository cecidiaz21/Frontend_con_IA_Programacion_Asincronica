// Obtener la referencia al elemento <ul> (o contenedor) donde mostraremos las notas
const listaNotas = document.getElementById("listaNotas");

// Cargar las notas desde localStorage (si existen).
// JSON.parse convierte la cadena guardada en un array; si no hay nada, usamos [] por defecto.
// Ahora cada nota es un objeto con propiedades: {texto, fecha}
let notas = JSON.parse(localStorage.getItem("notas")) || [];

// Función que renderiza las notas en la página
function mostrarNotas() {
    // Limpiamos el contenido actual para volver a dibujar la lista completa
    listaNotas.innerHTML = "";

    // Recorremos cada nota y creamos un <li> para mostrarla con 3 columnas
    notas.forEach((nota, i) => {
        // Crear un elemento de lista
        const li = document.createElement("li");

        // COLUMNA 1: Crear un contenedor para el texto de la nota
        const textoDiv = document.createElement("div");
        textoDiv.className = "nota-texto";
        textoDiv.textContent = nota.texto;

        // COLUMNA 2: Crear un contenedor para la fecha
        const fechaDiv = document.createElement("div");
        fechaDiv.className = "nota-fecha";
        fechaDiv.textContent = `📅 ${nota.fecha}`;
        
        // Cómo se hace manualmente:
        // Copias el emoji 📅 directamente del teclado o de un sitio como emojipedia.org
        // Lo pegas en el código como texto plano
        // Lo concatenas con la variable usando backticks y ${}

        // COLUMNA 3: Crear un contenedor para el botón eliminar
        const eliminarDiv = document.createElement("div");
        eliminarDiv.className = "nota-eliminar";

        // Crear el botón individual para eliminar esta nota específica
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "❌ Eliminar";

        // Agregar evento click al botón de eliminar
        btnEliminar.addEventListener("click", () => {
            // Eliminar la nota del array en la posición 'i'
            notas.splice(i, 1);

            // Guardar el array actualizado en localStorage
            localStorage.setItem("notas", JSON.stringify(notas));

            // Volver a renderizar la lista
            mostrarNotas();
        });

        // Añadir el botón al contenedor de eliminar
        eliminarDiv.appendChild(btnEliminar);

        // Añadir las 3 columnas al <li>
        li.appendChild(textoDiv);
        li.appendChild(fechaDiv);
        li.appendChild(eliminarDiv);

        // Añadir el <li> al contenedor de la lista
        listaNotas.appendChild(li);
    });
}

// Añadir un listener al botón 'guardar' para capturar la acción de guardar una nota
document.getElementById("guardar").addEventListener("click", () => {
    // Tomar el valor del campo de texto (input/textarea) y quitar espacios sobrantes
    const nota = document.getElementById("nota").value.trim();

    // Si el campo no está vacío, procedemos a guardar la nota
    if (nota) {
        // Obtener la fecha y hora actual en formato legible
        const ahora = new Date();
        const fecha = ahora.toLocaleString("es-ES"); // Ej: "14/11/2025, 10:30:45"

        // Crear un objeto con la nota y su fecha
        const notaObj = {
            texto: nota,
            fecha: fecha
        };

        // Añadir el objeto de nota al array en memoria
        notas.push(notaObj);

        // Guardar el array actualizado en localStorage como cadena JSON
        localStorage.setItem("notas", JSON.stringify(notas));

        // Volver a renderizar las notas para que la nueva aparezca en la lista
        mostrarNotas();

        // Limpiar el campo de entrada para dejarlo listo para una nueva nota
        document.getElementById("nota").value = "";
    }
});

// Añadir un listener al botón 'borrar' para eliminar todas las notas
document.getElementById("borrar").addEventListener("click", () => {
    // Eliminar la clave 'notas' de localStorage
    localStorage.removeItem("notas");

    // Vaciar el array en memoria para mantener el estado coherente con localStorage
    notas = [];

    // Volver a renderizar (ahora la lista quedará vacía)
    mostrarNotas();
});