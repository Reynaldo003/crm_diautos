// src/pages/Cartera/Cartera.jsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart3, CalendarDays, CarFront, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, FileText, History, Loader2, Mail,
  Phone, RefreshCcw, Search, Sparkles, UserRound, X,
} from "lucide-react";

import { useAuth } from "../../auth/AuthContext";
import { obtenerDetalleRetencion } from "../../lib/apiRetencionFranjas";
import {
  actualizarEstadoGestion, asignarAutomaticamente, obtenerAsesoresBDC,
  obtenerResumenCartera, obtenerTodaLaCartera, obtenerVentasDisponibles,
  previsualizarAsignacion,
} from "../../lib/apiCartera";
import { crearCita } from "../../lib/apiCitasCartera";


const ESTADOS_GESTION = [
  { value: "Nadie contesta", label: "Nadie contesta" },
  { value: "Número incorrecto, contactable por otro medio", label: "Número incorrecto, contactable por otro medio" },
  { value: "Número incorrecto, incontactable por otro medio", label: "Número incorrecto, incontactable por otro medio" },
  { value: "Cliente falleció", label: "Cliente falleció" },
  { value: "Cliente ya no cuenta con la unidad, pasó a un segundo dueño, incontactable", label: "Cliente ya no cuenta con la unidad, pasó a un segundo dueño, incontactable" },
  { value: "Cliente no desea ser contactado sólo mensajes informativos", label: "Cliente no desea ser contactado sólo mensajes informativos" },
  { value: "Cliente no desea ser contactado", label: "Cliente no desea ser contactado" },
  { value: "Cliente tuvo una mala experiencia previa con el distribuidor, no desea ser contactado", label: "Cliente tuvo una mala experiencia previa con el distribuidor, no desea ser contactado" },
  { value: "Unidad fue pérdida total o robo", label: "Unidad fue pérdida total o robo" },
  { value: "Llamada de cortesía (Presentación equipo Posventa 15 días después de la venta)", label: "Llamada de cortesía (Presentación equipo Posventa 15 días después de la venta)" },
  { value: "Contacto informativo", label: "Contacto informativo" },
  { value: "Cliente ya realizó su servicio en otro Distribuidor GM", label: "Cliente ya realizó su servicio en otro Distribuidor GM" },
  { value: "Cliente ya realizó su servicio en otro taller que no es GM", label: "Cliente ya realizó su servicio en otro taller que no es GM" },
  { value: "Cliente tuvo una mala experiencia previa con el distribuidor, requiere acción por parte del distribuidor", label: "Cliente tuvo una mala experiencia previa con el distribuidor, requiere acción por parte del distribuidor" },
  { value: "Cliente rechaza invitación a servicio debido a que considera que no le corresponde porque aún no alcanza el tiempo o Kilometraje", label: "Cliente rechaza invitación a servicio: no corresponde por tiempo o KM" },
  { value: "Cliente rechaza invitación a servicio debido a precio", label: "Cliente rechaza invitación a servicio: precio" },
  { value: "Cliente rechaza invitación a servicio debido a falta de tiempo", label: "Cliente rechaza invitación a servicio: falta de tiempo" },
  { value: "Cliente rechaza invitación a servicio debido a otro motivo", label: "Cliente rechaza invitación a servicio: otro motivo" },
  { value: "Cliente rechaza invitación a servicio debido a que se encuentra fuera del PMA pero puede regresar", label: "Cliente rechaza: fuera del PMA, puede regresar" },
  { value: "Cliente rechaza invitación a servicio debido a que se encuentra fuera del PMA y no va a regresar", label: "Cliente rechaza: fuera del PMA, no regresa" },
  { value: "Cliente contactado e interesado, en seguimiento", label: "Cliente contactado e interesado, en seguimiento" },
  { value: "Cliente contactado e interesado, él regresará la llamada", label: "Cliente contactado e interesado, él regresará la llamada" },
  { value: "Otro", label: "Otro" },
  { value: "Cliente solicita agendar cita Proactiva", label: "Cliente solicita agendar cita Proactiva" },
  { value: "Cliente solicita agendar cita Reactiva", label: "Cliente solicita agendar cita Reactiva" },
  { value: "Confirmación de Datos de Cita", label: "Confirmación de Datos de Cita" },
  { value: "Recordatorio de Cita (Recordatorio)", label: "Recordatorio de Cita (Recordatorio)" },
  { value: "Cliente solicita/aprueba reagendar cita", label: "Cliente solicita/aprueba reagendar cita" },
  { value: "Cliente solicita cancelar cita", label: "Cliente solicita cancelar cita" },
  { value: "Cliente No Show, intento de reagendamiento sin contacto", label: "Cliente No Show, intento de reagendamiento sin contacto" },
  { value: "Cliente No Show, intento de reagendamiento – Cliente atendió pero no dio una fecha de re agendamiento", label: "Cliente No Show: atendió pero sin fecha" },
  { value: "Aviso unidad terminada", label: "Aviso unidad terminada" },
  { value: "Llamada del 3er día (Evaluación de experiencia del cliente)", label: "Llamada del 3er día (Evaluación de experiencia)" },
  { value: "Llamada para seguimiento de unidad en taller", label: "Llamada para seguimiento de unidad en taller" },
];


const MAPEO_ESTADO_A_DETALLE = {
  "Nadie contesta": "Cliente sin contacto",
  "Número incorrecto, contactable por otro medio": "Cliente sin contacto",
  "Número incorrecto, incontactable por otro medio": "Cliente Incontactable",
  "Cliente falleció": "Cliente Incontactable",
  "Cliente ya no cuenta con la unidad, pasó a un segundo dueño, incontactable": "Cliente Incontactable",
  "Cliente no desea ser contactado sólo mensajes informativos": "Cliente no desea ser contactado para Mensaje informativo pero si Prospección",
  "Cliente no desea ser contactado": "Cliente Incontactable",
  "Cliente tuvo una mala experiencia previa con el distribuidor, no desea ser contactado": "Cliente Incontactable",
  "Unidad fue pérdida total o robo": "Cliente Incontactable",
  "Llamada de cortesía (Presentación equipo Posventa 15 días después de la venta)": "Cliente Contactado, Informativo",
  "Contacto informativo": "Cliente Contactado, Informativo",
  "Cliente ya realizó su servicio en otro Distribuidor GM": "Cliente Contactado, Servicio Rechazado",
  "Cliente ya realizó su servicio en otro taller que no es GM": "Cliente Contactado, Servicio Rechazado",
  "Cliente tuvo una mala experiencia previa con el distribuidor, requiere acción por parte del distribuidor": "Cliente Contactado, en seguimiento",
  "Cliente rechaza invitación a servicio debido a que considera que no le corresponde porque aún no alcanza el tiempo o Kilometraje": "Cliente Contactado, Servicio Rechazado",
  "Cliente rechaza invitación a servicio debido a precio": "Cliente Contactado, Servicio Rechazado",
  "Cliente rechaza invitación a servicio debido a falta de tiempo": "Cliente Contactado, Servicio Rechazado",
  "Cliente rechaza invitación a servicio debido a otro motivo": "Cliente Contactado, Servicio Rechazado",
  "Cliente rechaza invitación a servicio debido a que se encuentra fuera del PMA pero puede regresar": "Cliente Contactado, Servicio Rechazado",
  "Cliente rechaza invitación a servicio debido a que se encuentra fuera del PMA y no va a regresar": "Cliente Incontactable",
  "Cliente contactado e interesado, en seguimiento": "Cliente Contactado, en seguimiento",
  "Cliente contactado e interesado, él regresará la llamada": "Cliente Contactado, en seguimiento",
  "Otro": "Cliente Contactado, en seguimiento",
  "Cliente solicita agendar cita Proactiva": "Cliente Contactado con Cita Agendada",
  "Cliente solicita agendar cita Reactiva": "Cliente Contactado con Cita Agendada",
  "Confirmación de Datos de Cita": "Cliente Contactado con Cita Agendada",
  "Recordatorio de Cita (Recordatorio)": "Cliente Contactado con Cita Agendada",
  "Cliente solicita/aprueba reagendar cita": "Cliente Contactado con Cita Agendada",
  "Cliente solicita cancelar cita": "Cliente Contactado, Cita Cancelada",
  "Cliente No Show, intento de reagendamiento sin contacto": "Cliente No Show",
  "Cliente No Show, intento de reagendamiento – Cliente atendió pero no dio una fecha de re agendamiento": "Cliente No Show",
  "Aviso unidad terminada": "Cliente Contactado, Cita Efectiva",
  "Llamada del 3er día (Evaluación de experiencia del cliente)": "Cliente Contactado, Informativo",
  "Llamada para seguimiento de unidad en taller": "Cliente Contactado, Informativo",
};


