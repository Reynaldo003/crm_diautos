import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock,
    Loader2,
    Plus,
    RefreshCcw,
    Search,
    Trash2,
    UserRound,
    X,
} from "lucide-react";

import {
    actualizarCita,
    crearCita,
    eliminarCita,
    obtenerCitas,
} from "../../lib/apiCitasCartera";
import logoChevrolet from "../../assets/logo.png";
import logoRyr from "../../assets/ryr.png";

const ESTADO_ASISTENCIA = [
    { value: "", label: "Todas" },
    { value: "true", label: "Asistió" },
    { value: "false", label: "No asistió" },
];

const TIPOS_CITA = ["Digital", "Tradicional", "Evento", "Remarketing", "Cartera BDC"];

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

const VEHICULOS = [
    "AVEO SEDAN",
    "AVEO HB",
    "ONIX",
    "GROOVE",
    "TRACKER",
    "TRAX",
    "CAPTIVA",
    "TRAVERSE",
    "SUBURBAN",
    "TAHOE",
    "BLAZER",
    "S10 MAX",
    "MONTANA",
    "SILVERADO",
    "CHEYENNE",
    "COLORADO",
    "TORNADO VAN",
    "EXPRESS MAX",
    "CORVETTE STINGRAY",
    "CORVETTE Z06",
    "CORVETTE ZR1",
    "CORVETTE ZR1X",
    "SPARK EUV",
    "CAPTIVA PHEV",
    "EQUINOX EV",
    "BLAZER EV",
    "EXPRESS MAX EV",
    "BRIGHTDROP",
];

const formInicial = {
    nombre: "",
    telefono: "",
    correo: "",
    agencia: "Chevrolet Diaz Miron",
    auto_interes: "",
    fecha: "",
    hora: "",
    asistencia: false,
    tipo_cita: "Cartera BDC",
    fuente_prospeccion: "Cartera BDC Posventa",
    asesor_digital: "",
    asesor_piso: "",
    comentarios: "",
};

