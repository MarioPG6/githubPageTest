// scripts/rol.js

// Datos de ejemplo para cada líder
const rolesInfo = {
  "lider-de-equipo": {
    titulo: "Líder de Equipo",
    descripcion: "Responsable de coordinar al equipo, asignar tareas y asegurar el cumplimiento de objetivos."
  },
  "lider-de-planeacion": {
    titulo: "Líder de Planeación",
    descripcion: "Encargado de planificar las actividades y asegurar que los recursos se utilicen eficientemente."
  },
  "lider-de-calidad": {
    titulo: "Líder de Calidad",
    descripcion: "Supervisa que el trabajo cumpla con los estándares y buenas prácticas."
  },
  "lider-de-soporte": {
    titulo: "Líder de Soporte",
    descripcion: "Ofrece asistencia técnica y resuelve incidencias para el equipo."
  },
  "lider-de-desarrollo": {
    titulo: "Líder de Desarrollo",
    descripcion: "Encargado de programar, revisar código y liderar el desarrollo técnico."
  }
};

// Obtener el parámetro "role" de la URL
const params = new URLSearchParams(window.location.search);
const roleKey = params.get("role");

// Referencias a elementos del DOM
const titleEl = document.getElementById("rol-title");
const contentEl = document.getElementById("rol-content");

// Mostrar la información
if (rolesInfo[roleKey]) {
  titleEl.textContent = rolesInfo[roleKey].titulo;
  contentEl.innerHTML = `
    <p>${rolesInfo[roleKey].descripcion}</p>
    <h3>Seguimiento Semanal</h3>
    <ul>
      <li>Semana 1: Información pendiente...</li>
      <li>Semana 2: Información pendiente...</li>
    </ul>
  `;
} else {
  titleEl.textContent = "Rol no encontrado";
  contentEl.innerHTML = `<p>El rol especificado no existe.</p>`;
}
