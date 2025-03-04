using System;

namespace CapaEntidad
{
    public class SeguroCLS
    {
        public int Id { get; set; }
        public int ReservaId { get; set; }
        public string TipoSeguro { get; set; }
        public decimal Costo { get; set; }
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