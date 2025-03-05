// Variables globales
let vehiculosDisponibles = [];
let vehiculoSeleccionado = null;

// Inicializar cuando se carga la página
window.onload = function () {
    // Determinar qué vista está activa
    const esVistaReserva = document.getElementById('reservar') !== null;
    const esVistaGestion = document.getElementById('filtroEstado') !== null;
    
    if (esVistaReserva) {
        pintarTablaVehiculos(); // Mostrar tabla de vehículos
        inicializarSelectorVehiculo(); // Inicializar selector por ID
        inicializarFormularioReserva();
        inicializarMetodosPago();
    } else if (esVistaGestion) {
        listarReservas();
        inicializarFiltros();
    }
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
    // Configurar fechas
    const fechaInicio = document.getElementById('fechaInicio');
    const fechaFin = document.getElementById('fechaFin');
    
    if (fechaInicio && fechaFin) {
        // Establecer fecha mínima como hoy
        const hoy = new Date().toISOString().split('T')[0];
        fechaInicio.min = hoy;
        
        // Configurar evento change para fecha de inicio
        fechaInicio.addEventListener('change', function() {
            // Establecer fecha mínima para la fecha fin
            const fechaInicioValue = new Date(this.value);
            const fechaMinFin = new Date(fechaInicioValue);
            fechaMinFin.setDate(fechaInicioValue.getDate() + 1);
            fechaFin.min = fechaMinFin.toISOString().split('T')[0];
            
            // Si la fecha fin es menor, actualizarla
            if (!fechaFin.value || new Date(fechaFin.value) <= fechaInicioValue) {
                fechaFin.value = fechaMinFin.toISOString().split('T')[0];
            }
            
            // Actualizar resumen
            actualizarResumenCostos();
        });
        
        // Evento change para fecha fin
        fechaFin.addEventListener('change', function() {
            actualizarResumenCostos();
        });
    }
    
    // Configurar seguros
    const seguros = document.getElementsByName('seguroTipo');
    seguros.forEach(seguro => {
        seguro.addEventListener('change', actualizarResumenCostos);
    });
}

/**
 * Inicializa los métodos de pago y sus event listeners
 */
function inicializarMetodosPago() {
    // Referencias a los radio buttons
    const radioPagos = document.querySelectorAll('input[name="metodoPago"]');
    const contenidos = document.querySelectorAll('.payment-content');
    
    // Asegurar que el contenido inicial se muestra
    contenidos.forEach(contenido => {
        contenido.classList.add('d-none');
    });
    
    const metodoPredeterminado = document.getElementById('efectivo');
    if (metodoPredeterminado && metodoPredeterminado.checked) {
        document.getElementById('efectivoContent')?.classList.remove('d-none');
    }
    
    // Mostrar contenido según el método seleccionado
    radioPagos.forEach(radio => {
        radio.addEventListener('change', function() {
            // Ocultar todos los contenidos
            contenidos.forEach(contenido => {
                contenido.classList.add('d-none');
            });
            
            // Mostrar el contenido correspondiente al método seleccionado
            const contenidoSeleccionado = document.getElementById(`${this.id}Content`);
            if (contenidoSeleccionado) {
                contenidoSeleccionado.classList.remove('d-none');
            }
            
            // Si es tarjeta, añadir validación específica
            if (this.id === 'tarjeta') {
                inicializarValidacionTarjeta();
            }
        });
    });
    
    // Generar número de orden para efectivo
    const ordenNumber = document.getElementById('ordenNumber');
    if (ordenNumber) {
        // Generar un número aleatorio para simular un número de orden
        const numeroOrden = Math.floor(Math.random() * 100000) + 1;
        ordenNumber.textContent = `RES-${numeroOrden}`;
    }
    
    // Configurar botón de confirmar reserva
    const btnConfirmar = document.getElementById('btnConfirmarReserva');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', guardarReserva);
    }
}

/**
 * Inicializa la validación del formulario de tarjeta
 */
