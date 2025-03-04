using System;

namespace CapaEntidad
{
    public class ReservaCLS
    {
        public int Id { get; set; }
        public int ClienteId { get; set; }
        public int VehiculoId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public string Estado { get; set; }
        public bool Habilitado { get; set; }
        public string Path { get; set; }
        public string Descripcion { get; set; }

        // Propiedades de navegación (información relacionada)
        public string NombreCliente { get; set; }
        public string MarcaModeloVehiculo { get; set; }

        // Propiedades calculadas
        public int DiasReservados
        {
            get
            {
                return (FechaFin - FechaInicio).Days + 1;
            }
        }
    }
}