// Configuración global para las reservas
let objReserva;

// Inicializar cuando se carga la página
window.onload = function () {
    listarReservas();
    inicializarFiltros();
    inicializarFormularioReserva();
}

/**
 * Inicializa los event listeners para los filtros
 */
function inicializarFiltros() {
    // Configurar eventos para los filtros si existen
    document.getElementById('filtroEstado')?.addEventListener('change', filtrarReservas);
    document.getElementById('filtroFecha')?.addEventListener('change', filtrarReservas);
    document.getElementById('filtroCliente')?.addEventListener('input', filtrarReservas);
}

/**
 * Lista todas las reservas
 */
function listarReservas() {
    objReserva = {
        url: "Reserva/ListarReservas",
        cabeceras: ["ID Solicitud", "Cliente", "Vehículo", "Fecha Inicio", "Fecha Fin", "Estado", "Acciones"],
        propiedades: ["id", "nombreCliente", "marcaModeloVehiculo", "fechaInicio", "fechaFin", "estado"],
        divContenedorTabla: "divtabla",
        editar: true,
        eliminar: true,
        propiedadId: "id"
    };
    pintar(objReserva);
}

/**
 * Filtra las reservas según los criterios seleccionados
 */
function filtrarReservas() {
    let estado = document.getElementById('filtroEstado')?.value || "";
    let fecha = document.getElementById('filtroFecha')?.value || "";
    let cliente = document.getElementById('filtroCliente')?.value || "";

    if (estado === "" && fecha === "" && cliente === "") {
        listarReservas();
        return;
    }
    
    let url = "Reserva/FiltrarReservas";
    let parametros = [];
    
    if (estado) parametros.push(`estado=${estado}`);
    if (fecha) parametros.push(`fechaInicio=${fecha}`);
    if (cliente) parametros.push(`clienteId=${cliente}`);
    
    if (parametros.length > 0) {
        url = url + "?" + parametros.join("&");
    }
    
    objReserva.url = url;
    pintar(objReserva);
}

/**
 * Redirige a la página de edición de la reserva
 */
function Editar(id) {
    if (!id) {
        console.error('ID no válido');
        return;
    }

    fetchGet("Reserva/RecuperarReserva?idReserva=" + id, "json", function (data) {
        if (!data) {
            Notificacion("error", "No se pudo recuperar los datos de la reserva", "¡Error!");
            return;
        }

        window.location.href = "Reserva/Edit/" + id;
    });
}

/**
 * Elimina una reserva después de confirmar
 */
function Eliminar(id) {
    if (!id) return;
    
    fetchGet("Reserva/RecuperarReserva?idReserva=" + id, "json", function (reserva) {
        if (reserva) {
            Confirmacion("Eliminar reserva", `¿Está seguro que desea eliminar la reserva #${id}?`, function () {
                fetchGet("Reserva/EliminarReserva?id=" + id, "text", function (data) {
                    if (data == "1") {
                        Notificacion("success", "Reserva eliminada correctamente", "¡Éxito!");
                        listarReservas();
                    } else {
                        Notificacion("error", "No se pudo eliminar la reserva", "¡Error!");
                    }
                });
            });
        } else {
            Notificacion("error", "No se pudo recuperar la información de la reserva", "¡Error!");
        }
    });
}

/**
 * Muestra los detalles de una reserva en un modal
 */