function inicializarValidacionTarjeta() {
    const formTarjeta = document.querySelector('#tarjetaContent form');
    if (!formTarjeta) return;
    
    formTarjeta.addEventListener('submit', function(e) {
        e.preventDefault();
        if (formTarjeta.checkValidity()) {
            // Si el formulario es válido, guardar la reserva
            guardarReserva();
        }
    });
    
    // Formateo para el número de tarjeta
    const numeroTarjeta = document.getElementById('numeroTarjeta');
    if (numeroTarjeta) {
        numeroTarjeta.addEventListener('input', function() {
            // Eliminar espacios y caracteres no numéricos
            this.value = this.value.replace(/\D/g, '')
                // Insertar espacios cada 4 dígitos
                .replace(/(\d{4})(?=\d)/g, '$1 ');
            
            // Limitar a 16 dígitos + espacios
            if (this.value.replace(/\s/g, '').length > 16) {
                this.value = this.value.substring(0, 19);
            }
        });
    }
    
    // Formateo para la fecha de expiración
    const fechaExpiracion = document.getElementById('fechaExpiracion');
    if (fechaExpiracion) {
        fechaExpiracion.addEventListener('input', function() {
            // Eliminar caracteres no numéricos
            this.value = this.value.replace(/\D/g, '')
                // Formatear como MM/YY
                .replace(/^(\d{2})(\d{0,2})/, '$1/$2')
                .replace(/^(\d{2})\/(\d{2}).+$/, '$1/$2');
        });
    }
}

/**
 * Carga los vehículos disponibles en la tabla y en el dropdown
 */
function cargarVehiculosDisponibles() {
    fetchGet("Vehiculo/VehiculosDisponibles", "json", function(data) {
        if (!data || !Array.isArray(data)) {
            Notificacion("error", "No se pudieron cargar los vehículos disponibles", "¡Error!");
            return;
        }
        
        vehiculosDisponibles = data;
        
        // Configurar el dropdown
        const selectVehiculo = document.getElementById('selectVehiculo');
        if (selectVehiculo) {
            // Limpiar opciones existentes excepto la primera
            while (selectVehiculo.options.length > 1) {
                selectVehiculo.remove(1);
            }
            
            // Añadir los vehículos al dropdown
            data.forEach(vehiculo => {
                const option = document.createElement('option');
                option.value = vehiculo.id;
                option.textContent = `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.año}) - $${vehiculo.precio}/día`;
                selectVehiculo.appendChild(option);
            });
            
            // Configurar evento change
            selectVehiculo.addEventListener('change', function() {
                const id = this.value;
                if (id) {
                    seleccionarVehiculo(id);
                } else {
                    ocultarDetallesVehiculo();
                }
            });
        }
        
        // Configurar la tabla
        pintarTablaVehiculos(data);
    });
}

/**
 * Pinta la tabla de vehículos disponibles
 */
function pintarTablaVehiculos(vehiculos) {
    const objVehiculo = {
        url: "Vehiculo/VehiculosDisponibles",
        cabeceras: ["", "Marca", "Modelo", "Año", "Precio/día", "Estado", "Acción"],
        propiedades: ["id", "marca", "modelo", "año", "precio", "estado"],
        divContenedorTabla: "divtabla",
        editar: false,
        eliminar: false,
        propiedadId: "id",
        primeraColumna: function(item) {
            const imagePath = item.path || 'https://via.placeholder.com/100x60?text=Auto';
            return `<img src="${imagePath}" class="img-thumbnail" style="width: 100px; height: 60px; object-fit: cover;">`;
        },
        formatoColumna: function(propiedad, valor) {
            if (propiedad === "precio") {
                return `$${parseFloat(valor).toFixed(2)}`;
            }
            if (propiedad === "estado") {
                let color = "success";
                if (valor.toLowerCase() !== "disponible") {
                    color = "danger";
                }
                return `<span class="badge bg-${color}">${valor}</span>`;
            }
            return valor;
        },
        columnaPersonalizada: function(item) {
            return `<button class="btn btn-warning btn-sm" onclick="seleccionarVehiculo(${item.id})">
                <i class="fas fa-check-circle me-1"></i> Seleccionar
            </button>`;
        }
    };
    
    pintar(objVehiculo);
}

/**
 * Selecciona un vehículo y muestra sus detalles
 */
