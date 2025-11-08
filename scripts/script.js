// Obtener parámetros de la URL
const params = new URLSearchParams(window.location.search);
const role = params.get("role") || "general";

// Cambiar título según el rol
const tituloElement = document.getElementById("titulo");
if (tituloElement) {
  tituloElement.textContent = `Documentos para: ${role}`;
}

// Variable global
let allDocuments = [];

// Cargar JSON
fetch("./data/data.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Error al cargar data.json: ${response.status}`);
    return response.json();
  })
  .then((data) => {
    allDocuments = data.documents.filter((doc) => doc.roles.includes(role));

    // Render inicial
    renderDocuments(allDocuments);

    // --- Insertar filtros ---
    const fasesOrden = [
      "iniciación", "ciclo-1", "seguimiento", "requerimientos",
      "planeacion", "diseño", "implementacion","pruebas","post-mortem"
    ];
    const filtrosContainer = document.createElement("div");
    filtrosContainer.className = "busqueda-filtros";

    // Caja de búsqueda
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.id = "search-box";
    searchBox.placeholder = "Buscar documentos...";

    // Select de fases
    const faseSelect = document.createElement("select");
    faseSelect.id = "fase-filter";
    faseSelect.innerHTML = `<option value="">Todas las fases</option>`;
    fasesOrden.forEach((fase) => {
      faseSelect.innerHTML += `<option value="${fase}">${fase}</option>`;
    });

    // 🆕 Select de ciclos
    const cicloSelect = document.createElement("select");
    cicloSelect.id = "ciclo-filter";
    cicloSelect.innerHTML = `
      <option value="">Todos los ciclos</option>
      <option value="1">Ciclo 1</option>
      <option value="2">Ciclo 2</option>
    `;

    // Agregar filtros al contenedor
    filtrosContainer.appendChild(searchBox);
    filtrosContainer.appendChild(faseSelect);
    filtrosContainer.appendChild(cicloSelect);

    // Insertar en header
    const header = document.getElementById("main-header");
    header.appendChild(filtrosContainer);

    // --- Filtros dinámicos ---
    function aplicarFiltros() {
      const query = searchBox.value.toLowerCase().trim();
      const faseSeleccionada = faseSelect.value;
      const cicloSeleccionado = cicloSelect.value;

      let filtered = allDocuments.filter((doc) => {
        const titulo = doc.titulo.toLowerCase();
        const version = doc.version.toString().toLowerCase();

        let etapas = "";
        if (Array.isArray(doc.etapa_de_desarrollo)) {
          etapas = doc.etapa_de_desarrollo.join(" ").toLowerCase();
        } else if (typeof doc.etapa_de_desarrollo === "string") {
          etapas = doc.etapa_de_desarrollo.toLowerCase();
        }

        const coincideBusqueda =
          query === "" ||
          titulo.includes(query) ||
          version.includes(query) ||
          etapas.includes(query);

        const coincideFase =
          faseSeleccionada === "" || etapas.includes(faseSeleccionada);

        // 🆕 Filtrado por ciclo
        const coincideCiclo =
          cicloSeleccionado === "" || doc.ciclo?.toString() === cicloSeleccionado;

        return coincideBusqueda && coincideFase && coincideCiclo;
      });

      renderDocuments(filtered);
    }

    // Escuchadores de eventos
    searchBox.addEventListener("input", aplicarFiltros);
    faseSelect.addEventListener("change", aplicarFiltros);
    cicloSelect.addEventListener("change", aplicarFiltros);

    // Si había filtros en la URL, restaurarlos
    const faseParam = params.get("fase");
    const queryParam = params.get("query");
    const cicloParam = params.get("ciclo");

    if (faseParam) faseSelect.value = faseParam;
    if (queryParam) searchBox.value = queryParam;
    if (cicloParam) cicloSelect.value = cicloParam;

    if (faseParam || queryParam || cicloParam) aplicarFiltros();
  })
  .catch((error) => {
    console.error("Error:", error);
    document.getElementById("lista").innerHTML =
      `<p style="color: red;">No se pudieron cargar los documentos.</p>`;
  });


// Renderizado de documentos
function renderDocuments(docs) {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  if (docs.length === 0) {
    lista.innerHTML = `<p>No hay documentos que coincidan con los filtros.</p>`;
    return;
  }

  const fasesOrden = [
    "iniciación", "ciclo-1", "seguimiento",
    "requerimientos", "planeacion", "diseño", "implementacion","pruebas","post-mortem"
  ];
  const grouped = {};

  docs.forEach((doc) => {
    let etapas = Array.isArray(doc.etapa_de_desarrollo)
      ? doc.etapa_de_desarrollo
      : [doc.etapa_de_desarrollo];

    etapas.forEach((etapa) => {
      if (!grouped[etapa]) grouped[etapa] = [];
      grouped[etapa].push(doc);
    });
  });

  fasesOrden.forEach((etapa) => {
    if (grouped[etapa]) {
      const section = document.createElement("div");
      section.className = "fase-section";
      section.innerHTML = `<h2>Fase: ${etapa}</h2>`;

      const container = document.createElement("div");
      container.className = "fase-container";

      grouped[etapa].forEach((doc) => {
        const card = document.createElement("div");
        card.className = `card ${doc.destacado ? "destacado" : ""}`;

        let previewLink = doc.ruta;
        let downloadLink = doc.ruta;

        // Detectar tipo de archivo
        const match = doc.ruta.match(/[-\w]{25,}/);
        if (match) {
          const fileId = match[0];
          if (doc.ruta.includes("document"))
            previewLink = `https://docs.google.com/document/d/${fileId}/preview`,
            downloadLink = `https://docs.google.com/document/d/${fileId}/export?format=pdf`;
          else if (doc.ruta.includes("spreadsheets"))
            previewLink = `https://docs.google.com/spreadsheets/d/${fileId}/preview`,
            downloadLink = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=pdf`;
          else if (doc.ruta.includes("presentation"))
            previewLink = `https://docs.google.com/presentation/d/${fileId}/preview`,
            downloadLink = `https://docs.google.com/presentation/d/${fileId}/export/pdf`;
        }

        card.innerHTML = `
          <h3>${doc.titulo}</h3>
          <p><b>Versión:</b> ${parseFloat(doc.version).toFixed(1)}</p>
          <p><b>Etapa:</b> ${
            Array.isArray(doc.etapa_de_desarrollo)
              ? doc.etapa_de_desarrollo.join(", ")
              : doc.etapa_de_desarrollo
          }</p>
          <p><b>Ciclo:</b> ${doc.ciclo || "N/A"}</p>
          <div class="botones">
            <a href="${previewLink}" target="_blank" class="btn abrir">Abrir</a>
            <a href="${downloadLink}" target="_blank" class="btn descargar">Descargar</a>
          </div>
        `;
        container.appendChild(card);
      });

      section.appendChild(container);
      lista.appendChild(section);
    }
  });
}
