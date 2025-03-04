document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un usuario logueado y marcar el radio button correspondiente
    const usuarioTipo = localStorage.getItem('usuarioTipo');
    if (usuarioTipo === 'Empleado') {
        document.getElementById('usuarioEmpleado').checked = true;
    } else if (usuarioTipo === 'Cliente') {
        document.getElementById('usuarioCliente').checked = true;
    } else {
        document.getElementById('usuarioNoLogueado').checked = true;
    }
    
    // Actualizar la UI según el estado de inicio de sesión
    actualizarUI();
    
    // Obtener el formulario de login
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener los valores del formulario
            const nombre = document.getElementById('loginNombre')?.value?.trim() || '';
            const apellido = document.getElementById('loginApellido')?.value?.trim() || '';
            const email = document.getElementById('loginEmail')?.value?.trim() || '';
            
            // Validación mejorada
            if (!validarFormularioLogin(nombre, apellido, email)) {
                return;
            }
            
            // Obtener el dominio del correo y verificar tipo de usuario
            const dominio = obtenerDominioEmail(email);
            console.log("Dominio del correo: " + dominio);
            const esEmpleado = dominio.toLowerCase() === 'carexpress.com';
            
            // Mostrar indicador de carga
            const btnSubmit = loginForm.querySelector('button[type="submit"]');
            const textoOriginal = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';
            btnSubmit.disabled = true;
            
            // Iniciar proceso de autenticación
            autenticarUsuario(nombre, apellido, email, esEmpleado, btnSubmit, textoOriginal);
        });
    }
    
    // Obtener el formulario de registro
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar el formulario con Bootstrap
            if (!registerForm.checkValidity()) {
                e.stopPropagation();
                registerForm.classList.add('was-validated');
                return;
            }
            
            // Obtener valores del formulario
            const nombre = document.getElementById('nombres')?.value?.trim() || '';
            const apellido = document.getElementById('apellidos')?.value?.trim() || '';
            const telefono = document.getElementById('telefono')?.value?.trim() || '';
            const email = document.getElementById('email')?.value?.trim() || '';
            
            // Mostrar indicador de carga
            const btnSubmit = registerForm.querySelector('button[type="submit"]');
            const textoOriginal = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Procesando...';
            btnSubmit.disabled = true;
            
            // Verificar que el email no exista ya
            existeCliente(null, null, email, function(existe) {
                if (existe) {
                    // Email ya registrado
                    mostrarAlerta('Este correo electrónico ya está registrado', 'error');
                    resetearBoton(btnSubmit, textoOriginal);
                    return;
                }
                
                // Proceder con el registro
                registrarUsuario(nombre, apellido, telefono, email, btnSubmit, textoOriginal);
            });
        });
    }
    
    // Manejar el cierre de sesión
    const botonesLogout = document.querySelectorAll('#cerrarSesion, .dropdown-item.text-danger');
    botonesLogout.forEach(boton => {
        if (boton) {
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                cerrarSesion();
            });
        }
    });
});

/**
 * Valida el formulario de inicio de sesión
 */
function validarFormularioLogin(nombre, apellido, email) {
    // Validar campos vacíos
    if (!nombre || !apellido || !email) {
        mostrarAlerta('Por favor complete todos los campos', 'error');
        return false;
    }
    
    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarAlerta('Por favor ingrese un correo electrónico válido', 'error');
        return false;
    }
    
    return true;
}

/**
 * Realiza la autenticación del usuario
 */
function autenticarUsuario(nombre, apellido, email, esEmpleado, btnSubmit, textoOriginal) {
    // Usar la función genérica existeUsuario que selecciona la tabla correcta
    existeUsuario(nombre, apellido, email, function(existe, datos) {
        if (existe) {
            // Usuario encontrado, los datos coinciden
            const usuario = datos[0];
            iniciarSesion(usuario, esEmpleado);
        } else {
            // Usuario no encontrado o datos no coinciden
            mostrarAlerta('Los datos ingresados no coinciden con ninguna cuenta', 'error');
            resetearBoton(btnSubmit, textoOriginal);
        }
    });
}

/**
 * Registra un nuevo usuario
 */
function registrarUsuario(nombre, apellido, telefono, email, btnSubmit, textoOriginal) {
    // Determinar a qué controlador enviar según el dominio
    const esEmpleado = email.toLowerCase().endsWith('carexpress.com');
    const controller = esEmpleado ? 'Empleado' : 'Cliente';
    
    // Crear objeto con los datos del usuario
    const datos = new FormData();
    datos.append('nombre', nombre);
    datos.append('apellido', apellido);
    datos.append('telefono', telefono);
    datos.append('email', email);
    
    // Enviar solicitud al servidor
    fetchpost(`/${controller}/GuardarDatos`, "text", datos, function(res) {
        if (res == "1") {
            // Registro exitoso
            mostrarAlerta('Cuenta creada correctamente', 'success');
            
            // Cerrar modal de registro
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (registerModal) {
                registerModal.hide();
            }
            
            // Crear objeto de usuario para iniciar sesión
            const usuario = {
                id: 0, // ID temporal, se actualizará al iniciar sesión
                nombre: nombre,
                apellido: apellido,
                telefono: telefono,
                email: email
            };
            
            // Iniciar sesión automáticamente
            setTimeout(() => {
                iniciarSesion(usuario, esEmpleado);
            }, 1500);
        } else {
            // Error al registrar
            mostrarAlerta('Error al crear la cuenta. Por favor, intente nuevamente.', 'error');
            resetearBoton(btnSubmit, textoOriginal);
        }
    });
}

