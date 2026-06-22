// src/lib/apiAvaluos.js
import { getAuthToken } from "./apiAuth";

const API =
  import.meta.env.VITE_API_URL || "https://crmchevrolet.grupoautomotrizryr.com";

function getAuthHeader() {
  const token = getAuthToken();

  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}

function obtenerPrimerError(data) {
  if (!data || typeof data !== "object") return null;

  const primeraClave = Object.keys(data)[0];

  if (!primeraClave) return null;

  const valor = data[primeraClave];

  if (Array.isArray(valor)) return valor[0];

  if (typeof valor === "string") return valor;

  return null;
}

async function parseResponseError(res) {
  const contentType = res.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const data = await res.json();

      if (typeof data === "string") return data;

      return (
        data?.detail ||
        data?.message ||
        data?.non_field_errors?.[0] ||
        obtenerPrimerError(data) ||
        JSON.stringify(data)
      );
    }

    const text = await res.text();
    return text || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

async function http(path, { method = "GET", body, headers } = {}) {
  const finalHeaders = {
    Accept: "application/json",
    ...getAuthHeader(),
    ...(headers || {}),
  };

  const res = await fetch(`${API}${path}`, {
    method,
    headers: finalHeaders,
    body,
  });

  if (!res.ok) {
    const message = await parseResponseError(res);
    throw new Error(message);
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}

async function httpBlob(path) {
  const res = await fetch(`${API}${path}`, {
    method: "GET",
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!res.ok) {
    const message = await parseResponseError(res);
    throw new Error(message);
  }

  const blob = await res.blob();

  return new Blob([blob], {
    type: "application/pdf",
  });
}

function getFileFromEvidence(item) {
  if (!item) return null;

  if (item instanceof File || item instanceof Blob) {
    return item;
  }

  if (item.file instanceof File || item.file instanceof Blob) {
    return item.file;
  }

  return null;
}

function buildAvaluoFormData(payload = {}) {
  const formData = new FormData();

  const evidenciasNuevas = Array.isArray(payload.evidencias_nuevas)
    ? payload.evidencias_nuevas
    : [];

  const evidenciasMetadata = evidenciasNuevas.map((item) => ({
    categoria_concepto: item?.categoria_concepto || "estetico",
    costo: item?.costo || "0",
    descripcion: item?.descripcion || "",
  }));

  const evidenciasExistentes = Array.isArray(payload.evidencias_existentes)
    ? payload.evidencias_existentes
    : [];

  const deleteEvidenciaIds = Array.isArray(payload.delete_evidencia_ids)
    ? payload.delete_evidencia_ids
    : [];

  const conceptos = Array.isArray(payload.conceptos) ? payload.conceptos : [];

  const checklist100 =
    payload.checklist_100 && typeof payload.checklist_100 === "object"
      ? payload.checklist_100
      : {};

  Object.entries(payload).forEach(([key, value]) => {
    if (
      key === "evidencias_nuevas" ||
      key === "evidencias_existentes" ||
      key === "delete_evidencia_ids" ||
      key === "conceptos" ||
      key === "checklist_100"
    ) {
      return;
    }

    if (value === undefined || value === null) return;

    formData.append(key, String(value));
  });

  formData.append("conceptos_json", JSON.stringify(conceptos));
  formData.append(
    "evidencias_metadata_json",
    JSON.stringify(evidenciasMetadata),
  );
  formData.append(
    "evidencias_existentes_json",
    JSON.stringify(evidenciasExistentes),
  );
  formData.append("checklist_100_json", JSON.stringify(checklist100));

  deleteEvidenciaIds.forEach((id) => {
    if (id !== undefined && id !== null && String(id).trim() !== "") {
      formData.append("delete_evidencia_ids", String(id));
    }
  });

  evidenciasNuevas.forEach((item) => {
    const file = getFileFromEvidence(item);

    if (file) {
      formData.append("evidencias_nuevas", file);
    }
  });

  return formData;
}

export const apiAvaluos = {
  list: () => http("/usados/api/avaluos/"),

  get: (id) => http(`/usados/api/avaluos/${id}/`),

  create: (payload) =>
    http("/usados/api/avaluos/", {
      method: "POST",
      body: buildAvaluoFormData(payload),
    }),

  update: (id, payload) =>
    http(`/usados/api/avaluos/${id}/`, {
      method: "PUT",
      body: buildAvaluoFormData(payload),
    }),

  patch: (id, payload) =>
    http(`/usados/api/avaluos/${id}/`, {
      method: "PATCH",
      body: buildAvaluoFormData(payload),
    }),

  marcarTecnicoFinalizado: (id) =>
    http(`/usados/api/avaluos/${id}/tecnico-finalizado/`, {
      method: "PATCH",
    }),

  marcarValuacionTerminada: (id) =>
    http(`/usados/api/avaluos/${id}/valuacion-terminada/`, {
      method: "PATCH",
    }),

  ticketPdf: (id) => httpBlob(`/usados/api/avaluos/${id}/ticket-pdf/`),

  checklistPdf: (id) => httpBlob(`/usados/api/avaluos/${id}/checklist-pdf/`),

  remove: (id) =>
    http(`/usados/api/avaluos/${id}/`, {
      method: "DELETE",
    }),
};

export default apiAvaluos;
