import { useEffect, useMemo, useState } from "react";
import {
    construirFiltrosRetencion,
    obtenerDashboardRetencion,
    obtenerDetalleRetencion,
    crearComentarioRetencion,
} from "../../lib/apiRetencionFranjas";
import {
    TAMANO_PAGINA,
    SEGMENTOS,
    SEGMENTOS_VISTA_GENERAL,
    FILTROS_INICIALES,
    ESTADO_INICIAL,
    normalizarDashboard,
    CabeceraRetencion,
    VistaResumenGeneral,
    VistaSegmento,
    BloqueFiltrosTabla,
    ModalDetalleComercial,
} from "./RetencionFranjasComponentes";

export default function RetencionFranjas() {
    const [dashboard, setDashboard] = useState(ESTADO_INICIAL);
    const [resumenGeneral, setResumenGeneral] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const [segmentoActivo, setSegmentoActivo] = useState("13-96");
    const [pagina, setPagina] = useState(1);
    const [tamanoPagina, setTamanoPagina] = useState(TAMANO_PAGINA);
    const [filtros, setFiltros] = useState(FILTROS_INICIALES);

    const [modalAbierto, setModalAbierto] = useState(false);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);
    const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
    const [guardandoComentario, setGuardandoComentario] = useState(false);

    const segmentoSeleccionado = useMemo(
        () => SEGMENTOS.find((segmento) => segmento.id === segmentoActivo) || SEGMENTOS[3],
        [segmentoActivo]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            cargarDatos();
        }, 350);

        return () => clearTimeout(timeout);
    }, [segmentoActivo, pagina, tamanoPagina, filtros]);

    async function cargarDatos() {
        setCargando(true);
        setError("");

        try {
            const filtrosBase = {
                nombre: filtros.nombre,
                vin: filtros.vin,
                celular: filtros.celular,
                email: filtros.email,
                prioridadProspeccion: filtros.prioridadProspeccion,
                operadorDiasIngreso: filtros.operadorDiasIngreso,
                valorDiasIngreso: filtros.valorDiasIngreso,
                operadorMesesVenta: filtros.operadorMesesVenta,
                valorMesesVenta: filtros.valorMesesVenta,
                ordering: "-dias_os_a_actual",
                page: pagina,
                page_size: tamanoPagina,
            };

            if (segmentoSeleccionado.id === "general") {
                const promesaGeneral = obtenerDashboardRetencion(
                    construirFiltrosRetencion({
                        ...filtrosBase,
                        mesesDesde: 0,
                        mesesHasta: 96,
                    })
                );

                const promesasResumen = SEGMENTOS_VISTA_GENERAL.map((segmento) =>
                    obtenerDashboardRetencion(
                        construirFiltrosRetencion({
                            ...filtrosBase,
                            page: 1,
                            page_size: 1,
                            mesesDesde: segmento.mesesDesde,
                            mesesHasta: segmento.mesesHasta,
                        })
                    )
                );

                const [respuestaGeneral, respuestasSegmentadas] = await Promise.all([
                    promesaGeneral,
                    Promise.all(promesasResumen),
                ]);

                setDashboard(normalizarDashboard(respuestaGeneral));
                setResumenGeneral(
                    SEGMENTOS_VISTA_GENERAL.map((segmento, index) => ({
                        ...segmento,
                        ...normalizarDashboard(respuestasSegmentadas[index]),
                    }))
                );
                return;
            }

            const respuesta = await obtenerDashboardRetencion(
                construirFiltrosRetencion({
                    ...filtrosBase,
                    mesesDesde: segmentoSeleccionado.mesesDesde,
                    mesesHasta: segmentoSeleccionado.mesesHasta,
                })
            );

            setDashboard(normalizarDashboard(respuesta));
            setResumenGeneral([]);
        } catch (err) {
            console.error(err);
            setError(err?.message || "No se pudo cargar la información de retención.");
            setDashboard(ESTADO_INICIAL);
            setResumenGeneral([]);
        } finally {
            setCargando(false);
        }
    }

    async function abrirDetalle(cliente) {
        if (!cliente?.id) return;

        setModalAbierto(true);
        setCargandoDetalle(true);
        setDetalleSeleccionado(null);
        setError("");

        try {
            const detalle = await obtenerDetalleRetencion(cliente.id);
            setDetalleSeleccionado(detalle);
        } catch (err) {
            console.error(err);
            setDetalleSeleccionado(null);
            setError(err?.message || "No se pudo cargar el detalle comercial del VIN.");
        } finally {
            setCargandoDetalle(false);
        }
    }

    function cerrarDetalle() {
        setModalAbierto(false);
        setDetalleSeleccionado(null);
        setCargandoDetalle(false);
        setGuardandoComentario(false);
    }

    async function guardarComentarioSeguimiento(comentario) {
        const texto = String(comentario || "").trim();
        const idRegistro = detalleSeleccionado?.registro?.id;

        if (!idRegistro || !texto || guardandoComentario) return;

        setGuardandoComentario(true);
        setError("");

        try {
            const nuevoComentario = await crearComentarioRetencion(idRegistro, texto);

            setDetalleSeleccionado((detalleActual) => {
                if (!detalleActual) return detalleActual;

                const comentariosActuales = Array.isArray(detalleActual.comentarios_venta)
                    ? detalleActual.comentarios_venta
                    : [];

                return {
                    ...detalleActual,
                    comentarios_venta: [nuevoComentario, ...comentariosActuales],
                };
            });
        } catch (err) {
            console.error(err);
            setError(err?.message || "No se pudo guardar el comentario del seguimiento.");
            throw err;
        } finally {
            setGuardandoComentario(false);
        }
    }

    function actualizarFiltro(campo, valor) {
        setFiltros((previo) => {
            const siguiente = {
                ...previo,
                [campo]: valor,
            };

            if (campo === "operadorDiasIngreso" && !valor) {
                siguiente.valorDiasIngreso = "";
            }

            if (campo === "operadorMesesVenta" && !valor) {
                siguiente.valorMesesVenta = "";
            }

            return siguiente;
        });

        setPagina(1);
    }

    function limpiarFiltro(campo) {
        setFiltros((previo) => {
            const siguiente = {
                ...previo,
                [campo]: "",
            };

            if (campo === "operadorDiasIngreso") {
                siguiente.valorDiasIngreso = "";
            }

            if (campo === "operadorMesesVenta") {
                siguiente.valorMesesVenta = "";
            }

            return siguiente;
        });

        setPagina(1);
    }

    function limpiarTodo() {
        setFiltros(FILTROS_INICIALES);
        setPagina(1);
    }

    function cambiarSegmento(idSegmento) {
        setSegmentoActivo(idSegmento);
        setPagina(1);
    }

    function cambiarTamanoPagina(valor) {
        const numero = Number(valor);
        const permitido = [500, 800, 1000].includes(numero) ? numero : TAMANO_PAGINA;

        setTamanoPagina(permitido);
        setPagina(1);
    }

    function paginaAnterior() {
        setPagina((previa) => Math.max(1, previa - 1));
    }

    function paginaSiguiente() {
        setPagina((previa) => Math.min(dashboard.totalPaginas || 1, previa + 1));
    }

    const datosVistaGeneral =
        resumenGeneral.length > 0
            ? resumenGeneral
            : SEGMENTOS_VISTA_GENERAL.map((segmento) => ({
                ...segmento,
                ...ESTADO_INICIAL,
            }));

    return (
        <div className="mx-auto w-full max-w-[1650px] space-y-4 xl:space-y-5">
            {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            ) : null}

            <CabeceraRetencion
                segmentoActivo={segmentoActivo}
                onCambiarSegmento={cambiarSegmento}
            />

            {segmentoActivo === "general" ? (
                <VistaResumenGeneral datos={datosVistaGeneral} cargando={cargando} />
            ) : (
                <VistaSegmento cargando={cargando} dashboard={dashboard} />
            )}

            <BloqueFiltrosTabla
                segmentoActivo={segmentoActivo}
                segmentoSeleccionado={segmentoSeleccionado}
                totalClientes={dashboard.totalClientes}
                paginaActual={dashboard.paginaActual}
                totalPaginas={dashboard.totalPaginas}
                tamanoPagina={tamanoPagina}
                cargando={cargando}
                clientes={dashboard.clientes}
                filtros={filtros}
                onCambiarSegmento={cambiarSegmento}
                onActualizarFiltro={actualizarFiltro}
                onLimpiarFiltro={limpiarFiltro}
                onLimpiarTodo={limpiarTodo}
                onPaginaAnterior={paginaAnterior}
                onPaginaSiguiente={paginaSiguiente}
                onCambiarTamanoPagina={cambiarTamanoPagina}
                onAbrirDetalle={abrirDetalle}
            />

            <ModalDetalleComercial
                open={modalAbierto}
                onClose={cerrarDetalle}
                cargando={cargandoDetalle}
                detalle={detalleSeleccionado}
                guardandoComentario={guardandoComentario}
                onGuardarComentario={guardarComentarioSeguimiento}
            />
        </div>
    );
}