/**
 * Verifica si existe un cliente con los datos proporcionados
 */
function existeCliente(nombre = null, apellido = null, email = null, callback) {
    // Realizar la consulta con los parámetros disponibles para tener un conjunto inicial
    let url = "Cliente/FiltrarClientes";
    let parametros = [];
    
    // Usar solo un parámetro para la consulta inicial (preferiblemente email por ser más único)
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

/**
 * Inicia sesión con el usuario autenticado
 */
function iniciarSesion(usuario, esEmpleado) {
    // Guardar información de sesión
    localStorage.setItem('usuarioNombre', `${usuario.nombre} ${usuario.apellido || ''}`);
    localStorage.setItem('usuarioId', usuario.id);
    localStorage.setItem('usuarioTipo', esEmpleado ? 'Empleado' : 'Cliente');
    localStorage.setItem('usuarioEmail', usuario.email);
    
    // Marcar el radio button correspondiente
    const radioButton = document.getElementById(esEmpleado ? 'usuarioEmpleado' : 'usuarioCliente');
    if (radioButton) radioButton.checked = true;
    
    // Actualizar UI
    actualizarUI();
    
    // Mostrar mensaje de éxito
    mostrarAlerta(`Inicio de sesión exitoso como ${esEmpleado ? 'Empleado' : 'Cliente'}`, 'success');
    
    // Cerrar el modal
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) {
        loginModal.hide();
    }
    
    // Redirigir según el tipo de usuario
    setTimeout(() => {
        if (esEmpleado) {
            window.location.href = '/Vehiculo/VehiculosEmpleado';
        } else {
            window.location.href = '/Vehiculo/VehiculosUsuario';
        }
    }, 1500);
}

/**
 * Cierra la sesión del usuario actual
 */
function cerrarSesion() {
    // Limpiar localStorage
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioTipo');
    localStorage.removeItem('usuarioEmail');
    
    // Marcar radio button de no logueado
    const radioNoLogueado = document.getElementById('usuarioNoLogueado');
    if (radioNoLogueado) radioNoLogueado.checked = true;
    
    // Actualizar UI
    actualizarUI();
    
    // Mostrar mensaje
    mostrarAlerta('Has cerrado sesión correctamente', 'success');
    
    // Redirigir a la página principal
    setTimeout(() => {
        window.location.href = '/';
    }, 1500);
}

/**
 * Actualiza la interfaz según el estado de inicio de sesión
 */
function actualizarUI() {
    const usuario = localStorage.getItem('usuarioNombre');
    const usuarioTipo = localStorage.getItem('usuarioTipo');
    
    // Actualizar nombre en el menú
    const nombreUsuarioMenu = document.getElementById('nombreUsuarioMenu');
    if (nombreUsuarioMenu) {
        nombreUsuarioMenu.textContent = usuario ? `Hola, ${usuario}` : 'Bienvenido';
    }
    
    // Actualizar visibilidad de elementos según inicio de sesión
    const elementosNoLogueado = document.querySelectorAll('.sesion-no-logueado, .sesion-no-iniciada');
    const elementosLogueado = document.querySelectorAll('.sesion-logueado, .sesion-iniciada');
    
    if (usuario) {
        // Usuario logueado
        elementosNoLogueado.forEach(el => {
            if (el.style) el.style.display = 'none';
        });
        elementosLogueado.forEach(el => {
            if (el.style) el.style.display = 'block';
        });
        
        // Actualizar elementos específicos según el tipo de usuario
        const elementosEmpleado = document.querySelectorAll('.menu-item-empleado');
        const elementosCliente = document.querySelectorAll('.menu-item-cliente');
        
        if (usuarioTipo === 'Empleado') {
            elementosEmpleado.forEach(el => {
                if (el.style) el.style.display = 'block';
            });
            elementosCliente.forEach(el => {
                if (el.style) el.style.display = 'none';
            });
        } else if (usuarioTipo === 'Cliente') {
            elementosEmpleado.forEach(el => {
                if (el.style) el.style.display = 'none';
            });
            elementosCliente.forEach(el => {
                if (el.style) el.style.display = 'block';
            });
        }
        
        // Actualizar icono de usuario en el dropdown
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            const nombreCompleto = usuario.split(' ');
            const iniciales = nombreCompleto.map(n => n[0]).join('').toUpperCase();
            userDropdown.innerHTML = `<span class="user-circle">${iniciales}</span>`;
        }
    } else {
        // Usuario no logueado
        elementosNoLogueado.forEach(el => {
            if (el.style) el.style.display = 'block';
        });
        elementosLogueado.forEach(el => {
            if (el.style) el.style.display = 'none';
        });
        
        // Ocultar elementos específicos de ambos tipos de usuario
        const elementosEmpleado = document.querySelectorAll('.menu-item-empleado');
        const elementosCliente = document.querySelectorAll('.menu-item-cliente');
        
        elementosEmpleado.forEach(el => {
            if (el.style) el.style.display = 'none';
        });
        elementosCliente.forEach(el => {
            if (el.style) el.style.display = 'none';
        });
        
        // Restaurar icono de usuario en el dropdown
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) {
            userDropdown.innerHTML = '<i class="fas fa-user"></i>';
        }
    }
    
    // Actualizar clases para elementos que usan Bootstrap
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(toggler => {
        // Recalcular el estado de los elementos colapsables para evitar problemas de visualización
        if (toggler.getAttribute('aria-expanded') === 'true') {
            const targetId = toggler.getAttribute('data-bs-target');
            const target = document.querySelector(targetId);
            if (target) {
                target.classList.add('show');
            }
        }
    });
}

