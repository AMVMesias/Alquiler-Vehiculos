﻿// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    // Función para actualizar colores
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
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        darkModeToggle.checked = true;
        updateTheme(true);
    }
    
    // Escuchar cambios en el toggle
    darkModeToggle.addEventListener('change', function() {
        updateTheme(this.checked);
    });
});
