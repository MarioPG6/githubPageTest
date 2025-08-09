document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role") || "general";

    try {
        const res = await fetch("data/data.json");
        const docs = await res.json();

        const lista = document.getElementById("lista");
        const titulo = document.getElementById("titulo");

        // Cambia el título dinámicamente según el rol
        titulo.textContent = `Documentos - ${role.replace(/-/g, " ")}`;

        // Filtrar documentos por rol o general
        docs
            .filter(doc => doc.roles.includes(role) || doc.roles.includes("general"))
            .forEach(doc => {
                const card = document.createElement("div");
                card.classList.add("card");
                if (doc.destacado) card.classList.add("destacado");

                card.innerHTML = `
                    <h3>${doc.titulo}</h3>
                    <p><b>Semana:</b> ${doc.semana}</p>
                    <p><b>Fecha:</b> ${doc.fecha}</p>
                    <iframe src="${doc.ruta}"></iframe>
                `;

                lista.appendChild(card);
            });

    } catch (error) {
        console.error("Error cargando documentos:", error);
    }
});