export default function CarteraCitas() {
    const [citas, setCitas] = useState([]);
    const [filtros, setFiltros] = useState({
        q: "",
        asistencia: "",
    });

    const [modalAbierto, setModalAbierto] = useState(false);
    const [form, setForm] = useState(formInicial);
    const [editando, setEditando] = useState(null);

    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        cargarCitas();
    }, []);

    const citasFiltradas = useMemo(() => {
        const texto = normalizar(filtros.q);

        return citas.filter((cita) => {
            const cliente = cita.cliente || {};

            const coincideTexto =
                !texto ||
                normalizar(cliente.nombre).includes(texto) ||
                normalizar(cliente.telefono).includes(texto) ||
                normalizar(cliente.correo).includes(texto) ||
                normalizar(cita.agencia).includes(texto) ||
                normalizar(cita.auto_interes).includes(texto) ||
                normalizar(cita.asesor_digital).includes(texto) ||
                normalizar(cita.asesor_piso).includes(texto);

            const coincideAsistencia =
                filtros.asistencia === "" ||
                String(Boolean(cita.asistencia)) === filtros.asistencia;

            return coincideTexto && coincideAsistencia;
        });
    }, [citas, filtros]);

    async function cargarCitas() {
        setCargando(true);
        setError("");

        try {
            const data = await obtenerCitas({ page_size: 1000 });
            setCitas(Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError(err.message || "No se pudieron cargar las citas.");
        } finally {
            setCargando(false);
        }
    }

    function abrirCrear() {
        setEditando(null);
        setForm(formInicial);
        setModalAbierto(true);
    }

    function abrirEditar(cita) {
        const fechaHora = cita.fecha_hora_cita ? new Date(cita.fecha_hora_cita) : null;

        setEditando(cita);
        setForm({
            nombre: cita.cliente?.nombre || "",
            telefono: cita.cliente?.telefono || "",
            correo: cita.cliente?.correo || "",
            agencia: cita.agencia || "Chevrolet Diaz Miron",
            auto_interes: cita.auto_interes || "",
            fecha: fechaHora ? toFechaInput(fechaHora) : "",
            hora: fechaHora ? toHoraInput(fechaHora) : "",
            asistencia: Boolean(cita.asistencia),
            tipo_cita: cita.tipo_cita || "Cartera BDC",
            fuente_prospeccion: cita.fuente_prospeccion || "Cartera BDC Posventa",
            asesor_digital: cita.asesor_digital || "",
            asesor_piso: cita.asesor_piso || "",
            comentarios: cita.comentarios || "",
        });
        setModalAbierto(true);
    }

    function cerrarModal() {
        setModalAbierto(false);
        setEditando(null);
        setForm(formInicial);
    }

    function cambiarCampo(campo, valor) {
        setForm((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    }

    function construirPayload() {
        return {
            nombre: form.nombre.trim(),
            telefono: limpiarTelefono(form.telefono),
            correo: form.correo.trim(),
            agencia: form.agencia.trim(),
            auto_interes: form.auto_interes.trim(),
            fecha_hora_cita:
                form.fecha && form.hora ? `${form.fecha}T${form.hora}:00` : null,
            asistencia: Boolean(form.asistencia),
            tipo_cita: form.tipo_cita,
            fuente_prospeccion: form.fuente_prospeccion.trim(),
            asesor_digital: form.asesor_digital.trim(),
            asesor_piso: form.asesor_piso.trim(),
            comentarios: form.comentarios.trim(),
        };
    }

    async function guardarCita(e) {
        e.preventDefault();

        if (!form.telefono.trim()) {
            setError("El teléfono es obligatorio para ligar o crear el cliente.");
            return;
        }

        setGuardando(true);
        setError("");
        setMensaje("");

        try {
            const payload = construirPayload();

            if (editando?.id) {
                await actualizarCita(editando.id, payload);
                setMensaje("Cita actualizada correctamente.");
            } else {
                await crearCita(payload);
                setMensaje("Cita registrada correctamente.");
            }

            cerrarModal();
            await cargarCitas();
        } catch (err) {
            console.error(err);
            setError(err.message || "No se pudo guardar la cita.");
        } finally {
            setGuardando(false);
        }
    }

    async function borrarCita(cita) {
        const ok = window.confirm("¿Deseas eliminar esta cita?");
        if (!ok) return;

        try {
            await eliminarCita(cita.id);
            setMensaje("Cita eliminada correctamente.");
            await cargarCitas();
        } catch (err) {
            console.error(err);
            setError(err.message || "No se pudo eliminar la cita.");
        }
    }

    async function cambiarAsistencia(cita, asistencia) {
        try {
            await actualizarCita(cita.id, { asistencia });
            setCitas((prev) =>
                prev.map((item) => (item.id === cita.id ? { ...item, asistencia } : item))
            );
        } catch (err) {
            console.error(err);
            setError(err.message || "No se pudo actualizar la asistencia.");
        }
    }

    return (
        <div className="space-y-6">
            {error ? <Alerta tipo="error" mensaje={error} onClose={() => setError("")} /> : null}
            {mensaje ? <Alerta tipo="ok" mensaje={mensaje} onClose={() => setMensaje("")} /> : null}

            {/* Encabezado */}
            <section className="relative overflow-hidden rounded-lg bg-[linear-gradient(135deg,#0B1120_0%,#0F172A_60%,#0D1526_100%)] px-5 py-5 shadow-xl sm:px-7 lg:px-8">
                {/* brillo suave igual que Cartera */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_24%)]" />

                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Lado izquierdo */}
                    <div className="min-w-0 flex-1">
                        <div className="inline-flex items-center rounded border border-[#C9A75D]/40 bg-[#C9A75D]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#E7CF98]">
                            BDC Posventa
                        </div>
                        <h1 className="mt-3 text-[2.2rem] font-black leading-none tracking-tight text-white sm:text-[3rem] lg:text-[3.4rem]">
                            Citas registradas
                        </h1>
                        <p className="mt-2 text-sm font-semibold text-white/55">
                            Consulta, registra y administra las citas generadas desde cartera.
                        </p>
                    </div>

                    {/* Lado derecho — solo logos */}
                    <div className="flex flex-wrap items-center gap-4 self-end">
                        <img
                            src={logoChevrolet}
                            alt="Chevrolet"
                            className="h-7 w-auto object-contain sm:h-8"
                        />
                        <div className="h-8 w-px bg-white/30" />
                        <img
                            src={logoRyr}
                            alt="Grupo R&R"
                            className="h-7 w-auto object-contain sm:h-8"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
    <FiltroTexto
        label="Buscar"
        value={filtros.q}
        onChange={(e) => setFiltros((p) => ({ ...p, q: e.target.value }))}
        onClear={() => setFiltros((p) => ({ ...p, q: "" }))}
    />

    <CampoSelect
        label="Asistencia"
        value={filtros.asistencia}
        onChange={(e) => setFiltros((p) => ({ ...p, asistencia: e.target.value }))}
    >
        {ESTADO_ASISTENCIA.map((item) => (
            <option key={item.value} value={item.value}>
                {item.label}
            </option>
        ))}
    </CampoSelect>

    <Kpi titulo="Total citas" valor={citasFiltradas.length} />

    {/* Botones de acción */}
    <div className="flex flex-col gap-2">
        <span className="mb-0.5 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            Acciones
        </span>
        <div className="flex gap-2">
            <button
                type="button"
                onClick={cargarCitas}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
                <RefreshCcw className="h-4 w-4" />
                Actualizar
            </button>

            <button
                type="button"
                onClick={abrirCrear}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#C9A75D] px-3 text-sm font-black text-slate-950 shadow-lg shadow-black/20 transition hover:bg-[#d8b96f]"
            >
                <Plus className="h-4 w-4" />
                Nueva cita
            </button>
        </div>
    </div>
</div>

                

                <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
                    <div className="max-h-[680px] overflow-auto">
                        <table className="min-w-[1300px] w-full border-separate border-spacing-0 text-sm">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-[#0F172A] text-left text-white">
                                    <th className="px-4 py-3 font-bold">Fecha cita</th>
                                    <th className="px-4 py-3 font-bold">Cliente</th>
                                    <th className="px-4 py-3 font-bold">Teléfono</th>
                                    <th className="px-4 py-3 font-bold">Correo</th>
                                    <th className="px-4 py-3 font-bold">Agencia</th>
                                    <th className="px-4 py-3 font-bold">Auto interés</th>
                                    <th className="px-4 py-3 font-bold">Tipo</th>
                                    <th className="px-4 py-3 font-bold">Asesor digital</th>
                                    <th className="px-4 py-3 font-bold">Asesor piso</th>
                                    <th className="px-4 py-3 font-bold">Asistencia</th>
                                    <th className="px-4 py-3 font-bold">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {cargando ? (
                                    <tr>
                                        <td colSpan={11} className="border-t border-slate-200 px-4 py-12 text-center font-semibold text-slate-500">
                                            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-slate-400" />
                                            Cargando citas...
                                        </td>
                                    </tr>
                                ) : citasFiltradas.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="border-t border-slate-200 px-4 py-12 text-center font-semibold text-slate-500">
                                            No hay citas registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    citasFiltradas.map((cita, index) => (
                                        <tr
                                            key={cita.id}
                                            onDoubleClick={() => abrirEditar(cita)}
                                            className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/80"} transition hover:bg-[#FBF6EA]`}
                                        >
                                            <td className="border-t border-slate-200 px-4 py-3 font-bold text-slate-800 whitespace-nowrap">
                                                {formatearFechaHora(cita.fecha_hora_cita)}
                                            </td>

                                            <td className="border-t border-slate-200 px-4 py-3 font-black text-slate-900 min-w-[220px]">
                                                {cita.cliente?.nombre || "-"}
                                            </td>

                                            <td className="border-t border-slate-200 px-4 py-3 text-slate-700 whitespace-nowrap">
                                                {cita.cliente?.telefono || "-"}
                                            </td>

                                            <td className="border-t border-slate-200 px-4 py-3 text-slate-700 min-w-[220px]">
                                                {cita.cliente?.correo || "-"}
                                            </td>

                                            <td className="border-t border-slate-200 px-4 py-3 text-slate-700 whitespace-nowrap">
                                                {cita.agencia || "-"}
                                            </td>

                                            <td className="border-t border-slate-200 px-4 py-3 font-bold text-slate-800 min-w-[220px]">
                                                {cita.auto_interes || "-"}
                                            </td>

                                            <td className="border-t border-slate-200 px-4 py-3 text-slate-700 whitespace-nowrap">
                                                {cita.tipo_cita || "-"}
                                            </td>

                                            <td className="border-t border-slate-200 px-4 py-3 text-slate-700 min-w-[180px]">
                                                {cita.asesor_digital || "-"}
                                            </td>

                                            <td className="border-t border-slate-200 px-4 py-3 text-slate-700 min-w-[180px]">
                                                {cita.asesor_piso || "-"}
                                            </td>

                                            <td className="border-t border-slate-200 px-4 py-3 whitespace-nowrap">
                                                <select
                                                    value={String(Boolean(cita.asistencia))}
                                                    onChange={(e) => cambiarAsistencia(cita, e.target.value === "true")}
                                                    className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold text-slate-700 outline-none focus:border-[#C9A75D] focus:ring-4 focus:ring-[#C9A75D]/10"
                                                >
                                                    <option value="false">No asistió</option>
                                                    <option value="true">Asistió</option>
                                                </select>
                                            </td>

                                            <td className="border-t border-slate-200 px-4 py-3 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => abrirEditar(cita)}
                                                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => borrarCita(cita)}
                                                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-700 transition hover:bg-red-100"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <ModalCita
                open={modalAbierto}
                form={form}
                editando={editando}
                guardando={guardando}
                onClose={cerrarModal}
                onChange={cambiarCampo}
                onSubmit={guardarCita}
            />
        </div>
    );
}

// ==============================================================================
// COMPONENTE COMPLEMENTARIO: MODALCITA
// ==============================================================================
function ModalCita({ open, form, editando, guardando, onClose, onChange, onSubmit }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
            <form
                onSubmit={onSubmit}
                className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl"
            >
                <div className="border-b border-slate-200 bg-white px-5 py-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A75D]/30 bg-[#FFFBF0] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#80652A]">
                                <CalendarDays className="h-4 w-4" />
                                {editando ? "Editar cita" : "Nueva cita"}
                            </div>

                            <h3 className="mt-3 text-2xl font-black text-slate-950">
                                Registro de cita
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto bg-slate-50 p-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <CampoTexto label="Cliente" value={form.nombre || ""} onChange={(e) => onChange("nombre", e.target.value)} />
                        <CampoTexto label="Teléfono" value={form.telefono || ""} onChange={(e) => onChange("telefono", e.target.value)} />
                        <CampoTexto label="Correo" value={form.correo || ""} onChange={(e) => onChange("correo", e.target.value)} />

                        <CampoSelect label="Auto de interés / Modelo" value={form.auto_interes || ""} onChange={(e) => onChange("auto_interes", e.target.value)}>
                            <option value="">Selecciona un vehículo...</option>
                            {VEHICULOS.map((auto) => (
                                <option key={auto} value={auto}>
                                    {auto}
                                </option>
                            ))}
                        </CampoSelect>

                        <CampoSelect label="Tipo cita" value={form.tipo_cita || ""} onChange={(e) => onChange("tipo_cita", e.target.value)}>
                            <option value="">Selecciona tipo...</option>
                            {TIPOS_CITA.map((tipo) => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </CampoSelect>

                        <CampoTexto label="Fecha" type="date" value={form.fecha || ""} onChange={(e) => onChange("fecha", e.target.value)} />
                        <CampoTexto label="Hora" type="time" value={form.hora || ""} onChange={(e) => onChange("hora", e.target.value)} />
                        <CampoTexto label="Fuente prospección" value={form.fuente_prospeccion || ""} onChange={(e) => onChange("fuente_prospeccion", e.target.value)} />
                        <CampoTexto label="Asesor digital" value={form.asesor_digital || ""} onChange={(e) => onChange("asesor_digital", e.target.value)} />

                        <CampoSelect label="Asesor Piso" value={form.asesor_piso || ""} onChange={(e) => onChange("asesor_piso", e.target.value)}>
                            <option value="">Selecciona asesor...</option>
                            {ASESORES.map((asesor) => (
                                <option key={asesor} value={asesor}>
                                    {asesor}
                                </option>
                            ))}
                        </CampoSelect>

                        <label className="flex h-11 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={!!form.asistencia}
                                onChange={(e) => onChange("asistencia", e.target.checked)}
                                className="h-4 w-4 accent-[#C9A75D]"
                            />
                            Cliente asistió
                        </label>
                    </div>

                    <label className="mt-4 block">
                        <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                            Comentarios
                        </span>

                        <textarea
                            value={form.comentarios || ""}
                            onChange={(e) => onChange("comentarios", e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#C9A75D] focus:ring-4 focus:ring-[#C9A75D]/10"
                        />
                    </label>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        disabled={guardando}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0F172A] px-4 text-sm font-black text-white shadow-lg shadow-slate-900/15 transition hover:bg-black disabled:opacity-60"
                    >
                        {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 text-[#C9A75D]" />}
                        Guardar cita
                    </button>
                </div>
            </form>
        </div>
    );
}

// ==============================================================================
// COMPONENTES AUXILIARES DE INPUTS
// ==============================================================================
function CampoTexto({ label, value, onChange, type = "text" }) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                {label}
            </span>

            <input
                type={type}
                value={value}
                onChange={onChange}
                className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#C9A75D] focus:ring-4 focus:ring-[#C9A75D]/10"
            />
        </label>
    );
}

function CampoSelect({ label, value, onChange, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                {label}
            </span>

            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm font-bold text-slate-800 outline-none transition focus:border-[#C9A75D] focus:ring-4 focus:ring-[#C9A75D]/10"
                >
                    {children}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
        </label>
    );
}

function FiltroTexto({ label, value, onChange, onClear }) {
    return (
        <label className="block md:col-span-1">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                {label}
            </span>

            <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 transition focus-within:border-[#C9A75D] focus-within:ring-4 focus-within:ring-[#C9A75D]/10">
                <Search className="h-4 w-4 text-slate-400" />

                <input
                    value={value}
                    onChange={onChange}
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none"
                    placeholder="Cliente, teléfono, agencia..."
                />

                {value ? (
                    <button type="button" onClick={onClear}>
                        <X className="h-4 w-4 text-slate-400" />
                    </button>
                ) : null}
            </div>
        </label>
    );
}

function Kpi({ titulo, valor }) {
    return (
        <div className="rounded-lg border border-[#C9A75D]/30 bg-[#FFFBF0] px-4 py-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#80652A]">
                <UserRound className="h-4 w-4" />
                {titulo}
            </div>

            <div className="mt-1 text-2xl font-black text-slate-900">
                {new Intl.NumberFormat("es-MX").format(valor || 0)}
            </div>
        </div>
    );
}

function Alerta({ tipo, mensaje, onClose }) {
    const esError = tipo === "error";

    return (
        <div
            className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-semibold ${esError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
        >
            <span>{mensaje}</span>
            <button type="button" onClick={onClose}>
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

// ==============================================================================
// UTILERÍAS GLOBALES DE FORMATEO
// ==============================================================================
function normalizar(valor) {
    return String(valor || "")
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function limpiarTelefono(valor) {
    return String(valor || "").replace(/\D/g, "");
}

function formatearFechaHora(valor) {
    if (!valor) return "-";

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return "-";

    return new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(fecha);
}

function toFechaInput(fecha) {
    if (!fecha) return "";
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, "0");
    const d = String(fecha.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function toHoraInput(fecha) {
    if (!fecha) return "";
    const h = String(fecha.getHours()).padStart(2, "0");
    const m = String(fecha.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
}