window.onload = function () {
    listarClientes();
}

let objCliente;

function listarClientes() {
    objCliente = {
        url: "Cliente/ListarClientes",
        cabeceras: ["ID", "Nombre", "Apellido", "Teléfono", "Email", "Acciones"],
        propiedades: ["id", "nombre", "apellido", "telefono", "email"],
        divContenedorTabla: "divContenedorTabla",
        editar: true,
        eliminar: true,
        propiedadId: "id"
    };
    pintar(objCliente);
}

function filtrarClientes() {
    let nombre = get("txtNombre") || "";
    let apellido = get("txtApellido") || "";
    let email = get("txtEmail") || "";

    if (nombre === "" && apellido === "" && email === "") {
        listarClientes();
    } else {
        objCliente.url = `Cliente/FiltrarClientes?nombre=${nombre}&apellido=${apellido}&email=${email}`;
        pintar(objCliente);
    }
}

/**
 * Verifica si existe un cliente donde todos los criterios proporcionados coinciden exactamente
 * @param {string} nombre - Nombre a buscar (opcional)
 * @param {string} apellido - Apellido a buscar (opcional)
 * @param {string} email - Email a buscar (opcional)
 * @param {function} callback - Función que recibe como parámetro un booleano indicando si existe o no
 */
function existeCliente(nombre = null, apellido = null, email = null, callback) {
    // Realizar la consulta con los parámetros disponibles para tener un conjunto inicial
    let url = "Cliente/FiltrarClientes";
    let parametros = [];
    
    // Usar solo un parámetro para la consulta inicial (preferiblemente email por ser más único)
    // para evitar restricciones excesivas en la consulta al servidor
    if (email) {
        parametros.push(`email=${encodeURIComponent(email)}`);
    } else if (nombre) {
        parametros.push(`nombre=${encodeURIComponent(nombre)}`);
    } else if (apellido) {
        parametros.push(`apellido=${encodeURIComponent(apellido)}`);
    }
    
    if (parametros.length > 0) {
        url += "?" + parametros.join("&");
    }
    
    // Realizar la consulta
    fetchGet(url, "json", function(data) {
        // Filtrar los resultados para asegurar que todos los criterios coinciden
        let resultadosFiltrados = [];
        
        if (Array.isArray(data)) {
            resultadosFiltrados = data.filter(cliente => {
                // Verificar que todos los campos proporcionados coincidan exactamente
                let coincideNombre = nombre === null || cliente.nombre.toLowerCase() === nombre.toLowerCase();
                let coincideApellido = apellido === null || cliente.apellido.toLowerCase() === apellido.toLowerCase();
                let coincideEmail = email === null || cliente.email.toLowerCase() === email.toLowerCase();
                
                // Todos los campos proporcionados deben coincidir
                return coincideNombre && coincideApellido && coincideEmail;
            });
        }
        
        // Determinar si existe basado en los resultados filtrados
        let existe = resultadosFiltrados.length > 0;
        
        // Llamar al callback con el resultado
        if (typeof callback === 'function') {
            callback(existe, resultadosFiltrados);
        }
    });
}

function GuardarCliente() {
    let frmGuardar = document.getElementById("frmGuardar");
    let frm = new FormData(frmGuardar);

    Confirmacion("Guardar cliente", "¿Desea guardar este cliente?", function () {
        fetchpost("Cliente/GuardarDatos", "text", frm, function (res) {
            if (res == "1") {
                Notificacion("success", "Cliente guardado correctamente", "¡Éxito!");
                listarClientes();
                LimpiarFormulario();
            } else {
                Notificacion("error", "No se pudo guardar el cliente", "¡Error!");
            }
        });
    });
}

function LimpiarFormulario() {
    LimpiarDatos("frmGuardar");
    listarClientes();
}

