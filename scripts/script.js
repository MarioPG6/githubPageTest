// Obtener parámetros de la URL
const params = new URLSearchParams(window.location.search);
const role = params.get("role") || "general";

// Cambiar título según el rol
document.getElementById("titulo").textContent = `Documentos para: ${role}`;

// Cargar el archivo JSON con los documentos
fetch("data/data.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al cargar data.json: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Filtrar por el rol que está en la URL
    const filtrados = data.filter(doc => doc.roles.includes(role));

    // Si no hay resultados
    if (filtrados.length === 0) {
      document.getElementById("lista").innerHTML = `
        <p>No hay documentos disponibles para este rol.</p>
      `;
      return;
    }

    // Renderizar cada documento
    filtrados.forEach(doc => {
      const card = document.createElement("div");
      card.className = `card ${doc.destacado ? "destacado" : ""}`;
      card.innerHTML = `
        <h3>${doc.titulo}</h3>
        <p><b>Semana:</b> ${doc.semana}</p>
        <iframe src="${doc.ruta}" class="visor"></iframe>
        <div class="botones">
          <a href="${doc.ruta}" target="_blank" class="btn abrir">Abrir</a>
          <a href="${doc.ruta}" download class="btn descargar">Descargar</a>
        </div>
      `;
      document.getElementById("lista").appendChild(card);
    });
  })
  .catch(error => {
    console.error("Error:", error);
    document.getElementById("lista").innerHTML = `
      <p style="color: red;">No se pudieron cargar los documentos.</p>
    `;
  });
