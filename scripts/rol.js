// Datos de ejemplo para cada líder con íconos
const rolesInfo = {
  "lider-de-equipo": {
    titulo: "Líder de Equipo",
    descripcion: "Responsable de coordinar al equipo, asignar tareas y asegurar el cumplimiento de objetivos.",
    icono: "icons/equipo.png"
  },
  "lider-de-planeacion": {
    titulo: "Líder de Planeación",
    descripcion: "Encargado de planificar las actividades y asegurar que los recursos se utilicen eficientemente.",
    icono: "icons/planeacion.png"
  },
  "lider-de-calidad": {
    titulo: "Líder de Calidad",
    descripcion: "Supervisa que el trabajo cumpla con los estándares y buenas prácticas.",
    icono: "icons/calidad.png"
  },
  "lider-de-soporte": {
    titulo: "Líder de Soporte",
    descripcion: "Ofrece asistencia técnica y resuelve incidencias para el equipo.",
    icono: "icons/soporte.png"
  },
  "lider-de-desarrollo": {
    titulo: "Líder de Desarrollo",
    descripcion: "Encargado de programar, revisar código y liderar el desarrollo técnico.",
    icono: "icons/desarrollo.png"
  }
};

// Obtener el parámetro "role" de la URL
const params = new URLSearchParams(window.location.search);
const roleKey = params.get("role");

// Referencias a elementos del DOM
const titleEl = document.getElementById("rol-title");
const iconEl = document.getElementById("rol-icon");
const contentEl = document.getElementById("rol-content");

// Mostrar la información
if (rolesInfo[roleKey]) {
  titleEl.textContent = rolesInfo[roleKey].titulo;
  iconEl.src = rolesInfo[roleKey].icono;
  contentEl.innerHTML = `
    <p>${rolesInfo[roleKey].descripcion}</p>
    <h3>Bitácora Semanal</h3>
    <ul></ul>

    <h3>Subir archivo</h3>
    <input type="file" id="file-input">
    <div id="file-preview"></div>
  `;
} else {
  titleEl.textContent = "Rol no encontrado";
  contentEl.innerHTML = `<p>El rol especificado no existe.</p>`;
}

// Manejo de archivos
document.addEventListener("change", function (e) {
  if (e.target.id === "file-input") {
    const file = e.target.files[0];
    const preview = document.getElementById("file-preview");
    preview.innerHTML = "";

    if (file) {
      const fileURL = URL.createObjectURL(file);

      // Previsualización
      if (file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = fileURL;
        img.width = 200;
        preview.appendChild(img);
      } else if (file.type === "application/pdf") {
        const iframe = document.createElement("iframe");
        iframe.src = fileURL;
        iframe.width = "300";
        iframe.height = "200";
        preview.appendChild(iframe);
      } else {
        const p = document.createElement("p");
        p.textContent = `Archivo: ${file.name}`;
        preview.appendChild(p);
      }

      // Botón de descarga
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = file.name;
      link.textContent = "Descargar archivo";
      link.style.display = "block";
      preview.appendChild(link);
    }
  }
});
