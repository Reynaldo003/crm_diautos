import { useState } from "react";
import {
    Search,
    X,
    BarChart3,
    Gauge,
    CarFront,
    Wrench,
    Loader2,
    CalendarClock,
    Phone,
    Mail,
    User,
    FileText,
    History,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Send,
    Funnel,
} from "lucide-react";
import {
    ResponsiveContainer,
    RadialBarChart,
    RadialBar,
    PolarAngleAxis,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { obtenerNombreModelo } from "../../lib/apiRetencionFranjas";
import logoChevrolet from "../../assets/logo.png";
import logoRyr from "../../assets/ryr.png";

export const COLOR_ORO = "#C9A75D";
export const COLOR_TINTA = "#0F172A";
export const TAMANO_PAGINA = 500;
export const OPCIONES_TAMANO_PAGINA = [500, 800, 1000];

export const SEGMENTOS = [
    {
        id: "5-11",
        label: "5-11",
        titulo: "Retención 5-11",
        mesesDesde: 5,
        mesesHasta: 11,
    },
    {
        id: "12-18",
        label: "12-18",
        titulo: "Retención 12-18",
        mesesDesde: 12,
        mesesHasta: 18,
    },
    {
        id: "13-48",
        label: "13-48",
        titulo: "Retención 13-48",
        mesesDesde: 13,
        mesesHasta: 48,
    },
    {
        id: "13-96",
        label: "13-96",
        titulo: "Retención 13-96",
        mesesDesde: 13,
        mesesHasta: 96,
    },
    {
        id: "general",
        label: "General",
        titulo: "Vista general",
        mesesDesde: 0,
        mesesHasta: 96,
    },
];

export const FILTROS_DISPONIBLES = [
    { id: "nombre", label: "Nombre cliente" },
    { id: "vin", label: "VIN" },
    { id: "celular", label: "Celular" },
    { id: "email", label: "Correo" },
    { id: "prioridadProspeccion", label: "Prioridad" },
    { id: "diasIngreso", label: "Días de ingreso" },
    { id: "mesesVenta", label: "Meses a venta" },
    { id: "paginacion", label: "Paginación" },
];

export const FILTROS_VISIBLES_DEFAULT = [
    "nombre",
    "vin",
    "celular",
    "email",
    "prioridadProspeccion",
    "diasIngreso",
    "mesesVenta",
    "paginacion",
];

export const SEGMENTOS_VISTA_GENERAL = SEGMENTOS.filter(
    (segmento) => segmento.id !== "general"
);

export const OPERADORES_COMPARACION = [
    { value: "", label: "Sin filtro" },
    { value: "mayor", label: "Mayor que" },
    { value: "menor", label: "Menor que" },
    { value: "igual", label: "Igual a" },
];

export const OPCIONES_PRIORIDAD = [
    { value: "", label: "Todas" },
    { value: "Prioridad 1A", label: "Prioridad 1A" },
    { value: "Prioridad 2A", label: "Prioridad 2A" },
    { value: "Prioridad 3A | Franja 1", label: "Prioridad 3A | Franja 1" },
    { value: "Prioridad 1B | Prioridad 3A | Franja 1", label: "Prioridad 1B | Prioridad 3A | Franja 1" },
    { value: "Prioridad 2B | Franja 1", label: "Prioridad 2B | Franja 1" },
    { value: "Prioridad 3B | Franja 1 | Franja 2", label: "Prioridad 3B | Franja 1 | Franja 2" },
    { value: "Franja 1", label: "Franja 1" },
    { value: "Franja 1 | Franja 2", label: "Franja 1 | Franja 2" },
    { value: "Sin Prioridad", label: "Sin Prioridad" },
];

export const FILTROS_INICIALES = {
    nombre: "",
    vin: "",
    celular: "",
    email: "",
    prioridadProspeccion: "",
    operadorDiasIngreso: "",
    valorDiasIngreso: "",
    operadorMesesVenta: "",
    valorMesesVenta: "",
};

export const ESTADO_INICIAL = {
    porcentajeRetorno: 0,
    vinesSegmento: 0,
    vinesActivos: 0,
    vinesInactivos: 0,
    datosGauge: [{ name: "Retorno", value: 0, fill: COLOR_TINTA }],
    datosModelos: [],
    modelosGrafica: [],
    clientes: [],
    totalClientes: 0,
    paginaActual: 1,
    totalPaginas: 1,
    tamanoPagina: TAMANO_PAGINA,
    tienePaginaAnterior: false,
    tienePaginaSiguiente: false,
};

export function CabeceraRetencion({ segmentoActivo, onCambiarSegmento }) {
    return (
        <section className="overflow-hidden rounded-xl border border-black/10 bg-[radial-gradient(circle_at_top_left,rgba(201,167,93,0.18),transparent_28%),linear-gradient(135deg,#050505_0%,#0F172A_55%,#050505_100%)] px-4 py-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)] sm:px-5 sm:py-5 lg:px-6 lg:py-6">
            <div className="flex min-h-[150px] flex-col">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 sm:text-[11px]">
                        Servicio y Partes
                    </div>

                    <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl xl:text-[40px]">
                        Retención de Franjas
                    </h1>
                </div>

                <div className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <SelectorSegmentos
                            segmentoActivo={segmentoActivo}
                            onCambiarSegmento={onCambiarSegmento}
                            variante="oscuro"
                        />

                        <div className="flex shrink-0 items-end justify-end">
                            <div className="flex items-end gap-4 xl:gap-5">
                                <div className="flex h-[44px] w-[60px] items-center justify-center">
                                    <img
                                        src={logoChevrolet}
                                        alt="Chevrolet"
                                        className="max-h-7 max-w-full object-contain opacity-95"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="flex h-[44px] w-[90px] items-center justify-center">
                                    <img
                                        src={logoRyr}
                                        alt="Grupo Automotriz R&R"
                                        className="max-h-full max-w-full object-contain opacity-95"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function VistaResumenGeneral({ datos, cargando }) {
    return (
        <section className="space-y-4">
            {datos.map((segmento) => (
                <FilaResumenGeneral
                    key={segmento.id}
                    segmento={segmento}
                    cargando={cargando}
                />
            ))}
        </section>
    );
}

export function VistaSegmento({ cargando, dashboard }) {
    const {
        porcentajeRetorno,
        vinesSegmento,
        vinesActivos,
        vinesInactivos,
        datosGauge,
        modelosGrafica,
    } = dashboard;

    return (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[250px_230px_minmax(0,1fr)] 2xl:grid-cols-[260px_240px_minmax(0,1fr)]">
            <Panel className="h-full">
                <PanelHeader icono={Gauge} titulo="Porcentaje de retorno" />

                <div className="mt-3 h-[190px] xl:h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                            cx="50%"
                            cy="92%"
                            innerRadius="72%"
                            outerRadius="112%"
                            barSize={16}
                            data={datosGauge}
                            startAngle={180}
                            endAngle={0}
                        >
                            <PolarAngleAxis
                                type="number"
                                domain={[0, 100]}
                                angleAxisId={0}
                                tick={false}
                            />
                            <RadialBar
                                background={{ fill: "#E7E5E4" }}
                                dataKey="value"
                                cornerRadius={999}
                            />
                        </RadialBarChart>
                    </ResponsiveContainer>
                </div>

                <div className="-mt-8 text-center">
                    <div className="text-3xl font-black tracking-tight text-slate-900 xl:text-[34px]">
                        {formatearPorcentaje(porcentajeRetorno)}
                    </div>

                    <div className="mt-2 flex items-center justify-between px-1 text-xs font-semibold text-slate-500 sm:text-sm">
                        <span>0%</span>
                        <span>100%</span>
                    </div>
                </div>
            </Panel>

            <Panel className="h-full">
                <PanelHeader icono={BarChart3} titulo="Resumen del segmento" />

                <div className="mt-4 rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Vines del segmento
                    </div>

                    <div className="mt-2 text-3xl font-black tracking-tight text-slate-900 xl:text-[34px]">
                        {formatearNumero(vinesSegmento)}
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                    <MiniIndicador
                        titulo="Vines activos"
                        valor={formatearNumero(vinesActivos)}
                        colorFondo="bg-slate-900"
                        colorTexto="text-white"
                        colorDetalle="text-white/65"
                    />

                    <MiniIndicador
                        titulo="Vines inactivos"
                        valor={formatearNumero(vinesInactivos)}
                        colorFondo="bg-[#F6E9C8]"
                        colorTexto="text-[#8A5A00]"
                        colorDetalle="text-[#8A5A00]/70"
                    />
                </div>
            </Panel>

            <Panel className="h-full">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <PanelHeader
                        icono={CarFront}
                        titulo="Distribución por modelo"
                        className="mb-0"
                    />
                    <LegendPayload />
                </div>

                <div className="mt-4 h-[260px] xl:h-[280px]">
                    {cargando ? (
                        <EstadoPanel mensaje="Cargando gráfica..." />
                    ) : modelosGrafica.length === 0 ? (
                        <EstadoPanel mensaje="No hay datos de modelos para mostrar." />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={modelosGrafica}
                                margin={{ top: 8, right: 10, left: 0, bottom: 28 }}
                                barCategoryGap="18%"
                            >
                                <CartesianGrid vertical={false} stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="nombre"
                                    angle={-18}
                                    textAnchor="end"
                                    interval={0}
                                    tick={{ fontSize: 10, fill: "#64748B" }}
                                    height={50}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: "#F8FAFC" }}
                                    content={<TooltipModelos />}
                                />
                                <Bar
                                    dataKey="activo"
                                    name="Activo"
                                    fill={COLOR_TINTA}
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={28}
                                />
                                <Bar
                                    dataKey="inactivo"
                                    name="Inactivo"
                                    fill={COLOR_ORO}
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={28}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </Panel>
        </section>
    );
}

export function BloqueFiltrosTabla({
    segmentoActivo,
    segmentoSeleccionado,
    totalClientes,
    paginaActual,
    totalPaginas,
    tamanoPagina,
    cargando,
    clientes,
    filtros,
    onCambiarSegmento,
    onActualizarFiltro,
    onLimpiarFiltro,
    onLimpiarTodo,
    onPaginaAnterior,
    onPaginaSiguiente,
    onCambiarTamanoPagina,
    onAbrirDetalle,
}) {
    const usuarioActual = JSON.parse(
        localStorage.getItem("crm_chevrolet_usuario") || "null"
    );

    const keyFiltrosVisibles = `filtros_retencion_${usuarioActual?.id_usuario || "default"}`;

    const [filtrosVisibles, setFiltrosVisibles] = useState(() => {
        try {
            const guardado = localStorage.getItem(keyFiltrosVisibles);
            return guardado ? JSON.parse(guardado) : FILTROS_VISIBLES_DEFAULT;
        } catch {
            return FILTROS_VISIBLES_DEFAULT;
        }
    });

    function toggleFiltroVisible(id) {
        setFiltrosVisibles((prev) => {
            const nuevo = prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id];

            localStorage.setItem(keyFiltrosVisibles, JSON.stringify(nuevo));
            return nuevo;
        });
    }

    function filtroEstaVisible(id) {
        return filtrosVisibles.includes(id);
    }
    return (
        <section className="rounded-xl border border-black/10 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="flex flex-wrap items-center gap-2.5">
                    <ChipInfo etiqueta="Vista" valor={segmentoSeleccionado.label} />
                    <ChipInfo etiqueta="Total registros" valor={formatearNumero(totalClientes)} />
                    <ChipInfo etiqueta="Página" valor={`${paginaActual} de ${totalPaginas}`} />

                    <button
                        type="button"
                        onClick={onLimpiarTodo}
                        className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                    >
                        <X className="h-4 w-4" />
                        Limpiar filtros
                    </button>
                    <details className="relative">
                        <summary className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                            <Funnel className="h-4 w-4" />
                            Personalizar filtros
                        </summary>

                        <div className="absolute left-0 top-12 z-30 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                            <div className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                                Mostrar / ocultar filtros
                            </div>

                            <div className="space-y-2">
                                {FILTROS_DISPONIBLES.map((filtro) => (
                                    <label
                                        key={filtro.id}
                                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filtroEstaVisible(filtro.id)}
                                            onChange={() => toggleFiltroVisible(filtro.id)}
                                            className="h-4 w-4 accent-[#C9A75D]"
                                        />
                                        {filtro.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </details>
                </div>

                <SelectorSegmentos
                    segmentoActivo={segmentoActivo}
                    onCambiarSegmento={onCambiarSegmento}
                    variante="claro"
                />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {filtroEstaVisible("nombre") ? (
                    <FiltroBusqueda
                        titulo="Buscar por nombre del cliente"
                        valor={filtros.nombre}
                        onChange={(e) => onActualizarFiltro("nombre", e.target.value)}
                        onClear={() => onLimpiarFiltro("nombre")}
                    />
                ) : null}

                {filtroEstaVisible("vin") ? (
                    <FiltroBusqueda
                        titulo="Buscar por número de VIN"
                        valor={filtros.vin}
                        onChange={(e) => onActualizarFiltro("vin", e.target.value)}
                        onClear={() => onLimpiarFiltro("vin")}
                    />
                ) : null}

                {filtroEstaVisible("celular") ? (
                    <FiltroBusqueda
                        titulo="Buscar por número de celular"
                        valor={filtros.celular}
                        onChange={(e) => onActualizarFiltro("celular", e.target.value)}
                        onClear={() => onLimpiarFiltro("celular")}
                    />
                ) : null}

                {filtroEstaVisible("email") ? (
                    <FiltroBusqueda
                        titulo="Buscar por correo electrónico"
                        valor={filtros.email}
                        onChange={(e) => onActualizarFiltro("email", e.target.value)}
                        onClear={() => onLimpiarFiltro("email")}
                    />
                ) : null}

                {filtroEstaVisible("prioridadProspeccion") ? (
                    <FiltroSelect
                        titulo="Prioridad de prospección"
                        valor={filtros.prioridadProspeccion}
                        onChange={(e) =>
                            onActualizarFiltro("prioridadProspeccion", e.target.value)
                        }
                        opciones={OPCIONES_PRIORIDAD}
                    />
                ) : null}

                {filtroEstaVisible("diasIngreso") ? (
                    <FiltroNumeroComparador
                        titulo="Días de ingreso"
                        operador={filtros.operadorDiasIngreso}
                        valor={filtros.valorDiasIngreso}
                        onChangeOperador={(e) =>
                            onActualizarFiltro("operadorDiasIngreso", e.target.value)
                        }
                        onChangeValor={(e) =>
                            onActualizarFiltro("valorDiasIngreso", e.target.value)
                        }
                    />
                ) : null}

                {filtroEstaVisible("mesesVenta") ? (
                    <FiltroNumeroComparador
                        titulo="Cantidad de meses a venta"
                        operador={filtros.operadorMesesVenta}
                        valor={filtros.valorMesesVenta}
                        onChangeOperador={(e) =>
                            onActualizarFiltro("operadorMesesVenta", e.target.value)
                        }
                        onChangeValor={(e) =>
                            onActualizarFiltro("valorMesesVenta", e.target.value)
                        }
                    />
                ) : null}

                {filtroEstaVisible("paginacion") ? (
                    <TarjetaPaginacion
                        cargando={cargando}
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        tamanoPagina={tamanoPagina}
                        onPaginaAnterior={onPaginaAnterior}
                        onPaginaSiguiente={onPaginaSiguiente}
                        onCambiarTamanoPagina={onCambiarTamanoPagina}
                    />
                ) : null}
            </div>

            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60">
                <div className="flex flex-col gap-2 border-b border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-medium text-slate-600">
                        Mostrando <span className="font-bold text-slate-900">{formatearNumero(clientes.length)}</span> registros en esta página de un total de <span className="font-bold text-slate-900">{formatearNumero(totalClientes)}</span>.
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9A75D]">
                            {segmentoSeleccionado.titulo}
                        </div>

                        <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700">
                            Página {paginaActual} de {totalPaginas}
                        </div>
                    </div>
                </div>

                <div className="max-h-[500px] overflow-auto xl:max-h-[560px]">
                    <table className="min-w-[1560px] w-full border-separate border-spacing-0 text-[13px] xl:text-sm">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-[#0F172A] text-left text-white">
                                <th className="px-3 py-3 font-bold">Franja</th>
                                <th className="px-3 py-3 font-bold">Meses venta</th>
                                <th className="px-3 py-3 font-bold">Días último ingreso</th>
                                <th className="px-3 py-3 font-bold">Prioridad prospección</th>
                                <th className="px-3 py-3 font-bold">Estatus</th>
                                <th className="px-3 py-3 font-bold">Email</th>
                                <th className="px-3 py-3 font-bold">Cliente</th>
                                <th className="px-3 py-3 font-bold">VIN</th>
                                <th className="px-3 py-3 font-bold">Año</th>
                                <th className="px-3 py-3 font-bold">Versión</th>
                                <th className="px-3 py-3 font-bold">Kilometraje</th>
                                <th className="px-3 py-3 font-bold">Celular</th>
                                <th className="px-3 py-3 font-bold">Teléfono</th>
                            </tr>

                            <tr className="bg-slate-100 align-top text-slate-900">
                                <th className="border-t border-slate-200 px-2 py-2" />
                                <th className="border-t border-slate-200 px-2 py-2 min-w-[170px]">
                                    <FiltroNumeroComparadorCompacto
                                        titulo="Meses"
                                        operador={filtros.operadorMesesVenta}
                                        valor={filtros.valorMesesVenta}
                                        onChangeOperador={(e) =>
                                            onActualizarFiltro("operadorMesesVenta", e.target.value)
                                        }
                                        onChangeValor={(e) =>
                                            onActualizarFiltro("valorMesesVenta", e.target.value)
                                        }
                                    />
                                </th>
                                <th className="border-t border-slate-200 px-2 py-2 min-w-[170px]">
                                    <FiltroNumeroComparadorCompacto
                                        titulo="Días"
                                        operador={filtros.operadorDiasIngreso}
                                        valor={filtros.valorDiasIngreso}
                                        onChangeOperador={(e) =>
                                            onActualizarFiltro("operadorDiasIngreso", e.target.value)
                                        }
                                        onChangeValor={(e) =>
                                            onActualizarFiltro("valorDiasIngreso", e.target.value)
                                        }
                                    />
                                </th>
                                <th className="border-t border-slate-200 px-2 py-2 min-w-[170px]">
                                    <FiltroSelectCompacto
                                        titulo="Prioridad"
                                        valor={filtros.prioridadProspeccion}
                                        onChange={(e) =>
                                            onActualizarFiltro("prioridadProspeccion", e.target.value)
                                        }
                                        opciones={OPCIONES_PRIORIDAD}
                                    />
                                </th>
                                <th className="border-t border-slate-200 px-2 py-2" />
                                <th className="border-t border-slate-200 px-2 py-2" />
                                <th className="border-t border-slate-200 px-2 py-2" />
                                <th className="border-t border-slate-200 px-2 py-2" />
                                <th className="border-t border-slate-200 px-2 py-2" />
                                <th className="border-t border-slate-200 px-2 py-2" />
                                <th className="border-t border-slate-200 px-2 py-2" />
                                <th className="border-t border-slate-200 px-2 py-2" />
                                <th className="border-t border-slate-200 px-2 py-2" />
                            </tr>
                        </thead>

                        <tbody>
                            {cargando ? (
                                <tr>
                                    <td
                                        colSpan={13}
                                        className="border-t border-slate-200 px-4 py-10 text-center text-sm font-medium text-slate-500"
                                    >
                                        Cargando información...
                                    </td>
                                </tr>
                            ) : clientes.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={13}
                                        className="border-t border-slate-200 px-4 py-10 text-center text-sm font-medium text-slate-500"
                                    >
                                        No se encontraron registros con esos filtros.
                                    </td>
                                </tr>
                            ) : (
                                clientes.map((cliente, index) => (
                                    <tr
                                        key={`${cliente.id}-${cliente.vin || "sin-vin"}-${index}`}
                                        onDoubleClick={() => onAbrirDetalle(cliente)}
                                        title="Doble clic para ver historial comercial del VIN"
                                        className={`cursor-pointer transition ${index % 2 === 0 ? "bg-white" : "bg-slate-50/80"
                                            } hover:bg-[#FBF6EA]`}
                                    >
                                        <td className="border-t border-slate-200 px-3 py-3 font-medium text-slate-700 whitespace-nowrap">
                                            {cliente.franja || "-"}
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 text-slate-700 whitespace-nowrap">
                                            {formatearNumeroPlano(cliente.mesesVenta)}
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 text-slate-700 whitespace-nowrap">
                                            {formatearNumeroPlano(cliente.dias)}
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 whitespace-nowrap">
                                            <PrioridadBadge prioridad={cliente.prioridadProspeccion} />
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 whitespace-nowrap">
                                            <EstatusBadge estatus={cliente.estatus} />
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 text-slate-700 min-w-[220px]">
                                            {cliente.email || "-"}
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 font-semibold text-slate-900 min-w-[230px]">
                                            {cliente.nombre || "-"}
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 text-slate-700 whitespace-nowrap">
                                            {cliente.vin || "-"}
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 text-slate-700 whitespace-nowrap">
                                            {cliente.anio || "-"}
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 text-slate-700 min-w-[150px]">
                                            {cliente.version || "-"}
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 text-slate-700 whitespace-nowrap">
                                            {cliente.kilometraje || "-"}
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 text-slate-700 whitespace-nowrap">
                                            {cliente.celular || "-"}
                                        </td>

                                        <td className="border-t border-slate-200 px-3 py-3 text-slate-700 whitespace-nowrap">
                                            {cliente.telefono || "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-medium text-slate-600">
                        Página <span className="font-bold text-slate-900">{paginaActual}</span> de <span className="font-bold text-slate-900">{totalPaginas}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onPaginaAnterior}
                            disabled={cargando || paginaActual <= 1}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Anterior
                        </button>

                        <button
                            type="button"
                            onClick={onPaginaSiguiente}
                            disabled={cargando || paginaActual >= totalPaginas}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-900 bg-slate-900 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function ModalDetalleComercial({
    open,
    onClose,
    cargando,
    detalle,
    guardandoComentario = false,
    onGuardarComentario,
}) {
    if (!open) return null;

    const registro = detalle?.registro || {};
    const resumen = detalle?.resumen || {};
    const servicios = Array.isArray(detalle?.servicios_relevantes)
        ? detalle.servicios_relevantes
        : [];
    const trabajosRecientes = Array.isArray(detalle?.trabajos_recientes)
        ? detalle.trabajos_recientes
        : [];
    const historial = Array.isArray(detalle?.historial) ? detalle.historial : [];
    const comentariosVenta = Array.isArray(detalle?.comentarios_venta)
        ? detalle.comentarios_venta
        : [];

    const tituloVehiculo = [registro?.marca_vehiculo, registro?.version, registro?.ano_modelo]
        .filter(Boolean)
        .join(" · ");

    return (
        <div className="fixed inset-0 z-[80]">
            <div
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="absolute inset-0 overflow-y-auto p-3 sm:p-5">
                <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 shadow-[0_30px_90px_rgba(15,23,42,0.38)]">
                    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950 px-4 py-4 text-white sm:px-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A75D]/30 bg-[#C9A75D]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E8D3A3] sm:text-[11px]">
                                    <History className="h-3.5 w-3.5" />
                                    Expediente comercial del VIN
                                </div>

                                <h2 className="mt-3 truncate text-xl font-black sm:text-2xl">
                                    {registro?.nombre_cte || "Detalle de cliente"}
                                </h2>

                                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/70 sm:text-sm">
                                    <span className="rounded-full bg-white/8 px-3 py-1">
                                        VIN: {registro?.numero_serie || "-"}
                                    </span>
                                    <span className="rounded-full bg-white/8 px-3 py-1">
                                        {tituloVehiculo || "Vehículo sin dato"}
                                    </span>
                                    <span className="rounded-full bg-[#C9A75D]/15 px-3 py-1 text-[#E8D3A3]">
                                        {registro?.prioridad_prospeccion || "Sin prioridad"}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                                aria-label="Cerrar"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </header>

                    <main className="max-h-[82vh] overflow-y-auto p-4 sm:p-5 lg:p-6">
                        {cargando ? (
                            <div className="flex min-h-[320px] items-center justify-center">
                                <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm">
                                    <Loader2 className="h-5 w-5 animate-spin text-[#C9A75D]" />
                                    Cargando expediente comercial...
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <ResumenEjecutivoCRM registro={registro} resumen={resumen} historial={historial} />

                                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
                                    <div className="space-y-5">
                                        <SeccionDatosCliente registro={registro} />
                                        <SeccionVentaVehiculo registro={registro} />
                                        <SeccionOrdenesServicio historial={historial} />
                                    </div>

                                    <aside className="space-y-5">
                                        <SeccionSeguimientoComercial
                                            comentarios={comentariosVenta}
                                            guardando={guardandoComentario}
                                            onGuardarComentario={onGuardarComentario}
                                        />

                                        <SeccionServiciosDetectados
                                            servicios={servicios}
                                            trabajosRecientes={trabajosRecientes}
                                        />
                                    </aside>
                                </div>
                            </div>
                        )}
                    </main>

                    <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                            >
                                <X className="h-4 w-4" />
                                Cerrar expediente
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}

function ResumenEjecutivoCRM({ registro, resumen, historial }) {
    const totalOrdenes = resumen?.total_ordenes_historial ?? historial.length;

    return (
        <section className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <MetricaSimple
                    titulo="Órdenes en historial"
                    valor={formatearNumero(totalOrdenes)}
                />
                <MetricaSimple
                    titulo="Último ingreso"
                    valor={formatearFecha(resumen?.ultima_fecha_historial || registro?.fecha_os)}
                />
                <MetricaSimple
                    titulo="Días sin ingreso"
                    valor={formatearNumeroPlano(
                        resumen?.dias_desde_ultimo_historial || registro?.dias_os_a_actual
                    )}
                />
                <MetricaSimple
                    titulo="Meses desde venta"
                    valor={formatearNumeroPlano(registro?.meses_actual_a_venta)}
                />
            </div>
        </section>
    );
}

function MetricaSimple({ titulo, valor }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {titulo}
            </div>
            <div className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
                {valor || "-"}
            </div>
        </div>
    );
}

function SeccionDatosCliente({ registro }) {
    const telefonoPrincipal = registro?.celular || registro?.telefono || "";

    return (
        <SeccionExpediente
            icono={User}
            titulo="Datos del cliente"
            subtitulo="Información principal para contacto y seguimiento del asesor."
        >
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <TablaDatos
                    datos={[
                        ["Cliente", registro?.nombre_cte],
                        ["Email", registro?.email],
                        ["Celular", registro?.celular],
                        ["Teléfono", registro?.telefono],
                        ["Estado cliente", registro?.estado_cliente],
                    ]}
                />
            </div>
        </SeccionExpediente>
    );
}

function SeccionVentaVehiculo({ registro }) {
    return (
        <SeccionExpediente
            icono={CarFront}
            titulo="Datos de venta y vehículo"
            subtitulo="Vista limpia de la unidad, venta y último estado comercial."
        >
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <BloqueDatos titulo="Vehículo">
                    <TablaDatos
                        datos={[
                            ["Marca", registro?.marca_vehiculo],
                            ["Versión", registro?.version],
                            ["Año modelo", registro?.ano_modelo],
                            ["VIN", registro?.numero_serie],
                            ["Kilometraje", registro?.kilometraje],
                        ]}
                    />
                </BloqueDatos>

                <BloqueDatos titulo="Venta">
                    <TablaDatos
                        datos={[
                            ["Fecha venta", formatearFecha(registro?.fecha_venta)],
                            ["Folio factura", registro?.folio_factura],
                            ["Condición pago", registro?.condicion_pago],
                            ["Tipo movimiento", registro?.tipo_movimiento],
                            ["Vendedor", registro?.vendedor],
                        ]}
                    />
                </BloqueDatos>

                <BloqueDatos titulo="Retención comercial">
                    <TablaDatos
                        datos={[
                            ["Franja", registro?.franja_retencion],
                            ["Prioridad", registro?.prioridad_prospeccion],
                            ["Días desde último ingreso", formatearNumeroPlano(registro?.dias_os_a_actual)],
                            ["Meses actual a venta", formatearNumeroPlano(registro?.meses_actual_a_venta)],
                            ["Estado cliente", registro?.estado_cliente],
                        ]}
                    />
                </BloqueDatos>

                <BloqueDatos titulo="Última orden registrada">
                    <TablaDatos
                        datos={[
                            ["Fecha OS", formatearFecha(registro?.fecha_os)],
                            ["ID OS", registro?.id_os],
                            ["Tipo orden", registro?.tipo_orden_servicio],
                            ["Clasificación", registro?.clasificacion],
                            ["Estado OS", registro?.estado_os],
                            ["Asesor", registro?.asesor],
                        ]}
                    />
                </BloqueDatos>
            </div>

            {registro?.descripcion_os ? (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Descripción de última OS
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                        {registro.descripcion_os}
                    </p>
                </div>
            ) : null}
        </SeccionExpediente>
    );
}

function SeccionSeguimientoComercial({ comentarios, guardando, onGuardarComentario }) {
    const [comentario, setComentario] = useState("");
    const textoLimpio = comentario.trim();

    async function enviarComentario(evento) {
        evento.preventDefault();

        if (!textoLimpio || guardando || typeof onGuardarComentario !== "function") {
            return;
        }

        await onGuardarComentario(textoLimpio);
        setComentario("");
    }

    return (
        <SeccionExpediente
            icono={MessageSquare}
            titulo="Seguimiento de tarea"
            subtitulo="Se documenta llamada, acuerdo, objeción o siguiente acción."
            compacto
        >
            <form onSubmit={enviarComentario} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <textarea
                    value={comentario}
                    onChange={(evento) => setComentario(evento.target.value)}
                    maxLength={2000}
                    rows={4}
                    placeholder="Cliente contactado..."
                    className="min-h-[118px] w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#C9A75D]"
                />

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:flex-col xl:items-stretch 2xl:flex-row 2xl:items-center">
                    <span className="text-xs font-semibold text-slate-400">
                        {textoLimpio.length}/2000 caracteres
                    </span>

                    <button
                        type="submit"
                        disabled={!textoLimpio || guardando}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {guardando ? "Guardando..." : "Guardar resultado"}
                    </button>
                </div>
            </form>

            <div className="mt-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <h4 className="text-sm font-black text-slate-900">Bitácora</h4>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500">
                        {comentarios.length} registro{comentarios.length === 1 ? "" : "s"}
                    </span>
                </div>

                {comentarios.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                        Aún no hay resultados documentados para esta venta.
                    </div>
                ) : (
                    <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
                        {comentarios.map((item) => (
                            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="text-sm font-black text-slate-900">
                                        {item.creado_por || "CRM Chevrolet"}
                                    </div>
                                    <div className="text-xs font-semibold text-slate-400">
                                        {formatearFechaHora(item.creado_en)}
                                    </div>
                                </div>
                                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                    {item.comentario}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </SeccionExpediente>
    );
}

function SeccionServiciosDetectados({ servicios, trabajosRecientes }) {
    return (
        <SeccionExpediente
            icono={Wrench}
            titulo="Oportunidades de seguimiento"
            subtitulo="Servicios detectados y trabajos recientes del historial."
            compacto
        >
            {servicios.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                    No se detectaron servicios comerciales comunes por palabra clave.
                </div>
            ) : (
                <div className="space-y-3">
                    {servicios.map((servicio) => (
                        <article key={servicio.clave} className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <div className="font-black text-slate-900">{servicio.nombre}</div>
                                    <div className="mt-1 text-xs font-semibold text-slate-500">
                                        Última detección: {formatearFecha(servicio.ultima_fecha)}
                                    </div>
                                </div>
                                <BadgeRevisionClaro estado={servicio.estatus_revision} />
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                                <span>Días: <b>{formatearNumeroPlano(servicio.dias_desde)}</b></span>
                                <span>Orden: <b>{servicio.ultima_orden || "-"}</b></span>
                                <span>Kilometraje: <b>{servicio.ultimo_kilometraje || "-"}</b></span>
                                <span>Asesor: <b>{servicio.asesor || "-"}</b></span>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {trabajosRecientes.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                        Trabajos recientes
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {trabajosRecientes.map((item, index) => (
                            <span
                                key={`${item.orden || "sin-orden"}-${index}`}
                                className="rounded-full border border-[#C9A75D]/30 bg-[#FBF6EA] px-3 py-1.5 text-xs font-bold text-[#8A5A00]"
                            >
                                {item.descripcion} · {formatearFecha(item.fecha)}
                            </span>
                        ))}
                    </div>
                </div>
            ) : null}
        </SeccionExpediente>
    );
}

function SeccionOrdenesServicio({ historial }) {
    return (
        <SeccionExpediente
            icono={History}
            titulo="Órdenes de servicio del VIN"
            subtitulo="Historial operativo en formato tabular para comparar las órdenes sin perder el contexto visual."
        >
            {historial.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                    No hay registros de postventa para este número de serie.
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="flex flex-col gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-sm font-black text-slate-950">
                                Historial de órdenes
                            </div>
                            <div className="mt-1 text-xs font-semibold text-slate-500">
                                {historial.length} orden{historial.length === 1 ? "" : "es"} encontrada{historial.length === 1 ? "" : "s"} para este VIN.
                            </div>
                        </div>

                        <span className="inline-flex w-fit rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                            Vista tabular
                        </span>
                    </div>

                    <div className="max-h-[560px] overflow-auto">
                        <table className="min-w-[2900px] w-full border-separate border-spacing-0 text-left text-xs xl:text-[13px]">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-slate-950 text-white">
                                    <th className="sticky left-0 z-20 border-r border-white/10 bg-slate-950 px-3 py-3 font-black">OS</th>
                                    <th className="px-3 py-3 font-black">Orden</th>
                                    <th className="px-3 py-3 font-black">Fecha orden</th>
                                    <th className="px-3 py-3 font-black">Fecha promesa</th>
                                    <th className="px-3 py-3 font-black">Fecha cierre</th>
                                    <th className="px-3 py-3 font-black">Fecha factura</th>
                                    <th className="px-3 py-3 font-black">Tipo orden</th>
                                    <th className="px-3 py-3 font-black">Clasificación</th>
                                    <th className="px-3 py-3 font-black">Estatus</th>
                                    <th className="px-3 py-3 font-black">Descripción</th>
                                    <th className="px-3 py-3 font-black">Observaciones</th>
                                    <th className="px-3 py-3 font-black">Kilometraje</th>
                                    <th className="px-3 py-3 font-black">Asesor</th>
                                    <th className="px-3 py-3 font-black">Técnico</th>
                                    <th className="px-3 py-3 font-black">Subtotal</th>
                                    <th className="px-3 py-3 font-black">Costo</th>
                                    <th className="px-3 py-3 font-black">Factura</th>
                                    <th className="px-3 py-3 font-black">VIN</th>
                                    <th className="px-3 py-3 font-black">Vehículo</th>
                                    <th className="px-3 py-3 font-black">Año</th>
                                    <th className="px-3 py-3 font-black">Placas</th>
                                    <th className="px-3 py-3 font-black">Color</th>
                                    <th className="px-3 py-3 font-black">Cliente</th>
                                    <th className="px-3 py-3 font-black">Contacto</th>
                                    <th className="px-3 py-3 font-black">Tel. contacto</th>
                                    <th className="px-3 py-3 font-black">Celular</th>
                                    <th className="px-3 py-3 font-black">Email</th>
                                    <th className="px-3 py-3 font-black">RFC</th>
                                    <th className="px-3 py-3 font-black">Ciudad</th>
                                    <th className="px-3 py-3 font-black">Dirección</th>
                                    <th className="px-3 py-3 font-black">Aseguradora</th>
                                    <th className="px-3 py-3 font-black">Póliza</th>
                                    <th className="px-3 py-3 font-black">Siniestro</th>
                                    <th className="px-3 py-3 font-black">Situación</th>
                                    <th className="px-3 py-3 font-black">Nivel asegurado</th>
                                    <th className="px-3 py-3 font-black">CONO</th>
                                    <th className="px-3 py-3 font-black">Salida</th>
                                    <th className="px-3 py-3 font-black">ID salida</th>
                                </tr>
                            </thead>

                            <tbody>
                                {historial.map((item, index) => {
                                    const descripcion = obtenerDescripcionOS(item);
                                    const estatus = item.ord_status || item.ore_status || item.status;
                                    const salida = [item.sal_fecsalida, item.sal_horasalida]
                                        .filter(Boolean)
                                        .join(" ");

                                    return (
                                        <tr
                                            key={`${item.ore_idorden || item.orden || "sin-id"}-${index}`}
                                            className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/80"} transition hover:bg-[#FBF6EA]`}
                                        >
                                            <CeldaOS sticky importante valor={item.ore_idorden || item.orden} />
                                            <CeldaOS valor={item.orden} />
                                            <CeldaOS valor={formatearFecha(item.ore_fechaord)} />
                                            <CeldaOS valor={formatearFecha(item.ore_fechaprom)} />
                                            <CeldaOS valor={formatearFecha(item.ore_fechacie)} />
                                            <CeldaOS valor={formatearFecha(item.fecha_factura)} />
                                            <CeldaOS valor={item.tiporden} />
                                            <CeldaOS valor={item.clasificacion} />
                                            <CeldaOS>
                                                <BadgeEstatusTabla estado={estatus} />
                                            </CeldaOS>
                                            <CeldaOS ancho="min-w-[320px]">
                                                <TextoTablaLargo texto={descripcion} />
                                            </CeldaOS>
                                            <CeldaOS ancho="min-w-[320px]">
                                                <TextoTablaLargo texto={item.ore_observaciones} />
                                            </CeldaOS>
                                            <CeldaOS valor={formatearNumeroPlano(item.ore_kilometraje)} />
                                            <CeldaOS valor={item.asesor} />
                                            <CeldaOS valor={item.tecnico} />
                                            <CeldaOS valor={formatearMoneda(item.ord_subtotal)} />
                                            <CeldaOS valor={formatearMoneda(item.ord_costo)} />
                                            <CeldaOS valor={item.factura} />
                                            <CeldaOS valor={item.ore_numserie} />
                                            <CeldaOS ancho="min-w-[220px]" valor={item.desc_auto || item.veh_tipoauto} />
                                            <CeldaOS valor={item.veh_anmodelo} />
                                            <CeldaOS valor={item.veh_noplacas || item.noplacaskod} />
                                            <CeldaOS valor={item.colorexterior || item.colextkod} />
                                            <CeldaOS ancho="min-w-[220px]" valor={item.nombre_cte || item.nombre} />
                                            <CeldaOS valor={item.veh_contacto} />
                                            <CeldaOS valor={item.tel_contacto} />
                                            <CeldaOS valor={item.per_telcelular || item.contacto_celular} />
                                            <CeldaOS ancho="min-w-[230px]" valor={item.per_email || item.email_contacto} />
                                            <CeldaOS valor={item.per_rfc} />
                                            <CeldaOS valor={item.per_ciudad} />
                                            <CeldaOS ancho="min-w-[280px]" valor={construirDireccion(item)} />
                                            <CeldaOS valor={item.aseguradora} />
                                            <CeldaOS valor={item.ore_idpoliza} />
                                            <CeldaOS valor={item.ore_idsiniestro} />
                                            <CeldaOS valor={item.situacion} />
                                            <CeldaOS valor={item.nivelasegurado} />
                                            <CeldaOS valor={item.cono} />
                                            <CeldaOS valor={salida} />
                                            <CeldaOS valor={item.sal_idsalida} />
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </SeccionExpediente>
    );
}

function CeldaOS({ valor, children, sticky = false, importante = false, ancho = "whitespace-nowrap" }) {
    const contenido = children ?? formatearValorCelda(valor);
    const stickyClass = sticky
        ? "sticky left-0 z-[5] border-r border-slate-200 bg-inherit"
        : "";
    const textoClass = importante ? "font-black text-slate-950" : "font-semibold text-slate-700";

    return (
        <td className={`${stickyClass} border-t border-slate-200 px-3 py-3 align-top ${ancho} ${textoClass}`}>
            {contenido}
        </td>
    );
}

function TextoTablaLargo({ texto }) {
    const valor = formatearValorCelda(texto);

    if (valor === "-") {
        return <span className="text-slate-400">-</span>;
    }

    return (
        <div className="max-h-24 overflow-y-auto whitespace-pre-wrap break-words pr-1 text-sm leading-5 text-slate-700">
            {valor}
        </div>
    );
}

function BadgeEstatusTabla({ estado }) {
    const texto = String(estado || "").trim();
    const upper = texto.toUpperCase();

    if (!texto) {
        return (
            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-500">
                Sin dato
            </span>
        );
    }

    if (upper.includes("CERR") || upper.includes("FACT")) {
        return (
            <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                {texto}
            </span>
        );
    }

    if (upper.includes("ABI") || upper.includes("PROCES") || upper.includes("PEND")) {
        return (
            <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-700">
                {texto}
            </span>
        );
    }

    if (upper.includes("CANCEL")) {
        return (
            <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-black text-red-700">
                {texto}
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-700">
            {texto}
        </span>
    );
}

function obtenerDescripcionOS(item = {}) {
    return (
        item.ord_descrip ||
        item.ord_referencia2 ||
        item.clasificacion ||
        item.tiporden ||
        "Sin descripción"
    );
}

function formatearValorCelda(valor) {
    if (valor === null || valor === undefined || valor === "") return "-";
    return valor;
}

function SeccionExpediente({ icono: Icono, titulo, subtitulo, children, compacto = false }) {
    return (
        <section className="rounded-[22px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-4 lg:px-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-[#C9A75D]">
                        <Icono className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base font-black text-slate-950">{titulo}</h3>
                        {subtitulo ? (
                            <p className="mt-1 text-sm leading-5 text-slate-500">{subtitulo}</p>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className={compacto ? "p-4" : "p-4 lg:p-5"}>{children}</div>
        </section>
    );
}

function BloqueDatos({ titulo, children }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h4 className="mb-3 text-sm font-black text-slate-900">{titulo}</h4>
            {children}
        </div>
    );
}

function TablaDatos({ datos = [] }) {
    return (
        <div className="divide-y divide-slate-100">
            {datos.map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4">
                    <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                        {label}
                    </div>
                    <div className="break-words text-sm font-semibold text-slate-800">
                        {value || "-"}
                    </div>
                </div>
            ))}
        </div>
    );
}

function MiniDatoOS({ label, value }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left sm:text-right">
            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                {label}
            </div>
            <div className="text-sm font-black text-slate-900">{value || "-"}</div>
        </div>
    );
}

function AccionContacto({ icono: Icono, label, href, disabled }) {
    if (disabled) {
        return (
            <div className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-400">
                <Icono className="h-4 w-4" />
                {label}
            </div>
        );
    }

    return (
        <a
            href={href}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-900 bg-slate-950 px-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
            <Icono className="h-4 w-4" />
            {label}
        </a>
    );
}

function BadgeRevisionClaro({ estado }) {
    if (estado === "Revisar ahora") {
        return <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">Revisar ahora</span>;
    }

    if (estado === "Próximo a revisar") {
        return <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">Próximo a revisar</span>;
    }

    if (estado === "Aún reciente") {
        return <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Aún reciente</span>;
    }

    return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{estado || "Sin dato"}</span>;
}

function construirDireccion(item = {}) {
    return [item.per_calle1, item.per_numexter, item.per_numiner, item.per_delegac, item.per_codpos]
        .filter(Boolean)
        .join(" ");
}

function SelectorSegmentos({ segmentoActivo, onCambiarSegmento, variante }) {
    const esOscuro = variante === "oscuro";

    return (
        <div className="flex flex-wrap gap-2">
            {SEGMENTOS.map((segmento) => {
                const activo = segmentoActivo === segmento.id;

                return (
                    <button
                        key={segmento.id}
                        type="button"
                        onClick={() => onCambiarSegmento(segmento.id)}
                        className={`inline-flex items-center rounded-lg border px-3.5 py-2 text-sm font-bold transition ${activo
                            ? "border-[#C9A75D] bg-[#C9A75D] text-slate-950 shadow-[0_8px_18px_rgba(201,167,93,0.22)]"
                            : esOscuro
                                ? "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10 hover:text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:border-[#C9A75D] hover:bg-[#FBF6EA]"
                            }`}
                    >
                        {segmento.label}
                    </button>
                );
            })}
        </div>
    );
}

function TarjetaPaginacion({
    cargando,
    paginaActual,
    totalPaginas,
    tamanoPagina,
    onPaginaAnterior,
    onPaginaSiguiente,
    onCambiarTamanoPagina,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <p className="mb-3 text-sm font-semibold text-slate-700">Paginación</p>

            <div className="mb-3">
                <select
                    value={tamanoPagina}
                    onChange={(e) => onCambiarTamanoPagina(e.target.value)}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
                >
                    {OPCIONES_TAMANO_PAGINA.map((opcion) => (
                        <option key={opcion} value={opcion}>
                            {opcion}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={onPaginaAnterior}
                    disabled={cargando || paginaActual <= 1}
                    className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </button>

                <div className="flex h-10 min-w-[90px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700">
                    {paginaActual} / {totalPaginas}
                </div>

                <button
                    type="button"
                    onClick={onPaginaSiguiente}
                    disabled={cargando || paginaActual >= totalPaginas}
                    className="inline-flex h-10 items-center rounded-lg border border-slate-900 bg-slate-900 px-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function CardHistorial({ item }) {
    const descripcion =
        item.ord_descrip ||
        item.ord_referencia2 ||
        item.clasificacion ||
        item.tiporden ||
        "Sin descripción";

    const fechaPrincipal =
        item.ore_fechaord ||
        item.ore_fechacie ||
        item.vte_fechdocto ||
        item.fecha_factura ||
        item.ore_fechaprom;

    const camposExtra = [
        ["Orden", item.orden],
        ["ORE_IDORDEN", item.ore_idorden],
        ["TIPORDEN", item.tiporden],
        ["STATUS OS", item.ord_status],
        ["Clasificación", item.clasificacion],
        ["Vehículo contacto", item.veh_contacto],
        ["Asesor", item.asesor],
        ["Técnico", item.tecnico],
        ["Fecha entrada", formatearFecha(item.ore_fechaprom)],
        ["Fecha cierre", formatearFecha(item.ore_fechacie)],
        ["Fecha factura", formatearFecha(item.fecha_factura)],
        ["Fecha salida", item.sal_fecsalida],
        ["Factura", item.factura],
        ["Subtotal", formatearMoneda(item.ord_subtotal)],
        ["Costo", formatearMoneda(item.ord_costo)],
        ["Kilometraje", item.ore_kilometraje],
        ["Placas", item.veh_noplacas],
        ["Año modelo", item.veh_anmodelo],
        ["Aseguradora", item.aseguradora],
        ["Póliza", item.ore_idpoliza],
        ["Siniestro", item.ore_idsiniestro],
        ["Situación", item.situacion],
        ["Nivel asegurado", item.nivelasegurado],
        ["Ciudad", item.per_ciudad],
        ["RFC", item.per_rfc],
        ["CONO", item.cono],
        ["STATUS", item.status],
    ];

    return (
        <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,#0F172A_0%,#090909_100%)] p-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#C9A75D]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#E8D3A3]">
                            {item.clasificacion || "Sin clasificación"}
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">
                            Orden: {item.ore_idorden || "-"}
                        </span>
                    </div>

                    <div className="mt-3 text-base font-black text-white">{descripcion}</div>

                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-white/70 sm:grid-cols-2 xl:grid-cols-4">
                        <span>Fecha: {formatearFecha(fechaPrincipal)}</span>
                        <span>Kilometraje: {item.ore_kilometraje || "-"}</span>
                        <span>Asesor: {item.asesor || "-"}</span>
                        <span>Técnico: {item.tecnico || "-"}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                        Subtotal: {formatearMoneda(item.ord_subtotal)}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                        Costo: {formatearMoneda(item.ord_costo)}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                        Estatus: {item.ord_status || item.ore_status || "-"}
                    </span>
                </div>
            </div>

            {item.ore_observaciones ? (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                        Observaciones
                    </div>
                    <div className="mt-2 text-sm text-white/85">{item.ore_observaciones}</div>
                </div>
            ) : null}

            <details className="mt-4 rounded-2xl border border-[#C9A75D]/15 bg-[#0B0B0B] p-4">
                <summary className="cursor-pointer select-none text-sm font-bold text-[#E8D3A3]">
                    Ver detalle completo
                </summary>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {camposExtra.map(([label, value]) => (
                        <DatoDetalle key={label} label={label} value={value} />
                    ))}
                </div>
            </details>
        </div>
    );
}


function SeccionComentariosVenta({ comentarios, guardando, onGuardarComentario }) {
    const [comentario, setComentario] = useState("");
    const textoLimpio = comentario.trim();

    async function enviarComentario(evento) {
        evento.preventDefault();

        if (!textoLimpio || guardando || typeof onGuardarComentario !== "function") {
            return;
        }

        await onGuardarComentario(textoLimpio);
        setComentario("");
    }

    return (
        <section className="rounded-[24px] border border-[#C9A75D]/20 bg-[#11100E] p-4 lg:p-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#E8D3A3]">
                    <MessageSquare className="h-4 w-4" />
                    Comentarios generales de la venta
                </div>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/60">
                    {comentarios.length} comentario{comentarios.length === 1 ? "" : "s"}
                </span>
            </div>

            <form onSubmit={enviarComentario} className="rounded-[20px] border border-white/10 bg-white/[0.04] p-3 sm:p-4">
                <textarea
                    value={comentario}
                    onChange={(evento) => setComentario(evento.target.value)}
                    maxLength={2000}
                    rows={3}
                    placeholder="Escribe el seguimiento comercial, acuerdo con cliente, llamada realizada o siguiente acción..."
                    className="min-h-[96px] w-full resize-y rounded-2xl border border-white/10 bg-[#0B1020] px-4 py-3 text-sm font-medium text-white outline-none placeholder:text-white/35 focus:border-[#C9A75D]/50"
                />

                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-xs font-semibold text-white/45">
                        {textoLimpio.length}/2000 caracteres
                    </div>

                    <button
                        type="submit"
                        disabled={!textoLimpio || guardando}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-[#C9A75D]/30 bg-[#C9A75D]/15 px-4 text-sm font-bold text-[#E8D3A3] transition hover:bg-[#C9A75D]/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {guardando ? "Guardando..." : "Guardar comentario"}
                    </button>
                </div>
            </form>

            {comentarios.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/60">
                    Aún no hay comentarios registrados para esta venta.
                </div>
            ) : (
                <div className="mt-4 space-y-3">
                    {comentarios.map((item) => (
                        <article
                            key={item.id}
                            className="rounded-[18px] border border-white/10 bg-[#0B1020] p-4"
                        >
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm font-black text-white/90">
                                    {item.creado_por || "CRM Chevrolet"}
                                </div>
                                <div className="text-xs font-semibold text-white/45">
                                    {formatearFechaHora(item.creado_en)}
                                </div>
                            </div>

                            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/75">
                                {item.comentario}
                            </p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

function KpiDetalle({ titulo, valor }) {
    return (
        <div className="rounded-[22px] border border-[#C9A75D]/20 bg-[#161311] p-4">
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                {titulo}
            </div>
            <div className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {valor || "-"}
            </div>
        </div>
    );
}

function DatoDetalle({ icono: Icono, label, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                {Icono ? <Icono className="h-4 w-4 text-[#C9A75D]" /> : null}
                <span>{label}</span>
            </div>
            <div className="break-words text-sm font-semibold text-white/90">{value || "-"}</div>
        </div>
    );
}

function DatoInline({ label, value }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                {label}
            </div>
            <div className="mt-1 text-sm font-semibold text-white/90">{value || "-"}</div>
        </div>
    );
}

function BadgeRevision({ estado }) {
    if (estado === "Revisar ahora") {
        return (
            <span className="inline-flex rounded-full bg-red-500/15 px-3 py-1 text-xs font-bold text-red-300">
                Revisar ahora
            </span>
        );
    }

    if (estado === "Próximo a revisar") {
        return (
            <span className="inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
                Próximo a revisar
            </span>
        );
    }

    if (estado === "Aún reciente") {
        return (
            <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                Aún reciente
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
            {estado || "Sin dato"}
        </span>
    );
}

function FilaResumenGeneral({ segmento, cargando }) {
    return (
        <div className="relative rounded-xl border border-black/10 bg-white p-4 pt-7 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-5 sm:pt-8">
            <div className="absolute left-4 top-0 -translate-y-1/2 rounded-lg bg-slate-900 px-4 py-1.5 text-base font-black text-white shadow-[0_12px_24px_rgba(15,23,42,0.2)] sm:px-5 sm:py-2 sm:text-lg">
                {segmento.label}
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[200px_220px_minmax(0,1fr)] 2xl:grid-cols-[210px_230px_minmax(0,1fr)]">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-sm font-semibold text-slate-700">Porcentaje de retorno</div>

                    <div className="mt-2 h-[150px]">
                        {cargando ? (
                            <EstadoPanel mensaje="Cargando..." />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadialBarChart
                                    cx="50%"
                                    cy="92%"
                                    innerRadius="72%"
                                    outerRadius="112%"
                                    barSize={14}
                                    data={segmento.datosGauge}
                                    startAngle={180}
                                    endAngle={0}
                                >
                                    <PolarAngleAxis
                                        type="number"
                                        domain={[0, 100]}
                                        angleAxisId={0}
                                        tick={false}
                                    />
                                    <RadialBar
                                        background={{ fill: "#E7E5E4" }}
                                        dataKey="value"
                                        cornerRadius={999}
                                    />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="-mt-4 text-center">
                        <div className="text-2xl font-black tracking-tight text-slate-900">
                            {formatearPorcentaje(segmento.porcentajeRetorno)}
                        </div>

                        <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500 sm:text-sm">
                            <span>0%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-4">
                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            Vines del segmento
                        </div>

                        <div className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                            {formatearNumero(segmento.vinesSegmento)}
                        </div>
                    </div>

                    <MiniIndicador
                        titulo="Vines activos"
                        valor={formatearNumero(segmento.vinesActivos)}
                        colorFondo="bg-slate-900"
                        colorTexto="text-white"
                        colorDetalle="text-white/65"
                    />

                    <MiniIndicador
                        titulo="Vines inactivos"
                        valor={formatearNumero(segmento.vinesInactivos)}
                        colorFondo="bg-[#F6E9C8]"
                        colorTexto="text-[#8A5A00]"
                        colorDetalle="text-[#8A5A00]/70"
                    />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm font-semibold text-slate-700">Distribución por modelo</div>
                        <LegendPayload />
                    </div>

                    <div className="h-[220px]">
                        {cargando ? (
                            <EstadoPanel mensaje="Cargando gráfica..." />
                        ) : segmento.modelosGrafica.length === 0 ? (
                            <EstadoPanel mensaje="No hay datos de modelos para mostrar." />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={segmento.modelosGrafica}
                                    margin={{ top: 8, right: 10, left: 0, bottom: 28 }}
                                    barCategoryGap="18%"
                                >
                                    <CartesianGrid vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="nombre"
                                        angle={-18}
                                        textAnchor="end"
                                        interval={0}
                                        tick={{ fontSize: 10, fill: "#64748B" }}
                                        height={50}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: "#F8FAFC" }}
                                        content={<TooltipModelos />}
                                    />
                                    <Bar
                                        dataKey="activo"
                                        name="Activo"
                                        fill={COLOR_TINTA}
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={24}
                                    />
                                    <Bar
                                        dataKey="inactivo"
                                        name="Inactivo"
                                        fill={COLOR_ORO}
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={24}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Panel({ children, className = "" }) {
    return (
        <div className={`rounded-xl border border-black/10 bg-white p-4 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-5 ${className}`}>
            {children}
        </div>
    );
}

function PanelHeader({ icono: Icono, titulo, subtitulo, className = "" }) {
    return (
        <div className={`mb-2 flex items-start gap-3 ${className}`}>
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[#C9A75D]">
                <Icono className="h-4 w-4" />
            </div>

            <div>
                <h2 className="text-[15px] font-black tracking-tight text-slate-900 sm:text-base">
                    {titulo}
                </h2>
                {subtitulo ? <p className="mt-1 text-sm text-slate-500">{subtitulo}</p> : null}
            </div>
        </div>
    );
}

function MiniIndicador({
    titulo,
    valor,
    colorFondo = "bg-slate-100",
    colorTexto = "text-slate-900",
    colorDetalle = "text-slate-500",
}) {
    return (
        <div className={`rounded-xl p-4 ${colorFondo}`}>
            <div className={`text-[11px] font-bold uppercase tracking-[0.18em] ${colorDetalle}`}>
                {titulo}
            </div>

            <div className={`mt-2 text-2xl font-black tracking-tight sm:text-3xl ${colorTexto}`}>
                {valor}
            </div>
        </div>
    );
}

function ChipInfo({ etiqueta, valor }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:text-[11px]">
                {etiqueta}
            </div>
            <div className="mt-0.5 text-sm font-black text-slate-900">{valor}</div>
        </div>
    );
}

function FiltroBusqueda({ titulo, valor, onChange, onClear }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <p className="mb-3 text-sm font-semibold text-slate-700">{titulo}</p>

            <div className="flex items-center gap-2">
                <div className="flex h-10 flex-1 items-center rounded-lg border border-slate-300 bg-white px-3">
                    <input
                        type="text"
                        value={valor}
                        onChange={onChange}
                        placeholder="Buscar"
                        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                    <Search className="h-4 w-4 text-slate-400" />
                </div>

                <button
                    type="button"
                    onClick={onClear}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100"
                    title="Limpiar filtro"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function FiltroSelect({ titulo, valor, onChange, opciones = [] }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <p className="mb-3 text-sm font-semibold text-slate-700">{titulo}</p>

            <select
                value={valor}
                onChange={onChange}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
            >
                {opciones.map((opcion) => (
                    <option key={`${titulo}-${opcion.value}`} value={opcion.value}>
                        {opcion.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function FiltroNumeroComparador({
    titulo,
    operador,
    valor,
    onChangeOperador,
    onChangeValor,
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
            <p className="mb-3 text-sm font-semibold text-slate-700">{titulo}</p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_minmax(0,1fr)]">
                <select
                    value={operador}
                    onChange={onChangeOperador}
                    className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
                >
                    {OPERADORES_COMPARACION.map((opcion) => (
                        <option key={`${titulo}-operador-${opcion.value}`} value={opcion.value}>
                            {opcion.label}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    min="0"
                    value={valor}
                    onChange={onChangeValor}
                    placeholder="Valor"
                    disabled={!operador}
                    className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:bg-slate-100"
                />
            </div>
        </div>
    );
}

function FiltroSelectCompacto({ titulo, valor, onChange, opciones = [] }) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[11px]">
                {titulo}
            </p>

            <select
                value={valor}
                onChange={onChange}
                className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 outline-none"
            >
                {opciones.map((opcion) => (
                    <option key={`${titulo}-${opcion.value}`} value={opcion.value}>
                        {opcion.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function FiltroNumeroComparadorCompacto({
    titulo,
    operador,
    valor,
    onChangeOperador,
    onChangeValor,
}) {
    return (
        <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[11px]">
                {titulo}
            </p>

            <div className="grid grid-cols-1 gap-1">
                <select
                    value={operador}
                    onChange={onChangeOperador}
                    className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 outline-none"
                >
                    {OPERADORES_COMPARACION.map((opcion) => (
                        <option key={`${titulo}-operador-${opcion.value}`} value={opcion.value}>
                            {opcion.label}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    min="0"
                    value={valor}
                    onChange={onChangeValor}
                    placeholder="Valor"
                    disabled={!operador}
                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 disabled:bg-slate-100"
                />
            </div>
        </div>
    );
}

function LegendPayload() {
    return (
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[11px]">
            <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#0F172A]" />
                <span>Activo</span>
            </div>

            <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#C9A75D]" />
                <span>Inactivo</span>
            </div>
        </div>
    );
}

function TooltipModelos({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    const activo = Number(payload.find((item) => item.dataKey === "activo")?.value || 0);
    const inactivo = Number(payload.find((item) => item.dataKey === "inactivo")?.value || 0);

    return (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-xl">
            <p className="text-sm font-black text-slate-900">{label}</p>
            <p className="mt-2 text-sm font-medium text-slate-600">
                Activo: <span className="font-bold text-slate-900">{formatearNumero(activo)}</span>
            </p>
            <p className="text-sm font-medium text-slate-600">
                Inactivo: <span className="font-bold text-slate-900">{formatearNumero(inactivo)}</span>
            </p>
            <p className="mt-1 text-sm font-medium text-slate-600">
                Total: <span className="font-bold text-slate-900">{formatearNumero(activo + inactivo)}</span>
            </p>
        </div>
    );
}

function EstadoPanel({ mensaje }) {
    return (
        <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm font-medium text-slate-500">
            {mensaje}
        </div>
    );
}

function EstatusBadge({ estatus }) {
    const texto = String(estatus || "").toUpperCase();

    if (texto === "ACTIVO") {
        return (
            <span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                ACTIVO
            </span>
        );
    }

    if (texto === "INACTIVO") {
        return (
            <span className="inline-flex rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                INACTIVO
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
            {texto || "SIN DATO"}
        </span>
    );
}

function PrioridadBadge({ prioridad }) {
    const textoOriginal = String(prioridad || "").trim();
    const texto = textoOriginal.toUpperCase();

    if (texto === "PRIORIDAD 1A" || texto === "PRIORIDAD 1B") {
        return (
            <span className="inline-flex rounded-lg bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                {textoOriginal}
            </span>
        );
    }

    if (texto === "PRIORIDAD 2A" || texto === "PRIORIDAD 2B") {
        return (
            <span className="inline-flex rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                {textoOriginal}
            </span>
        );
    }

    if (
        texto === "PRIORIDAD 3A" ||
        texto === "PRIORIDAD 3B" ||
        texto === "FRANJA 1" ||
        texto === "FRANJA 2"
    ) {
        return (
            <span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
                {textoOriginal}
            </span>
        );
    }

    if (texto === "SIN PRIORIDAD") {
        return (
            <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                {textoOriginal}
            </span>
        );
    }

    return (
        <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
            {textoOriginal || "SIN DATO"}
        </span>
    );
}

function construirModelosGrafica(datosModelos = []) {
    const acumulado = new Map();

    (Array.isArray(datosModelos) ? datosModelos : []).forEach((item) => {
        const nombreBase = item?.nombre || item?.modelo || item?.version || item?.name || "";
        const nombre = obtenerNombreModelo(nombreBase);

        const activo = Number(item?.activo || 0);
        const inactivo = Number(item?.inactivo || 0);

        if (!acumulado.has(nombre)) {
            acumulado.set(nombre, {
                nombre,
                activo: 0,
                inactivo: 0,
                total: 0,
            });
        }

        const actual = acumulado.get(nombre);
        actual.activo += activo;
        actual.inactivo += inactivo;
        actual.total += activo + inactivo;
    });

    return [...acumulado.values()].sort((a, b) => b.total - a.total).slice(0, 10);
}

export function normalizarDashboard(respuesta = {}) {
    const porcentajeRetorno = Number(respuesta?.porcentajeRetorno || 0);
    const vinesSegmento = Number(respuesta?.vinesSegmento || 0);
    const vinesActivos = Number(respuesta?.vinesActivos || 0);
    const vinesInactivos = Number(respuesta?.vinesInactivos || 0);
    const datosModelos = Array.isArray(respuesta?.datosModelos) ? respuesta.datosModelos : [];
    const clientes = Array.isArray(respuesta?.clientes) ? respuesta.clientes : [];
    const totalClientes = Number(respuesta?.totalClientes || 0);
    const paginaActual = Number(respuesta?.paginaActual || 1);
    const totalPaginas = Number(respuesta?.totalPaginas || 1);
    const tamanoPagina = Number(respuesta?.tamanoPagina || TAMANO_PAGINA);

    return {
        porcentajeRetorno,
        vinesSegmento,
        vinesActivos,
        vinesInactivos,
        datosModelos,
        modelosGrafica: construirModelosGrafica(datosModelos),
        clientes,
        totalClientes,
        paginaActual,
        totalPaginas,
        tamanoPagina,
        tienePaginaAnterior: Boolean(respuesta?.tienePaginaAnterior),
        tienePaginaSiguiente: Boolean(respuesta?.tienePaginaSiguiente),
        datosGauge: [
            {
                name: "Retorno",
                value: porcentajeRetorno,
                fill: COLOR_TINTA,
            },
        ],
    };
}

export function formatearNumero(valor) {
    const numero = Number(valor || 0);
    return new Intl.NumberFormat("es-MX").format(numero);
}

export function formatearNumeroPlano(valor) {
    if (valor === null || valor === undefined || valor === "") return "-";
    const numero = Number(valor);
    if (Number.isNaN(numero)) return String(valor);
    return new Intl.NumberFormat("es-MX").format(numero);
}

function formatearPorcentaje(valor) {
    const numero = Number(valor || 0);
    return `${numero.toFixed(1)}%`;
}

function formatearFecha(valor) {
    if (!valor) return "-";

    const fecha = new Date(`${valor}T00:00:00`);
    if (Number.isNaN(fecha.getTime())) return valor;

    return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(fecha);
}

function formatearFechaHora(valor) {
    if (!valor) return "-";

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return valor;

    return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(fecha);
}

function formatearMoneda(valor) {
    if (valor === null || valor === undefined || valor === "") return "-";

    const numero = Number(valor);
    if (Number.isNaN(numero)) return valor;

    return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 2,
    }).format(numero);
}