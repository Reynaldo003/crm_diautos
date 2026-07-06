// src/pages/Avaluos/RegistroAvaluos.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    ArrowUpDown,
    BadgeCheck,
    BadgeDollarSign,
    Building2,
    CalendarDays,
    Camera,
    CarFront,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    ClipboardList,
    Eye,
    Gauge,
    Hash,
    Image as ImageIcon,
    Loader2,
    Lock,
    Mail,
    MapPin,
    MessageSquareText,
    NotebookText,
    Palette,
    Paperclip,
    Plus,
    Printer,
    Save,
    Search,
    ShieldCheck,
    Trash2,
    UploadCloud,
    User,
    UserStar,
    Wrench,
    X,
} from "lucide-react";

import { apiAvaluos } from "../../lib/apiAvaluos";
import { useAuth } from "../../auth/AuthContext";
import logoChevrolet from "../../assets/logo.png";
import logoRyr from "../../assets/ryr.png";

const CHEVY_GOLD = "#F2C94C";
const CHEVY_GOLD_DARK = "#C99A00";
const CHEVY_BLACK = "#111827";
const CHEVY_DARK = "#1F2937";
const CHEVY_SOFT = "#FFF8DB";

const API_BASE = (
    import.meta.env.VITE_API_URL || "https://crmchevrolet.grupoautomotrizryr.com"
).replace(/\/$/, "");

const TIPOS_VALUACION = [
    { value: "valuacion", label: "Valuación" },
    { value: "fresh_up", label: "Fresh Up" },
    { value: "valuacion_servicio", label: "Valuación de servicio" },
    { value: "valuacion_bdc", label: "Valuación de BDC" },
];

const TIPOS_TOMA = [
    { value: "de_servicio", label: "De servicio" },
    { value: "canal", label: "Canal" },
];

const TIPOS_CONCEPTO = [
    { value: "mecanico", label: "Mecánico" },
    { value: "estetico", label: "Estético" },
    { value: "hyp", label: "HYP" },
];

const ESTADOS_CHECKLIST_GENERALES = [
    { value: "", label: "Sin marcar" },
    { value: "inspeccion_realizada", label: "Inspección realizada" },
    { value: "requiere_servicio", label: "Requiere servicio" },
    { value: "servicio_realizado", label: "Servicio realizado" },
    { value: "na", label: "N/A" },
];

const ESTADOS_CHECKLIST_GENERALES_BOTONES = [
    {
        value: "inspeccion_realizada",
        label: "Inspección",
        classNameActivo: "border-emerald-500 bg-emerald-50 text-emerald-700",
    },
    {
        value: "requiere_servicio",
        label: "Requiere",
        classNameActivo: "border-red-500 bg-red-50 text-red-700",
    },
    {
        value: "servicio_realizado",
        label: "Realizado",
        classNameActivo: "border-blue-500 bg-blue-50 text-blue-700",
    },
    {
        value: "na",
        label: "N/A",
        classNameActivo: "border-slate-500 bg-slate-100 text-slate-700",
    },
];

const ESTADOS_CHECKLIST_HISTORIAL_BOTONES = [
    {
        value: "si",
        label: "Sí",
        classNameActivo: "border-emerald-500 bg-emerald-50 text-emerald-700",
    },
    {
        value: "no",
        label: "No",
        classNameActivo: "border-red-500 bg-red-50 text-red-700",
    },
    {
        value: "na",
        label: "N/A",
        classNameActivo: "border-slate-500 bg-slate-100 text-slate-700",
    },
];

const ESTADOS_CHECKLIST_CERTIFICACION_BOTONES = [
    {
        value: "si_realizado",
        label: "Sí realizado",
        classNameActivo: "border-emerald-500 bg-emerald-50 text-emerald-700",
    },
    {
        value: "no_realizado",
        label: "No realizado",
        classNameActivo: "border-red-500 bg-red-50 text-red-700",
    },
    {
        value: "na",
        label: "N/A",
        classNameActivo: "border-slate-500 bg-slate-100 text-slate-700",
    },
];

const CHECKLIST_100 = [
    "Vehículo ha sufrido modificaciones",
    "Costado derecho y alineación de puertas",
    "Costado izquierdo y alineación de puertas",
    "Defensa delantera",
    "Cofre",
    "Toldos",
    "Defensa trasera",
    "Tapa de gasolina",
    "Tapa cajuela / cajuela / bedliner",
    "Cajuela",
    "Rines y ruedas / cubierta de neumáticos / biseles / tapones",
    "Cristal",
    "Estribos",
    "Retrovisores",
    "Antena",
    "Sellos, gomas, empaques de puertas",
    "Puertas / cerraduras",
    "Luces exteriores",
    "Alarma",
    "Encendido remoto",
    "Freno de estacionamiento",
    "Asientos / anclaje de seguridad para niños",
    "Cinturones",
    "Cristales",
    "Quemacocos",
    "Sistema de navegación",
    "Sistema de audio y DVD",
    "Conectividad USB / AUX / Bluetooth",
    "Reloj / termómetro",
    "Computadora de viaje",
    "Toma corriente",
    "Luces de interior",
    "Desempañador trasero",
    "Panel de instrumentos",
    "Asientos traseros / reposacabezas",
    "Consola / tapa del compartimiento - del / tras",
    "Onstar presionar botón",
    "Onstar verificar conectividad de módulo",
    "Escaneo de vehículo",
    "Detectar códigos motor",
    "Sensores",
    "Medidores / tonos de aviso",
    "Encendido y estabilidad motor",
    "Funcionamiento motor / desempeño / aceleración",
    "Transmisión automático / manual",
    "Control de tracción",
    "Frenos / ABS",
    "Dirección / alineación y balanceo",
    "Chasis / alineación",
    "Caja de transferencia",
    "Control de crucero",
    "Velocímetro / tacómetro / odómetro",
    "Calentador / aire acondicionado",
    "Volante de direccion telescópico y de altura",
    "Claxon",
    "Limpiaparabrisas / chisgueteros / plumas",
    "Ajustes de pedales / volante",
    "Inspección visual",
    "El vehiculo cuenta con las calcomanías de la marca debajo del cofre",
    "Sistema de enfriamiento motor / radiador / mangueras",
    "Sistema de dirección",
    "Sistema eléctrico",
    "Sistema de frenos",
    "Sistema de encendido",
    "Sistema de combustible",
    "Compresor A/AC",
    "Inspección de filtros",
    "Inspección de mangueras",
    "Inspección bandas",
    "Prueba de batería",
    "Prueba de compresión / fugas / degradación de aceite motor",
    "Verificar estado de catalizador / sensores de oxígeno / emisiones",
    "Prueba de eficiencia de A/AC y carga si es necesario",
    "Visual",
    "Marco / daños",
    "Pastillas de freno / balatas",
    "Discos / pinzas / calipers / tambores",
    "Freno hidráulico",
    "Neumáticos",
    "Ruedas de acero / aleación originales segun modelo y version",
    "Amortiguadores",
    "Soportes motor / caja / escape",
    "Dirección / enlace",
    "Compartimiento del motor",
    "Motor",
    "Transmisión",
    "Caja de transferencia",
    "Montaje / ejes",
    "Diferencial",
    "Manual de propietario",
    "Campañas abiertas",
    "Vehículo es certificable",
    "Fecha de último mantenimiento",
    "Detallado exterior e interior",
    "Onstar pre-activación completada",
    "Prueba de estado de salud de la batería",
    "Realizar campañas abiertas",
    "Cambio de aceite de motor y filtro",
    "Inspeccionar / cambiar filtros",
    "Inspeccionar y poner a nivel todos los fluidos",
];

const DEALERS = ["Chevrolet Diaz Miron"];

const ASESORES = [
    "ALBERTO TORRES",
    "ALMA HERNANDEZ",
    "ANGELES VALERIO",
    "CARLOS VAZQUEZ",
    "DAVID RIOS",
    "GABRIELA POMPEYO",
    "GUADALUPE SANCHEZ",
    "ISRAEL NIETO",
    "IVETTE MATA",
    "JAIR SOLARES",
    "JAVIER VALENCIA",
    "JOSUE SEGOVIA",
    "KARINA CORTES",
    "LORENZA RINCON",
    "LUIS DAVID CASTILLO",
    "MAGDALENA MOLINA",
    "PEDRO MENDOZA",
    "RAQUEL SOLIS",
    "REYNA MORA",
    "ROMAN LUGO",
    "SILVIA LARA",
    "CASA",
    "GRISELDA NEVAREZ",
    "EDER MONTERO",
    "GASPAR PANTOJA",
];

const ETAPAS_PROCESO = [
    "Prospecto",
    "Pendiente de revisión",
    "En valuación",
    "Revisión técnica",
    "Negociación",
    "Cerrado",
    "Descartado",
];

const ORIGEN_VALUACION = [
    "Piso",
    "Digitales",
    "WhatsApp",
    "Marketplace",
    "Sitio web",
    "Servicio",
    "BDC",
    "Referido",
    "Gerencia",
    "Otro",
];

const MARCAS = [
    "CHEVROLET",
    "GMC",
    "CADILLAC",
    "NISSAN",
    "VOLKSWAGEN",
    "AUDI",
    "SEAT",
    "CUPRA",
    "TOYOTA",
    "CHRYSLER",
    "DODGE",
    "JEEP",
    "RAM",
    "ALFA ROMEO",
    "FORD",
    "LINCOLN",
    "KIA",
    "MAZDA",
    "HYUNDAI",
    "HONDA",
    "MG",
    "CHIREY",
    "OMODA",
    "JAECOO",
    "BYD",
    "GEELY",
    "ZEEKR",
    "FOTON",
    "MITSUBISHI",
    "SUBARU",
    "RENAULT",
    "VOLVO",
    "TESLA",
];

function normalizeStr(value) {
    return String(value ?? "").trim();
}

function normalizarRol(value) {
    return String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
}

function obtenerRolUsuario(user) {
    return (
        user?.rol_nombre ||
        user?.rol?.nombre ||
        user?.role_name ||
        user?.role?.name ||
        user?.rol ||
        user?.role ||
        ""
    );
}

function obtenerPermisosUsuario(user) {
    if (Array.isArray(user?.permisos)) return user.permisos;
    if (Array.isArray(user?.permissions)) return user.permissions;
    if (typeof user?.permisos === "string") return [user.permisos];
    if (typeof user?.permissions === "string") return [user.permissions];
    return [];
}

function toDTLocal(value) {
    if (!value) return "";

    const raw = String(value);

    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw) && !raw.endsWith("Z")) {
        return raw.slice(0, 16);
    }

    const date = new Date(raw);

    if (Number.isNaN(date.getTime())) return "";

    const pad = (number) => String(number).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromDTLocalToISO(value) {
    const clean = String(value || "").trim();
    return clean || null;
}

function toYMDLocal(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const pad = (number) => String(number).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}`;
}

function ymdToInt(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    return Number(value.replaceAll("-", ""));
}

function limpiarTextoMonto(value) {
    return String(value ?? "")
        .replace(/[^\d.,-]/g, "")
        .replace(/,/g, "");
}

function montoANumero(value) {
    const clean = limpiarTextoMonto(value);

    if (!clean || clean === "-" || clean === ".") return 0;

    const number = Number(clean);

    return Number.isFinite(number) ? number : 0;
}

function montoA2Decimales(value) {
    return montoANumero(value).toFixed(2);
}

function formatoMoneda(value) {
    const number = montoANumero(value);

    return number.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function normalizarTelefonoMx(value) {
    const digits = String(value || "").replace(/\D/g, "");

    if (/^\d{10}$/.test(digits)) return `52${digits}`;

    return digits;
}

function resolveEvidenceUrl(rawUrl) {
    const value = String(rawUrl || "").trim();

    if (!value) return "";

    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("blob:")
    ) {
        return value;
    }

    if (value.startsWith("/")) {
        return `${API_BASE}${value}`;
    }

    return `${API_BASE}/${value}`;
}

function getOptionLabel(options, value) {
    return options.find((item) => item.value === value)?.label || value || "—";
}

function generateTempId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return `tmp-${crypto.randomUUID()}`;
    }

    return `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildLocalEvidenceItem(file) {
    return {
        _tmpId: generateTempId(),
        id: null,
        nombre: file?.name || "imagen",
        tipo: "imagen",
        size: file?.size || 0,
        file,
        url: URL.createObjectURL(file),
        isLocal: true,
        categoria_concepto: "estetico",
        costo: "",
        descripcion: "",
    };
}

