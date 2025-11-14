// Paso 1: Agregar un event listener al botón "buscar" para ejecutar la función cuando se haga clic
document.getElementById("buscar").addEventListener("click", () => {
    // Paso 2: Obtener el valor del input de usuario, eliminando espacios en blanco al inicio y final
    const user = document.getElementById("usuario").value.trim();
    // Paso 3: Validar que el usuario haya ingresado un nombre; si no, mostrar alerta y salir
    if (!user) return alert("Ingrese un usuario");

    // Paso 4: Mostrar mensaje de carga en el div de resultados mientras se realiza la búsqueda
    document.getElementById("resultado").innerHTML = "🔄 Buscando...";

    // Paso 5: Realizar una petición fetch a la API de GitHub para obtener datos del usuario
    fetch(`https://api.github.com/users/${user}`)
        // Paso 6: Manejar la respuesta de la API; si no es ok, lanzar error
        .then((res) => {
            if (!res.ok) throw new Error("Usuario no encontrado");
            return res.json();
        })

        // Paso 7: Procesar los datos obtenidos y actualizar el DOM con la información del usuario
        .then((data) => {
            document.getElementById("resultado").innerHTML = `
                <img src="${data.avatar_url}" alt="Avatar">
                <h2>${data.login}</h2>
                <p>👥 Seguidores: ${data.followers}</p>
                <p>📦 Repos públicos: ${data.public_repos}</p>
                <a href="${data.html_url}" target="_blank">Ver perfil</a>
            `;        
        
            let reposUrl;
            if (data.public_repos > 0) {
                reposUrl = `https://api.github.com/users/${user}/repos`;
                console.log(reposUrl);

                // Fetch the repositories, Procesar los datos obtenidos y actualizar el DOM con la información del usuario
                fetch(reposUrl)
                    .then(res => {
                        if (!res.ok) throw new Error("Error al obtener repositorios");
                        return res.json();
                    })
                    .then(repos => {
                        document.getElementById("repositorios").style.display = "block";
                        document.getElementById("lista-repos").style.display = "block";
                        const listaRepos = document.getElementById("lista-repos");
                        listaRepos.innerHTML = "";
                        repos.forEach(repo => {
                            const li = document.createElement("li");
                            li.textContent = repo.name;
                            listaRepos.appendChild(li);
                        });
                    })
                    .catch(error => {
                        document.getElementById("resultado").innerHTML += `<p>❌ Error al cargar repositorios: ${error.message}</p>`;
                    });
            }
        })      
        // Paso 8: Capturar errores y mostrar mensaje de error en el DOM
        .catch((error) => {
            document.getElementById("resultado").innerHTML = `❌ ${error.message}`;
        })
        // Paso 9: Ejecutar siempre al final, registrando en consola que la búsqueda terminó
        .finally(() => console.log("🔍 Búsqueda finalizada"));

});