/**
 * Resetea el estado del botón de submit
 * @param {HTMLElement} btnSubmit - El botón a resetear
 * @param {string} textoOriginal - El texto original del botón
 */
function resetearBoton(btnSubmit, textoOriginal) {
    if (btnSubmit) {
        btnSubmit.innerHTML = textoOriginal;
        btnSubmit.disabled = false;
    }
}

/**
 * Extrae el dominio de una dirección de correo electrónico
 * @param {string} email - La dirección de correo electrónico
 * @returns {string} - El dominio del correo (parte después del @)
 */
function obtenerDominioEmail(email) {
    if (!email || email.indexOf('@') === -1) {
        return '';
    }
    
    return email.split('@')[1];
}

/**
 * Muestra una alerta utilizando SweetAlert2 si está disponible, o alert si no
 * @param {string} mensaje - El mensaje a mostrar
 * @param {string} tipo - El tipo de alerta (success, error, warning, info)
 */
function mostrarAlerta(mensaje, tipo) {
    if (typeof Swal !== 'undefined') {
        // Si SweetAlert2 está disponible
        Swal.fire({
            title: tipo === 'success' ? '¡Éxito!' : 
                  tipo === 'error' ? '¡Error!' : 
                  tipo === 'warning' ? '¡Advertencia!' : 
                  '¡Información!',
            text: mensaje,
            icon: tipo,
            confirmButtonColor: tipo === 'success' ? '#28a745' : 
                               tipo === 'error' ? '#dc3545' : 
                               tipo === 'warning' ? '#ffc107' : 
                               '#17a2b8'
        });
    } else {
        // Fallback a alert normal
        alert(mensaje);
    }
}

/**
 * Verifica si un empleado existe con los criterios proporcionados
 * Similar a existeCliente pero para la tabla de empleados
 */
function existeEmpleado(nombre = null, apellido = null, email = null, callback) {
    // Realizar la consulta con los parámetros disponibles
    let url = "Empleado/FiltrarEmpleados";
    let parametros = [];
    
    if (email) parametros.push(`email=${encodeURIComponent(email)}`);
    else if (nombre) parametros.push(`nombre=${encodeURIComponent(nombre)}`);
    else if (apellido) parametros.push(`apellido=${encodeURIComponent(apellido)}`);
    
    if (parametros.length > 0) {
        url += "?" + parametros.join("&");
    }
    
    // Realizar la consulta
    fetchGet(url, "json", function(data) {
        // Filtrar resultados para que coincidan exactamente con los criterios
        let resultadosFiltrados = [];
        
        if (Array.isArray(data)) {
            resultadosFiltrados = data.filter(empleado => {
                let coincideNombre = nombre === null || empleado.nombre.toLowerCase() === nombre.toLowerCase();
                let coincideApellido = apellido === null || empleado.apellido.toLowerCase() === apellido.toLowerCase();
                let coincideEmail = email === null || empleado.email.toLowerCase() === email.toLowerCase();
                
                return coincideNombre && coincideApellido && coincideEmail;
            });
        }
        
        let existe = resultadosFiltrados.length > 0;
        
        if (typeof callback === 'function') {
            callback(existe, resultadosFiltrados);
        }
    });
}

/**
 * Función genérica que verifica la existencia de un usuario (empleado o cliente)
 * según el dominio del correo
 */
function existeUsuario(nombre, apellido, email, callback) {
    const esEmpleado = email && email.toLowerCase().endsWith('carexpress.com');
    
    if (esEmpleado) {
        existeEmpleado(nombre, apellido, email, callback);
    } else {
        existeCliente(nombre, apellido, email, callback);
    }
}