function revokeEvidencePreview(item) {
    const url = String(item?.url || "");

    if (url.startsWith("blob:")) {
        try {
            URL.revokeObjectURL(url);
        } catch {
            // Recurso ya liberado por el navegador.
        }
    }
}

function cleanupDraftResources(draft) {
    const evidencias = Array.isArray(draft?.evidencias_front)
        ? draft.evidencias_front
        : [];

    evidencias.forEach((item) => {
        if (item?.isLocal) {
            revokeEvidencePreview(item);
        }
    });
}

function crearConceptoVacio() {
    return {
        id: null,
        descripcion: "",
        tipo_concepto: "mecanico",
        costo: "",
    };
}

function createEmptyDraft({ agenciaDefault = "" } = {}) {
    return {
        id: null,
        cliente_id: null,

        agencia: agenciaDefault,
        cliente_nombre: "",
        cliente_telefono: "",
        cliente_correo: "",

        fecha_avaluo: toDTLocal(new Date().toISOString()),
        fecha_finalizacion: "",
        fecha_toma_cuenta: "",
        agenda_valuacion: "",

        asesor_ventas: "",
        vendedor: "",
        tipo_valuacion: "valuacion",
        tipo_toma: "",

        marca_auto: "",
        modelo: "",
        anio_modelo: "",
        version: "",
        serie: "",
        placas: "",
        kilometraje: "",
        color: "",

        precio_guia: "",
        precio_compra_libro_azul: "",
        precio_venta_libro_azul: "",
        costo_estimado: "",
        costo_mecanica_total: "",
        oferta_inicial: "",
        oferta_final: "",

        origen_valuacion: "",
        descripcion: "",
        observaciones: "",
        comentarios: "Valuación",
        comentarios_checklist: "",

        ganador_subasta: "",
        etapa_proceso: "",

        checklist_100: {},

        tecnico_finalizado: false,
        fecha_tecnico_finalizado: "",
        valuacion_terminada: false,
        fecha_valuacion_terminada: "",

        conceptos: [crearConceptoVacio()],
        evidencias_guardadas: [],
        evidencias_front: [],
        delete_evidencia_ids: [],
    };
}

function Skeleton({ className = "" }) {
    return (
        <div
            className={["animate-pulse rounded-md bg-black/10", className].join(" ")}
        />
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: 18 }).map((_, index) => (
                <td key={index} className="px-4 py-3">
                    <div className="h-4 w-24 rounded bg-slate-200/70" />
                </td>
            ))}
        </tr>
    );
}

function ModalSkeleton() {
    return (
        <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 15 }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-3 h-10 w-full rounded-lg" />
                </div>
            ))}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-3 h-24 w-full rounded-lg" />
            </div>
        </div>
    );
}

function Modal({ open, title, subtitle, onClose, children, footer }) {
    if (!open || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[9998]">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            <div className="absolute inset-0 flex items-end justify-center p-3 sm:items-center">
                <div
                    className="w-full max-w-7xl overflow-hidden rounded-2xl border bg-white shadow-2xl"
                    style={{ borderColor: CHEVY_GOLD_DARK }}
                    onClick={(event) => event.stopPropagation()}
                >
                    <div
                        className="flex items-center justify-between gap-3 border-b px-5 py-4"
                        style={{
                            background: `linear-gradient(135deg, ${CHEVY_BLACK}, ${CHEVY_DARK})`,
                            borderColor: CHEVY_GOLD,
                        }}
                    >
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: CHEVY_GOLD }}
                                />
                                <div className="truncate text-base font-extrabold text-white">
                                    {title}
                                </div>
                            </div>

                            {subtitle ? (
                                <div className="mt-1 text-xs font-semibold text-white/60">
                                    {subtitle}
                                </div>
                            ) : null}
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                            aria-label="Cerrar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="max-h-[78vh] overflow-auto bg-white p-5">
                        {children}
                    </div>

                    {footer ? (
                        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 lg:flex-row lg:items-center lg:justify-end">
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>,
        document.body
    );
}

function Field({ label, icon: Icon, children, className = "" }) {
    return (
        <div
            className={[
                "rounded-xl border border-slate-200 bg-white p-4 shadow-sm",
                className,
            ].join(" ")}
        >
            <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-slate-900">
                {Icon ? <Icon className="h-4 w-4 text-yellow-600" /> : null}
                <span>{label}</span>
            </div>

            {children}
        </div>
    );
}

function FilterBlock({ label, children }) {
    return (
        <div className="rounded-lg">
            <div className="mb-2 text-xs font-extrabold tracking-wide text-slate-900">
                {label}
            </div>
            {children}
        </div>
    );
}

function SectionTitle({ icon: Icon, title, subtitle, className = "" }) {
    return (
        <div className={["md:col-span-3", className].join(" ")}>
            <div className="flex flex-col gap-1 rounded-xl border border-yellow-500/30 bg-yellow-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    {Icon ? <Icon className="h-5 w-5 text-yellow-700" /> : null}
                    <h3 className="text-sm font-extrabold text-slate-950">{title}</h3>
                </div>

                {subtitle ? (
                    <p className="text-xs font-semibold text-slate-500">{subtitle}</p>
                ) : null}
            </div>
        </div>
    );
}

function ContextMenu({ ctxMenu, onDelete, onClose, canDelete }) {
    if (!ctxMenu.open || !ctxMenu.row || typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div
            className="fixed z-[9999]"
            style={{ left: ctxMenu.x, top: ctxMenu.y }}
            onClick={(event) => event.stopPropagation()}
        >
            <div className="w-52 overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl">
                <button
                    type="button"
                    disabled={!canDelete}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={() => onDelete(ctxMenu.row)}
                >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                </button>

                <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-xs text-slate-500 hover:bg-slate-50"
                    onClick={onClose}
                >
                    Cerrar
                </button>
            </div>
        </div>,
        document.body
    );
}

