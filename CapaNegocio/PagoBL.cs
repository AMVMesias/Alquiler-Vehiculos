using CapaDatos;
using CapaEntidad;
using System;
using System.Collections.Generic;

namespace CapaNegocio
{
    public class PagoBL
    {
        private PagoDAL pagoDAL = new PagoDAL();

        public List<PagoCLS> ListarPagos()
        {
            return pagoDAL.ListarPagos();
        }

        public List<PagoCLS> FiltrarPagos(int? reservaId, int? clienteId, string metodoPago, DateTime? fechaDesde, DateTime? fechaHasta)
        {
            return pagoDAL.FiltrarPagos(reservaId, clienteId, metodoPago, fechaDesde, fechaHasta);
        }

        public int GuardarDatosPago(PagoCLS objPago)
        {
            return pagoDAL.GuardarDatosPago(objPago);
        }

        public int EliminarPago(int id)
        {
            return pagoDAL.EliminarPago(id);
        }

        public PagoCLS ObtenerPagoPorId(int id)
        {
            return pagoDAL.ObtenerPagoPorId(id);
        }

        public List<PagoCLS> ObtenerPagosPorReserva(int reservaId)
        {
            return pagoDAL.ObtenerPagosPorReserva(reservaId);
        }

        public decimal ObtenerTotalPagadoPorReserva(int reservaId)
        {
            return pagoDAL.ObtenerTotalPagadoPorReserva(reservaId);
        }

        public List<string> ObtenerMetodosPago()
        {
            // Lista predefinida de métodos de pago comunes
            return new List<string> {
                "Efectivo",
                "Tarjeta de Crédito",
                "Tarjeta de Débito",
                "Transferencia Bancaria",
                "PayPal",
                "Cheque",
                "Otro"
            };
        }

        // Método para verificar si una reserva ya está pagada completamente
        public bool VerificarPagoCompleto(int reservaId, decimal montoTotal)
        {
            decimal totalPagado = ObtenerTotalPagadoPorReserva(reservaId);
            return totalPagado >= montoTotal;
        }
    }
}