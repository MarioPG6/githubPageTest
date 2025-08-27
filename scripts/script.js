// Obtener parámetros de la URL
const params = new URLSearchParams(window.location.search);
const role = params.get("role") || "general";

// Cambiar título según el rol (si existe el elemento)
const tituloElement = document.getElementById("titulo");
if (tituloElement) {
  tituloElement.textContent = `Documentos para: ${role}`;
}

// Variable global para almacenar todos los documentos filtrados por rol
let allDocuments = [];

// Cargar el archivo JSON con los documentos
fetch("./data/data.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error al cargar data.json: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Filtrar por el rol que está en la URL - usar data.documents
    allDocuments = data.documents.filter(doc => doc.roles.includes(role));
    
    // Renderizar documentos iniciales
    renderDocuments(allDocuments);
    
    // Agregar listener para filtrar según la búsqueda
    const searchBox = document.getElementById("search-box");
    if (searchBox) {
      searchBox.addEventListener("input", function() {
        const query = searchBox.value.toLowerCase().trim();
        if (query === "") {
          renderDocuments(allDocuments);
        } else {
          const filtered = allDocuments.filter(doc => {
            return doc.titulo.toLowerCase().includes(query) ||
                   doc.etapa_de_desarrollo.toLowerCase().includes(query);
          });
          renderDocuments(filtered);
        }
      });
    }
  })
  .catch(error => {
    console.error("Error:", error);
    document.getElementById("lista").innerHTML = `
      <p style="color: red;">No se pudieron cargar los documentos.</p>
    `;
  });

// Función para renderizar la lista de documentos
function renderDocuments(docs) {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  
  if (docs.length === 0) {
    lista.innerHTML = `<p>No hay documentos que coincidan con la búsqueda.</p>`;
    return;
  }
  
  docs.forEach(doc => {
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
      <p><b>Versión:</b> ${parseFloat(doc.version).toFixed(1)}</p>
      <p><b>Etapa:</b> ${doc.etapa_de_desarrollo}</p>
      <iframe src="${previewLink}" class="visor"></iframe>
      <div class="botones">
        <a href="${previewLink}" target="_blank" class="btn abrir">Abrir</a>
        <a href="${downloadLink}" target="_blank" class="btn descargar">Descargar</a>
      </div>
    `;
    lista.appendChild(card);
  });
}
