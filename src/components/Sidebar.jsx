import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ContactRound,
    BarChart3,
    Menu,
    X,
    ChevronLeft,
    LogOut,
    BanknoteArrowUp,
    Wallet,
    ClipboardCheck,
    Calendar,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import logoChevrolet from "../assets/logo.png";
import logoRyr from "../assets/ryr_blue.png";

const COLOR_ORO = "#C9A75D";

function cls(...valores) {
    return valores.filter(Boolean).join(" ");
}

function FadeLabel({ show, children, className = "" }) {
    return (
        <span
            className={cls(
                "inline-block overflow-hidden whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                show
                    ? "max-w-[220px] translate-x-0 opacity-100"
                    : "max-w-0 -translate-x-3 opacity-0",
                className
            )}
        >
            {children}
        </span>
    );
}

const links = [
    { to: "/crm_chevrolet/", label: "Inicio", icon: LayoutDashboard },
    { to: "/crm_chevrolet/citas", label: "Citas", icon: Calendar },
    { to: "/crm_chevrolet/encuestas", label: "Encuestas de Satisfaccion", icon: ClipboardCheck },
    { to: "/crm_chevrolet/prospectos", label: "Avaluos", icon: BanknoteArrowUp },
    { to: "/crm_chevrolet/cartera", label: "Cartera", icon: Wallet },
    { to: "/crm_chevrolet/retencion", label: "Retención", icon: BarChart3 },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
            }
        };

        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (!mobileOpen) return;

        const overflowAnterior = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = overflowAnterior;
        };
    }, [mobileOpen]);

    const contenido = ({ mobile = false }) => {
        const mostrarTexto = mobile ? true : !collapsed;

        return (
            <div className="flex h-full min-h-0 flex-col">
                <div
                    className={cls(
                        "border-b border-white/10 p-4 transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                        !mostrarTexto && "px-3"
                    )}
                >
                    <div
                        className={cls(
                            "flex items-center",
                            mostrarTexto ? "justify-between gap-3" : "justify-center"
                        )}
                    >
                        <div
                            className={cls(
                                "flex min-w-0 items-center",
                                mostrarTexto ? "gap-3" : "justify-center"
                            )}
                        >
                            <div
                                className={cls(
                                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-300",
                                    mostrarTexto ? "bg-white" : "bg-transparent shadow-none"
                                )}
                            >
                                {mostrarTexto ? (
                                    <img
                                        src={logoRyr}
                                        alt="Grupo R&R"
                                        className="h-full w-full object-contain"
                                    />
                                ) : null}
                            </div>

                            <FadeLabel show={mostrarTexto}>
                                <div className="min-w-0 leading-tight">
                                    <div className="truncate text-sm font-bold text-white">
                                        Grupo Automotriz R&R
                                    </div>
                                    <div className="truncate text-xs text-white/60">
                                        Chevrolet
                                    </div>
                                </div>
                            </FadeLabel>
                        </div>

                        {!mobile && (
                            <button
                                type="button"
                                onClick={() => setCollapsed((prev) => !prev)}
                                className="hidden h-10 w-10 min-w-[40px] shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white transition-all duration-300 hover:scale-[1.05] hover:bg-white/10 md:inline-flex"
                                title={collapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
                                aria-label={collapsed ? "Expandir barra lateral" : "Contraer barra lateral"}
                            >
                                <ChevronLeft
                                    size={18}
                                    className={cls(
                                        "transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                                        collapsed ? "rotate-180" : "rotate-0"
                                    )}
                                />
                            </button>
                        )}
                    </div>

                    <div
                        className={cls(
                            "mt-4 overflow-hidden transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                            mostrarTexto ? "max-h-28 opacity-100" : "max-h-0 opacity-0"
                        )}
                    >
                        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-black/30 p-2">
                                <img
                                    src={logoChevrolet}
                                    alt="Chevrolet"
                                    className="h-7 w-auto object-contain"
                                />
                            </div>

                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-white">
                                    CRM Chevrolet
                                </div>
                                <div className="truncate text-xs text-white/60">
                                    Control comercial y operativo
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <nav
                    className={cls(
                        "min-h-0 flex-1 overflow-y-auto space-y-2 p-4 transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                        !mostrarTexto && "px-3"
                    )}
                >
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/crm_chevrolet/"}
                            onClick={() => setMobileOpen(false)}
                            title={!mostrarTexto ? label : undefined}
                        >
                            {({ isActive }) => (
                                <div
                                    className={cls(
                                        "group relative flex items-center rounded-lg px-3 py-3 text-base font-medium transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)]",
                                        mostrarTexto ? "justify-start gap-3" : "justify-center",
                                        isActive
                                            ? "bg-white text-slate-900 shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
                                            : "text-white/75 hover:bg-white/10 hover:text-white"
                                    )}
                                >
                                    <span
                                        className={cls(
                                            "absolute left-1 top-1/2 h-8 w-1 -translate-y-1/2 rounded-lg transition-all duration-300",
                                            isActive
                                                ? "scale-100 opacity-100"
                                                : "scale-50 opacity-0 group-hover:scale-75 group-hover:opacity-60"
                                        )}
                                        style={{ backgroundColor: COLOR_ORO }}
                                    />

                                    <Icon
                                        size={18}
                                        className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                                        style={isActive ? { color: COLOR_ORO } : undefined}
                                    />

                                    <FadeLabel show={mostrarTexto}>{label}</FadeLabel>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto border-t border-white/10 p-3">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
                    >
                        <LogOut size={18} />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className="rounded-lg border border-slate-200 p-2 text-slate-700"
                >
                    <Menu size={20} />
                </button>

                <div className="flex items-center gap-2">
                    <img
                        src={logoChevrolet}
                        alt="Chevrolet"
                        className="h-10 w-full object-contain"
                    />
                </div>

                <div className="w-10" />
            </div>

            <aside
                className={cls(
                    "hidden shrink-0 overflow-hidden border-r border-white/5 md:sticky md:top-0 md:block md:h-screen md:self-start",
                    "transition-[width] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
                    collapsed ? "w-[66px]" : "w-[300px]"
                )}
                style={{
                    background:
                        "radial-gradient(circle at top, rgba(201,167,93,0.10), transparent 22%), linear-gradient(180deg, #050505 0%, #0B1120 55%, #050505 100%)",
                }}
            >
                {contenido({ mobile: false })}
            </aside>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="absolute inset-0 bg-black/55"
                    />

                    <aside
                        className="absolute left-0 top-0 h-full w-[88%] max-w-[320px] overflow-hidden border-r border-white/10 shadow-2xl"
                        style={{
                            background:
                                "radial-gradient(circle at top, rgba(201,167,93,0.10), transparent 22%), linear-gradient(180deg, #050505 0%, #0B1120 55%, #050505 100%)",
                        }}
                    >
                        <div className="flex items-center justify-end p-4">
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg border border-white/10 bg-white/5 p-2 text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {contenido({ mobile: true })}
                    </aside>
                </div>
            )}
        </>
    );
}