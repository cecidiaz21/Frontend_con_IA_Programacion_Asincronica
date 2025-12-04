document.getElementById("buscar").addEventListener("click", () => {
    const user = document.getElementById("usuario").value.trim();
    if (!user) return alert("Ingrese un usuario");
    document.getElementById("resultado").innerHTML = "🔄 Buscando...";
    fetch(`https://api.github.com/users/${user}`)
        .then((res) => {
            if (!res.ok) throw new Error("Usuario no encontrado");
            return res.json();
        })
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
        .catch((error) => {
            document.getElementById("resultado").innerHTML = `❌ ${error.message}`;
        })
        .finally(() => console.log("🔍 Búsqueda finalizada"));

});


