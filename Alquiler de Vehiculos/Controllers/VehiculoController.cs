using CapaEntidad;
using CapaNegocio;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Alquiler.Controllers
{
    public class VehiculoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Inicio()
        {
            return View();
        }

        public IActionResult Vehiculos()
        {
            return View();
        }

        // Métodos para devolver datos directamente
        public List<VehiculoCLS> ListarVehiculos()
        {
            VehiculoBL obj = new VehiculoBL();
            return obj.ListarVehiculos();
        }

        public List<VehiculoCLS> FiltrarVehiculos(string marca, string modelo)
        {
            VehiculoBL obj = new VehiculoBL();
            return obj.FiltrarVehiculos(marca, modelo);
        }

        public VehiculoCLS RecuperarVehiculo(int idVehiculo)
        {
            // Supongo que necesitarás implementar este método en tu capa de negocio
            VehiculoBL obj = new VehiculoBL();
            List<VehiculoCLS> lista = obj.ListarVehiculos();
            return lista.Find(v => v.Id == idVehiculo);
        }

        public int GuardarDatos(VehiculoCLS vehiculo)
        {
            VehiculoBL obj = new VehiculoBL();
            return obj.GuardarDatosVehiculo(vehiculo);
        }

        public string EliminarVehiculo(int id)
        {
            VehiculoBL obj = new VehiculoBL();
            int rpta = obj.EliminarVehiculo(id);
            return rpta.ToString();
        }

        // Vistas para operaciones CRUD (sin parámetros)
        public IActionResult Create()
        {
            return View();
        }

        public IActionResult Edit()
        {
            return View();
        }

        public IActionResult Details()
        {
            return View();
        }

        public IActionResult Delete()
        {
            return View();
        }

        // Ejemplos de métodos adicionales útiles
        public List<string> ListarMarcas()
        {
            // Implementar si necesitas un método para obtener solo las marcas distintas
            VehiculoBL obj = new VehiculoBL();
            List<VehiculoCLS> vehiculos = obj.ListarVehiculos();

            // Extraer marcas únicas
            HashSet<string> marcasUnicas = new HashSet<string>();
            foreach (var vehiculo in vehiculos)
            {
                marcasUnicas.Add(vehiculo.Marca);
            }

            return new List<string>(marcasUnicas);
        }

        public string ObtenerVersion()
        {
            return "Versión 1.0";
        }
    }
}