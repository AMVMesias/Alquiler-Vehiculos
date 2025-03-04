using CapaEntidad;
using CapaNegocio;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Alquiler.Controllers
{
    public class ReservaController : Controller
    {
        private readonly ReservaBL reservaBL = new ReservaBL();
        private readonly ClienteBL clienteBL = new ClienteBL();
        private readonly VehiculoBL vehiculoBL = new VehiculoBL();

        public IActionResult Reserva()
        {
            return View();
        }

        // Listar todas las reservas
        public List<ReservaCLS> ListarReservas()
        {
            return reservaBL.ListarReservas();
        }

        // Filtrar reservas por varios criterios
        public List<ReservaCLS> FiltrarReservas(int? clienteId, int? vehiculoId, DateTime? fechaInicio, DateTime? fechaFin, string estado)
        {
            return reservaBL.FiltrarReservas(clienteId, vehiculoId, fechaInicio, fechaFin, estado);
        }

        // Verificar disponibilidad de vehículo
        public bool VerificarDisponibilidad(int vehiculoId, DateTime fechaInicio, DateTime fechaFin, int? reservaId = null)
        {
            return reservaBL.VerificarDisponibilidadVehiculo(vehiculoId, fechaInicio, fechaFin, reservaId);
        }

        // Guardar o actualizar una reserva
        public int GuardarDatos(ReservaCLS reserva)
        {
            return reservaBL.GuardarDatosReserva(reserva);
        }

        // Eliminar una reserva (lógicamente)
        public string EliminarReserva(int id)
        {
            int rpta = reservaBL.EliminarReserva(id);
            return rpta.ToString();
        }

        // Obtener una reserva específica por ID
        public ReservaCLS RecuperarReserva(int idReserva)
        {
            return reservaBL.ObtenerReservaPorId(idReserva);
        }

        // Obtener reservas de un cliente específico
        public List<ReservaCLS> ReservasPorCliente(int clienteId)
        {
            return reservaBL.ListarReservasPorCliente(clienteId);
        }

        // Obtener reservas de un vehículo específico
        public List<ReservaCLS> ReservasPorVehiculo(int vehiculoId)
        {
            return reservaBL.ListarReservasPorVehiculo(vehiculoId);
        }

        // Obtener lista de estados de reserva
        public List<string> ListarEstadosReserva()
        {
            return reservaBL.ObtenerEstadosReserva();
        }

        // Vistas para operaciones CRUD
        public IActionResult Create()
        {
            // Cargar listas desplegables para clientes y vehículos
            ViewBag.Clientes = clienteBL.ListarClientes();
            ViewBag.Vehiculos = vehiculoBL.ListarVehiculos();
            ViewBag.Estados = reservaBL.ObtenerEstadosReserva();
            return View();
        }

        public IActionResult Edit(int id)
        {
            ViewBag.Id = id;
            ViewBag.Clientes = clienteBL.ListarClientes();
            ViewBag.Vehiculos = vehiculoBL.ListarVehiculos();
            ViewBag.Estados = reservaBL.ObtenerEstadosReserva();
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

        // Vista calendario de reservas
        public IActionResult Calendario()
        {
            return View();
        }

        // Vista para mostrar disponibilidad de vehículos
        public IActionResult Disponibilidad()
        {
            ViewBag.Vehiculos = vehiculoBL.ListarVehiculos();
            return View();
        }
    }
}