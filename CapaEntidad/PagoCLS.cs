using System;

namespace CapaEntidad
{
    public class PagoCLS
    {
        public int Id { get; set; }
        public int ReservaId { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; }
        public DateTime FechaPago { get; set; }
        public bool Habilitado { get; set; }
        public string Path { get; set; }
        public string Descripcion { get; set; }

        // Propiedades de navegación para mostrar información relacionada
        public int ClienteId { get; set; }
        public int VehiculoId { get; set; }
        public string NombreCliente { get; set; }
        public string MarcaModeloVehiculo { get; set; }
    }
}