using System;

namespace CapaEntidad
{
    public class EmpleadoCLS
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Cargo { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public bool Habilitado { get; set; }
        public string Path { get; set; }
        public string Descripcion { get; set; }
    }
}