function seleccionarVehiculo(id) {
    // Buscar el vehículo en la lista
    vehiculoSeleccionado = vehiculosDisponibles.find(v => v.id == id);
    
    if (!vehiculoSeleccionado) {
        console.error("Vehículo no encontrado:", id);
        return;
    }
    
    // Actualizar dropdown si es necesario
    const selectVehiculo = document.getElementById('selectVehiculo');
    if (selectVehiculo && selectVehiculo.value != id) {
        selectVehiculo.value = id;
    }
    
    // Mostrar detalles del vehículo
    const infoVehiculo = document.getElementById('infoVehiculo');
    if (infoVehiculo) {
        document.getElementById('marcaModeloVehiculo').textContent = 
            `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo}`;
        document.getElementById('añoVehiculo').textContent = vehiculoSeleccionado.año;
        document.getElementById('kilometrajeVehiculo').textContent = 
            vehiculoSeleccionado.kilometraje || '0';
        document.getElementById('combustibleVehiculo').textContent = 
            vehiculoSeleccionado.combustible || 'Gasolina';
        document.getElementById('transmisionVehiculo').textContent = 
            vehiculoSeleccionado.transmision || 'Manual';
        document.getElementById('precioVehiculoDia').textContent = 
            parseFloat(vehiculoSeleccionado.precio).toFixed(2);
        
        // Mostrar la imagen
        const imgElement = document.getElementById('imagenVehiculo');
        if (imgElement) {
            imgElement.src = vehiculoSeleccionado.path || 'https://via.placeholder.com/300x200?text=Auto';
            imgElement.alt = `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo}`;
        }
        
        // Mostrar el panel
        infoVehiculo.classList.remove('d-none');
    }
    
    // Resaltar la fila seleccionada
    destacarFilaSeleccionada(id);
    
    // Actualizar el resumen de costos
    actualizarResumenCostos();
}

/**
 * Oculta los detalles del vehículo cuando no hay selección
 */
function ocultarDetallesVehiculo() {
    const infoVehiculo = document.getElementById('infoVehiculo');
    if (infoVehiculo) {
        infoVehiculo.classList.add('d-none');
    }
    vehiculoSeleccionado = null;
    actualizarResumenCostos();
}

/**
 * Resalta la fila del vehículo seleccionado en la tabla
 */
