using CapaEntidad;
using CapaNegocio;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Alquiler.Controllers
{
    public class PagoController : Controller
    {
        private readonly PagoBL pagoBL = new PagoBL();
        private readonly ReservaBL reservaBL = new ReservaBL();

        public IActionResult Pago()
        {
            return View();
        }

        // Listar todos los pagos
        public List<PagoCLS> ListarPagos()
        {
            return pagoBL.ListarPagos();
        }

        // Filtrar pagos por varios criterios
        public List<PagoCLS> FiltrarPagos(int? reservaId, int? clienteId, string metodoPago, DateTime? fechaDesde, DateTime? fechaHasta)
        {
            return pagoBL.FiltrarPagos(reservaId, clienteId, metodoPago, fechaDesde, fechaHasta);
        }

        // Obtener un pago específico por ID
        public PagoCLS RecuperarPago(int idPago)
        {
            return pagoBL.ObtenerPagoPorId(idPago);
        }

        // Guardar o actualizar un pago
        public int GuardarDatos(PagoCLS pago)
        {
            return pagoBL.GuardarDatosPago(pago);
        }

        // Eliminar un pago (lógicamente)
        public string EliminarPago(int id)
        {
            int rpta = pagoBL.EliminarPago(id);
            return rpta.ToString();
        }

        // Obtener pagos de una reserva específica
        public List<PagoCLS> PagosPorReserva(int reservaId)
        {
            return pagoBL.ObtenerPagosPorReserva(reservaId);
        }

        // Obtener total pagado para una reserva
        public decimal TotalPagadoPorReserva(int reservaId)
        {
            return pagoBL.ObtenerTotalPagadoPorReserva(reservaId);
        }

        // Verificar si una reserva está completamente pagada
        //public bool VerificarPagoCompleto(int reservaId)
        //{
        //    ReservaCLS reserva = reservaBL.ObtenerReservaPorId(reservaId);

        //    if (reserva == null)
        //        return false;

        //    // Calcular monto total de la reserva (ejemplo)
        //    int diasReservados = (reserva.FechaFin - reserva.FechaInicio).Days + 1;
        //    decimal montoTotal = diasReservados * reserva.PrecioVehiculo; // Suponiendo que tienes esta propiedad

        //    return pagoBL.VerificarPagoCompleto(reservaId, montoTotal);
        //}

        // Obtener lista de métodos de pago disponibles
        public List<string> ListarMetodosDePago()
        {
            return pagoBL.ObtenerMetodosPago();
        }

        // Vistas para operaciones CRUD
        public IActionResult Create(int? reservaId)
        {
            if (reservaId.HasValue)
            {
                ViewBag.ReservaId = reservaId.Value;
                ViewBag.Reserva = reservaBL.ObtenerReservaPorId(reservaId.Value);
            }

            ViewBag.MetodosPago = pagoBL.ObtenerMetodosPago();
            return View();
        }

        public IActionResult Edit(int id)
        {
            ViewBag.Id = id;
            ViewBag.MetodosPago = pagoBL.ObtenerMetodosPago();
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

        // Vista para pagos por reserva
        public IActionResult PagosPorReservaView(int reservaId)
        {
            ViewBag.ReservaId = reservaId;
            ViewBag.Reserva = reservaBL.ObtenerReservaPorId(reservaId);
            return View();
        }

        // Vista para generar factura/recibo
        public IActionResult Factura(int pagoId)
        {
            ViewBag.Pago = pagoBL.ObtenerPagoPorId(pagoId);
            return View();
        }
    }
}