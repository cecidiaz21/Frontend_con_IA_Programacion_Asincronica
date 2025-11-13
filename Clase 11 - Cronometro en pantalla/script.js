// ========== SELECCIÓN DE ELEMENTOS DEL DOM ==========
// Obtiene el elemento h1 donde se muestra el tiempo (display del cronómetro)
const display = document.getElementById('Cronómetro');
// Obtiene el botón "Iniciar" para iniciar el cronómetro
const btnIniciar = document.getElementById('iniciar');
// Obtiene el botón "Pausar" para pausar el cronómetro
const btnPausar = document.getElementById('pausar');
// Obtiene el botón "Reiniciar" para resetear el cronómetro a 00:00:00
const btnReiniciar = document.getElementById('reiniciar');

// ========== VARIABLES DE CONTROL DEL CRONÓMETRO ==========
// Variable que almacena los segundos (0-59)
let segundos = 0;
// Variable que almacena los minutos (0-59)
let minutos = 0;
// Variable que almacena las horas
let horas = 0;
// Variable que almacena el ID del intervalo (para poder pararlo con clearInterval)
let intervalo = null;
// Variable booleana que indica si el cronómetro está en marcha o no
let enMarcha = false;

// ========== FUNCIÓN: ACTUALIZAR DISPLAY ==========
// Esta función convierte el tiempo a formato HH:MM:SS y lo muestra en pantalla
function actualizarDisplay() {
    // Convierte horas a string y añade un '0' adelante si es menor a 10 (ej: 5 → '05')
    const h = horas.toString().padStart(2, '0');
    // Convierte minutos a string y añade un '0' adelante si es menor a 10
    const m = minutos.toString().padStart(2, '0');
    // Convierte segundos a string y añade un '0' adelante si es menor a 10
    const s = segundos.toString().padStart(2, '0');
    // Actualiza el contenido del elemento h1 con el formato HH:MM:SS
    display.textContent = `${h}:${m}:${s}`;
}

// ========== FUNCIÓN: ACTUALIZAR TIEMPO ==========
// Esta función aumenta el cronómetro en 1 segundo y maneja el desbordamiento de unidades
function actualizarTiempo() {
    // Incrementa los segundos en 1
    segundos++;
    // Si los segundos llegan a 60, resetea a 0 e incrementa minutos
    if (segundos === 60) {
        segundos = 0;
        minutos++;
        // Si los minutos llegan a 60, resetea a 0 e incrementa horas
        if (minutos === 60) {
            minutos = 0;
            horas++;
        }
    }
    // Actualiza la pantalla con el nuevo tiempo
    actualizarDisplay();

    // ========== DISPARADOR: AL LLEGAR A 5 SEGUNDOS ==========
    // Calcula el tiempo total en segundos: (horas × 3600) + (minutos × 60) + segundos
    const totalSegundos = horas * 3600 + minutos * 60 + segundos;
    // Si el tiempo total es exactamente 5 segundos, activa la animación y sonido
    if (totalSegundos === 5) {
        triggerFiveSeconds();
    }
}

// ========== BOTÓN: INICIAR ==========
// Añade un listener al botón "Iniciar" que se ejecuta cuando se hace clic
btnIniciar.addEventListener('click', () => {
    // Verifica que el cronómetro no esté ya en marcha
    if (!enMarcha) {
        // Crea un intervalo que ejecuta actualizarTiempo cada 1000ms (1 segundo)
        intervalo = setInterval(actualizarTiempo, 1000);
        // Marca que el cronómetro está en marcha
        enMarcha = true;
    }
});

// ========== BOTÓN: PAUSAR ==========
// Añade un listener al botón "Pausar" que se ejecuta cuando se hace clic
btnPausar.addEventListener('click', () => {
    // Detiene el intervalo del cronómetro (pausando el tiempo)
    clearInterval(intervalo);
    // Marca que el cronómetro no está en marcha
    enMarcha = false;
});