function Editar(id) {
    if (!id) {
        console.error('ID no válido');
        return;
    }

    fetchGet("Cliente/RecuperarCliente?idCliente=" + id, "json", function (data) {
        if (!data) {
            Notificacion("error", "No se pudo recuperar los datos del cliente", "¡Error!");
            return;
        }

        let idInput = document.getElementById("idEditar");
        let nombreInput = document.getElementById("nombreEditar");
        let apellidoInput = document.getElementById("apellidoEditar");
        let telefonoInput = document.getElementById("telefonoEditar");
        let emailInput = document.getElementById("emailEditar");

        if (idInput && nombreInput && apellidoInput) {
            idInput.value = data.id;
            nombreInput.value = data.nombre;
            apellidoInput.value = data.apellido;
            telefonoInput.value = data.telefono;
            emailInput.value = data.email;

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
    fetchGet("Cliente/RecuperarCliente?idCliente=" + id, "json", function (cliente) {
        if (cliente) {
            Confirmacion("Eliminar cliente", `¿Está seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`, function () {
                fetchGet("Cliente/EliminarCliente?id=" + id, "text", function (data) {
                    if (data == "1") {
                        Notificacion("success", `Se eliminó el cliente ${cliente.nombre} ${cliente.apellido} correctamente`, "¡Eliminado!");
                        listarClientes();
                    } else {
                        Notificacion("error", "No se pudo eliminar el cliente", "¡Error!");
                    }
                });
            });
        } else {
            Notificacion("error", "No se pudo recuperar los datos del cliente", "¡Error!");
        }
    });
}

/**
 * Busca clientes por nombre, apellido o email y muestra los resultados en una tabla
 */
function buscarClientes() {
    const nombre = document.getElementById('txtNombre').value.trim();
    const apellido = document.getElementById('txtApellido').value.trim();
    const email = document.getElementById('txtEmail').value.trim();
    
    // Configuración de la tabla
    let objCliente = {
        url: "Cliente/FiltrarClientes",
        cabeceras: ["ID", "Nombre", "Apellido", "Teléfono", "Email", "Acciones"],
        propiedades: ["id", "nombre", "apellido", "telefono", "email"],
        divContenedorTabla: "divResultadosBusqueda",
        editar: true,
        eliminar: true,
        propiedadId: "id",
        registrosPorPagina: 5
    };
    
    // Añadir parámetros de búsqueda si están presentes
    let parametros = [];
    if (nombre) parametros.push(`nombre=${encodeURIComponent(nombre)}`);
    if (apellido) parametros.push(`apellido=${encodeURIComponent(apellido)}`);
    if (email) parametros.push(`email=${encodeURIComponent(email)}`);
    
    if (parametros.length > 0) {
        objCliente.url = `${objCliente.url}?${parametros.join('&')}`;
    }
    
    // Pintar tabla de resultados
    pintar(objCliente);
}

/**
 * Ejemplo de uso de existeCliente para validar disponibilidad de email
 */
function verificarDisponibilidadEmail() {
    const email = document.getElementById('email').value.trim();
    
    if (!email) {
        Notificacion("warning", "Ingrese un email para verificar", "Atención");
        return;
    }
    
    // Mostrar indicador de carga
    const btnVerificar = document.getElementById('btnVerificarEmail');
    const textoOriginal = btnVerificar.innerHTML;
    btnVerificar.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Verificando...';
    btnVerificar.disabled = true;
    
    // Verificar si el email ya está registrado
    existeCliente(null, null, email, function(existe) {
        // Restaurar estado del botón
        btnVerificar.innerHTML = textoOriginal;
        btnVerificar.disabled = false;
        
        if (existe) {
            // El email ya está registrado
            Notificacion("warning", "Este correo electrónico ya está registrado", "Email no disponible");
            document.getElementById('email').classList.add('is-invalid');
        } else {
            // El email está disponible
            Notificacion("success", "Este correo electrónico está disponible", "Email disponible");
            document.getElementById('email').classList.add('is-valid');
            document.getElementById('email').classList.remove('is-invalid');
        }
    });
}