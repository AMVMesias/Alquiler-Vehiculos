// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

/**
 * Funciones auxiliares
 */

// Función para mostrar/ocultar contraseña
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

/**
 * Inicialización y configuración de componentes
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Configuración del modo oscuro/claro
    // ---------------------------------------
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    function updateTheme(isDark) {
        if (isDark) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('darkMode', 'enabled');
            
            // Actualizar clases de Bootstrap
            document.querySelectorAll('.bg-light').forEach(element => {
                element.classList.remove('bg-light');
                element.classList.add('bg-dark');
            });
            
            document.querySelectorAll('.text-dark').forEach(element => {
                element.classList.remove('text-dark');
                element.classList.add('text-light');
            });
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('darkMode', null);
            
            // Restaurar clases de Bootstrap
            document.querySelectorAll('.bg-dark').forEach(element => {
                element.classList.remove('bg-dark');
                element.classList.add('bg-light');
            });
            
            document.querySelectorAll('.text-light').forEach(element => {
                element.classList.remove('text-light');
                element.classList.add('text-dark');
            });
        }
    }
    
    // Verificar preferencia guardada
    if (darkModeToggle) {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'enabled') {
            darkModeToggle.checked = true;
            updateTheme(true);
        }
        
        // Escuchar cambios en el toggle
        darkModeToggle.addEventListener('change', function() {
            updateTheme(this.checked);
        });
    }
    
    // 2. Manejo de modales
    // -------------------
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    // Limpiar formularios al cerrar modales
    if (loginModal) {
        loginModal.addEventListener('hidden.bs.modal', function() {
            const form = this.querySelector('form');
            if (form) {
                form.reset();
                form.classList.remove('was-validated');
            }
            
            // Asegurar que el backdrop se elimine
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            
            // Quitar la clase modal-open del body
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
        });
    }
    
    if (registerModal) {
        registerModal.addEventListener('hidden.bs.modal', function() {
            const form = this.querySelector('form');
            if (form) {
                form.reset();
                form.classList.remove('was-validated');
            }
            
            // Asegurar que el backdrop se elimine
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
            
            // Quitar la clase modal-open del body
            document.body.classList.remove('modal-open');
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
        });
    }
    
    // Transición de login a registro
    document.querySelectorAll('.modal a[data-bs-target="#registerModal"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) {
                loginModal.hide();
                loginModal._element.addEventListener('hidden.bs.modal', function handler() {
                    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
                    registerModal.show();
                    loginModal._element.removeEventListener('hidden.bs.modal', handler);
                });
            }
        });
    });
    
    // Transición de registro a login
    document.querySelectorAll('.modal a[data-bs-target="#loginModal"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (registerModal) {
                registerModal.hide();
                registerModal._element.addEventListener('hidden.bs.modal', function handler() {
                    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                    loginModal.show();
                    registerModal._element.removeEventListener('hidden.bs.modal', handler);
                });
            }
        });
    });
});