// ========== BOTÓN: REINICIAR ==========
// Añade un listener al botón "Reiniciar" que se ejecuta cuando se hace clic
btnReiniciar.addEventListener('click', () => {
    // Detiene el intervalo del cronómetro
    clearInterval(intervalo);
    // Resetea los segundos a 0
    segundos = 0;
    // Resetea los minutos a 0
    minutos = 0;
    // Resetea las horas a 0
    horas = 0;
    // Marca que el cronómetro no está en marcha
    enMarcha = false;
    // Actualiza la pantalla para mostrar 00:00:00
    actualizarDisplay();
});

// ========== FUNCIÓN: REPRODUCIR BEEP (SONIDO) ==========
// Esta función genera un beep (sonido) usando la Web Audio API (sin archivos externos)
// Parámetros: duration (duración en segundos), frequency (frecuencia en Hz), volume (volumen 0-1)
function playBeep(duration = 0.35, frequency = 880, volume = 0.1) {
    // Intenta reproducir el beep; si falla, lo captura y muestra en consola
    try {
        // Obtiene el constructor de AudioContext (compatible con navegadores antiguos con webkit)
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        // Crea un nuevo contexto de audio
        const ctx = new AudioCtx();
        // Crea un oscilador (generador de ondas de sonido)
        const oscillator = ctx.createOscillator();
        // Crea un nodo de ganancia (para controlar el volumen)
        const gainNode = ctx.createGain();

        // Establece el tipo de onda del oscilador a "sine" (onda sinusoidal, sonido suave)
        oscillator.type = 'sine';
        // Establece la frecuencia del sonido (880 Hz es un "La" en música)
        oscillator.frequency.value = frequency;

        // Establece el volumen del sonido (0-1, donde 1 es máximo)
        gainNode.gain.value = volume;

        // Conecta el oscilador al nodo de ganancia
        oscillator.connect(gainNode);
        // Conecta el nodo de ganancia al destino (altavoz/salida de audio)
        gainNode.connect(ctx.destination);

        // Inicia la reproducción del sonido
        oscillator.start();
        // Después de (duration × 1000) milisegundos, detiene el sonido
        setTimeout(() => {
            oscillator.stop();
            // Si el navegador lo permite, cierra el contexto para liberar recursos
            if (ctx.close) ctx.close();
        }, duration * 1000);
    } catch (e) {
        // Si hay un error (navegador sin Web Audio API), muestra una advertencia en la consola
        console.warn('Web Audio API no disponible para beep:', e);
    }
}

// ========== FUNCIÓN: ANIMAR DISPLAY UNA VEZ ==========
// Esta función aplica la animación CSS "pulse" al elemento h1 (display del cronómetro)
function animateDisplayOnce() {
    // Verifica que el elemento display exista en la página
    if (!display) return;
    // Primero, remueve la clase "pulse" por si acaso estaba aplicada
    display.classList.remove('pulse');
    // Accede a display.offsetWidth para forzar un reflow y reiniciar la animación CSS
    // (esto es necesario para que la animación se ejecute nuevamente si ya estaba presente)
    // eslint-disable-next-line no-unused-expressions
    display.offsetWidth;
    // Añade la clase "pulse" que activará la animación definida en CSS
    display.classList.add('pulse');
    // Después de 1 segundo (duración de la animación CSS), remueve la clase "pulse"
    // para que pueda volver a ser aplicada en el próximo disparo
    setTimeout(() => display.classList.remove('pulse'), 1000);
}

// ========== FUNCIÓN: DISPARADOR A LOS 5 SEGUNDOS ==========
// Esta función se ejecuta cuando el cronómetro llega a exactamente 5 segundos
function triggerFiveSeconds() {
    // Reproduce un beep con duración 0.35s, frecuencia 880 Hz y volumen 0.14
    playBeep(0.35, 880, 0.14);
    // Ejecuta la animación "pulse" en el display del cronómetro
    animateDisplayOnce();
}
