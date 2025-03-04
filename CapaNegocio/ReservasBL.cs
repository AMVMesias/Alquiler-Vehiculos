using CapaDatos;
using CapaEntidad;
using System;
using System.Collections.Generic;

namespace CapaNegocio
{
    public class ReservaBL
    {
        private ReservaDAL reservaDAL = new ReservaDAL();

        public List<ReservaCLS> ListarReservas()
        {
            return reservaDAL.ListarReservas();
        }

        public List<ReservaCLS> FiltrarReservas(int? clienteId, int? vehiculoId, DateTime? fechaInicio, DateTime? fechaFin, string estado)
        {
            return reservaDAL.FiltrarReservas(clienteId, vehiculoId, fechaInicio, fechaFin, estado);
        }

        public bool VerificarDisponibilidadVehiculo(int vehiculoId, DateTime fechaInicio, DateTime fechaFin, int? reservaId = null)
        {
            return reservaDAL.VerificarDisponibilidadVehiculo(vehiculoId, fechaInicio, fechaFin, reservaId);
        }

        public int GuardarDatosReserva(ReservaCLS objReserva)
        {
            // Verificar disponibilidad antes de guardar
            if (VerificarDisponibilidadVehiculo(objReserva.VehiculoId, objReserva.FechaInicio, objReserva.FechaFin, objReserva.Id > 0 ? objReserva.Id : (int?)null))
            {
                return reservaDAL.GuardarDatosReserva(objReserva);
            }
            else
            {
                // Vehículo no disponible
                return -1;
            }
        }

        public int EliminarReserva(int id)
        {
            return reservaDAL.EliminarReserva(id);
        }

        public ReservaCLS ObtenerReservaPorId(int id)
        {
            return reservaDAL.ObtenerReservaPorId(id);
        }

        public List<ReservaCLS> ListarReservasPorCliente(int clienteId)
        {
            return reservaDAL.ListarReservasPorCliente(clienteId);
        }

        public List<ReservaCLS> ListarReservasPorVehiculo(int vehiculoId)
        {
            return reservaDAL.ListarReservasPorVehiculo(vehiculoId);
        }

        // Métodos adicionales útiles
        public List<string> ObtenerEstadosReserva()
        {
            // Podríamos obtenerlo de la base de datos si fuera necesario
            return new List<string> { "Pendiente", "Confirmada", "Cancelada", "Completada" };
        }


    }
}