function EvidenceCard({ item, disabled, onRemove, onChange }) {
    const url = resolveEvidenceUrl(item?.url || item?.archivo);
    const nombre = item?.nombre || item?.file?.name || "imagen";

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="relative">
                {url ? (
                    <img
                        src={url}
                        alt={nombre}
                        loading="lazy"
                        className="h-44 w-full object-cover"
                    />
                ) : (
                    <div className="flex h-44 w-full items-center justify-center bg-slate-100">
                        <div className="text-center">
                            <ImageIcon className="mx-auto h-10 w-10 text-slate-500" />
                            <div className="mt-2 px-3 text-xs font-bold text-slate-600">
                                Vista previa no disponible
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onRemove}
                    disabled={disabled}
                    className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/60 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Quitar evidencia"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-3 p-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <div className="truncate text-sm font-bold text-slate-950">
                            {nombre}
                        </div>

                        <div className="mt-1 text-xs font-semibold text-slate-500">
                            Evidencia de imagen
                        </div>
                    </div>

                    {url ? (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-yellow-500/30 bg-yellow-50 px-2 py-1 text-xs font-bold text-slate-950 hover:bg-yellow-100"
                        >
                            <Eye className="h-3.5 w-3.5" />
                            Ver
                        </a>
                    ) : null}
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-xs font-extrabold text-slate-700">
                            Categoría
                        </label>

                        <select
                            value={item.categoria_concepto || "estetico"}
                            onChange={(event) =>
                                onChange("categoria_concepto", event.target.value)
                            }
                            disabled={disabled}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                        >
                            {TIPOS_CONCEPTO.map((tipo) => (
                                <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-extrabold text-slate-700">
                            Costo
                        </label>

                        <input
                            value={item.costo || ""}
                            onChange={(event) => onChange("costo", event.target.value)}
                            disabled={disabled}
                            inputMode="decimal"
                            placeholder="0.00"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-xs font-extrabold text-slate-700">
                            Descripción
                        </label>

                        <input
                            value={item.descripcion || ""}
                            onChange={(event) => onChange("descripcion", event.target.value)}
                            disabled={disabled}
                            placeholder="Ej. Golpe en fascia, rayón en puerta..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MobileCardList({ rows, loading, onEdit, onContext }) {
    return (
        <div className="lg:hidden">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                {loading ? (
                    <div className="grid gap-3 p-3 sm:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="mt-3 h-4 w-28" />
                                <Skeleton className="mt-3 h-4 w-56" />
                                <Skeleton className="mt-4 h-8 w-24 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="px-4 py-10 text-center text-slate-700">
                        No hay resultados con esos filtros.
                    </div>
                ) : (
                    <div className="grid gap-3 p-3 sm:grid-cols-2">
                        {rows.map((row) => (
                            <div
                                key={row.id}
                                onClick={() => onEdit(row)}
                                onContextMenu={(event) => onContext(event, row)}
                                className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-yellow-400 hover:shadow-md"
                                title="Toca para editar"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-950">
                                            <CalendarDays className="h-4 w-4 text-yellow-600" />
                                            <span className="truncate">
                                                {row.fecha_avaluo
                                                    ? toDTLocal(row.fecha_avaluo).replace("T", " ")
                                                    : "Sin fecha"}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <Building2 className="h-4 w-4" />
                                            <span className="truncate">{row.agencia || "—"}</span>
                                        </div>
                                    </div>

                                    <div
                                        className={[
                                            "rounded-full border px-3 py-1 text-xs font-bold",
                                            row.valuacion_terminada
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border-yellow-500/40 bg-yellow-50 text-slate-950",
                                        ].join(" ")}
                                    >
                                        {row.valuacion_terminada
                                            ? "Terminada"
                                            : row.etapa_proceso || "Sin etapa"}
                                    </div>
                                </div>

                                <div className="mt-3 grid gap-2">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-950">
                                        <User className="h-4 w-4 text-yellow-600" />
                                        <span className="truncate">
                                            {row?.cliente?.nombre || "—"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                        <CarFront className="h-4 w-4 text-yellow-600" />
                                        <span className="truncate">
                                            {[row.marca_auto, row.modelo, row.anio_modelo]
                                                .filter(Boolean)
                                                .join(" ") || "—"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                        <BadgeCheck className="h-4 w-4 text-yellow-600" />
                                        <span className="truncate">Placas: {row.placas || "—"}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                        <BadgeDollarSign className="h-4 w-4 text-yellow-600" />
                                        <span className="truncate">
                                            Total reparación: {formatoMoneda(row.costo_reparacion)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                        <Paperclip className="h-4 w-4 text-yellow-600" />
                                        <span>{row?.evidencias?.length || 0} evidencias</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ModalTabs({ tabs, activeTab, setActiveTab }) {
    return (
        <div className="mb-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="flex min-w-max gap-2">
                {tabs.map((tab) => {
                    const active = activeTab === tab.key;
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={[
                                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-extrabold transition",
                                active
                                    ? "bg-slate-950 text-white"
                                    : "bg-white text-slate-600 hover:bg-yellow-50 hover:text-slate-950",
                            ].join(" ")}
                        >
                            {Icon ? <Icon className="h-4 w-4" /> : null}
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function RegistroAvaluos() {
    const auth = useAuth();
    const user = auth.usuario || auth.user || null;

    const fileInputRef = useRef(null);
    const draftRef = useRef(null);

    const rolNormalizado = useMemo(() => {
        return normalizarRol(obtenerRolUsuario(user));
    }, [user]);

    const permisosNormalizados = useMemo(() => {
        return obtenerPermisosUsuario(user).map((permiso) => normalizarRol(permiso));
    }, [user]);

    const isAdmin = useMemo(() => {
        return (
            rolNormalizado.includes("administrador") ||
            rolNormalizado.includes("admin") ||
            permisosNormalizados.includes("all") ||
            permisosNormalizados.includes("usuarios_admin") ||
            permisosNormalizados.includes("crm_digitales")
        );
    }, [rolNormalizado, permisosNormalizados]);

    const isValuador = useMemo(() => rolNormalizado.includes("valuador"), [rolNormalizado]);
    const isBDC = useMemo(() => rolNormalizado.includes("bdc"), [rolNormalizado]);
    const isTecnico = useMemo(() => rolNormalizado.includes("tecnico"), [rolNormalizado]);

    const canSeeFull = isAdmin || isValuador;
    const canCreate = Boolean(user) && (isAdmin || isValuador || isBDC);
    const canDelete = isAdmin || isValuador;

    const userAgencia = String(user?.agencia || "").trim();

    const [avaluos, setAvaluos] = useState([]);
    const [ctxMenu, setCtxMenu] = useState({
        open: false,
        x: 0,
        y: 0,
        row: null,
    });

    const [sort, setSort] = useState({ key: "fecha_avaluo", dir: "desc" });

    const [filters, setFilters] = useState({
        q: "",
        agencia: "Todos",
        rangoDesde: "",
        rangoHasta: "",
    });

    const [openModal, setOpenModal] = useState(false);
    const [mode, setMode] = useState("create");
    const [draft, setDraft] = useState(null);
    const [activeTab, setActiveTab] = useState("generales");

    const [loadingList, setLoadingList] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [saving, setSaving] = useState(false);
    const [printingTicket, setPrintingTicket] = useState(false);
    const [printingChecklist, setPrintingChecklist] = useState(false);
    const [finishing, setFinishing] = useState(false);
    const [touchedSave, setTouchedSave] = useState(false);

    const REQUIRED = useMemo(
        () => ({
            cliente_telefono: "Teléfono",
            fecha_avaluo: "Fecha de avalúo",
        }),
        []
    );

    const missing = useMemo(() => {
        if (!draft) return [];

        return Object.keys(REQUIRED).filter((key) => {
            const value = draft[key];

            return (
                value === null ||
                value === undefined ||
                (typeof value === "string" && value.trim() === "")
            );
        });
    }, [draft, REQUIRED]);

    const telDigits = useMemo(() => {
        return String(draft?.cliente_telefono || "").replace(/\D/g, "");
    }, [draft?.cliente_telefono]);

    const telIsOk = useMemo(() => {
        return /^(?:\d{10}|52\d{10})$/.test(telDigits);
    }, [telDigits]);

    const telError = useMemo(() => {
        if (!openModal || !draft || !telDigits) return "";

        if (/^\d{10}$/.test(telDigits)) return "";
        if (/^52\d{10}$/.test(telDigits)) return "";

        if (telDigits.length < 10) return "Número incompleto. Mínimo 10 dígitos.";
        if (telDigits.length === 11) return "Número incorrecto. 11 dígitos no es válido.";

        if (telDigits.length === 12 && !telDigits.startsWith("52")) {
            return "Número inválido. Si tiene 12 dígitos debe iniciar con 52.";
        }

        if (telDigits.length > 12) return "Número incorrecto. Máximo 12 dígitos.";

        return "Número inválido.";
    }, [openModal, draft, telDigits]);

    const isInvalid = (key) => touchedSave && missing.includes(key);

    const inputBase =
        "w-full rounded-lg border px-3 py-2 text-sm font-semibold text-slate-950 shadow-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200";
    const inputOk = "border-slate-200 bg-white";
    const inputBad = "border-red-500 bg-red-50";
    const inputDisabled = "cursor-not-allowed bg-slate-100 text-slate-500";

    const readOnlyPorTerminada = Boolean(draft?.valuacion_terminada);
    const tecnicoBloqueado = isTecnico && Boolean(draft?.tecnico_finalizado);
    const bloqueoGeneral = readOnlyPorTerminada || tecnicoBloqueado || saving;

    const mostrarClienteOperacion = canSeeFull || isBDC;
    const mostrarVehiculo = canSeeFull || isBDC || isTecnico;
    const mostrarNegociacion = canSeeFull;
    const mostrarSeguimiento = canSeeFull;
    const mostrarEvidencias = canSeeFull || isTecnico;
    const mostrarConceptos = canSeeFull || isTecnico;
    const mostrarChecklist = canSeeFull || isTecnico;

    const checklistVisible = useMemo(() => {
        if (isAdmin) {
            return CHECKLIST_100.map((descripcion, index) => ({
                numero: index + 1,
                descripcion,
            }));
        }

        if (isValuador) {
            return CHECKLIST_100.slice(0, 19).map((descripcion, index) => ({
                numero: index + 1,
                descripcion,
            }));
        }

        if (isTecnico) {
            return CHECKLIST_100.slice(19, 89).map((descripcion, index) => ({
                numero: index + 20,
                descripcion,
            }));
        }

        return [];
    }, [isAdmin, isValuador, isTecnico]);

    const modalTabs = useMemo(() => {
        const tabs = [];

        if (mostrarClienteOperacion) {
            tabs.push({ key: "generales", label: "Cliente", icon: User });
        }

        if (mostrarVehiculo) {
            tabs.push({ key: "vehiculo", label: "Vehículo", icon: CarFront });
        }

        if (mostrarNegociacion || mostrarSeguimiento) {
            tabs.push({ key: "valores", label: "Valores", icon: BadgeDollarSign });
        }

        if (mostrarConceptos) {
            tabs.push({ key: "tecnica", label: "Técnica", icon: Wrench });
        }

        if (mostrarEvidencias) {
            tabs.push({ key: "evidencias", label: "Evidencias", icon: Camera });
        }

        if (mostrarChecklist && checklistVisible.length > 0) {
            tabs.push({ key: "checklist", label: "Checklist", icon: ClipboardList });
        }

        return tabs;
    }, [
        mostrarClienteOperacion,
        mostrarVehiculo,
        mostrarNegociacion,
        mostrarSeguimiento,
        mostrarConceptos,
        mostrarEvidencias,
        mostrarChecklist,
        checklistVisible.length,
    ]);

    useEffect(() => {
        if (!modalTabs.length) return;

        const exists = modalTabs.some((tab) => tab.key === activeTab);

        if (!exists) {
            setActiveTab(modalTabs[0].key);
        }
    }, [modalTabs, activeTab]);

    useEffect(() => {
        draftRef.current = draft;
    }, [draft]);

    useEffect(() => {
        const onGlobal = () => {
            setCtxMenu((prev) => ({ ...prev, open: false, row: null }));
        };

        window.addEventListener("click", onGlobal);
        window.addEventListener("scroll", onGlobal, true);
        window.addEventListener("resize", onGlobal);

        return () => {
            window.removeEventListener("click", onGlobal);
            window.removeEventListener("scroll", onGlobal, true);
            window.removeEventListener("resize", onGlobal);
        };
    }, []);

    useEffect(() => {
        return () => {
            cleanupDraftResources(draftRef.current);
        };
    }, []);

    const totalConceptosNoMecanicos = useMemo(() => {
        return (draft?.conceptos || []).reduce((acc, item) => {
            if (item?.tipo_concepto === "mecanico") return acc;
            return acc + montoANumero(item?.costo);
        }, 0);
    }, [draft?.conceptos]);

    const totalEvidencias = useMemo(() => {
        const guardadas = draft?.evidencias_guardadas || [];
        const nuevas = draft?.evidencias_front || [];

        return [...guardadas, ...nuevas].reduce((acc, item) => {
            return acc + montoANumero(item?.costo);
        }, 0);
    }, [draft?.evidencias_guardadas, draft?.evidencias_front]);

    const totalReparacion = useMemo(() => {
        return (
            montoANumero(draft?.costo_mecanica_total) +
            totalConceptosNoMecanicos +
            totalEvidencias
        );
    }, [draft?.costo_mecanica_total, totalConceptosNoMecanicos, totalEvidencias]);

    const totalEvidenciasDraft =
        (draft?.evidencias_guardadas?.length || 0) +
        (draft?.evidencias_front?.length || 0);

    const dealers = useMemo(() => {
        const set = new Set(
            (avaluos || []).map((item) => normalizeStr(item.agencia)).filter(Boolean)
        );

        const lista = ["Todos", ...Array.from(set)];

        if (!isAdmin && userAgencia) {
            return ["Todos", userAgencia];
        }

        return lista;
    }, [avaluos, isAdmin, userAgencia]);

    const filtered = useMemo(() => {
        const q = filters.q.trim().toLowerCase();
        const desdeInt = ymdToInt(filters.rangoDesde);
        const hastaInt = ymdToInt(filters.rangoHasta);

        return (avaluos || []).filter((item) => {
            if (
                !isAdmin &&
                userAgencia &&
                normalizeStr(item.agencia) !== normalizeStr(userAgencia)
            ) {
                return false;
            }

            const nombreCliente = normalizeStr(item?.cliente?.nombre);
            const telefonoCliente = normalizeStr(item?.cliente?.telefono);

            const searchableValues = [
                item.agencia,
                item.asesor_ventas,
                item.vendedor,
                item.tipo_valuacion,
                item.tipo_toma,
                item.marca_auto,
                item.modelo,
                item.anio_modelo,
                item.version,
                item.serie,
                item.placas,
                item.kilometraje,
                item.color,
                item.precio_guia,
                item.precio_compra_libro_azul,
                item.precio_venta_libro_azul,
                item.costo_reparacion,
                item.costo_estimado,
                item.oferta_inicial,
                item.oferta_final,
                item.origen_valuacion,
                item.descripcion,
                item.observaciones,
                item.comentarios,
                item.ganador_subasta,
                item.etapa_proceso,
                nombreCliente,
                telefonoCliente,
            ];

            const matchQ =
                !q ||
                searchableValues.some((value) =>
                    normalizeStr(value).toLowerCase().includes(q)
                );

            const matchAgencia =
                filters.agencia === "Todos" ||
                normalizeStr(item.agencia) === normalizeStr(filters.agencia);

            let matchRango = true;

            if (desdeInt !== null || hastaInt !== null) {
                const ymd = item.fecha_avaluo ? toYMDLocal(item.fecha_avaluo) : "";
                const ymdInt = ymdToInt(ymd);

                if (!ymdInt) return false;
                if (desdeInt !== null && ymdInt < desdeInt) matchRango = false;
                if (hastaInt !== null && ymdInt > hastaInt) matchRango = false;
            }

            return matchQ && matchAgencia && matchRango;
        });
    }, [avaluos, filters, isAdmin, userAgencia]);

    const sorted = useMemo(() => {
        const data = [...filtered];
        const { key, dir } = sort;
        const mult = dir === "asc" ? 1 : -1;

        return data.sort((a, b) => {
            if (key === "fecha_avaluo") {
                const ta = a.fecha_avaluo ? new Date(a.fecha_avaluo).getTime() : 0;
                const tb = b.fecha_avaluo ? new Date(b.fecha_avaluo).getTime() : 0;

                return (ta - tb) * mult;
            }

            if (key === "evidencias_count") {
                return ((a?.evidencias?.length || 0) - (b?.evidencias?.length || 0)) * mult;
            }

            const va =
                key === "cliente_nombre"
                    ? normalizeStr(a?.cliente?.nombre).toLowerCase()
                    : normalizeStr(a?.[key]).toLowerCase();

            const vb =
                key === "cliente_nombre"
                    ? normalizeStr(b?.cliente?.nombre).toLowerCase()
                    : normalizeStr(b?.[key]).toLowerCase();

            if (va < vb) return -1 * mult;
            if (va > vb) return 1 * mult;

            return 0;
        });
    }, [filtered, sort]);

    async function refreshList() {
        setLoadingList(true);

        try {
            const data = await apiAvaluos.list();
            setAvaluos(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setAvaluos([]);
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        if (auth.loadingSesion) return;
        if (!auth.token) return;

        refreshList();
    }, [auth.loadingSesion, auth.token]);

    function toggleSort(key) {
        setSort((prev) => {
            if (prev.key !== key) return { key, dir: "asc" };
            return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
        });
    }

    function onRowContextMenu(event, row) {
        event.preventDefault();
        event.stopPropagation();

        setCtxMenu({
            open: true,
            x: event.clientX,
            y: event.clientY,
            row,
        });
    }

    function openCreate() {
        if (auth.loadingSesion) return;

        if (!canCreate) {
            alert(
                `No tienes permisos para crear avalúos. Rol detectado: ${obtenerRolUsuario(user) || "sin rol"
                }`
            );
            return;
        }

        cleanupDraftResources(draft);

        setTouchedSave(false);
        setMode("create");
        setLoadingDetail(false);

        const agenciaDefault = isAdmin ? "" : userAgencia;

        setDraft(createEmptyDraft({ agenciaDefault }));
        setActiveTab("generales");
        setOpenModal(true);
    }

    async function openEdit(row) {
        if (!row?.id) return;

        try {
            cleanupDraftResources(draft);

            setTouchedSave(false);
            setMode("edit");
            setLoadingDetail(true);
            setActiveTab("generales");
            setOpenModal(true);

            const item = await apiAvaluos.get(row.id);

            if (
                !isAdmin &&
                userAgencia &&
                normalizeStr(item.agencia) !== normalizeStr(userAgencia)
            ) {
                alert("No tienes permisos para ver registros de otra agencia.");
                setOpenModal(false);
                return;
            }

            setDraft({
                ...createEmptyDraft({
                    agenciaDefault: item.agencia || (isAdmin ? "" : userAgencia),
                }),

                id: item.id,
                cliente_id: item?.cliente?.id_cliente ?? null,

                agencia: item.agencia || (isAdmin ? "" : userAgencia),
                cliente_nombre: item?.cliente?.nombre || "",
                cliente_telefono: item?.cliente?.telefono || "",
                cliente_correo: item?.cliente?.correo || "",

                fecha_avaluo: toDTLocal(item.fecha_avaluo),
                fecha_finalizacion: toDTLocal(item.fecha_finalizacion),
                fecha_toma_cuenta: toDTLocal(item.fecha_toma_cuenta),
                agenda_valuacion: toDTLocal(item.agenda_valuacion),

                asesor_ventas: item.asesor_ventas || "",
                vendedor: item.vendedor || "",
                tipo_valuacion: item.tipo_valuacion || "valuacion",
                tipo_toma: item.tipo_toma || "",

                marca_auto: item.marca_auto || "",
                modelo: item.modelo || "",
                anio_modelo: item.anio_modelo || "",
                version: item.version || "",
                serie: item.serie || "",
                placas: item.placas || "",
                kilometraje: item.kilometraje || "",
                color: item.color || "",

                precio_guia: item.precio_guia || "",
                precio_compra_libro_azul: item.precio_compra_libro_azul || "",
                precio_venta_libro_azul: item.precio_venta_libro_azul || "",
                costo_estimado: item.costo_estimado || "",
                costo_mecanica_total: String(item.costo_mecanica_total ?? ""),
                oferta_inicial: item.oferta_inicial || "",
                oferta_final: item.oferta_final || "",

                origen_valuacion: item.origen_valuacion || "",
                descripcion: item.descripcion || "",
                observaciones: item.observaciones || "",
                comentarios: item.comentarios || "Valuación",
                comentarios_checklist: item.comentarios_checklist || "",

                ganador_subasta: item.ganador_subasta || "",
                etapa_proceso: item.etapa_proceso || "",

                checklist_100: item.checklist_100 || {},

                tecnico_finalizado: Boolean(item.tecnico_finalizado),
                fecha_tecnico_finalizado: toDTLocal(item.fecha_tecnico_finalizado),
                valuacion_terminada: Boolean(item.valuacion_terminada),
                fecha_valuacion_terminada: toDTLocal(item.fecha_valuacion_terminada),

                conceptos:
                    Array.isArray(item.conceptos) && item.conceptos.length
                        ? item.conceptos.map((concepto) => ({
                            id: concepto.id,
                            descripcion: concepto.descripcion || "",
                            tipo_concepto: concepto.tipo_concepto || "mecanico",
                            costo:
                                concepto.tipo_concepto === "mecanico"
                                    ? ""
                                    : String(concepto.costo ?? ""),
                        }))
                        : [crearConceptoVacio()],

                evidencias_guardadas: Array.isArray(item.evidencias)
                    ? item.evidencias.map((ev) => ({
                        ...ev,
                        url: resolveEvidenceUrl(ev?.url || ev?.archivo),
                        isLocal: false,
                        categoria_concepto: ev.categoria_concepto || "estetico",
                        costo: String(ev.costo ?? ""),
                        descripcion: ev.descripcion || "",
                    }))
                    : [],

                evidencias_front: [],
                delete_evidencia_ids: [],
            });
        } catch (error) {
            console.error(error);
            alert(error.message || "No se pudo abrir el avalúo.");
            setOpenModal(false);
        } finally {
            setLoadingDetail(false);
        }
    }

    function closeModal() {
        if (saving || finishing) return;

        cleanupDraftResources(draft);

        setOpenModal(false);
        setDraft(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    function setDraftField(key, value) {
        setDraft((prev) => {
            if (!prev) return prev;
            return { ...prev, [key]: value };
        });
    }

    function agregarConcepto() {
        setDraft((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                conceptos: [...(prev.conceptos || []), crearConceptoVacio()],
            };
        });
    }

    function actualizarConcepto(index, campo, value) {
        setDraft((prev) => {
            if (!prev) return prev;

            const conceptos = [...(prev.conceptos || [])];
            const current = { ...conceptos[index] };

            if (campo === "tipo_concepto") {
                current.tipo_concepto = value;

                if (value === "mecanico") {
                    current.costo = "";
                }
            } else if (campo === "costo") {
                current.costo = limpiarTextoMonto(value);
            } else {
                current[campo] = value;
            }

            conceptos[index] = current;

            return {
                ...prev,
                conceptos,
            };
        });
    }

    function eliminarConcepto(index) {
        setDraft((prev) => {
            if (!prev) return prev;

            const conceptos = (prev.conceptos || []).filter((_, i) => i !== index);

            return {
                ...prev,
                conceptos: conceptos.length ? conceptos : [crearConceptoVacio()],
            };
        });
    }

    function handleAddFiles(fileList) {
        const files = Array.from(fileList || []);

        if (!files.length) return;

        const imagenes = files.filter((file) =>
            String(file.type || "").startsWith("image/")
        );

        if (imagenes.length !== files.length) {
            alert("Solo se permiten imágenes como evidencia.");
        }

        if (!imagenes.length) return;

        const nuevos = imagenes.map((file) => buildLocalEvidenceItem(file));

        setDraft((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                evidencias_front: [...(prev.evidencias_front || []), ...nuevos],
            };
        });
    }

    function removeFrontEvidence(tmpId) {
        setDraft((prev) => {
            if (!prev) return prev;

            const target = (prev.evidencias_front || []).find(
                (item) => item._tmpId === tmpId
            );

            if (target) {
                revokeEvidencePreview(target);
            }

            return {
                ...prev,
                evidencias_front: (prev.evidencias_front || []).filter(
                    (item) => item._tmpId !== tmpId
                ),
            };
        });
    }

    function removeSavedEvidence(evidenceId) {
        setDraft((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                evidencias_guardadas: (prev.evidencias_guardadas || []).filter(
                    (item) => item.id !== evidenceId
                ),
                delete_evidencia_ids: [
                    ...(prev.delete_evidencia_ids || []),
                    evidenceId,
                ].filter(Boolean),
            };
        });
    }

    function updateFrontEvidence(tmpId, field, value) {
        setDraft((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                evidencias_front: (prev.evidencias_front || []).map((item) => {
                    if (item._tmpId !== tmpId) return item;

                    return {
                        ...item,
                        [field]: field === "costo" ? limpiarTextoMonto(value) : value,
                    };
                }),
            };
        });
    }

    function updateSavedEvidence(id, field, value) {
        setDraft((prev) => {
            if (!prev) return prev;

            return {
                ...prev,
                evidencias_guardadas: (prev.evidencias_guardadas || []).map((item) => {
                    if (item.id !== id) return item;

                    return {
                        ...item,
                        [field]: field === "costo" ? limpiarTextoMonto(value) : value,
                    };
                }),
            };
        });
    }

    function esPuntoEspesor(numero) {
        return numero === 76 || numero === 79;
    }

    function esPuntoFecha(numero) {
        return numero === 93;
    }

    function obtenerValorChecklist(numero) {
        return draft?.checklist_100?.[String(numero)] || "";
    }

    function obtenerEstadoChecklist(numero) {
        const valor = obtenerValorChecklist(numero);

        if (typeof valor === "object" && valor !== null) {
            return valor.estado || "";
        }

        return valor || "";
    }

    function obtenerCampoEspesor(numero, campo) {
        const valor = obtenerValorChecklist(numero);

        if (typeof valor !== "object" || valor === null) return "";

        return valor[campo] || "";
    }

    function opcionesChecklist(numero) {
        if ([90, 91, 92].includes(numero)) {
            return ESTADOS_CHECKLIST_HISTORIAL_BOTONES;
        }

        if (numero >= 94 && numero <= 100) {
            return ESTADOS_CHECKLIST_CERTIFICACION_BOTONES;
        }

        return ESTADOS_CHECKLIST_GENERALES_BOTONES;
    }

    function labelEstadoChecklist(numero, value) {
        const opciones = opcionesChecklist(numero);
        const encontrado = opciones.find((item) => item.value === value);

        if (encontrado) return encontrado.label;

        const general = ESTADOS_CHECKLIST_GENERALES.find((item) => item.value === value);
        if (general) return general.label;

        if (!value) return "Sin marcar";

        return value;
    }

    function normalizarValorMasivo(numero, value) {
        if (!value) return "";

        if (numero === 93) return "";

        if ([90, 91, 92].includes(numero)) {
            if (value === "na") return "na";
            if (value === "requiere_servicio") return "no";
            return "si";
        }

        if (numero >= 94 && numero <= 100) {
            if (value === "na") return "na";
            if (value === "requiere_servicio") return "no_realizado";
            return "si_realizado";
        }

        return value;
    }

    function updateChecklist(numero, value) {
        setDraft((prev) => {
            if (!prev) return prev;

            const next = { ...(prev.checklist_100 || {}) };

            if (!value) {
                delete next[String(numero)];
                return {
                    ...prev,
                    checklist_100: next,
                };
            }

            if (esPuntoEspesor(numero)) {
                const actual = next[String(numero)];

                const base =
                    typeof actual === "object" && actual !== null
                        ? actual
                        : {
                            estado: "",
                            dd: "",
                            id: "",
                            it: "",
                            dt: "",
                        };

                next[String(numero)] = {
                    ...base,
                    estado: value,
                };
            } else {
                next[String(numero)] = value;
            }

            return {
                ...prev,
                checklist_100: next,
            };
        });
    }

    function updateChecklistFecha(numero, value) {
        setDraft((prev) => {
            if (!prev) return prev;

            const next = { ...(prev.checklist_100 || {}) };

            if (!value) {
                delete next[String(numero)];
            } else {
                next[String(numero)] = value;
            }

            return {
                ...prev,
                checklist_100: next,
            };
        });
    }

    function updateChecklistEspesor(numero, campo, value) {
        setDraft((prev) => {
            if (!prev) return prev;

            const next = { ...(prev.checklist_100 || {}) };
            const actual = next[String(numero)];

            const base =
                typeof actual === "object" && actual !== null
                    ? actual
                    : {
                        estado: actual || "",
                        dd: "",
                        id: "",
                        it: "",
                        dt: "",
                    };

            next[String(numero)] = {
                ...base,
                [campo]: value.replace(/[^\d.]/g, ""),
            };

            return {
                ...prev,
                checklist_100: next,
            };
        });
    }

    function updateChecklistMasivo(items, value) {
        setDraft((prev) => {
            if (!prev) return prev;

            const next = { ...(prev.checklist_100 || {}) };

            items.forEach((item) => {
                const numero = item.numero;

                if (numero === 93) return;

                const valorFinal = normalizarValorMasivo(numero, value);

                if (!valorFinal) {
                    delete next[String(numero)];
                    return;
                }

                if (esPuntoEspesor(numero)) {
                    const actual = next[String(numero)];

                    const base =
                        typeof actual === "object" && actual !== null
                            ? actual
                            : {
                                estado: "",
                                dd: "",
                                id: "",
                                it: "",
                                dt: "",
                            };

                    next[String(numero)] = {
                        ...base,
                        estado: valorFinal,
                    };
                } else {
                    next[String(numero)] = valorFinal;
                }
            });

            return {
                ...prev,
                checklist_100: next,
            };
        });
    }

    async function eliminarAvaluo(row) {
        if (!row?.id) return;

        if (!canDelete) {
            alert("No tienes permisos para eliminar avalúos.");
            return;
        }

        if (
            !isAdmin &&
            userAgencia &&
            normalizeStr(row.agencia) !== normalizeStr(userAgencia)
        ) {
            alert("No tienes permisos para eliminar registros de otra agencia.");
            return;
        }

        const ok = confirm(
            `¿Eliminar el avalúo de ${row?.cliente?.nombre || row?.cliente?.telefono || "cliente"
            }?`
        );

        if (!ok) return;

        try {
            await apiAvaluos.remove(row.id);
            setAvaluos((prev) => prev.filter((item) => item.id !== row.id));
            setCtxMenu({ open: false, x: 0, y: 0, row: null });
        } catch (error) {
            console.error(error);
            alert(error.message || "No se pudo eliminar el avalúo.");
        }
    }

    function buildPayload() {
        const agenciaFinal = isAdmin ? normalizeStr(draft.agencia || "") : userAgencia;

        const conceptos = (draft.conceptos || []).map((item) => ({
            descripcion: String(item.descripcion || "").trim(),
            tipo_concepto: item.tipo_concepto || "mecanico",
            costo:
                item.tipo_concepto === "mecanico"
                    ? "0.00"
                    : montoA2Decimales(item.costo),
        }));

        return {
            agencia: agenciaFinal,
            ...(draft.cliente_id ? { cliente_id: draft.cliente_id } : {}),

            nombre: draft.cliente_nombre || "",
            telefono: normalizarTelefonoMx(draft.cliente_telefono),
            correo: draft.cliente_correo || "",

            fecha_avaluo: fromDTLocalToISO(draft.fecha_avaluo),
            fecha_finalizacion: fromDTLocalToISO(draft.fecha_finalizacion),
            fecha_toma_cuenta: fromDTLocalToISO(draft.fecha_toma_cuenta),
            agenda_valuacion: fromDTLocalToISO(draft.agenda_valuacion),

            asesor_ventas: draft.asesor_ventas || "",
            vendedor: draft.vendedor || "",
            tipo_valuacion: draft.tipo_valuacion || "valuacion",
            tipo_toma: draft.tipo_toma || "",

            marca_auto: draft.marca_auto || "",
            modelo: draft.modelo || "",
            anio_modelo: draft.anio_modelo || "",
            version: draft.version || "",
            serie: draft.serie || "",
            placas: draft.placas || "",
            kilometraje: draft.kilometraje || "",
            color: draft.color || "",

            precio_guia: draft.precio_guia || "",
            precio_compra_libro_azul: draft.precio_compra_libro_azul || "",
            precio_venta_libro_azul: draft.precio_venta_libro_azul || "",
            costo_estimado: draft.costo_estimado || "",
            costo_mecanica_total: montoA2Decimales(draft.costo_mecanica_total),

            oferta_inicial: draft.oferta_inicial || "",
            oferta_final: draft.oferta_final || "",

            origen_valuacion: draft.origen_valuacion || "",
            descripcion: draft.descripcion || "",
            observaciones: draft.observaciones || "",
            comentarios: draft.comentarios || "Valuación",
            comentarios_checklist: draft.comentarios_checklist || "",

            ganador_subasta: draft.ganador_subasta || "",
            etapa_proceso: draft.etapa_proceso || "",

            conceptos,
            checklist_100: draft.checklist_100 || {},

            evidencias_nuevas: draft.evidencias_front || [],
            evidencias_existentes: (draft.evidencias_guardadas || []).map((item) => ({
                id: item.id,
                categoria_concepto: item.categoria_concepto || "estetico",
                costo: montoA2Decimales(item.costo),
                descripcion: item.descripcion || "",
            })),
            delete_evidencia_ids: draft.delete_evidencia_ids || [],
        };
    }

    async function save() {
        if (!draft || saving) return;

        setTouchedSave(true);

        if (mostrarClienteOperacion && !telIsOk) {
            setActiveTab("generales");
            return;
        }

        if (mostrarClienteOperacion && missing.length) {
            setActiveTab("generales");
            return;
        }

        setSaving(true);

        try {
            const payload = buildPayload();

            let response = null;

            if (mode === "create") {
                response = await apiAvaluos.create(payload);
            } else {
                response = await apiAvaluos.update(draft.id, payload);
            }

            await refreshList();

            if (mode === "create" && response?.id) {
                await openEdit({ id: response.id });
            } else if (draft.id) {
                await openEdit({ id: draft.id });
            }
        } catch (error) {
            console.error(error);
            alert(error.message || "Error guardando el avalúo.");
        } finally {
            setSaving(false);
        }
    }

    async function marcarTecnicoFinalizado() {
        if (!draft?.id || finishing) return;

        const ok = confirm(
            "¿Marcar revisión técnica como finalizada? Después el técnico ya no podrá editar este avalúo."
        );

        if (!ok) return;

        setFinishing(true);

        try {
            const updated = await apiAvaluos.marcarTecnicoFinalizado(draft.id);

            setDraft((prev) => ({
                ...prev,
                tecnico_finalizado: true,
                fecha_tecnico_finalizado: toDTLocal(updated?.fecha_tecnico_finalizado),
            }));

            await refreshList();
        } catch (error) {
            console.error(error);
            alert(error.message || "No se pudo finalizar la revisión técnica.");
        } finally {
            setFinishing(false);
        }
    }

    async function marcarValuacionTerminada() {
        if (!draft?.id || finishing) return;

        const ok = confirm(
            "¿Marcar valuación como terminada? Después no se podrá editar ningún campo."
        );

        if (!ok) return;

        setFinishing(true);

        try {
            const updated = await apiAvaluos.marcarValuacionTerminada(draft.id);

            setDraft((prev) => ({
                ...prev,
                valuacion_terminada: true,
                fecha_valuacion_terminada: toDTLocal(updated?.fecha_valuacion_terminada),
                fecha_finalizacion: toDTLocal(updated?.fecha_finalizacion),
            }));

            await refreshList();
        } catch (error) {
            console.error(error);
            alert(error.message || "No se pudo marcar la valuación como terminada.");
        } finally {
            setFinishing(false);
        }
    }

    async function abrirBlobPdf(getBlob, setLoading, nombreArchivo) {
        if (!draft?.id) return;

        setLoading(true);

        try {
            const blob = await getBlob(draft.id);

            const pdfBlob = new Blob([blob], {
                type: "application/pdf",
            });

            const url = URL.createObjectURL(pdfBlob);
            window.open(url, "_blank");
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 30 * 60 * 1000);
        } catch (error) {
            console.error(error);
            alert(error.message || `No se pudo generar ${nombreArchivo}.`);
        } finally {
            setLoading(false);
        }
    }

    function resetFilters() {
        setFilters({
            q: "",
            agencia: "Todos",
            rangoDesde: "",
            rangoHasta: "",
        });
    }

    function setHoy() {
        const hoy = toYMDLocal(new Date());

        setFilters((prev) => ({
            ...prev,
            rangoDesde: hoy,
            rangoHasta: hoy,
        }));
    }

    function sortIcon(key) {
        if (sort.key !== key) return <ArrowUpDown className="h-4" />;
        if (sort.dir === "asc") return <ChevronUp className="h-4" />;
        return <ChevronDown className="h-4" />;
    }

    function tableHeaderButton(key, label) {
        return (
            <button
                type="button"
                onClick={() => toggleSort(key)}
                className="inline-flex items-center gap-1 text-xs font-extrabold"
            >
                {label}
                <span className="opacity-70">{sortIcon(key)}</span>
            </button>
        );
    }

    const noPuedeGuardar =
        saving ||
        loadingDetail ||
        readOnlyPorTerminada ||
        (isTecnico && tecnicoBloqueado) ||
        (mostrarClienteOperacion && draft?.cliente_telefono && !telIsOk);

    function renderGenerales() {
        if (!mostrarClienteOperacion) return null;

        return (
            <>
                <SectionTitle
                    icon={User}
                    title="Datos del cliente y solicitud"
                />

                <Field label="Dealer" icon={Building2}>
                    <select
                        value={draft.agencia || ""}
                        onChange={(event) => setDraftField("agencia", event.target.value)}
                        disabled={!isAdmin || bloqueoGeneral}
                        className={[
                            inputBase,
                            inputOk,
                            !isAdmin || bloqueoGeneral ? inputDisabled : "",
                        ].join(" ")}
                    >
                        <option value="" disabled>
                            Selecciona un dealer...
                        </option>

                        {(isAdmin ? DEALERS : userAgencia ? [userAgencia] : DEALERS).map(
                            (dealer) => (
                                <option key={dealer} value={dealer}>
                                    {dealer}
                                </option>
                            )
                        )}
                    </select>
                </Field>

                <Field label="Fecha de avalúo" icon={CalendarDays}>
                    <input
                        type="datetime-local"
                        value={draft.fecha_avaluo}
                        onChange={(event) => setDraftField("fecha_avaluo", event.target.value)}
                        disabled={bloqueoGeneral}
                        className={[
                            inputBase,
                            isInvalid("fecha_avaluo") ? inputBad : inputOk,
                            bloqueoGeneral ? inputDisabled : "",
                        ].join(" ")}
                    />

                    {isInvalid("fecha_avaluo") ? (
                        <div className="mt-2 text-xs font-bold text-red-600">
                            Fecha de avalúo es requerida.
                        </div>
                    ) : null}
                </Field>

                <Field label="Tipo de valuación" icon={ClipboardList}>
                    <select
                        value={draft.tipo_valuacion || "valuacion"}
                        onChange={(event) => setDraftField("tipo_valuacion", event.target.value)}
                        disabled={bloqueoGeneral}
                        className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                    >
                        {TIPOS_VALUACION.map((tipo) => (
                            <option key={tipo.value} value={tipo.value}>
                                {tipo.label}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Nombre del cliente" icon={User}>
                    <input
                        value={draft.cliente_nombre}
                        onChange={(event) => setDraftField("cliente_nombre", event.target.value)}
                        disabled={bloqueoGeneral}
                        className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                        placeholder="Nombre completo"
                    />
                </Field>

                <Field label="Teléfono" icon={User}>
                    <input
                        maxLength={12}
                        value={draft.cliente_telefono}
                        onChange={(event) =>
                            setDraftField(
                                "cliente_telefono",
                                event.target.value.replace(/\D/g, "").slice(0, 12)
                            )
                        }
                        disabled={mode === "edit" || bloqueoGeneral}
                        className={[
                            inputBase,
                            isInvalid("cliente_telefono") || telError ? inputBad : inputOk,
                            mode === "edit" || bloqueoGeneral ? inputDisabled : "",
                        ].join(" ")}
                        placeholder="10 dígitos o 52 + 10 dígitos"
                    />

                    {isInvalid("cliente_telefono") ? (
                        <div className="mt-2 text-xs font-bold text-red-600">
                            Teléfono es requerido.
                        </div>
                    ) : null}

                    {!isInvalid("cliente_telefono") && telError ? (
                        <div className="mt-2 text-xs font-bold text-red-600">{telError}</div>
                    ) : null}
                </Field>

                <Field label="Correo" icon={Mail}>
                    <input
                        type="email"
                        value={draft.cliente_correo}
                        onChange={(event) => setDraftField("cliente_correo", event.target.value)}
                        disabled={bloqueoGeneral}
                        className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                        placeholder="correo@dominio.com"
                    />
                </Field>

                <Field label="Asesor de ventas" icon={UserStar}>
                    <select
                        value={draft.asesor_ventas || ""}
                        onChange={(event) => setDraftField("asesor_ventas", event.target.value)}
                        disabled={bloqueoGeneral}
                        className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                    >
                        <option value="">Selecciona un asesor...</option>

                        {ASESORES.map((asesor) => (
                            <option key={asesor} value={asesor}>
                                {asesor}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Vendedor" icon={UserStar}>
                    <input
                        value={draft.vendedor}
                        onChange={(event) => setDraftField("vendedor", event.target.value)}
                        disabled={bloqueoGeneral}
                        className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                        placeholder="Vendedor responsable"
                    />
                </Field>

                <Field label="Agenda de valuación" icon={CalendarDays}>
                    <input
                        type="datetime-local"
                        value={draft.agenda_valuacion}
                        onChange={(event) => setDraftField("agenda_valuacion", event.target.value)}
                        disabled={bloqueoGeneral}
                        className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                    />
                </Field>
            </>
        );
    }

    function renderVehiculo() {
        if (!mostrarVehiculo) return null;

        const disabledVehiculo = bloqueoGeneral || (isTecnico && !canSeeFull);

        return (
            <>
                <SectionTitle
                    icon={CarFront}
                    title="Datos Generales del Vehículo"
                />

                <Field label="Marca" icon={CarFront}>
                    <select
                        value={draft.marca_auto}
                        onChange={(event) => setDraftField("marca_auto", event.target.value)}
                        disabled={disabledVehiculo}
                        className={[inputBase, inputOk, disabledVehiculo ? inputDisabled : ""].join(" ")}
                    >
                        <option value="">Selecciona una marca...</option>

                        {MARCAS.map((marca) => (
                            <option key={marca} value={marca}>
                                {marca}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Modelo" icon={CarFront}>
                    <input
                        value={draft.modelo}
                        onChange={(event) => setDraftField("modelo", event.target.value)}
                        disabled={disabledVehiculo}
                        className={[inputBase, inputOk, disabledVehiculo ? inputDisabled : ""].join(" ")}
                        placeholder="Ej. Aveo"
                    />
                </Field>

                <Field label="Año modelo" icon={CalendarDays}>
                    <input
                        value={draft.anio_modelo}
                        onChange={(event) =>
                            setDraftField(
                                "anio_modelo",
                                event.target.value.replace(/[^\d]/g, "").slice(0, 4)
                            )
                        }
                        disabled={disabledVehiculo}
                        className={[inputBase, inputOk, disabledVehiculo ? inputDisabled : ""].join(" ")}
                        placeholder="Ej. 2022"
                    />
                </Field>

                <Field label="Versión" icon={NotebookText}>
                    <input
                        value={draft.version}
                        onChange={(event) => setDraftField("version", event.target.value)}
                        disabled={disabledVehiculo}
                        className={[inputBase, inputOk, disabledVehiculo ? inputDisabled : ""].join(" ")}
                        placeholder="Ej. LT, Premier..."
                    />
                </Field>

                <Field label="Placas" icon={BadgeCheck}>
                    <input
                        value={draft.placas}
                        onChange={(event) => setDraftField("placas", event.target.value.toUpperCase())}
                        disabled={disabledVehiculo}
                        className={[inputBase, inputOk, disabledVehiculo ? inputDisabled : ""].join(" ")}
                        placeholder="Ej. YXX123A"
                    />
                </Field>

                <Field label="Serie" icon={Hash}>
                    <input
                        value={draft.serie}
                        onChange={(event) => setDraftField("serie", event.target.value.toUpperCase())}
                        disabled={disabledVehiculo}
                        className={[inputBase, inputOk, disabledVehiculo ? inputDisabled : ""].join(" ")}
                        placeholder="Número de serie"
                    />
                </Field>

                <Field label="Kilometraje" icon={Gauge}>
                    <input
                        value={draft.kilometraje}
                        onChange={(event) => setDraftField("kilometraje", event.target.value)}
                        disabled={disabledVehiculo}
                        className={[inputBase, inputOk, disabledVehiculo ? inputDisabled : ""].join(" ")}
                        placeholder="Ej. 45000"
                    />
                </Field>

                <Field label="Color" icon={Palette}>
                    <input
                        value={draft.color}
                        onChange={(event) => setDraftField("color", event.target.value)}
                        disabled={disabledVehiculo}
                        className={[inputBase, inputOk, disabledVehiculo ? inputDisabled : ""].join(" ")}
                        placeholder="Ej. Blanco"
                    />
                </Field>

                <Field label="Tipo de toma" icon={ClipboardList}>
                    <select
                        value={draft.tipo_toma || ""}
                        onChange={(event) => setDraftField("tipo_toma", event.target.value)}
                        disabled={disabledVehiculo}
                        className={[inputBase, inputOk, disabledVehiculo ? inputDisabled : ""].join(" ")}
                    >
                        <option value="">Selecciona un tipo...</option>

                        {TIPOS_TOMA.map((tipo) => (
                            <option key={tipo.value} value={tipo.value}>
                                {tipo.label}
                            </option>
                        ))}
                    </select>
                </Field>
            </>
        );
    }

    function renderValores() {
        return (
            <>
                {mostrarNegociacion ? (
                    <>
                        <SectionTitle
                            icon={BadgeDollarSign}
                            title="Valores y negociación"
                        />

                        <Field label="Precio estimado cliente" icon={BadgeDollarSign}>
                            <input
                                value={draft.precio_guia}
                                onChange={(event) => setDraftField("precio_guia", event.target.value)}
                                disabled={bloqueoGeneral}
                                className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                                placeholder="Ej. $230,000"
                            />
                        </Field>

                        <Field label="Precio compra Libro Azul" icon={BadgeDollarSign}>
                            <input
                                value={draft.precio_compra_libro_azul}
                                onChange={(event) =>
                                    setDraftField("precio_compra_libro_azul", event.target.value)
                                }
                                disabled={bloqueoGeneral}
                                className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                                placeholder="Ej. $215,000"
                            />
                        </Field>

                        <Field label="Precio venta Libro Azul" icon={BadgeDollarSign}>
                            <input
                                value={draft.precio_venta_libro_azul}
                                onChange={(event) =>
                                    setDraftField("precio_venta_libro_azul", event.target.value)
                                }
                                disabled={bloqueoGeneral}
                                className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                                placeholder="Ej. $255,000"
                            />
                        </Field>

                        <Field label="Oferta inicial" icon={BadgeDollarSign}>
                            <input
                                value={draft.oferta_inicial}
                                onChange={(event) => setDraftField("oferta_inicial", event.target.value)}
                                disabled={bloqueoGeneral}
                                className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                                placeholder="Ej. $220,000"
                            />
                        </Field>

                        <Field label="Oferta final" icon={BadgeDollarSign}>
                            <input
                                value={draft.oferta_final}
                                onChange={(event) => setDraftField("oferta_final", event.target.value)}
                                disabled={bloqueoGeneral}
                                className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                                placeholder="Ej. $235,000"
                            />
                        </Field>
                    </>
                ) : null}

                {mostrarSeguimiento ? (
                    <>
                        <SectionTitle
                            icon={ClipboardList}
                            title="Seguimiento"
                        />

                        <Field label="Origen de valuación" icon={MapPin}>
                            <select
                                value={draft.origen_valuacion || ""}
                                onChange={(event) => setDraftField("origen_valuacion", event.target.value)}
                                disabled={bloqueoGeneral}
                                className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                            >
                                <option value="">Selecciona un origen...</option>

                                {ORIGEN_VALUACION.map((origen) => (
                                    <option key={origen} value={origen}>
                                        {origen}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Fecha toma cuenta" icon={CalendarDays}>
                            <input
                                type="datetime-local"
                                value={draft.fecha_toma_cuenta}
                                onChange={(event) => setDraftField("fecha_toma_cuenta", event.target.value)}
                                disabled={bloqueoGeneral}
                                className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                            />
                        </Field>

                        <Field label="Fecha finalización" icon={CalendarDays}>
                            <input
                                type="datetime-local"
                                value={draft.fecha_finalizacion}
                                onChange={(event) => setDraftField("fecha_finalizacion", event.target.value)}
                                disabled={bloqueoGeneral}
                                className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                            />
                        </Field>

                        <Field label="Etapa del proceso" icon={ClipboardList}>
                            <select
                                value={draft.etapa_proceso || ""}
                                onChange={(event) => setDraftField("etapa_proceso", event.target.value)}
                                disabled={bloqueoGeneral}
                                className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                            >
                                <option value="">Selecciona una etapa...</option>

                                {ETAPAS_PROCESO.map((etapa) => (
                                    <option key={etapa} value={etapa}>
                                        {etapa}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Ganador de subasta" icon={ShieldCheck}>
                            <input
                                value={draft.ganador_subasta}
                                onChange={(event) => setDraftField("ganador_subasta", event.target.value)}
                                disabled={bloqueoGeneral}
                                className={[inputBase, inputOk, bloqueoGeneral ? inputDisabled : ""].join(" ")}
                                placeholder="Nombre del ganador"
                            />
                        </Field>

                        <Field label="Total costo reparación" icon={BadgeDollarSign}>
                            <input
                                value={formatoMoneda(totalReparacion)}
                                readOnly
                                className={[inputBase, inputOk, inputDisabled].join(" ")}
                            />

                            <div className="mt-2 text-xs font-semibold text-slate-500">
                                Incluye mecánica total, conceptos no mecánicos y evidencias.
                            </div>
                        </Field>
                        <Field
                            label="Observaciones"
                            icon={MessageSquareText}
                            className="md:col-span-3"
                        >
                            <textarea
                                value={draft.observaciones}
                                onChange={(event) => setDraftField("observaciones", event.target.value)}
                                disabled={bloqueoGeneral}
                                className={[
                                    inputBase,
                                    inputOk,
                                    "min-h-[110px] resize-y",
                                    bloqueoGeneral ? inputDisabled : "",
                                ].join(" ")}
                                placeholder="Observaciones adicionales de la valuación..."
                            />
                        </Field>

                        <Field
                            label="Comentarios para ticket"
                            icon={MessageSquareText}
                            className="md:col-span-3"
                        >
                            <textarea
                                value={draft.comentarios}
                                onChange={(event) => setDraftField("comentarios", event.target.value)}
                                disabled={bloqueoGeneral}
                                className={[
                                    inputBase,
                                    inputOk,
                                    "min-h-[90px] resize-y",
                                    bloqueoGeneral ? inputDisabled : "",
                                ].join(" ")}
                                placeholder="Valuación"
                            />

                            <div className="mt-2 text-xs font-semibold text-slate-500">
                                Este comentario solo aparece en el ticket.
                            </div>
                        </Field>
                    </>
                ) : null}
            </>
        );
    }

    function renderTecnica() {
        if (!mostrarConceptos) return null;

        return (
            <>
                <SectionTitle
                    icon={Wrench}
                    title="Valuación técnica"
                    subtitle={
                        isTecnico && !canSeeFull
                            ? "El técnico captura conceptos; mecánica se totaliza en un solo campo"
                            : "Conceptos, clasificación y costos"
                    }
                />

                <Field label="Precio total de mecánica" icon={BadgeDollarSign}>
                    <input
                        value={draft.costo_mecanica_total}
                        onChange={(event) =>
                            setDraftField("costo_mecanica_total", limpiarTextoMonto(event.target.value))
                        }
                        disabled={bloqueoGeneral}
                        className={[
                            inputBase,
                            inputOk,
                            bloqueoGeneral ? inputDisabled : "",
                        ].join(" ")}
                        placeholder="0.00"
                        inputMode="decimal"
                    />

                    <div className="mt-2 text-xs font-semibold text-slate-500">
                        Este importe alimenta el total de reparación y el checklist.
                    </div>
                </Field>

                <Field
                    label="Comentarios técnicos para checklist"
                    icon={MessageSquareText}
                    className="md:col-span-2"
                >
                    <textarea
                        value={draft.comentarios_checklist}
                        onChange={(event) =>
                            setDraftField("comentarios_checklist", event.target.value)
                        }
                        disabled={bloqueoGeneral}
                        className={[
                            inputBase,
                            inputOk,
                            "min-h-[105px] resize-y",
                            bloqueoGeneral ? inputDisabled : "",
                        ].join(" ")}
                        placeholder="Comentarios del técnico para el checklist de 100 puntos..."
                    />
                </Field>

                <div className="md:col-span-3">
                    <Field label="Conceptos" icon={ClipboardList}>
                        <div className="space-y-4">
                            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-slate-950 text-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-bold">
                                                    Concepto / descripción
                                                </th>
                                                <th className="px-4 py-3 text-left font-bold">
                                                    Tipo
                                                </th>
                                                {canSeeFull ? (
                                                    <th className="px-4 py-3 text-left font-bold">
                                                        Costo
                                                    </th>
                                                ) : null}
                                                <th className="px-4 py-3 text-center font-bold">
                                                    Acción
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-200">
                                            {(draft.conceptos || []).map((concepto, index) => (
                                                <tr key={`concepto-${concepto.id || index}`}>
                                                    <td className="min-w-[320px] px-4 py-3 align-top">
                                                        <input
                                                            value={concepto.descripcion}
                                                            onChange={(event) =>
                                                                actualizarConcepto(index, "descripcion", event.target.value)
                                                            }
                                                            disabled={bloqueoGeneral}
                                                            className={[
                                                                inputBase,
                                                                inputOk,
                                                                bloqueoGeneral ? inputDisabled : "",
                                                            ].join(" ")}
                                                            placeholder="Ej. Cambio de balatas, golpe en fascia..."
                                                        />
                                                    </td>

                                                    <td className="min-w-[170px] px-4 py-3 align-top">
                                                        <select
                                                            value={concepto.tipo_concepto || "mecanico"}
                                                            onChange={(event) =>
                                                                actualizarConcepto(index, "tipo_concepto", event.target.value)
                                                            }
                                                            disabled={bloqueoGeneral}
                                                            className={[
                                                                inputBase,
                                                                inputOk,
                                                                bloqueoGeneral ? inputDisabled : "",
                                                            ].join(" ")}
                                                        >
                                                            {TIPOS_CONCEPTO.map((tipo) => (
                                                                <option key={tipo.value} value={tipo.value}>
                                                                    {tipo.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>

                                                    {canSeeFull ? (
                                                        <td className="min-w-[180px] px-4 py-3 align-top">
                                                            <input
                                                                value={concepto.costo}
                                                                onChange={(event) =>
                                                                    actualizarConcepto(index, "costo", event.target.value)
                                                                }
                                                                disabled={
                                                                    bloqueoGeneral ||
                                                                    concepto.tipo_concepto === "mecanico"
                                                                }
                                                                className={[
                                                                    inputBase,
                                                                    inputOk,
                                                                    bloqueoGeneral ||
                                                                        concepto.tipo_concepto === "mecanico"
                                                                        ? inputDisabled
                                                                        : "",
                                                                ].join(" ")}
                                                                placeholder={
                                                                    concepto.tipo_concepto === "mecanico"
                                                                        ? "Usar total mecánica"
                                                                        : "0.00"
                                                                }
                                                                inputMode="decimal"
                                                            />
                                                        </td>
                                                    ) : null}

                                                    <td className="px-4 py-3 text-center align-top">
                                                        <button
                                                            type="button"
                                                            onClick={() => eliminarConcepto(index)}
                                                            disabled={bloqueoGeneral}
                                                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                                                            title="Eliminar concepto"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                        <tfoot className="border-t border-slate-200 bg-yellow-50">
                                            <tr>
                                                <td className="px-4 py-3 font-extrabold text-slate-950">
                                                    Total Mecánica
                                                </td>
                                                <td className="px-4 py-3 font-extrabold text-left text-slate-950">
                                                    {formatoMoneda(draft.costo_mecanica_total)}
                                                </td>
                                                {canSeeFull ? (
                                                    <>
                                                        <td className="px-4 py-3 text-left font-extrabold text-slate-950">
                                                            Total Reparación
                                                        </td>
                                                        <td className="px-1 py-3 text-left font-extrabold text-slate-950">
                                                            {formatoMoneda(totalReparacion)}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <td className="px-4 py-3 text-left font-extrabold text-slate-950">
                                                        Total Reparación: {formatoMoneda(totalReparacion)}
                                                    </td>
                                                )}
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={agregarConcepto}
                                disabled={bloqueoGeneral}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 font-extrabold text-slate-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar concepto
                            </button>
                        </div>
                    </Field>
                </div>
            </>
        );
    }

    function renderEvidencias() {
        if (!mostrarEvidencias) return null;

        return (
            <>
                <SectionTitle
                    icon={Paperclip}
                    title="Evidencias"
                />

                <Field className="md:col-span-3">
                    <div className="space-y-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={(event) => {
                                handleAddFiles(event.target.files);
                                event.target.value = "";
                            }}
                        />

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={bloqueoGeneral}
                            className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-yellow-500/50 bg-yellow-50 px-4 py-6 text-slate-950 hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <UploadCloud className="h-6 w-6 text-yellow-700" />

                            <div className="text-left">
                                <div className="text-sm font-extrabold">
                                    Tomar foto o subir evidencia
                                </div>

                                <div className="text-xs font-semibold text-slate-500">
                                    Después de subir la imagen captura categoría y costo.
                                </div>
                            </div>
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                                Total evidencias: {totalEvidenciasDraft}
                            </span>

                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-slate-950">
                                Costo evidencias: {formatoMoneda(totalEvidencias)}
                            </span>
                        </div>

                        {(draft.evidencias_guardadas?.length || 0) > 0 ? (
                            <div>
                                <div className="mb-2 text-sm font-extrabold text-slate-950">
                                    Evidencias guardadas
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {draft.evidencias_guardadas.map((item) => (
                                        <EvidenceCard
                                            key={`guardada-${item.id || item.url}`}
                                            item={item}
                                            disabled={bloqueoGeneral}
                                            onRemove={() => removeSavedEvidence(item.id)}
                                            onChange={(field, value) =>
                                                updateSavedEvidence(item.id, field, value)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {(draft.evidencias_front?.length || 0) > 0 ? (
                            <div>
                                <div className="mb-2 text-sm font-extrabold text-slate-950">
                                    Evidencias nuevas
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                    {draft.evidencias_front.map((item) => (
                                        <EvidenceCard
                                            key={item._tmpId}
                                            item={item}
                                            disabled={bloqueoGeneral}
                                            onRemove={() => removeFrontEvidence(item._tmpId)}
                                            onChange={(field, value) =>
                                                updateFrontEvidence(item._tmpId, field, value)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {totalEvidenciasDraft === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-500">
                                Aún no hay evidencias en este avalúo.
                            </div>
                        ) : null}
                    </div>
                </Field>
            </>
        );
    }

    function renderChecklist() {
        if (!mostrarChecklist || checklistVisible.length === 0) return null;

        return (
            <>
                <SectionTitle
                    icon={ClipboardList}
                    title={
                        isTecnico && !canSeeFull
                            ? "Checklist técnico: puntos 20 - 89"
                            : isValuador && !isAdmin
                                ? "Checklist valuador: puntos 1 - 19"
                                : "Checklist 100 puntos"
                    }
                />

                <Field label="Checklist" icon={ClipboardList} className="md:col-span-3">
                    <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        <button
                            type="button"
                            onClick={() =>
                                updateChecklistMasivo(checklistVisible, "inspeccion_realizada")
                            }
                            disabled={bloqueoGeneral}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-extrabold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Marcar inspección
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                updateChecklistMasivo(checklistVisible, "servicio_realizado")
                            }
                            disabled={bloqueoGeneral}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Marcar realizado
                        </button>

                        <button
                            type="button"
                            onClick={() => updateChecklistMasivo(checklistVisible, "na")}
                            disabled={bloqueoGeneral}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Marcar N/A
                        </button>

                        <button
                            type="button"
                            onClick={() => updateChecklistMasivo(checklistVisible, "")}
                            disabled={bloqueoGeneral}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <X className="h-4 w-4" />
                            Limpiar visibles
                        </button>
                    </div>

                    <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-50 px-4 py-3 text-xs font-semibold text-slate-700">
                        Los puntos 90-92 usan Sí / No / N/A. El punto 93 guarda una fecha.
                        Los puntos 94-100 usan Sí realizado / No realizado / N/A.
                        Los puntos 76 y 79 permiten capturar espesor DD, ID, IT y DT en mm.
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200">
                        <div className="max-h-[560px] overflow-auto">
                            <table className="min-w-full text-sm">
                                <thead className="sticky top-0 z-10 bg-slate-950 text-white">
                                    <tr>
                                        <th className="w-20 px-4 py-3 text-left font-bold">#</th>

                                        <th className="min-w-[320px] px-4 py-3 text-left font-bold">
                                            Punto
                                        </th>

                                        <th className="min-w-[560px] px-4 py-3 text-left font-bold">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {checklistVisible.map((item) => {
                                        const valorActual = obtenerEstadoChecklist(item.numero);
                                        const etiquetaActual = labelEstadoChecklist(item.numero, valorActual);
                                        const opciones = opcionesChecklist(item.numero);
                                        const tieneValorFecha = esPuntoFecha(item.numero) && Boolean(obtenerValorChecklist(item.numero));
                                        const tieneValor = Boolean(valorActual) || tieneValorFecha;

                                        return (
                                            <tr
                                                key={item.numero}
                                                className={tieneValor ? "bg-yellow-50/30" : "bg-white"}
                                            >
                                                <td className="px-4 py-3 align-top font-extrabold text-slate-950">
                                                    {item.numero}
                                                </td>

                                                <td className="px-4 py-3 align-top font-semibold text-slate-700">
                                                    {item.descripcion}

                                                    {item.numero === 93 ? (
                                                        obtenerValorChecklist(item.numero) ? (
                                                            <div className="mt-1 text-xs font-bold text-slate-400">
                                                                Fecha capturada: {obtenerValorChecklist(item.numero)}
                                                            </div>
                                                        ) : (
                                                            <div className="mt-1 text-xs font-bold text-red-400">
                                                                Sin fecha
                                                            </div>
                                                        )
                                                    ) : valorActual ? (
                                                        <div className="mt-1 text-xs font-bold text-slate-400">
                                                            Estado seleccionado: {etiquetaActual}
                                                        </div>
                                                    ) : (
                                                        <div className="mt-1 text-xs font-bold text-red-400">
                                                            Sin marcar
                                                        </div>
                                                    )}

                                                    {esPuntoEspesor(item.numero) ? (
                                                        <div className="mt-2 text-xs font-semibold text-slate-500">
                                                            Captura adicional: DD, ID, IT, DT en milímetros.
                                                        </div>
                                                    ) : null}
                                                </td>

                                                <td className="px-4 py-3 align-top">
                                                    {item.numero === 93 ? (
                                                        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
                                                            <input
                                                                type="date"
                                                                value={obtenerValorChecklist(item.numero) || ""}
                                                                onChange={(event) =>
                                                                    updateChecklistFecha(item.numero, event.target.value)
                                                                }
                                                                disabled={bloqueoGeneral}
                                                                className={[
                                                                    inputBase,
                                                                    inputOk,
                                                                    bloqueoGeneral ? inputDisabled : "",
                                                                ].join(" ")}
                                                            />

                                                            {obtenerValorChecklist(item.numero) ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateChecklistFecha(item.numero, "")}
                                                                    disabled={bloqueoGeneral}
                                                                    className="inline-flex min-w-[90px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                    Quitar
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2">
                                                            {opciones.map((estado) => {
                                                                const activo = valorActual === estado.value;

                                                                return (
                                                                    <button
                                                                        key={estado.value}
                                                                        type="button"
                                                                        onClick={() =>
                                                                            updateChecklist(
                                                                                item.numero,
                                                                                activo ? "" : estado.value
                                                                            )
                                                                        }
                                                                        disabled={bloqueoGeneral}
                                                                        className={[
                                                                            "inline-flex min-w-[115px] items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-extrabold transition",
                                                                            activo
                                                                                ? estado.classNameActivo
                                                                                : "border-slate-200 bg-white text-slate-500 hover:border-yellow-400 hover:bg-yellow-50 hover:text-slate-950",
                                                                            bloqueoGeneral
                                                                                ? "cursor-not-allowed opacity-50"
                                                                                : "",
                                                                        ].join(" ")}
                                                                    >
                                                                        <span
                                                                            className={[
                                                                                "flex h-4 w-4 items-center justify-center rounded border",
                                                                                activo
                                                                                    ? "border-current bg-current"
                                                                                    : "border-slate-300 bg-white",
                                                                            ].join(" ")}
                                                                        >
                                                                            {activo ? (
                                                                                <CheckCircle2 className="h-3 w-3 text-white" />
                                                                            ) : null}
                                                                        </span>

                                                                        {estado.label}
                                                                    </button>
                                                                );
                                                            })}

                                                            {valorActual ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateChecklist(item.numero, "")}
                                                                    disabled={bloqueoGeneral}
                                                                    className="inline-flex min-w-[90px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    <X className="h-3.5 w-3.5" />
                                                                    Quitar
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    )}

                                                    {esPuntoEspesor(item.numero) ? (
                                                        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                            <div className="mb-2 text-xs font-extrabold text-slate-700">
                                                                De espesor en mm
                                                            </div>

                                                            <div className="grid gap-2 sm:grid-cols-4">
                                                                {[
                                                                    ["dd", "DD"],
                                                                    ["id", "ID"],
                                                                    ["it", "IT"],
                                                                    ["dt", "DT"],
                                                                ].map(([campo, label]) => (
                                                                    <div key={campo}>
                                                                        <label className="mb-1 block text-xs font-bold text-slate-500">
                                                                            {label}
                                                                        </label>

                                                                        <input
                                                                            value={obtenerCampoEspesor(item.numero, campo)}
                                                                            onChange={(event) =>
                                                                                updateChecklistEspesor(
                                                                                    item.numero,
                                                                                    campo,
                                                                                    event.target.value
                                                                                )
                                                                            }
                                                                            disabled={bloqueoGeneral}
                                                                            className={[
                                                                                inputBase,
                                                                                inputOk,
                                                                                bloqueoGeneral ? inputDisabled : "",
                                                                            ].join(" ")}
                                                                            placeholder="0"
                                                                            inputMode="decimal"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Field>
            </>
        );
    }

    function renderActiveTab() {
        if (!draft) return null;

        switch (activeTab) {
            case "generales":
                return renderGenerales();
            case "vehiculo":
                return renderVehiculo();
            case "valores":
                return renderValores();
            case "tecnica":
                return renderTecnica();
            case "evidencias":
                return renderEvidencias();
            case "checklist":
                return renderChecklist();
            default:
                return renderGenerales();
        }
    }

    return (
        <div
            className="w-full space-y-6"
            style={{
                "--chevy-gold": CHEVY_GOLD,
                "--chevy-gold-dark": CHEVY_GOLD_DARK,
                "--chevy-black": CHEVY_BLACK,
                "--chevy-dark": CHEVY_DARK,
                "--chevy-soft": CHEVY_SOFT,
            }}
        >
            {/* Encabezado */}
            <section className="relative overflow-hidden rounded-lg bg-[linear-gradient(135deg,#0B1120_0%,#0F172A_60%,#0D1526_100%)] px-5 py-5 shadow-xl sm:px-7 lg:px-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_24%)]" />
               <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="inline-flex items-center rounded border border-[#C9A75D]/40 bg-[#C9A75D]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#E7CF98]">
                            Seminuevos
                        </div>
                        <h1 className="mt-3 text-[2.2rem] font-black leading-none tracking-tight text-white sm:text-[3rem] lg:text-[3.4rem]">
                            Avalúos Chevrolet
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 self-end">
                        <img src={logoChevrolet} alt="Chevrolet" className="h-7 w-auto object-contain sm:h-8" />
                        <div className="h-8 w-px bg-white/30" />
                        <img src={logoRyr} alt="Grupo R&R" className="h-7 w-auto object-contain sm:h-8" />
                    </div>
                </div>
            </section>

            {/* Filtros */}
            <div className="overflow-hidden rounded-2xl border border-yellow-500/30 bg-white shadow-sm">
                <div className="border-t border-yellow-500/20 bg-yellow-50/70 px-4 py-3">
                    <div className="grid gap-3 md:grid-cols-12">
                        <div className="md:col-span-6">
                            <FilterBlock label="Búsqueda">
                                <div className="flex items-center gap-2 rounded-xl border border-yellow-500/40 bg-white px-3 py-2 shadow-sm">
                                    <Search className="h-4 w-4 text-yellow-700" />
                                    <input
                                        value={filters.q}
                                        onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
                                        placeholder="Buscar por cliente, teléfono, placas, serie, modelo, asesor..."
                                        className="w-full text-sm font-semibold text-slate-950 outline-none placeholder:text-slate-400"
                                    />
                                    {filters.q ? (
                                        <button type="button" onClick={() => setFilters((prev) => ({ ...prev, q: "" }))}
                                            className="rounded-lg p-1 text-slate-600 hover:bg-red-50 hover:text-red-600">
                                            <X className="h-4 w-4" />
                                        </button>
                                    ) : null}
                                </div>
                            </FilterBlock>
                        </div>

                        <div className="md:col-span-3">
                            <FilterBlock label="Dealer">
                                <select value={filters.agencia}
                                    onChange={(event) => setFilters((prev) => ({ ...prev, agencia: event.target.value }))}
                                    className="w-full rounded-xl border border-yellow-500/40 bg-white px-3 py-2 text-sm font-semibold text-slate-950 shadow-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200">
                                    {dealers.map((dealer) => <option key={dealer} value={dealer}>{dealer}</option>)}
                                </select>
                            </FilterBlock>
                        </div>

                        <div className="md:col-span-3">
                            <FilterBlock label="Acciones">
                                <div className="grid grid-cols-3 gap-2">
                                    <button type="button" onClick={setHoy}
                                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-950 px-2 py-2 text-xs font-bold text-white hover:bg-slate-800">
                                        <CalendarDays className="h-3.5 w-3.5" />Hoy
                                    </button>
                                    <button type="button" onClick={resetFilters}
                                        className="inline-flex items-center justify-center gap-1 rounded-xl border border-yellow-500/50 bg-white px-2 py-2 text-xs font-bold text-slate-950 hover:bg-yellow-100">
                                        <X className="h-3.5 w-3.5" />Limpiar
                                    </button>
                                    <button type="button" onClick={openCreate} disabled={auth.loadingSesion}
                                        className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#C9A75D] px-2 py-2 text-xs font-black text-slate-950 shadow-lg shadow-black/20 transition hover:bg-[#d8b96f] disabled:cursor-not-allowed disabled:opacity-60">
                                        {auth.loadingSesion ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                                        Nuevo
                                    </button>
                                </div>
                            </FilterBlock>
                        </div>

                        <div className="md:col-span-6">
                            <FilterBlock label="Desde">
                                <input type="date" value={filters.rangoDesde}
                                    onChange={(event) => setFilters((prev) => ({ ...prev, rangoDesde: event.target.value }))}
                                    className="w-full rounded-xl border border-yellow-500/40 bg-white px-3 py-2 text-sm font-semibold text-slate-950 shadow-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200" />
                            </FilterBlock>
                        </div>

                        <div className="md:col-span-6">
                            <FilterBlock label="Hasta">
                                <input type="date" value={filters.rangoHasta}
                                    onChange={(event) => setFilters((prev) => ({ ...prev, rangoHasta: event.target.value }))}
                                    className="w-full rounded-xl border border-yellow-500/40 bg-white px-3 py-2 text-sm font-semibold text-slate-950 shadow-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200" />
                            </FilterBlock>
                        </div>
                    </div>
                </div>
            </div>

            <MobileCardList
                rows={sorted}
                loading={loadingList}
                onEdit={openEdit}
                onContext={onRowContextMenu}
            />

            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg lg:block">
                <div className="overflow-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="border-b border-yellow-500 bg-slate-950 text-xs text-white">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-3">
                                    {tableHeaderButton("fecha_avaluo", "Fecha avalúo")}
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Dealer
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Asesor
                                </th>
                                <th className="whitespace-nowrap px-4 py-3">
                                    {tableHeaderButton("cliente_nombre", "Cliente")}
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Teléfono
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Vehículo
                                </th>
                                <th className="whitespace-nowrap px-4 py-3">
                                    {tableHeaderButton("placas", "Placas")}
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Serie
                                </th>
                                <th className="whitespace-nowrap px-4 py-3">
                                    {tableHeaderButton("kilometraje", "KM")}
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Tipo valuación
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Tipo toma
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Origen
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Costo reparación
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Oferta inicial
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Oferta final
                                </th>
                                <th className="whitespace-nowrap px-4 py-3">
                                    {tableHeaderButton("evidencias_count", "Evidencias")}
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Estado
                                </th>
                                <th className="whitespace-nowrap px-4 py-3 text-xs font-extrabold">
                                    Técnico
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200">
                            {loadingList ? (
                                <>
                                    {Array.from({ length: 8 }).map((_, index) => (
                                        <SkeletonRow key={index} />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {sorted.map((row) => (
                                        <tr
                                            key={row.id}
                                            onDoubleClick={() => openEdit(row)}
                                            onContextMenu={(event) => onRowContextMenu(event, row)}
                                            className="cursor-pointer bg-white transition hover:bg-yellow-50/70"
                                            title="Doble clic para editar"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800">
                                                {row.fecha_avaluo
                                                    ? toDTLocal(row.fecha_avaluo).replace("T", " ")
                                                    : "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-950">
                                                {row.agencia || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                                {row.asesor_ventas || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-950">
                                                {row?.cliente?.nombre || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                                {row?.cliente?.telefono || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                                {[row.marca_auto, row.modelo, row.anio_modelo]
                                                    .filter(Boolean)
                                                    .join(" ") || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-950">
                                                {row.placas || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                                {row.serie || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                                {row.kilometraje || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                                {getOptionLabel(TIPOS_VALUACION, row.tipo_valuacion)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                                {getOptionLabel(TIPOS_TOMA, row.tipo_toma)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                                {row.origen_valuacion || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-950">
                                                {formatoMoneda(row.costo_reparacion)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                                {row.oferta_inicial || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-950">
                                                {row.oferta_final || "—"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                                                {row?.evidencias?.length || 0}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span
                                                    className={[
                                                        "rounded-full border px-3 py-1 text-xs font-bold",
                                                        row.valuacion_terminada
                                                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                            : "border-yellow-500/40 bg-yellow-50 text-slate-950",
                                                    ].join(" ")}
                                                >
                                                    {row.valuacion_terminada
                                                        ? "Terminada"
                                                        : row.etapa_proceso || "En proceso"}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                <span
                                                    className={[
                                                        "rounded-full border px-3 py-1 text-xs font-bold",
                                                        row.tecnico_finalizado
                                                            ? "border-blue-200 bg-blue-50 text-blue-700"
                                                            : "border-slate-200 bg-slate-50 text-slate-600",
                                                    ].join(" ")}
                                                >
                                                    {row.tecnico_finalizado ? "Finalizado" : "Pendiente"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                    {sorted.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={18}
                                                className="px-4 py-10 text-center text-slate-600"
                                            >
                                                No hay resultados con esos filtros.
                                            </td>
                                        </tr>
                                    ) : null}
                                </>
                            )}
                        </tbody>
                    </table>

                    <ContextMenu
                        ctxMenu={ctxMenu}
                        canDelete={canDelete}
                        onDelete={async (row) => {
                            await eliminarAvaluo(row);
                            setCtxMenu({ open: false, x: 0, y: 0, row: null });
                        }}
                        onClose={() =>
                            setCtxMenu({ open: false, x: 0, y: 0, row: null })
                        }
                    />
                </div>
            </div>

            <Modal
                open={openModal}
                title={mode === "create" ? "Nuevo avalúo" : `Avalúo • ${draft?.id || ""}`}
                subtitle={
                    draft?.valuacion_terminada
                        ? "Valuación terminada: solo lectura"
                        : tecnicoBloqueado
                            ? "Revisión técnica finalizada: solo lectura para técnico"
                            : "Gestión de avalúo Chevrolet"
                }
                onClose={closeModal}
                footer={
                    <>
                        {draft?.valuacion_terminada ? (
                            <div className="mr-auto inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
                                <Lock className="h-4 w-4" />
                                Valuación terminada
                            </div>
                        ) : null}

                        {tecnicoBloqueado && !draft?.valuacion_terminada ? (
                            <div className="mr-auto inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                                <Lock className="h-4 w-4" />
                                Técnico finalizado
                            </div>
                        ) : null}

                        {mode === "edit" && draft?.id ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() =>
                                        abrirBlobPdf(
                                            apiAvaluos.ticketPdf,
                                            setPrintingTicket,
                                            `ticket_avaluo_${draft.id}.pdf`
                                        )
                                    }
                                    disabled={printingTicket}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-100 disabled:opacity-60"
                                >
                                    {printingTicket ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Printer className="h-4 w-4" />
                                    )}
                                    Ticket
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        abrirBlobPdf(
                                            apiAvaluos.checklistPdf,
                                            setPrintingChecklist,
                                            `checklist_100_avaluo_${draft.id}.pdf`
                                        )
                                    }
                                    disabled={printingChecklist}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-100 disabled:opacity-60"
                                >
                                    {printingChecklist ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ClipboardList className="h-4 w-4" />
                                    )}
                                    Checklist 100 puntos
                                </button>
                            </>
                        ) : null}

                        {mode === "edit" &&
                            draft?.id &&
                            (isTecnico || canSeeFull) &&
                            !draft?.tecnico_finalizado &&
                            !draft?.valuacion_terminada ? (
                            <button
                                type="button"
                                onClick={marcarTecnicoFinalizado}
                                disabled={finishing || saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
                            >
                                {finishing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Wrench className="h-4 w-4" />
                                )}
                                Técnico finalizado
                            </button>
                        ) : null}

                        {mode === "edit" &&
                            draft?.id &&
                            canSeeFull &&
                            !draft?.valuacion_terminada ? (
                            <button
                                type="button"
                                onClick={marcarValuacionTerminada}
                                disabled={finishing || saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                                {finishing ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4" />
                                )}
                                Valuación terminada
                            </button>
                        ) : null}

                        <button
                            type="button"
                            onClick={closeModal}
                            disabled={saving || finishing}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                        >
                            <X className="h-4 w-4" />
                            Cancelar
                        </button>

                        {!readOnlyPorTerminada && !(isTecnico && tecnicoBloqueado) ? (
                            <button
                                type="button"
                                onClick={save}
                                disabled={noPuedeGuardar}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-60"
                            >
                                {saving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {saving ? "Guardando..." : "Guardar cambios"}
                            </button>
                        ) : null}
                    </>
                }
            >
                {loadingDetail ? (
                    <ModalSkeleton />
                ) : !draft ? null : (
                    <>
                        <ModalTabs
                            tabs={modalTabs}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />

                        <div className="grid gap-3 md:grid-cols-3">
                            {renderActiveTab()}

                            {readOnlyPorTerminada ? (
                                <div className="md:col-span-3">
                                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                                        Esta valuación fue marcada como terminada. Ningún campo puede editarse.
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}