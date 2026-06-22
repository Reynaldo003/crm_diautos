// src/lib/apiCartera.js
import { getAuthToken } from "./apiAuth";

const API_ROOT = (
  import.meta.env.VITE_API_URL || "https://crmchevrolet.grupoautomotrizryr.com"
).replace(/\/$/, "");

const ENDPOINT = `${API_ROOT}/api/cartera/clientes/`;

function construirUrl(ruta = "", params = {}) {
  const baseLimpia = ENDPOINT.replace(/\/$/, "");
  const rutaLimpia = ruta.toString().replace(/^\/|\/$/g, "");
  const direccionCompleta = rutaLimpia
    ? `${baseLimpia}/${rutaLimpia}/`
    : `${baseLimpia}/`;

  const url = new URL(direccionCompleta);

  Object.entries(params).forEach(([clave, valor]) => {
    if (valor === undefined || valor === null || valor === "") return;
    url.searchParams.set(clave, String(valor));
  });

  return url.toString();
}

async function solicitar(ruta = "", params = {}, opciones = {}) {
  const token = getAuthToken();
  const method = opciones.method || "GET";
  const body = opciones.body;

  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const permiteBody = ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
  const tieneBodyValido = body !== undefined && body !== null;
  if (permiteBody && tieneBodyValido) headers["Content-Type"] = "application/json";

  const opcionesFetch = { method, credentials: "include", cache: "no-store", headers };
  if (permiteBody && tieneBodyValido) opcionesFetch.body = JSON.stringify(body);

  const response = await fetch(construirUrl(ruta, params), opcionesFetch);

  let data = null;
  try { data = await response.json(); } catch { data = null; }

  if (!response.ok) {
    const detalle =
      data?.detail ||
      data?.message ||
      data?.non_field_errors?.[0] ||
      data?.estado_gestion?.[0] ||
      data?.detalle_gestion?.[0] ||
      data?.asesor_id?.[0] ||
      "No se pudo completar la solicitud.";
    throw new Error(`${response.status} - ${detalle}`);
  }

  return data;
}

export async function obtenerAsesoresBDC(params = {}) {
  return solicitar("asesores-bdc/", params);
}

export async function obtenerCartera(params = {}) {
  return solicitar("", params);
}

export async function obtenerTodaLaCartera(params = {}) {
  return solicitar("", {
    ...params,
    page_size: params.page_size || 50,
    page: params.page || 1,
  });
}

export async function obtenerResumenCartera(params = {}) {
  return solicitar("resumen/", params);
}

export async function obtenerVentasDisponibles(params = {}) {
  return solicitar("ventas-disponibles/", params);
}

export async function previsualizarAsignacion(payload) {
  return solicitar("asignar-automatico/", {}, {
    method: "POST",
    body: { ...payload, simular: true },
  });
}

export async function asignarAutomaticamente(payload) {
  return solicitar("asignar-automatico/", {}, {
    method: "POST",
    body: { ...payload, simular: false },
  });
}


export async function actualizarEstadoGestion(id, estadoGestion, detalleGestion = "") {
  if (!id && id !== 0) {
    throw new Error("ID de cliente no válido para actualizar gestión.");
  }
  
  if (!estadoGestion || !estadoGestion.trim()) {
    throw new Error("El estado de gestión no puede estar vacío.");
  }
  return solicitar(`${id}/`, {}, {
    method: "PATCH",
    body: {
      estado_gestion: estadoGestion.trim(),
      detalle_gestion: (detalleGestion || "").trim(),
    },
  });
}

export async function crearClienteManual(payload) {
  return solicitar("crear-cliente-manual/", {}, {
    method: "POST",
    body: payload,
  });
}