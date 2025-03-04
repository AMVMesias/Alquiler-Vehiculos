using CapaEntidad;
using CapaNegocio;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Alquiler.Controllers
{
    public class EmpleadoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        // Lista todos los empleados
        public List<EmpleadoCLS> ListarEmpleados()
        {
            EmpleadoBL obj = new EmpleadoBL();
            return obj.ListarEmpleados();
        }

        // Filtra empleados por nombre, apellido, cargo y/o email
        public List<EmpleadoCLS> FiltrarEmpleados(string nombre, string apellido, string cargo, string email)
        {
            EmpleadoBL obj = new EmpleadoBL();
            return obj.FiltrarEmpleados(nombre, apellido, cargo, email);
        }

        // Obtiene un empleado específico por ID
        public EmpleadoCLS RecuperarEmpleado(int idEmpleado)
        {
            EmpleadoBL obj = new EmpleadoBL();
            return obj.ObtenerEmpleadoPorId(idEmpleado);
        }

        // Guarda o actualiza un empleado
        public int GuardarDatos(EmpleadoCLS empleado)
        {
            EmpleadoBL obj = new EmpleadoBL();
            return obj.GuardarDatosEmpleado(empleado);
        }

        // Elimina un empleado (lógicamente)
        public string EliminarEmpleado(int id)
        {
            EmpleadoBL obj = new EmpleadoBL();
            int rpta = obj.EliminarEmpleado(id);
            return rpta.ToString();
        }

        // Vistas para operaciones CRUD
        public IActionResult Create()
        {
            return View();
        }

        public IActionResult Edit(int id)
        {
            ViewBag.Id = id;
            return View();
        }

        public IActionResult Details(int id)
        {
            ViewBag.Id = id;
            return View();
        }

        public IActionResult Delete(int id)
        {
            ViewBag.Id = id;
            return View();
        }

        // Métodos adicionales útiles
        public List<string> ListarCargos()
        {
            // Método para obtener solo los cargos distintos
            EmpleadoBL obj = new EmpleadoBL();
            List<EmpleadoCLS> empleados = obj.ListarEmpleados();

            // Extraer cargos únicos
            HashSet<string> cargosUnicos = new HashSet<string>();
            foreach (var empleado in empleados)
            {
                cargosUnicos.Add(empleado.Cargo);
            }

            return new List<string>(cargosUnicos);
        }
    }
}