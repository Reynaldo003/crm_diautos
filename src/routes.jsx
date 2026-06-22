// src/routes.jsx
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedLayout from "./auth/ProtectedLayout";
import AppShell from "./app/AppShell";

// Estos dos cargan siempre rápido — no necesitan lazy
import LoginRegistro from "./pages/LoginRegistro/LoginRegistro";
import NotFound from "./pages/NotFound";


const Home = lazy(() => import("./pages/Home"));
const Citas = lazy(() => import("./pages/Citas/Citas"));
const RetencionFranjas = lazy(() => import("./pages/RetencionFranjas/RetencionFranjas"));
const RegistroAvaluos = lazy(() => import("./pages/Avaluos/RegistroAvaluos"));
const RegistroEncuestasServicio = lazy(() => import("./pages/Encuestas/EncuestasServicio"));
const Cartera = lazy(() => import("./pages/Cartera/Cartera"));
const PlaceholderPage = lazy(() => import("./pages/PlaceHolderPage"));


function PageLoader() {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            flexDirection: "column",
            gap: "12px",
        }}>
            <div style={{
                width: 36,
                height: 36,
                border: "3px solid #e5e7eb",
                borderTopColor: "#f59e0b",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export const router = createBrowserRouter([
    {
        path: "/crm_chevrolet/login",
        element: <LoginRegistro />,
    },
    {
        path: "/",
        element: <Navigate to="/crm_chevrolet/" replace />,
    },
    {
        element: <ProtectedLayout />,
        children: [
            {
                path: "/crm_chevrolet/",
                element: <AppShell />,
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <Home />
                            </Suspense>
                        ),
                    },
                    {
                        path: "citas",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <Citas />
                            </Suspense>
                        ),
                    },
                    {
                        path: "encuestas",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <RegistroEncuestasServicio />
                            </Suspense>
                        ),
                    },
                    {
                        path: "prospectos",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <RegistroAvaluos />
                            </Suspense>
                        ),
                    },
                    {
                        path: "cartera",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <Cartera />
                            </Suspense>
                        ),
                    },
                    {
                        path: "retencion",
                        element: (
                            <Suspense fallback={<PageLoader />}>
                                <RetencionFranjas />
                            </Suspense>
                        ),
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);