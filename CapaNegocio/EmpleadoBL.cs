using CapaDatos;
using CapaEntidad;
using System;
using System.Collections.Generic;

namespace CapaNegocio
{
    public class EmpleadoBL
    {
        private EmpleadoDAL empleadoDAL = new EmpleadoDAL();

        public List<EmpleadoCLS> ListarEmpleados()
        {
            return empleadoDAL.ListarEmpleados();
        }

        public List<EmpleadoCLS> FiltrarEmpleados(string nombre, string apellido, string cargo, string email)
        {
            return empleadoDAL.FiltrarEmpleados(nombre, apellido, cargo, email);
        }

        public int GuardarDatosEmpleado(EmpleadoCLS objEmpleado)
        {
            return empleadoDAL.GuardarDatosEmpleado(objEmpleado);
        }

        public int EliminarEmpleado(int id)
        {
            return empleadoDAL.EliminarEmpleado(id);
        }

        public EmpleadoCLS ObtenerEmpleadoPorId(int id)
        {
            return empleadoDAL.ObtenerEmpleadoPorId(id);
        }
    }
}