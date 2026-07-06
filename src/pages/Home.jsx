import { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";
import {
    Users,
    CarFront,
    ClipboardList,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import logoChevrolet from "../assets/logo.png";
import logoRyr from "../assets/ryr.png";



const cards = [
    {
        titulo: "Prospectos activos",
        valor: "128",
        descripcion: "Vista inicial de ejemplo",
        icono: Users,
        tendencia: "+12%",
        positivo: true,
        gradiente: "from-[#0F172A] via-[#1E293B] to-[#334155]",
        acento: "#C9A75D",
    },
    {
        titulo: "Unidades en seguimiento",
        valor: "37",
        descripcion: "Datos simulados de front",
        icono: CarFront,
        tendencia: "-4%",
        positivo: false,
        gradiente: "from-[#1E1B4B] via-[#312E81] to-[#4338CA]",
        acento: "#A5B4FC",
    },
    {
        titulo: "Tareas pendientes",
        valor: "18",
        descripcion: "Base para flujo comercial",
        icono: ClipboardList,
        tendencia: "+6%",
        positivo: true,
        gradiente: "from-[#3B0764] via-[#581C87] to-[#7E22CE]",
        acento: "#E9D5FF",
    },
    {
        titulo: "Conversión mensual",
        valor: "24%",
        descripcion: "Tarjeta demostrativa",
        icono: TrendingUp,
        tendencia: "+9%",
        positivo: true,
        gradiente: "from-[#082F49] via-[#0C4A6E] to-[#0E7490]",
        acento: "#67E8F9",
    },
];

const dataSeguimiento = [
    { mes: "Ene", prospectos: 64, conversiones: 18 },
    { mes: "Feb", prospectos: 78, conversiones: 22 },
    { mes: "Mar", prospectos: 92, conversiones: 27 },
    { mes: "Abr", prospectos: 85, conversiones: 24 },
    { mes: "May", prospectos: 101, conversiones: 31 },
    { mes: "Jun", prospectos: 118, conversiones: 36 },
    { mes: "Jul", prospectos: 128, conversiones: 41 },
];

const dataAsesores = [
    { nombre: "Karina", citas: 32 },
    { nombre: "Pedro", citas: 28 },
    { nombre: "Reyna", citas: 24 },
    { nombre: "Israel", citas: 21 },
    { nombre: "Silvia", citas: 18 },
    { nombre: "Lorenza", citas: 15 },
];

const dataEstatus = [
    { nombre: "Contactado", valor: 42, color: "#C9A75D" },
    { nombre: "En seguimiento", valor: 28, color: "#0EA5E9" },
    { nombre: "Cita agendada", valor: 18, color: "#22C55E" },
    { nombre: "Sin contacto", valor: 12, color: "#F87171" },
];

// ==============================================================================
// TOOLTIP PERSONALIZADO
// ==============================================================================
function TooltipPersonalizado({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
            {label ? (
                <div className="mb-1 text-xs font-black uppercase tracking-wide text-slate-400">
                    {label}
                </div>
            ) : null}

            <div className="space-y-1">
                {payload.map((item) => (
                    <div key={item.dataKey || item.name} className="flex items-center gap-2 text-sm font-bold">
                        <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: item.color || item.fill }}
                        />
                        <span className="text-slate-600">{item.name}:</span>
                        <span className="text-slate-900">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function Home() {
    const { user } = useAuth();

    const totalEstatus = useMemo(
        () => dataEstatus.reduce((acc, item) => acc + item.valor, 0),
        []
    );

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <section className="relative overflow-hidden rounded-lg bg-[linear-gradient(135deg,#0B1120_0%,#0F172A_60%,#0D1526_100%)] p-6 text-white shadow-xl md:p-8">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(201,167,93,0.08),transparent_30%)]" />

    {/* Ahora el contenido es flex para separar texto y logos */}
    <div className="relative flex items-start justify-between gap-4">

        {/* Lado izquierdo — texto */}
        <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-[#C9A75D]/25 bg-[#C9A75D]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#E7CF98]">
                Inicio
            </div>
            <h2 className="mt-4 text-3xl font-black md:text-4xl">
                Bienvenido, {user?.nombreCompleto || "usuario"}.
            </h2>
            <p className="mt-2 text-sm font-semibold text-white/55">
                Resumen general de la operación comercial y de cartera BDC.
            </p>
        </div>

        {/* Lado derecho — logos */}
        <div className="flex shrink-0 items-center gap-4 self-end">
            <img src={logoChevrolet} alt="Chevrolet" className="h-7 w-auto object-contain sm:h-8" />
            <div className="h-8 w-px bg-white/30" />
            <img src={logoRyr} alt="Grupo R&R" className="h-7 w-auto object-contain sm:h-8" />
        </div>

    </div>
</section>

            {/* KPIs con gradiente y hover */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {cards.map(({ titulo, valor, descripcion, icono: Icono, tendencia, positivo, gradiente, acento }) => (
                    <div
                        key={titulo}
                        className={`group relative overflow-hidden rounded-[24px] bg-gradient-to-br ${gradiente} p-5 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
                    >
                        {/* brillo decorativo */}
                        <div
                            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-35"
                            style={{ background: acento }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_40%)]" />

                        <div className="relative flex items-center justify-between">
                            <div className="text-sm font-bold text-white/70">{titulo}</div>
                            <div
                                className="rounded-2xl p-3 shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                                style={{ background: `${acento}26`, color: acento }}
                            >
                                <Icono size={20} />
                            </div>
                        </div>

                        <div className="relative mt-5 flex items-end justify-between">
                            <div className="text-4xl font-black text-white">{valor}</div>

                            <div
                                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black ${
                                    positivo
                                        ? "bg-emerald-400/15 text-emerald-300"
                                        : "bg-red-400/15 text-red-300"
                                }`}
                            >
                                {positivo ? (
                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                ) : (
                                    <ArrowDownRight className="h-3.5 w-3.5" />
                                )}
                                {tendencia}
                            </div>
                        </div>
                        

                        <p className="relative mt-2 text-sm font-medium text-white/50">{descripcion}</p>

                        {/* línea inferior animada */}
                        <div className="relative mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
                            <div
                                className="h-full rounded-full transition-all duration-500 group-hover:w-full"
                                style={{ width: "55%", background: acento }}
                            />
                        </div>
                    </div>
                ))}
            </section>

            {/* Gráficas */}
            <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {/* Área: prospectos vs conversiones */}
                <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl xl:col-span-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-black text-slate-900">Prospectos y conversiones</div>
                            <div className="text-xs font-semibold text-slate-400">Últimos 7 meses</div>
                        </div>
                        <div className="rounded-full border border-[#C9A75D]/30 bg-[#FFFBF0] px-3 py-1 text-xs font-black text-[#80652A]">
                            +41 conversiones
                        </div>
                    </div>

                    <div className="mt-4 h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dataSeguimiento} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradProspectos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0F172A" stopOpacity={0.35} />
                                        <stop offset="100%" stopColor="#0F172A" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradConversiones" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#C9A75D" stopOpacity={0.55} />
                                        <stop offset="100%" stopColor="#C9A75D" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="4 6" />
                                <XAxis
                                    dataKey="mes"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }}
                                />
                                <Tooltip content={<TooltipPersonalizado />} cursor={{ stroke: "#C9A75D", strokeWidth: 1, strokeDasharray: "4 4" }} />

                                <Area
                                    type="monotone"
                                    dataKey="prospectos"
                                    name="Prospectos"
                                    stroke="#0F172A"
                                    strokeWidth={3}
                                    fill="url(#gradProspectos)"
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="conversiones"
                                    name="Conversiones"
                                    stroke="#C9A75D"
                                    strokeWidth={3}
                                    fill="url(#gradConversiones)"
                                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-3 flex items-center gap-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#0F172A]" />
                            Prospectos
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#C9A75D]" />
                            Conversiones
                        </div>
                    </div>
                </div>

                {/* Dona: estatus de cartera */}
                <div className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="text-sm font-black text-slate-900">Estatus de cartera</div>
                    <div className="text-xs font-semibold text-slate-400">Distribución actual</div>

                    <div className="relative mt-2 h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    {dataEstatus.map((item) => (
                                        <linearGradient key={item.nombre} id={`grad-${item.nombre}`} x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                                            <stop offset="100%" stopColor={item.color} stopOpacity={0.55} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={dataEstatus}
                                    dataKey="valor"
                                    nameKey="nombre"
                                    innerRadius={58}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    cornerRadius={8}
                                    stroke="none"
                                >
                                    {dataEstatus.map((item) => (
                                        <Cell
                                            key={item.nombre}
                                            fill={`url(#grad-${item.nombre})`}
                                            className="transition-opacity duration-200 hover:opacity-80"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<TooltipPersonalizado />} />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-2xl font-black text-slate-900">{totalEstatus}</div>
                            <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Total</div>
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {dataEstatus.map((item) => (
                            <div key={item.nombre} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                                <span className="truncate">{item.nombre}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Barras: ranking de asesores */}
            <section className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-black text-slate-900">Citas agendadas por asesor</div>
                        <div className="text-xs font-semibold text-slate-400">Top 6 del mes</div>
                    </div>
                    <div className="rounded-full border border-[#C9A75D]/30 bg-[#FFFBF0] px-3 py-1 text-xs font-black text-[#80652A]">
                        Karina lidera
                    </div>
                </div>

                <div className="mt-4 h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dataAsesores} margin={{ top: 5, right: 10, left: -15, bottom: 0 }} barCategoryGap="28%">
                            <defs>
                                <linearGradient id="gradBarras" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#C9A75D" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#0F172A" stopOpacity={0.9} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} stroke="#E2E8F0" strokeDasharray="4 6" />
                            <XAxis
                                dataKey="nombre"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }}
                            />
                            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 700 }} />
                            <Tooltip content={<TooltipPersonalizado />} cursor={{ fill: "rgba(201,167,93,0.08)" }} />

                            <Bar dataKey="citas" name="Citas" fill="url(#gradBarras)" radius={[10, 10, 0, 0]} maxBarSize={48} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
}