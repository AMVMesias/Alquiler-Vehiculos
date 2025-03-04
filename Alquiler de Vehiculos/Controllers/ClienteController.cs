using CapaEntidad;
using CapaNegocio;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Alquiler.Controllers
{
    public class ClienteController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        // Lista todos los clientes
        public List<ClienteCLS> ListarClientes()
        {
            ClienteBL obj = new ClienteBL();
            return obj.ListarClientes();
        }

        // Filtra clientes por nombre, apellido y/o email
        public List<ClienteCLS> FiltrarClientes(string nombre, string apellido, string email)
        {
            ClienteBL obj = new ClienteBL();
            return obj.FiltrarClientes(nombre, apellido, email);
        }

        // Obtiene un cliente específico por ID
        public ClienteCLS RecuperarCliente(int idCliente)
        {
            ClienteBL obj = new ClienteBL();
            return obj.ObtenerClientePorId(idCliente);
        }

        // Guarda o actualiza un cliente
        public int GuardarDatos(ClienteCLS cliente)
        {
            ClienteBL obj = new ClienteBL();
            return obj.GuardarDatosCliente(cliente);
        }

        // Elimina un cliente (lógicamente)
        public string EliminarCliente(int id)
        {
            ClienteBL obj = new ClienteBL();
            int rpta = obj.EliminarCliente(id);
            return rpta.ToString();
        }

        // Vistas para operaciones CRUD
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
    }
}