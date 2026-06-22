import { useEffect, useMemo, useState } from "react";
import {
    Search,
    X,
    CalendarDays,
    ArrowUpDown,
    ChevronDown,
    ChevronUp,
    Loader2,
    MessageSquareText,
    ClipboardList,
    Star,
    CheckCircle2,
    XCircle,
    FileText,
    RefreshCcw,
    Eye,
    BadgeCheck,
} from "lucide-react";

import { apiServicio } from "../../lib/apiServicio";

const BRAND_BLACK = "#111111";
const BRAND_GOLD_DARK = "#9F7E2F";

function normalizeStr(value) {
    return String(value ?? "").trim();
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
            {Array.from({ length: 10 }).map((_, index) => (
                <td key={index} className="px-4 py-3">
                    <div className="h-4 w-24 rounded bg-slate-200/70" />
                </td>
            ))}
        </tr>
    );
}

function ModalSkeleton() {
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-lg border border-black/10 bg-neutral-200/50 p-4"
                >
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="mt-3 h-10 w-full rounded-lg" />
                </div>
            ))}

            <div className="rounded-lg border border-black/10 bg-neutral-200/50 p-4 md:col-span-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-3 h-24 w-full rounded-lg" />
            </div>
        </div>
    );
}

function Modal({ open, title, onClose, children, footer }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60]">
            <div
                className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="absolute inset-0 flex items-end justify-center p-3 sm:items-center">
                <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-[#C9A75D] bg-neutral-100 shadow-2xl">
                    <div
                        className="flex items-center justify-between gap-3 px-5 py-4"
                        style={{ background: `linear-gradient(135deg, ${BRAND_BLACK}, ${BRAND_GOLD_DARK})` }}
                    >
                        <div className="min-w-0">
                            <div className="truncate text-base font-extrabold text-white">
                                {title}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white hover:bg-white/15"
                            aria-label="Cerrar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="max-h-[72vh] overflow-auto p-5">{children}</div>

                    {footer ? (
                        <div className="flex flex-col gap-2 border-t border-black/10 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
                            {footer}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function Field({ label, icon: Icon, children }) {
    return (
        <div className="rounded-lg border border-black/10 bg-neutral-200/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#111111]">
                {Icon ? <Icon className="h-4 w-4" /> : null}
                <span>{label}</span>
            </div>

            {children}
        </div>
    );
}

function FilterBlock({ label, children }) {
    return (
        <div className="rounded-lg">
            <div className="mb-2 text-xs font-extrabold tracking-wide text-[#C9A75D]">
                {label}
            </div>

            {children}
        </div>
    );
}

function toDTLocal(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const pad = (number) => String(number).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toYMDLocal(value) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const pad = (number) => String(number).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}`;
}

function ymdToInt(ymd) {
    if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;

    return Number(ymd.replaceAll("-", ""));
}

function obtenerPromedio(row) {
    const valores = [
        Number(row?.satisfaccion_agendar_cita || 0),
        Number(row?.satisfaccion_exp_area_servicio || 0),
    ].filter((number) => Number.isFinite(number) && number > 0);

    if (!valores.length) return 0;

    const suma = valores.reduce((acc, number) => acc + number, 0);

    return suma / valores.length;
}

function getScoreClasses(value) {
    const numero = Number(value || 0);

    if (numero >= 5) {
        return "border-emerald-300 bg-emerald-100 text-emerald-700";
    }

    if (numero >= 4) {
        return "border-sky-300 bg-sky-100 text-sky-700";
    }

    if (numero >= 3) {
        return "border-amber-300 bg-amber-100 text-amber-700";
    }

    if (numero >= 2) {
        return "border-orange-300 bg-orange-100 text-orange-700";
    }

    if (numero >= 1) {
        return "border-red-300 bg-red-100 text-red-700";
    }

    return "border-slate-300 bg-slate-100 text-slate-500";
}

function ScorePill({ value }) {
    const numero = Number(value || 0);

    return (
        <span
            className={[
                "inline-flex min-w-[46px] items-center justify-center rounded-full border px-3 py-1 text-xs font-extrabold",
                getScoreClasses(numero),
            ].join(" ")}
        >
            {numero > 0 ? numero : "—"}
        </span>
    );
}

function BooleanPill({ value }) {
    const activo = Boolean(value);

    return (
        <span
            className={[
                "inline-flex items-center justify-center gap-1 rounded-full border px-3 py-1 text-xs font-extrabold",
                activo
                    ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                    : "border-red-300 bg-red-100 text-red-700",
            ].join(" ")}
        >
            {activo ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
                <XCircle className="h-3.5 w-3.5" />
            )}

            {activo ? "Sí" : "No"}
        </span>
    );
}

function MobileCardList({ rows, loading, onOpen }) {
    return (
        <div className="lg:hidden">
            <div className="overflow-hidden rounded-lg bg-white/[0.03] shadow-lg">
                {loading ? (
                    <div className="grid gap-3 p-3 sm:grid-cols-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-black/10 bg-white p-4 shadow-sm"
                            >
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="mt-3 h-4 w-28" />
                                <Skeleton className="mt-3 h-4 w-56" />
                                <Skeleton className="mt-4 h-8 w-24 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="px-4 py-10 text-center text-[#C9A75D]">
                        No hay resultados con esos filtros.
                    </div>
                ) : (
                    <div className="grid gap-3 p-3 sm:grid-cols-2">
                        {rows.map((row) => {
                            const fecha = row.creado ? toDTLocal(row.creado) : "—";
                            const promedio = obtenerPromedio(row).toFixed(1);

                            return (
                                <div
                                    key={row.id_encuesta}
                                    onClick={() => onOpen(row)}
                                    className="cursor-pointer rounded-lg border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-md"
                                    title="Toca para ver detalle"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 text-xs font-extrabold text-[#111111]">
                                                <CalendarDays className="h-4 w-4" />
                                                <span className="truncate">{fecha}</span>
                                            </div>

                                            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[#111111]">
                                                <FileText className="h-4 w-4" />
                                                <span className="truncate">
                                                    OS: {row.numero_OS || "—"}
                                                </span>
                                            </div>

                                            <div className="mt-1 flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <BadgeCheck className="h-4 w-4 text-[#C9A75D]" />
                                                <span className="truncate">
                                                    Asesor: {row.asesor || "—"}
                                                </span>
                                            </div>
                                        </div>

                                        <ScorePill value={promedio} />
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        <div className="rounded-lg bg-slate-100 p-2">
                                            <p className="text-[11px] font-bold text-slate-500">
                                                Agendar cita
                                            </p>
                                            <ScorePill value={row.satisfaccion_agendar_cita} />
                                        </div>

                                        <div className="rounded-lg bg-slate-100 p-2">
                                            <p className="text-[11px] font-bold text-slate-500">
                                                Área servicio
                                            </p>
                                            <ScorePill value={row.satisfaccion_exp_area_servicio} />
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-start gap-2 text-xs font-semibold text-slate-600">
                                        <MessageSquareText className="mt-0.5 h-4 w-4 shrink-0 text-[#111111]" />
                                        <span className="line-clamp-2">
                                            {row.comentario || "Sin comentario."}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function EncuestasServicio() {
    const [encuestas, setEncuestas] = useState([]);

    const [filters, setFilters] = useState({
        q: "",
        rangoDesde: "",
        rangoHasta: "",
        calificacion: "Todos",
    });

    const [sort, setSort] = useState({
        key: "creado",
        dir: "desc",
    });

    const [openModal, setOpenModal] = useState(false);
    const [detalle, setDetalle] = useState(null);

    const [loadingList, setLoadingList] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [errorList, setErrorList] = useState("");

    function toggleSort(key) {
        setSort((prev) => {
            if (prev.key !== key) {
                return {
                    key,
                    dir: "asc",
                };
            }

            return {
                key,
                dir: prev.dir === "asc" ? "desc" : "asc",
            };
        });
    }

    async function refreshList() {
        setLoadingList(true);
        setErrorList("");

        try {
            const data = await apiServicio.list();

            setEncuestas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setEncuestas([]);
            setErrorList(error.message || "No se pudieron cargar las encuestas.");
        } finally {
            setLoadingList(false);
        }
    }

    useEffect(() => {
        refreshList();
    }, []);

    const filtered = useMemo(() => {
        const q = filters.q.trim().toLowerCase();
        const desdeInt = ymdToInt(filters.rangoDesde);
        const hastaInt = ymdToInt(filters.rangoHasta);

        return (encuestas || []).filter((item) => {
            const promedio = obtenerPromedio(item);

            const textoBusqueda = [
                item.id_encuesta,
                item.numero_OS,
                item.asesor,
                item.satisfaccion_agendar_cita,
                item.satisfaccion_exp_area_servicio,
                item.comentario,
                item.mostraron_inventario_inicial_vehiculo ? "si inventario inicial" : "no inventario inicial",
                item.explicacion_clara_trabajo_realizado ? "si explicacion clara" : "no explicacion clara",
                item.invitacion_realizar_inventario ? "si invitacion inventario" : "no invitacion inventario",
                item.entrego_reporte_multipuntos ? "si reporte multipuntos" : "no reporte multipuntos",
                item.trabajo_realizado_cumple_espectativa ? "si cumple expectativa" : "no cumple expectativa",
            ]
                .map(normalizeStr)
                .join(" ")
                .toLowerCase();

            const matchQ = !q || textoBusqueda.includes(q);

            let matchRango = true;

            if (desdeInt !== null || hastaInt !== null) {
                const ymdCreado = item.creado ? toYMDLocal(item.creado) : "";
                const ymdInt = ymdToInt(ymdCreado);

                if (!ymdInt) return false;

                if (desdeInt !== null && ymdInt < desdeInt) {
                    matchRango = false;
                }

                if (hastaInt !== null && ymdInt > hastaInt) {
                    matchRango = false;
                }
            }

            let matchCalificacion = true;

            if (filters.calificacion !== "Todos") {
                const min = Number(filters.calificacion);
                matchCalificacion = promedio >= min;
            }

            return matchQ && matchRango && matchCalificacion;
        });
    }, [encuestas, filters]);

    const sorted = useMemo(() => {
        const data = [...filtered];
        const { key, dir } = sort;
        const mult = dir === "asc" ? 1 : -1;

        return data.sort((a, b) => {
            if (key === "creado") {
                const ta = a.creado ? new Date(a.creado).getTime() : 0;
                const tb = b.creado ? new Date(b.creado).getTime() : 0;

                return (ta - tb) * mult;
            }

            if (key === "promedio") {
                return (obtenerPromedio(a) - obtenerPromedio(b)) * mult;
            }

            if (
                key === "satisfaccion_agendar_cita" ||
                key === "satisfaccion_exp_area_servicio"
            ) {
                return (Number(a?.[key] || 0) - Number(b?.[key] || 0)) * mult;
            }

            const va = normalizeStr(a?.[key]).toLowerCase();
            const vb = normalizeStr(b?.[key]).toLowerCase();

            if (va < vb) return -1 * mult;
            if (va > vb) return 1 * mult;

            return 0;
        });
    }, [filtered, sort]);

    const stats = useMemo(() => {
        const total = filtered.length;

        const promedioGeneral =
            total > 0
                ? filtered.reduce((acc, item) => acc + obtenerPromedio(item), 0) / total
                : 0;

        const reportesMultipuntos = filtered.filter(
            (item) => item.entrego_reporte_multipuntos
        ).length;

        const cumpleExpectativa = filtered.filter(
            (item) => item.trabajo_realizado_cumple_espectativa
        ).length;

        return {
            total,
            promedioGeneral: promedioGeneral.toFixed(1),
            reportesMultipuntos,
            cumpleExpectativa,
        };
    }, [filtered]);

    async function openDetail(row) {
        if (!row?.id_encuesta) return;

        try {
            setLoadingDetail(true);
            setOpenModal(true);
            setDetalle(null);

            const item = await apiServicio.get(row.id_encuesta);

            setDetalle(item);
        } catch (error) {
            console.error(error);
            alert("No se pudo abrir el detalle de la encuesta.");
            setOpenModal(false);
            setDetalle(null);
        } finally {
            setLoadingDetail(false);
        }
    }

    function closeModal() {
        if (loadingDetail) return;

        setOpenModal(false);
        setDetalle(null);
    }

    function resetFilters() {
        setFilters({
            q: "",
            rangoDesde: "",
            rangoHasta: "",
            calificacion: "Todos",
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

    function SortIcon({ sortKey }) {
        if (sort.key !== sortKey) {
            return <ArrowUpDown className="h-4 w-4 opacity-60" />;
        }

        if (sort.dir === "asc") {
            return <ChevronUp className="h-4 w-4 opacity-80" />;
        }

        return <ChevronDown className="h-4 w-4 opacity-80" />;
    }

    return (
        <div className="w-full">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h2 className="truncate text-lg font-extrabold text-[#C9A75D]">
                        Registro de Encuestas de Servicio
                    </h2>

                    <p className="mt-1 text-xs font-semibold text-slate-500">
                        Consulta general de encuestas registradas desde el formulario de servicio.
                    </p>
                </div>

                <button
                    onClick={refreshList}
                    disabled={loadingList}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A75D] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#C9A75D]/80 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loadingList ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="h-4 w-4" />
                    )}
                    Recargar
                </button>
            </div>

            {errorList ? (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {errorList}
                </div>
            ) : null}

            <div className="mb-4 rounded-lg border border-black/10 bg-white p-3 shadow-sm">
                <div className="grid gap-3 md:grid-cols-12">
                    <div className="md:col-span-5">
                        <FilterBlock label="Búsqueda">
                            <div className="flex items-center gap-2 rounded-lg border border-[#0F172A] bg-white px-3 py-2">
                                <Search className="h-4 w-4 text-[#C9A75D]" />

                                <input
                                    value={filters.q}
                                    onChange={(event) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            q: event.target.value,
                                        }))
                                    }
                                    placeholder="Buscar por OS, asesor, comentario, sí/no, inventario..."
                                    className="w-full text-sm text-[#111111] outline-none placeholder:text-slate-400"
                                />

                                {filters.q ? (
                                    <button
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                q: "",
                                            }))
                                        }
                                        className="rounded-lg bg-white p-1 text-[#C9A75D] hover:bg-white/80 hover:text-red-500"
                                        aria-label="Limpiar búsqueda"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                ) : null}
                            </div>
                        </FilterBlock>
                    </div>

                    <div className="md:col-span-2">
                        <FilterBlock label="Calificación mínima">
                            <select
                                value={filters.calificacion}
                                onChange={(event) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        calificacion: event.target.value,
                                    }))
                                }
                                className="w-full rounded-lg border border-[#0F172A] bg-white px-3 py-2 text-sm text-[#111111] outline-none"
                            >
                                <option value="Todos">Todos</option>
                                <option value="5">5 estrellas</option>
                                <option value="4">4 o más</option>
                                <option value="3">3 o más</option>
                                <option value="2">2 o más</option>
                                <option value="1">1 o más</option>
                            </select>
                        </FilterBlock>
                    </div>

                    <div className="md:col-span-2">
                        <FilterBlock label="Desde">
                            <input
                                type="date"
                                value={filters.rangoDesde}
                                onChange={(event) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        rangoDesde: event.target.value,
                                    }))
                                }
                                className="w-full rounded-lg border border-[#0F172A] bg-white px-3 py-2 text-sm text-[#111111] outline-none"
                            />
                        </FilterBlock>
                    </div>

                    <div className="md:col-span-2">
                        <FilterBlock label="Hasta">
                            <input
                                type="date"
                                value={filters.rangoHasta}
                                onChange={(event) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        rangoHasta: event.target.value,
                                    }))
                                }
                                className="w-full rounded-lg border border-[#0F172A] bg-white px-3 py-2 text-sm text-[#111111] outline-none"
                            />
                        </FilterBlock>
                    </div>

                    <div className="md:col-span-1">
                        <FilterBlock label="Acciones">
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
                                <button
                                    onClick={setHoy}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-700 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                    title="Mostrar solo registros del día de hoy"
                                >
                                    <CalendarDays className="h-4 w-4" />
                                </button>

                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#C9A75D] bg-white px-3 py-2 text-sm font-semibold text-[#C9A75D] hover:bg-[#C9A75D] hover:text-white"
                                    title="Limpiar filtros"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </FilterBlock>
                    </div>
                </div>
            </div>

            <MobileCardList rows={sorted} loading={loadingList} onOpen={openDetail} />

            <div className="hidden overflow-hidden rounded-lg bg-white shadow-lg lg:block">
                <div className="overflow-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-[#C9A75D] text-xs text-white">
                            <tr>
                                <th className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleSort("creado")}
                                        className="inline-flex items-center gap-1 text-xs font-bold"
                                    >
                                        Fecha
                                        <SortIcon sortKey="creado" />
                                    </button>
                                </th>

                                <th className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleSort("numero_OS")}
                                        className="inline-flex items-center gap-1 text-xs font-bold"
                                    >
                                        Número OS
                                        <SortIcon sortKey="numero_OS" />
                                    </button>
                                </th>

                                <th className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleSort("asesor")}
                                        className="inline-flex items-center gap-1 text-xs font-bold"
                                    >
                                        Asesor
                                        <SortIcon sortKey="asesor" />
                                    </button>
                                </th>

                                <th className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleSort("satisfaccion_agendar_cita")}
                                        className="inline-flex items-center gap-1 text-xs font-bold"
                                    >
                                        Agendar cita
                                        <SortIcon sortKey="satisfaccion_agendar_cita" />
                                    </button>
                                </th>

                                <th className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleSort("satisfaccion_exp_area_servicio")}
                                        className="inline-flex items-center gap-1 text-xs font-bold"
                                    >
                                        Área servicio
                                        <SortIcon sortKey="satisfaccion_exp_area_servicio" />
                                    </button>
                                </th>

                                <th className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => toggleSort("promedio")}
                                        className="inline-flex items-center gap-1 text-xs font-bold"
                                    >
                                        Promedio
                                        <SortIcon sortKey="promedio" />
                                    </button>
                                </th>

                                <th className="px-4 py-3">Inventario inicial</th>
                                <th className="px-4 py-3">Explicación clara</th>
                                <th className="px-4 py-3">Reporte multipuntos</th>
                                <th className="px-4 py-3">Comentario</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-black/10">
                            {loadingList ? (
                                <>
                                    {Array.from({ length: 8 }).map((_, index) => (
                                        <SkeletonRow key={index} />
                                    ))}
                                </>
                            ) : (
                                <>
                                    {sorted.map((row) => {
                                        const promedio = obtenerPromedio(row).toFixed(1);

                                        return (
                                            <tr
                                                key={row.id_encuesta}
                                                onDoubleClick={() => openDetail(row)}
                                                className="cursor-pointer hover:bg-slate-50"
                                                title="Doble clic para ver detalle"
                                            >
                                                <td className="px-4 py-3 text-[#111111]">
                                                    {row.creado ? toDTLocal(row.creado) : "—"}
                                                </td>

                                                <td className="px-4 py-3 font-bold text-[#111111]">
                                                    {row.numero_OS || "—"}
                                                </td>

                                                <td className="px-4 py-3 font-semibold text-[#111111]">
                                                    <span className="block max-w-[180px] truncate">
                                                        {row.asesor || "—"}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-[#111111]">
                                                    <ScorePill value={row.satisfaccion_agendar_cita} />
                                                </td>

                                                <td className="px-4 py-3 text-[#111111]">
                                                    <ScorePill
                                                        value={row.satisfaccion_exp_area_servicio}
                                                    />
                                                </td>

                                                <td className="px-4 py-3 text-[#111111]">
                                                    <ScorePill value={promedio} />
                                                </td>

                                                <td className="px-4 py-3">
                                                    <BooleanPill
                                                        value={row.mostraron_inventario_inicial_vehiculo}
                                                    />
                                                </td>

                                                <td className="px-4 py-3">
                                                    <BooleanPill
                                                        value={row.explicacion_clara_trabajo_realizado}
                                                    />
                                                </td>

                                                <td className="px-4 py-3">
                                                    <BooleanPill value={row.entrego_reporte_multipuntos} />
                                                </td>

                                                <td className="max-w-[260px] px-4 py-3 text-[#111111]">
                                                    <span className="block truncate">
                                                        {row.comentario || "—"}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {sorted.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={10}
                                                className="px-4 py-10 text-center text-[#C9A75D]"
                                            >
                                                No hay resultados con esos filtros.
                                            </td>
                                        </tr>
                                    ) : null}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                open={openModal}
                title={
                    detalle?.id_encuesta
                        ? `Detalle de Encuesta de Servicio • ${detalle.id_encuesta}`
                        : "Detalle de Encuesta de Servicio"
                }
                onClose={closeModal}
                footer={
                    <button
                        onClick={closeModal}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#111111] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9F7E2F]"
                    >
                        <X className="h-4 w-4" />
                        Cerrar
                    </button>
                }
            >
                {loadingDetail ? (
                    <ModalSkeleton />
                ) : !detalle ? null : (
                    <div className="grid gap-3 md:grid-cols-3">
                        <Field label="Fecha de encuesta" icon={CalendarDays}>
                            <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[#111111]">
                                {detalle.creado ? toDTLocal(detalle.creado) : "—"}
                            </div>
                        </Field>

                        <Field label="Número OS" icon={FileText}>
                            <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[#111111]">
                                {detalle.numero_OS || "—"}
                            </div>
                        </Field>

                        <Field label="Asesor" icon={BadgeCheck}>
                            <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[#111111]">
                                {detalle.asesor || "—"}
                            </div>
                        </Field>

                        <Field label="Promedio general" icon={Star}>
                            <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[#111111]">
                                {obtenerPromedio(detalle).toFixed(1)} / 5
                            </div>
                        </Field>

                        <Field label="Satisfacción al agendar cita" icon={ClipboardList}>
                            <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[#111111]">
                                {detalle.satisfaccion_agendar_cita || "—"} / 5
                            </div>
                        </Field>

                        <Field label="Satisfacción experiencia área servicio" icon={Star}>
                            <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-[#111111]">
                                {detalle.satisfaccion_exp_area_servicio || "—"} / 5
                            </div>
                        </Field>

                        <Field label="Inventario inicial del vehículo" icon={CheckCircle2}>
                            <BooleanPill
                                value={detalle.mostraron_inventario_inicial_vehiculo}
                            />
                        </Field>

                        <Field label="Explicación clara del trabajo" icon={CheckCircle2}>
                            <BooleanPill
                                value={detalle.explicacion_clara_trabajo_realizado}
                            />
                        </Field>

                        <Field label="Invitación a realizar inventario" icon={CheckCircle2}>
                            <BooleanPill value={detalle.invitacion_realizar_inventario} />
                        </Field>

                        <Field label="Entregó reporte multipuntos" icon={CheckCircle2}>
                            <BooleanPill value={detalle.entrego_reporte_multipuntos} />
                        </Field>

                        <Field label="Trabajo realizado cumple expectativa" icon={CheckCircle2}>
                            <BooleanPill
                                value={detalle.trabajo_realizado_cumple_espectativa}
                            />
                        </Field>

                        <div className="md:col-span-3">
                            <Field label="Comentario" icon={MessageSquareText}>
                                <div className="min-h-[120px] rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold leading-6 text-[#111111]">
                                    {detalle.comentario || "Sin comentario."}
                                </div>
                            </Field>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}