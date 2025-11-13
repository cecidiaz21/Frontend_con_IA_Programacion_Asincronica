// Define la clave de API para acceder a OpenWeatherMap
const apiKey = "7c4d9ba6991b6c43f68c62e82c590673";

// Agrega un event listener al botón con id "buscar" para ejecutar la función cuando se haga clic
document.getElementById("buscar").addEventListener('click', async () => {
    // Obtiene el valor del input con id "ciudad", elimina espacios en blanco al inicio y final
    const ciudad = document.getElementById("ciudad").value.trim();
    // Si no se ingresó una ciudad, muestra una alerta y detiene la ejecución
    if (!ciudad) return alert("Ingrese una ciudad");

    // Inicia un bloque try-catch para manejar errores en la solicitud
    try {
        // Realiza una solicitud fetch a la API de OpenWeatherMap con la ciudad, unidades métricas, idioma español y la clave API
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&units=metric&lang=es&appid=${apiKey}`
        );
        // Convierte la respuesta en formato JSON
        const data = await res.json();

        // Si el código de respuesta no es 200 (éxito), muestra un mensaje de error y detiene la ejecución
        if (data.cod !== 200) {
            document.getElementById("resultado").innerHTML = "Ciudad no encontrada";
            return;
        }

        // Actualiza el contenido del elemento con id "resultado" con la información del clima obtenida
        document.getElementById("resultado").innerHTML = `
            <h2>${data.name}, ${data.sys.country}</h2>
            <p>Temp: ${data.main.temp}°C</p>
            <p>Viento: ${data.wind.speed} km/h</p>
            <p>Clima: ${data.weather[0].description}</p>
        `;
    // En caso de error en la solicitud, muestra un mensaje de error
    } catch (error) {
        document.getElementById("resultado").innerHTML = "Error al conectar con la API";
    }
});
