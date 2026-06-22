import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    Building2,
    ArrowRight,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

import logoChevrolet from "../../assets/logo.png";
import logoRyr from "../../assets/ryr_blue.png";

import fondo1 from "../../assets/fondo1.jpg";
import fondo2 from "../../assets/fondo2.jpg";

const AGENCIAS = [
    "Chevrolet Diaz Miron",
    "Chevrolet Zona Norte",
];

function Input({
    label,
    icon: Icon,
    type = "text",
    value,
    onChange,
    placeholder,
    autoComplete,
    rightElement,
    required = false,
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
            <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                <Icon size={14} />
                {label}
            </label>

            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    className="h-12 w-full rounded-xl border border-white/10 bg-white/90 px-4 pr-12 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#C9A75D] focus:ring-4 focus:ring-[#C9A75D]/15"
                />

                {rightElement && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
}

function PanelInfo({ bgImage }) {
    const items = [
        "Seguimiento de prospectos y clientes",
        "Vista centralizada de la operación comercial",
        "Acceso seguro para personal autorizado",
    ];

    return (
        <div className="relative hidden min-h-[780px] overflow-hidden lg:block">
            <AnimatePresence mode="wait">
                <motion.div
                    key={bgImage}
                    initial={{ scale: 1.06, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.02, opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                >
                    <img
                        src={bgImage}
                        alt="Fondo CRM Chevrolet"
                        className="h-full w-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.58),rgba(0,0,0,0.88))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,167,93,0.20),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_25%)]" />

            <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
                <div>
                    <div className="flex items-center justify-between gap-4">
                        <motion.div
                            initial={{ opacity: 0, x: -18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55 }}
                            className="flex items-center gap-4"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
                                <img
                                    src={logoRyr}
                                    alt="Grupo R&R"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div>
                                <div className="text-xs font-bold uppercase tracking-[0.24em] text-white/65">
                                    Grupo Automotriz R&R
                                </div>
                                <div className="mt-1 text-lg font-semibold text-white">
                                    CRM Chevrolet
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.55, delay: 0.08 }}
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur"
                        >
                            <img
                                src={logoChevrolet}
                                alt="Chevrolet"
                                className="h-8 w-auto object-contain"
                            />

                            <div className="h-6 w-px bg-white/10" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                                Chevrolet
                            </span>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.55 }}
                        className="mt-28 max-w-xl"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.22, duration: 0.5 }}
                            className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C9A75D] backdrop-blur"
                        >
                            Plataforma interna
                        </motion.div>

                        <h2 className="mt-6 text-5xl font-black leading-tight text-white">
                            Controla tu operación comercial.
                        </h2>

                        <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
                            CRM enfocado en organización, seguimiento y crecimiento.
                        </p>

                        <div className="mt-8 space-y-3">
                            {items.map((item, index) => (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.28 + index * 0.08 }}
                                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur"
                                >
                                    <div className="h-2.5 w-2.5 rounded-full bg-[#C9A75D]" />
                                    <span>{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40"
                >
                    Acceso interno · Personal autorizado
                </motion.div>
            </div>
        </div>
    );
}

