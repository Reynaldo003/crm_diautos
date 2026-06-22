// src/lib/apiServicio.js

const API_BASE =
  import.meta.env.VITE_API_URL || "https://crmchevrolet.grupoautomotrizryr.com";

const API = API_BASE.replace(/\/$/, "");

const ENDPOINT = "/encuestas/api/encuestas-servicio/";

async function leerError(res) {
  const contentType = res.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const data = await res.json();

      if (typeof data === "string") return data;
      if (data.detail) return data.detail;
      if (data.message) return data.message;

      return JSON.stringify(data);
    }

    return await res.text();
  } catch {
    return `HTTP ${res.status}`;
  }
}

async function http(path, { method = "GET", body, headers } = {}) {
  const finalHeaders = {
    Accept: "application/json",
    ...(headers || {}),
  };

  let finalBody = body;

  const esFormData = body instanceof FormData;
  const esObjetoJson = body && typeof body === "object" && !esFormData;

  if (esObjetoJson) {
    finalHeaders["Content-Type"] = "application/json";
    finalBody = JSON.stringify(body);
  }

  const res = await fetch(`${API}${path}`, {
    method,
    headers: finalHeaders,
    body: finalBody,
  });

  if (!res.ok) {
    const mensaje = await leerError(res);
    throw new Error(mensaje || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}

function normalizarLista(data) {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.results)) return data.results;

  return [];
}

export const apiServicio = {
  list: async () => {
    const data = await http(ENDPOINT);
    return normalizarLista(data);
  },

  get: (id) => {
    return http(`${ENDPOINT}${id}/`);
  },
};
