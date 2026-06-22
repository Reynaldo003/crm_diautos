// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
    authApi,
    clearAuthSession,
    getAuthToken,
    getStoredUser,
    setAuthSession,
} from "../lib/apiAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => getStoredUser());
    const [token, setToken] = useState(() => getAuthToken());
    const [loadingSesion, setLoadingSesion] = useState(true);

    useEffect(() => {
        let activo = true;

        async function validarSesion() {
            const tokenGuardado = getAuthToken();

            if (!tokenGuardado) {
                clearAuthSession();

                if (activo) {
                    setUsuario(null);
                    setToken(null);
                    setLoadingSesion(false);
                }

                return;
            }

            try {
                const data = await authApi.me();

                if (!activo) return;

                setUsuario(data.usuario);
                setToken(tokenGuardado);

                setAuthSession({
                    token: tokenGuardado,
                    usuario: data.usuario,
                });
            } catch {
                clearAuthSession();

                if (!activo) return;

                setUsuario(null);
                setToken(null);
            } finally {
                if (activo) {
                    setLoadingSesion(false);
                }
            }
        }

        validarSesion();

        return () => {
            activo = false;
        };
    }, []);

    async function login(payload) {
        const data = await authApi.login(payload);

        setAuthSession({
            token: data.token,
            usuario: data.usuario,
        });

        setToken(data.token);
        setUsuario(data.usuario);

        return data;
    }

    async function register(payload) {
        return authApi.registro(payload);
    }

    function logout() {
        clearAuthSession();
        setToken(null);
        setUsuario(null);
    }

    const value = useMemo(
        () => ({
            usuario,
            token,
            loadingSesion,
            isAuthenticated: Boolean(token && usuario),
            login,
            register,
            logout,
        }),
        [usuario, token, loadingSesion]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider.");
    }

    return context;
}