export default function LoginRegistro() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        login,
        register,
        isAuthenticated,
        loadingSesion,
    } = useAuth();

    const destino = location.state?.from?.pathname || "/crm_chevrolet/";

    const [tab, setTab] = useState("login");
    const [bgIndex, setBgIndex] = useState(0);

    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [mensaje, setMensaje] = useState({
        tipo: "",
        texto: "",
    });

    // ✅ CAMBIO 1: formLogin usa 'password' en lugar de 'contrasena'
    const [formLogin, setFormLogin] = useState({
        usuario: "",
        password: "",
    });

    // ✅ CAMBIO 2: formRegistro usa 'password' en lugar de 'contrasena'
    const [formRegistro, setFormRegistro] = useState({
        nombreCompleto: "",
        usuario: "",
        correo: "",
        agencia: "",
        password: "",
        confirmarPassword: "",
    });

    const fondos = useMemo(() => [fondo1, fondo2], []);

    useEffect(() => {
        if (!loadingSesion && isAuthenticated) {
            navigate(destino, { replace: true });
        }
    }, [loadingSesion, isAuthenticated, navigate, destino]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prev) => (prev + 1) % fondos.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [fondos.length]);

    const limpiarMensaje = () => {
        setMensaje({
            tipo: "",
            texto: "",
        });
    };

    // ✅ CAMBIO 3: handleLogin envía 'password'
    const handleLogin = async (e) => {
        e.preventDefault();
        limpiarMensaje();
        setLoading(true);

        try {
            await login({
                usuario: formLogin.usuario.trim(),
                password: formLogin.password,
            });

            navigate(destino, { replace: true });
        } catch (error) {
            setMensaje({
                tipo: "error",
                texto: error.message || "No se pudo iniciar sesión.",
            });
        } finally {
            setLoading(false);
        }
    };

    // ✅ CAMBIO 4: handleRegistro usa 'password' y 'confirmarPassword'
    const handleRegistro = async (e) => {
        e.preventDefault();
        limpiarMensaje();

        if (formRegistro.password !== formRegistro.confirmarPassword) {
            setMensaje({
                tipo: "error",
                texto: "Las contraseñas no coinciden.",
            });
            return;
        }

        setLoading(true);

        try {
            await register({
                nombreCompleto: formRegistro.nombreCompleto.trim(),
                usuario: formRegistro.usuario.trim(),
                correo: formRegistro.correo.trim(),
                agencia: formRegistro.agencia,
                password: formRegistro.password,
                confirmarPassword: formRegistro.confirmarPassword,
            });

            setMensaje({
                tipo: "ok",
                texto: "Cuenta creada correctamente. Ahora inicia sesión.",
            });

            setFormLogin({
                usuario: formRegistro.usuario,
                password: "",
            });

            setFormRegistro({
                nombreCompleto: "",
                usuario: "",
                correo: "",
                agencia: "",
                password: "",
                confirmarPassword: "",
            });

            setTab("login");
        } catch (error) {
            setMensaje({
                tipo: "error",
                texto: error.message || "No se pudo crear la cuenta.",
            });
        } finally {
            setLoading(false);
        }
    };

    const claseMensaje =
        mensaje.tipo === "error"
            ? "border-red-400/20 bg-red-500/10 text-red-200"
            : "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";

    if (loadingSesion) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold shadow-2xl backdrop-blur"
                >
                    Validando sesión...
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050505]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,167,93,0.12),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_22%)]"
            />

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="grid w-full max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]"
                >
                    <PanelInfo bgImage={fondos[bgIndex]} />

                    <div className="relative flex items-center justify-center bg-[linear-gradient(180deg,#0B0B0D,#131417,#191B21)] p-4 sm:p-6 lg:p-8 xl:p-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,167,93,0.10),transparent_25%)]"
                        />

                        <div className="relative z-10 w-full max-w-xl">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.45 }}
                                className="mb-6 flex items-center justify-between lg:hidden"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white p-2">
                                        <img
                                            src={logoRyr}
                                            alt="R&R"
                                            className="h-full w-full object-contain"
                                        />
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                            Grupo Automotriz R&R
                                        </div>
                                        <div className="text-base font-bold text-white">
                                            CRM Chevrolet
                                        </div>
                                    </div>
                                </div>

                                <img
                                    src={logoChevrolet}
                                    alt="Chevrolet"
                                    className="h-7 w-auto object-contain"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.16, duration: 0.5 }}
                                className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl sm:p-6 md:p-7"
                            >
                                <div className="mb-6 flex justify-center">
                                    <div className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1.5">
                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => {
                                                limpiarMensaje();
                                                setTab("login");
                                            }}
                                            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-70 ${tab === "login"
                                                ? "bg-[#C9A75D] text-black shadow"
                                                : "text-slate-300 hover:text-white"
                                                }`}
                                        >
                                            Iniciar sesión
                                        </button>

                                        <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => {
                                                limpiarMensaje();
                                                setTab("registro");
                                            }}
                                            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-70 ${tab === "registro"
                                                ? "bg-[#C9A75D] text-black shadow"
                                                : "text-slate-300 hover:text-white"
                                                }`}
                                        >
                                            Crear cuenta
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {mensaje.texto ? (
                                        <motion.div
                                            key={mensaje.texto}
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            transition={{ duration: 0.25 }}
                                            className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-medium ${claseMensaje}`}
                                        >
                                            {mensaje.texto}
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>

                                <AnimatePresence mode="wait">
                                    {tab === "login" ? (
                                        <motion.form
                                            key="login"
                                            initial={{ opacity: 0, y: 18 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -12 }}
                                            transition={{ duration: 0.35 }}
                                            onSubmit={handleLogin}
                                            className="space-y-4"
                                        >
                                            <div className="text-center">
                                                <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A75D]">
                                                    Bienvenido
                                                </div>

                                                <h1 className="mt-2 text-3xl font-black text-white">
                                                    Entra al CRM
                                                </h1>
                                            </div>

                                            <Input
                                                label="Usuario"
                                                icon={User}
                                                value={formLogin.usuario}
                                                onChange={(e) =>
                                                    setFormLogin((prev) => ({
                                                        ...prev,
                                                        usuario: e.target.value,
                                                    }))
                                                }
                                                placeholder="Ingresa tu usuario"
                                                autoComplete="username"
                                                required
                                            />

                                            <Input
                                                label="Contraseña"
                                                icon={Lock}
                                                type={showLoginPassword ? "text" : "password"}
                                                value={formLogin.password}
                                                onChange={(e) =>
                                                    setFormLogin((prev) => ({
                                                        ...prev,
                                                        password: e.target.value,
                                                    }))
                                                }
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                                required
                                                rightElement={
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowLoginPassword((prev) => !prev)
                                                        }
                                                        className="text-slate-500 transition hover:text-slate-900"
                                                        aria-label={
                                                            showLoginPassword
                                                                ? "Ocultar contraseña"
                                                                : "Mostrar contraseña"
                                                        }
                                                    >
                                                        {showLoginPassword ? (
                                                            <EyeOff size={18} />
                                                        ) : (
                                                            <Eye size={18} />
                                                        )}
                                                    </button>
                                                }
                                            />

                                            <motion.button
                                                whileHover={
                                                    loading
                                                        ? undefined
                                                        : { y: -1, scale: 1.01 }
                                                }
                                                whileTap={
                                                    loading
                                                        ? undefined
                                                        : { scale: 0.99 }
                                                }
                                                disabled={loading}
                                                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#C9A75D] px-5 py-4 text-sm font-extrabold text-black shadow-[0_16px_35px_rgba(201,167,93,0.25)] transition hover:bg-[#d7b674] disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                {loading ? "Entrando..." : "Entrar al CRM"}
                                                {!loading && <ArrowRight size={18} />}
                                            </motion.button>
                                        </motion.form>
                                    ) : (
                                        <motion.form
                                            key="registro"
                                            initial={{ opacity: 0, y: 18 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -12 }}
                                            transition={{ duration: 0.35 }}
                                            onSubmit={handleRegistro}
                                            className="space-y-4"
                                        >
                                            <div className="text-center">
                                                <div className="text-xs font-bold uppercase tracking-[0.24em] text-[#C9A75D]">
                                                    Nuevo usuario
                                                </div>

                                                <h2 className="mt-2 text-3xl font-black text-white">
                                                    Crear cuenta
                                                </h2>
                                            </div>

                                            <Input
                                                label="Nombre completo"
                                                icon={User}
                                                value={formRegistro.nombreCompleto}
                                                onChange={(e) =>
                                                    setFormRegistro((prev) => ({
                                                        ...prev,
                                                        nombreCompleto: e.target.value,
                                                    }))
                                                }
                                                placeholder="Nombre del asesor o usuario"
                                                autoComplete="name"
                                                required
                                            />

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <Input
                                                    label="Usuario"
                                                    icon={User}
                                                    value={formRegistro.usuario}
                                                    onChange={(e) =>
                                                        setFormRegistro((prev) => ({
                                                            ...prev,
                                                            usuario: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Usuario"
                                                    autoComplete="username"
                                                    required
                                                />

                                                <Input
                                                    label="Correo"
                                                    icon={Mail}
                                                    type="email"
                                                    value={formRegistro.correo}
                                                    onChange={(e) =>
                                                        setFormRegistro((prev) => ({
                                                            ...prev,
                                                            correo: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="correo@empresa.com"
                                                    autoComplete="email"
                                                    required
                                                />
                                            </div>

                                            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                                                <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                                                    <Building2 size={14} />
                                                    Agencia
                                                </label>

                                                <select
                                                    value={formRegistro.agencia}
                                                    required
                                                    onChange={(e) =>
                                                        setFormRegistro((prev) => ({
                                                            ...prev,
                                                            agencia: e.target.value,
                                                        }))
                                                    }
                                                    className="h-12 w-full rounded-xl border border-white/10 bg-white/90 px-4 text-sm font-medium text-slate-900 outline-none transition focus:border-[#C9A75D] focus:ring-4 focus:ring-[#C9A75D]/15"
                                                >
                                                    <option value="">
                                                        Selecciona una agencia
                                                    </option>

                                                    {AGENCIAS.map((agencia) => (
                                                        <option key={agencia} value={agencia}>
                                                            {agencia}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <Input
                                                    label="Contraseña"
                                                    icon={Lock}
                                                    type={
                                                        showRegisterPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={formRegistro.password}
                                                    onChange={(e) =>
                                                        setFormRegistro((prev) => ({
                                                            ...prev,
                                                            password: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Crea una contraseña"
                                                    autoComplete="new-password"
                                                    required
                                                    rightElement={
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowRegisterPassword(
                                                                    (prev) => !prev
                                                                )
                                                            }
                                                            className="text-slate-500 transition hover:text-slate-900"
                                                            aria-label={
                                                                showRegisterPassword
                                                                    ? "Ocultar contraseña"
                                                                    : "Mostrar contraseña"
                                                            }
                                                        >
                                                            {showRegisterPassword ? (
                                                                <EyeOff size={18} />
                                                            ) : (
                                                                <Eye size={18} />
                                                            )}
                                                        </button>
                                                    }
                                                />

                                                <Input
                                                    label="Confirmar contraseña"
                                                    icon={Lock}
                                                    type={
                                                        showRegisterPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={formRegistro.confirmarPassword}
                                                    onChange={(e) =>
                                                        setFormRegistro((prev) => ({
                                                            ...prev,
                                                            confirmarPassword: e.target.value,
                                                        }))
                                                    }
                                                    placeholder="Repite la contraseña"
                                                    autoComplete="new-password"
                                                    required
                                                />
                                            </div>

                                            <motion.button
                                                whileHover={
                                                    loading
                                                        ? undefined
                                                        : { y: -1, scale: 1.01 }
                                                }
                                                whileTap={
                                                    loading
                                                        ? undefined
                                                        : { scale: 0.99 }
                                                }
                                                disabled={loading}
                                                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-extrabold text-slate-900 shadow transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                                            >
                                                {loading ? "Creando cuenta..." : "Crear cuenta"}
                                                {!loading && <ArrowRight size={18} />}
                                            </motion.button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}