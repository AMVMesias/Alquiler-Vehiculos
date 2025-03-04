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