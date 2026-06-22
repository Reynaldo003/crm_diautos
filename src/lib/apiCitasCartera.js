// src/lib/apiCitasCartera.js
import { clearAuthSession, getAuthToken } from "./apiAuth";

const API_ROOT = (
    import.meta.env.VITE_API_URL || "https://crmchevrolet.grupoautomotrizryr.com"
).replace(/\/$/, "");


const ENDPOINT = `${API_ROOT}/citas/api/citas/`;



function construirUrl(ruta = "", params = {}) {
    
    const rutaLimpia = ruta.replace(/^\//, "");
    

    const urlObjeto = new URL(`${ENDPOINT}${rutaLimpia}`);

    
    Object.entries(params).forEach(([clave, valor]) => {
        if (valor === undefined || valor === null || valor === "") return;
        urlObjeto.searchParams.set(clave, String(valor));
    });

    return urlObjeto.toString();
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

async function solicitar(ruta = "", params = {}, opciones = {}) {
    const token = getAuthToken();
    const method = opciones.method || "GET";
    const body = opciones.body;

    const headers = {
        Accept: "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (body !== undefined && body !== null) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(construirUrl(ruta, params), {
        method,
        credentials: "include",
        cache: "no-store",
        headers,
        body: body !== undefined && body !== null ? JSON.stringify(body) : undefined,
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

        const detalle =
            data?.detail ||
            data?.message ||
            data?.non_field_errors?.[0] ||
            obtenerPrimerError(data) ||
            "No se pudo completar la solicitud.";

        throw new Error(`${response.status} - ${detalle}`);
    }

    return data;
}

export async function obtenerCitas(params = {}) {
    return solicitar("", params);
}

export async function crearCita(payload) {
    return solicitar(
        "",
        {},
        {
            method: "POST",
            body: payload,
        },
    );
}

export async function actualizarCita(id, payload) {
    return solicitar(
        `${id}/`,
        {},
        {
            method: "PATCH",
            body: payload,
        },
    );
}

export async function eliminarCita(id) {
    return solicitar(
        `${id}/`,
        {},
        {
            method: "DELETE",
        },
    );
}