function destacarFilaSeleccionada(id) {
    const filas = document.querySelectorAll('#divtabla table tbody tr');
    filas.forEach(fila => {
        fila.classList.remove('table-active');
        
        // Buscar el ID de la fila
        const celdas = fila.querySelectorAll('td');
        if (celdas.length > 0) {
            // El ID suele estar en una columna oculta o como atributo data
            const idCelda = fila.querySelector('td[style*="display: none"]') || 
                           fila.getAttribute('data-id');
            
            const filaId = idCelda ? idCelda.textContent : null;
            
            if (filaId && filaId == id) {
                fila.classList.add('table-active');
                fila.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
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

/**
 * Actualiza el resumen de costos según los datos seleccionados
 * Esta es la función clave que faltaba implementar
 */
function actualizarResumenCostos() {
    // Obtener referencias a los elementos de resumen
    const costoVehiculoElement = document.getElementById('costoVehiculo');
    const diasAlquilerElement = document.getElementById('diasAlquiler');
    const costoSeguroElement = document.getElementById('costoSeguro');
    const subtotalElement = document.getElementById('subtotal');
    const ivaElement = document.getElementById('iva');
    const totalPagarElement = document.getElementById('totalPagar');
    
    // Valores predeterminados
    let costoVehiculo = 0;
    let diasAlquiler = 0;
    let costoSeguro = 0;
    
    // Obtener costo del vehículo seleccionado
    if (vehiculoSeleccionado) {
        costoVehiculo = parseFloat(vehiculoSeleccionado.precio);
    }
    
    // Obtener días de alquiler
    const fechaInicio = document.getElementById('fechaInicio')?.value;
    const fechaFin = document.getElementById('fechaFin')?.value;
    
    if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        // Calcular diferencia en días
        diasAlquiler = Math.round((fin - inicio) / (1000 * 60 * 60 * 24));
    }
    
    // Obtener costo del seguro seleccionado
    const seguros = document.getElementsByName('seguroTipo');
    for (const seguro of seguros) {
        if (seguro.checked) {
            switch (seguro.value) {
                case 'responsabilidadCivil': costoSeguro = 80; break;
                case 'todoRiesgo': costoSeguro = 100; break;
                case 'proteccionRobo': costoSeguro = 85; break;
                case 'asistenciaCarretera': costoSeguro = 90; break;
                case 'accidentesPersonales': costoSeguro = 95; break;
            }
            break;
        }
    }
    
    // Calcular subtotal
    const subtotal = (costoVehiculo + costoSeguro) * diasAlquiler;
    const iva = subtotal * 0.12; // 12% IVA
    const total = subtotal + iva;
    
    // Actualizar elementos HTML
    if (costoVehiculoElement) costoVehiculoElement.textContent = costoVehiculo.toFixed(2);
    if (diasAlquilerElement) diasAlquilerElement.textContent = diasAlquiler;
    if (costoSeguroElement) costoSeguroElement.textContent = costoSeguro.toFixed(2);
    if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
    if (ivaElement) ivaElement.textContent = iva.toFixed(2);
    if (totalPagarElement) totalPagarElement.textContent = total.toFixed(2);
}

/**
 * Guarda la reserva en la base de datos
 */
function guardarReserva() {
    // Validar que se hayan completado todos los campos obligatorios
    if (!validarFormularioReserva()) return;
    
    // Obtener datos de la reserva
    const usuarioId = localStorage.getItem('usuarioId');
    if (!usuarioId) {
        Notificacion("warning", "Debe iniciar sesión para realizar una reserva", "Atención");
        return;
    }
    
    // Obtener datos del formulario
    const vehiculoId = vehiculoSeleccionado?.id;
    const fechaInicio = document.getElementById('fechaInicio')?.value;
    const fechaFin = document.getElementById('fechaFin')?.value;
    
    // Obtener seguro seleccionado
    let seguroTipo = "";
    const seguros = document.getElementsByName('seguroTipo');
    for (const seguro of seguros) {
        if (seguro.checked) {
            seguroTipo = seguro.value;
            break;
        }
    }
    
    // Obtener método de pago
    let metodoPago = "";
    const metodos = document.getElementsByName('metodoPago');
    for (const metodo of metodos) {
        if (metodo.checked) {
            metodoPago = metodo.id;
            break;
        }
    }
    
    // Obtener total a pagar
    const totalPagar = document.getElementById('totalPagar')?.textContent || "0";
    
    // Crear objeto con los datos
    const formData = new FormData();
    formData.append("clienteId", usuarioId);
    formData.append("vehiculoId", vehiculoId);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaFin", fechaFin);
    formData.append("seguroTipo", seguroTipo);
    formData.append("metodoPago", metodoPago);
    formData.append("total", totalPagar);
    formData.append("estado", "pendiente");
    
    // Mostrar indicador de carga
    const btnConfirmar = document.getElementById('btnConfirmarReserva');
    const textoOriginal = btnConfirmar.innerHTML;
    btnConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';
    btnConfirmar.disabled = true;
    
    // Enviar los datos al servidor
    fetchpost("Reserva/GuardarReserva", "text", formData, function(resultado) {
        // Restaurar botón
        btnConfirmar.innerHTML = textoOriginal;
        btnConfirmar.disabled = false;
        
        if (resultado == "1") {
            Notificacion("success", "Reserva creada exitosamente. En breve un asesor validará tu solicitud.", "¡Éxito!");
            
            // Redirigir a mis reservas
            setTimeout(function() {
                const misReservasTab = document.getElementById('misreservas-tab');
                if (misReservasTab) {
                    bootstrap.Tab.getOrCreateInstance(misReservasTab).show();
                    cargarMisReservas();
                }
            }, 2000);
        } else {
            Notificacion("error", "No se pudo guardar la reserva. Por favor intente nuevamente.", "¡Error!");
        }
    });
}

/**
 * Valida que todos los campos requeridos estén completos
 */
function validarFormularioReserva() {
    // Validar selección de vehículo
    if (!vehiculoSeleccionado) {
        Notificacion("warning", "Debe seleccionar un vehículo", "Atención");
        return false;
    }
    
    // Validar fechas
    const fechaInicio = document.getElementById('fechaInicio')?.value;
    const fechaFin = document.getElementById('fechaFin')?.value;
    
    if (!fechaInicio || !fechaFin) {
        Notificacion("warning", "Debe seleccionar las fechas de reserva", "Atención");
        return false;
    }
    
    // Validar seguro
    const seguroSeleccionado = Array.from(document.getElementsByName('seguroTipo')).some(s => s.checked);
    if (!seguroSeleccionado) {
        Notificacion("warning", "Debe seleccionar un seguro", "Atención");
        return false;
    }
    
    // Validar método de pago
    const metodoPagoSeleccionado = Array.from(document.getElementsByName('metodoPago')).find(m => m.checked);
    if (!metodoPagoSeleccionado) {
        Notificacion("warning", "Debe seleccionar un método de pago", "Atención");
        return false;
    }
    
    // Si el método es tarjeta, validar datos adicionales
    if (metodoPagoSeleccionado.id === 'tarjeta') {
        const nombreTarjeta = document.getElementById('nombreTarjeta')?.value;
        const numeroTarjeta = document.getElementById('numeroTarjeta')?.value;
        const fechaExpiracion = document.getElementById('fechaExpiracion')?.value;
        const cvv = document.getElementById('cvv')?.value;
        const tipoTarjeta = document.getElementById('tipoTarjeta')?.value;
        const terminos = document.getElementById('terminos')?.checked;
        
        if (!nombreTarjeta || !numeroTarjeta || !fechaExpiracion || !cvv || !tipoTarjeta || !terminos) {
            Notificacion("warning", "Debe completar todos los datos de la tarjeta", "Atención");
            return false;
        }
    }
    
    return true;
}

/**
 * Inicializa el selector de vehículos por ID
 */
function inicializarSelectorVehiculo() {
    // Cargar vehículos en variable global (para referencia posterior)
    fetchGet("Vehiculo/VehiculosDisponibles", "json", function(data) {
        if (!data || !Array.isArray(data)) {
            Notificacion("error", "No se pudieron cargar los datos de vehículos", "¡Error!");
            return;
        }
        
        vehiculosDisponibles = data;
        console.log("Vehículos cargados:", vehiculosDisponibles.length);
    });
    
    // Configurar evento para el botón de selección
    const btnSeleccionar = document.getElementById('btnSeleccionarVehiculo');
    const inputId = document.getElementById('inputVehiculoId');
    
    if (btnSeleccionar && inputId) {
        btnSeleccionar.addEventListener('click', function() {
            const id = inputId.value;
            if (!id) {
                Notificacion("warning", "Ingrese un número de registro válido", "Atención");
                return;
            }
            seleccionarVehiculo(id);
        });
        
        // También permitir seleccionar presionando Enter
        inputId.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                const id = this.value;
                if (id) {
                    seleccionarVehiculo(id);
                }
            }
        });
    }
}

/**
 * Selecciona un vehículo por su ID
 */
function seleccionarVehiculo(id) {
    // Si los vehículos aún no están cargados, intentar cargarlos
    if (!vehiculosDisponibles || vehiculosDisponibles.length === 0) {
        fetchGet("Vehiculo/VehiculosDisponibles", "json", function(data) {
            if (data && Array.isArray(data)) {
                vehiculosDisponibles = data;
                procesarSeleccionVehiculo(id);
            } else {
                Notificacion("error", "No se pudo cargar la información del vehículo", "¡Error!");
            }
        });
    } else {
        procesarSeleccionVehiculo(id);
    }
}

/**
 * Procesa la selección de vehículo una vez que los datos están disponibles
 */
function procesarSeleccionVehiculo(id) {
    // Buscar el vehículo en los datos cargados
    vehiculoSeleccionado = vehiculosDisponibles.find(v => v.id == id);
    
    if (!vehiculoSeleccionado) {
        Notificacion("warning", "Vehículo no encontrado o no disponible", "Atención");
        return;
    }
    
    // Mostrar detalles del vehículo seleccionado
    const infoVehiculo = document.getElementById('infoVehiculo');
    if (infoVehiculo) {
        document.getElementById('marcaModeloVehiculo').textContent = 
            `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo}`;
        document.getElementById('añoVehiculo').textContent = vehiculoSeleccionado.año;
        document.getElementById('kilometrajeVehiculo').textContent = 
            vehiculoSeleccionado.kilometraje || '0';
        document.getElementById('combustibleVehiculo').textContent = 
            vehiculoSeleccionado.combustible || 'Gasolina';
        document.getElementById('transmisionVehiculo').textContent = 
            vehiculoSeleccionado.transmision || 'Manual';
        document.getElementById('precioVehiculoDia').textContent = 
            parseFloat(vehiculoSeleccionado.precio).toFixed(2);
        
        // Mostrar imagen
        const imgElement = document.getElementById('imagenVehiculo');
        if (imgElement) {
            imgElement.src = vehiculoSeleccionado.path || 'https://via.placeholder.com/300x200?text=Auto';
            imgElement.alt = `${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo}`;
        }
        
        // Mostrar el panel
        infoVehiculo.classList.remove('d-none');
    }
    
    // Resaltar la fila en la tabla si corresponde
    destacarFilaSeleccionada(id);
    
    // Actualizar resumen de costos
    actualizarResumenCostos();
    
    // Mostrar notificación de éxito
    Notificacion("success", `Vehículo ${vehiculoSeleccionado.marca} ${vehiculoSeleccionado.modelo} seleccionado`, "¡Éxito!");
    
    // Actualizar el campo de entrada
    const inputId = document.getElementById('inputVehiculoId');
    if (inputId) {
        inputId.value = id;
    }
}