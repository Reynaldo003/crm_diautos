import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const TITULOS = {
    "/crm": "Inicio",
    "/prospectos": "Prospectos",
    "/clientes": "Clientes",
    "/operacion": "Operación",
    "/reportes": "Reportes",
};

function obtenerTitulo(pathname) {
    if (!pathname) return "CRM Chevrolet";

    const rutaExacta = TITULOS[pathname];
    if (rutaExacta) return rutaExacta;

    const coincidencia = Object.entries(TITULOS).find(([ruta]) =>
        pathname === ruta || pathname.startsWith(`${ruta}/`)
    );

    return coincidencia?.[1] || "CRM Chevrolet";
}

export default function Topbar() {
    const { user } = useAuth();
    const location = useLocation();

    const titulo = useMemo(() => {
        return obtenerTitulo(location.pathname);
    }, [location.pathname]);

    const inicial = useMemo(() => {
        return user?.nombreCompleto?.trim()?.slice(0, 1)?.toUpperCase() || "U";
    }, [user?.nombreCompleto]);

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
            <div className="flex flex-col gap-3 px-3 py-3 sm:px-4 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
                <div className="min-w-0">
                    <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl lg:text-[30px]">
                        {titulo}
                    </h1>
                </div>

                <div className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-4 md:w-auto md:max-w-[360px]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white sm:h-11 sm:w-11">
                        {inicial}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-900">
                            {user?.nombreCompleto || "Usuario"}
                        </div>
                        <div className="truncate text-xs text-slate-500 sm:text-sm">
                            {user?.correo || "Sin correo"}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}