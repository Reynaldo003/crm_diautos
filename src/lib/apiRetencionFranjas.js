//src/lib/apiRetencionFranjas.js
const API_ROOT = "https://crmchevrolet.grupoautomotrizryr.com";
const ENDPOINT = `${API_ROOT}/api/ordenes-servicio-ventas/`;

function construirUrl(ruta = "", params = {}) {
  const url = new URL(ruta, ENDPOINT);

  Object.entries(params).forEach(([clave, valor]) => {
    if (valor === undefined || valor === null || valor === "") return;
    url.searchParams.set(clave, String(valor));
  });

  return url.toString();
}

async function solicitar(ruta = "", params = {}, opciones = {}) {
  const method = opciones.method || "GET";
  const body = opciones.body;

  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined && body !== null) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(construirUrl(ruta, params), {
    method,
    credentials: "include",
    headers,
    body:
      body !== undefined && body !== null ? JSON.stringify(body) : undefined,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const detalle =
      data?.detail ||
      data?.message ||
      data?.comentario?.[0] ||
      "No se pudo completar la solicitud.";
    throw new Error(`${response.status} - ${detalle}`);
  }

  return data;
}

function limpiarTexto(valor) {
  if (valor === null || valor === undefined) return "";
  return String(valor).trim();
}

function limpiarNumero(valor) {
  if (valor === "" || valor === null || valor === undefined) return "";
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero : "";
}

function obtenerLookupComparacion(operador) {
  if (operador === "mayor") return "gt";
  if (operador === "menor") return "lt";
  if (operador === "igual") return "exact";
  return "";
}

export function construirFiltrosRetencion({
  nombre = "",
  vin = "",
  celular = "",
  email = "",
  mesesDesde = "",
  mesesHasta = "",
  prioridadProspeccion = "",
  operadorDiasIngreso = "",
  valorDiasIngreso = "",
  operadorMesesVenta = "",
  valorMesesVenta = "",
  ordering = "-dias_os_a_actual",
  page = 1,
  page_size = 500,
} = {}) {
  const nombreLimpio = limpiarTexto(nombre);
  const vinLimpio = limpiarTexto(vin);
  const celularLimpio = limpiarTexto(celular);
  const emailLimpio = limpiarTexto(email);
  const prioridadLimpia = limpiarTexto(prioridadProspeccion);

  const diasValor = limpiarNumero(valorDiasIngreso);
  const mesesVentaValor = limpiarNumero(valorMesesVenta);

  const lookupDias = obtenerLookupComparacion(operadorDiasIngreso);
  const lookupMesesVenta = obtenerLookupComparacion(operadorMesesVenta);

  const params = {
    ordering,
    page,
    page_size,

    meses_desde: mesesDesde,
    meses_hasta: mesesHasta,
    mesesDesde,
    mesesHasta,

    nombre_cte: nombreLimpio,
    numero_serie: vinLimpio,
    celular: celularLimpio,
    email: emailLimpio,

    nombre: nombreLimpio,
    vin: vinLimpio,
    prioridad_prospeccion: prioridadLimpia,
    prioridadProspeccion: prioridadLimpia,
  };

  if (nombreLimpio) {
    params["nombre_cte__icontains"] = nombreLimpio;
    params["nombre__icontains"] = nombreLimpio;
  }

  if (vinLimpio) {
    params["numero_serie__icontains"] = vinLimpio;
    params["vin__icontains"] = vinLimpio;
  }

  if (celularLimpio) {
    params["celular__icontains"] = celularLimpio;
  }

  if (emailLimpio) {
    params["email__icontains"] = emailLimpio;
  }

  if (prioridadLimpia) {
    params["prioridad_prospeccion__iexact"] = prioridadLimpia;
  }

  if (operadorDiasIngreso && diasValor !== "") {
    params.dias_operador = operadorDiasIngreso;
    params.dias_valor = diasValor;
    params.operadorDiasIngreso = operadorDiasIngreso;
    params.valorDiasIngreso = diasValor;
  }

  if (operadorMesesVenta && mesesVentaValor !== "") {
    params.meses_venta_operador = operadorMesesVenta;
    params.meses_venta_valor = mesesVentaValor;
    params.operadorMesesVenta = operadorMesesVenta;
    params.valorMesesVenta = mesesVentaValor;
  }

  if (lookupDias && diasValor !== "") {
    params[`dias_os_a_actual__${lookupDias}`] = diasValor;
  }

  if (lookupMesesVenta && mesesVentaValor !== "") {
    params[`meses_actual_a_venta__${lookupMesesVenta}`] = mesesVentaValor;
  }

  return params;
}

function mapearCliente(item = {}) {
  return {
    id: item.id,
    franja: item.franja_retencion || "",
    mesesVenta: item.meses_actual_a_venta,
    dias: item.dias_os_a_actual,
    prioridadProspeccion: item.prioridad_prospeccion || "",
    estatus: item.estado_cliente || "",
    email: item.email || "",
    nombre: item.nombre_cte || "",
    vin: item.numero_serie || "",
    anio: item.ano_modelo,
    version: item.version || "",
    kilometraje: item.kilometraje || "",
    celular: item.celular || "",
    telefono: item.telefono || "",
    registroOriginal: item,
  };
}

export function obtenerNombreModelo(version = "") {
  const texto = String(version || "").trim();
  if (!texto) return "Sin modelo";

  const limpio = texto.replace(/[.,]/g, " ").replace(/\s+/g, " ").trim();
  const [primeraPalabra] = limpio.split(" ");

  if (!primeraPalabra) return "Sin modelo";
  return primeraPalabra.toUpperCase();
}

export async function obtenerDashboardRetencion(filtros = {}) {
  const [listado, estadisticas] = await Promise.all([
    solicitar("", filtros),
    solicitar("estadisticas/", filtros),
  ]);

  const paginaActual = Number(filtros?.page || 1);
  const tamanoPagina = Number(filtros?.page_size || 500);
  const totalClientes = Number(listado?.count || 0);
  const totalPaginas = Math.max(
    1,
    Math.ceil(totalClientes / Math.max(tamanoPagina, 1)),
  );

  return {
    porcentajeRetorno: Number(estadisticas?.porcentaje_retorno || 0),
    vinesSegmento: Number(estadisticas?.vines_segmento || 0),
    vinesActivos: Number(estadisticas?.vines_activos || 0),
    vinesInactivos: Number(estadisticas?.vines_inactivos || 0),
    datosModelos: Array.isArray(estadisticas?.modelos)
      ? estadisticas.modelos
      : [],
    clientes: Array.isArray(listado?.results)
      ? listado.results.map(mapearCliente)
      : [],
    totalClientes,
    paginaActual,
    totalPaginas,
    tamanoPagina,
    tienePaginaAnterior: paginaActual > 1,
    tienePaginaSiguiente: paginaActual < totalPaginas,
  };
}

export async function obtenerDetalleRetencion(id) {
  return solicitar(`${id}/detalle-comercial/`);
}

export async function obtenerComentariosRetencion(id) {
  return solicitar(`${id}/comentarios/`);
}

export async function crearComentarioRetencion(id, comentario) {
  return solicitar(
    `${id}/comentarios/`,
    {},
    {
      method: "POST",
      body: { comentario },
    },
  );
}

export async function obtenerComentariosOrdenServicio(id, idOs = "") {
  return solicitar(`${id}/comentarios-os/`, { id_os: idOs });
}

export async function crearComentarioOrdenServicio(id, idOs, comentario) {
  return solicitar(
    `${id}/comentarios-os/`,
    {},
    {
      method: "POST",
      body: { id_os: idOs, comentario },
    },
  );
}
