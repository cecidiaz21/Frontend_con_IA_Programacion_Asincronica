
const apiKey = "7c4d9ba6991b6c43f68c62e82c590673";


function obtenerIconoClima(descripcion, codigoIcono) {
        const iconMap = {
        "01d": "fa-sun",                // Despejado de día
        "01n": "fa-moon",               // Despejado de noche
        "02d": "fa-cloud-sun",          // Pocas nubes de día
        "02n": "fa-cloud-moon",         // Pocas nubes de noche
        "03d": "fa-cloud",              // Nublado (día)
        "03n": "fa-cloud",              // Nublado (noche)
        "04d": "fa-cloud",              // Muy nublado (día)
        "04n": "fa-cloud",              // Muy nublado (noche)
        "09d": "fa-cloud-rain",         // Lluvia ligera (día)
        "09n": "fa-cloud-rain",         // Lluvia ligera (noche)
        "10d": "fa-cloud-sun-rain",     // Lluvia con sol (día)
        "10n": "fa-cloud-moon-rain",    // Lluvia con luna (noche)
        "11d": "fa-bolt",               // Tormenta/rayos (día)
        "11n": "fa-bolt",               // Tormenta/rayos (noche)
        "13d": "fa-snowflake",          // Nieve (día)
        "13n": "fa-snowflake",          // Nieve (noche)
        "50d": "fa-smog",               // Niebla/neblina (día)
        "50n": "fa-smog"                // Niebla/neblina (noche)
    };
    
    return iconMap[codigoIcono] || "fa-cloud";
}

/
document.getElementById("buscar").addEventListener('click', async () => {
    
    const ciudad = document.getElementById("ciudad").value.trim();
    if (!ciudad) return alert("Ingrese una ciudad");
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`
        );
        const data = await res.json();
        if (data.cod !== 200) {
            document.getElementById("resultado").innerHTML = "Ciudad no encontrada";
            return; // Detener la ejecución aquí
        }

        const icono = obtenerIconoClima(data.weather[0].description, data.weather[0].icon);
        
        document.getElementById("resultado").innerHTML = `
            <!-- Mostrar nombre de la ciudad y país -->
            <h2>${data.name}, ${data.sys.country}</h2>
            
            <!-- Mostrar el icono con estilos CSS inline -->
            <!-- class="fas ${icono}" aplica el icono de Font Awesome -->
            <!-- style="..." establece el tamaño, color y margen -->
            <i class="fas ${icono}" style="font-size: 80px; color: #FFD700; margin: 20px 0;"></i>
            
            <!-- Mostrar descripción del clima (ej: "Cielo despejado") -->
            <p style="font-size: 1.3em; font-weight: bold;">${data.weather[0].description}</p>
            
            <!-- Mostrar temperatura actual en Celsius -->
            <p>🌡️ Temperatura: ${data.main.temp}°C</p>
            
            <!-- Mostrar velocidad del viento en km/h -->
            <p>💨 Viento: ${data.wind.speed} km/h</p>
            
            <!-- Mostrar porcentaje de humedad -->
            <p>💧 Humedad: ${data.main.humidity}%</p>
        `;
    } 
    catch (error) {
        document.getElementById("resultado").innerHTML = "Error al conectar con la API";
    }
});