function VerDetalleReserva(id) {
    if (!id) return;
    
    fetchGet("Reserva/RecuperarReserva?idReserva=" + id, "json", function (reserva) {
        if (!reserva) {
            Notificacion("error", "No se pudo recuperar la información de la reserva", "¡Error!");
            return;
        }
        
        // Actualizar elementos del modal con la información de la reserva
        const modal = document.getElementById('detallesSolicitudModal');
        if (!modal) return;
        
        // Información del cliente
        const clienteNombre = modal.querySelector('#clienteNombre') || 
            modal.querySelector('.modal-body .col-md-6:first-child p:nth-child(2)');
        if (clienteNombre) clienteNombre.innerHTML = `<strong>Nombre:</strong> ${reserva.nombreCliente}`;
        
        // Información del vehículo
        const detalleVehiculo = modal.querySelector('#detalleVehiculo') || 
            modal.querySelector('.modal-body .col-md-6:last-child p:nth-child(2)');
        if (detalleVehiculo) detalleVehiculo.innerHTML = `<strong>Vehículo:</strong> ${reserva.marcaModeloVehiculo}`;
        
        // Fechas de la reserva
        const detallePeriodo = modal.querySelector('#detallePeriodo') || 
            modal.querySelector('.modal-body .col-md-6:last-child p:nth-child(3)');
        if (detallePeriodo) {
            const fechaInicio = new Date(reserva.fechaInicio).toLocaleDateString();
            const fechaFin = new Date(reserva.fechaFin).toLocaleDateString();
            detallePeriodo.innerHTML = `<strong>Período:</strong> ${fechaInicio} - ${fechaFin}`;
        }
        
        // Asignar ID a los botones para aprobar/rechazar
        const btnAprobar = modal.querySelector('#btnAprobar');
        if (btnAprobar) btnAprobar.setAttribute('data-id', id);
        
        const btnRechazar = modal.querySelector('#btnRechazar');
        if (btnRechazar) btnRechazar.setAttribute('data-id', id);

        // Mostrar el modal
        new bootstrap.Modal(modal).show();
    });
}

/**
 * Inicializa los componentes del formulario de reserva si están presentes
 */
function inicializarFormularioReserva() {
    // Configurar validación de fechas
    const fechaInicio = document.getElementById('fechaInicio');
    const fechaFin = document.getElementById('fechaFin');

    if (fechaInicio && fechaFin) {
        fechaInicio.addEventListener('change', function() {
            const fechaInicioValue = new Date(this.value);
            const fechaMinFin = new Date(fechaInicioValue);
            fechaMinFin.setDate(fechaInicioValue.getDate() + 1);
            fechaFin.min = fechaMinFin.toISOString().split('T')[0];
    
            if (new Date(fechaFin.value) <= fechaInicioValue) {
                fechaFin.value = fechaMinFin.toISOString().split('T')[0];
            }
        });
    }

    // Mostrar número de orden si existe el elemento
    const ordenNumber = document.getElementById('ordenNumber');
    if (ordenNumber) {
        ordenNumber.textContent = "1"; // ID de orden simplificado
    }

    // Configurar métodos de pago
    const metodoPago = document.getElementsByName('metodoPago');
    if (metodoPago.length > 0) {
        metodoPago.forEach(radio => {
            radio.addEventListener('change', function() {
                const contenidos = document.getElementsByClassName('payment-content');
                
                // Ocultar todos los contenidos
                Array.from(contenidos).forEach(content => {
                    content.classList.add('d-none');
                });
    
                // Mostrar el contenido seleccionado
                const selectedContent = document.getElementById(this.id + 'Content');
                if (selectedContent) {
                    selectedContent.classList.remove('d-none');
                }
            });
        });
    }
}

/**
 * Aprueba una solicitud de reserva
 */
function aprobarSolicitud(id) {
    if (!id) return;
    
    fetchGet("Reserva/AprobarReserva?id=" + id, "text", function(data) {
        if (data == "1") {
            Notificacion("success", "Solicitud aprobada correctamente", "¡Éxito!");
            listarReservas();
            
            // Cerrar el modal si está abierto
            const modal = bootstrap.Modal.getInstance(document.getElementById('detallesSolicitudModal'));
            if (modal) modal.hide();
        } else {
            Notificacion("error", "No se pudo aprobar la solicitud", "¡Error!");
        }
    });
}

/**
 * Rechaza una solicitud de reserva
 */
function rechazarSolicitud(id) {
    if (!id) return;
    
    fetchGet("Reserva/RechazarReserva?id=" + id, "text", function(data) {
        if (data == "1") {
            Notificacion("warning", "Solicitud rechazada", "¡Información!");
            listarReservas();
            
            // Cerrar el modal si está abierto
            const modal = bootstrap.Modal.getInstance(document.getElementById('detallesSolicitudModal'));
            if (modal) modal.hide();
        } else {
            Notificacion("error", "No se pudo rechazar la solicitud", "¡Error!");
        }
    });
}