// Selección de elementos del DOM
const display = document.getElementById('Cronómetro');
const btnIniciar = document.getElementById('iniciar');
const btnPausar = document.getElementById('pausar');
const btnReiniciar = document.getElementById('reiniciar');

let segundos = 0;
let minutos = 0;
let horas = 0;
let intervalo = null;
let enMarcha = false;

// Función para actualizar el cronómetro en pantalla
function actualizarDisplay() {
    const h = horas.toString().padStart(2, '0');
    const m = minutos.toString().padStart(2, '0');
    const s = segundos.toString().padStart(2, '0');
    display.textContent = `${h}:${m}:${s}`;
}

// Función que aumenta el tiempo
function actualizarTiempo() {
    segundos++;
    if (segundos === 60) {
        segundos = 0;
        minutos++;
        if (minutos === 60) {
            minutos = 0;
            horas++;
        }
    }
    actualizarDisplay();
}

// Botón iniciar
btnIniciar.addEventListener('click', () => {
    if (!enMarcha) {
        intervalo = setInterval(actualizarTiempo, 1000);
        enMarcha = true;
    }
});

// Botón pausar
btnPausar.addEventListener('click', () => {
    clearInterval(intervalo);
    enMarcha = false;
});

// Botón reiniciar
btnReiniciar.addEventListener('click', () => {
    clearInterval(intervalo);
    segundos = 0;
    minutos = 0;
    horas = 0;
    enMarcha = false;
    actualizarDisplay();
});