const CONFIG_DETALLE_POR_ESTADO = {
  "Cliente sin contacto":                          { tipo: "text",           placeholder: "Ej: Intentar en horario vespertino" },
  "Cliente Incontactable":                         { tipo: "textarea",       placeholder: "Ej: Múltiples llamadas sin éxito, intentar WhatsApp" },
  "Cliente no desea ser contactado para Mensaje informativo pero si Prospección":
                                                   { tipo: "textarea",       placeholder: "Ej: Solo mensajes de prospección 1 vez por semana" },
  "Cliente Contactado, Informativo":               { tipo: "text",           placeholder: "Ej: Información de mantenimiento enviada" },
  "Cliente Contactado, Servicio Rechazado":        { tipo: "textarea",       placeholder: "Motivo del rechazo del servicio" },
  "Cliente Contactado, en seguimiento":            { tipo: "text",           placeholder: "Ej: Próximo contacto el 15/12/2024" },
  "Cliente Contactado con Cita Agendada":          { tipo: "datetime-local", placeholder: "Fecha y hora de la cita" },
  "Cliente Contactado, Cita Cancelada":            { tipo: "textarea",       placeholder: "Motivo de cancelación" },
  "Cliente No Show":                               { tipo: "text",           placeholder: "¿Reagendar? Fecha propuesta" },
  "Cliente Contactado, Cita Efectiva":             { tipo: "textarea",       placeholder: "Notas del servicio y satisfacción del cliente" },
};

function getConfigDetalle(estatus) {
  return CONFIG_DETALLE_POR_ESTADO[estatus] || { tipo: "text", placeholder: "Detalle adicional (opcional)" };
}


const PAGE_SIZE = 50;

const ASESORES = [
  "ALBERTO TORRES","ALMA HERNANDEZ","ANGELES VALERIO","CARLOS VAZQUEZ",
  "DAVID RIOS","GABRIELA POMPEYO","GUADALUPE SANCHEZ","ISRAEL NIETO",
  "IVETTE MATA","JAIR SOLARES","JAVIER VALENCIA","JOSUE SEGOVIA",
  "KARINA CORTES","LORENZA RINCON","LUIS DAVID CASTILLO","MAGDALENA MOLINA",
  "PEDRO MENDOZA","RAQUEL SOLIS","REYNA MORA","ROMAN LUGO","SILVIA LARA",
  "CASA","GRISELDA NEVAREZ","EDER MONTERO","GASPAR PANTOJA",
];

const VEHICULOS = [
  "AVEO SEDAN","AVEO HB","ONIX","GROOVE","TRACKER","TRAX","CAPTIVA",
  "TRAVERSE","SUBURBAN","TAHOE","BLAZER","S10 MAX","MONTANA","SILVERADO",
  "CHEYENNE","COLORADO","TORNADO VAN","EXPRESS MAX","CORVETTE STINGRAY",
  "CORVETTE Z06","CORVETTE ZR1","CORVETTE ZR1X","SPARK EUV","CAPTIVA PHEV",
  "EQUINOX EV","BLAZER EV","EXPRESS MAX EV","BRIGHTDROP",
];

const TIPOS_CITA = ["Digital","Tradicional","Evento","Marketing"];

const ROLES_CARTERA = {
  ADMINISTRADOR: 1,
  ASESOR_BDC_POSTVENTA: 4,
  SUPERVISOR_BDC_POSTVENTA: 5,
};

const CITA_FORM_INICIAL = {
  nombre:"",telefono:"",correo:"",agencia:"Chevrolet Diaz Miron",
  auto_interes:"",fecha:"",hora:"",tipo_cita:"Cartera BDC",
  fuente_prospeccion:"Cartera BDC Posventa",asesor_digital:"",
  asesor_piso:"",comentarios:"",
};


function normalizarTexto(v) {
  return String(v||"").trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}
function obtenerRolId(u={}) {
  const v=u?.id_rol??u?.rol_id??u?.rol?.id_rol??u?.rol?.id??u?.rol?.pk??"";
  const n=Number(v); return Number.isFinite(n)?n:null;
}
function obtenerNombreRol(u={}) {
  return[u?.rol_nombre,u?.nombre_rol,u?.rol?.nombre,typeof u?.rol==="string"?u.rol:""].find(Boolean)||"";
}
function obtenerIdUsuario(u={}) {
  return u?.id_usuario??u?.usuario_id??u?.user_id??u?.id??u?.pk??"";
}
function obtenerPermisosCartera(u={}) {
  const rolId=obtenerRolId(u);
  const rolNombre=normalizarTexto(obtenerNombreRol(u));
  const asesorId=obtenerIdUsuario(u);
  const esAdministrador=rolId===ROLES_CARTERA.ADMINISTRADOR||rolNombre.includes("ADMINISTRADOR");
  const esSupervisorBDC=rolId===ROLES_CARTERA.SUPERVISOR_BDC_POSTVENTA||rolNombre.includes("SUPERVISOR BDC POSVENTA");
  const esAsesorBDC=rolId===ROLES_CARTERA.ASESOR_BDC_POSTVENTA||rolNombre.includes("ASESOR BDC POSVENTA");
  return {
    rolId,rolNombre,asesorId:asesorId?String(asesorId):"",
    esAdministrador,esSupervisorBDC,esAsesorBDC,
    puedeVerTodaCartera:esAdministrador||esSupervisorBDC,
    puedeAdministrarAsignacion:esAdministrador||esSupervisorBDC,
  };
}
function obtenerRangoMesAnterior() {
  const hoy=new Date();
  const p=new Date(hoy.getFullYear(),hoy.getMonth(),1);
  const u=new Date(p.getTime()-86400000);
  const pa=new Date(u.getFullYear(),u.getMonth(),1);
  return{desde:fmtFecha(pa),hasta:fmtFecha(u)};
}
function fmtFecha(d) {
  return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}


