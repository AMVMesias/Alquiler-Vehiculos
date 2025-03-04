using CapaEntidad;
using CapaNegocio;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Alquiler.Controllers
{
    public class SeguroController : Controller
    {
        private readonly SeguroBL seguroBL = new SeguroBL();
        private readonly ReservaBL reservaBL = new ReservaBL();

        public IActionResult Index()
        {
            return View();
        }

        // Listar todos los seguros
        public List<SeguroCLS> ListarSeguros()
        {
            return seguroBL.ListarSeguros();
        }

        // Filtrar seguros por varios criterios
        public List<SeguroCLS> FiltrarSeguros(int? reservaId, int? clienteId, string tipoSeguro)
        {
            return seguroBL.FiltrarSeguros(reservaId, clienteId, tipoSeguro);
        }

        // Obtener un seguro específico por ID
        public SeguroCLS RecuperarSeguro(int idSeguro)
        {
            return seguroBL.ObtenerSeguroPorId(idSeguro);
        }

        // Guardar o actualizar un seguro
        public int GuardarDatos(SeguroCLS seguro)
        {
            return seguroBL.GuardarDatosSeguro(seguro);
        }

        // Eliminar un seguro (lógicamente)
        public string EliminarSeguro(int id)
        {
            int rpta = seguroBL.EliminarSeguro(id);
            return rpta.ToString();
        }

        // Obtener seguros de una reserva específica
        public List<SeguroCLS> SegurosPorReserva(int reservaId)
        {
            return seguroBL.ObtenerSegurosPorReserva(reservaId);
        }

        // Obtener el costo total de los seguros para una reserva
        public decimal TotalCostoSegurosPorReserva(int reservaId)
        {
            return seguroBL.ObtenerTotalCostoSegurosPorReserva(reservaId);
        }

        //// Calcular el costo total con seguros
        //public decimal CalcularCostoTotalConSeguros(int reservaId)
        //{
        //    return seguroBL.CalcularCostoTotalConSeguros(reservaId);
        //}

        // Obtener tipos de seguros disponibles
        public List<string> ListarTiposSeguros()
        {
            return seguroBL.ObtenerTiposSeguros();
        }

        // Vistas para operaciones CRUD
        public IActionResult Create(int? reservaId)
        {
            if (reservaId.HasValue)
            {
                ViewBag.ReservaId = reservaId.Value;
                ViewBag.Reserva = reservaBL.ObtenerReservaPorId(reservaId.Value);
            }

            ViewBag.TiposSeguros = seguroBL.ObtenerTiposSeguros();
            return View();
        }

        public IActionResult Edit(int id)
        {
            ViewBag.Id = id;
            ViewBag.TiposSeguros = seguroBL.ObtenerTiposSeguros();
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

        // Vista para seguros por reserva
        public IActionResult SegurosPorReservaView(int reservaId)
        {
            ViewBag.ReservaId = reservaId;
            ViewBag.Reserva = reservaBL.ObtenerReservaPorId(reservaId);
            return View();
        }

        // Vista para cotizar seguros para una reserva
        public IActionResult CotizarSeguros(int reservaId)
        {
            ViewBag.ReservaId = reservaId;
            ViewBag.Reserva = reservaBL.ObtenerReservaPorId(reservaId);
            ViewBag.TiposSeguros = seguroBL.ObtenerTiposSeguros();
            return View();
        }
    }
}