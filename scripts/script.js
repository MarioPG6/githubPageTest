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

      let previewLink = doc.ruta;
      let downloadLink = doc.ruta;

      // --- Archivos de Google Drive (PDF, imágenes, videos) ---
      if (doc.ruta.includes("drive.google.com")) {
        const match = doc.ruta.match(/[-\w]{25,}/);
        if (match) {
          const fileId = match[0];
          previewLink = `https://drive.google.com/file/d/${fileId}/preview`;
          downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      }

      // --- Documentos de Google Docs ---
      if (doc.ruta.includes("docs.google.com/document")) {
        const match = doc.ruta.match(/[-\w]{25,}/);
        if (match) {
          const fileId = match[0];
          previewLink = `https://docs.google.com/document/d/${fileId}/preview`;
          downloadLink = `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
        }
      }

      // --- Hojas de cálculo de Google Sheets ---
      if (doc.ruta.includes("docs.google.com/spreadsheets")) {
        const match = doc.ruta.match(/[-\w]{25,}/);
        if (match) {
          const fileId = match[0];
          previewLink = `https://docs.google.com/spreadsheets/d/${fileId}/preview`;
          downloadLink = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=pdf`;
        }
      }

      // --- Presentaciones de Google Slides ---
      if (doc.ruta.includes("docs.google.com/presentation")) {
        const match = doc.ruta.match(/[-\w]{25,}/);
        if (match) {
          const fileId = match[0];
          previewLink = `https://docs.google.com/presentation/d/${fileId}/preview`;
          downloadLink = `https://docs.google.com/presentation/d/${fileId}/export/pdf`;
        }
      }

      // Renderizar tarjeta
      card.innerHTML = `
        <h3>${doc.titulo}</h3>
        <p><b>Semana:</b> ${doc.semana}</p>
        <iframe src="${previewLink}" class="visor"></iframe>
        <div class="botones">
          <a href="${previewLink}" target="_blank" class="btn abrir">Abrir</a>
          <a href="${downloadLink}" target="_blank" class="btn descargar">Descargar</a>
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
