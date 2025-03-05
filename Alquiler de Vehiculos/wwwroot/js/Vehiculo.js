window.onload = function () {
    listarVehiculos();
}

let objVehiculo;

async function listarVehiculos() {
    objVehiculo = {
        url: "Vehiculo/ListarVehiculos",
        cabeceras: ["ID", "Marca", "Modelo", "Año", "Precio", "Estado"],
        propiedades: ["id", "marca", "modelo", "año", "precio", "estado"],
        divContenedorTabla: "divContenedorTabla",
        editar: true,
        eliminar: true,
        propiedadId: "id"
    };
    pintar(objVehiculo);
}

function filtrarVehiculos() {
    let marca = get("txtMarcaBusqueda") || "";
    let modelo = get("txtModeloBusqueda") || "";

    if (marca === "" && modelo === "") {
        listarVehiculos();
    } else {
        objVehiculo.url = `Vehiculo/FiltrarVehiculos?marca=${marca}&modelo=${modelo}`;
        pintar(objVehiculo);
    }
}

function GuardarVehiculo() {
    let frmGuardar = document.getElementById("frmGuardar");
    let frm = new FormData(frmGuardar);

    Confirmacion("Guardar vehículo", "¿Desea guardar este vehículo?", function () {
        fetchpost("Vehiculo/GuardarDatos", "text", frm, function (res) {
            if (res == "1") {
                Notificacion("success", "Vehículo guardado correctamente", "¡Éxito!");
                listarVehiculos();
                LimpiarFormulario();
            } else {
                Notificacion("error", "No se pudo guardar el vehículo", "¡Error!");
            }
        });
    });
}

function LimpiarFormulario() {
    LimpiarDatos("frmGuardar");
    listarVehiculos();
}

function Editar(id) {
    if (!id) {
        console.error('ID no válido');
        return;
    }

    fetchGet("Vehiculo/RecuperarVehiculo?idVehiculo=" + id, "json", function (data) {
        if (!data) {
            Notificacion("error", "No se pudo recuperar los datos del vehículo", "¡Error!");
            return;
        }

        let idInput = document.getElementById("idEditar");
        let marcaInput = document.getElementById("marcaEditar");
        let modeloInput = document.getElementById("modeloEditar");
        let añoInput = document.getElementById("añoEditar");
        let precioInput = document.getElementById("precioEditar");
        let estadoInput = document.getElementById("estadoEditar");
        let descripcionInput = document.getElementById("descripcionEditar");

        if (idInput && marcaInput && modeloInput) {
            idInput.value = data.id;
            marcaInput.value = data.marca;
            modeloInput.value = data.modelo;
            añoInput.value = data.año;
            precioInput.value = data.precio;
            estadoInput.value = data.estado;
            descripcionInput.value = data.descripcion || '';

            let modalElement = document.getElementById('modalEditar');
            if (modalElement) {
                var modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        } else {
            console.error('No se encontraron los elementos del formulario');
        }
    });
}

function Eliminar(id) {
    fetchGet("Vehiculo/RecuperarVehiculo?idVehiculo=" + id, "json", function (vehiculo) {
        if (vehiculo) {
            Confirmacion("Eliminar vehículo", `¿Está seguro que desea eliminar el vehículo ${vehiculo.marca} ${vehiculo.modelo}?`, function () {
                fetchGet("Vehiculo/EliminarVehiculo?id=" + id, "text", function (data) {
                    if (data == "1") {
                        Notificacion("success", `Se eliminó el vehículo ${vehiculo.marca} ${vehiculo.modelo} correctamente`, "¡Eliminado!");
                        listarVehiculos();
                    } else {
                        Notificacion("error", `No se pudo eliminar el vehículo ${vehiculo.marca} ${vehiculo.modelo}`, "¡Error!");
                    }
                });
            });
        } else {
            Notificacion("error", "No se pudo recuperar la información del vehículo", "¡Error!");
        }
    });
}

function GuardarEdicion() {
    let frmEditar = document.getElementById("frmEditar")
    let frm = new FormData(frmEditar);

    Confirmacion("Confirmar edición", "¿Desea guardar los cambios del vehículo?", function () {
        fetchpost("Vehiculo/GuardarDatos", "text", frm, function (res) {
            if (res == "1") {
                Notificacion("success", "Vehículo actualizado correctamente", "¡Éxito!");
                listarVehiculos();
                var modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'));
                modal.hide();
            } else {
                Notificacion("error", "No se pudo actualizar el vehículo", "¡Error!");
            }
        });
    });
}

function VerDetalleVehiculo(id) {
    fetchGet("Vehiculo/RecuperarVehiculo?idVehiculo=" + id, "json", function (vehiculo) {
        if (vehiculo) {
            // Establecer los valores en el modal de detalles
            document.getElementById("detalleMarca").innerText = vehiculo.marca;
            document.getElementById("detalleModelo").innerText = vehiculo.modelo;
            document.getElementById("detalleAño").innerText = vehiculo.año;
            document.getElementById("detallePrecio").innerText = `$${vehiculo.precio.toFixed(2)}`;
            document.getElementById("detalleEstado").innerText = vehiculo.estado;
            document.getElementById("detalleDescripcion").innerText = vehiculo.descripcion || 'Sin descripción';

            // Mostrar la imagen si existe
            let imgVehiculo = document.getElementById("detalleImagen");
            if (vehiculo.path) {
                imgVehiculo.src = vehiculo.path;
                imgVehiculo.style.display = "block";
            } else {
                imgVehiculo.style.display = "none";
            }

            // Mostrar modal
            let modalElement = document.getElementById('modalDetalle');
            if (modalElement) {
                var modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        }
    });
}

function seleccionarVehiculo(id) {
    // Buscar el vehículo seleccionado en la variable global
    const vehiculoId = parseInt(id);
    vehiculoSeleccionado = vehiculosDisponibles.find(v => v.id === vehiculoId);
    
    if (!vehiculoSeleccionado) {
        console.error("Vehículo no encontrado:", id);
        return;
    }
    
    // Mostrar la información del vehículo
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
            vehiculoSeleccionado.precio.toFixed(2);
        
        // Mostrar la imagen si existe
        if (vehiculoSeleccionado.path) {
            document.getElementById('imagenVehiculo').src = vehiculoSeleccionado.path;
        } else {
            document.getElementById('imagenVehiculo').src = '/img/car-placeholder.png';
        }
        
        // Mostrar el panel de información
        infoVehiculo.classList.remove('d-none');
    }
    
    // Actualizar el dropdown si es necesario
    const selectVehiculo = document.getElementById('selectVehiculo');
    if (selectVehiculo && selectVehiculo.value != vehiculoId) {
        selectVehiculo.value = vehiculoId;
    }
    
    // Destacar visualmente la fila seleccionada en la tabla
    const filas = document.querySelectorAll('#divtabla table tbody tr');
    filas.forEach(fila => {
        fila.classList.remove('table-active');
        
        // Obtener el ID de la fila actual (en la primera celda oculta o en un atributo data)
        const celdaID = fila.querySelector('td[style*="display: none"]') || 
                        fila.querySelector('td:first-child');
        const filaId = celdaID ? celdaID.textContent.trim() : null;
        
        if (filaId && parseInt(filaId) === vehiculoId) {
            fila.classList.add('table-active');
            fila.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    // Actualizar costos
    actualizarResumenCostos();
}