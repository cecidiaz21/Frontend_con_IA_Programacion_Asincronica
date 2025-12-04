// ========== SELECCIÓN DE ELEMENTOS DEL DOM ==========
const display = document.getElementById("Cronómetro");
const btnIniciar = document.getElementById("iniciar");
const btnPausar = document.getElementById("pausar");
const btnReiniciar = document.getElementById("reiniciar");

let segundos = 0;
let minutos = 0;
let horas = 0;
let intervalo = null;
let enMarcha = false;

function actualizarDisplay() {
  const h = horas.toString().padStart(2, "0");
  const m = minutos.toString().padStart(2, "0");
  const s = segundos.toString().padStart(2, "0");
  display.textContent = `${h}:${m}:${s}`;
}
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
  const totalSegundos = horas * 3600 + minutos * 60 + segundos;
  if (totalSegundos === 5) {
    triggerFiveSeconds();
  }
}

btnIniciar.addEventListener("click", () => {
  if (!enMarcha) {
    intervalo = setInterval(actualizarTiempo, 1000);
    enMarcha = true;
  }
});

btnPausar.addEventListener("click", () => {
  clearInterval(intervalo);
  enMarcha = false;
});

btnReiniciar.addEventListener("click", () => {
  clearInterval(intervalo);
  segundos = 0;
  minutos = 0;
  horas = 0;
  enMarcha = false;
  actualizarDisplay();
});

function playBeep(duration = 0.35, frequency = 880, volume = 0.1) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      if (ctx.close) ctx.close();
    }, duration * 1000);
  } catch (e) {
    console.warn("Web Audio API no disponible para beep:", e);
  }
}

function animateDisplayOnce() {
  if (!display) return;
  display.classList.remove("pulse");
  display.offsetWidth;
  display.classList.add("pulse");
  setTimeout(() => display.classList.remove("pulse"), 1000);
}

function triggerFiveSeconds() {
  playBeep(0.35, 880, 0.14);
  animateDisplayOnce();
}