export default function Cartera() {
  const{usuario}=useAuth();
  const rangoInicial=useMemo(()=>obtenerRangoMesAnterior(),[]);
  const permisos=useMemo(()=>obtenerPermisosCartera(usuario||{}),[usuario]);

  const[asesores,setAsesores]=useState([]);
  const[asesoresSeleccionados,setAsesoresSeleccionados]=useState([]);
  const[filtros,setFiltros]=useState({q:"",asesor_id:"",estado_gestion:"",fecha_venta_desde:"",fecha_venta_hasta:""});
  const[paginaActual,setPaginaActual]=useState(1);
  const[totalRegistros,setTotalRegistros]=useState(0);
  const totalPaginas=Math.max(1,Math.ceil(totalRegistros/PAGE_SIZE));
  const[filtrosAsignacion,setFiltrosAsignacion]=useState({fecha_venta_desde:rangoInicial.desde,fecha_venta_hasta:rangoInicial.hasta});
  const[cartera,setCartera]=useState([]);
  const[resumen,setResumen]=useState({total:0,pendientes:0,contactados:0,citas:0});
  const[ventasDisponibles,setVentasDisponibles]=useState([]);
  const[resumenDisponibles,setResumenDisponibles]=useState(null);
  const[preview,setPreview]=useState(null);
  const[cargandoCartera,setCargandoCartera]=useState(true);
  const[cargandoDisponibles,setCargandoDisponibles]=useState(false);
  const[cargandoAccion,setCargandoAccion]=useState(false);
  const[error,setError]=useState("");
  const[mensaje,setMensaje]=useState("");
  const[modalAbierto,setModalAbierto]=useState(false);
  const[cargandoDetalle,setCargandoDetalle]=useState(false);
  const[detalleSeleccionado,setDetalleSeleccionado]=useState(null);
  const[clienteCarteraSeleccionado,setClienteCarteraSeleccionado]=useState(null);
  const[modalCitaAbierto,setModalCitaAbierto]=useState(false);
  const[citaOrigen,setCitaOrigen]=useState(null);
  const[formCita,setFormCita]=useState(CITA_FORM_INICIAL);
  const[guardandoCita,setGuardandoCita]=useState(false);

  useEffect(()=>{if(!usuario)return;cargarAsesores();},[usuario?.id_usuario]);

  useEffect(()=>{
    if(!permisos.esAsesorBDC||!permisos.asesorId)return;
    setFiltros(p=>String(p.asesor_id)===permisos.asesorId?p:{...p,asesor_id:permisos.asesorId});
  },[permisos.esAsesorBDC,permisos.asesorId]);

  const debounceRef=useRef(null);
  useEffect(()=>{
    clearTimeout(debounceRef.current);
    debounceRef.current=setTimeout(()=>cargarCartera(paginaActual),300);
    return()=>clearTimeout(debounceRef.current);
  },[filtros.q,filtros.asesor_id,filtros.estado_gestion,filtros.fecha_venta_desde,filtros.fecha_venta_hasta,paginaActual]);

  useEffect(()=>{
    if(!permisos.puedeAdministrarAsignacion)return;
    const t=setTimeout(()=>cargarVentasSinAsignar(),300);
    return()=>clearTimeout(t);
  },[filtrosAsignacion.fecha_venta_desde,filtrosAsignacion.fecha_venta_hasta,permisos.puedeAdministrarAsignacion]);

  async function cargarAsesores(){
    try{
      const data=await obtenerAsesoresBDC({agencia:usuario?.agencia||""});
      const lista=Array.isArray(data)?data:[];
      setAsesores(lista);
      if(permisos.esAsesorBDC&&permisos.asesorId){setAsesoresSeleccionados([Number(permisos.asesorId)]);}
      else{setAsesoresSeleccionados(lista.map(a=>a.id_usuario));}
    }catch(err){setError(err?.message||"No se pudieron cargar los asesores BDC.");}
  }

  async function cargarCartera(pagina=1){
    setCargandoCartera(true);setError("");
    try{
      const params={...filtros,page:pagina,page_size:PAGE_SIZE,...(permisos.esAsesorBDC&&permisos.asesorId?{asesor_id:permisos.asesorId}:{})};
      const[lista,resumenData]=await Promise.all([obtenerTodaLaCartera(params),obtenerResumenCartera(params)]);
      setCartera(Array.isArray(lista?.results)?lista.results:[]);
      setTotalRegistros(Number(lista?.count||0));
      setResumen(resumenData||{});
    }catch(err){
      setError(err?.message||"No se pudo cargar la cartera.");
      setCartera([]);setTotalRegistros(0);
    }finally{setCargandoCartera(false);}
  }

  async function cargarVentasSinAsignar(){
    setCargandoDisponibles(true);
    try{
      const data=await obtenerVentasDisponibles({fecha_venta_desde:filtrosAsignacion.fecha_venta_desde,fecha_venta_hasta:filtrosAsignacion.fecha_venta_hasta});
      setVentasDisponibles(Array.isArray(data?.results)?data.results:[]);
      setResumenDisponibles(data||null);
    }catch{setVentasDisponibles([]);setResumenDisponibles(null);}
    finally{setCargandoDisponibles(false);}
  }

  function cambiarFiltro(campo,valor){
    if(permisos.esAsesorBDC&&campo==="asesor_id")return;
    setPaginaActual(1);
    setFiltros(p=>({...p,[campo]:valor}));
  }

  function limpiarFiltros(){
    setPaginaActual(1);
    setFiltros({q:"",asesor_id:permisos.esAsesorBDC?permisos.asesorId:"",estado_gestion:"",fecha_venta_desde:"",fecha_venta_hasta:""});
    setMensaje("");setError("");
  }

  function toggleAsesor(id){
    if(!permisos.puedeAdministrarAsignacion)return;
    setAsesoresSeleccionados(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  }

  async function simularAsignacion(){
    if(asesoresSeleccionados.length===0){setError("Selecciona al menos un asesor.");return;}
    setCargandoAccion(true);setError("");setMensaje("");
    try{
      const data=await previsualizarAsignacion({asesores_ids:asesoresSeleccionados,...filtrosAsignacion});
      setPreview(data);
      setMensaje(`Simulación: ${formatearNumero(data.total_asignables||0)} VIN(s) asignables.`);
    }catch(err){setError(err?.message||"No se pudo simular.");}
    finally{setCargandoAccion(false);}
  }

  async function ejecutarAsignacion(){
    if(asesoresSeleccionados.length===0){setError("Selecciona al menos un asesor.");return;}
    if(!window.confirm("¿Confirmas la asignación de VINs?"))return;
    setCargandoAccion(true);setError("");setMensaje("");
    try{
      const data=await asignarAutomaticamente({asesores_ids:asesoresSeleccionados,...filtrosAsignacion});
      setPreview(data);
      setMensaje(`Asignados: ${formatearNumero(data.total_creados||0)} VIN(s).`);
      await Promise.all([cargarCartera(1),cargarVentasSinAsignar()]);
    }catch(err){setError(err?.message||"No se pudo asignar.");}
    finally{setCargandoAccion(false);}
  }


  async function cambiarEstadoGestion(cliente, nuevoEstado, detalleGestion=""){
    try{
      const actualizado=await actualizarEstadoGestion(cliente.id, nuevoEstado, detalleGestion);
      setCartera(p=>p.map(item=>item.id===cliente.id?{...item,...actualizado}:item));
      setMensaje("Gestión guardada correctamente.");
    }catch(err){
      setError(err?.message||"No se pudo guardar la gestión.");
    }
  }

  async function abrirDetalle(cliente){
    if(!cliente?.venta_id)return;
    setClienteCarteraSeleccionado(cliente);
    setModalAbierto(true);setCargandoDetalle(true);setDetalleSeleccionado(null);
    try{const detalle=await obtenerDetalleRetencion(cliente.venta_id);setDetalleSeleccionado(detalle);}
    catch(err){setError(err?.message||"No se pudo cargar el historial.");}
    finally{setCargandoDetalle(false);}
  }

  function cerrarDetalle(){setModalAbierto(false);setDetalleSeleccionado(null);}

  function abrirCitaDesdeCartera(registro){
    const nombre=registro?.nombre_cliente||registro?.nombre_cte||"";
    const telefono=String(registro?.celular||registro?.telefono||"").replace(/\D/g,"");
    const vin=registro?.vin||registro?.numero_serie||"";
    setCitaOrigen(registro);
    setFormCita({
      ...CITA_FORM_INICIAL,nombre,telefono,correo:registro?.email||"",
      agencia:registro?.agencia||usuario?.agencia||"Chevrolet Diaz Miron",
      auto_interes:registro?.version||registro?.modelo||"",
      fecha:fmtFecha(new Date()),
      asesor_digital:registro?.asesor_nombre||[usuario?.nombre,usuario?.apellidos].filter(Boolean).join(" ")||"",
      comentarios:["Cita generada desde Cartera BDC Posventa.",vin?`VIN: ${vin}`:"",registro?.venta_id?`Venta ID: ${registro.venta_id}`:""].filter(Boolean).join("\n"),
    });
    setModalCitaAbierto(true);
  }

  function cerrarModalCita(){setModalCitaAbierto(false);setCitaOrigen(null);setFormCita(CITA_FORM_INICIAL);setGuardandoCita(false);}

  async function guardarCitaRapida(event){
    event.preventDefault();
    const telefono=String(formCita.telefono||"").replace(/\D/g,"");
    if(!telefono){setError("El teléfono es obligatorio.");return;}
    if(!formCita.fecha||!formCita.hora){setError("Fecha y hora son obligatorias.");return;}
    setGuardandoCita(true);setError("");setMensaje("");
    try{
      await crearCita({
        nombre:formCita.nombre.trim(),telefono,correo:formCita.correo.trim(),
        agencia:formCita.agencia.trim(),auto_interes:formCita.auto_interes.trim(),
        fecha_hora_cita:`${formCita.fecha}T${formCita.hora}:00`,asistencia:false,
        tipo_cita:formCita.tipo_cita.trim(),fuente_prospeccion:formCita.fuente_prospeccion.trim(),
        asesor_digital:formCita.asesor_digital.trim(),asesor_piso:formCita.asesor_piso.trim(),
        comentarios:formCita.comentarios.trim(),
      });
      if(citaOrigen?.id){
        await cambiarEstadoGestion(
          citaOrigen,
          "Cliente solicita agendar cita Proactiva",
          `Cliente Contactado con Cita Agendada — ${formCita.fecha} ${formCita.hora}`
        );
      }
      setMensaje("Cita registrada correctamente.");
      cerrarModalCita();cerrarDetalle();
    }catch(err){setError(err?.message||"No se pudo registrar la cita.");}
    finally{setGuardandoCita(false);}
  }

  return(
    <div className="space-y-6">
      {error&&<Alerta tipo="error" mensaje={error} onClose={()=>setError("")}/>}
      {mensaje&&<Alerta tipo="ok" mensaje={mensaje} onClose={()=>setMensaje("")}/>}

      {/* Encabezado */}
      <section className="overflow-hidden rounded-lg border border-black/10 bg-[radial-gradient(circle_at_top_left,rgba(201,167,93,0.18),transparent_28%),linear-gradient(135deg,#050505_0%,#0F172A_55%,#050505_100%)] p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] lg:p-6">
        <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-end 2xl:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
              <CarFront className="h-4 w-4 text-[#C9A75D]"/>Cartera BDC Posventa
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Administración general de cartera</h1>
            {permisos.esAsesorBDC&&<p className="mt-3 text-sm font-semibold text-white/65">Vista restringida: solo se muestran los VINs asignados a tu usuario.</p>}
          </div>
          <button type="button" onClick={()=>cargarCartera(paginaActual)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/15">
            <RefreshCcw className="h-4 w-4"/>Actualizar
          </button>
        </div>
      </section>

      {permisos.puedeAdministrarAsignacion&&(
        <SeccionAsignacion
          asesores={asesores} asesoresSeleccionados={asesoresSeleccionados}
          filtrosAsignacion={filtrosAsignacion} ventasDisponibles={ventasDisponibles}
          resumenDisponibles={resumenDisponibles} preview={preview}
          cargandoDisponibles={cargandoDisponibles} cargandoAccion={cargandoAccion}
          onToggleAsesor={toggleAsesor}
          onCambiarFiltro={(campo,valor)=>setFiltrosAsignacion(p=>({...p,[campo]:valor}))}
          onSimular={simularAsignacion} onAsignar={ejecutarAsignacion}
        />
      )}

      <TablaCartera
        cartera={cartera}
        asesores={permisos.esAsesorBDC?asesores.filter(a=>String(a.id_usuario)===permisos.asesorId):asesores}
        filtros={filtros} resumen={resumen} totalRegistros={totalRegistros}
        paginaActual={paginaActual} totalPaginas={totalPaginas}
        cargando={cargandoCartera} esVistaAsesor={permisos.esAsesorBDC}
        onCambiarFiltro={cambiarFiltro} onLimpiarFiltros={limpiarFiltros}
        onCambiarPagina={setPaginaActual} onAbrirDetalle={abrirDetalle}
        onCambiarEstado={cambiarEstadoGestion}
      />

      <ModalDetalleComercial
        open={modalAbierto} onClose={cerrarDetalle} cargando={cargandoDetalle}
        detalle={detalleSeleccionado} clienteCartera={clienteCarteraSeleccionado}
        onAgendarCita={abrirCitaDesdeCartera}
      />

      <ModalCitaRapida
        open={modalCitaAbierto} form={formCita} guardando={guardandoCita}
        onClose={cerrarModalCita}
        onChange={(c,v)=>setFormCita(p=>({...p,[c]:v}))}
        onSubmit={guardarCitaRapida}
      />
    </div>
  );
}


function TablaCartera({
  cartera, asesores, filtros, resumen, totalRegistros,
  paginaActual, totalPaginas, cargando, esVistaAsesor,
  onCambiarFiltro, onLimpiarFiltros, onCambiarPagina,
  onAbrirDetalle, onCambiarEstado,
}){

  const[estadoLocal,setEstadoLocal]=useState({});
  const[detalleLocal,setDetalleLocal]=useState({});
  const[guardandoLocal,setGuardandoLocal]=useState({}); 

 
  useEffect(()=>{
    const nuevoEstado={};
    const nuevoDetalle={};
    cartera.forEach(c=>{
      
      if(estadoLocal[c.id]===undefined) nuevoEstado[c.id]=c.estado_gestion||"";
      if(detalleLocal[c.id]===undefined) nuevoDetalle[c.id]=c.detalle_gestion||"";
    });
    if(Object.keys(nuevoEstado).length){
      setEstadoLocal(p=>({...nuevoEstado,...p}));
    }
    if(Object.keys(nuevoDetalle).length){
      setDetalleLocal(p=>({...nuevoDetalle,...p}));
    }
 
  },[cartera]);

 
  const detalleDebounceRef=useRef({});


  async function handleTipificacionChange(cliente, nuevoEstado){
    const estatusAutomatico=MAPEO_ESTADO_A_DETALLE[nuevoEstado]||"";

   
    setEstadoLocal(p=>({...p,[cliente.id]:nuevoEstado}));
    setDetalleLocal(p=>({...p,[cliente.id]:estatusAutomatico}));

   
    clearTimeout(detalleDebounceRef.current[cliente.id]);

    
    setGuardandoLocal(p=>({...p,[cliente.id]:true}));
    try{
      await onCambiarEstado(cliente, nuevoEstado, estatusAutomatico);
    }finally{
      setGuardandoLocal(p=>({...p,[cliente.id]:false}));
    }
  }

  // Cuando el usuario edita el detalle manualmente: guardar con debounce (800ms)
  function handleDetalleChange(cliente, nuevoDetalle){
    setDetalleLocal(p=>({...p,[cliente.id]:nuevoDetalle}));
    clearTimeout(detalleDebounceRef.current[cliente.id]);
    detalleDebounceRef.current[cliente.id]=setTimeout(async()=>{
      const estadoActual=estadoLocal[cliente.id]||"";
      if(!estadoActual)return;
      setGuardandoLocal(p=>({...p,[cliente.id]:true}));
      try{
        await onCambiarEstado(cliente, estadoActual, nuevoDetalle);
      }finally{
        setGuardandoLocal(p=>({...p,[cliente.id]:false}));
      }
    },800);
  }

  return(
    <section className="rounded-lg border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="mt-3 text-xl font-black text-slate-900">Listado general de cartera asignada</h2>
          {esVistaAsesor&&<p className="mt-2 text-sm font-semibold text-slate-500">Tu rol de Asesor BDC Postventa solo permite consultar tus VINs asignados.</p>}
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Total registros</div>
          <div className="mt-1 text-2xl font-black text-slate-900">{formatearNumero(totalRegistros)}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-5">
        <FiltroTexto label="Buscar cliente, VIN, teléfono o modelo" value={filtros.q}
          onChange={e=>onCambiarFiltro("q",e.target.value)} onClear={()=>onCambiarFiltro("q","")}/>
        {esVistaAsesor?(
          <div className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Asesor asignado</span>
            <div className="flex h-11 items-center rounded-lg border border-[#C9A75D]/40 bg-[#FFFBF0] px-3 text-sm font-black text-slate-800">Mis VINs asignados</div>
          </div>
        ):(
          <CampoSelect label="Asesor asignado" value={filtros.asesor_id} onChange={e=>onCambiarFiltro("asesor_id",e.target.value)}>
            <option value="">Todos los asesores</option>
            {asesores.map(a=><option key={a.id_usuario} value={a.id_usuario}>{a.nombre_completo}</option>)}
          </CampoSelect>
        )}
        <CampoSelect label="Estado gestión" value={filtros.estado_gestion} onChange={e=>onCambiarFiltro("estado_gestion",e.target.value)}>
          <option value="">Todos los estados</option>
          {ESTADOS_GESTION.map(e=><option key={e.value} value={e.value}>{e.label}</option>)}
        </CampoSelect>
        <CampoFecha label="Fecha venta desde" value={filtros.fecha_venta_desde} onChange={e=>onCambiarFiltro("fecha_venta_desde",e.target.value)}/>
        <CampoFecha label="Fecha venta hasta" value={filtros.fecha_venta_hasta} onChange={e=>onCambiarFiltro("fecha_venta_hasta",e.target.value)}/>
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={onLimpiarFiltros}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-100">
          <X className="h-4 w-4"/>Limpiar filtros
        </button>
      </div>

      {/* Tabla */}
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-[1900px] w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="bg-[#0F172A] text-left text-white">
                {[
                  "Asignación","Asesor BDC",
                  "Tipificación de actividad","Estatus del perfil",
                  "Cliente","VIN","Año","Modelo","Versión",
                  "Meses venta","Días último ingreso",
                  "Estatus cliente","Celular","Teléfono","Correo",
                  "Fecha venta","Historial",
                ].map(h=>(
                  <th key={h} className="px-4 py-3 font-bold whitespace-nowrap first:rounded-tl-lg last:rounded-tr-lg">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargando?(
                <tr><td colSpan={17} className="border-t border-slate-200 px-4 py-12 text-center">
                  <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-slate-400"/>
                  <span className="text-sm font-semibold text-slate-500">Cargando cartera...</span>
                </td></tr>
              ):cartera.length===0?(
                <tr><td colSpan={17} className="border-t border-slate-200 px-4 py-12 text-center text-sm font-semibold text-slate-500">
                  No hay clientes con los filtros actuales.
                </td></tr>
              ):cartera.map((cliente,index)=>{
                const estadoActual=estadoLocal[cliente.id]??"";
                const detalleActual=detalleLocal[cliente.id]??"";
                const estaGuardando=guardandoLocal[cliente.id]||false;
                const estatusPerfil=MAPEO_ESTADO_A_DETALLE[estadoActual]||"";
                const configCampo=getConfigDetalle(estatusPerfil);

                return(
                  <tr key={cliente.id}
                    onDoubleClick={()=>onAbrirDetalle(cliente)}
                    className={`transition cursor-pointer ${index%2===0?"bg-white":"bg-slate-50/80"} hover:bg-[#FBF6EA]`}>

                    {/* Asignación */}
                    <td className="border-t border-slate-200 px-4 py-3 text-slate-700 whitespace-nowrap text-xs">
                      {formatearFechaHora(cliente.asignado_en)}
                    </td>

                    {/* Asesor BDC */}
                    <td className="border-t border-slate-200 px-4 py-3 font-bold text-slate-900 min-w-[200px]">
                      {cliente.asesor_nombre||"-"}
                    </td>

                    {/* Tipificación de actividad — autoguarda al cambiar */}
                    <td className="border-t border-slate-200 px-3 py-2 min-w-[280px]" onClick={e=>e.stopPropagation()}>
                      <div className="relative">
                        <select
                          value={estadoActual}
                          onChange={e=>handleTipificacionChange(cliente,e.target.value)}
                          className="w-full h-9 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-8 text-xs font-bold text-slate-700 outline-none transition focus:border-[#C9A75D] focus:ring-2 focus:ring-[#C9A75D]/10 disabled:opacity-60"
                          disabled={estaGuardando}
                        >
                          <option value="">Seleccionar actividad...</option>
                          {ESTADOS_GESTION.map(e=><option key={e.value} value={e.value}>{e.label}</option>)}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"/>
                      </div>
                      {/* Indicador de guardado */}
                      {estaGuardando&&(
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[#C9A75D]">
                          <Loader2 className="h-3 w-3 animate-spin"/>Guardando...
                        </div>
                      )}
                      {!estaGuardando&&estadoActual&&(
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <CheckCircle2 className="h-3 w-3"/>Guardado
                        </div>
                      )}
                    </td>

                    {/* Estatus del perfil — campo dinámico, autoguarda con debounce */}
                    <td className="border-t border-slate-200 px-3 py-2 min-w-[260px]" onClick={e=>e.stopPropagation()}>
                      {estadoActual?(
                        <>
                          {/* Etiqueta del estatus (badge) */}
                          {estatusPerfil&&(
                            <div className="mb-1.5 inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-600">
                              {estatusPerfil}
                            </div>
                          )}
                          {/* Campo dinámico según tipo */}
                          {configCampo.tipo==="textarea"?(
                            <textarea
                              value={detalleActual}
                              onChange={e=>handleDetalleChange(cliente,e.target.value)}
                              placeholder={configCampo.placeholder}
                              rows={2}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#C9A75D] focus:ring-2 focus:ring-[#C9A75D]/10 resize-none"
                            />
                          ):configCampo.tipo==="datetime-local"?(
                            <input
                              type="datetime-local"
                              value={detalleActual}
                              onChange={e=>handleDetalleChange(cliente,e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#C9A75D] focus:ring-2 focus:ring-[#C9A75D]/10"
                            />
                          ):(
                            <input
                              type="text"
                              value={detalleActual}
                              onChange={e=>handleDetalleChange(cliente,e.target.value)}
                              placeholder={configCampo.placeholder}
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-[#C9A75D] focus:ring-2 focus:ring-[#C9A75D]/10"
                            />
                          )}
                        </>
                      ):(
                        <span className="text-xs italic text-slate-400">Selecciona una actividad</span>
                      )}
                    </td>

                    {/* Datos del cliente */}
                    <td className="border-t border-slate-200 px-4 py-3 font-semibold text-slate-900 min-w-[220px]">{cliente.nombre_cliente||"-"}</td>
                    <td className="border-t border-slate-200 px-4 py-3 font-mono text-xs font-bold whitespace-nowrap">{cliente.vin||"-"}</td>
                    <td className="border-t border-slate-200 px-4 py-3 text-slate-700 whitespace-nowrap">{cliente.ano_modelo||"-"}</td>
                    <td className="border-t border-slate-200 px-4 py-3 font-bold whitespace-nowrap">{cliente.modelo||"-"}</td>
                    <td className="border-t border-slate-200 px-4 py-3 text-slate-700 min-w-[160px]">{cliente.version||"-"}</td>
                    <td className="border-t border-slate-200 px-4 py-3 text-slate-700 whitespace-nowrap">{cliente.meses_actual_a_venta??"-"}</td>
                    <td className="border-t border-slate-200 px-4 py-3 text-slate-700 whitespace-nowrap">{cliente.dias_os_a_actual??"-"}</td>
                    <td className="border-t border-slate-200 px-4 py-3 whitespace-nowrap"><EstatusBadge estatus={cliente.estado_cliente}/></td>
                    <td className="border-t border-slate-200 px-4 py-3 text-slate-700 whitespace-nowrap">{cliente.celular||"-"}</td>
                    <td className="border-t border-slate-200 px-4 py-3 text-slate-700 whitespace-nowrap">{cliente.telefono||"-"}</td>
                    <td className="border-t border-slate-200 px-4 py-3 text-slate-700 min-w-[200px]">{cliente.email||"-"}</td>
                    <td className="border-t border-slate-200 px-4 py-3 text-slate-700 whitespace-nowrap">{formatearFecha(cliente.fecha_venta)}</td>

                    {/* Historial */}
                    <td className="border-t border-slate-200 px-4 py-3 whitespace-nowrap">
                      <button type="button"
                        onClick={e=>{e.stopPropagation();onAbrirDetalle(cliente);}}
                        disabled={!cliente.venta_id}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
                        <History className="h-4 w-4"/>Ver historial
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPaginas>1&&(
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-500">
            Página {paginaActual} de {totalPaginas} · {formatearNumero(totalRegistros)} registros
          </span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={()=>onCambiarPagina(p=>Math.max(1,p-1))} disabled={paginaActual===1||cargando}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4"/>
            </button>
            {Array.from({length:Math.min(5,totalPaginas)},(_,i)=>{
              const inicio=Math.max(1,Math.min(paginaActual-2,totalPaginas-4));
              const pagina=inicio+i;
              return(
                <button key={pagina} type="button" onClick={()=>onCambiarPagina(pagina)} disabled={cargando}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-bold transition ${pagina===paginaActual?"border-[#C9A75D] bg-[#0F172A] text-white":"border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
                  {pagina}
                </button>
              );
            })}
            <button type="button" onClick={()=>onCambiarPagina(p=>Math.min(totalPaginas,p+1))} disabled={paginaActual===totalPaginas||cargando}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 disabled:opacity-40">
              <ChevronRight className="h-4 w-4"/>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}


function SeccionAsignacion({asesores,asesoresSeleccionados,filtrosAsignacion,ventasDisponibles,resumenDisponibles,preview,cargandoDisponibles,cargandoAccion,onToggleAsesor,onCambiarFiltro,onSimular,onAsignar}){
  return(
    <section className="rounded-lg border border-[#C9A75D]/30 bg-[#FFFBF0] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
      <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#80652A]">
            <Sparkles className="h-4 w-4 text-[#C9A75D]"/>VINs sin asignar
          </div>
          <h2 className="mt-3 text-xl font-black text-slate-900">Ventas disponibles para asignación</h2>
          <p className="mt-1 text-sm font-medium text-slate-600">Selecciona el rango de ventas y los asesores participantes.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onSimular} disabled={cargandoAccion||asesoresSeleccionados.length===0}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
            {cargandoAccion?<Loader2 className="h-4 w-4 animate-spin"/>:<BarChart3 className="h-4 w-4"/>}Simular
          </button>
          <button type="button" onClick={onAsignar} disabled={cargandoAccion||asesoresSeleccionados.length===0}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0F172A] px-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60">
            {cargandoAccion?<Loader2 className="h-4 w-4 animate-spin"/>:<CheckCircle2 className="h-4 w-4 text-[#C9A75D]"/>}Asignar VINs
          </button>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CampoFecha label="Fecha venta desde" value={filtrosAsignacion.fecha_venta_desde} onChange={e=>onCambiarFiltro("fecha_venta_desde",e.target.value)}/>
        <CampoFecha label="Fecha venta hasta" value={filtrosAsignacion.fecha_venta_hasta} onChange={e=>onCambiarFiltro("fecha_venta_hasta",e.target.value)}/>
      </div>
      <div className="mt-5">
        <div className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Asesores BDC participantes</div>
        {asesores.length===0?(
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500">No se encontraron asesores BDC.</div>
        ):(
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {asesores.map(asesor=>{
              const activo=asesoresSeleccionados.includes(asesor.id_usuario);
              return(
                <button key={asesor.id_usuario} type="button" onClick={()=>onToggleAsesor(asesor.id_usuario)}
                  className={`rounded-lg border px-4 py-3 text-left transition ${activo?"border-[#C9A75D] bg-white shadow-sm":"border-slate-200 bg-white/70 hover:bg-white"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-slate-900">{asesor.nombre_completo}</div>
                      <div className="mt-1 text-xs font-medium text-slate-500">{asesor.rol_nombre||"Sin rol"} · {asesor.agencia||"Sin agencia"}</div>
                    </div>
                    <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${activo?"border-[#C9A75D] bg-[#C9A75D]":"border-slate-300 bg-white"}`}>
                      {activo&&<CheckCircle2 className="h-4 w-4 text-white"/>}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
        <MiniKpi titulo="Filas origen" valor={resumenDisponibles?.total_filas_origen||0}/>
        <MiniKpi titulo="VINs únicos" valor={resumenDisponibles?.total_vines_unicos_origen||0}/>
        <MiniKpi titulo="Ya asignados" valor={resumenDisponibles?.total_vines_ya_asignados||0}/>
        <MiniKpi titulo="Disponibles" valor={resumenDisponibles?.total_vines_disponibles||resumenDisponibles?.total||0}/>
      </div>
      {preview&&<PreviewAsignacion preview={preview}/>}
      <TablaVinesSinAsignar ventas={ventasDisponibles} cargando={cargandoDisponibles}/>
    </section>
  );
}

function TablaVinesSinAsignar({ventas,cargando}){
  return(
    <div className="mt-6 overflow-hidden rounded-lg border border-[#C9A75D]/30 bg-white">
      <div className="max-h-[440px] overflow-auto">
        <table className="min-w-[1250px] w-full border-separate border-spacing-0 text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#0F172A] text-left text-white">
              {["Cliente","VIN","Año","Modelo","Versión","Fecha venta","Meses venta","Estado cliente","Celular","Teléfono","Correo"].map(h=>(
                <th key={h} className="px-4 py-3 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargando?(
              <tr><td colSpan={11} className="border-t border-slate-200 px-4 py-12 text-center text-sm font-semibold text-slate-500">
                <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-slate-400"/>Cargando VINs sin asignar...
              </td></tr>
            ):ventas.length===0?(
              <tr><td colSpan={11} className="border-t border-slate-200 px-4 py-12 text-center text-sm font-semibold text-slate-500">
                No hay VINs disponibles para asignar con este rango.
              </td></tr>
            ):ventas.map((venta,i)=>(
              <tr key={`${venta.venta_id||i}-${venta.vin||i}`}
                className={`transition ${i%2===0?"bg-white":"bg-[#FFFBF0]"} hover:bg-[#FBF6EA]`}>
                <td className="border-t border-slate-200 px-4 py-3 font-bold text-slate-900 min-w-[240px]">{venta.nombre_cliente||"-"}</td>
                <td className="border-t border-slate-200 px-4 py-3 font-mono text-xs font-bold whitespace-nowrap">{venta.vin||"-"}</td>
                <td className="border-t border-slate-200 px-4 py-3 whitespace-nowrap">{venta.ano_modelo||"-"}</td>
                <td className="border-t border-slate-200 px-4 py-3 font-black whitespace-nowrap">{venta.modelo||"-"}</td>
                <td className="border-t border-slate-200 px-4 py-3 min-w-[220px]">{venta.version||"-"}</td>
                <td className="border-t border-slate-200 px-4 py-3 whitespace-nowrap">{formatearFecha(venta.fecha_venta)}</td>
                <td className="border-t border-slate-200 px-4 py-3 whitespace-nowrap">{venta.meses_actual_a_venta??"-"}</td>
                <td className="border-t border-slate-200 px-4 py-3 whitespace-nowrap"><EstatusBadge estatus={venta.estado_cliente}/></td>
                <td className="border-t border-slate-200 px-4 py-3 whitespace-nowrap">{venta.celular||"-"}</td>
                <td className="border-t border-slate-200 px-4 py-3 whitespace-nowrap">{venta.telefono||"-"}</td>
                <td className="border-t border-slate-200 px-4 py-3 min-w-[220px]">{venta.email||"-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {ventas.length>0&&(
        <div className="border-t border-[#C9A75D]/20 bg-[#FFFBF0] px-4 py-3 text-xs font-semibold text-slate-600">
          Mostrando {formatearNumero(ventas.length)} VINs sin asignar.
        </div>
      )}
    </div>
  );
}

function PreviewAsignacion({preview}){
  const resumen=Array.isArray(preview?.resumen)?preview.resumen:[];
  if(resumen.length===0)return null;
  return(
    <div className="mt-5 rounded-lg border border-[#C9A75D]/30 bg-white p-4">
      <div className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#80652A]">Vista previa de distribución</div>
      <div className="space-y-3">
        {resumen.map(item=>(
          <div key={item.asesor_id} className="rounded-lg border border-[#C9A75D]/20 bg-[#FFFBF0] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="font-black text-slate-900">{item.asesor_nombre}</div>
              <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-[#C9A75D]">{formatearNumero(item.total)} VIN(s)</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniKpi({titulo,valor}){
  return(
    <div className="rounded-lg border border-[#C9A75D]/30 bg-white px-3 py-2">
      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">{titulo}</div>
      <div className="mt-1 text-lg font-black text-slate-900">{formatearNumero(valor)}</div>
    </div>
  );
}


function ModalDetalleComercial({open,onClose,cargando,detalle,clienteCartera,onAgendarCita}){
  if(!open)return null;
  const registro=detalle?.registro||{};
  const resumen=detalle?.resumen||{};
  const historial=Array.isArray(detalle?.historial)?detalle.historial:[];
  const servicios=Array.isArray(detalle?.servicios_relevantes)?detalle.servicios_relevantes:[];
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A75D]/30 bg-[#FFFBF0] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#80652A]">
                <History className="h-4 w-4"/>Historial comercial
              </div>
              <h3 className="mt-3 text-2xl font-black text-slate-950">{registro.nombre_cte||"Cliente"}</h3>
              <div className="mt-2 text-sm font-semibold text-slate-500">VIN: {registro.numero_serie||"-"} · Modelo: {registro.version||"-"}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={()=>onAgendarCita(clienteCartera||registro)}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#0F172A] px-4 text-sm font-black text-white transition hover:bg-black">
                <CalendarDays className="h-4 w-4 text-[#C9A75D]"/>Agendar cita
              </button>
              <button type="button" onClick={onClose}
                className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100">
                <X className="h-5 w-5"/>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto bg-slate-50 p-5 sm:p-6">
          {cargando?(
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#C9A75D]"/>
                <div className="mt-3 text-sm font-bold text-slate-500">Cargando historial...</div>
              </div>
            </div>
          ):(
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                <DatoDetalle icono={UserRound} label="Cliente" value={registro.nombre_cte}/>
                <DatoDetalle icono={Phone} label="Celular" value={registro.celular||registro.telefono}/>
                <DatoDetalle icono={Mail} label="Correo" value={registro.email}/>
                <DatoDetalle icono={CarFront} label="VIN" value={registro.numero_serie}/>
                <DatoDetalle icono={CalendarDays} label="Fecha venta" value={formatearFecha(registro.fecha_venta)}/>
                <DatoDetalle icono={FileText} label="Última orden" value={resumen.ultima_orden}/>
                <DatoDetalle icono={History} label="Total órdenes" value={resumen.total_ordenes_historial}/>
                <DatoDetalle icono={CarFront} label="Kilometraje" value={resumen.ultimo_kilometraje_historial||registro.kilometraje}/>
              </div>
              {servicios.length>0&&(
                <section className="rounded-[20px] border border-slate-200 bg-white p-5">
                  <div className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#80652A]">Servicios comerciales detectados</div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {servicios.map(s=>(
                      <div key={`${s.clave}-${s.ultima_orden}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-black text-slate-950">{s.nombre}</div>
                            <div className="mt-1 text-sm font-medium text-slate-500">{s.descripcion}</div>
                          </div>
                          <span className="rounded-full bg-[#FFFBF0] px-3 py-1 text-xs font-black text-[#80652A]">{s.estatus_revision}</span>
                        </div>
                        <div className="mt-3 text-xs font-semibold text-slate-500">Última fecha: {formatearFecha(s.ultima_fecha)} · Orden: {s.ultima_orden||"-"}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section className="rounded-[20px] border border-slate-200 bg-white p-5">
                <div className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-[#80652A]">Historial completo del VIN</div>
                {historial.length===0?(
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-500">No hay registros de postventa para este VIN.</div>
                ):(
                  <div className="space-y-3">
                    {historial.map((item,i)=><CardHistorial key={`${item.ore_idorden||"orden"}-${i}`} item={item}/>)}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalCitaRapida({open,form,guardando,onClose,onChange,onSubmit}){
  if(!open)return null;
  return(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9A75D]/30 bg-[#FFFBF0] px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#80652A]">
                <CalendarDays className="h-4 w-4"/>Cita rápida
              </div>
              <h3 className="mt-3 text-2xl font-black text-slate-950">Registrar cita desde cartera</h3>
            </div>
            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-slate-50 p-2 text-slate-500 transition hover:bg-slate-100"><X className="h-5 w-5"/></button>
          </div>
        </div>
        <div className="overflow-y-auto bg-slate-50 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CampoTexto label="Cliente" value={form.nombre} onChange={e=>onChange("nombre",e.target.value)}/>
            <CampoTexto label="Teléfono" value={form.telefono} onChange={e=>onChange("telefono",e.target.value)}/>
            <CampoTexto label="Correo" value={form.correo} onChange={e=>onChange("correo",e.target.value)}/>
            <CampoSelect label="Auto / Modelo" value={form.auto_interes} onChange={e=>onChange("auto_interes",e.target.value)}>
              {VEHICULOS.map(v=><option key={v} value={v}>{v}</option>)}
            </CampoSelect>
            <CampoSelect label="Tipo de cita" value={form.tipo_cita} onChange={e=>onChange("tipo_cita",e.target.value)}>
              {TIPOS_CITA.map(t=><option key={t} value={t}>{t}</option>)}
            </CampoSelect>
            <CampoTexto label="Fecha" type="date" value={form.fecha} onChange={e=>onChange("fecha",e.target.value)}/>
            <CampoTexto label="Hora" type="time" value={form.hora} onChange={e=>onChange("hora",e.target.value)}/>
            <CampoTexto label="Fuente prospección" value={form.fuente_prospeccion} onChange={e=>onChange("fuente_prospeccion",e.target.value)}/>
            <CampoTexto label="Asesor digital" value={form.asesor_digital} onChange={e=>onChange("asesor_digital",e.target.value)}/>
            <CampoSelect label="Asesor piso" value={form.asesor_piso} onChange={e=>onChange("asesor_piso",e.target.value)}>
              {ASESORES.map(a=><option key={a} value={a}>{a}</option>)}
            </CampoSelect>
          </div>
          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">Comentarios</span>
            <textarea value={form.comentarios} onChange={e=>onChange("comentarios",e.target.value)} rows={4}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#C9A75D] focus:ring-4 focus:ring-[#C9A75D]/10"/>
          </label>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4">
          <button type="button" onClick={onClose} className="inline-flex h-11 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Cancelar</button>
          <button type="submit" disabled={guardando} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0F172A] px-4 text-sm font-black text-white transition hover:bg-black disabled:opacity-60">
            {guardando?<Loader2 className="h-4 w-4 animate-spin"/>:<CheckCircle2 className="h-4 w-4 text-[#C9A75D]"/>}Guardar cita
          </button>
        </div>
      </form>
    </div>
  );
}


function CardHistorial({item}){
  const descripcion=item.ord_descrip||item.ord_referencia2||item.clasificacion||item.tiporden||"Sin descripción";
  const fecha=item.ore_fechaord||item.ore_fechacie||item.vte_fechdocto||item.fecha_factura||item.ore_fechaprom;
  return(
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#FFFBF0] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#80652A]">{item.clasificacion||"Sin clasificación"}</span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">Orden: {item.ore_idorden||"-"}</span>
      </div>
      <div className="mt-3 text-base font-black text-slate-950">{descripcion}</div>
      <div className="mt-3 grid grid-cols-1 gap-2 text-sm font-semibold text-slate-600 md:grid-cols-4">
        <span>Fecha: {formatearFecha(fecha)}</span>
        <span>Kilometraje: {item.ore_kilometraje||"-"}</span>
        <span>Asesor: {item.asesor||"-"}</span>
        <span>Técnico: {item.tecnico||"-"}</span>
      </div>
    </div>
  );
}

function DatoDetalle({icono:Icono,label,value}){
  return(
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {Icono&&<Icono className="h-4 w-4 text-[#C9A75D]"/>}<span>{label}</span>
      </div>
      <div className="break-words text-sm font-bold text-slate-900">{value||"-"}</div>
    </div>
  );
}

function FiltroTexto({label,value,onChange,onClear}){
  return(
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 transition focus-within:border-[#C9A75D] focus-within:ring-4 focus-within:ring-[#C9A75D]/10">
        <Search className="h-4 w-4 text-slate-400"/>
        <input value={value} onChange={onChange} placeholder="Buscar..."
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"/>
        {value&&<button type="button" onClick={onClear} className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4"/></button>}
      </div>
    </label>
  );
}

function CampoFecha({label,value,onChange}){
  return(
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <input type="date" value={value} onChange={onChange}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#C9A75D] focus:ring-4 focus:ring-[#C9A75D]/10"/>
    </label>
  );
}

function CampoSelect({label,value,onChange,children}){
  return(
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <div className="relative">
        <select value={value} onChange={onChange}
          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm font-bold text-slate-800 outline-none transition focus:border-[#C9A75D] focus:ring-4 focus:ring-[#C9A75D]/10">
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
      </div>
    </label>
  );
}

function CampoTexto({label,value,onChange,type="text"}){
  return(
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>
      <input type={type} value={value} onChange={onChange}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 outline-none transition focus:border-[#C9A75D] focus:ring-4 focus:ring-[#C9A75D]/10"/>
    </label>
  );
}

function Alerta({tipo,mensaje,onClose}){
  return(
    <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm font-semibold ${tipo==="error"?"border-red-200 bg-red-50 text-red-700":"border-emerald-200 bg-emerald-50 text-emerald-700"}`}>
      <span>{mensaje}</span>
      <button type="button" onClick={onClose}><X className="h-4 w-4"/></button>
    </div>
  );
}

function EstatusBadge({estatus}){
  const t=String(estatus||"").toUpperCase();
  if(t==="ACTIVO")return<span className="inline-flex rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">ACTIVO</span>;
  if(t==="INACTIVO")return<span className="inline-flex rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-700">INACTIVO</span>;
  return<span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">{t||"SIN DATO"}</span>;
}


function formatearNumero(v){return new Intl.NumberFormat("es-MX").format(Number(v||0));}
function formatearFecha(v){
  if(!v)return"-";const f=new Date(`${v}T00:00:00`);
  if(Number.isNaN(f.getTime()))return"-";
  return new Intl.DateTimeFormat("es-MX",{day:"2-digit",month:"short",year:"numeric"}).format(f);
}
function formatearFechaHora(v){
  if(!v)return"-";const f=new Date(v);
  if(Number.isNaN(f.getTime()))return"-";
  return new Intl.DateTimeFormat("es-MX",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(f);
}