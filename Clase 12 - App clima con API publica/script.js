// ============================================
// PASO 1: ALMACENAR LA CLAVE DE LA API
// ============================================
// Esta es la clave única para acceder a OpenWeatherMap
// La API verifica que sea válida antes de darnos datos
const apiKey = "7c4d9ba6991b6c43f68c62e82c590673";

// ============================================
// PASO 2: CREAR FUNCIÓN PARA MAPEAR ICONOS
// ============================================
// Esta función transforma los códigos de clima en iconos de Font Awesome
// Recibe: el código del clima de la API (ej: "01d", "10n")
// Devuelve: el nombre del icono Font Awesome correspondiente (ej: "fa-sun")
function obtenerIconoClima(descripcion, codigoIcono) {
    // Crear un objeto (diccionario) que mapea códigos con iconos
    // Clave: código de OpenWeatherMap | Valor: icono Font Awesome
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
    
    // Si encuentra el código en el mapa, devuelve el icono
    // Si NO encuentra el código, devuelve "fa-cloud" por defecto
    return iconMap[codigoIcono] || "fa-cloud";
}

// ============================================
// PASO 3: ESCUCHAR EL CLIC EN EL BOTÓN
// ============================================
// Cuando el usuario hace clic en el botón "Buscar", ejecuta esta función
// async significa que puede hacer operaciones que toman tiempo (como descargar datos)
document.getElementById("buscar").addEventListener('click', async () => {
    
    // ============================================
    // PASO 4: OBTENER EL TEXTO DEL INPUT
    // ============================================
    // Traer el valor que escribió el usuario en el input
    const ciudad = document.getElementById("ciudad").value.trim();
    
    // .trim() elimina espacios en blanco al inicio y final
    // Ejemplo: "  Madrid  " se convierte en "Madrid"
    
    // Si el usuario no escribió nada (ciudad está vacío), muestra alerta
    if (!ciudad) return alert("Ingrese una ciudad");

    // ============================================
    // PASO 5: TRY-CATCH (Manejo de errores)
    // ============================================
    // Try = intenta hacer lo siguiente
    // Catch = si hay error, ejecuta el código del catch
    try {
        // ============================================
        // PASO 6: HACER LA SOLICITUD A LA API
        // ============================================
        // fetch() descarga datos de internet
        // La URL contiene:
        //   - q=${ciudad}: la ciudad a buscar
        //   - units=metric: para obtener temperaturas en Celsius
        //   - lang=es: para obtener descripción en español
        //   - appid=${apiKey}: nuestra clave de acceso
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`
        );
        
        // ============================================
        // PASO 7: CONVERTIR RESPUESTA A JSON
        // ============================================
        // res.json() convierte la respuesta en un objeto JavaScript
        // await espera a que termine la conversión antes de continuar
        const data = await res.json();

        // ============================================
        // PASO 8: VERIFICAR SI LA CIUDAD EXISTE
        // ============================================
        // data.cod === 200 significa que la búsqueda fue exitosa
        // Si el código es distinto, la ciudad no fue encontrada
        if (data.cod !== 200) {
            // Mostrar mensaje de error en la página
            document.getElementById("resultado").innerHTML = "Ciudad no encontrada";
            return; // Detener la ejecución aquí
        }

        // ============================================
        // PASO 9: OBTENER EL ICONO CORRESPONDIENTE
        // ============================================
        // Llamar la función obtenerIconoClima() con:
        //   - data.weather[0].description: descripción del clima
        //   - data.weather[0].icon: código del clima (ej: "01d")
        // La función devuelve el nombre del icono Font Awesome
        const icono = obtenerIconoClima(data.weather[0].description, data.weather[0].icon);
        
        // ============================================
        // PASO 10: MOSTRAR LOS RESULTADOS EN HTML
        // ============================================
        // innerHTML reemplaza todo lo que hay dentro del div "resultado"
        // Los ${} permiten insertar variables dentro del texto
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
    // ============================================
    // PASO 11: CAPTURAR ERRORES
    // ============================================
    // Si algo falla en el try, ejecuta este código
    catch (error) {
        // Mostrar mensaje de error en la página
        document.getElementById("resultado").innerHTML = "Error al conectar con la API";
    }
});
