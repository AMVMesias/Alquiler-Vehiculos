using CapaDatos;
using CapaEntidad;
using System;
using System.Collections.Generic;

namespace CapaNegocio
{
    public class SeguroBL
    {
        private SeguroDAL seguroDAL = new SeguroDAL();

        public List<SeguroCLS> ListarSeguros()
        {
            return seguroDAL.ListarSeguros();
        }

        public List<SeguroCLS> FiltrarSeguros(int? reservaId, int? clienteId, string tipoSeguro)
        {
            return seguroDAL.FiltrarSeguros(reservaId, clienteId, tipoSeguro);
        }

        public int GuardarDatosSeguro(SeguroCLS objSeguro)
        {
            return seguroDAL.GuardarDatosSeguro(objSeguro);
        }

        public int EliminarSeguro(int id)
        {
            return seguroDAL.EliminarSeguro(id);
        }

        public SeguroCLS ObtenerSeguroPorId(int id)
        {
            return seguroDAL.ObtenerSeguroPorId(id);
        }

        public List<SeguroCLS> ObtenerSegurosPorReserva(int reservaId)
        {
            return seguroDAL.ObtenerSegurosPorReserva(reservaId);
        }

        public decimal ObtenerTotalCostoSegurosPorReserva(int reservaId)
        {
            return seguroDAL.ObtenerTotalCostoSegurosPorReserva(reservaId);
        }

        public List<string> ObtenerTiposSeguros()
        {
            // Lista predefinida de tipos de seguros comunes
            return new List<string> {
                "Cobertura Total",
                "Responsabilidad Civil",
                "Robo y Daños",
                "Protección contra Terceros",
                "Seguro de Viajero",
                "Asistencia en Carretera"
            };
        }

        // Método para calcular el costo total de una reserva incluyendo seguros
    }
}