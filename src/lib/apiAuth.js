// src/lib/apiAuth.js
const API_BASE =
  import.meta.env.VITE_API_URL || "https://crmchevrolet.grupoautomotrizryr.com";

const API = API_BASE.replace(/\/$/, "");

const TOKEN_KEY = "crm_chevrolet_token";
const USER_KEY = "crm_chevrolet_usuario";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession({ token, usuario }) {
  if (!token) {
    throw new Error("No se recibió un token válido del servidor.");
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(usuario || null));
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function obtenerTokenDesdeRespuesta(data) {
  if (!data || typeof data !== "object") return null;

  return data.token || data.access || data.access_token || null;
}

function obtenerUsuarioDesdeRespuesta(data) {
  if (!data || typeof data !== "object") return null;

  return data.usuario || data.user || data.data?.usuario || null;
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

async function request(path, options = {}) {
  const token = getAuthToken();

  const headers = {
    Accept: "application/json",
    ...(options.headers || {}),
  };

  const tieneBody = options.body !== undefined && options.body !== null;

  if (tieneBody && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    const text = await response.text().catch(() => "");
    data = text ? { detail: text } : null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession();

      window.dispatchEvent(new Event("crm:logout"));
    }

    const mensaje =
      data?.detail ||
      data?.message ||
      data?.non_field_errors?.[0] ||
      obtenerPrimerError(data) ||
      "Ocurrió un error en la petición.";

    throw new Error(mensaje);
  }

  return data;
}

export const authApi = {
  async login(payload) {
    const data = await request("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const token = obtenerTokenDesdeRespuesta(data);
    const usuario = obtenerUsuarioDesdeRespuesta(data);

    if (!token) {
      throw new Error("El backend no regresó un token de sesión.");
    }

    return {
      ...data,
      token,
      usuario,
    };
  },

  registro(payload) {
    return request("/api/auth/registro/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async me() {
    const data = await request("/api/auth/me/", {
      method: "GET",
    });

    const usuario = obtenerUsuarioDesdeRespuesta(data);

    return {
      ...data,
      usuario,
    };
  },
};
