using System;

namespace CapaEntidad
{
    public class VehiculoCLS
    {
        public int Id { get; set; }
        public string Marca { get; set; }
        public string Modelo { get; set; }
        public int Año { get; set; }
        public decimal Precio { get; set; }
        public string Estado { get; set; }
        public bool Habilitado { get; set; }
    }
}